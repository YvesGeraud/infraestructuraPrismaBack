/**
 * @fileoverview Middleware de validación usando Zod
 * Proporciona validación automática de datos de entrada en los endpoints
 */

import { Request, Response, NextFunction } from "express";
import { ZodSchema, z, ZodObject } from "zod";
import { enviarRespuestaErrorValidacion } from "../utils/response.utils";

/**
 * Tipos de datos que se pueden validar
 */
type ObjetivoValidacion = "body" | "params" | "query";

/**
 * Opciones para el middleware de validación
 */
interface OpcionesValidacion {
  /** Si fallar en caso de propiedades desconocidas */
  estricto?: boolean;
  /** Si omitir campos vacíos */
  omitirDesconocidos?: boolean;
}

/**
 * Middleware para validar datos de entrada usando Zod
 * @param schema - Schema de Zod para validar
 * @param objetivo - Parte del request a validar (body, params, query)
 * @param opciones - Opciones adicionales de validación
 */
export const validarSchema = (
  schema: ZodSchema,
  objetivo: ObjetivoValidacion = "body",
  opciones: OpcionesValidacion = {}
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const { estricto = false, omitirDesconocidos = true } = opciones;

      // Obtener los datos a validar según el objetivo
      let datosParaValidar: any;
      switch (objetivo) {
        case "body":
          datosParaValidar = req.body;
          break;
        case "params":
          datosParaValidar = req.params;
          break;
        case "query":
          datosParaValidar = req.query;
          break;
        default:
          datosParaValidar = req.body;
      }

      // Para schemas de objetos, aplicar configuraciones
      let schemaFinal = schema;
      if (schema instanceof ZodObject) {
        if (estricto) {
          schemaFinal = schema.strict();
        }
        if (!omitirDesconocidos) {
          schemaFinal = schema.passthrough();
        }
      }

      // Validar los datos
      const resultado = schemaFinal.safeParse(datosParaValidar);

      if (!resultado.success) {
        // Transformar errores de Zod a nuestro formato
        const erroresValidacion = resultado.error.errors.map((error: any) => ({
          campo: error.path.join("."),
          mensaje: error.message,
          valor: error.path.reduce(
            (obj: any, key: any) => obj?.[key],
            datosParaValidar
          ),
        }));

        enviarRespuestaErrorValidacion(res, erroresValidacion);
        return;
      }

      // Asignar los datos validados de vuelta al request
      switch (objetivo) {
        case "body":
          req.body = resultado.data;
          break;
        case "params":
          Object.assign(req.params, resultado.data);
          break;
        case "query":
          // Para query parameters, usamos una propiedad especial para evitar conflictos
          (req as any).validatedQuery = resultado.data;
          break;
      }

      next();
    } catch (error) {
      console.error("Error en validación:", error);
      enviarRespuestaErrorValidacion(res, [
        {
          campo: "general",
          mensaje: "Error interno de validación",
        },
      ]);
    }
  };
};

/**
 * Middleware específico para validar el body del request
 * @param schema - Schema de Zod para validar el body
 * @param opciones - Opciones adicionales de validación
 */
export const validarBody = (
  schema: ZodSchema,
  opciones?: OpcionesValidacion
) => {
  return validarSchema(schema, "body", opciones);
};

/**
 * Middleware específico para validar los parámetros de la URL
 * @param schema - Schema de Zod para validar los parámetros
 * @param opciones - Opciones adicionales de validación
 */
export const validarParametros = (
  schema: ZodSchema,
  opciones?: OpcionesValidacion
) => {
  return validarSchema(schema, "params", opciones);
};

/**
 * Middleware específico para validar los query parameters
 * @param schema - Schema de Zod para validar los query parameters
 * @param opciones - Opciones adicionales de validación
 */
export const validarQuery = (
  schema: ZodSchema,
  opciones?: OpcionesValidacion
) => {
  return validarSchema(schema, "query", opciones);
};

/**
 * Middleware que valida múltiples partes del request a la vez
 * @param schemas - Objeto con los schemas para cada parte del request
 * @param opciones - Opciones adicionales de validación
 */
export const validarMultiple = (
  schemas: {
    body?: ZodSchema;
    params?: ZodSchema;
    query?: ZodSchema;
  },
  opciones?: OpcionesValidacion
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const erroresValidacion: Array<{
      campo: string;
      mensaje: string;
      valor?: any;
    }> = [];

    // Validar body si se proporciona schema
    if (schemas.body) {
      const resultadoBody = schemas.body.safeParse(req.body);
      if (!resultadoBody.success) {
        const erroresBody = resultadoBody.error.errors.map((error: any) => ({
          campo: `body.${error.path.join(".")}`,
          mensaje: error.message,
          valor: error.path.reduce(
            (obj: any, key: any) => obj?.[key],
            req.body
          ),
        }));
        erroresValidacion.push(...erroresBody);
      } else {
        req.body = resultadoBody.data;
      }
    }

    // Validar params si se proporciona schema
    if (schemas.params) {
      const resultadoParams = schemas.params.safeParse(req.params);
      if (!resultadoParams.success) {
        const erroresParams = resultadoParams.error.errors.map(
          (error: any) => ({
            campo: `params.${error.path.join(".")}`,
            mensaje: error.message,
            valor:
              error.path.length > 0
                ? req.params[error.path[0] as string]
                : req.params,
          })
        );
        erroresValidacion.push(...erroresParams);
      } else {
        Object.assign(req.params, resultadoParams.data);
      }
    }

    // Validar query si se proporciona schema
    if (schemas.query) {
      const resultadoQuery = schemas.query.safeParse(req.query);
      if (!resultadoQuery.success) {
        const erroresQuery = resultadoQuery.error.errors.map((error: any) => ({
          campo: `query.${error.path.join(".")}`,
          mensaje: error.message,
          valor: error.path.reduce(
            (obj: any, key: any) => obj?.[key],
            req.query
          ),
        }));
        erroresValidacion.push(...erroresQuery);
      } else {
        (req as any).validatedQuery = resultadoQuery.data;
      }
    }

    // Si hay errores de validación, enviar respuesta de error
    if (erroresValidacion.length > 0) {
      enviarRespuestaErrorValidacion(res, erroresValidacion);
      return;
    }

    next();
  };
};

/**
 * Schema básico para validación de ID en parámetros
 */
export const schemaIdParametro = z.object({
  id: z
    .string()
    .regex(/^\d+$/, "El ID debe ser un número válido")
    .transform((val: string) => parseInt(val, 10))
    .refine((val: number) => val > 0, "El ID debe ser mayor a 0"),
});

/**
 * Schema básico para paginación en query parameters
 */
export const schemaPaginacionQuery = z.object({
  pagina: z
    .string()
    .regex(/^\d+$/, "La página debe ser un número válido")
    .transform((val: string) => parseInt(val, 10))
    .refine((val: number) => val > 0, "La página debe ser mayor a 0")
    .optional()
    .default("1"),
  limite: z
    .string()
    .regex(/^\d+$/, "El límite debe ser un número válido")
    .transform((val: string) => parseInt(val, 10))
    .refine(
      (val: number) => val > 0 && val <= 100,
      "El límite debe estar entre 1 y 100"
    )
    .optional()
    .default("10"),
});

/**
 * Función helper para validar datos directamente con Zod
 * Útil para validar datos dentro de controladores sin middleware
 * @param schema - Schema de Zod para validar
 * @param datos - Datos a validar
 * @returns Datos validados
 * @throws Error si la validación falla
 */
export const validarDatos = <T>(schema: ZodSchema<T>, datos: any): T => {
  const resultado = schema.safeParse(datos);

  if (!resultado.success) {
    const errores = resultado.error.errors.map((error) => ({
      campo: error.path.join("."),
      mensaje: error.message,
      valor: error.path.reduce((obj, key) => obj?.[key], datos),
    }));

    const error = new Error("Error de validación");
    (error as any).erroresValidacion = errores;
    (error as any).codigoError = "ERROR_VALIDACION";
    throw error;
  }

  return resultado.data;
};
