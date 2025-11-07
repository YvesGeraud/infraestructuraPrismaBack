/**
 * @fileoverview Controlador Base para Operaciones Batch de Inventario
 * Unifica la lógica común entre alta y baja masiva
 */

import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { createError } from "../../middleware/errorHandler";
import { enviarRespuestaExitosa } from "../../utils/responseUtils";
import logger from "../../config/logger";

/**
 * Controlador Base para Batch de Inventario
 *
 * Proporciona lógica común para:
 * - Validación de archivos
 * - Parsing de JSON
 * - Validación con Zod
 * - Autenticación
 * - Manejo de errores
 */
export abstract class BaseInventarioBatchController {
  /**
   * Procesar Request Batch
   *
   * Lógica común para procesar requests de batch (alta/baja)
   */
  protected async procesarRequest(
    req: Request,
    res: Response,
    next: NextFunction,
    schema: ZodSchema,
    serviceMethod: (
      data: any,
      userId: number,
      sessionId: number
    ) => Promise<any>,
    tipoOperacion: string
  ) {
    try {
      logger.info(`Controlador ${tipoOperacion.toUpperCase()}`);
      logger.info("req.file:", req.file ? "EXISTE" : "NO EXISTE");
      logger.info("req.body:", req.body);
      logger.info("req.body.data:", req.body.data ? "EXISTE" : "NO EXISTE");

      // Validar archivo
      if (!req.file) {
        throw createError("Debe adjuntar un archivo PDF", 400);
      }

      // Validar datos
      if (!req.body.data) {
        throw createError(
          `Debe enviar los datos de ${tipoOperacion} en el campo 'data'`,
          400
        );
      }

      // Parsear JSON
      let datosOperacion;
      try {
        datosOperacion = JSON.parse(req.body.data);
      } catch (error) {
        throw createError("El campo 'data' debe ser un JSON válido", 400);
      }

      // Agregar archivo a los datos
      const datosCompletos = {
        ...datosOperacion,
        archivo: req.file,
      };

      // Validar con Zod
      const datosValidados = schema.parse(datosCompletos);

      // Obtener datos de autenticación
      const userId = (req as any).user?.id_ct_usuario;
      const sessionId = parseInt((req as any).user?.id_sesion);

      if (!userId) {
        throw createError("Usuario no autenticado", 401);
      }

      logger.info(`Usuario autenticado: ${userId}, Sesión: ${sessionId}`);

      // Ejecutar servicio
      const resultado = await serviceMethod(datosValidados, userId, sessionId);

      // Retornar respuesta
      return enviarRespuestaExitosa(res, {
        datos: resultado.data,
        mensaje: `${tipoOperacion} masiva creada exitosamente`,
        codigoEstado: 201,
      });
    } catch (error) {
      // Manejo de errores
      if (error instanceof Error && error.name === "ZodError") {
        const zodError = error as any;
        const errores = (zodError.errors || []).map((e: any) => ({
          campo: e.path.join("."),
          mensaje: e.message,
        }));
        const err = createError("Errores de validación", 400);
        (err as any).errores = errores;
        return next(err);
      }

      logger.error(`Error en ${tipoOperacion}:`, error);
      next(error);
    }
  }
}
