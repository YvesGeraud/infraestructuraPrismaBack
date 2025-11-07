/**
 * @fileoverview Rutas Unificadas para Operaciones Batch de Inventario
 * Usa el middleware unificado para simplificar las rutas
 */

import { Router } from "express";
import { verificarAutenticacion } from "../../middleware/authMiddleware";
import { batchMiddlewareCompleto } from "../../middleware/batchMiddleware";
import { crearAltaMasivaSchema } from "../../schemas/inventario/dt_inventario_alta_batch.schema";
import { crearBajaMasivaSchema } from "../../schemas/inventario/dt_inventario_baja_batch.schema";
import inventarioBatchUnifiedController from "../../controllers/inventario/inventario-batch-unified.controller";
import multer from "multer";
import { createError } from "../../middleware/errorHandler";

const router = Router();

// 📤 CONFIGURACIÓN DE MULTER PARA UPLOAD DE ARCHIVOS
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB máximo
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(createError("Solo se permiten archivos PDF", 400) as any, false);
    }
  },
});

/**
 * 🚀 POST /api/inventario/batch/alta
 * Crear alta masiva de inventario
 *
 * @requires Authentication JWT
 * @body multipart/form-data
 *   - data: JSON string con los datos del alta
 *   - archivo: PDF file
 *
 * @returns {201} Alta creada exitosamente
 * @returns {400} Errores de validación
 * @returns {401} No autenticado
 * @returns {429} Demasiadas operaciones
 * @returns {500} Error del servidor
 */
router.post(
  "/alta",
  verificarAutenticacion,
  upload.single("archivo"),
  ...batchMiddlewareCompleto(crearAltaMasivaSchema, "alta", {
    maxFileSizeMB: 5,
    maxRequests: 10,
    windowMs: 60000,
    enableLogging: true,
    enableRateLimit: true,
  }),
  inventarioBatchUnifiedController.crearAltaMasiva.bind(
    inventarioBatchUnifiedController
  )
);

/**
 * 🚀 POST /api/inventario/batch/baja
 * Crear baja masiva de inventario
 *
 * @requires Authentication JWT
 * @body multipart/form-data
 *   - data: JSON string con los datos de la baja
 *   - archivo: PDF file
 *
 * @returns {201} Baja creada exitosamente
 * @returns {400} Errores de validación
 * @returns {401} No autenticado
 * @returns {429} Demasiadas operaciones
 * @returns {500} Error del servidor
 */
router.post(
  "/baja",
  verificarAutenticacion,
  upload.single("archivo"),
  ...batchMiddlewareCompleto(crearBajaMasivaSchema, "baja", {
    maxFileSizeMB: 5,
    maxRequests: 10,
    windowMs: 60000,
    enableLogging: true,
    enableRateLimit: true,
  }),
  inventarioBatchUnifiedController.crearBajaMasiva.bind(
    inventarioBatchUnifiedController
  )
);

/**
 * 📊 GET /api/inventario/batch/estadisticas
 * Obtener estadísticas de operaciones batch
 *
 * @requires Authentication JWT
 * @returns {200} Estadísticas de operaciones
 * @returns {401} No autenticado
 * @returns {500} Error del servidor
 */
router.get(
  "/estadisticas",
  verificarAutenticacion,
  inventarioBatchUnifiedController.obtenerEstadisticas.bind(
    inventarioBatchUnifiedController
  )
);

/**
 * 📋 GET /api/inventario/batch/operaciones
 * Listar operaciones batch con paginación
 *
 * @requires Authentication JWT
 * @query {number} pagina - Página actual (default: 1)
 * @query {number} limite - Elementos por página (default: 10)
 * @query {string} tipo - Tipo de operación ('alta' | 'baja')
 *
 * @returns {200} Lista de operaciones
 * @returns {401} No autenticado
 * @returns {500} Error del servidor
 */
router.get(
  "/operaciones",
  verificarAutenticacion,
  inventarioBatchUnifiedController.listarOperaciones.bind(
    inventarioBatchUnifiedController
  )
);

export default router;
