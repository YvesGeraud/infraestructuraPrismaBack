import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";
import { enviarRespuestaError } from "../utils/responseUtils";

// Middleware para validar el body de las requests
export const validateBody = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const validatedData = schema.parse(req.body);
      req.body = validatedData; // Reemplazar con datos validados y transformados
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map((err) => ({
          field: err.path.join("."),
          message: err.message,
          code: err.code,
        }));

        return enviarRespuestaError(res, "Errores de validación", 400, {
          errores: errors,
        });
      }

      // Error inesperado
      return enviarRespuestaError(res, "Error interno del servidor", 500);
    }
  };
};

// Middleware para validar query parameters
export const validateQuery = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const validatedQuery = schema.parse(req.query);
      req.query = validatedQuery as any; // Reemplazar con datos validados
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map((err) => ({
          field: err.path.join("."),
          message: err.message,
          code: err.code,
        }));

        return enviarRespuestaError(
          res,
          "Parámetros de consulta inválidos",
          400,
          { errores: errors }
        );
      }

      return enviarRespuestaError(res, "Error interno del servidor", 500);
    }
  };
};

// Middleware para validar path parameters
export const validateParams = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const validatedParams = schema.parse(req.params);
      req.params = validatedParams as any;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map((err) => ({
          field: err.path.join("."),
          message: err.message,
          code: err.code,
        }));

        return enviarRespuestaError(res, "Parámetros de ruta inválidos", 400, {
          errores: errors,
        });
      }

      return enviarRespuestaError(res, "Error interno del servidor", 500);
    }
  };
};
