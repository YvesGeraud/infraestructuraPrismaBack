import { Router } from "express";
import { CtInventarioSubclaseBaseController } from "../../controllers/inventario/ct_inventario_subclase.controller";
import { validarRequest } from "../../middleware/validacion";
import {
  crearCtInventarioSubclaseSchema,
  actualizarCtInventarioSubclaseSchema,
  ctInventarioSubclaseIdParamSchema,
  ctInventarioSubclaseFiltrosSchema,
} from "../../schemas/inventario/ct_inventario_subclase.schema";

//TODO ===== RUTAS PARA CT_INVENTARIO_SUBCLASE CON BASE SERVICE =====

const router = Router();
const ctInventarioSubclaseController = new CtInventarioSubclaseBaseController();

// 📦 Obtener todas las subclases con filtros y paginación
router.get(
  "/",
  validarRequest({ query: ctInventarioSubclaseFiltrosSchema }),
  ctInventarioSubclaseController.obtenerTodasLasInventarioSubclases
);

// 📦 Obtener subclase específica por ID
router.get(
  "/:id_ct_inventario_subclase",
  validarRequest({ params: ctInventarioSubclaseIdParamSchema }),
  ctInventarioSubclaseController.obtenerInventarioSubclasePorId
);

// 📦 Crear nueva subclase
router.post(
  "/",
  validarRequest({ body: crearCtInventarioSubclaseSchema }),
  ctInventarioSubclaseController.crearInventarioSubclase
);

// 📦 Actualizar subclase existente
router.put(
  "/:id_ct_inventario_subclase",
  validarRequest({
    params: ctInventarioSubclaseIdParamSchema,
    body: actualizarCtInventarioSubclaseSchema,
  }),
  ctInventarioSubclaseController.actualizarInventarioSubclase
);

// 📦 Eliminar subclase
router.delete(
  "/:id_ct_inventario_subclase",
  validarRequest({ params: ctInventarioSubclaseIdParamSchema }),
  ctInventarioSubclaseController.eliminarInventarioSubclase
);

export default router;

// 🎉 API REST completa para ct_inventario_subclase:
// GET    /api/ct_inventario_subclase     - Listar con filtros/paginación
// GET    /api/ct_inventario_subclase/:id - Obtener por ID
// POST   /api/ct_inventario_subclase     - Crear
// PUT    /api/ct_inventario_subclase/:id - Actualizar
// DELETE /api/ct_inventario_subclase/:id - Eliminar
//
// 📝 Filtros disponibles en GET /api/ct_inventario_subclase:
// - id_ct_inventario_clase: Filtrar por clase padre
// - no_subclase: Filtrar por número de subclase
// - nombre: Filtrar por nombre (búsqueda parcial)
// - incluir_clase: Incluir datos de la clase padre
