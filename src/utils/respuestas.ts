import { Response } from "express";

// ===== TIPOS PARA RESPUESTAS ESTANDARDIZADAS =====

export interface RespuestaExito<T = any> {
  success: true;
  message: string;
  data?: T;
  timestamp?: string;
}

export interface RespuestaError {
  success: false;
  message: string;
  error?: string;
  timestamp?: string;
  path?: string;
  method?: string;
}

// ===== UTILIDADES PARA RESPUESTAS CONSISTENTES =====

export class RespuestaUtil {
  /**
   * Enviar respuesta de éxito
   */
  static exito<T>(
    res: Response,
    data?: T,
    message: string = "Operación exitosa",
    statusCode: number = 200
  ): void {
    const respuesta: RespuestaExito<T> = {
      success: true,
      message,
      timestamp: new Date().toISOString(),
    };

    if (data !== undefined) {
      respuesta.data = data;
    }

    res.status(statusCode).json(respuesta);
  }

  /**
   * Enviar respuesta de error
   */
  static error(
    res: Response,
    message: string = "Error interno del servidor",
    statusCode: number = 500,
    detalleError?: string
  ): void {
    const respuesta: RespuestaError = {
      success: false,
      message,
      timestamp: new Date().toISOString(),
    };

    if (detalleError) {
      respuesta.error = detalleError;
    }

    res.status(statusCode).json(respuesta);
  }

  /**
   * Enviar respuesta de error de validación
   */
  static errorValidacion(
    res: Response,
    message: string = "Datos de entrada inválidos",
    detalleError?: string
  ): void {
    this.error(res, message, 400, detalleError);
  }

  /**
   * Enviar respuesta de no autorizado
   */
  static noAutorizado(res: Response, message: string = "No autorizado"): void {
    this.error(res, message, 401);
  }

  /**
   * Enviar respuesta de prohibido
   */
  static prohibido(res: Response, message: string = "Acceso prohibido"): void {
    this.error(res, message, 403);
  }

  /**
   * Enviar respuesta de no encontrado
   */
  static noEncontrado(
    res: Response,
    message: string = "Recurso no encontrado"
  ): void {
    this.error(res, message, 404);
  }

  /**
   * Enviar respuesta de conflicto
   */
  static conflicto(
    res: Response,
    message: string = "Conflicto con el estado actual del recurso"
  ): void {
    this.error(res, message, 409);
  }

  /**
   * Enviar respuesta de creación exitosa
   */
  static creado<T>(
    res: Response,
    data: T,
    message: string = "Recurso creado exitosamente"
  ): void {
    this.exito(res, data, message, 201);
  }
}
