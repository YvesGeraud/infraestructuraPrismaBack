/**
 * @fileoverview Utilidades para respuestas HTTP normalizadas
 * Compatible con el patrón establecido en el backend de Sequelize
 * Estructura: { exito, mensaje, datos, meta }
 */

import { Response } from "express";

// ==========================================
// INTERFACES DE RESPUESTA NORMALIZADA
// ==========================================

/**
 * Estructura normalizada de respuesta exitosa
 */
export interface RespuestaNormalizada<T = any> {
  exito: true;
  mensaje: string;
  datos?: T;
  meta: {
    codigoEstado: number;
    fechaHora: string;
    [key: string]: any;
  };
}

/**
 * Estructura normalizada de respuesta de error
 */
export interface RespuestaError {
  exito: false;
  mensaje: string;
  datos: null;
  meta: {
    codigoEstado: number;
    fechaHora: string;
    ruta?: string;
    metodo?: string;
    [key: string]: any;
  };
}

/**
 * Opciones para respuesta exitosa
 */
export interface OpcionesRespuestaExitosa {
  datos?: any;
  mensaje?: string;
  codigoEstado?: number;
  metaAdicional?: Record<string, any>;
}

// ==========================================
// FUNCIONES PRINCIPALES
// ==========================================

/**
 * Enviar respuesta exitosa normalizada
 *
 * @param res - Objeto Response de Express
 * @param opciones - Opciones para la respuesta
 *
 * @example
 * enviarRespuestaExitosa(res, {
 *   datos: unidad,
 *   mensaje: "Unidad creada exitosamente",
 *   codigoEstado: 201
 * });
 */
export function enviarRespuestaExitosa<T = any>(
  res: Response,
  opciones: OpcionesRespuestaExitosa = {}
): void {
  const {
    datos,
    mensaje = "Operación exitosa",
    codigoEstado = 200,
    metaAdicional = {},
  } = opciones;

  const respuesta: RespuestaNormalizada<T> = {
    exito: true,
    mensaje,
    datos,
    meta: {
      codigoEstado,
      fechaHora: new Date().toISOString(),
      ...metaAdicional,
    },
  };

  res.status(codigoEstado).json(respuesta);
}

/**
 * Enviar respuesta de error normalizada
 *
 * @param res - Objeto Response de Express
 * @param mensaje - Mensaje de error
 * @param codigoEstado - Código de estado HTTP
 * @param metaAdicional - Meta información adicional
 *
 * @example
 * enviarRespuestaError(res, "Unidad no encontrada", 404);
 */
export function enviarRespuestaError(
  res: Response,
  mensaje: string = "Error interno del servidor",
  codigoEstado: number = 500,
  metaAdicional: Record<string, any> = {}
): void {
  const respuesta: RespuestaError = {
    exito: false,
    mensaje,
    datos: null,
    meta: {
      codigoEstado,
      fechaHora: new Date().toISOString(),
      ...metaAdicional,
    },
  };

  res.status(codigoEstado).json(respuesta);
}

// ==========================================
// FUNCIONES DE CONVENIENCIA
// ==========================================

/**
 * Respuesta de creación exitosa (201)
 */
export function respuestaCreada<T>(
  res: Response,
  datos: T,
  mensaje: string = "Recurso creado exitosamente"
): void {
  enviarRespuestaExitosa(res, {
    datos,
    mensaje,
    codigoEstado: 201,
  });
}

/**
 * Respuesta de no encontrado (404)
 */
export function respuestaNoEncontrado(
  res: Response,
  mensaje: string = "Recurso no encontrado"
): void {
  enviarRespuestaError(res, mensaje, 404);
}

/**
 * Respuesta de validación errónea (400)
 */
export function respuestaValidacionError(
  res: Response,
  mensaje: string = "Datos de entrada inválidos"
): void {
  enviarRespuestaError(res, mensaje, 400);
}

/**
 * Respuesta de conflicto (409)
 */
export function respuestaConflicto(
  res: Response,
  mensaje: string = "Conflicto con el estado actual del recurso"
): void {
  enviarRespuestaError(res, mensaje, 409);
}

/**
 * Respuesta de no autorizado (401)
 */
export function respuestaNoAutorizado(
  res: Response,
  mensaje: string = "No autorizado"
): void {
  enviarRespuestaError(res, mensaje, 401);
}

/**
 * Respuesta de prohibido (403)
 */
export function respuestaProhibido(
  res: Response,
  mensaje: string = "Acceso prohibido"
): void {
  enviarRespuestaError(res, mensaje, 403);
}

// ==========================================
// WRAPPER PARA MANEJO DE ERRORES ASYNC
// ==========================================

/**
 * Wrapper para manejo automático de errores en controladores async
 * Compatible con el patrón del backend de Sequelize
 *
 * @param fn - Función del controlador
 * @returns Función wrapeada que maneja errores automáticamente
 *
 * @example
 * obtenerUnidad = manejarErrorAsincronoControlador(
 *   async (req: Request, res: Response): Promise<void> => {
 *     // ... lógica del controlador
 *   }
 * );
 */
export function manejarErrorAsincronoControlador(fn: Function) {
  return async (req: any, res: Response, next: any): Promise<void> => {
    try {
      await fn(req, res, next);
    } catch (error) {
      console.error("Error en controlador:", error);

      // Si ya se envió una respuesta, no enviar otra
      if (res.headersSent) {
        return;
      }

      // Manejar tipos específicos de errores
      if (error instanceof Error) {
        if (
          error.message.includes("no encontrada") ||
          error.message.includes("no encontrado")
        ) {
          enviarRespuestaError(res, error.message, 404);
        } else if (
          error.message.includes("ya existe") ||
          error.message.includes("duplicado")
        ) {
          enviarRespuestaError(res, error.message, 409);
        } else if (
          error.message.includes("inválido") ||
          error.message.includes("requerido")
        ) {
          enviarRespuestaError(res, error.message, 400);
        } else {
          enviarRespuestaError(res, "Error interno del servidor", 500);
        }
      } else {
        enviarRespuestaError(res, "Error interno del servidor", 500);
      }
    }
  };
}

// ==========================================
// VALIDADOR DE DATOS CON ZOD
// ==========================================

/**
 * Validar datos usando esquemas Zod
 * Compatible con el patrón del backend de Sequelize
 *
 * @param schema - Esquema Zod para validación
 * @param data - Datos a validar
 * @returns Datos validados
 * @throws Error si la validación falla
 *
 * @example
 * const datosValidados = validarDatos(crearUnidadSchema, req.body);
 */
export function validarDatos<T>(schema: any, data: any): T {
  try {
    return schema.parse(data);
  } catch (error: any) {
    if (error.errors && Array.isArray(error.errors)) {
      const mensajes = error.errors
        .map((err: any) => `${err.path?.join(".")}: ${err.message}`)
        .join(", ");
      throw new Error(`Datos inválidos: ${mensajes}`);
    }
    throw new Error("Datos de entrada inválidos");
  }
}
