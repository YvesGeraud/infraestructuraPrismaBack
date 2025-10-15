import { Router } from "express";
import { CtInfraestructuraDepartamentoBaseController } from "../../controllers/infraestructura/ct_infraestructura_departamento.controller";
import { validarRequest } from "../../middleware/validacion";
import {
  crearCtInfraestructuraDepartamentoSchema,
  actualizarCtInfraestructuraDepartamentoSchema,
  ctInfraestructuraDepartamentoIdParamSchema,
  ctInfraestructuraDepartamentoFiltrosSchema,
} from "../../schemas/infraestructura/ct_infraestructura_departamento.schema";

//TODO ===== RUTAS PARA CT_INFRAESTRUCTURA_DEPARTAMENTO CON BASE SERVICE =====

const router = Router();
const ctInfraestructuraDepartamentoController = new CtInfraestructuraDepartamentoBaseController();

// 📦 Obtener todos los departamentos con filtros y paginación
router.get(
  "/",
  validarRequest({ query: ctInfraestructuraDepartamentoFiltrosSchema }),
  ctInfraestructuraDepartamentoController.obtenerTodosLosDepartamentos
);

// 📦 Obtener departamento específico por ID
router.get(
  "/:id_ct_infraestructura_departamento",
  validarRequest({ params: ctInfraestructuraDepartamentoIdParamSchema }),
  ctInfraestructuraDepartamentoController.obtenerDepartamentoPorId
);

// 📦 Crear nuevo departamento
router.post(
  "/",
  validarRequest({ body: crearCtInfraestructuraDepartamentoSchema }),
  ctInfraestructuraDepartamentoController.crearDepartamento
);

// 📦 Actualizar departamento existente
router.put(
  "/:id_ct_infraestructura_departamento",
  validarRequest({
    params: ctInfraestructuraDepartamentoIdParamSchema,
    body: actualizarCtInfraestructuraDepartamentoSchema,
  }),
  ctInfraestructuraDepartamentoController.actualizarDepartamento
);

// 📦 Eliminar departamento
router.delete(
  "/:id_ct_infraestructura_departamento",
  validarRequest({ params: ctInfraestructuraDepartamentoIdParamSchema }),
  ctInfraestructuraDepartamentoController.eliminarDepartamento
);

export default router;

// 🎉 API REST completa para ct_infraestructura_departamento:
// GET    /api/ct_infraestructura_departamento     - Listar con filtros/paginación
// GET    /api/ct_infraestructura_departamento/:id - Obtener por ID
// POST   /api/ct_infraestructura_departamento     - Crear
// PUT    /api/ct_infraestructura_departamento/:id - Actualizar
// DELETE /api/ct_infraestructura_departamento/:id - Eliminar
//
// 📝 Filtros disponibles en GET /api/ct_infraestructura_departamento:
// - nombre: Filtrar por nombre (búsqueda parcial)
// - cct: Filtrar por CCT (búsqueda parcial)
// - id_dt_infraestructura_ubicacion: Filtrar por ubicación
// - incluir_ubicacion: Incluir datos de la ubicación
