import { PrismaClient } from "@prisma/client";
import { createError } from "../../middleware/errorHandler";
import path from "path";
import fs from "fs/promises";
import { existsSync } from "fs";
import logger from "../../config/logger";
import { fileConfig } from "../../config/env";

/**
 * 🎯 SERVICIO BASE PARA PROCESOS BATCH DE INVENTARIO
 *
 * Clase abstracta que centraliza la lógica común para procesos masivos
 * como Altas, Bajas, Transferencias, etc.
 *
 * 📋 RESPONSABILIDADES COMPARTIDAS:
 * - Gestión de archivos PDF
 * - Validación de catálogos
 * - Creación de relaciones
 * - Registro en bitácora
 * - Manejo de transacciones
 *
 * 🔧 CADA SERVICIO HIJO IMPLEMENTA:
 * - crearBatch() - Lógica específica del proceso
 * - validarDatosEspecificos() - Validaciones particulares
 */

const prisma = new PrismaClient();

export interface ArchivoPdfMetadata {
  nombre_archivo: string;
  nombre_sistema: string;
  ruta_archivo: string;
}

export interface ResultadoBatch<T = any> {
  success: boolean;
  message: string;
  data: T;
}

export abstract class BaseBatchService {
  protected prisma = prisma;

  /**
   * 📄 PROCESAR ARCHIVO PDF
   *
   * Guarda el archivo en el sistema de archivos y retorna los metadatos
   *
   * @param file - Archivo subido (Multer)
   * @param subdirectorio - Subdirectorio dentro de upload/inventario/ (ej: 'altas', 'bajas')
   * @returns Metadatos del archivo
   */
  protected async procesarArchivoPdf(
    file: any, // Archivo de Multer
    subdirectorio: string,
    idAlta?: number
  ): Promise<ArchivoPdfMetadata> {
    try {
      // 🎯 Definir ruta de destino usando configuración del .env
      const uploadDir = path.join(
        fileConfig.uploadPath,
        "inventario",
        subdirectorio
      );

      // 📁 Crear directorio si no existe
      if (!existsSync(uploadDir)) {
        await fs.mkdir(uploadDir, { recursive: true });
      }

      // 🔐 Generar nombres únicos para el archivo
      const extension = path.extname(file.originalname);
      const uuid = require("crypto").randomUUID();

      // Si tenemos ID del alta, usarlo como nombre del archivo
      const nombreSistema = idAlta
        ? `${idAlta}_${uuid}${extension}`
        : `${uuid}${extension}`;

      const rutaCompleta = path.join(uploadDir, nombreSistema);

      // 💾 Mover archivo a la ubicación final
      await fs.writeFile(rutaCompleta, file.buffer);

      logger.info(`📄 Archivo PDF guardado: ${rutaCompleta}`);

      // ✅ Retornar metadatos
      return {
        nombre_archivo: idAlta ? `${idAlta}.pdf` : file.originalname,
        nombre_sistema: nombreSistema,
        ruta_archivo: path.join("inventario", subdirectorio, nombreSistema),
      };
    } catch (error) {
      logger.error("❌ Error al procesar archivo PDF:", error);
      throw createError(
        `Error al guardar el archivo PDF: ${
          error instanceof Error ? error.message : "Error desconocido"
        }`,
        500
      );
    }
  }

  /**
   * 🗑️ ELIMINAR ARCHIVO PDF (en caso de rollback)
   *
   * @param rutaArchivo - Ruta del archivo a eliminar
   */
  public async eliminarArchivoPdf(rutaArchivo: string): Promise<void> {
    try {
      const rutaCompleta = path.join(fileConfig.uploadPath, rutaArchivo);
      if (existsSync(rutaCompleta)) {
        await fs.unlink(rutaCompleta);
        logger.info(`🗑️ Archivo PDF eliminado: ${rutaCompleta}`);
      }
    } catch (error) {
      logger.error("⚠️ Error al eliminar archivo PDF:", error);
      // No lanzamos error aquí, solo loggeamos
    }
  }

  /**
   * 🔍 VALIDAR CATÁLOGO GENÉRICO
   *
   * Valida que un registro de catálogo exista y esté activo
   *
   * @param tabla - Nombre de la tabla del catálogo
   * @param idCampo - Nombre del campo ID
   * @param idValor - Valor del ID a buscar
   * @param tx - Transacción de Prisma (opcional)
   * @returns Registro del catálogo
   */
  protected async validarCatalogo(
    tabla: string,
    idCampo: string,
    idValor: number,
    tx?: any
  ): Promise<any> {
    const client = tx || this.prisma;

    // @ts-ignore - Prisma dinámico
    const registro = await client[tabla].findUnique({
      where: {
        [idCampo]: idValor,
        estado: true,
      },
    });

    if (!registro) {
      throw createError(
        `El registro con ID ${idValor} en ${tabla} no existe o está inactivo`,
        404
      );
    }

    return registro;
  }

  /**
   * 📊 REGISTRAR EN BITÁCORA
   *
   * Registra la acción en la bitácora del sistema
   *
   * @param tabla - Tabla afectada
   * @param accion - Acción realizada (Creación, Actualización, Eliminación)
   * @param idRegistro - ID del registro afectado
   * @param datosAnteriores - Datos antes del cambio (para Actualización/Eliminación)
   * @param datosNuevos - Datos después del cambio (para Creación/Actualización)
   * @param userId - ID del usuario que ejecuta la acción
   * @param sessionId - ID de la sesión
   * @param tx - Transacción de Prisma (opcional)
   */
  protected async registrarBitacora(
    tabla: string,
    accion: "Creación" | "Actualización" | "Eliminación",
    idRegistro: number,
    datosAnteriores: any,
    datosNuevos: any,
    userId: number,
    sessionId: number,
    tx?: any
  ): Promise<void> {
    try {
      const client = tx || this.prisma;

      // Obtener IDs de tabla y acción de bitácora
      const [tablaId, accionId] = await Promise.all([
        client.ct_bitacora_tabla.findFirst({
          where: { nombre: tabla, estado: true },
          select: { id_ct_bitacora_tabla: true },
        }),
        client.ct_bitacora_accion.findFirst({
          where: { nombre: accion, estado: true },
          select: { id_ct_bitacora_accion: true },
        }),
      ]);

      if (!tablaId || !accionId) {
        logger.warn(
          `⚠️ No se encontró configuración de bitácora para ${tabla} - ${accion}`
        );
        return;
      }

      await client.dt_bitacora.create({
        data: {
          id_ct_bitacora_accion: accionId.id_ct_bitacora_accion,
          id_ct_bitacora_tabla: tablaId.id_ct_bitacora_tabla,
          id_registro_afectado: idRegistro,
          id_ct_sesion: sessionId,
          datos_anteriores: JSON.stringify(datosAnteriores || {}),
          datos_nuevos: JSON.stringify(datosNuevos || {}),
          estado: true,
          id_ct_usuario_in: userId,
          fecha_in: new Date(),
        },
      });

      logger.info(
        `📝 Bitácora registrada: ${tabla} - ${accion} - ID: ${idRegistro}`
      );
    } catch (error) {
      logger.error("❌ Error al registrar en bitácora:", error);
      // No lanzamos error para no interrumpir el proceso principal
    }
  }

  /**
   * 🔢 GENERAR FOLIO SECUENCIAL
   *
   * Genera folios secuenciales basados en el último folio del año actual
   * Formato: INV-YYYY-0000001, INV-YYYY-0000002, etc.
   *
   * @param año - Año actual
   * @param tx - Transacción de Prisma
   * @returns Folio secuencial generado
   */
  protected async generarFolioSecuencial(
    año: number,
    tx: any
  ): Promise<string> {
    try {
      // Buscar el último folio del año actual
      const ultimoArticulo = await tx.dt_inventario_articulo.findFirst({
        where: {
          folio: {
            startsWith: `INV-${año}-`,
          },
        },
        orderBy: {
          folio: "desc",
        },
      });

      let siguienteNumero = 1;

      if (ultimoArticulo && ultimoArticulo.folio) {
        // Extraer el número del último folio: INV-2025-0000001 -> 1
        const match = ultimoArticulo.folio.match(/INV-\d{4}-(\d{7})$/);
        if (match) {
          siguienteNumero = parseInt(match[1]) + 1;
        }
      }

      // Generar el folio con padding de 7 dígitos
      return `INV-${año}-${String(siguienteNumero).padStart(7, "0")}`;
    } catch (error) {
      logger.error("❌ Error generando folio secuencial:", error);
      // Fallback: usar timestamp si falla
      const timestamp = Date.now();
      return `INV-${año}-${String(timestamp).slice(-7)}`;
    }
  }

  /**
   * 🔗 CREAR RELACIONES EN BATCH
   *
   * Crea múltiples registros de relación de forma eficiente
   *
   * @param tablaRelacion - Nombre de la tabla de relación
   * @param relaciones - Array de objetos con los datos de cada relación
   * @param userId - ID del usuario que ejecuta la acción
   * @param tx - Transacción de Prisma (requerido)
   */
  protected async crearRelacionesBatch(
    tablaRelacion: string,
    relaciones: any[],
    userId: number,
    tx: any
  ): Promise<any[]> {
    try {
      const relacionesCreadas = await Promise.all(
        relaciones.map(async (relacion) => {
          // @ts-ignore - Prisma dinámico
          return await tx[tablaRelacion].create({
            data: {
              ...relacion,
              estado: true,
              id_ct_usuario_in: userId,
              fecha_in: new Date(),
            },
          });
        })
      );

      logger.info(
        `🔗 ${relacionesCreadas.length} relaciones creadas en ${tablaRelacion}`
      );

      return relacionesCreadas;
    } catch (error) {
      logger.error(`❌ Error al crear relaciones en ${tablaRelacion}:`, error);
      throw createError(
        `Error al crear relaciones: ${
          error instanceof Error ? error.message : "Error desconocido"
        }`,
        500
      );
    }
  }

  /**
   * 📦 CREAR ARTÍCULOS EN BATCH
   *
   * Crea múltiples artículos de inventario de forma eficiente
   *
   * @param articulos - Array de artículos a crear
   * @param userId - ID del usuario que ejecuta la acción
   * @param tx - Transacción de Prisma (requerido)
   * @returns Array de artículos creados
   */
  protected async crearArticulosBatch(
    articulos: any[],
    userId: number,
    tx: any
  ): Promise<any[]> {
    try {
      // 🔢 GENERAR FOLIOS CONSECUTIVOS USANDO EL SERVICIO DE FOLIOS
      // Importar dinámicamente para evitar dependencias circulares
      const { default: foliosControlService } = await import(
        "./ct_folios_control.service"
      );

      // Generar todos los folios de una vez (batch)
      const folios = await foliosControlService.generarFoliosBatch(
        "INV",
        articulos.length,
        userId
      );

      logger.info(
        `📋 Folios generados: ${folios.length} desde ${folios[0]} hasta ${
          folios[folios.length - 1]
        }`
      );

      // 🔄 CREAR ARTÍCULOS CON SUS FOLIOS ASIGNADOS
      const articulosCreados = [];

      for (let index = 0; index < articulos.length; index++) {
        const articulo = articulos[index];
        const folio = folios[index];

        logger.info(
          `📦 Creando artículo ${index + 1}/${
            articulos.length
          } con folio: ${folio}`
        );

        const articuloCreado = await tx.dt_inventario_articulo.create({
          data: {
            // Campos del artículo del frontend
            no_serie: articulo.no_serie,
            modelo: articulo.modelo,
            observaciones: articulo.observaciones || "",

            // Relaciones usando connect
            ct_inventario_tipo_articulo: {
              connect: {
                id_ct_inventario_tipo_articulo:
                  articulo.id_ct_inventario_tipo_articulo,
              },
            },
            ct_inventario_marca: {
              connect: {
                id_ct_inventario_marca: articulo.id_ct_inventario_marca,
              },
            },
            ct_inventario_material: {
              connect: {
                id_ct_inventario_material: articulo.id_ct_inventario_material,
              },
            },
            ct_inventario_color: {
              connect: {
                id_ct_inventario_color: articulo.id_ct_inventario_color,
              },
            },
            ct_inventario_proveedor: {
              connect: {
                id_ct_inventario_proveedor: articulo.id_ct_inventario_proveedor,
              },
            },
            ct_inventario_estado_fisico: {
              connect: {
                id_ct_inventario_estado_fisico:
                  articulo.id_ct_inventario_estado_fisico,
              },
            },
            // ct_inventario_subclase removido - será eliminado del schema de Prisma
            rl_infraestructura_jerarquia: {
              connect: { id_rl_infraestructura_jerarquia: 1 }, // Ubicación por defecto
            },
            folio: folio, // Generado automáticamente
            fecha_registro: new Date(), // Fecha actual
            estado: true, // Activo por defecto
            // Campos del sistema
            id_ct_usuario_in: userId,
            fecha_in: new Date(),
          },
        });

        articulosCreados.push(articuloCreado);
      }

      logger.info(`📦 ${articulosCreados.length} artículos creados`);

      return articulosCreados;
    } catch (error) {
      logger.error("❌ Error al crear artículos:", error);
      throw createError(
        `Error al crear artículos: ${
          error instanceof Error ? error.message : "Error desconocido"
        }`,
        500
      );
    }
  }

  /**
   * 📝 REGISTRAR ARCHIVO EN BASE DE DATOS
   *
   * Crea el registro del archivo en la tabla correspondiente
   *
   * @param tablaArchivo - Nombre de la tabla de archivos
   * @param idRelacion - ID del registro padre
   * @param campoIdRelacion - Nombre del campo de relación
   * @param archivoMetadata - Metadatos del archivo
   * @param userId - ID del usuario que ejecuta la acción
   * @param tx - Transacción de Prisma (requerido)
   */
  protected async registrarArchivo(
    tablaArchivo: string,
    idRelacion: number,
    campoIdRelacion: string,
    archivoMetadata: ArchivoPdfMetadata,
    userId: number,
    tx: any
  ): Promise<any> {
    try {
      // @ts-ignore - Prisma dinámico
      const archivoCreado = await tx[tablaArchivo].create({
        data: {
          [campoIdRelacion]: idRelacion,
          nombre_archivo: archivoMetadata.nombre_archivo,
          nombre_sistema: archivoMetadata.nombre_sistema,
          ruta_archivo: archivoMetadata.ruta_archivo,
          estado: true,
          id_ct_usuario_in: userId,
          fecha_in: new Date(),
        },
      });

      logger.info(`📄 Archivo registrado en ${tablaArchivo}`);

      return archivoCreado;
    } catch (error) {
      logger.error(`❌ Error al registrar archivo en ${tablaArchivo}:`, error);
      throw createError(
        `Error al registrar archivo: ${
          error instanceof Error ? error.message : "Error desconocido"
        }`,
        500
      );
    }
  }

  /**
   * 🔄 MÉTODO ABSTRACTO - CREAR BATCH
   *
   * Cada servicio hijo debe implementar este método con su lógica específica
   *
   * @param data - Datos del proceso batch
   * @param userId - ID del usuario que ejecuta la acción
   * @param sessionId - ID de la sesión (para bitácora)
   */
  abstract crearBatch(
    data: any,
    userId: number,
    sessionId: number
  ): Promise<ResultadoBatch>;
}

/*
🎉 SERVICIO BASE PARA PROCESOS BATCH DE INVENTARIO

✅ Características:
- 🔄 Reutilizable para Alta, Baja, Transferencia, etc.
- 📄 Gestión centralizada de archivos PDF
- 🔍 Validación genérica de catálogos
- 📝 Registro automático en bitácora
- 🔗 Creación de relaciones en batch
- 📦 Creación de artículos en batch
- 🛡️ Manejo robusto de errores
- 📊 Logging completo

🔧 Métodos compartidos:
- procesarArchivoPdf() - Guardar archivo
- eliminarArchivoPdf() - Limpiar en caso de error
- validarCatalogo() - Validar catálogos genéricos
- registrarBitacora() - Auditoría completa
- crearRelacionesBatch() - Relaciones eficientes
- crearArticulosBatch() - Artículos en batch
- registrarArchivo() - Registro de archivos

🎯 Uso:
```typescript
class InventarioAltaBatchService extends BaseBatchService {
  async crearBatch(data, userId, sessionId) {
    // Lógica específica de ALTA
  }
}

class InventarioBajaBatchService extends BaseBatchService {
  async crearBatch(data, userId, sessionId) {
    // Lógica específica de BAJA
  }
}
```
*/
