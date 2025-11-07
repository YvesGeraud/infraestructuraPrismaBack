import { Router } from "express";
import { DtInfraestructuraUbicacionBaseController } from "../../controllers/infraestructura/dt_infraestructura_ubicacion.controller";
import { validarRequest } from "../../middleware/validacion";
import {
  crearDtInfraestructuraUbicacionSchema,
  actualizarDtInfraestructuraUbicacionSchema,
  dtInfraestructuraUbicacionIdParamSchema,
  dtInfraestructuraUbicacionFiltrosSchema,
} from "../../schemas/infraestructura/dt_infraestructura_ubicacion.schema";

//TODO ===== RUTAS PARA DT_INFRAESTRUCTURA_UBICACION CON BASE SERVICE =====

const router = Router();
const dtInfraestructuraUbicacionController = new DtInfraestructuraUbicacionBaseController();

// 📦 Obtener todas las ubicaciones con filtros y paginación
router.get(
  "/",
  validarRequest({ query: dtInfraestructuraUbicacionFiltrosSchema }),
  dtInfraestructuraUbicacionController.obtenerTodasLasUbicaciones
);

// 📦 Obtener ubicación específica por ID
router.get(
  "/:id_dt_infraestructura_ubicacion",
  validarRequest({ params: dtInfraestructuraUbicacionIdParamSchema }),
  dtInfraestructuraUbicacionController.obtenerUbicacionPorId
);

// 📦 Crear nueva ubicación
router.post(
  "/",
  validarRequest({ body: crearDtInfraestructuraUbicacionSchema }),
  dtInfraestructuraUbicacionController.crearUbicacion
);

// 📦 Actualizar ubicación existente
router.put(
  "/:id_dt_infraestructura_ubicacion",
  validarRequest({
    params: dtInfraestructuraUbicacionIdParamSchema,
    body: actualizarDtInfraestructuraUbicacionSchema,
  }),
  dtInfraestructuraUbicacionController.actualizarUbicacion
);

// 📦 Eliminar ubicación
router.delete(
  "/:id_dt_infraestructura_ubicacion",
  validarRequest({ params: dtInfraestructuraUbicacionIdParamSchema }),
  dtInfraestructuraUbicacionController.eliminarUbicacion
);

export default router;

// 🎉 API REST completa para dt_infraestructura_ubicacion:
// GET    /api/dt_infraestructura_ubicacion     - Listar con filtros/paginación
// GET    /api/dt_infraestructura_ubicacion/:id - Obtener por ID
// POST   /api/dt_infraestructura_ubicacion     - Crear
// PUT    /api/dt_infraestructura_ubicacion/:id - Actualizar
// DELETE /api/dt_infraestructura_ubicacion/:id - Eliminar
//
// 📝 Filtros disponibles en GET /api/dt_infraestructura_ubicacion:
// - calle: Filtrar por calle (búsqueda parcial)
// - colonia: Filtrar por colonia (búsqueda parcial)
// - id_ct_localidad: Filtrar por localidad
// - id_ct_codigo_postal: Filtrar por código postal
// - incluir_localidad: Incluir datos de la localidad
// - incluir_codigo_postal: Incluir datos del código postal
// - incluir_todas_relaciones: Incluir todas las relaciones
