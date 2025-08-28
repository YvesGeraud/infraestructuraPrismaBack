import { Router } from "express";
import { RlEscuelaAlumnoGradoController } from "../controllers/rl_escuela_alumno_grado.controller";
import { validateRequest } from "../middleware/validateRequest";
import { asyncHandler } from "../middleware/errorHandler";
import {
  verificarAutenticacion,
  verificarAdmin,
} from "../middleware/authMiddleware";
import {
  crearRlEscuelaAlumnoGradoSchema,
  rlEscuelaAlumnoGradoIdParamSchema,
  actualizarRlEscuelaAlumnoGradoSchema,
  paginationSchema,
  rlEscuelaAlumnoGradoFiltersSchema,
} from "../schemas/rl_escuela_alumno_grado.schema";

const router = Router();
const rlEscuelaAlumnoGradoController = new RlEscuelaAlumnoGradoController();

//TODO ===== RUTAS PARA DT_ESCUELA_ALUMNO =====

//? Crear un nuevo registro de alumno en la escuela
//TODO POST /api/dt_escuela_alumno
router.post(
  "/",
  /*verificarAutenticacion,
  verificarAdmin,*/
  validateRequest({
    body: crearRlEscuelaAlumnoGradoSchema,
  }),
  asyncHandler(
    rlEscuelaAlumnoGradoController.crearRlEscuelaAlumnoGrado.bind(
      rlEscuelaAlumnoGradoController
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
    params: rlEscuelaAlumnoGradoIdParamSchema,
  }),
  asyncHandler(
    rlEscuelaAlumnoGradoController.obtenerRlEscuelaAlumnoGradoPorId.bind(
      rlEscuelaAlumnoGradoController
    )
  )
);

//? Obtener todos los registros de alumnos en la escuela
//TODO GET /api/dt_escuela_alumno
//? apis de prueba para filtros
//TODO GET /api/dt_escuela_alumno/filtros?nombre=Juan&app=Perez&apm=Gomez&curp=1234567890&telefono=1234567890
//? apis de prueba para incluir datos de los alumnos
//TODO GET /api/dt_escuela_alumno/filtros?nombre=Juan&app=Perez&apm=Gomez&curp=1234567890&telefono=1234567890&include=alumno

router.get(
  "/",
  /*verificarAutenticacion,
  verificarAdmin,*/
  validateRequest({
    query: rlEscuelaAlumnoGradoFiltersSchema.merge(paginationSchema).partial(),
  }),
  asyncHandler(
    rlEscuelaAlumnoGradoController.obtenerTodosLosRlEscuelaAlumnoGrado.bind(
      rlEscuelaAlumnoGradoController
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
    params: rlEscuelaAlumnoGradoIdParamSchema,
  }),
  validateRequest({
    body: actualizarRlEscuelaAlumnoGradoSchema,
  }),
  asyncHandler(
    rlEscuelaAlumnoGradoController.actualizarRlEscuelaAlumnoGrado.bind(
      rlEscuelaAlumnoGradoController
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
    params: rlEscuelaAlumnoGradoIdParamSchema,
  }),
  asyncHandler(
    rlEscuelaAlumnoGradoController.eliminarRlEscuelaAlumnoGrado.bind(
      rlEscuelaAlumnoGradoController
    )
  )
);

export default router;
