import { Router } from "express";
import { CtAdecuacionDiscapacidadBaseController } from "../../controllers/infraestructura/ct_adecuacion_discapacidad.controller";
import { validateRequest } from "../../middleware/validateRequest";
import {
  crearCtAdecuacionDiscapacidadSchema,
  actualizarCtAdecuacionDiscapacidadSchema,
  ctAdecuacionDiscapacidadIdParamSchema,
  paginationSchema,
} from "../../schemas/infraestructura/ct_adecuacion_discapacidad.schema";

//TODO ===== RUTAS PARA CT_ADECUACION_DISCAPACIDAD CON BASE SERVICE =====

const router = Router();
const ctAdecuacionDiscapacidadController =
  new CtAdecuacionDiscapacidadBaseController();

// 📦 Obtener todas las marcas con filtros y paginación
router.get(
  "/",
  validateRequest({ query: paginationSchema }),
  ctAdecuacionDiscapacidadController.obtenerTodasLasAdecuacionesDeDiscapacidad
);

// 📦 Obtener marca específica por ID
router.get(
  "/:id_adecuacion",
  validateRequest({ params: ctAdecuacionDiscapacidadIdParamSchema }),
  ctAdecuacionDiscapacidadController.obtenerAdecuacionDeDiscapacidadPorId
);

// 📦 Crear nueva marca
router.post(
  "/",
  validateRequest({ body: crearCtAdecuacionDiscapacidadSchema }),
  ctAdecuacionDiscapacidadController.crearAdecuacionDeDiscapacidad
);

// 📦 Actualizar marca existente
router.put(
  "/:id_adecuacion",
  validateRequest({
    params: ctAdecuacionDiscapacidadIdParamSchema,
    body: actualizarCtAdecuacionDiscapacidadSchema,
  }),
  ctAdecuacionDiscapacidadController.actualizarAdecuacionDeDiscapacidad
);

// 📦 Eliminar marca
router.delete(
  "/:id_adecuacion",
  validateRequest({ params: ctAdecuacionDiscapacidadIdParamSchema }),
  ctAdecuacionDiscapacidadController.eliminarAdecuacionDeDiscapacidad
);

export default router;

// 🎉 API REST completa para ct_adecuacion_discapacidad:
// GET    /api/inventario/marca          - Listar con filtros/paginación
// GET    /api/infraestructura/adecuacion_discapacidad/:id      - Obtener por ID
// POST   /api/infraestructura/adecuacion_discapacidad          - Crear
// PUT    /api/infraestructura/adecuacion_discapacidad/:id      - Actualizar
// DELETE /api/inventario/marca/:id      - Eliminar
