/**
 * @fileoverview Controlador Unificado para Operaciones Batch de Inventario
 * Maneja tanto altas como bajas con una sola interfaz
 */

import { Request, Response, NextFunction } from "express";
import { BaseInventarioBatchController } from "./base-batch.controller";
import inventarioBatchUnifiedService from "../../services/inventario/inventario-batch-unified.service";
import { crearAltaMasivaSchema } from "../../schemas/inventario/dt_inventario_alta_batch.schema";
import { crearBajaMasivaSchema } from "../../schemas/inventario/dt_inventario_baja_batch.schema";
import { enviarRespuestaExitosa } from "../../utils/responseUtils";

/**
 * 🎯 CONTROLADOR UNIFICADO PARA BATCH DE INVENTARIO
 *
 * Proporciona endpoints unificados para operaciones batch
 * usando el patrón Strategy
 */
export class InventarioBatchUnifiedController extends BaseInventarioBatchController {
  /**
   * 🚀 CREAR ALTA MASIVA
   */
  async crearAltaMasiva(req: Request, res: Response, next: NextFunction) {
    return this.procesarRequest(
      req,
      res,
      next,
      crearAltaMasivaSchema,
      (data, userId, sessionId) =>
        inventarioBatchUnifiedService.procesarBatch(
          "alta",
          data,
          userId,
          sessionId
        ),
      "alta"
    );
  }

  /**
   * 🚀 CREAR BAJA MASIVA
   */
  async crearBajaMasiva(req: Request, res: Response, next: NextFunction) {
    return this.procesarRequest(
      req,
      res,
      next,
      crearBajaMasivaSchema,
      (data, userId, sessionId) =>
        inventarioBatchUnifiedService.procesarBatch(
          "baja",
          data,
          userId,
          sessionId
        ),
      "baja"
    );
  }

  /**
   * 📊 OBTENER ESTADÍSTICAS
   */
  async obtenerEstadisticas(req: Request, res: Response, next: NextFunction) {
    try {
      const estadisticas =
        await inventarioBatchUnifiedService.obtenerEstadisticas();

      return enviarRespuestaExitosa(res, {
        datos: estadisticas,
        mensaje: "Estadísticas obtenidas exitosamente",
        codigoEstado: 200,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 📋 LISTAR OPERACIONES
   */
  async listarOperaciones(req: Request, res: Response, next: NextFunction) {
    try {
      const pagina = parseInt(req.query.pagina as string) || 1;
      const limite = parseInt(req.query.limite as string) || 10;
      const tipo = req.query.tipo as "alta" | "baja" | undefined;

      const operaciones = await inventarioBatchUnifiedService.listarOperaciones(
        pagina,
        limite,
        tipo
      );

      return enviarRespuestaExitosa(res, {
        datos: operaciones,
        mensaje: "Operaciones obtenidas exitosamente",
        codigoEstado: 200,
      });
    } catch (error) {
      next(error);
    }
  }
}

const inventarioBatchUnifiedController = new InventarioBatchUnifiedController();
export default inventarioBatchUnifiedController;
