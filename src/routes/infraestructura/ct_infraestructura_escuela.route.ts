import { Router } from "express";
import { CtInfraestructuraEscuelaBaseController } from "../../controllers/infraestructura/ct_infraestructura_escuela.controller";
import { validarRequest } from "../../middleware/validacion";
import {
  crearCtInfraestructuraEscuelaSchema,
  actualizarCtInfraestructuraEscuelaSchema,
  ctInfraestructuraEscuelaIdParamSchema,
  ctInfraestructuraEscuelaFiltrosSchema,
} from "../../schemas/infraestructura/ct_infraestructura_escuela.schema";

//TODO ===== RUTAS PARA CT_INFRAESTRUCTURA_ESCUELA CON BASE SERVICE =====

const router = Router();
const ctInfraestructuraEscuelaController = new CtInfraestructuraEscuelaBaseController();

// 📦 Obtener todas las escuelas con filtros y paginación
router.get(
  "/",
  validarRequest({ query: ctInfraestructuraEscuelaFiltrosSchema }),
  ctInfraestructuraEscuelaController.obtenerTodasLasEscuelas
);

// 📦 Obtener escuela específica por ID
router.get(
  "/:id_ct_infraestructura_escuela",
  validarRequest({ params: ctInfraestructuraEscuelaIdParamSchema }),
  ctInfraestructuraEscuelaController.obtenerEscuelaPorId
);

// 📦 Crear nueva escuela
router.post(
  "/",
  validarRequest({ body: crearCtInfraestructuraEscuelaSchema }),
  ctInfraestructuraEscuelaController.crearEscuela
);

// 📦 Actualizar escuela existente
router.put(
  "/:id_ct_infraestructura_escuela",
  validarRequest({
    params: ctInfraestructuraEscuelaIdParamSchema,
    body: actualizarCtInfraestructuraEscuelaSchema,
  }),
  ctInfraestructuraEscuelaController.actualizarEscuela
);

// 📦 Eliminar escuela
router.delete(
  "/:id_ct_infraestructura_escuela",
  validarRequest({ params: ctInfraestructuraEscuelaIdParamSchema }),
  ctInfraestructuraEscuelaController.eliminarEscuela
);

export default router;

// 🎉 API REST completa para ct_infraestructura_escuela:
// GET    /api/ct_infraestructura_escuela     - Listar con filtros/paginación
// GET    /api/ct_infraestructura_escuela/:id - Obtener por ID
// POST   /api/ct_infraestructura_escuela     - Crear
// PUT    /api/ct_infraestructura_escuela/:id - Actualizar
// DELETE /api/ct_infraestructura_escuela/:id - Eliminar
//
// 📝 Filtros disponibles en GET /api/ct_infraestructura_escuela:
// - id_escuela_plantel: Filtrar por escuela plantel
// - id_ct_tipo_escuela: Filtrar por tipo de escuela
// - cct: Filtrar por CCT (búsqueda parcial)
// - nombre: Filtrar por nombre (búsqueda parcial)
// - id_ct_sostenimiento: Filtrar por sostenimiento
// - id_dt_infraestructura_ubicacion: Filtrar por ubicación
// - incluir_ubicacion: Incluir datos de la ubicación
// - incluir_sostenimiento: Incluir datos del sostenimiento
// - incluir_tipo_escuela: Incluir datos del tipo de escuela
// - incluir_todas_relaciones: Incluir todas las relaciones
