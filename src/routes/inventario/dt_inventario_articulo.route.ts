import { Router } from "express";
import { DtInventarioArticuloBaseController } from "../../controllers/inventario/dt_inventario_articulo.controller";
import { validarRequest } from "../../middleware/validacion";
import {
  crearDtInventarioArticuloSchema,
  actualizarDtInventarioArticuloSchema,
  dtInventarioArticuloIdParamSchema,
  dtInventarioArticuloFiltrosSchema,
} from "../../schemas/inventario/dt_inventario_articulo.schema";

//TODO ===== RUTAS PARA DT_INVENTARIO_ARTICULO CON BASE SERVICE =====

const router = Router();
const dtInventarioArticuloController = new DtInventarioArticuloBaseController();

// 📦 Obtener todos los artículos de inventario con filtros y paginación
router.get(
  "/",
  validarRequest({ query: dtInventarioArticuloFiltrosSchema }),
  dtInventarioArticuloController.obtenerTodosLosInventarioArticulos
);

// 📦 Obtener artículo de inventario específico por ID
router.get(
  "/:id_dt_inventario_articulo",
  validarRequest({ params: dtInventarioArticuloIdParamSchema }),
  dtInventarioArticuloController.obtenerInventarioArticuloPorId
);

// 📦 Crear nuevo artículo de inventario
router.post(
  "/",
  validarRequest({ body: crearDtInventarioArticuloSchema }),
  dtInventarioArticuloController.crearInventarioArticulo
);

// 📦 Actualizar artículo de inventario existente
router.put(
  "/:id_dt_inventario_articulo",
  validarRequest({
    params: dtInventarioArticuloIdParamSchema,
    body: actualizarDtInventarioArticuloSchema,
  }),
  dtInventarioArticuloController.actualizarInventarioArticulo
);

// 📦 Eliminar artículo de inventario
router.delete(
  "/:id_dt_inventario_articulo",
  validarRequest({ params: dtInventarioArticuloIdParamSchema }),
  dtInventarioArticuloController.eliminarInventarioArticulo
);

export default router;

// 🎉 API REST completa para dt_inventario_articulo:
// GET    /api/dt_inventario_articulo     - Listar con filtros/paginación (incluye filtros por todos los catálogos)
// GET    /api/dt_inventario_articulo/:id - Obtener por ID
// POST   /api/dt_inventario_articulo     - Crear
// PUT    /api/dt_inventario_articulo/:id - Actualizar
// DELETE /api/dt_inventario_articulo/:id - Eliminar
//
// 📝 Filtros disponibles en GET /api/dt_inventario_articulo:
// - folio: Filtrar por folio (búsqueda parcial)
// - folio_antiguo: Filtrar por folio antiguo (búsqueda parcial)
// - no_serie: Filtrar por número de serie
// - cct: Filtrar por CCT (búsqueda parcial)
// - id_ct_inventario_subclase: Filtrar por subclase
// - id_ct_inventario_material: Filtrar por material
// - id_ct_inventario_marca: Filtrar por marca
// - id_ct_inventario_color: Filtrar por color
// - id_ct_inventario_proveedor: Filtrar por proveedor
// - id_ct_inventario_estado_fisico: Filtrar por estado físico
// - id_ct_inventario_tipo_articulo: Filtrar por tipo de artículo
// - id_rl_infraestructura_jerarquia: Filtrar por jerarquía
// - incluir_color: Incluir datos del color
// - incluir_estado_fisico: Incluir datos del estado físico
// - incluir_marca: Incluir datos de la marca
// - incluir_material: Incluir datos del material
// - incluir_proveedor: Incluir datos del proveedor
// - incluir_subclase: Incluir datos de la subclase (con clase padre)
// - incluir_tipo_articulo: Incluir datos del tipo de artículo
// - incluir_jerarquia: Incluir datos de la jerarquía
// - incluir_todas_relaciones: Incluir todas las relaciones
