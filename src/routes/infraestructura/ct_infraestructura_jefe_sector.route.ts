import { Router } from "express";
import { CtInfraestructuraJefeSectorBaseController } from "../../controllers/infraestructura/ct_infraestructura_jefe_sector.controller";
import { validarRequest } from "../../middleware/validacion";
import {
  crearCtInfraestructuraJefeSectorSchema,
  actualizarCtInfraestructuraJefeSectorSchema,
  ctInfraestructuraJefeSectorIdParamSchema,
  ctInfraestructuraJefeSectorFiltrosSchema,
} from "../../schemas/infraestructura/ct_infraestructura_jefe_sector.schema";

//TODO ===== RUTAS PARA CT_INFRAESTRUCTURA_JEFE_SECTOR CON BASE SERVICE =====

const router = Router();
const ctInfraestructuraJefeSectorController = new CtInfraestructuraJefeSectorBaseController();

// 📦 Obtener todos los jefes de sector con filtros y paginación
router.get(
  "/",
  validarRequest({ query: ctInfraestructuraJefeSectorFiltrosSchema }),
  ctInfraestructuraJefeSectorController.obtenerTodosLosJefesSector
);

// 📦 Obtener jefe de sector específico por ID
router.get(
  "/:id_ct_infraestructura_jefe_sector",
  validarRequest({ params: ctInfraestructuraJefeSectorIdParamSchema }),
  ctInfraestructuraJefeSectorController.obtenerJefeSectorPorId
);

// 📦 Crear nuevo jefe de sector
router.post(
  "/",
  validarRequest({ body: crearCtInfraestructuraJefeSectorSchema }),
  ctInfraestructuraJefeSectorController.crearJefeSector
);

// 📦 Actualizar jefe de sector existente
router.put(
  "/:id_ct_infraestructura_jefe_sector",
  validarRequest({
    params: ctInfraestructuraJefeSectorIdParamSchema,
    body: actualizarCtInfraestructuraJefeSectorSchema,
  }),
  ctInfraestructuraJefeSectorController.actualizarJefeSector
);

// 📦 Eliminar jefe de sector
router.delete(
  "/:id_ct_infraestructura_jefe_sector",
  validarRequest({ params: ctInfraestructuraJefeSectorIdParamSchema }),
  ctInfraestructuraJefeSectorController.eliminarJefeSector
);

export default router;

// 🎉 API REST completa para ct_infraestructura_jefe_sector:
// GET    /api/ct_infraestructura_jefe_sector     - Listar con filtros/paginación
// GET    /api/ct_infraestructura_jefe_sector/:id - Obtener por ID
// POST   /api/ct_infraestructura_jefe_sector     - Crear
// PUT    /api/ct_infraestructura_jefe_sector/:id - Actualizar
// DELETE /api/ct_infraestructura_jefe_sector/:id - Eliminar
//
// 📝 Filtros disponibles en GET /api/ct_infraestructura_jefe_sector:
// - nombre: Filtrar por nombre (búsqueda parcial)
// - cct: Filtrar por CCT (búsqueda parcial)
// - id_dt_infraestructura_ubicacion: Filtrar por ubicación
// - incluir_ubicacion: Incluir datos de la ubicación
