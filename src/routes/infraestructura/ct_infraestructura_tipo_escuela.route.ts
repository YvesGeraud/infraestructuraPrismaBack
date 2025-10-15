import { Router } from "express";
import { CtInfraestructuraTipoEscuelaBaseController } from "../../controllers/infraestructura/ct_infraestructura_tipo_escuela.controller";
import { validarRequest } from "../../middleware/validacion";
import {
  crearCtInfraestructuraTipoEscuelaSchema,
  actualizarCtInfraestructuraTipoEscuelaSchema,
  ctInfraestructuraTipoEscuelaIdParamSchema,
  ctInfraestructuraTipoEscuelaFiltrosSchema,
} from "../../schemas/infraestructura/ct_infraestructura_tipo_escuela.schema";

//TODO ===== RUTAS PARA CT_INFRAESTRUCTURA_TIPO_ESCUELA CON BASE SERVICE =====

const router = Router();
const ctInfraestructuraTipoEscuelaController = new CtInfraestructuraTipoEscuelaBaseController();

// 📦 Obtener todos los tipos de escuela con filtros y paginación
router.get(
  "/",
  validarRequest({ query: ctInfraestructuraTipoEscuelaFiltrosSchema }),
  ctInfraestructuraTipoEscuelaController.obtenerTodosLosTiposEscuela
);

// 📦 Obtener tipo de escuela específico por ID
router.get(
  "/:id_ct_infraestructura_tipo_escuela",
  validarRequest({ params: ctInfraestructuraTipoEscuelaIdParamSchema }),
  ctInfraestructuraTipoEscuelaController.obtenerTipoEscuelaPorId
);

// 📦 Crear nuevo tipo de escuela
router.post(
  "/",
  validarRequest({ body: crearCtInfraestructuraTipoEscuelaSchema }),
  ctInfraestructuraTipoEscuelaController.crearTipoEscuela
);

// 📦 Actualizar tipo de escuela existente
router.put(
  "/:id_ct_infraestructura_tipo_escuela",
  validarRequest({
    params: ctInfraestructuraTipoEscuelaIdParamSchema,
    body: actualizarCtInfraestructuraTipoEscuelaSchema,
  }),
  ctInfraestructuraTipoEscuelaController.actualizarTipoEscuela
);

// 📦 Eliminar tipo de escuela
router.delete(
  "/:id_ct_infraestructura_tipo_escuela",
  validarRequest({ params: ctInfraestructuraTipoEscuelaIdParamSchema }),
  ctInfraestructuraTipoEscuelaController.eliminarTipoEscuela
);

export default router;

// 🎉 API REST completa para ct_infraestructura_tipo_escuela:
// GET    /api/ct_infraestructura_tipo_escuela     - Listar con filtros/paginación
// GET    /api/ct_infraestructura_tipo_escuela/:id - Obtener por ID
// POST   /api/ct_infraestructura_tipo_escuela     - Crear
// PUT    /api/ct_infraestructura_tipo_escuela/:id - Actualizar
// DELETE /api/ct_infraestructura_tipo_escuela/:id - Eliminar
//
// 📝 Filtros disponibles en GET /api/ct_infraestructura_tipo_escuela:
// - tipo_escuela: Filtrar por tipo de escuela (búsqueda parcial)
// - clave: Filtrar por clave (búsqueda parcial)
// - incluir_escuelas: Incluir escuelas relacionadas
