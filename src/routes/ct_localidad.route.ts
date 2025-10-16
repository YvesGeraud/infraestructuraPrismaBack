import { Router } from "express";
import { CtLocalidadBaseController } from "../controllers/ct_localidad.controller";
import { validarRequest } from "../middleware/validacion";
import { verificarAutenticacion } from "../middleware/authMiddleware";
import {
  crearCtLocalidadSchema,
  actualizarCtLocalidadSchema,
  ctLocalidadIdParamSchema,
  ctLocalidadFiltrosSchema} from "../schemas/ct_localidad.schema";

// ===== RUTAS PARA CT_LOCALIDAD CON BASE SERVICE =====

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

// 📦 Crear nueva localidad (requiere autenticación)
router.post(
  "/",
  verificarAutenticacion,  // 🔐 Middleware de autenticación OBLIGATORIO
  validarRequest({ body: crearCtLocalidadSchema }),
  ctLocalidadController.crearLocalidad
);

// 📦 Actualizar localidad existente (requiere autenticación)
router.put(
  "/:id_ct_localidad",
  verificarAutenticacion,  // 🔐 Middleware de autenticación OBLIGATORIO
  validarRequest({
    params: ctLocalidadIdParamSchema,
    body: actualizarCtLocalidadSchema}),
  ctLocalidadController.actualizarLocalidad
);

// 📦 Eliminar localidad (requiere autenticación)
router.delete(
  "/:id_ct_localidad",
  verificarAutenticacion,  // 🔐 Middleware de autenticación OBLIGATORIO
  validarRequest({
    params: ctLocalidadIdParamSchema}),
  // Ya no validamos eliminarCtLocalidadSchema porque id_usuario viene del JWT
  ctLocalidadController.eliminarLocalidad
);

export default router;

// 🎉 API REST completa para ct_localidad:
// GET    /api/ct_localidad                  - Listar con filtros/paginación (público)
// GET    /api/ct_localidad/:id              - Obtener por ID (público)
// POST   /api/ct_localidad                  - Crear (🔐 requiere auth)
// PUT    /api/ct_localidad/:id              - Actualizar (🔐 requiere auth)
// DELETE /api/ct_localidad/:id              - Eliminar (🔐 requiere auth)
