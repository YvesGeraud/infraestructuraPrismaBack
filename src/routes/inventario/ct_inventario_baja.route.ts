import { Router } from "express";
import { CtInventarioBajaBaseController } from "../../controllers/inventario/ct_inventario_baja.controller";
import { validarRequest } from "../../middleware/validacion";
import {
  crearCtInventarioBajaSchema,
  actualizarCtInventarioBajaSchema,
  ctInventarioBajaIdParamSchema,
  ctInventarioBajaFiltrosSchema,
} from "../../schemas/inventario/ct_inventario_baja.schema";

//TODO ===== RUTAS PARA CT_INVENTARIO_BAJA CON BASE SERVICE =====

const router = Router();
const ctInventarioBajaController = new CtInventarioBajaBaseController();

// 📦 Obtener todas las causas de baja con filtros y paginación
router.get(
  "/",
  validarRequest({ query: ctInventarioBajaFiltrosSchema }),
  ctInventarioBajaController.obtenerTodasLasInventarioBaja
);

// 📦 Obtener causa de baja específica por ID
router.get(
  "/:id_ct_inventario_baja",
  validarRequest({ params: ctInventarioBajaIdParamSchema }),
  ctInventarioBajaController.obtenerInventarioBajaPorId
);

// 📦 Crear nueva causa de baja
router.post(
  "/",
  validarRequest({ body: crearCtInventarioBajaSchema }),
  ctInventarioBajaController.crearInventarioBaja
);

// 📦 Actualizar causa de baja existente
router.put(
  "/:id_ct_inventario_baja",
  validarRequest({
    params: ctInventarioBajaIdParamSchema,
    body: actualizarCtInventarioBajaSchema,
  }),
  ctInventarioBajaController.actualizarInventarioBaja
);

// 📦 Eliminar causa de baja
router.delete(
  "/:id_ct_inventario_baja",
  validarRequest({ params: ctInventarioBajaIdParamSchema }),
  ctInventarioBajaController.eliminarInventarioBaja
);

export default router;

// 🎉 API REST completa para ct_inventario_baja:
// GET    /api/ct_inventario_baja     - Listar con filtros/paginación
// GET    /api/ct_inventario_baja/:id - Obtener por ID
// POST   /api/ct_inventario_baja     - Crear
// PUT    /api/ct_inventario_baja/:id - Actualizar
// DELETE /api/ct_inventario_baja/:id - Eliminar
