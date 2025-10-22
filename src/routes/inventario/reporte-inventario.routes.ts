import { Router } from "express";
import reporteInventarioController from "../../controllers/inventario/reporte-inventario.controller";
import { verificarAutenticacion } from "../../middleware/authMiddleware";

const router = Router();

// Aplicar middleware de autenticación a todas las rutas
router.use(verificarAutenticacion);

// Rutas del reporte de inventario
router.post("/generar", reporteInventarioController.generarReporte);
router.get("/estadisticas", reporteInventarioController.obtenerEstadisticas);

export default router;
