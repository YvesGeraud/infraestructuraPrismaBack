/**
 * @fileoverview Servicio Unificado para Operaciones Batch de Inventario
 * Maneja tanto altas como bajas usando el patrón Strategy
 */

import { PrismaClient } from "@prisma/client";
import { createError } from "../../middleware/errorHandler";
import logger from "../../config/logger";

// Importar servicios específicos
import inventarioAltaBatchService from "./dt_inventario_alta_batch.service";
import inventarioBajaBatchService from "./dt_inventario_baja_batch.service";

// Importar schemas
import { CrearAltaMasivaInput } from "../../schemas/inventario/dt_inventario_alta_batch.schema";
import { CrearBajaMasivaInput } from "../../schemas/inventario/dt_inventario_baja_batch.schema";

const prisma = new PrismaClient();

/**
 * 🎯 SERVICIO UNIFICADO PARA BATCH DE INVENTARIO
 *
 * Proporciona una interfaz unificada para operaciones batch
 * usando el patrón Strategy para manejar diferentes tipos
 */
export class InventarioBatchUnifiedService {
  /**
   * 🚀 PROCESAR BATCH UNIFICADO
   *
   * Método principal que delega a los servicios específicos
   * según el tipo de operación
   *
   * @param tipo - Tipo de operación ('alta' | 'baja')
   * @param data - Datos de la operación
   * @param userId - ID del usuario
   * @param sessionId - ID de la sesión
   * @returns Resultado de la operación
   */
  async procesarBatch(
    tipo: "alta" | "baja",
    data: CrearAltaMasivaInput | CrearBajaMasivaInput,
    userId: number,
    sessionId: number
  ) {
    try {
      logger.info(`🚀 Procesando batch ${tipo.toUpperCase()}...`);

      let resultado;

      switch (tipo) {
        case "alta":
          resultado = await inventarioAltaBatchService.crearBatch(
            data as CrearAltaMasivaInput,
            userId,
            sessionId
          );
          break;

        case "baja":
          resultado = await inventarioBajaBatchService.crearBatch(
            data as CrearBajaMasivaInput,
            userId,
            sessionId
          );
          break;

        default:
          throw createError(`Tipo de operación no válido: ${tipo}`, 400);
      }

      logger.info(`✅ Batch ${tipo.toUpperCase()} procesado exitosamente`);
      return resultado;
    } catch (error) {
      logger.error(`❌ Error procesando batch ${tipo}:`, error);
      throw error;
    }
  }

  /**
   * 📊 OBTENER ESTADÍSTICAS DE BATCH
   *
   * Retorna estadísticas generales de operaciones batch
   */
  async obtenerEstadisticas() {
    try {
      const [totalAltas, totalBajas, altasRecientes, bajasRecientes] =
        await Promise.all([
          prisma.dt_inventario_alta.count(),
          prisma.dt_inventario_baja.count(),
          prisma.dt_inventario_alta.count({
            where: {
              fecha_in: {
                gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Últimos 30 días
              },
            },
          }),
          prisma.dt_inventario_baja.count({
            where: {
              fecha_in: {
                gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Últimos 30 días
              },
            },
          }),
        ]);

      return {
        totalAltas,
        totalBajas,
        altasRecientes,
        bajasRecientes,
        totalOperaciones: totalAltas + totalBajas,
      };
    } catch (error) {
      logger.error("❌ Error obteniendo estadísticas:", error);
      throw createError("Error obteniendo estadísticas", 500);
    }
  }

  /**
   * 📋 LISTAR OPERACIONES BATCH
   *
   * Lista operaciones de alta y baja con paginación
   */
  async listarOperaciones(
    pagina: number = 1,
    limite: number = 10,
    tipo?: "alta" | "baja"
  ) {
    try {
      const offset = (pagina - 1) * limite;

      if (tipo === "alta") {
        return await this.listarAltas(offset, limite);
      } else if (tipo === "baja") {
        return await this.listarBajas(offset, limite);
      } else {
        // Listar ambos tipos
        const [altas, bajas] = await Promise.all([
          this.listarAltas(offset, limite),
          this.listarBajas(offset, limite),
        ]);

        return {
          altas,
          bajas,
          total: altas.total + bajas.total,
        };
      }
    } catch (error) {
      logger.error("❌ Error listando operaciones:", error);
      throw createError("Error listando operaciones", 500);
    }
  }

  /**
   * 📋 LISTAR ALTAS
   */
  private async listarAltas(offset: number, limite: number) {
    const [altas, total] = await Promise.all([
      prisma.dt_inventario_alta.findMany({
        skip: offset,
        take: limite,
        include: {
          ct_inventario_alta: true,
        },
        orderBy: { fecha_in: "desc" },
      }),
      prisma.dt_inventario_alta.count(),
    ]);

    return {
      data: altas,
      total,
      pagina: Math.floor(offset / limite) + 1,
      limite,
    };
  }

  /**
   * 📋 LISTAR BAJAS
   */
  private async listarBajas(offset: number, limite: number) {
    const [bajas, total] = await Promise.all([
      prisma.dt_inventario_baja.findMany({
        skip: offset,
        take: limite,
        include: {
          ct_inventario_baja: true,
        },
        orderBy: { fecha_in: "desc" },
      }),
      prisma.dt_inventario_baja.count(),
    ]);

    return {
      data: bajas,
      total,
      pagina: Math.floor(offset / limite) + 1,
      limite,
    };
  }
}

const inventarioBatchUnifiedService = new InventarioBatchUnifiedService();
export default inventarioBatchUnifiedService;
