import { Router } from "express";
import { CtEntidadController } from "../controllers/ct_entidad.controller";
import { validateRequest } from "../middleware/validateRequest";
import { asyncHandler } from "../middleware/errorHandler";

import {
  crearCtEntidadSchema,
  ctEntidadIdParamSchema,
  actualizarCtEntidadSchema,
} from "../schemas/ct_entidad.schema";

const router = Router();
const ctEntidadController = new CtEntidadController();

//TODO ===== RUTAS PARA CT_ENTIDAD =====

//? Crear un nuevo registro de alumno en la escuela
//TODO POST /api/ct_entidad
router.post(
  "/",
  /*verificarAutenticacion,
  verificarAdmin,*/
  validateRequest({
    body: crearCtEntidadSchema,
  }),
  asyncHandler(ctEntidadController.crearCtEntidad.bind(ctEntidadController))
);

//? Obtener un registro de alumno en la escuela
//TODO GET /api/ct_entidad/:id_entidad
router.get(
  "/:id_entidad",
  /*verificarAutenticacion,
  verificarAdmin,*/
  validateRequest({
    params: ctEntidadIdParamSchema,
  }),
  asyncHandler(
    ctEntidadController.obtenerCtEntidadPorId.bind(ctEntidadController)
  )
);

//? Obtener todos los registros de alumnos en la escuela
//TODO GET /api/ct_entidad
router.get(
  "/",
  /*verificarAutenticacion,
  verificarAdmin,*/
  /*validateRequest({
    query: ctAccionFiltersSchema.merge(paginationSchema),
  }),*/
  asyncHandler(
    ctEntidadController.obtenerTodosLosCtEntidad.bind(ctEntidadController)
  )
);

//? Actualizar un registro de alumno en la escuela
//TODO PUT /api/ct_entidad/:id_entidad
router.put(
  "/:id_entidad",
  /*verificarAutenticacion,
  verificarAdmin,*/
  validateRequest({
    params: ctEntidadIdParamSchema,
  }),
  validateRequest({
    body: actualizarCtEntidadSchema,
  }),
  asyncHandler(
    ctEntidadController.actualizarCtEntidad.bind(ctEntidadController)
  )
);

//? Eliminar un registro de alumno en la escuela
//TODO DELETE /api/ct_entidad/:id_entidad
router.delete(
  "/:id_entidad",
  /*verificarAutenticacion,
  verificarAdmin,*/
  validateRequest({
    params: ctEntidadIdParamSchema,
  }),
  asyncHandler(ctEntidadController.eliminarCtEntidad.bind(ctEntidadController))
);

export default router;
