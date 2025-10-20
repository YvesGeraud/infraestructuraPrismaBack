import { Request, Response, NextFunction } from "express";
import inventarioBajaBatchService from "../../services/inventario/dt_inventario_baja_batch.service";
import { crearBajaMasivaSchema } from "../../schemas/inventario/dt_inventario_baja_batch.schema";
import { BaseInventarioBatchController } from "./base-batch.controller";

/**
 * 🎯 CONTROLADOR PARA BAJA MASIVA DE INVENTARIO
 *
 * Maneja las peticiones HTTP para el proceso de baja masiva
 * de artículos de inventario
 */

export class InventarioBajaBatchController extends BaseInventarioBatchController {
  /**
   * 🎯 CREAR BAJA MASIVA
   *
   * Endpoint: POST /api/inventario/baja/batch
   * Content-Type: multipart/form-data
   *
   * Body:
   * - archivo: PDF (archivo binario)
   * - data: JSON stringificado con los datos de la baja
   */
  async crearBajaMasiva(req: Request, res: Response, next: NextFunction) {
    return this.procesarRequest(
      req,
      res,
      next,
      crearBajaMasivaSchema,
      (data, userId, sessionId) =>
        inventarioBajaBatchService.crearBatch(data, userId, sessionId),
      "baja"
    );
  }
}

const inventarioBajaBatchController = new InventarioBajaBatchController();
export default inventarioBajaBatchController;
