import { Router } from "express";

//import authRoutes from "./authRoutes";
import reportesRoutes from "./reportes.routes";
import consultarReportesRoutes from "./consultarReportes.routes";

import entidadRoutes from "./ct_entidad.route";
import municipioRoutes from "./ct_municipio.route";
import localidadRoutes from "./ct_localidad.route";
import bitacoraAccionRoutes from "./ct_bitacora.route";
import bitacoraTablaRoutes from "./ct_bitacora_tabla.route";
import dtBitacoraRoutes from "./dt_bitacora.route";

const router = Router();

// Montar las rutas con sus prefijos
//router.use("/auth", authRoutes);
router.use("/reportes", reportesRoutes);
router.use("/reportes", consultarReportesRoutes);


router.use("/ct_entidad", entidadRoutes);
router.use("/ct_municipio", municipioRoutes);
router.use("/ct_localidad", localidadRoutes);
router.use("/ct_bitacora_accion", bitacoraAccionRoutes);
router.use("/ct_bitacora_tabla", bitacoraTablaRoutes);
router.use("/dt_bitacora", dtBitacoraRoutes);

// Ruta de salud para las APIs
router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "API funcionando correctamente",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

export default router;
