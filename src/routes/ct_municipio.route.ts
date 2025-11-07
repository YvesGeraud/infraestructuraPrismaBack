import { Router } from "express";
import { CtMunicipioBaseController } from "../controllers/ct_municipio.controller";
import { validarRequest } from "../middleware/validacion";
import {
  crearCtMunicipioSchema,
  actualizarCtMunicipioSchema,
  ctMunicipioIdParamSchema,
  ctMunicipioFiltrosSchema,
} from "../schemas/ct_municipio.schema";

//TODO ===== RUTAS PARA CT_MUNICIPIO CON BASE SERVICE =====

const router = Router();
const ctMunicipioController = new CtMunicipioBaseController();

// 📦 Obtener todas las entidades con filtros y paginación
router.get(
  "/",
  validarRequest({ query: ctMunicipioFiltrosSchema }),
  ctMunicipioController.obtenerTodasLasMunicipios
);

// 📦 Obtener entidad específica por ID
router.get(
  "/:id_ct_municipio",
  validarRequest({ params: ctMunicipioIdParamSchema }),
  ctMunicipioController.obtenerMunicipioPorId
);

// 📦 Crear nueva entidad
router.post(
  "/",
  validarRequest({ body: crearCtMunicipioSchema }),
  ctMunicipioController.crearMunicipio
);

// 📦 Actualizar entidad existente
router.put(
  "/:id_ct_municipio",
  validarRequest({
    params: ctMunicipioIdParamSchema,
    body: actualizarCtMunicipioSchema,
  }),
  ctMunicipioController.actualizarMunicipio
);

// 📦 Eliminar entidad
router.delete(
  "/:id_ct_municipio",
  validarRequest({ params: ctMunicipioIdParamSchema }),
  ctMunicipioController.eliminarMunicipio
);

export default router;

// 🎉 API REST completa para ct_entidad:
// GET    /api/ct_entidad          - Listar con filtros/paginación
// GET    /api/ct_entidad/:id      - Obtener por ID
// POST   /api/ct_entidad          - Crear
// PUT    /api/ct_entidad/:id      - Actualizar
// DELETE /api/ct_entidad/:id      - Eliminar
