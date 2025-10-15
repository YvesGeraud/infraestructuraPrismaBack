import { Router } from "express";
import { CtInfraestructuraAnexoBaseController } from "../../controllers/infraestructura/ct_infraestructura_anexo.controller";
import { validarRequest } from "../../middleware/validacion";
import {
  crearCtInfraestructuraAnexoSchema,
  actualizarCtInfraestructuraAnexoSchema,
  ctInfraestructuraAnexoIdParamSchema,
  ctInfraestructuraAnexoFiltrosSchema,
} from "../../schemas/infraestructura/ct_infraestructura_anexo.schema";

//TODO ===== RUTAS PARA CT_INFRAESTRUCTURA_ANEXO CON BASE SERVICE =====

const router = Router();
const ctInfraestructuraAnexoController = new CtInfraestructuraAnexoBaseController();

// 📦 Obtener todos los anexos con filtros y paginación
router.get(
  "/",
  validarRequest({ query: ctInfraestructuraAnexoFiltrosSchema }),
  ctInfraestructuraAnexoController.obtenerTodosLosAnexos
);

// 📦 Obtener anexo específico por ID
router.get(
  "/:id_ct_infraestructura_anexo",
  validarRequest({ params: ctInfraestructuraAnexoIdParamSchema }),
  ctInfraestructuraAnexoController.obtenerAnexoPorId
);

// 📦 Crear nuevo anexo
router.post(
  "/",
  validarRequest({ body: crearCtInfraestructuraAnexoSchema }),
  ctInfraestructuraAnexoController.crearAnexo
);

// 📦 Actualizar anexo existente
router.put(
  "/:id_ct_infraestructura_anexo",
  validarRequest({
    params: ctInfraestructuraAnexoIdParamSchema,
    body: actualizarCtInfraestructuraAnexoSchema,
  }),
  ctInfraestructuraAnexoController.actualizarAnexo
);

// 📦 Eliminar anexo
router.delete(
  "/:id_ct_infraestructura_anexo",
  validarRequest({ params: ctInfraestructuraAnexoIdParamSchema }),
  ctInfraestructuraAnexoController.eliminarAnexo
);

export default router;

// 🎉 API REST completa para ct_infraestructura_anexo:
// GET    /api/ct_infraestructura_anexo     - Listar con filtros/paginación
// GET    /api/ct_infraestructura_anexo/:id - Obtener por ID
// POST   /api/ct_infraestructura_anexo     - Crear
// PUT    /api/ct_infraestructura_anexo/:id - Actualizar
// DELETE /api/ct_infraestructura_anexo/:id - Eliminar
//
// 📝 Filtros disponibles en GET /api/ct_infraestructura_anexo:
// - nombre: Filtrar por nombre (búsqueda parcial)
// - cct: Filtrar por CCT (búsqueda parcial)
// - id_dt_infraestructura_ubicacion: Filtrar por ubicación
// - incluir_ubicacion: Incluir datos de la ubicación
