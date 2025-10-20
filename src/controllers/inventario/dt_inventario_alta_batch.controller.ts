import { Request, Response, NextFunction } from "express";
import inventarioAltaBatchService from "../../services/inventario/dt_inventario_alta_batch.service";
import { crearAltaMasivaSchema } from "../../schemas/inventario/dt_inventario_alta_batch.schema";
import { BaseInventarioBatchController } from "./base-batch.controller";

/**
 * 🎯 CONTROLADOR PARA ALTA MASIVA DE INVENTARIO
 *
 * Maneja las peticiones HTTP para el proceso de alta masiva,
 * validando datos y coordinando con el servicio orquestador.
 */

export class InventarioAltaBatchController extends BaseInventarioBatchController {
  /**
   * 🚀 CREAR ALTA MASIVA DE INVENTARIO
   */
  async crearAltaMasiva(req: Request, res: Response, next: NextFunction) {
    return this.procesarRequest(
      req,
      res,
      next,
      crearAltaMasivaSchema,
      (data, userId, sessionId) =>
        inventarioAltaBatchService.crearBatch(data, userId, sessionId),
      "alta"
    );
  }

  /**
   * 📋 OBTENER DETALLE DE ALTA
   */
  async obtenerDetalleAlta(req: Request, res: Response, next: NextFunction) {
    // Implementación temporal - retornar error 501
    return res.status(501).json({
      exito: false,
      mensaje: "Método no implementado aún",
    });
  }

  /**
   * 📋 LISTAR ALTAS
   */
  async listarAltas(req: Request, res: Response, next: NextFunction) {
    // Implementación temporal - retornar error 501
    return res.status(501).json({
      exito: false,
      mensaje: "Método no implementado aún",
    });
  }
}

const inventarioAltaBatchController = new InventarioAltaBatchController();
export default inventarioAltaBatchController;
