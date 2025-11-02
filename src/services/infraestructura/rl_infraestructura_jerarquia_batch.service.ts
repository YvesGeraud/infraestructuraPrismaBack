/**
 * @fileoverview Servicio Batch para rl_infraestructura_jerarquia
 * Permite crear múltiples relaciones jerárquicas de infraestructura en una sola transacción
 */

import { PrismaClient } from "@prisma/client";
import { createError } from "../../middleware/errorHandler";
import logger from "../../config/logger";
import {
  CrearJerarquiaBatchInput,
  JerarquiaItemInput,
} from "../../schemas/infraestructura/rl_infraestructura_jerarquia_batch.schema";
import { ResultadoBatch } from "../inventario/base-batch.service";

const prisma = new PrismaClient();

/**
 * 🎯 SERVICIO BATCH PARA JERARQUÍA DE INFRAESTRUCTURA
 *
 * Crea múltiples registros de rl_infraestructura_jerarquia en una transacción atómica.
 *
 * 📊 ESTRUCTURA:
 * - id_instancia: ID de la instancia específica (ej: ID del jefe de sector)
 * - id_ct_infraestructura_tipo_instancia: Tipo de instancia (ej: 4 = "Jefe de Sector")
 * - id_dependencia: ID de otra entrada en rl_infraestructura_jerarquia (self-reference)
 */
export class RlInfraestructuraJerarquiaBatchService {
  protected prisma = prisma;

  /**
   * 🔍 VALIDAR TIPO DE INSTANCIA
   *
   * Verifica que el tipo de instancia exista y esté activo
   *
   * @param idTipoInstancia - ID del tipo de instancia
   * @param tx - Transacción de Prisma (opcional)
   * @returns Registro del tipo de instancia
   */
  private async validarTipoInstancia(
    idTipoInstancia: number,
    tx?: any
  ): Promise<any> {
    const client = tx || this.prisma;

    const tipoInstancia =
      await client.ct_infraestructura_tipo_instancia.findUnique({
        where: {
          id_ct_infraestructura_tipo_instancia: idTipoInstancia,
          estado: true,
        },
      });

    if (!tipoInstancia) {
      throw createError(
        `El tipo de instancia con ID ${idTipoInstancia} no existe o está inactivo`,
        404
      );
    }

    return tipoInstancia;
  }

  /**
   * 🔍 VALIDAR DEPENDENCIA
   *
   * Verifica que la dependencia exista y esté activa
   *
   * @param idDependencia - ID de la relación jerárquica dependiente
   * @param tx - Transacción de Prisma (opcional)
   * @returns Registro de la dependencia
   */
  private async validarDependencia(
    idDependencia: number | null,
    tx?: any
  ): Promise<any | null> {
    if (idDependencia === null || idDependencia === undefined) {
      return null; // Nivel superior, no tiene dependencia
    }

    const client = tx || this.prisma;

    const dependencia = await client.rl_infraestructura_jerarquia.findUnique({
      where: {
        id_rl_infraestructura_jerarquia: idDependencia,
        estado: true,
      },
    });

    if (!dependencia) {
      throw createError(
        `La dependencia con ID ${idDependencia} no existe o está inactiva`,
        404
      );
    }

    return dependencia;
  }

  /**
   * 🔍 VALIDAR INSTANCIA POR TIPO
   *
   * Verifica que la instancia exista en la tabla correspondiente según su tipo
   *
   * @param idInstancia - ID de la instancia
   * @param idTipoInstancia - ID del tipo de instancia
   * @param tx - Transacción de Prisma (opcional)
   */
  private async validarInstancia(
    idInstancia: number,
    idTipoInstancia: number,
    tx?: any
  ): Promise<void> {
    const client = tx || this.prisma;

    // Obtener el tipo de instancia para saber qué tabla validar
    const tipoInstancia = await this.validarTipoInstancia(idTipoInstancia, tx);

    // Mapeo de tipos de instancia a tablas
    const tablasPorTipo: Record<string, string> = {
      Dirección: "ct_infraestructura_direccion",
      Departamento: "ct_infraestructura_departamento",
      Área: "ct_infraestructura_area",
      "Jefe de sector": "ct_infraestructura_jefe_sector",
      Supervisor: "ct_infraestructura_supervisor",
      Escuela: "ct_infraestructura_escuela",
      Anexo: "ct_infraestructura_anexo",
    };

    const nombreTabla =
      tablasPorTipo[tipoInstancia.nombre] ||
      `ct_infraestructura_${tipoInstancia.nombre.toLowerCase()}`;

    // Verificar que la instancia exista en la tabla correspondiente
    try {
      // @ts-ignore - Prisma dinámico
      const instancia = await client[nombreTabla].findUnique({
        where: {
          [`id_${nombreTabla.replace("ct_infraestructura_", "")}`]: idInstancia,
          estado: true,
        },
      });

      if (!instancia) {
        throw createError(
          `La instancia con ID ${idInstancia} de tipo "${tipoInstancia.nombre}" no existe o está inactiva`,
          404
        );
      }
    } catch (error: any) {
      // Si el error es de Prisma (tabla no encontrada), lanzar error específico
      if (error.code === "P2001" || error.code === "P2025") {
        throw createError(
          `No se pudo validar la instancia. Tipo "${tipoInstancia.nombre}" no tiene tabla correspondiente configurada`,
          500
        );
      }
      // Si es nuestro error personalizado, re-lanzarlo
      if (error.statusCode) {
        throw error;
      }
      // Error desconocido
      throw createError(`Error al validar la instancia: ${error.message}`, 500);
    }
  }

  /**
   * 🚀 CREAR BATCH DE JERARQUÍAS
   *
   * Crea múltiples registros de jerarquía en una transacción atómica
   *
   * @param data - Datos del batch de jerarquía
   * @param userId - ID del usuario que ejecuta la acción
   * @param sessionId - ID de la sesión (para bitácora)
   * @returns Resultado de la operación con los registros creados
   */
  async crearBatch(
    data: CrearJerarquiaBatchInput,
    userId: number,
    sessionId: number
  ): Promise<ResultadoBatch> {
    try {
      logger.info(
        `🚀 Iniciando batch de jerarquía para ${data.jerarquias.length} registros`
      );

      const resultado = await this.prisma.$transaction(
        async (tx) => {
          // 📋 PASO 1: VALIDAR TODOS LOS TIPOS DE INSTANCIA
          logger.info("🔍 Validando tipos de instancia...");

          const tiposUnicos = [
            ...new Set(
              data.jerarquias.map((j) => j.id_ct_infraestructura_tipo_instancia)
            ),
          ];

          for (const idTipo of tiposUnicos) {
            await this.validarTipoInstancia(idTipo, tx);
          }

          logger.info(`✅ ${tiposUnicos.length} tipos de instancia válidos`);

          // 📋 PASO 2: VALIDAR TODAS LAS DEPENDENCIAS
          logger.info("🔍 Validando dependencias...");

          const dependenciasUnicas = [
            ...new Set(
              data.jerarquias
                .map((j) => j.id_dependencia)
                .filter((d) => d !== null && d !== undefined)
            ),
          ];

          for (const idDep of dependenciasUnicas) {
            await this.validarDependencia(idDep, tx);
          }

          logger.info(`✅ ${dependenciasUnicas.length} dependencias válidas`);

          // 📋 PASO 3: VALIDAR TODAS LAS INSTANCIAS
          logger.info("🔍 Validando instancias...");

          for (const jerarquia of data.jerarquias) {
            await this.validarInstancia(
              jerarquia.id_instancia,
              jerarquia.id_ct_infraestructura_tipo_instancia,
              tx
            );
          }

          logger.info(`✅ ${data.jerarquias.length} instancias válidas`);

          // 📋 PASO 4: CREAR TODAS LAS JERARQUÍAS
          logger.info("📝 Creando registros de jerarquía...");

          const jerarquiasCreadas = await Promise.all(
            data.jerarquias.map(async (jerarquia, index) => {
              // Preparar datos, manejando id_dependencia nullable
              const datosCreacion: any = {
                id_instancia: jerarquia.id_instancia,
                id_ct_infraestructura_tipo_instancia:
                  jerarquia.id_ct_infraestructura_tipo_instancia,
                estado: true,
                id_ct_usuario_in: userId,
                fecha_in: new Date(),
              };

              // Solo incluir id_dependencia si no es null
              if (
                jerarquia.id_dependencia !== null &&
                jerarquia.id_dependencia !== undefined
              ) {
                datosCreacion.id_dependencia = jerarquia.id_dependencia;
              }

              const jerarquiaCreada =
                await tx.rl_infraestructura_jerarquia.create({
                  data: datosCreacion,
                  include: {
                    ct_infraestructura_tipo_instancia: true,
                  },
                });

              logger.info(
                `✅ Jerarquía ${index + 1}/${
                  data.jerarquias.length
                } creada: ID ${jerarquiaCreada.id_rl_infraestructura_jerarquia}`
              );

              return jerarquiaCreada;
            })
          );

          logger.info(
            `🎉 ${jerarquiasCreadas.length} jerarquías creadas exitosamente`
          );

          // 📝 PASO 5: REGISTRAR EN BITÁCORA
          // TODO: Implementar registro en bitácora cuando se configure la tabla
          // Por ahora solo loggeamos
          logger.info(
            `📝 Proceso batch completado por usuario ${userId}, sesión ${sessionId}`
          );

          return {
            success: true,
            message: `Se crearon ${jerarquiasCreadas.length} relaciones jerárquicas exitosamente`,
            data: {
              jerarquias: jerarquiasCreadas,
              total: jerarquiasCreadas.length,
              observaciones: data.observaciones || null,
            },
          };
        },
        {
          maxWait: 30000, // 30 segundos máximo de espera
          timeout: 60000, // 60 segundos máximo de ejecución
        }
      );

      return resultado;
    } catch (error: any) {
      logger.error("❌ Error en batch de jerarquía:", error);

      if (error.statusCode) {
        throw error; // Re-lanzar errores de validación
      }

      throw createError(
        `Error al crear batch de jerarquía: ${
          error.message || "Error desconocido"
        }`,
        500
      );
    }
  }
}

// Exportar instancia única
export default new RlInfraestructuraJerarquiaBatchService();
