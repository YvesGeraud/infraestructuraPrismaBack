import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";
import { enviarRespuestaError } from "../utils/responseUtils";

/**
 * Interfaz para esquemas de validación múltiples
 */
export interface EsquemasValidacion {
  body?: z.ZodSchema;
  query?: z.ZodSchema;
  params?: z.ZodSchema;
}

/**
 * Middleware principal de validación - Maneja múltiples esquemas a la vez
 * Recomendado para rutas que necesitan validar múltiples partes de la request
 */
export const validarRequest = (esquemas: EsquemasValidacion) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validar body si está presente
      if (esquemas.body) {
        req.body = await esquemas.body.parseAsync(req.body);
      }

      // Validar query parameters si está presente
      if (esquemas.query) {
        req.query = (await esquemas.query.parseAsync(req.query)) as any;
      }

      // Validar params si está presente
      if (esquemas.params) {
        req.params = (await esquemas.params.parseAsync(req.params)) as any;
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errores = error.issues.map((err) => ({
          campo: err.path.join("."),
          mensaje: err.message,
          codigo: err.code,
        }));

        return enviarRespuestaError(res, "Datos de entrada inválidos", 400, {
          errores: errores,
        });
      }

      // Para otros tipos de errores
      console.error("Error de validación:", error);
      return enviarRespuestaError(
        res,
        "Error interno del servidor durante la validación",
        500
      );
    }
  };
};

/**
 * Middleware para validar solo el body de las requests
 * Útil para endpoints que solo necesitan validar el cuerpo
 */
export const validarBody = (esquema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const datosValidados = esquema.parse(req.body);
      req.body = datosValidados; // Reemplazar con datos validados y transformados
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errores = error.issues.map((err) => ({
          campo: err.path.join("."),
          mensaje: err.message,
          codigo: err.code,
        }));

        return enviarRespuestaError(
          res,
          "Errores de validación en el cuerpo",
          400,
          {
            errores: errores,
          }
        );
      }

      // Error inesperado
      return enviarRespuestaError(res, "Error interno del servidor", 500);
    }
  };
};

/**
 * Middleware para validar query parameters
 * Útil para endpoints con filtros o parámetros de consulta complejos
 */
export const validarQuery = (esquema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const queryValidada = esquema.parse(req.query);
      req.query = queryValidada as any; // Reemplazar con datos validados
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errores = error.issues.map((err) => ({
          campo: err.path.join("."),
          mensaje: err.message,
          codigo: err.code,
        }));

        return enviarRespuestaError(
          res,
          "Parámetros de consulta inválidos",
          400,
          { errores: errores }
        );
      }

      return enviarRespuestaError(res, "Error interno del servidor", 500);
    }
  };
};

/**
 * Middleware para validar path parameters
 * Útil para endpoints con parámetros en la URL como IDs
 */
export const validarParams = (esquema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const parametrosValidados = esquema.parse(req.params);
      req.params = parametrosValidados as any;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errores = error.issues.map((err) => ({
          campo: err.path.join("."),
          mensaje: err.message,
          codigo: err.code,
        }));

        return enviarRespuestaError(res, "Parámetros de ruta inválidos", 400, {
          errores: errores,
        });
      }

      return enviarRespuestaError(res, "Error interno del servidor", 500);
    }
  };
};

/**
 * Helper específico para validar solo el ID en params
 * Esquema común para endpoints que requieren un ID numérico
 */
export const esquemaId = z.object({
  id: z
    .string()
    .regex(/^\d+$/, "El ID debe ser un número válido")
    .transform(Number),
});

/**
 * Middleware preconfigurado para validar ID en params
 */
export const validarId = validarParams(esquemaId);

// Exportaciones para compatibilidad con código existente
export const validateRequest = validarRequest;
export const validateBody = validarBody;
export const validateQuery = validarQuery;
export const validateParams = validarParams;
export const validateId = validarId;
export type ValidationSchemas = EsquemasValidacion;
