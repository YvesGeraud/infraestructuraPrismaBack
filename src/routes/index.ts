import { Router } from "express";

import poolRoutes from "./poolRoutes";
//import authRoutes from "./authRoutes";
import archivoRoutes from "./archivoRoutes";
import emailRoutes from "./emailRoutes";
//import reportesRoutes from "./reportesRoutes";

import { diagnosticoRoutes } from "./diagnosticoRoutes";

//TODO ===== RUTAS DE INFRAESTRUCTURA =====
import ctUnidadRoutes from "./infraestructura/ct_unidad.routes";
import ctAdecuacionDiscapacidadRoutes from "./infraestructura/ct_adecuacion_discapacidad.routes";
import ctTipoInstanciaRoutes from "./infraestructura/ct_tipo_instancia.route";
import rlJerarquiaRoutes from "./infraestructura/rl_jerarquia.routes";

//TODO ===== RUTAS DE INVENTARIO =====
import ctColorRoutes from "./inventario/ct_color.routes";
import ctMarcaRoutes from "./inventario/ejemploroutes";
import ctArticuloRoutes from "./inventario/ct_articulo.routes";

//TODO ===== RUTAS DE REPORTES =====
import reportesRoutes from "./reportes.routes";

//TODO ===== RUTAS DE GENERALES =====
import ctAccionRoutes from "./ct_accion.routes";
import ctEntidadRoutes from "./ct_entidad.routes";
import ctLocalidadRoutes from "./localidad.routes";

const router = Router();

// Montar las rutas con sus prefijos
//router.use("/auth", authRoutes);

//TODO ===== RUTA DE EJEMPLO =====
router.use("/ejemplo", ctMarcaRoutes);

router.use("/pool", poolRoutes);
router.use("/archivos", archivoRoutes);
router.use("/emails", emailRoutes);
//router.use("/reportes", reportesRoutes);

router.use("/diagnostico", diagnosticoRoutes);

//TODO ===== RUTAS DE INFRAESTRUCTURA =====
router.use("/unidad", ctUnidadRoutes);
router.use("/adecuacion_discapacidad", ctAdecuacionDiscapacidadRoutes);
router.use("/tipo_instancia", ctTipoInstanciaRoutes);
router.use("/jerarquia", rlJerarquiaRoutes);

//TODO ===== RUTAS DE INVENTARIO =====
router.use("/color", ctColorRoutes);
router.use("/articulo", ctArticuloRoutes);

//TODO ===== RUTAS DE CT_ACCION =====
router.use("/accion", ctAccionRoutes);

//TODO ===== RUTAS DE REPORTES =====
router.use("/reportes", reportesRoutes);

//TODO ===== RUTAS DE CT_ENTIDAD =====
router.use("/entidad", ctEntidadRoutes);

//TODO ===== RUTAS DE CT_LOCALIDAD =====
router.use("/localidad", ctLocalidadRoutes);

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
