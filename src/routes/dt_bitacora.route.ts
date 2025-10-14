import { Router } from "express";
import { DtBitacoraBaseController } from "../controllers/dt_bitacora.controller";
import { validarRequest } from "../middleware/validacion";
import {
  crearDtBitacoraSchema,
  actualizarDtBitacoraSchema,
  dtBitacoraIdParamSchema,
  dtBitacoraFiltrosSchema,
} from "../schemas/dt_bitacora.schema";

//TODO ===== RUTAS PARA DT_BITACORA CON BASE SERVICE =====

const router = Router();
const dtBitacoraController = new DtBitacoraBaseController();

// 📦 Obtener todos los registros de bitácora con filtros y paginación
router.get(
  "/",
  validarRequest({ query: dtBitacoraFiltrosSchema }),
  dtBitacoraController.obtenerTodasLasBitacoras
);

// 📦 Obtener registro de bitácora específico por ID
router.get(
  "/:id_dt_bitacora",
  validarRequest({ params: dtBitacoraIdParamSchema }),
  dtBitacoraController.obtenerBitacoraPorId
);

// 📦 Crear nuevo registro de bitácora
router.post(
  "/",
  validarRequest({ body: crearDtBitacoraSchema }),
  dtBitacoraController.crearBitacora
);

// 📦 Actualizar registro de bitácora existente
router.put(
  "/:id_dt_bitacora",
  validarRequest({
    params: dtBitacoraIdParamSchema,
    body: actualizarDtBitacoraSchema,
  }),
  dtBitacoraController.actualizarBitacora
);

// 📦 Eliminar registro de bitácora
router.delete(
  "/:id_dt_bitacora",
  validarRequest({ params: dtBitacoraIdParamSchema }),
  dtBitacoraController.eliminarBitacora
);

export default router;

// 🎉 API REST completa para dt_bitacora:
// GET    /api/dt_bitacora     - Listar con filtros/paginación (incluye filtros por tabla, acción, sesión, registro)
// GET    /api/dt_bitacora/:id - Obtener por ID
// POST   /api/dt_bitacora     - Crear
// PUT    /api/dt_bitacora/:id - Actualizar
// DELETE /api/dt_bitacora/:id - Eliminar
//
// 📝 Filtros disponibles en GET /api/dt_bitacora:
// - id_ct_bitacora_accion: Filtrar por acción
// - id_ct_bitacora_tabla: Filtrar por tabla
// - id_registro_afectado: Filtrar por registro afectado
// - id_ct_sesion: Filtrar por sesión
// - incluir_accion: Incluir datos de la acción
// - incluir_tabla: Incluir datos de la tabla
// - incluir_sesion: Incluir datos de la sesión
// - incluir_todas_relaciones: Incluir todas las relaciones

