import { Router } from "express";
import { DtEscuelaAlumnoController } from "../../controllers/inventario/ct_color.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { asyncHandler } from "../../middleware/errorHandler";

import {
  crearCtColorSchema,
  ctColorIdParamSchema,
  actualizarCtColorSchema,
} from "../../schemas/inventario/ct_color.schemas";

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
    body: crearCtColorSchema,
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
    params: ctColorIdParamSchema,
  }),
  asyncHandler(
    dtEscuelaAlumnoController.obtenerCtColorPorId.bind(
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
    query: ctColorFiltersSchema.merge(paginationSchema),
  }),*/
  asyncHandler(
    dtEscuelaAlumnoController.obtenerTodosLosCtColor.bind(
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
    params: ctColorIdParamSchema,
  }),
  validateRequest({
    body: actualizarCtColorSchema,
  }),
  asyncHandler(
    dtEscuelaAlumnoController.actualizarCtColor.bind(dtEscuelaAlumnoController)
  )
);

//? Eliminar un registro de alumno en la escuela
//TODO DELETE /api/dt_escuela_alumno/:id_escuela_alumno
router.delete(
  "/:id_escuela_alumno",
  /*verificarAutenticacion,
  verificarAdmin,*/
  validateRequest({
    params: ctColorIdParamSchema,
  }),
  asyncHandler(
    dtEscuelaAlumnoController.eliminarCtColor.bind(dtEscuelaAlumnoController)
  )
);

export default router;
