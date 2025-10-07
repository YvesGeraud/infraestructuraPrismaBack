import { Router } from "express";
import { CtLocalidadBaseController } from "../controllers/ct_localidad.controller";
import { validarRequest } from "../middleware/validacion";
import {
  crearCtLocalidadSchema,
  actualizarCtLocalidadSchema,
  ctLocalidadIdParamSchema,
  ctLocalidadFiltrosSchema,
  eliminarCtLocalidadSchema,
} from "../schemas/ct_localidad.schema";

//TODO ===== RUTAS PARA CT_BITACORA_ACCION CON BASE SERVICE =====

const router = Router();
const ctLocalidadController =
  new CtLocalidadBaseController();

// 📦 Obtener todas las localidades con filtros y paginación
router.get(
  "/",
  validarRequest({ query: ctLocalidadFiltrosSchema }),
  ctLocalidadController.obtenerTodasLasLocalidades
);

// 📦 Obtener localidad específica por ID
router.get(
  "/:id_ct_localidad",
  validarRequest({ params: ctLocalidadIdParamSchema }),
  ctLocalidadController.obtenerLocalidadPorId
);

// 📦 Crear nueva localidad
router.post(
  "/",
  validarRequest({ body: crearCtLocalidadSchema }),
  ctLocalidadController.crearLocalidad
);

// 📦 Actualizar localidad existente
router.put(
  "/:id_ct_localidad",
  validarRequest({
    params: ctLocalidadIdParamSchema,
    body: actualizarCtLocalidadSchema,
  }),
  ctLocalidadController.actualizarLocalidad
);

// 📦 Eliminar localidad
router.delete(
  "/:id_ct_localidad",
  validarRequest({
    params: ctLocalidadIdParamSchema,
    body: eliminarCtLocalidadSchema,
  }),
  ctLocalidadController.eliminarLocalidad
);

export default router;

// 🎉 API REST completa para ct_localidad:
// GET    /api/ct_localidad          - Listar con filtros/paginación
// GET    /api/ct_localidad/:id      - Obtener por ID
// POST   /api/ct_localidad          - Crear
// PUT    /api/ct_localidad/:id      - Actualizar
// DELETE /api/ct_localidad/:id      - Eliminar
