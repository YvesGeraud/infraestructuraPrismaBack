import { Router } from "express";
import { CtInventarioColorBaseController } from "../../controllers/inventario/ct_inventario_color.controller";
import { validarRequest } from "../../middleware/validacion";
import {
  crearCtInventarioColorSchema,
  actualizarCtInventarioColorSchema,
  ctInventarioColorIdParamSchema,
  ctInventarioColorFiltrosSchema,
} from "../../schemas/inventario/ct_inventario_color.schema";

//TODO ===== RUTAS PARA CT_INVENTARIO_COLOR CON BASE SERVICE =====

const router = Router();
const ctInventarioColorController = new CtInventarioColorBaseController();

// 📦 Obtener todos los colores de inventario con filtros y paginación
router.get(
  "/",
  validarRequest({ query: ctInventarioColorFiltrosSchema }),
  ctInventarioColorController.obtenerTodosLosInventarioColores
);

// 📦 Obtener color de inventario específico por ID
router.get(
  "/:id_ct_inventario_color",
  validarRequest({ params: ctInventarioColorIdParamSchema }),
  ctInventarioColorController.obtenerInventarioColorPorId
);

// 📦 Crear nuevo color de inventario
router.post(
  "/",
  validarRequest({ body: crearCtInventarioColorSchema }),
  ctInventarioColorController.crearInventarioColor
);

// 📦 Actualizar color de inventario existente
router.put(
  "/:id_ct_inventario_color",
  validarRequest({
    params: ctInventarioColorIdParamSchema,
    body: actualizarCtInventarioColorSchema,
  }),
  ctInventarioColorController.actualizarInventarioColor
);

// 📦 Eliminar color de inventario
router.delete(
  "/:id_ct_inventario_color",
  validarRequest({ params: ctInventarioColorIdParamSchema }),
  ctInventarioColorController.eliminarInventarioColor
);

export default router;

// 🎉 API REST completa para ct_inventario_color:
// GET    /api/ct_inventario_color     - Listar con filtros/paginación
// GET    /api/ct_inventario_color/:id - Obtener por ID
// POST   /api/ct_inventario_color     - Crear
// PUT    /api/ct_inventario_color/:id - Actualizar
// DELETE /api/ct_inventario_color/:id - Eliminar
