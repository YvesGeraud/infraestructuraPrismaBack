import { Router } from "express";
import { validateRequest } from "../../middleware/validateRequest";
import { asyncHandler } from "../../middleware/errorHandler";
import { CtUnidadController } from "../../controllers/infraestructura/ct_unidad.controller";

import {
  crearCtUnidadSchema,
  ctUnidadIdParamSchema,
  actualizarCtUnidadSchema,
  buscarUnidadesSchema,
  paginationSchema,
} from "../../schemas/infraestructura/ct_unidad.schema";

const router = Router();
const ctUnidadController = new CtUnidadController();

//TODO ===== RUTAS PARA CT_INFRAESTRUCTURA_UNIDAD =====

//? NOTA: Las búsquedas se manejan con la ruta GET principal usando query parameters
//? Ejemplos de uso:
//? GET /api/infraestructura/unidad?cct=29DPR0001K
//? GET /api/infraestructura/unidad?nombre_unidad=escuela&limite=10
//? GET /api/infraestructura/unidad?vigente=1&pagina=1&limite=20

//? Crear una nueva unidad de infraestructura
//TODO POST /api/ct_unidad
router.post(
  "/",
  /*verificarAutenticacion,
  verificarAdmin,*/
  validateRequest({
    body: crearCtUnidadSchema,
  }),
  asyncHandler(ctUnidadController.crearUnidad.bind(ctUnidadController))
);

//? Obtener una unidad de infraestructura por ID
//TODO GET /api/infraestructura/unidad/:id_unidad
router.get(
  "/:id_unidad",
  /*verificarAutenticacion,
  verificarAdmin,*/
  validateRequest({
    params: ctUnidadIdParamSchema,
  }),
  asyncHandler(ctUnidadController.obtenerUnidadPorId.bind(ctUnidadController))
);

//? Obtener todas las unidades de infraestructura
//TODO GET /api/infraestructura/unidad
router.get(
  "/",
  /*verificarAutenticacion,
  verificarAdmin,*/
  validateRequest({
    query: buscarUnidadesSchema.merge(paginationSchema),
  }),
  asyncHandler(
    ctUnidadController.obtenerTodosLosCtUnidades.bind(ctUnidadController)
  )
);

//? Actualizar una unidad de infraestructura
//TODO PUT /api/infraestructura/unidad/:id_unidad
router.put(
  "/:id_unidad",
  /*verificarAutenticacion,
  verificarAdmin,*/
  validateRequest({
    params: ctUnidadIdParamSchema,
  }),
  validateRequest({
    body: actualizarCtUnidadSchema,
  }),
  asyncHandler(ctUnidadController.actualizarUnidad.bind(ctUnidadController))
);

//? Eliminar una unidad de infraestructura
//TODO DELETE /api/infraestructura/unidad/:id_unidad
router.delete(
  "/:id_unidad",
  /*verificarAutenticacion,
  verificarAdmin,*/
  validateRequest({
    params: ctUnidadIdParamSchema,
  }),
  asyncHandler(ctUnidadController.eliminarUnidad.bind(ctUnidadController))
);

export default router;
