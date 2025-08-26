import { Request, Response } from "express";
import { RespuestaUtil } from "../utils/respuestas";
import logger from "../config/logger";

export abstract class BaseController {
  /**
   * Wrapper para manejar errores de forma consistente
   */
  protected async manejarOperacion(
    req: Request,
    res: Response,
    operacion: () => Promise<any>,
    mensajeExito?: string
  ): Promise<void> {
    try {
      const resultado = await operacion();

      if (resultado === null || resultado === undefined) {
        RespuestaUtil.noEncontrado(res, "Recurso no encontrado");
        return;
      }

      RespuestaUtil.exito(res, resultado, mensajeExito);
    } catch (error) {
      this.manejarError(req, res, error);
    }
  }

  /**
   * Wrapper para operaciones de creación
   */
  protected async manejarCreacion(
    req: Request,
    res: Response,
    operacion: () => Promise<any>,
    mensajeExito?: string
  ): Promise<void> {
    try {
      const resultado = await operacion();
      RespuestaUtil.creado(res, resultado, mensajeExito);
    } catch (error) {
      this.manejarError(req, res, error);
    }
  }

  /**
   * Manejo centralizado de errores
   */
  private manejarError(req: Request, res: Response, error: unknown): void {
    // Log del error con contexto
    logger.error(`Error en ${req.method} ${req.path}:`, {
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      body: req.body,
      params: req.params,
      query: req.query,
      usuario: req.usuario?.email || "No autenticado",
    });

    if (error instanceof Error) {
      // Manejar errores específicos conocidos
      if (
        error.message.includes("ya está registrado") ||
        error.message.includes("ya existe")
      ) {
        RespuestaUtil.conflicto(res, error.message);
        return;
      }

      if (
        error.message.includes("no encontrado") ||
        error.message.includes("not found")
      ) {
        RespuestaUtil.noEncontrado(res, error.message);
        return;
      }

      if (
        error.message.includes("sin permisos") ||
        error.message.includes("no autorizado")
      ) {
        RespuestaUtil.prohibido(res, error.message);
        return;
      }

      if (
        error.message.includes("credenciales") ||
        error.message.includes("contraseña")
      ) {
        RespuestaUtil.noAutorizado(res, error.message);
        return;
      }

      // Error genérico con mensaje
      RespuestaUtil.error(
        res,
        "Error interno del servidor",
        500,
        error.message
      );
      return;
    }

    // Error desconocido
    RespuestaUtil.error(res, "Error interno del servidor");
  }

  /**
   * Validar que el usuario tenga permisos sobre un recurso
   */
  protected validarPropietarioOAdmin(
    usuarioActual: any,
    idPropietario: number,
    mensaje: string = "No tienes permisos para realizar esta acción"
  ): void {
    if (usuarioActual.role !== "ADMIN" && usuarioActual.id !== idPropietario) {
      throw new Error(mensaje);
    }
  }

  /**
   * Validar que el usuario sea administrador
   */
  protected validarAdmin(
    usuarioActual: any,
    mensaje: string = "Se requieren permisos de administrador"
  ): void {
    if (usuarioActual.role !== "ADMIN") {
      throw new Error(mensaje);
    }
  }

  /**
   * Obtener ID desde parámetros con validación
   */
  protected obtenerIdDeParams(
    req: Request,
    nombreParam: string = "id"
  ): number {
    const id = parseInt(req.params[nombreParam]);

    if (isNaN(id) || id <= 0) {
      throw new Error(`${nombreParam} inválido`);
    }

    return id;
  }
}
