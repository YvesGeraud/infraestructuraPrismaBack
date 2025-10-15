import { Router } from "express";

//import authRoutes from "./authRoutes";
import reportesRoutes from "./reportes.routes";
import consultarReportesRoutes from "./consultarReportes.routes";

//? INVENTARIO
import inventarioAltaRoutes from "./inventario/ct_inventario_alta.route";
import inventarioBajaRoutes from "./inventario/ct_inventario_baja.route";
import inventarioClaseRoutes from "./inventario/ct_inventario_clase.route";
import inventarioColorRoutes from "./inventario/ct_inventario_color.route";
import inventarioEstadoFisicoRoutes from "./inventario/ct_inventario_estado_fisico.route";
import inventarioMarcaRoutes from "./inventario/ct_inventario_marca.route";
import inventarioMaterialRoutes from "./inventario/ct_inventario_material.route";
import inventarioProveedorRoutes from "./inventario/ct_inventario_proveedor.route";
import inventarioSubclaseRoutes from "./inventario/ct_inventario_subclase.route";
import inventarioTipoArticuloRoutes from "./inventario/ct_inventario_tipo_articulo.route";
import dtInventarioArticuloRoutes from "./inventario/dt_inventario_articulo.route";

//? GENERAL
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

//? INVENTARIO
router.use("/ct_inventario_alta", inventarioAltaRoutes);
router.use("/ct_inventario_baja", inventarioBajaRoutes);
router.use("/ct_inventario_clase", inventarioClaseRoutes);
router.use("/ct_inventario_color", inventarioColorRoutes);
router.use("/ct_inventario_estado_fisico", inventarioEstadoFisicoRoutes);
router.use("/ct_inventario_marca", inventarioMarcaRoutes);
router.use("/ct_inventario_material", inventarioMaterialRoutes);
router.use("/ct_inventario_proveedor", inventarioProveedorRoutes);
router.use("/ct_inventario_subclase", inventarioSubclaseRoutes);
router.use("/ct_inventario_tipo_articulo", inventarioTipoArticuloRoutes);
router.use("/dt_inventario_articulo", dtInventarioArticuloRoutes);

//? GENERAL
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
