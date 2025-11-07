import { Router } from "express";
import { CtInfraestructuraAreaBaseController } from "../../controllers/infraestructura/ct_infraestructura_area.controller";
import { validarRequest } from "../../middleware/validacion";
import {
  crearCtInfraestructuraAreaSchema,
  actualizarCtInfraestructuraAreaSchema,
  ctInfraestructuraAreaIdParamSchema,
  ctInfraestructuraAreaFiltrosSchema,
} from "../../schemas/infraestructura/ct_infraestructura_area.schema";

//TODO ===== RUTAS PARA CT_INFRAESTRUCTURA_AREA CON BASE SERVICE =====

const router = Router();
const ctInfraestructuraAreaController = new CtInfraestructuraAreaBaseController();

// 📦 Obtener todas las áreas con filtros y paginación
router.get(
  "/",
  validarRequest({ query: ctInfraestructuraAreaFiltrosSchema }),
  ctInfraestructuraAreaController.obtenerTodasLasAreas
);

// 📦 Obtener área específica por ID
router.get(
  "/:id_ct_infraestructura_area",
  validarRequest({ params: ctInfraestructuraAreaIdParamSchema }),
  ctInfraestructuraAreaController.obtenerAreaPorId
);

// 📦 Crear nueva área
router.post(
  "/",
  validarRequest({ body: crearCtInfraestructuraAreaSchema }),
  ctInfraestructuraAreaController.crearArea
);

// 📦 Actualizar área existente
router.put(
  "/:id_ct_infraestructura_area",
  validarRequest({
    params: ctInfraestructuraAreaIdParamSchema,
    body: actualizarCtInfraestructuraAreaSchema,
  }),
  ctInfraestructuraAreaController.actualizarArea
);

// 📦 Eliminar área
router.delete(
  "/:id_ct_infraestructura_area",
  validarRequest({ params: ctInfraestructuraAreaIdParamSchema }),
  ctInfraestructuraAreaController.eliminarArea
);

export default router;

// 🎉 API REST completa para ct_infraestructura_area:
// GET    /api/ct_infraestructura_area     - Listar con filtros/paginación
// GET    /api/ct_infraestructura_area/:id - Obtener por ID
// POST   /api/ct_infraestructura_area     - Crear
// PUT    /api/ct_infraestructura_area/:id - Actualizar
// DELETE /api/ct_infraestructura_area/:id - Eliminar
//
// 📝 Filtros disponibles en GET /api/ct_infraestructura_area:
// - nombre: Filtrar por nombre (búsqueda parcial)
// - cct: Filtrar por CCT (búsqueda parcial)
// - id_dt_infraestructura_ubicacion: Filtrar por ubicación
// - incluir_ubicacion: Incluir datos de la ubicación
