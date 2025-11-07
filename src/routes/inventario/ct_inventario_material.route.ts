import { Router } from "express";
import { CtInventarioMaterialBaseController } from "../../controllers/inventario/ct_inventario_material.controller";
import { validarRequest } from "../../middleware/validacion";
import {
  crearCtInventarioMaterialSchema,
  actualizarCtInventarioMaterialSchema,
  ctInventarioMaterialIdParamSchema,
  ctInventarioMaterialFiltrosSchema,
} from "../../schemas/inventario/ct_inventario_material.schema";

//TODO ===== RUTAS PARA CT_INVENTARIO_MATERIAL CON BASE SERVICE =====

const router = Router();
const ctInventarioMaterialController = new CtInventarioMaterialBaseController();

// 📦 Obtener todos los materiales con filtros y paginación
router.get(
  "/",
  validarRequest({ query: ctInventarioMaterialFiltrosSchema }),
  ctInventarioMaterialController.obtenerTodosLosInventarioMateriales
);

// 📦 Obtener material específico por ID
router.get(
  "/:id_ct_inventario_material",
  validarRequest({ params: ctInventarioMaterialIdParamSchema }),
  ctInventarioMaterialController.obtenerInventarioMaterialPorId
);

// 📦 Crear nuevo material
router.post(
  "/",
  validarRequest({ body: crearCtInventarioMaterialSchema }),
  ctInventarioMaterialController.crearInventarioMaterial
);

// 📦 Actualizar material existente
router.put(
  "/:id_ct_inventario_material",
  validarRequest({
    params: ctInventarioMaterialIdParamSchema,
    body: actualizarCtInventarioMaterialSchema,
  }),
  ctInventarioMaterialController.actualizarInventarioMaterial
);

// 📦 Eliminar material
router.delete(
  "/:id_ct_inventario_material",
  validarRequest({ params: ctInventarioMaterialIdParamSchema }),
  ctInventarioMaterialController.eliminarInventarioMaterial
);

export default router;

// 🎉 API REST completa para ct_inventario_material:
// GET    /api/ct_inventario_material     - Listar con filtros/paginación
// GET    /api/ct_inventario_material/:id - Obtener por ID
// POST   /api/ct_inventario_material     - Crear
// PUT    /api/ct_inventario_material/:id - Actualizar
// DELETE /api/ct_inventario_material/:id - Eliminar
