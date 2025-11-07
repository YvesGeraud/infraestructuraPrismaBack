import { Router } from "express";
import { CtInventarioClaseBaseController } from "../../controllers/inventario/ct_inventario_clase.controller";
import { validarRequest } from "../../middleware/validacion";
import {
  crearCtInventarioClaseSchema,
  actualizarCtInventarioClaseSchema,
  ctInventarioClaseIdParamSchema,
  ctInventarioClaseFiltrosSchema,
} from "../../schemas/inventario/ct_inventario_clase.schema";

//TODO ===== RUTAS PARA CT_INVENTARIO_CLASE CON BASE SERVICE =====

const router = Router();
const ctInventarioClaseController = new CtInventarioClaseBaseController();

// 📦 Obtener todas las clases de inventario con filtros y paginación
router.get(
  "/",
  validarRequest({ query: ctInventarioClaseFiltrosSchema }),
  ctInventarioClaseController.obtenerTodasLasInventarioClases
);

// 📦 Obtener clase de inventario específica por ID
router.get(
  "/:id_ct_inventario_clase",
  validarRequest({ params: ctInventarioClaseIdParamSchema }),
  ctInventarioClaseController.obtenerInventarioClasePorId
);

// 📦 Crear nueva clase de inventario
router.post(
  "/",
  validarRequest({ body: crearCtInventarioClaseSchema }),
  ctInventarioClaseController.crearInventarioClase
);

// 📦 Actualizar clase de inventario existente
router.put(
  "/:id_ct_inventario_clase",
  validarRequest({
    params: ctInventarioClaseIdParamSchema,
    body: actualizarCtInventarioClaseSchema,
  }),
  ctInventarioClaseController.actualizarInventarioClase
);

// 📦 Eliminar clase de inventario
router.delete(
  "/:id_ct_inventario_clase",
  validarRequest({ params: ctInventarioClaseIdParamSchema }),
  ctInventarioClaseController.eliminarInventarioClase
);

export default router;

// 🎉 API REST completa para ct_inventario_clase:
// GET    /api/ct_inventario_clase     - Listar con filtros/paginación
// GET    /api/ct_inventario_clase/:id - Obtener por ID
// POST   /api/ct_inventario_clase     - Crear
// PUT    /api/ct_inventario_clase/:id - Actualizar
// DELETE /api/ct_inventario_clase/:id - Eliminar
//
// 📝 Filtros disponibles en GET /api/ct_inventario_clase:
// - nombre: Filtrar por nombre (búsqueda parcial)
// - incluir_subclases: Incluir subclases relacionadas
