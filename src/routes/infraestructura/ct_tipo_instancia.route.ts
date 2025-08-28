import { Router } from "express";
import { CtTipoInstanciaBaseController } from "../../controllers/infraestructura/ct_tipo_instancia.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { paginationSchema } from "../../schemas/commonSchemas";
import {
  actualizarCtTipoInstanciaSchema,
  crearCtTipoInstanciaSchema,
  ctTipoInstanciaIdParamSchema,
} from "../../schemas/infraestructura/ct_tipo_instancia.schema";

//TODO ===== RUTAS PARA CT_TIPO_INSTANCIA CON BASE SERVICE =====

const router = Router();
const ctTipoInstanciaController = new CtTipoInstanciaBaseController();

// 📦 Obtener todas las tipo de instancias con filtros y paginación
router.get(
  "/",
  validateRequest({ query: paginationSchema }),
  ctTipoInstanciaController.obtenerTodasLasTipoInstancias
);

// 📦 Obtener tipo de instancia específica por ID
router.get(
  "/:id_tipo_instancia",
  validateRequest({ params: ctTipoInstanciaIdParamSchema }),
  ctTipoInstanciaController.obtenerTipoInstanciaPorId
);

// 📦 Crear nueva tipo de instancia
router.post(
  "/",
  validateRequest({ body: crearCtTipoInstanciaSchema }),
  ctTipoInstanciaController.crearTipoInstancia
);

// 📦 Actualizar tipo de instancia existente
router.put(
  "/:id_tipo_instancia",
  validateRequest({
    params: ctTipoInstanciaIdParamSchema,
    body: actualizarCtTipoInstanciaSchema,
  }),
  ctTipoInstanciaController.actualizarTipoInstancia
);

// 📦 Eliminar tipo de instancia
router.delete(
  "/:id_tipo_instancia",
  validateRequest({ params: ctTipoInstanciaIdParamSchema }),
  ctTipoInstanciaController.eliminarTipoInstancia
);

export default router;
