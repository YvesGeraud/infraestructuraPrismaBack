import { Router } from "express";
import { CtInfraestructuraTipoInstanciaBaseController } from "../../controllers/infraestructura/ct_infraestructura_tipo_instancia.controller";
import { validarRequest } from "../../middleware/validacion";
import {
  crearCtInfraestructuraTipoInstanciaSchema,
  actualizarCtInfraestructuraTipoInstanciaSchema,
  ctInfraestructuraTipoInstanciaIdParamSchema,
  ctInfraestructuraTipoInstanciaFiltrosSchema,
} from "../../schemas/infraestructura/ct_infraestructura_tipo_instancia.schema";

//TODO ===== RUTAS PARA CT_INFRAESTRUCTURA_TIPO_INSTANCIA CON BASE SERVICE =====

const router = Router();
const ctInfraestructuraTipoInstanciaController = new CtInfraestructuraTipoInstanciaBaseController();

// 📦 Obtener todos los tipos de instancia con filtros y paginación
router.get(
  "/",
  validarRequest({ query: ctInfraestructuraTipoInstanciaFiltrosSchema }),
  ctInfraestructuraTipoInstanciaController.obtenerTodosLosTiposInstancia
);

// 📦 Obtener tipo de instancia específico por ID
router.get(
  "/:id_ct_infraestructura_tipo_instancia",
  validarRequest({ params: ctInfraestructuraTipoInstanciaIdParamSchema }),
  ctInfraestructuraTipoInstanciaController.obtenerTipoInstanciaPorId
);

// 📦 Crear nuevo tipo de instancia
router.post(
  "/",
  validarRequest({ body: crearCtInfraestructuraTipoInstanciaSchema }),
  ctInfraestructuraTipoInstanciaController.crearTipoInstancia
);

// 📦 Actualizar tipo de instancia existente
router.put(
  "/:id_ct_infraestructura_tipo_instancia",
  validarRequest({
    params: ctInfraestructuraTipoInstanciaIdParamSchema,
    body: actualizarCtInfraestructuraTipoInstanciaSchema,
  }),
  ctInfraestructuraTipoInstanciaController.actualizarTipoInstancia
);

// 📦 Eliminar tipo de instancia
router.delete(
  "/:id_ct_infraestructura_tipo_instancia",
  validarRequest({ params: ctInfraestructuraTipoInstanciaIdParamSchema }),
  ctInfraestructuraTipoInstanciaController.eliminarTipoInstancia
);

export default router;

// 🎉 API REST completa para ct_infraestructura_tipo_instancia:
// GET    /api/ct_infraestructura_tipo_instancia     - Listar con filtros/paginación
// GET    /api/ct_infraestructura_tipo_instancia/:id - Obtener por ID
// POST   /api/ct_infraestructura_tipo_instancia     - Crear
// PUT    /api/ct_infraestructura_tipo_instancia/:id - Actualizar
// DELETE /api/ct_infraestructura_tipo_instancia/:id - Eliminar
//
// 📝 Filtros disponibles en GET /api/ct_infraestructura_tipo_instancia:
// - nombre: Filtrar por nombre (búsqueda parcial)
// - incluir_jerarquias: Incluir jerarquías relacionadas
