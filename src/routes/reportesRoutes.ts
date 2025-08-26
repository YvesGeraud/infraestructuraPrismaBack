import { Router } from "express";
import { ReportesController } from "../controllers/reportesController";
import {
  verificarAutenticacion,
  verificarAdmin,
} from "../middleware/authMiddleware";

const router = Router();
const reportesController = new ReportesController();

// Rutas de generación de reportes (requieren autenticación)
router.use(verificarAutenticacion);

// Generar reporte genérico
router.post("/generar", reportesController.generarReporte);

// Generar reportes específicos
router.post("/usuarios", reportesController.generarReporteUsuarios);
router.post("/productos", reportesController.generarReporteProductos);
router.post("/archivos", reportesController.generarReporteArchivos);
router.post("/emails", reportesController.generarReporteEmails);
router.post("/sistema", reportesController.generarReporteSistema);

// Obtener información del sistema
router.get("/tipos", reportesController.obtenerTiposDisponibles);
router.get("/configuracion", reportesController.obtenerConfiguracion);

// Rutas de administración (requieren admin)
router.use(verificarAdmin);

// Estadísticas y métricas
router.get("/estadisticas", reportesController.obtenerEstadisticas);
router.get("/metricas", reportesController.obtenerMetricas);

// Pruebas y mantenimiento
router.get("/probar", reportesController.probarGeneracion);
router.post("/limpiar", reportesController.limpiarArchivosTemporales);
router.post("/cerrar", reportesController.cerrarServicio);

// Descarga de archivos
router.get("/descargar/:nombreArchivo", reportesController.descargarReporte);

export default router;
