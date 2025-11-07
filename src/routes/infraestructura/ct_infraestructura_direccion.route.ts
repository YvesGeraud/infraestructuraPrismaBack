import { Router } from "express";
import { CtInfraestructuraDireccionBaseController } from "../../controllers/infraestructura/ct_infraestructura_direccion.controller";
import { validarRequest } from "../../middleware/validacion";
import {
  crearCtInfraestructuraDireccionSchema,
  actualizarCtInfraestructuraDireccionSchema,
  ctInfraestructuraDireccionIdParamSchema,
  ctInfraestructuraDireccionFiltrosSchema,
} from "../../schemas/infraestructura/ct_infraestructura_direccion.schema";

//TODO ===== RUTAS PARA CT_INFRAESTRUCTURA_DIRECCION CON BASE SERVICE =====

const router = Router();
const ctInfraestructuraDireccionController = new CtInfraestructuraDireccionBaseController();

// 📦 Obtener todas las direcciones con filtros y paginación
router.get(
  "/",
  validarRequest({ query: ctInfraestructuraDireccionFiltrosSchema }),
  ctInfraestructuraDireccionController.obtenerTodasLasDirecciones
);

// 📦 Obtener dirección específica por ID
router.get(
  "/:id_ct_infraestructura_direccion",
  validarRequest({ params: ctInfraestructuraDireccionIdParamSchema }),
  ctInfraestructuraDireccionController.obtenerDireccionPorId
);

// 📦 Crear nueva dirección
router.post(
  "/",
  validarRequest({ body: crearCtInfraestructuraDireccionSchema }),
  ctInfraestructuraDireccionController.crearDireccion
);

// 📦 Actualizar dirección existente
router.put(
  "/:id_ct_infraestructura_direccion",
  validarRequest({
    params: ctInfraestructuraDireccionIdParamSchema,
    body: actualizarCtInfraestructuraDireccionSchema,
  }),
  ctInfraestructuraDireccionController.actualizarDireccion
);

// 📦 Eliminar dirección
router.delete(
  "/:id_ct_infraestructura_direccion",
  validarRequest({ params: ctInfraestructuraDireccionIdParamSchema }),
  ctInfraestructuraDireccionController.eliminarDireccion
);

export default router;

// 🎉 API REST completa para ct_infraestructura_direccion:
// GET    /api/ct_infraestructura_direccion     - Listar con filtros/paginación
// GET    /api/ct_infraestructura_direccion/:id - Obtener por ID
// POST   /api/ct_infraestructura_direccion     - Crear
// PUT    /api/ct_infraestructura_direccion/:id - Actualizar
// DELETE /api/ct_infraestructura_direccion/:id - Eliminar
//
// 📝 Filtros disponibles en GET /api/ct_infraestructura_direccion:
// - nombre: Filtrar por nombre (búsqueda parcial)
// - cct: Filtrar por CCT (búsqueda parcial)
// - id_dt_infraestructura_ubicacion: Filtrar por ubicación
// - incluir_ubicacion: Incluir datos de la ubicación
