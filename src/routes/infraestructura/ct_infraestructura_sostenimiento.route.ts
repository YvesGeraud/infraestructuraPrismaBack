import { Router } from "express";
import { CtInfraestructuraSostenimientoBaseController } from "../../controllers/infraestructura/ct_infraestructura_sostenimiento.controller";
import { validarRequest } from "../../middleware/validacion";
import {
  crearCtInfraestructuraSostenimientoSchema,
  actualizarCtInfraestructuraSostenimientoSchema,
  ctInfraestructuraSostenimientoIdParamSchema,
  ctInfraestructuraSostenimientoFiltrosSchema,
} from "../../schemas/infraestructura/ct_infraestructura_sostenimiento.schema";

//TODO ===== RUTAS PARA CT_INFRAESTRUCTURA_SOSTENIMIENTO CON BASE SERVICE =====

const router = Router();
const ctInfraestructuraSostenimientoController = new CtInfraestructuraSostenimientoBaseController();

// 📦 Obtener todos los sostenimientos con filtros y paginación
router.get(
  "/",
  validarRequest({ query: ctInfraestructuraSostenimientoFiltrosSchema }),
  ctInfraestructuraSostenimientoController.obtenerTodosLosSostenimientos
);

// 📦 Obtener sostenimiento específico por ID
router.get(
  "/:id_ct_infraestructura_sostenimiento",
  validarRequest({ params: ctInfraestructuraSostenimientoIdParamSchema }),
  ctInfraestructuraSostenimientoController.obtenerSostenimientoPorId
);

// 📦 Crear nuevo sostenimiento
router.post(
  "/",
  validarRequest({ body: crearCtInfraestructuraSostenimientoSchema }),
  ctInfraestructuraSostenimientoController.crearSostenimiento
);

// 📦 Actualizar sostenimiento existente
router.put(
  "/:id_ct_infraestructura_sostenimiento",
  validarRequest({
    params: ctInfraestructuraSostenimientoIdParamSchema,
    body: actualizarCtInfraestructuraSostenimientoSchema,
  }),
  ctInfraestructuraSostenimientoController.actualizarSostenimiento
);

// 📦 Eliminar sostenimiento
router.delete(
  "/:id_ct_infraestructura_sostenimiento",
  validarRequest({ params: ctInfraestructuraSostenimientoIdParamSchema }),
  ctInfraestructuraSostenimientoController.eliminarSostenimiento
);

export default router;

// 🎉 API REST completa para ct_infraestructura_sostenimiento:
// GET    /api/ct_infraestructura_sostenimiento     - Listar con filtros/paginación
// GET    /api/ct_infraestructura_sostenimiento/:id - Obtener por ID
// POST   /api/ct_infraestructura_sostenimiento     - Crear
// PUT    /api/ct_infraestructura_sostenimiento/:id - Actualizar
// DELETE /api/ct_infraestructura_sostenimiento/:id - Eliminar
//
// 📝 Filtros disponibles en GET /api/ct_infraestructura_sostenimiento:
// - sostenimiento: Filtrar por sostenimiento (búsqueda parcial)
// - incluir_escuelas: Incluir escuelas relacionadas
