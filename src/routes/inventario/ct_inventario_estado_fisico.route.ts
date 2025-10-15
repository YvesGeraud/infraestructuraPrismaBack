import { Router } from "express";
import { CtInventarioEstadoFisicoBaseController } from "../../controllers/inventario/ct_inventario_estado_fisico.controller";
import { validarRequest } from "../../middleware/validacion";
import {
  crearCtInventarioEstadoFisicoSchema,
  actualizarCtInventarioEstadoFisicoSchema,
  ctInventarioEstadoFisicoIdParamSchema,
  ctInventarioEstadoFisicoFiltrosSchema,
} from "../../schemas/inventario/ct_inventario_estado_fisico.schema";

//TODO ===== RUTAS PARA CT_INVENTARIO_ESTADO_FISICO CON BASE SERVICE =====

const router = Router();
const ctInventarioEstadoFisicoController = new CtInventarioEstadoFisicoBaseController();

// 📦 Obtener todos los estados físicos con filtros y paginación
router.get(
  "/",
  validarRequest({ query: ctInventarioEstadoFisicoFiltrosSchema }),
  ctInventarioEstadoFisicoController.obtenerTodosLosInventarioEstadoFisicos
);

// 📦 Obtener estado físico específico por ID
router.get(
  "/:id_ct_inventario_estado_fisico",
  validarRequest({ params: ctInventarioEstadoFisicoIdParamSchema }),
  ctInventarioEstadoFisicoController.obtenerInventarioEstadoFisicoPorId
);

// 📦 Crear nuevo estado físico
router.post(
  "/",
  validarRequest({ body: crearCtInventarioEstadoFisicoSchema }),
  ctInventarioEstadoFisicoController.crearInventarioEstadoFisico
);

// 📦 Actualizar estado físico existente
router.put(
  "/:id_ct_inventario_estado_fisico",
  validarRequest({
    params: ctInventarioEstadoFisicoIdParamSchema,
    body: actualizarCtInventarioEstadoFisicoSchema,
  }),
  ctInventarioEstadoFisicoController.actualizarInventarioEstadoFisico
);

// 📦 Eliminar estado físico
router.delete(
  "/:id_ct_inventario_estado_fisico",
  validarRequest({ params: ctInventarioEstadoFisicoIdParamSchema }),
  ctInventarioEstadoFisicoController.eliminarInventarioEstadoFisico
);

export default router;

// 🎉 API REST completa para ct_inventario_estado_fisico:
// GET    /api/ct_inventario_estado_fisico     - Listar con filtros/paginación
// GET    /api/ct_inventario_estado_fisico/:id - Obtener por ID
// POST   /api/ct_inventario_estado_fisico     - Crear
// PUT    /api/ct_inventario_estado_fisico/:id - Actualizar
// DELETE /api/ct_inventario_estado_fisico/:id - Eliminar
