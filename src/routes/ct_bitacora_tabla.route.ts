import { Router } from "express";
import { CtBitacoraTablaBaseController } from "../controllers/ct_bitacora_tabla.controller";
import { validarRequest } from "../middleware/validacion";
import {
  crearCtBitacoraTablaSchema,
  actualizarCtBitacoraTablaSchema,
  ctBitacoraTablaIdParamSchema,
  ctBitacoraTablaFiltrosSchema,
} from "../schemas/ct_bitacora_tabla.schema";

//TODO ===== RUTAS PARA CT_BITACORA_TABLA CON BASE SERVICE =====

const router = Router();
const ctBitacoraTablaController = new CtBitacoraTablaBaseController();

// 📦 Obtener todas las tablas de bitácora con filtros y paginación
router.get(
  "/",
  validarRequest({ query: ctBitacoraTablaFiltrosSchema }),
  ctBitacoraTablaController.obtenerTodasLasBitacorasTabla
);

// 📦 Obtener tabla de bitácora específica por ID
router.get(
  "/:id_ct_bitacora_tabla",
  validarRequest({ params: ctBitacoraTablaIdParamSchema }),
  ctBitacoraTablaController.obtenerBitacoraTablaPorId
);

// 📦 Crear nueva tabla de bitácora
router.post(
  "/",
  validarRequest({ body: crearCtBitacoraTablaSchema }),
  ctBitacoraTablaController.crearBitacoraTabla
);

// 📦 Actualizar tabla de bitácora existente
router.put(
  "/:id_ct_bitacora_tabla",
  validarRequest({
    params: ctBitacoraTablaIdParamSchema,
    body: actualizarCtBitacoraTablaSchema,
  }),
  ctBitacoraTablaController.actualizarBitacoraTabla
);

// 📦 Eliminar tabla de bitácora
router.delete(
  "/:id_ct_bitacora_tabla",
  validarRequest({ params: ctBitacoraTablaIdParamSchema }),
  ctBitacoraTablaController.eliminarBitacoraTabla
);

export default router;

// 🎉 API REST completa para ct_bitacora_tabla:
// GET    /api/ct_bitacora_tabla     - Listar con filtros/paginación
// GET    /api/ct_bitacora_tabla/:id - Obtener por ID
// POST   /api/ct_bitacora_tabla     - Crear
// PUT    /api/ct_bitacora_tabla/:id - Actualizar
// DELETE /api/ct_bitacora_tabla/:id - Eliminar

