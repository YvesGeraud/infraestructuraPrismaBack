/**
 * @fileoverview Middleware Unificado para Operaciones Batch de Inventario
 * Centraliza la lógica común de validación y procesamiento
 */

import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { createError } from "./errorHandler";
import logger from "../config/logger";

/**
 * 🎯 MIDDLEWARE PARA PROCESAR BATCH
 *
 * Middleware unificado que maneja la validación y procesamiento
 * de operaciones batch (alta/baja masiva)
 *
 * @param schema - Schema de validación Zod
 * @param tipoOperacion - Tipo de operación para logs
 */
export const procesarBatchMiddleware = (
  schema: ZodSchema,
  tipoOperacion: string
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info(`🔄 Middleware Batch ${tipoOperacion.toUpperCase()}`);
      logger.info("📦 req.file:", req.file ? "EXISTE" : "NO EXISTE");
      logger.info("📦 req.body:", req.body);
      logger.info("📦 req.body.data:", req.body.data ? "EXISTE" : "NO EXISTE");

      // 🔍 1. VALIDAR ARCHIVO
      if (!req.file) {
        throw createError("Debe adjuntar un archivo PDF", 400);
      }

      // 🔍 2. VALIDAR DATOS
      if (!req.body.data) {
        throw createError(
          `Debe enviar los datos de ${tipoOperacion} en el campo 'data'`,
          400
        );
      }

      // 🔄 3. PARSEAR JSON
      let datosOperacion;
      try {
        datosOperacion = JSON.parse(req.body.data);
      } catch (error) {
        throw createError("El campo 'data' debe ser un JSON válido", 400);
      }

      // ➕ 4. AGREGAR ARCHIVO A LOS DATOS
      const datosCompletos = {
        ...datosOperacion,
        archivo: req.file,
      };

      // ✅ 5. VALIDAR CON ZOD
      const datosValidados = schema.parse(datosCompletos);

      // 🔐 6. OBTENER DATOS DE AUTENTICACIÓN
      const userId = (req as any).user?.id_ct_usuario;
      const sessionId = parseInt((req as any).user?.id_sesion);

      if (!userId) {
        throw createError("Usuario no autenticado", 401);
      }

      logger.info(`🔍 Usuario autenticado: ${userId}, Sesión: ${sessionId}`);

      // 📦 7. AGREGAR DATOS VALIDADOS AL REQUEST
      (req as any).batchData = {
        datos: datosValidados,
        userId,
        sessionId,
        tipoOperacion,
      };

      logger.info(`✅ Middleware ${tipoOperacion.toUpperCase()} completado`);
      next();
    } catch (error) {
      // 🚨 8. MANEJO DE ERRORES
      if (error instanceof Error && error.name === "ZodError") {
        const zodError = error as any;
        const errores = (zodError.errors || []).map((e: any) => ({
          campo: e.path.join("."),
          mensaje: e.message,
        }));
        const err = createError("Errores de validación", 400);
        (err as any).errores = errores;
        return next(err);
      }

      logger.error(`❌ Error en middleware ${tipoOperacion}:`, error);
      next(error);
    }
  };
};

/**
 * 🎯 MIDDLEWARE PARA VALIDAR ARCHIVO PDF
 *
 * Middleware específico para validar archivos PDF
 */
export const validarArchivoPdfMiddleware = (maxSizeMB: number = 5) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) {
      return next(createError("Archivo PDF requerido", 400));
    }

    const file = req.file;
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    // Validar tipo de archivo
    if (file.mimetype !== "application/pdf") {
      return next(createError("Solo se permiten archivos PDF", 400));
    }

    // Validar tamaño
    if (file.size > maxSizeBytes) {
      return next(
        createError(`El archivo no puede exceder ${maxSizeMB}MB`, 400)
      );
    }

    logger.info(
      `✅ Archivo PDF válido: ${file.originalname} (${file.size} bytes)`
    );
    next();
  };
};

/**
 * 🎯 MIDDLEWARE PARA LOGGING DE BATCH
 *
 * Middleware para logging detallado de operaciones batch
 */
export const loggingBatchMiddleware = (tipoOperacion: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();

    // Log de inicio
    logger.info(
      `🚀 Iniciando ${tipoOperacion.toUpperCase()} - Usuario: ${
        (req as any).user?.id_ct_usuario
      }`
    );

    // Interceptar respuesta
    const originalSend = res.send;
    res.send = function (data) {
      const duration = Date.now() - startTime;
      logger.info(
        `✅ ${tipoOperacion.toUpperCase()} completado en ${duration}ms`
      );
      return originalSend.call(this, data);
    };

    next();
  };
};

/**
 * 🎯 MIDDLEWARE PARA RATE LIMITING DE BATCH
 *
 * Middleware para limitar la frecuencia de operaciones batch
 */
export const rateLimitBatchMiddleware = (
  maxRequests: number = 10,
  windowMs: number = 60000
) => {
  const requests = new Map<string, number[]>();

  return (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user?.id_ct_usuario;
    if (!userId) {
      return next();
    }

    const now = Date.now();
    const userRequests = requests.get(userId.toString()) || [];

    // Limpiar requests antiguos
    const validRequests = userRequests.filter((time) => now - time < windowMs);

    if (validRequests.length >= maxRequests) {
      return next(
        createError(
          `Demasiadas operaciones batch. Máximo ${maxRequests} por minuto`,
          429
        )
      );
    }

    // Agregar request actual
    validRequests.push(now);
    requests.set(userId.toString(), validRequests);

    next();
  };
};

/**
 * 🎯 MIDDLEWARE COMPUESTO PARA BATCH
 *
 * Combina todos los middlewares necesarios para operaciones batch
 */
export const batchMiddlewareCompleto = (
  schema: ZodSchema,
  tipoOperacion: string,
  opciones: {
    maxFileSizeMB?: number;
    maxRequests?: number;
    windowMs?: number;
    enableLogging?: boolean;
    enableRateLimit?: boolean;
  } = {}
) => {
  const {
    maxFileSizeMB = 5,
    maxRequests = 10,
    windowMs = 60000,
    enableLogging = true,
    enableRateLimit = true,
  } = opciones;

  const middlewares = [
    // 1. Validar archivo PDF
    validarArchivoPdfMiddleware(maxFileSizeMB),

    // 2. Procesar batch (validación, parsing, autenticación)
    procesarBatchMiddleware(schema, tipoOperacion),
  ];

  // 3. Logging (opcional)
  if (enableLogging) {
    middlewares.push(loggingBatchMiddleware(tipoOperacion));
  }

  // 4. Rate limiting (opcional)
  if (enableRateLimit) {
    middlewares.push(rateLimitBatchMiddleware(maxRequests, windowMs));
  }

  return middlewares;
};
