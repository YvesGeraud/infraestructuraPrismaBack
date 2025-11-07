import { Router } from "express";
import { CtInfraestructuraSupervisorBaseController } from "../../controllers/infraestructura/ct_infraestructura_supervisor.controller";
import { validarRequest } from "../../middleware/validacion";
import {
  crearCtInfraestructuraSupervisorSchema,
  actualizarCtInfraestructuraSupervisorSchema,
  ctInfraestructuraSupervisorIdParamSchema,
  ctInfraestructuraSupervisorFiltrosSchema,
} from "../../schemas/infraestructura/ct_infraestructura_supervisor.schema";

//TODO ===== RUTAS PARA CT_INFRAESTRUCTURA_SUPERVISOR CON BASE SERVICE =====

const router = Router();
const ctInfraestructuraSupervisorController = new CtInfraestructuraSupervisorBaseController();

// 📦 Obtener todos los supervisores con filtros y paginación
router.get(
  "/",
  validarRequest({ query: ctInfraestructuraSupervisorFiltrosSchema }),
  ctInfraestructuraSupervisorController.obtenerTodosLosSupervisores
);

// 📦 Obtener supervisor específico por ID
router.get(
  "/:id_ct_infraestructura_supervisor",
  validarRequest({ params: ctInfraestructuraSupervisorIdParamSchema }),
  ctInfraestructuraSupervisorController.obtenerSupervisorPorId
);

// 📦 Crear nuevo supervisor
router.post(
  "/",
  validarRequest({ body: crearCtInfraestructuraSupervisorSchema }),
  ctInfraestructuraSupervisorController.crearSupervisor
);

// 📦 Actualizar supervisor existente
router.put(
  "/:id_ct_infraestructura_supervisor",
  validarRequest({
    params: ctInfraestructuraSupervisorIdParamSchema,
    body: actualizarCtInfraestructuraSupervisorSchema,
  }),
  ctInfraestructuraSupervisorController.actualizarSupervisor
);

// 📦 Eliminar supervisor
router.delete(
  "/:id_ct_infraestructura_supervisor",
  validarRequest({ params: ctInfraestructuraSupervisorIdParamSchema }),
  ctInfraestructuraSupervisorController.eliminarSupervisor
);

export default router;

// 🎉 API REST completa para ct_infraestructura_supervisor:
// GET    /api/ct_infraestructura_supervisor     - Listar con filtros/paginación
// GET    /api/ct_infraestructura_supervisor/:id - Obtener por ID
// POST   /api/ct_infraestructura_supervisor     - Crear
// PUT    /api/ct_infraestructura_supervisor/:id - Actualizar
// DELETE /api/ct_infraestructura_supervisor/:id - Eliminar
//
// 📝 Filtros disponibles en GET /api/ct_infraestructura_supervisor:
// - nombre: Filtrar por nombre (búsqueda parcial)
// - cct: Filtrar por CCT (búsqueda parcial)
// - id_dt_infraestructura_ubicacion: Filtrar por ubicación
// - incluir_ubicacion: Incluir datos de la ubicación
