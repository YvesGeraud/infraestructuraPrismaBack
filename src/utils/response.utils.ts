/**
 * @fileoverview Utilidades para construir respuestas estandarizadas
 * Proporciona funciones helper para crear respuestas consistentes
 */

import { Response } from "express";
import {
  RespuestaApi,
  InformacionError,
  CodigosError,
  InformacionPaginacion,
} from "../types/response.types";
import config from "../config";

/**
 * Opciones para construir una respuesta exitosa
 */
interface OpcionesRespuestaExitosa<T> {
  /** Datos a devolver */
  datos?: T;
  /** Mensaje personalizado (opcional) */
  mensaje?: string;
  /** Código de estado HTTP (por defecto 200) */
  codigoEstado?: number;
  /** Información de paginación */
  paginacion?: InformacionPaginacion;
}

/**
 * Opciones para construir una respuesta de error
 */
interface OpcionesRespuestaError {
  /** Código de error interno */
  codigoError?: string;
  /** Mensaje de error personalizado */
  mensaje?: string;
  /** Código de estado HTTP */
  codigoEstado?: number;
  /** Detalles adicionales del error */
  detalles?: any;
  /** Errores de validación */
  erroresValidacion?: Array<{ campo: string; mensaje: string; valor?: any }>;
}

/**
 * Construye y envía una respuesta exitosa estandarizada
 */
export const enviarRespuestaExitosa = <T>(
  res: Response,
  opciones: OpcionesRespuestaExitosa<T> = {}
): void => {
  const {
    datos,
    mensaje = "Operación exitosa",
    codigoEstado = 200,
    paginacion,
  } = opciones;

  const respuesta: RespuestaApi<T> = {
    exito: true,
    mensaje,
    datos,
    meta: {
      codigoEstado,
      fechaHora: new Date().toISOString(),
      ...(paginacion && { paginacion }),
    },
  };

  res.status(codigoEstado).json(respuesta);
};

/**
 * Construye y envía una respuesta de error estandarizada
 */
export const enviarRespuestaError = (
  res: Response,
  opciones: OpcionesRespuestaError = {}
): void => {
  const {
    codigoError = CodigosError.ERROR_INTERNO_SERVIDOR,
    mensaje = "Ha ocurrido un error interno",
    codigoEstado = 500,
    detalles,
    erroresValidacion,
  } = opciones;

  const infoError: InformacionError = {
    codigo: codigoError,
    mensaje,
    ...(config.nodeEnv === "development" && detalles && { detalles }),
    ...(erroresValidacion && { validacion: erroresValidacion }),
  };

  const respuesta: RespuestaApi = {
    exito: false,
    mensaje,
    error: infoError,
    meta: {
      codigoEstado,
      fechaHora: new Date().toISOString(),
    },
  };

  res.status(codigoEstado).json(respuesta);
};

/**
 * Construye una respuesta de recurso creado exitosamente
 */
export const enviarRespuestaCreado = <T>(
  res: Response,
  datos: T,
  mensaje: string = "Recurso creado exitosamente"
): void => {
  enviarRespuestaExitosa(res, {
    datos,
    mensaje,
    codigoEstado: 201,
  });
};

/**
 * Construye una respuesta de recurso no encontrado
 */
export const enviarRespuestaNoEncontrado = (
  res: Response,
  mensaje: string = "Recurso no encontrado"
): void => {
  enviarRespuestaError(res, {
    codigoError: CodigosError.RECURSO_NO_ENCONTRADO,
    mensaje,
    codigoEstado: 404,
  });
};

/**
 * Construye una respuesta de error de validación
 */
export const enviarRespuestaErrorValidacion = (
  res: Response,
  erroresValidacion: Array<{ campo: string; mensaje: string; valor?: any }>,
  mensaje: string = "Error de validación"
): void => {
  enviarRespuestaError(res, {
    codigoError: CodigosError.ERROR_VALIDACION,
    mensaje,
    codigoEstado: 400,
    erroresValidacion,
  });
};

/**
 * Construye una respuesta de error de autenticación
 */
export const enviarRespuestaNoAutorizado = (
  res: Response,
  mensaje: string = "No autorizado"
): void => {
  enviarRespuestaError(res, {
    codigoError: CodigosError.NO_AUTORIZADO,
    mensaje,
    codigoEstado: 401,
  });
};

/**
 * Construye una respuesta de conflicto (recurso ya existe)
 */
export const enviarRespuestaConflicto = (
  res: Response,
  mensaje: string = "El recurso ya existe"
): void => {
  enviarRespuestaError(res, {
    codigoError: CodigosError.RECURSO_YA_EXISTE,
    mensaje,
    codigoEstado: 409,
  });
};

/**
 * Maneja errores de base de datos y devuelve respuesta apropiada
 */
export const manejarErrorBaseDatos = (res: Response, error: any): void => {
  console.error("Error de base de datos:", error);

  // Diferentes tipos de errores de Sequelize
  if (error.name === "SequelizeValidationError") {
    const erroresValidacion = error.errors.map((err: any) => ({
      campo: err.path,
      mensaje: err.message,
      valor: err.value,
    }));

    enviarRespuestaErrorValidacion(
      res,
      erroresValidacion,
      "Error de validación en base de datos"
    );
    return;
  }

  if (error.name === "SequelizeUniqueConstraintError") {
    enviarRespuestaConflicto(res, "Ya existe un registro con estos datos");
    return;
  }

  if (error.name === "SequelizeForeignKeyConstraintError") {
    enviarRespuestaError(res, {
      codigoError: CodigosError.ERROR_VALIDACION,
      mensaje: "Error de referencia: algunos datos relacionados no existen",
      codigoEstado: 400,
    });
    return;
  }

  // Error genérico de base de datos
  enviarRespuestaError(res, {
    codigoError: CodigosError.ERROR_BASE_DATOS,
    mensaje: "Error en la base de datos",
    codigoEstado: 500,
    detalles: config.nodeEnv === "development" ? error : undefined,
  });
};

/**
 * Wrapper para manejo de errores en controladores async
 */
export const manejarErrorAsincrono = (fn: Function) => {
  return (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
      console.error("Error en controlador:", error);
      manejarErrorBaseDatos(res, error);
    });
  };
};

/**
 * Wrapper para manejo de errores en controladores async que solo usan req y res
 * Compatible con interfaces de controlador que no incluyen next
 */
export const manejarErrorAsincronoControlador = (fn: Function) => {
  return async (req: any, res: any): Promise<void> => {
    try {
      await fn(req, res);
    } catch (error: any) {
      console.error("Error en controlador:", error);

      // Verificar si es un error de validación
      if (error.codigoError === "ERROR_VALIDACION" && error.erroresValidacion) {
        enviarRespuestaErrorValidacion(
          res,
          error.erroresValidacion,
          error.message
        );
        return;
      }

      manejarErrorBaseDatos(res, error);
    }
  };
};
