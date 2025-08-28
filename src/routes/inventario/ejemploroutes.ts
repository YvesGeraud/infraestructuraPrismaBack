import { Router } from "express";
import { CtMarcaBaseController } from "../../controllers/inventario/ejemplocontroller";
import { validateRequest } from "../../middleware/validateRequest";
import {
  crearCtMarcaSchema,
  actualizarCtMarcaSchema,
  ctMarcaIdParamSchema,
  paginationSchema,
} from "../../schemas/inventario/ct_marca.schema";

//TODO ===== RUTAS PARA CT_MARCA CON BASE SERVICE =====

const router = Router();
const ctMarcaController = new CtMarcaBaseController();

// 📦 Obtener todas las marcas con filtros y paginación
router.get(
  "/",
  validateRequest({ query: paginationSchema }),
  ctMarcaController.obtenerTodasLasMarcas
);

// 📦 Obtener marca específica por ID
router.get(
  "/:id_marca",
  validateRequest({ params: ctMarcaIdParamSchema }),
  ctMarcaController.obtenerMarcaPorId
);

// 📦 Crear nueva marca
router.post(
  "/",
  validateRequest({ body: crearCtMarcaSchema }),
  ctMarcaController.crearMarca
);

// 📦 Actualizar marca existente
router.put(
  "/:id_marca",
  validateRequest({
    params: ctMarcaIdParamSchema,
    body: actualizarCtMarcaSchema,
  }),
  ctMarcaController.actualizarMarca
);

// 📦 Eliminar marca
router.delete(
  "/:id_marca",
  validateRequest({ params: ctMarcaIdParamSchema }),
  ctMarcaController.eliminarMarca
);

export default router;

// 🎉 API REST completa para ct_marca:
// GET    /api/inventario/marca          - Listar con filtros/paginación
// GET    /api/inventario/marca/:id      - Obtener por ID
// POST   /api/inventario/marca          - Crear
// PUT    /api/inventario/marca/:id      - Actualizar
// DELETE /api/inventario/marca/:id      - Eliminar
