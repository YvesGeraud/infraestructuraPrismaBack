import { Router } from "express";
import { CtInventarioTipoArticuloBaseController } from "../../controllers/inventario/ct_inventario_tipo_articulo.controller";
import { validarRequest } from "../../middleware/validacion";
import {
  crearCtInventarioTipoArticuloSchema,
  actualizarCtInventarioTipoArticuloSchema,
  ctInventarioTipoArticuloIdParamSchema,
  ctInventarioTipoArticuloFiltrosSchema,
} from "../../schemas/inventario/ct_inventario_tipo_articulo.schema";

//TODO ===== RUTAS PARA CT_INVENTARIO_TIPO_ARTICULO CON BASE SERVICE =====

const router = Router();
const ctInventarioTipoArticuloController = new CtInventarioTipoArticuloBaseController();

// 📦 Obtener todos los tipos de artículo con filtros y paginación
router.get(
  "/",
  validarRequest({ query: ctInventarioTipoArticuloFiltrosSchema }),
  ctInventarioTipoArticuloController.obtenerTodosLosInventarioTipoArticulos
);

// 📦 Obtener tipo de artículo específico por ID
router.get(
  "/:id_ct_inventario_tipo_articulo",
  validarRequest({ params: ctInventarioTipoArticuloIdParamSchema }),
  ctInventarioTipoArticuloController.obtenerInventarioTipoArticuloPorId
);

// 📦 Crear nuevo tipo de artículo
router.post(
  "/",
  validarRequest({ body: crearCtInventarioTipoArticuloSchema }),
  ctInventarioTipoArticuloController.crearInventarioTipoArticulo
);

// 📦 Actualizar tipo de artículo existente
router.put(
  "/:id_ct_inventario_tipo_articulo",
  validarRequest({
    params: ctInventarioTipoArticuloIdParamSchema,
    body: actualizarCtInventarioTipoArticuloSchema,
  }),
  ctInventarioTipoArticuloController.actualizarInventarioTipoArticulo
);

// 📦 Eliminar tipo de artículo
router.delete(
  "/:id_ct_inventario_tipo_articulo",
  validarRequest({ params: ctInventarioTipoArticuloIdParamSchema }),
  ctInventarioTipoArticuloController.eliminarInventarioTipoArticulo
);

export default router;

// 🎉 API REST completa para ct_inventario_tipo_articulo:
// GET    /api/ct_inventario_tipo_articulo     - Listar con filtros/paginación
// GET    /api/ct_inventario_tipo_articulo/:id - Obtener por ID
// POST   /api/ct_inventario_tipo_articulo     - Crear
// PUT    /api/ct_inventario_tipo_articulo/:id - Actualizar
// DELETE /api/ct_inventario_tipo_articulo/:id - Eliminar
