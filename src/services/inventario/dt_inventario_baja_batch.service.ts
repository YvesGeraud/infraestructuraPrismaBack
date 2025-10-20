import { BaseBatchService, ResultadoBatch } from "./base-batch.service";
import {
  CrearBajaMasivaInput,
  ArticuloBajaInput,
} from "../../schemas/inventario/dt_inventario_baja_batch.schema";
import { createError } from "../../middleware/errorHandler";
import logger from "../../config/logger";

/**
 * 🎯 SERVICIO PARA BAJA MASIVA DE INVENTARIO
 *
 * Extiende BaseBatchService para reutilizar lógica común
 * e implementa la lógica específica para BAJAS de inventario
 *
 * 📋 RESPONSABILIDADES:
 * - Validar que los artículos existan y estén activos
 * - Crear registro de baja (dt_inventario_baja)
 * - Crear relaciones con artículos (rl_inventario_baja_articulo)
 * - Desactivar artículos (estado = false)
 * - Registrar archivo PDF
 * - Registrar en bitácora
 */

interface ArchivoPdfInput {
  nombre_archivo: string;
  nombre_sistema: string;
  ruta_archivo: string;
}

class InventarioBajaBatchService extends BaseBatchService {
  /**
   * 🎯 CREAR BAJA MASIVA
   *
   * Proceso principal que orquesta toda la lógica de baja masiva
   *
   * @param data - Datos validados de la baja
   * @param userId - ID del usuario que ejecuta la acción
   * @param sessionId - ID de la sesión (para bitácora)
   * @returns Resultado del proceso con datos de la baja
   */
  async crearBatch(
    data: CrearBajaMasivaInput,
    userId: number,
    sessionId: number
  ): Promise<ResultadoBatch> {
    try {
      logger.info("🚀 Iniciando proceso de baja masiva...");

      const resultado = await this.prisma.$transaction(async (tx) => {
        // 🔍 1. VALIDAR TIPO DE BAJA
        const catalogoBaja = await this.validarCatalogo(
          "ct_inventario_baja",
          "id_ct_inventario_baja",
          data.id_ct_inventario_baja,
          tx
        );

        logger.info(`✅ Tipo de baja válido: ${catalogoBaja.nombre}`);

        // 🔍 2. VALIDAR QUE TODOS LOS ARTÍCULOS EXISTAN Y ESTÉN ACTIVOS
        const articulosValidados = await this.validarArticulosActivos(
          data.articulos,
          tx
        );

        // 📝 3. CREAR REGISTRO DE BAJA
        const bajaCreada = await tx.dt_inventario_baja.create({
          data: {
            ct_inventario_baja: {
              connect: {
                id_ct_inventario_baja: data.id_ct_inventario_baja,
              },
            },
            observaciones: data.observaciones || null,
            estado: true,
            id_ct_usuario_in: userId,
            fecha_in: new Date(),
          },
        });

        logger.info(
          `📝 Baja creada con ID: ${bajaCreada.id_dt_inventario_baja}`
        );

        // 📝 REGISTRAR BAJA EN BITÁCORA
        await this.registrarBitacora(
          "dt_inventario_baja",
          "Creación",
          bajaCreada.id_dt_inventario_baja,
          null,
          bajaCreada,
          userId,
          sessionId,
          tx
        );

        // 🔗 4. CREAR RELACIONES BAJA-ARTÍCULOS
        const relacionesCreadas = await this.crearRelacionesBajaBatch(
          bajaCreada.id_dt_inventario_baja,
          articulosValidados.map((art) => art.id_dt_inventario_articulo),
          userId,
          tx
        );

        logger.info(`🔗 ${relacionesCreadas.length} relaciones creadas`);

        // ❌ 5. DESACTIVAR ARTÍCULOS (BAJA LÓGICA)
        const articulosDesactivados = await this.desactivarArticulos(
          articulosValidados,
          userId,
          sessionId,
          tx
        );

        logger.info(
          `❌ ${articulosDesactivados.length} artículos desactivados`
        );

        // 📄 6. PROCESAR Y REGISTRAR EL ARCHIVO PDF
        const archivoProcesado = await this.procesarArchivoPdfBaja(
          data.archivo,
          bajaCreada.id_dt_inventario_baja
        );

        const archivoCreado = await this.registrarArchivo(
          "dt_inventario_baja_archivo",
          bajaCreada.id_dt_inventario_baja,
          "id_dt_inventario_baja",
          archivoProcesado,
          userId,
          tx
        );

        // 📝 7. REGISTRAR CADA ARTÍCULO EN BITÁCORA
        for (const articulo of articulosDesactivados) {
          await this.registrarBitacora(
            "dt_inventario_articulo",
            "Actualización",
            articulo.id_dt_inventario_articulo,
            { estado: true }, // Estado anterior
            { estado: false, baja_id: bajaCreada.id_dt_inventario_baja }, // Estado nuevo
            userId,
            sessionId,
            tx
          );
        }

        // ✅ RETORNAR RESULTADO COMPLETO
        return {
          baja: bajaCreada,
          articulos: articulosDesactivados,
          relaciones: relacionesCreadas,
          archivo: archivoCreado,
          resumen: {
            id_baja: bajaCreada.id_dt_inventario_baja,
            total_articulos: articulosDesactivados.length,
            tipo_baja: catalogoBaja.nombre,
            archivo_pdf: data.archivo.originalname,
          },
        };
      });

      logger.info(
        `✅ Baja masiva creada: ${resultado.resumen.total_articulos} artículo(s)`
      );

      return { success: true, data: resultado, message: "Baja masiva creada" };
    } catch (error) {
      logger.error("❌ Error en crearBatch (Baja):", error);
      throw createError(
        `Error al crear baja masiva: ${
          error instanceof Error ? error.message : "Error desconocido"
        }`,
        500
      );
    }
  }

  /**
   * 🔍 VALIDAR QUE ARTÍCULOS EXISTAN Y ESTÉN ACTIVOS
   *
   * @param articulos - Array de artículos con IDs
   * @param tx - Transacción de Prisma
   * @returns Array de artículos validados
   */
  private async validarArticulosActivos(
    articulos: ArticuloBajaInput[],
    tx: any
  ): Promise<any[]> {
    try {
      const articulosValidados = await Promise.all(
        articulos.map(async (articulo) => {
          const articuloEncontrado = await tx.dt_inventario_articulo.findUnique(
            {
              where: {
                id_dt_inventario_articulo: articulo.id_dt_inventario_articulo,
              },
              include: {
                ct_inventario_tipo_articulo: true,
                ct_inventario_marca: true,
                ct_inventario_material: true,
                ct_inventario_color: true,
                ct_inventario_estado_fisico: true,
              },
            }
          );

          if (!articuloEncontrado) {
            throw createError(
              `El artículo con ID ${articulo.id_dt_inventario_articulo} no existe`,
              404
            );
          }

          if (!articuloEncontrado.estado) {
            throw createError(
              `El artículo ${articuloEncontrado.folio} ya está dado de baja`,
              400
            );
          }

          return articuloEncontrado;
        })
      );

      logger.info(`✅ ${articulosValidados.length} artículos validados`);

      return articulosValidados;
    } catch (error) {
      logger.error("❌ Error al validar artículos:", error);
      throw error;
    }
  }

  /**
   * 🔗 CREAR RELACIONES BAJA-ARTÍCULO EN BATCH
   *
   * @param idBaja - ID de la baja
   * @param idsArticulos - Array de IDs de artículos
   * @param userId - ID del usuario
   * @param tx - Transacción de Prisma
   * @returns Array de relaciones creadas
   */
  private async crearRelacionesBajaBatch(
    idBaja: number,
    idsArticulos: number[],
    userId: number,
    tx: any
  ): Promise<any[]> {
    try {
      const relaciones = idsArticulos.map((idArticulo) => ({
        id_dt_inventario_baja: idBaja,
        id_dt_inventario_articulo: idArticulo,
      }));

      return await this.crearRelacionesBatch(
        "rl_inventario_baja_articulo",
        relaciones,
        userId,
        tx
      );
    } catch (error) {
      logger.error("❌ Error al crear relaciones baja-artículo:", error);
      throw error;
    }
  }

  /**
   * ❌ DESACTIVAR ARTÍCULOS (BAJA LÓGICA)
   *
   * Cambia el estado de los artículos a false (inactivo)
   *
   * @param articulos - Array de artículos a desactivar
   * @param userId - ID del usuario
   * @param sessionId - ID de la sesión
   * @param tx - Transacción de Prisma
   * @returns Array de artículos desactivados
   */
  private async desactivarArticulos(
    articulos: any[],
    userId: number,
    sessionId: number,
    tx: any
  ): Promise<any[]> {
    try {
      const articulosDesactivados = await Promise.all(
        articulos.map(async (articulo) => {
          const articuloActualizado = await tx.dt_inventario_articulo.update({
            where: {
              id_dt_inventario_articulo: articulo.id_dt_inventario_articulo,
            },
            data: {
              estado: false, // Desactivar
              id_ct_usuario_up: userId,
              fecha_up: new Date(),
            },
            include: {
              ct_inventario_tipo_articulo: true,
              ct_inventario_marca: true,
              ct_inventario_material: true,
              ct_inventario_color: true,
              ct_inventario_estado_fisico: true,
            },
          });

          return articuloActualizado;
        })
      );

      logger.info(`❌ ${articulosDesactivados.length} artículos desactivados`);

      return articulosDesactivados;
    } catch (error) {
      logger.error("❌ Error al desactivar artículos:", error);
      throw createError(
        `Error al desactivar artículos: ${
          error instanceof Error ? error.message : "Error desconocido"
        }`,
        500
      );
    }
  }

  /**
   * 📄 PROCESAR ARCHIVO PDF PARA BAJA
   *
   * @param file - Archivo de Multer
   * @param idBaja - ID de la baja (opcional)
   * @returns Metadatos del archivo procesado
   */
  async procesarArchivoPdfBaja(
    file: any,
    idBaja?: number
  ): Promise<ArchivoPdfInput> {
    return await this.procesarArchivoPdf(file, "bajas", idBaja);
  }
}

// Exportar instancia única del servicio
export default new InventarioBajaBatchService();

/*
🎉 SERVICIO DE BAJA MASIVA DE INVENTARIO

✅ Características:
- 🔍 Valida que artículos existan y estén activos
- 📝 Crea registro de baja (dt_inventario_baja)
- 🔗 Crea relaciones con artículos
- ❌ Desactiva artículos (estado = false) - BAJA LÓGICA
- 📄 Procesa y guarda archivo PDF
- 📝 Registra en bitácora cada operación
- 🛡️ Transacción atómica (todo o nada)

🔧 Flujo:
1. Validar tipo de baja (catálogo)
2. Validar artículos (existen y están activos)
3. Crear registro de baja
4. Crear relaciones baja-artículos
5. Desactivar artículos
6. Procesar y registrar PDF
7. Registrar todo en bitácora

🎯 Uso:
```typescript
const resultado = await inventarioBajaBatchService.crearBatch(
  {
    id_ct_inventario_baja: 1,
    observaciones: "Artículos dañados",
    articulos: [
      { id_dt_inventario_articulo: 123 },
      { id_dt_inventario_articulo: 124 },
    ],
    archivo: req.file,
  },
  userId,
  sessionId
);
```
*/
