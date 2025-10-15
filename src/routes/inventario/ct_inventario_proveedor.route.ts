import { Router } from "express";
import { CtInventarioProveedorBaseController } from "../../controllers/inventario/ct_inventario_proveedor.controller";
import { validarRequest } from "../../middleware/validacion";
import {
  crearCtInventarioProveedorSchema,
  actualizarCtInventarioProveedorSchema,
  ctInventarioProveedorIdParamSchema,
  ctInventarioProveedorFiltrosSchema,
} from "../../schemas/inventario/ct_inventario_proveedor.schema";

//TODO ===== RUTAS PARA CT_INVENTARIO_PROVEEDOR CON BASE SERVICE =====

const router = Router();
const ctInventarioProveedorController = new CtInventarioProveedorBaseController();

// 📦 Obtener todos los proveedores con filtros y paginación
router.get(
  "/",
  validarRequest({ query: ctInventarioProveedorFiltrosSchema }),
  ctInventarioProveedorController.obtenerTodosLosInventarioProveedores
);

// 📦 Obtener proveedor específico por ID
router.get(
  "/:id_ct_inventario_proveedor",
  validarRequest({ params: ctInventarioProveedorIdParamSchema }),
  ctInventarioProveedorController.obtenerInventarioProveedorPorId
);

// 📦 Crear nuevo proveedor
router.post(
  "/",
  validarRequest({ body: crearCtInventarioProveedorSchema }),
  ctInventarioProveedorController.crearInventarioProveedor
);

// 📦 Actualizar proveedor existente
router.put(
  "/:id_ct_inventario_proveedor",
  validarRequest({
    params: ctInventarioProveedorIdParamSchema,
    body: actualizarCtInventarioProveedorSchema,
  }),
  ctInventarioProveedorController.actualizarInventarioProveedor
);

// 📦 Eliminar proveedor
router.delete(
  "/:id_ct_inventario_proveedor",
  validarRequest({ params: ctInventarioProveedorIdParamSchema }),
  ctInventarioProveedorController.eliminarInventarioProveedor
);

export default router;

// 🎉 API REST completa para ct_inventario_proveedor:
// GET    /api/ct_inventario_proveedor     - Listar con filtros/paginación
// GET    /api/ct_inventario_proveedor/:id - Obtener por ID
// POST   /api/ct_inventario_proveedor     - Crear
// PUT    /api/ct_inventario_proveedor/:id - Actualizar
// DELETE /api/ct_inventario_proveedor/:id - Eliminar
