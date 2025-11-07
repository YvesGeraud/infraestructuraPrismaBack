import { Router } from "express";
import { CtInventarioAltaBaseController } from "../../controllers/inventario/ct_inventario_alta.controller";
import { validarRequest } from "../../middleware/validacion";
import { verificarAutenticacion } from "../../middleware/authMiddleware";
import {
  crearCtInventarioAltaSchema,
  actualizarCtInventarioAltaSchema,
  ctInventarioAltaIdParamSchema,
  ctInventarioAltaFiltrosSchema,
} from "../../schemas/inventario/ct_inventario_alta.schema";

//TODO ===== RUTAS PARA CT_ENTIDAD CON BASE SERVICE =====

const router = Router();
const ctInventarioAltaController = new CtInventarioAltaBaseController();

// 📦 Obtener todas las entidades con filtros y paginación
router.get(
  "/",
  validarRequest({ query: ctInventarioAltaFiltrosSchema }),
  ctInventarioAltaController.obtenerTodasLasInventarioAlta
);

// 📦 Obtener entidad específica por ID
router.get(
  "/:id_ct_inventario_alta",
  validarRequest({ params: ctInventarioAltaIdParamSchema }),
  ctInventarioAltaController.obtenerInventarioAltaPorId
);

// 📦 Crear nueva entidad (requiere autenticación)
router.post(
  "/",
  verificarAutenticacion, // 🔐 Middleware de autenticación OBLIGATORIO
  validarRequest({ body: crearCtInventarioAltaSchema }),
  ctInventarioAltaController.crearInventarioAlta
);

// 📦 Actualizar entidad existente (requiere autenticación)
router.put(
  "/:id_ct_inventario_alta",
  verificarAutenticacion, // 🔐 Middleware de autenticación OBLIGATORIO
  validarRequest({
    params: ctInventarioAltaIdParamSchema,
    body: actualizarCtInventarioAltaSchema,
  }),
  ctInventarioAltaController.actualizarInventarioAlta
);

// 📦 Eliminar entidad (requiere autenticación)
router.delete(
  "/:id_ct_inventario_alta",
  verificarAutenticacion, // 🔐 Middleware de autenticación OBLIGATORIO
  validarRequest({ params: ctInventarioAltaIdParamSchema }),
  ctInventarioAltaController.eliminarInventarioAlta
);

export default router;

// 🎉 API REST completa para ct_entidad:
// GET    /api/ct_entidad          - Listar con filtros/paginación
// GET    /api/ct_entidad/:id      - Obtener por ID
// POST   /api/ct_entidad          - Crear
// PUT    /api/ct_entidad/:id      - Actualizar
// DELETE /api/ct_entidad/:id      - Eliminar
