import { Router } from "express";
import { DtEscuelaAlumnoController } from "../controllers/ct_accion.controller";
import { validateRequest } from "../middleware/validateRequest";
import { asyncHandler } from "../middleware/errorHandler";

import {
  crearCtAccionSchema,
  ctAccionIdParamSchema,
  actualizarCtAccionSchema,
} from "../schemas/ct_accion.schema";

const router = Router();
const dtEscuelaAlumnoController = new DtEscuelaAlumnoController();

//TODO ===== RUTAS PARA DT_ESCUELA_ALUMNO =====

//? Crear un nuevo registro de alumno en la escuela
//TODO POST /api/dt_escuela_alumno
router.post(
  "/",
  /*verificarAutenticacion,
  verificarAdmin,*/
  validateRequest({
    body: crearCtAccionSchema,
  }),
  asyncHandler(
    dtEscuelaAlumnoController.crearDtEscuelaAlumno.bind(
      dtEscuelaAlumnoController
    )
  )
);

//? Obtener un registro de alumno en la escuela
//TODO GET /api/dt_escuela_alumno/:id_escuela_alumno
router.get(
  "/:id_escuela_alumno",
  /*verificarAutenticacion,
  verificarAdmin,*/
  validateRequest({
    params: ctAccionIdParamSchema,
  }),
  asyncHandler(
    dtEscuelaAlumnoController.obtenerCtAccionPorId.bind(
      dtEscuelaAlumnoController
    )
  )
);

//? Obtener todos los registros de alumnos en la escuela
//TODO GET /api/dt_escuela_alumno
router.get(
  "/",
  /*verificarAutenticacion,
  verificarAdmin,*/
  /*validateRequest({
    query: ctAccionFiltersSchema.merge(paginationSchema),
  }),*/
  asyncHandler(
    dtEscuelaAlumnoController.obtenerTodosLosCtAccion.bind(
      dtEscuelaAlumnoController
    )
  )
);

//? Actualizar un registro de alumno en la escuela
//TODO PUT /api/dt_escuela_alumno/:id_escuela_alumno
router.put(
  "/:id_escuela_alumno",
  /*verificarAutenticacion,
  verificarAdmin,*/
  validateRequest({
    params: ctAccionIdParamSchema,
  }),
  validateRequest({
    body: actualizarCtAccionSchema,
  }),
  asyncHandler(
    dtEscuelaAlumnoController.actualizarCtAccion.bind(dtEscuelaAlumnoController)
  )
);

//? Eliminar un registro de alumno en la escuela
//TODO DELETE /api/dt_escuela_alumno/:id_escuela_alumno
router.delete(
  "/:id_escuela_alumno",
  /*verificarAutenticacion,
  verificarAdmin,*/
  validateRequest({
    params: ctAccionIdParamSchema,
  }),
  asyncHandler(
    dtEscuelaAlumnoController.eliminarCtAccion.bind(dtEscuelaAlumnoController)
  )
);

export default router;
