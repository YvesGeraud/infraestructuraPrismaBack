import { Router } from "express";

import poolRoutes from "./poolRoutes";
//import authRoutes from "./authRoutes";
import archivoRoutes from "./archivoRoutes";
import emailRoutes from "./emailRoutes";
//import reportesRoutes from "./reportesRoutes";

import { diagnosticoRoutes } from "./diagnosticoRoutes";

//TODO ===== RUTAS DE INFRAESTRUCTURA =====
import ctUnidadRoutes from "./infraestructura/ct_unidad.routes";

//TODO ===== RUTAS DE INVENTARIO =====
import ctColorRoutes from "./inventario/ct_color.routes";
import ctMarcaRoutes from "./inventario/ct_marca_base.routes";

//TODO ===== RUTAS DE GENERALES =====
import ctAccionRoutes from "./ct_accion.routes";
import ctEntidadRoutes from "./ct_entidad.routes";

const router = Router();

// Montar las rutas con sus prefijos
//router.use("/auth", authRoutes);

router.use("/pool", poolRoutes);
router.use("/archivos", archivoRoutes);
router.use("/emails", emailRoutes);
//router.use("/reportes", reportesRoutes);

router.use("/diagnostico", diagnosticoRoutes);

//TODO ===== RUTAS DE INFRAESTRUCTURA =====
router.use("/unidad", ctUnidadRoutes);

//TODO ===== RUTAS DE INVENTARIO =====
router.use("/color", ctColorRoutes);
router.use("/marca", ctMarcaRoutes);

//TODO ===== RUTAS DE CT_ACCION =====
router.use("/accion", ctAccionRoutes);

//TODO ===== RUTAS DE CT_ENTIDAD =====
router.use("/entidad", ctEntidadRoutes);

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
