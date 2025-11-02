/**
 * @fileoverview Controlador para Batch de Jerarquía de Infraestructura
 * Maneja la creación masiva de relaciones jerárquicas
 */

import { Request, Response, NextFunction } from "express";
import { createError } from "../../middleware/errorHandler";
import { enviarRespuestaExitosa } from "../../utils/responseUtils";
import logger from "../../config/logger";
import rlInfraestructuraJerarquiaBatchService from "../../services/infraestructura/rl_infraestructura_jerarquia_batch.service";
import { crearJerarquiaBatchSchema } from "../../schemas/infraestructura/rl_infraestructura_jerarquia_batch.schema";

/**
 * 🎯 CONTROLADOR PARA BATCH DE JERARQUÍA DE INFRAESTRUCTURA
 *
 * Maneja las peticiones HTTP para el proceso de creación masiva
 * de relaciones jerárquicas de infraestructura
 */
export class RlInfraestructuraJerarquiaBatchController {
  /**
   * 🚀 CREAR BATCH DE JERARQUÍAS
   *
   * Endpoint: POST /api/infraestructura/jerarquia/batch
   * Content-Type: application/json
   *
   * Body:
   * {
   *   "observaciones": "Carga inicial",
   *   "jerarquias": [
   *     {
   *       "id_instancia": 1,
   *       "id_ct_infraestructura_tipo_instancia": 1,
   *       "id_dependencia": null
   *     },
   *     ...
   *   ]
   * }
   */
  async crearBatch(req: Request, res: Response, next: NextFunction) {
    try {
      logger.info("🚀 Iniciando creación de batch de jerarquía");
      logger.info("req.body:", req.body);

      // Validar que el body exista
      if (!req.body) {
        throw createError(
          "Debe enviar los datos en el body de la petición",
          400
        );
      }

      // Validar con Zod
      let datosValidados;
      try {
        datosValidados = crearJerarquiaBatchSchema.parse(req.body);
      } catch (error: any) {
        if (error.name === "ZodError") {
          const errores = (error.errors || []).map((e: any) => ({
            campo: e.path.join("."),
            mensaje: e.message,
          }));
          const err = createError("Errores de validación", 400);
          (err as any).errores = errores;
          return next(err);
        }
        throw error;
      }

      // Obtener datos de autenticación
      const userId = (req as any).user?.id_ct_usuario;
      const sessionId = parseInt((req as any).user?.id_sesion || "0");

      if (!userId) {
        throw createError("Usuario no autenticado", 401);
      }

      logger.info(`Usuario autenticado: ${userId}, Sesión: ${sessionId}`);

      // Ejecutar servicio
      const resultado = await rlInfraestructuraJerarquiaBatchService.crearBatch(
        datosValidados,
        userId,
        sessionId
      );

      // Retornar respuesta
      return enviarRespuestaExitosa(res, {
        datos: resultado.data,
        mensaje: resultado.message,
        codigoEstado: 201,
      });
    } catch (error) {
      logger.error("❌ Error en batch de jerarquía:", error);
      next(error);
    }
  }
}

// Exportar instancia única
const rlInfraestructuraJerarquiaBatchController =
  new RlInfraestructuraJerarquiaBatchController();
export default rlInfraestructuraJerarquiaBatchController;
