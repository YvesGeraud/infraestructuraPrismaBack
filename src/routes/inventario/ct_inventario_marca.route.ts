import { Router } from "express";
import { CtInventarioMarcaBaseController } from "../../controllers/inventario/ct_inventario_marca.controller";
import { validarRequest } from "../../middleware/validacion";
import {
  crearCtInventarioMarcaSchema,
  actualizarCtInventarioMarcaSchema,
  ctInventarioMarcaIdParamSchema,
  ctInventarioMarcaFiltrosSchema,
} from "../../schemas/inventario/ct_inventario_marca.schema";

//TODO ===== RUTAS PARA CT_INVENTARIO_MARCA CON BASE SERVICE =====

const router = Router();
const ctInventarioMarcaController = new CtInventarioMarcaBaseController();

// 📦 Obtener todas las marcas con filtros y paginación
router.get(
  "/",
  validarRequest({ query: ctInventarioMarcaFiltrosSchema }),
  ctInventarioMarcaController.obtenerTodasLasInventarioMarcas
);

// 📦 Obtener marca específica por ID
router.get(
  "/:id_ct_inventario_marca",
  validarRequest({ params: ctInventarioMarcaIdParamSchema }),
  ctInventarioMarcaController.obtenerInventarioMarcaPorId
);

// 📦 Crear nueva marca
router.post(
  "/",
  validarRequest({ body: crearCtInventarioMarcaSchema }),
  ctInventarioMarcaController.crearInventarioMarca
);

// 📦 Actualizar marca existente
router.put(
  "/:id_ct_inventario_marca",
  validarRequest({
    params: ctInventarioMarcaIdParamSchema,
    body: actualizarCtInventarioMarcaSchema,
  }),
  ctInventarioMarcaController.actualizarInventarioMarca
);

// 📦 Eliminar marca
router.delete(
  "/:id_ct_inventario_marca",
  validarRequest({ params: ctInventarioMarcaIdParamSchema }),
  ctInventarioMarcaController.eliminarInventarioMarca
);

export default router;

// 🎉 API REST completa para ct_inventario_marca:
// GET    /api/ct_inventario_marca     - Listar con filtros/paginación
// GET    /api/ct_inventario_marca/:id - Obtener por ID
// POST   /api/ct_inventario_marca     - Crear
// PUT    /api/ct_inventario_marca/:id - Actualizar
// DELETE /api/ct_inventario_marca/:id - Eliminar
