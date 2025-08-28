import { Router } from "express";
import { CtLocalidadBaseController } from "../controllers/ct_localidad.controller";
import { validateRequest } from "../middleware/validateRequest";
import {
  crearCtLocalidadSchema,
  actualizarCtLocalidadSchema,
  ctLocalidadIdParamSchema,
  paginationSchema,
  buscarLocalidadesSchema,
} from "../schemas/ct_localidad.schema";

//TODO ===== RUTAS PARA CT_LOCALIDAD CON BASE SERVICE =====

const router = Router();
const ctLocalidadController = new CtLocalidadBaseController();

// 📦 Obtener todas las localidades con filtros y paginación
router.get(
  "/",
  validateRequest({ query: buscarLocalidadesSchema.merge(paginationSchema) }),
  ctLocalidadController.obtenerTodasLasLocalidades
);

// 📦 Obtener localidad específica por ID
router.get(
  "/:id_localidad",
  validateRequest({ params: ctLocalidadIdParamSchema }),
  ctLocalidadController.obtenerLocalidadPorId
);

// 📦 Crear nueva localidad
router.post(
  "/",
  validateRequest({ body: crearCtLocalidadSchema }),
  ctLocalidadController.crearLocalidad
);

// 📦 Actualizar localidad existente
router.put(
  "/:id_localidad",
  validateRequest({
    params: ctLocalidadIdParamSchema,
    body: actualizarCtLocalidadSchema,
  }),
  ctLocalidadController.actualizarLocalidad
);

// 📦 Eliminar localidad
router.delete(
  "/:id_localidad",
  validateRequest({ params: ctLocalidadIdParamSchema }),
  ctLocalidadController.eliminarLocalidad
);

export default router;

// 🎉 API REST completa para ct_localidad:
// GET    /api/ct_localidad          - Listar con filtros/paginación
// GET    /api/ct_localidad/:id      - Obtener por ID
// POST   /api/ct_localidad          - Crear
// PUT    /api/ct_localidad/:id      - Actualizar
// DELETE /api/ct_localidad/:id      - Eliminar
