/**
 * @fileoverview Servicio para control de folios consecutivos
 * Maneja la generación de folios únicos por sistema y año
 * Usado internamente por servicios batch (no exponer al frontend)
 */

import { PrismaClient } from "@prisma/client";
import logger from "../../config/logger";
import { createError } from "../../middleware/errorHandler";

const prisma = new PrismaClient();

class FoliosControlService {
  /**
   * Genera el siguiente folio para un sistema y año
   * Maneja la concurrencia con transacciones
   *
   * @param sistema - Código del sistema (INV, INFRA, etc.)
   * @param anio - Año (opcional, por defecto año actual)
   * @param userId - ID del usuario que genera el folio
   * @returns Folio formateado (ej: INV-2025-00000007)
   */
  async generarSiguienteFolio(
    sistema: string,
    userId: number,
    anio?: number
  ): Promise<string> {
    const anioActual = anio || new Date().getFullYear();
    const sistemaUpper = sistema.toUpperCase();

    try {
      const resultado = await prisma.$transaction(async (tx) => {
        // Buscar o crear el registro de control
        let control = await tx.ct_folios_control.findUnique({
          where: {
            sistema_anio: {
              sistema: sistemaUpper,
              anio: anioActual,
            },
          },
        });

        if (!control) {
          // Crear nuevo control para este sistema y año
          control = await tx.ct_folios_control.create({
            data: {
              sistema: sistemaUpper,
              anio: anioActual,
              ultimo_folio: 1,
              id_ct_usuario_in: userId,
            },
          });

          logger.info(
            `✨ Nuevo control de folios creado: ${sistemaUpper}-${anioActual} por usuario ${userId}`
          );
        } else {
          // Incrementar el folio
          control = await tx.ct_folios_control.update({
            where: {
              id_ct_folios_control: control.id_ct_folios_control,
            },
            data: {
              ultimo_folio: {
                increment: 1,
              },
              id_ct_usuario_up: userId,
            },
          });
        }

        return control;
      });

      // Formatear el folio: INV-2025-00000007
      const folio = this.formatearFolio(
        resultado.sistema,
        resultado.anio,
        resultado.ultimo_folio
      );

      logger.info(`📋 Folio generado: ${folio} por usuario ${userId}`);
      return folio;
    } catch (error) {
      logger.error("❌ Error al generar folio:", error);
      throw createError("Error al generar folio consecutivo", 500);
    }
  }

  /**
   * Genera múltiples folios consecutivos (para operaciones batch)
   * Optimizado para alta concurrencia
   *
   * @param sistema - Código del sistema
   * @param cantidad - Número de folios a generar
   * @param userId - ID del usuario
   * @param anio - Año (opcional)
   * @returns Array de folios formateados
   */
  async generarFoliosBatch(
    sistema: string,
    cantidad: number,
    userId: number,
    anio?: number
  ): Promise<string[]> {
    const anioActual = anio || new Date().getFullYear();
    const sistemaUpper = sistema.toUpperCase();

    if (cantidad <= 0) {
      throw createError("La cantidad de folios debe ser mayor a 0", 400);
    }

    if (cantidad > 1000) {
      throw createError(
        "No se pueden generar más de 1000 folios en una operación",
        400
      );
    }

    try {
      const resultado = await prisma.$transaction(async (tx) => {
        // Buscar o crear el registro de control
        let control = await tx.ct_folios_control.findUnique({
          where: {
            sistema_anio: {
              sistema: sistemaUpper,
              anio: anioActual,
            },
          },
        });

        const folioInicial = control ? control.ultimo_folio + 1 : 1;

        if (!control) {
          control = await tx.ct_folios_control.create({
            data: {
              sistema: sistemaUpper,
              anio: anioActual,
              ultimo_folio: cantidad,
              id_ct_usuario_in: userId,
            },
          });

          logger.info(
            `✨ Nuevo control de folios creado con ${cantidad} folios: ${sistemaUpper}-${anioActual}`
          );
        } else {
          control = await tx.ct_folios_control.update({
            where: {
              id_ct_folios_control: control.id_ct_folios_control,
            },
            data: {
              ultimo_folio: {
                increment: cantidad,
              },
              id_ct_usuario_up: userId,
            },
          });
        }

        return { control, folioInicial };
      });

      // Generar array de folios
      const folios: string[] = [];
      for (let i = 0; i < cantidad; i++) {
        const numeroFolio = resultado.folioInicial + i;
        const folio = this.formatearFolio(
          resultado.control.sistema,
          resultado.control.anio,
          numeroFolio
        );
        folios.push(folio);
      }

      logger.info(
        `📋 Generados ${cantidad} folios desde ${folios[0]} hasta ${
          folios[folios.length - 1]
        } por usuario ${userId}`
      );

      return folios;
    } catch (error) {
      logger.error("❌ Error al generar folios batch:", error);
      throw createError("Error al generar folios consecutivos", 500);
    }
  }

  /**
   * Obtiene el último folio generado para un sistema y año
   *
   * @param sistema - Código del sistema
   * @param anio - Año (opcional)
   * @returns Folio formateado o null si no existe
   */
  async obtenerUltimoFolio(
    sistema: string,
    anio?: number
  ): Promise<string | null> {
    const anioActual = anio || new Date().getFullYear();
    const sistemaUpper = sistema.toUpperCase();

    const control = await prisma.ct_folios_control.findUnique({
      where: {
        sistema_anio: {
          sistema: sistemaUpper,
          anio: anioActual,
        },
      },
    });

    if (!control || control.ultimo_folio === 0) {
      return null;
    }

    return this.formatearFolio(
      control.sistema,
      control.anio,
      control.ultimo_folio
    );
  }

  /**
   * Obtiene el siguiente número de folio sin generarlo
   * Útil para preview o validación
   *
   * @param sistema - Código del sistema
   * @param anio - Año (opcional)
   * @returns Siguiente folio formateado
   */
  async previewSiguienteFolio(sistema: string, anio?: number): Promise<string> {
    const anioActual = anio || new Date().getFullYear();
    const sistemaUpper = sistema.toUpperCase();

    const control = await prisma.ct_folios_control.findUnique({
      where: {
        sistema_anio: {
          sistema: sistemaUpper,
          anio: anioActual,
        },
      },
    });

    const siguienteNumero = control ? control.ultimo_folio + 1 : 1;

    return this.formatearFolio(sistemaUpper, anioActual, siguienteNumero);
  }

  /**
   * Reinicia los folios de un sistema y año
   * ⚠️ USO ADMINISTRATIVO - Con precaución
   *
   * @param sistema - Código del sistema
   * @param anio - Año
   * @param userId - ID del usuario que realiza la acción
   */
  async reiniciarFolios(
    sistema: string,
    anio: number,
    userId: number
  ): Promise<void> {
    const sistemaUpper = sistema.toUpperCase();

    await prisma.ct_folios_control.updateMany({
      where: {
        sistema: sistemaUpper,
        anio: anio,
      },
      data: {
        ultimo_folio: 0,
        id_ct_usuario_up: userId,
      },
    });

    logger.warn(
      `⚠️ Folios reiniciados para ${sistemaUpper}-${anio} por usuario ${userId}`
    );
  }

  /**
   * Obtiene estadísticas de folios por sistema
   *
   * @returns Array con estadísticas de cada sistema y año
   */
  async obtenerEstadisticas() {
    const estadisticas = await prisma.ct_folios_control.findMany({
      where: {
        estado: true,
      },
      orderBy: [{ sistema: "asc" }, { anio: "desc" }],
    });

    return estadisticas.map((stat) => ({
      id: stat.id_ct_folios_control,
      sistema: stat.sistema,
      anio: stat.anio,
      ultimoFolio: stat.ultimo_folio,
      ultimoFolioFormateado: this.formatearFolio(
        stat.sistema,
        stat.anio,
        stat.ultimo_folio
      ),
      siguienteFolio: this.formatearFolio(
        stat.sistema,
        stat.anio,
        stat.ultimo_folio + 1
      ),
      fechaActualizacion: stat.fecha_up,
    }));
  }

  /**
   * Verifica si existe un control de folios para un sistema y año
   *
   * @param sistema - Código del sistema
   * @param anio - Año (opcional)
   * @returns true si existe, false si no
   */
  async existeControl(sistema: string, anio?: number): Promise<boolean> {
    const anioActual = anio || new Date().getFullYear();
    const sistemaUpper = sistema.toUpperCase();

    const control = await prisma.ct_folios_control.findUnique({
      where: {
        sistema_anio: {
          sistema: sistemaUpper,
          anio: anioActual,
        },
      },
    });

    return control !== null;
  }

  /**
   * Formatea un número de folio con el formato estándar
   * Formato: SISTEMA-AÑO-00000000 (8 dígitos)
   * Ejemplo: INV-2025-00000007
   *
   * @param sistema - Código del sistema
   * @param anio - Año
   * @param numero - Número de folio
   * @returns Folio formateado
   */
  private formatearFolio(
    sistema: string,
    anio: number,
    numero: number
  ): string {
    const numeroFormateado = numero.toString().padStart(8, "0");
    return `${sistema}-${anio}-${numeroFormateado}`;
  }
}

const foliosControlService = new FoliosControlService();
export default foliosControlService;
