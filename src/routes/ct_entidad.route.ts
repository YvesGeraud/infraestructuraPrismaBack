import { Router } from "express";
import { CtEntidadBaseController } from "../controllers/ct_entidad.controller";
import { validarRequest } from "../middleware/validacion";
import {
  crearCtEntidadSchema,
  actualizarCtEntidadSchema,
  ctEntidadIdParamSchema,
  ctEntidadFiltrosSchema,
} from "../schemas/ct_entidad.schema";

//TODO ===== RUTAS PARA CT_ENTIDAD CON BASE SERVICE =====

const router = Router();
const ctEntidadController = new CtEntidadBaseController();

// 📦 Obtener todas las entidades con filtros y paginación
router.get(
  "/",
  validarRequest({ query: ctEntidadFiltrosSchema }),
  ctEntidadController.obtenerTodasLasEntidades
);

// 📦 Obtener entidad específica por ID
router.get(
  "/:id_ct_entidad",
  validarRequest({ params: ctEntidadIdParamSchema }),
  ctEntidadController.obtenerEntidadPorId
);

// 📦 Crear nueva entidad
router.post(
  "/",
  validarRequest({ body: crearCtEntidadSchema }),
  ctEntidadController.crearEntidad
);

// 📦 Actualizar entidad existente
router.put(
  "/:id_ct_entidad",
  validarRequest({
    params: ctEntidadIdParamSchema,
    body: actualizarCtEntidadSchema,
  }),
  ctEntidadController.actualizarEntidad
);

// 📦 Eliminar entidad
router.delete(
  "/:id_ct_entidad",
  validarRequest({ params: ctEntidadIdParamSchema }),
  ctEntidadController.eliminarEntidad
);

export default router;

// 🎉 API REST completa para ct_entidad:
// GET    /api/ct_entidad          - Listar con filtros/paginación
// GET    /api/ct_entidad/:id      - Obtener por ID
// POST   /api/ct_entidad          - Crear
// PUT    /api/ct_entidad/:id      - Actualizar
// DELETE /api/ct_entidad/:id      - Eliminar
