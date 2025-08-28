import { Router } from "express";
import { CtArticuloBaseController } from "../../controllers/inventario/ct_articulo.controller";
import { validateRequest } from "../../middleware/validateRequest";
import {
  crearCtArticuloSchema,
  actualizarCtArticuloSchema,
  ctArticuloIdParamSchema,
  paginationSchema,
} from "../../schemas/inventario/ct_articulo.schema";

//TODO ===== RUTAS PARA CT_ARTICULO CON BASE SERVICE =====

const router = Router();
const ctArticuloController = new CtArticuloBaseController();

// 📦 Obtener todos los artículos con filtros y paginación
router.get(
  "/",
  validateRequest({ query: paginationSchema }),
  ctArticuloController.obtenerTodosLosArticulos
);

// 📦 Obtener artículo específico por ID
router.get(
  "/:id_articulo",
  validateRequest({ params: ctArticuloIdParamSchema }),
  ctArticuloController.obtenerArticuloPorId
);

// 📦 Crear nuevo artículo
router.post(
  "/",
  validateRequest({ body: crearCtArticuloSchema }),
  ctArticuloController.crearArticulo
);

// 📦 Actualizar artículo existente
router.put(
  "/:id_articulo",
  validateRequest({
    params: ctArticuloIdParamSchema,
    body: actualizarCtArticuloSchema,
  }),
  ctArticuloController.actualizarArticulo
);

// 📦 Eliminar artículo
router.delete(
  "/:id_articulo",
  validateRequest({ params: ctArticuloIdParamSchema }),
  ctArticuloController.eliminarArticulo
);

// ========== RUTAS DE REPORTES ==========
// NOTA: Los reportes ahora se manejan en /api/reportes/
// Ver: GET /api/reportes/articulos/jerarquia/:id_jerarquia/pdf

export default router;
