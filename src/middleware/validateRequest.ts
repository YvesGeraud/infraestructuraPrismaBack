import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";

export interface ValidationSchemas {
  body?: z.ZodSchema;
  query?: z.ZodSchema;
  params?: z.ZodSchema;
}

export const validateRequest = (schemas: ValidationSchemas) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validar body si está presente
      if (schemas.body) {
        req.body = await schemas.body.parseAsync(req.body);
      }

      // Validar query parameters si está presente
      if (schemas.query) {
        req.query = (await schemas.query.parseAsync(req.query)) as any;
      }

      // Validar params si está presente
      if (schemas.params) {
        req.params = (await schemas.params.parseAsync(req.params)) as any;
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map((err) => ({
          field: err.path.join("."),
          message: err.message,
          code: err.code,
        }));

        res.status(400).json({
          success: false,
          message: "Datos de entrada inválidos",
          errors,
        });
        return;
      }

      // Para otros tipos de errores
      console.error("Error de validación:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor durante la validación",
      });
    }
  };
};

// Helper específico para validar solo el ID en params
export const validateId = validateRequest({
  //params: require("../schemas/userSchemas").idParamSchema,
});
