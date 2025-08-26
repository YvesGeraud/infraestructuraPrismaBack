import { Router } from "express";
import { ArchivoController } from "../controllers/archivoController";
import { asyncHandler } from "../middleware/errorHandler";
import {
  verificarAutenticacion,
  verificarAdmin,
} from "../middleware/authMiddleware";
import {
  uploadArchivoMiddleware,
  uploadMultiplesMiddleware,
  uploadCamposMiddleware,
  validarArchivoSubido,
  limpiarArchivosTemporales,
} from "../middleware/uploadMiddleware";

const router = Router();
const archivoController = new ArchivoController();

/**
 * @route   GET /api/archivos/configuracion
 * @desc    Obtener configuración del sistema de archivos
 * @access  Public
 */
router.get(
  "/configuracion",
  asyncHandler(archivoController.obtenerConfiguracion.bind(archivoController))
);

/**
 * @route   POST /api/archivos/subir
 * @desc    Subir un solo archivo
 * @access  Private
 */
router.post(
  "/subir",
  verificarAutenticacion,
  uploadArchivoMiddleware,
  validarArchivoSubido,
  limpiarArchivosTemporales,
  asyncHandler(archivoController.subirArchivo.bind(archivoController))
);

/**
 * @route   POST /api/archivos/subir-multiples
 * @desc    Subir múltiples archivos
 * @access  Private
 */
router.post(
  "/subir-multiples",
  verificarAutenticacion,
  uploadMultiplesMiddleware,
  validarArchivoSubido,
  limpiarArchivosTemporales,
  asyncHandler(archivoController.subirMultiplesArchivos.bind(archivoController))
);

/**
 * @route   POST /api/archivos/procesar-imagen
 * @desc    Procesar imagen (optimizar + crear thumbnail)
 * @access  Private
 */
router.post(
  "/procesar-imagen",
  verificarAutenticacion,
  uploadArchivoMiddleware,
  validarArchivoSubido,
  limpiarArchivosTemporales,
  asyncHandler(archivoController.procesarImagen.bind(archivoController))
);

/**
 * @route   POST /api/archivos/optimizar-imagen
 * @desc    Optimizar imagen existente
 * @access  Private
 */
router.post(
  "/optimizar-imagen",
  verificarAutenticacion,
  asyncHandler(archivoController.optimizarImagen.bind(archivoController))
);

/**
 * @route   POST /api/archivos/crear-thumbnail
 * @desc    Crear thumbnail de imagen existente
 * @access  Private
 */
router.post(
  "/crear-thumbnail",
  verificarAutenticacion,
  asyncHandler(archivoController.crearThumbnail.bind(archivoController))
);

/**
 * @route   GET /api/archivos/informacion/:ruta
 * @desc    Obtener información de un archivo
 * @access  Private
 */
router.get(
  "/informacion/:ruta(*)",
  verificarAutenticacion,
  asyncHandler(
    archivoController.obtenerInformacionArchivo.bind(archivoController)
  )
);

/**
 * @route   DELETE /api/archivos/:id
 * @desc    Eliminar archivo
 * @access  Private
 */
router.delete(
  "/:id",
  verificarAutenticacion,
  asyncHandler(archivoController.eliminarArchivo.bind(archivoController))
);

/**
 * @route   GET /api/archivos/estadisticas
 * @desc    Obtener estadísticas de almacenamiento
 * @access  Admin
 */
router.get(
  "/estadisticas",
  verificarAutenticacion,
  verificarAdmin,
  asyncHandler(archivoController.obtenerEstadisticas.bind(archivoController))
);

/**
 * @route   POST /api/archivos/limpiar-temporales
 * @desc    Limpiar archivos temporales
 * @access  Admin
 */
router.post(
  "/limpiar-temporales",
  verificarAutenticacion,
  verificarAdmin,
  asyncHandler(
    archivoController.limpiarArchivosTemporales.bind(archivoController)
  )
);

export default router;
