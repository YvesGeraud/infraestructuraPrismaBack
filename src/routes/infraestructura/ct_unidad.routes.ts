import { Router } from "express";
import { validateRequest } from "../../middleware/validateRequest";
import { asyncHandler } from "../../middleware/errorHandler";
import { CtUnidadController } from "../../controllers/infraestructura/ct_unidad.controller";

import {
  crearCtColorSchema,
  ctColorIdParamSchema,
  actualizarCtColorSchema,
} from "../../schemas/inventario/ct_color.schemas";

const router = Router();
const ctUnidadController = new CtUnidadController();

//TODO ===== RUTAS PARA CT_INFRAESTRUCTURA_UNIDAD =====

//? Crear una nueva unidad de infraestructura
//TODO POST /api/ct_unidad
router.post(
  "/",
  /*verificarAutenticacion,
  verificarAdmin,*/
  validateRequest({
    body: crearCtColorSchema,
  }),
  asyncHandler(ctUnidadController.crearUnidad.bind(ctUnidadController))
);

//? Obtener una unidad de infraestructura por ID
//TODO GET /api/ct_unidad/:id_unidad
router.get(
  "/:id_escuela_alumno",
  /*verificarAutenticacion,
  verificarAdmin,*/
  validateRequest({
    params: ctColorIdParamSchema,
  }),
  asyncHandler(ctUnidadController.obtenerUnidadPorId.bind(ctUnidadController))
);

//? Obtener todas las unidades de infraestructura
//TODO GET /api/ct_unidad
router.get(
  "/",
  /*verificarAutenticacion,
  verificarAdmin,*/
  /*validateRequest({
    query: ctColorFiltersSchema.merge(paginationSchema),
  }),*/
  asyncHandler(
    ctUnidadController.obtenerTodosLosCtUnidades.bind(ctUnidadController)
  )
);

//? Actualizar una unidad de infraestructura
//TODO PUT /api/ct_unidad/:id_unidad
router.put(
  "/:id_escuela_alumno",
  /*verificarAutenticacion,
  verificarAdmin,*/
  validateRequest({
    params: ctColorIdParamSchema,
  }),
  validateRequest({
    body: actualizarCtColorSchema,
  }),
  asyncHandler(ctUnidadController.actualizarUnidad.bind(ctUnidadController))
);

//? Eliminar una unidad de infraestructura
//TODO DELETE /api/ct_unidad/:id_unidad
router.delete(
  "/:id_escuela_alumno",
  /*verificarAutenticacion,
  verificarAdmin,*/
  validateRequest({
    params: ctColorIdParamSchema,
  }),
  asyncHandler(ctUnidadController.eliminarUnidad.bind(ctUnidadController))
);

export default router;
