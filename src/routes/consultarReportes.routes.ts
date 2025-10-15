import { Router } from 'express';
import { ConsultarReportesController } from '../controllers/consultarReportes.controller';
//import { authMiddleware } from '../middleware/authMiddleware';
//import { rateLimiter } from '../middleware/rateLimiter';

const router = Router();
const consultarReportesController = new ConsultarReportesController();

/**
 * Rutas para consultar reportes generados
 * 
 * Todas las rutas requieren autenticación y están protegidas por rate limiting
 */

// Aplicar middleware de autenticación a todas las rutas
//router.use(authMiddleware);

// Aplicar rate limiting específico para consultas de reportes
//router.use(rateLimiter);

/**
 * @route GET /api/reportes/consultar
 * @desc Obtiene la lista de reportes con filtros opcionales
 * @access Private
 * @query {string} [tipo] - Tipo de reporte a filtrar
 * @query {string} [fechaInicio] - Fecha de inicio para filtrar (YYYY-MM-DD)
 * @query {string} [fechaFin] - Fecha de fin para filtrar (YYYY-MM-DD)
 * @query {string} [extension] - Extensión de archivo a filtrar (pdf, xlsx, etc.)
 * @query {string} [ordenarPor] - Campo para ordenar (nombre, fecha, tamanio)
 * @query {string} [orden] - Orden de clasificación (asc, desc)
 * @query {number} [pagina] - Número de página (default: 1)
 * @query {number} [limite] - Registros por página (default: 20)
 * 
 * @example
 * GET /api/reportes/consultar?tipo=localidades&extension=pdf&pagina=1&limite=10
 * 
 * @returns {Object} Lista paginada de reportes con metadatos
 */
router.get('/', consultarReportesController.obtenerTodos);

/**
 * @route GET /api/reportes/consultar/estadisticas
 * @desc Obtiene estadísticas de los reportes
 * @access Private
 * 
 * @example
 * GET /api/reportes/consultar/estadisticas
 * 
 * @returns {Object} Estadísticas de reportes (total, tamaño, por extensión, etc.)
 */
router.get('/estadisticas', consultarReportesController.obtenerEstadisticas);

/**
 * @route GET /api/reportes/consultar/:nombreArchivo
 * @desc Obtiene metadatos de un reporte específico
 * @access Private
 * @param {string} nombreArchivo - Nombre del archivo de reporte
 * 
 * @example
 * GET /api/reportes/consultar/reporte_reporte_de_localidades_2025-10-03_17-15-22.pdf
 * 
 * @returns {Object} Metadatos del reporte específico
 */
router.get('/:nombreArchivo', consultarReportesController.obtenerPorNombre);

/**
 * @route GET /api/reportes/ver/:nombreArchivo
 * @desc Visualiza un reporte en el navegador (inline)
 * @access Private
 * @param {string} nombreArchivo - Nombre del archivo de reporte
 * 
 * @example
 * GET /api/reportes/ver/reporte_reporte_de_localidades_2025-10-03_17-15-22.pdf
 * 
 * @returns {File} Archivo para visualización en navegador
 */
router.get('/ver/:nombreArchivo', consultarReportesController.verReporte);

/**
 * @route GET /api/reportes/descargar/:nombreArchivo
 * @desc Descarga un reporte específico
 * @access Private
 * @param {string} nombreArchivo - Nombre del archivo de reporte
 * 
 * @example
 * GET /api/reportes/descargar/reporte_reporte_de_localidades_2025-10-03_17-15-22.pdf
 * 
 * @returns {File} Archivo para descarga
 */
router.get('/descargar/:nombreArchivo', consultarReportesController.descargarReporte);

/**
 * @route DELETE /api/reportes/eliminar/:nombreArchivo
 * @desc Elimina un reporte específico
 * @access Private
 * @param {string} nombreArchivo - Nombre del archivo de reporte
 * 
 * @example
 * DELETE /api/reportes/eliminar/reporte_reporte_de_localidades_2025-10-03_17-15-22.pdf
 * 
 * @returns {Object} Confirmación de eliminación
 */
router.delete('/eliminar/:nombreArchivo', consultarReportesController.eliminar);

/**
 * @route POST /api/reportes/limpiar
 * @desc Limpia reportes antiguos según configuración
 * @access Private
 * 
 * @example
 * POST /api/reportes/limpiar
 * 
 * @returns {Object} Resultado de la limpieza
 */
router.post('/limpiar', consultarReportesController.limpiarReportesAntiguos);

export default router;
