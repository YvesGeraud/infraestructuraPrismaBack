import { Request, Response, NextFunction } from "express";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ZodError } from "zod";
import logger from "../config/logger";
import { isDevelopment } from "../config/env";

// Interfaz para errores customizados
export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

// Crear un error customizado
export const createError = (
  message: string,
  statusCode: number = 500,
  isOperational: boolean = true
): AppError => {
  const error: AppError = new Error(message);
  error.statusCode = statusCode;
  error.isOperational = isOperational;
  return error;
};

// Manejar errores de Prisma
const handlePrismaError = (error: PrismaClientKnownRequestError): AppError => {
  switch (error.code) {
    case "P2002":
      // Unique constraint violation
      const target = error.meta?.target as string[] | undefined;
      const field = target?.[0] || "campo";
      return createError(`El ${field} ya está en uso`, 409);

    case "P2025":
      // Record not found
      return createError("Recurso no encontrado", 404);

    case "P2003":
      // Foreign key constraint violation
      return createError(
        "No se puede eliminar, tiene recursos relacionados",
        400
      );

    case "P2014":
      // Invalid ID
      return createError("ID inválido proporcionado", 400);

    default:
      logger.error("Error de Prisma no manejado:", error);
      return createError("Error de base de datos", 500);
  }
};

// Manejar errores de validación Zod
const handleZodError = (error: ZodError): AppError => {
  const errors = error.issues.map((issue) => ({
    field: issue.path.join("."),
    message: issue.message,
  }));

  return createError(
    `Datos inválidos: ${errors.map((e) => e.message).join(", ")}`,
    400
  );
};

// Middleware principal de manejo de errores
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let error: AppError = err as AppError;

  // Log del error
  logger.error(`Error ${req.method} ${req.path}:`, {
    message: err.message,
    stack: err.stack,
    requestId: req.headers["x-request-id"],
    userAgent: req.headers["user-agent"],
    ip: req.ip,
  });

  // Manejar tipos específicos de errores
  if (err instanceof PrismaClientKnownRequestError) {
    error = handlePrismaError(err);
  } else if (err instanceof ZodError) {
    error = handleZodError(err);
  } else if (err.name === "ValidationError") {
    error = createError("Datos de entrada inválidos", 400);
  } else if (err.name === "JsonWebTokenError") {
    error = createError("Token inválido", 401);
  } else if (err.name === "TokenExpiredError") {
    error = createError("Token expirado", 401);
  } else if (err.name === "MulterError") {
    error = createError("Error al subir archivo", 400);
  }

  // Asegurar que tenemos un statusCode
  const statusCode = error.statusCode || 500;

  // Respuesta de error
  const errorResponse: any = {
    success: false,
    message: error.isOperational ? error.message : "Error interno del servidor",
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method,
  };

  // En desarrollo, incluir stack trace
  if (isDevelopment && error.stack) {
    errorResponse.stack = error.stack;
  }

  res.status(statusCode).json(errorResponse);
};

// Middleware para capturar errores async
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Middleware para rutas no encontradas
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const error = createError(`Ruta ${req.originalUrl} no encontrada`, 404);
  next(error);
};
