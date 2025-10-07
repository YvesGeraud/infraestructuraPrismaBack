import { Router } from "express";

import authRoutes from "./authRoutes";
import reportesRoutes from "./reportes.routes";

import entidadRoutes from "./ct_entidad.route";
import municipioRoutes from "./ct_municipio.route";
import localidadRoutes from "./ct_localidad.route";

const router = Router();

// Montar las rutas con sus prefijos
router.use("/auth", authRoutes);
router.use("/reportes", reportesRoutes);

router.use("/ct_entidad", entidadRoutes);
router.use("/ct_municipio", municipioRoutes);
router.use("/ct_localidad", localidadRoutes);

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
