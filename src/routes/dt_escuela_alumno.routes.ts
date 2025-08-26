import { Router } from "express";
import { DtEscuelaAlumnoController } from "../controllers/dt_escuela_alumno.controller";
import { validateRequest } from "../middleware/validateRequest";
import { asyncHandler } from "../middleware/errorHandler";
import {
  verificarAutenticacion,
  verificarAdmin,
} from "../middleware/authMiddleware";
import {
  crearDtEscuelaAlumnoSchema,
  dtEscuelaAlumnoIdParamSchema,
  actualizarDtEscuelaAlumnoSchema,
  paginationSchema,
  dtEscuelaAlumnoFiltersSchema,
} from "../schemas/dt_escuela_alumno.schema";

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
    body: crearDtEscuelaAlumnoSchema,
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
    params: dtEscuelaAlumnoIdParamSchema,
  }),
  asyncHandler(
    dtEscuelaAlumnoController.obtenerDtEscuelaAlumnoPorId.bind(
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
  validateRequest({
    query: dtEscuelaAlumnoFiltersSchema.merge(paginationSchema),
  }),
  asyncHandler(
    dtEscuelaAlumnoController.obtenerTodosLosDtEscuelaAlumno.bind(
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
    params: dtEscuelaAlumnoIdParamSchema,
  }),
  validateRequest({
    body: actualizarDtEscuelaAlumnoSchema,
  }),
  asyncHandler(
    dtEscuelaAlumnoController.actualizarDtEscuelaAlumno.bind(
      dtEscuelaAlumnoController
    )
  )
);

//? Eliminar un registro de alumno en la escuela
//TODO DELETE /api/dt_escuela_alumno/:id_escuela_alumno
router.delete(
  "/:id_escuela_alumno",
  /*verificarAutenticacion,
  verificarAdmin,*/
  validateRequest({
    params: dtEscuelaAlumnoIdParamSchema,
  }),
  asyncHandler(
    dtEscuelaAlumnoController.eliminarDtEscuelaAlumno.bind(
      dtEscuelaAlumnoController
    )
  )
);

export default router;
