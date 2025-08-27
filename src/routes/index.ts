import { Router } from "express";

import poolRoutes from "./poolRoutes";
//import authRoutes from "./authRoutes";
import archivoRoutes from "./archivoRoutes";
import emailRoutes from "./emailRoutes";
//import reportesRoutes from "./reportesRoutes";

import { diagnosticoRoutes } from "./diagnosticoRoutes";

//Todo rutas de infraestructura
import ctUnidadRoutes from "./infraestructura/ct_unidad.routes";

//Todo rutas de inventario
import ctColorRoutes from "./inventario/ct_color.routes";

const router = Router();

// Montar las rutas con sus prefijos
//router.use("/auth", authRoutes);

router.use("/pool", poolRoutes);
router.use("/archivos", archivoRoutes);
router.use("/emails", emailRoutes);
//router.use("/reportes", reportesRoutes);

router.use("/diagnostico", diagnosticoRoutes);

//Todo rutas de infraestructura
router.use("/unidad", ctUnidadRoutes);

//Todo rutas de inventario
router.use("/color", ctColorRoutes);

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
