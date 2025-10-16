import { Router } from "express";
import { CtBitacoraAccionBaseController } from "../../controllers/bitacora/ct_bitacora_accion.controller";
import { validarRequest } from "../../middleware/validacion";
import {
  crearCtBitacoraAccionSchema,
  actualizarCtBitacoraAccionSchema,
  ctBitacoraAccionIdParamSchema,
  ctBitacoraAccionFiltrosSchema,
} from "../../schemas/bitacora/ct_bitacora_accion.schema";

//TODO ===== RUTAS PARA CT_BITACORA_ACCION CON BASE SERVICE =====

const router = Router();
const ctBitacoraAccionController = new CtBitacoraAccionBaseController();

// 📦 Obtener todas las acciones con filtros y paginación
router.get(
  "/",
  validarRequest({ query: ctBitacoraAccionFiltrosSchema }),
  ctBitacoraAccionController.obtenerTodasLasAcciones
);

// 📦 Obtener accion específica por ID
router.get(
  "/:id_ct_bitacora_accion",
  validarRequest({ params: ctBitacoraAccionIdParamSchema }),
  ctBitacoraAccionController.obtenerAccionPorId
);

// 📦 Crear nueva accion
router.post(
  "/",
  validarRequest({ body: crearCtBitacoraAccionSchema }),
  ctBitacoraAccionController.crearAccion
);

// 📦 Actualizar accion existente
router.put(
  "/:id_ct_bitacora_accion",
  validarRequest({
    params: ctBitacoraAccionIdParamSchema,
    body: actualizarCtBitacoraAccionSchema,
  }),
  ctBitacoraAccionController.actualizarAccion
);

// 📦 Eliminar accion
router.delete(
  "/:id_ct_bitacora_accion",
  validarRequest({ params: ctBitacoraAccionIdParamSchema }),
  ctBitacoraAccionController.eliminarAccion
);

export default router;

// 🎉 API REST completa para ct_bitacora_accion:
// GET    /api/ct_bitacora_accion          - Listar con filtros/paginación
// GET    /api/ct_bitacora_accion/:id      - Obtener por ID
// POST   /api/ct_bitacora_accion          - Crear
// PUT    /api/ct_bitacora_accion/:id      - Actualizar
// DELETE /api/ct_bitacora_accion/:id      - Eliminar
