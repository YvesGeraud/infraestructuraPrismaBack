import { Request, Response } from "express";
import {
  enviarRespuestaExitosa,
  enviarRespuestaError,
  respuestaCreada,
  respuestaNoEncontrado,
  respuestaConflicto,
  respuestaProhibido,
  respuestaNoAutorizado,
  validarDatos,
} from "../utils/responseUtils";
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
        respuestaNoEncontrado(res, "Recurso no encontrado");
        return;
      }

      enviarRespuestaExitosa(res, {
        datos: resultado,
        mensaje: mensajeExito || "Operación exitosa",
      });
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
      respuestaCreada(
        res,
        resultado,
        mensajeExito || "Recurso creado exitosamente"
      );
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
        error.message.includes("ya existe") ||
        error.message.includes("duplicado")
      ) {
        respuestaConflicto(res, error.message);
        return;
      }

      if (
        error.message.includes("no encontrado") ||
        error.message.includes("not found") ||
        error.message.includes("no encontrada")
      ) {
        respuestaNoEncontrado(res, error.message);
        return;
      }

      if (
        error.message.includes("sin permisos") ||
        error.message.includes("no autorizado") ||
        error.message.includes("prohibido")
      ) {
        respuestaProhibido(res, error.message);
        return;
      }

      if (
        error.message.includes("credenciales") ||
        error.message.includes("contraseña") ||
        error.message.includes("token")
      ) {
        respuestaNoAutorizado(res, error.message);
        return;
      }

      // Error genérico con mensaje
      enviarRespuestaError(res, "Error interno del servidor", 500, {
        detalle: error.message,
        ruta: req.path,
        metodo: req.method,
      });
      return;
    }

    // Error desconocido
    enviarRespuestaError(res, "Error interno del servidor", 500, {
      ruta: req.path,
      metodo: req.method,
    });
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

  /**
   * Wrapper para validar datos con esquemas Zod
   */
  protected validarDatosConEsquema<T>(schema: any, data: any): T {
    return validarDatos<T>(schema, data);
  }

  /**
   * Wrapper para operaciones de eliminación
   */
  protected async manejarEliminacion(
    req: Request,
    res: Response,
    operacion: () => Promise<any>,
    mensajeExito?: string
  ): Promise<void> {
    try {
      await operacion();
      enviarRespuestaExitosa(res, {
        datos: { eliminado: true },
        mensaje: mensajeExito || "Recurso eliminado exitosamente",
      });
    } catch (error) {
      this.manejarError(req, res, error);
    }
  }

  /**
   * Wrapper para operaciones que devuelven listas paginadas
   */
  protected async manejarListaPaginada(
    req: Request,
    res: Response,
    operacion: () => Promise<{ data: any[]; pagination: any }>,
    mensajeExito?: string
  ): Promise<void> {
    try {
      const resultado = await operacion();

      enviarRespuestaExitosa(res, {
        datos: resultado.data,
        mensaje:
          mensajeExito ||
          `Registros obtenidos exitosamente (${resultado.pagination.total} encontrados)`,
        metaAdicional: {
          paginacion: resultado.pagination,
        },
      });
    } catch (error) {
      this.manejarError(req, res, error);
    }
  }

  /**
   * Wrapper para operaciones de actualización
   */
  protected async manejarActualizacion(
    req: Request,
    res: Response,
    operacion: () => Promise<any>,
    mensajeExito?: string
  ): Promise<void> {
    try {
      const resultado = await operacion();

      if (resultado === null || resultado === undefined) {
        respuestaNoEncontrado(res, "Recurso no encontrado para actualizar");
        return;
      }

      enviarRespuestaExitosa(res, {
        datos: resultado,
        mensaje: mensajeExito || "Recurso actualizado exitosamente",
      });
    } catch (error) {
      this.manejarError(req, res, error);
    }
  }
}
