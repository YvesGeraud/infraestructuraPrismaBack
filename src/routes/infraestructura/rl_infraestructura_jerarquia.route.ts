import { Router } from "express";
import { RlInfraestructuraJerarquiaBaseController } from "../../controllers/infraestructura/rl_infraestructura_jerarquia.controller";
import { validarRequest } from "../../middleware/validacion";
import { verificarAutenticacion } from "../../middleware/authMiddleware";
import {
  crearRlInfraestructuraJerarquiaSchema,
  actualizarRlInfraestructuraJerarquiaSchema,
  rlInfraestructuraJerarquiaIdParamSchema,
  rlInfraestructuraJerarquiaFiltrosSchema,
} from "../../schemas/infraestructura/rl_infraestructura_jerarquia.schema";

// ===== RUTAS PARA RL_INFRAESTRUCTURA_JERARQUIA CON BASE SERVICE =====

const router = Router();
const rlInfraestructuraJerarquiaController =
  new RlInfraestructuraJerarquiaBaseController();

// 📦 Obtener todas las jerarquías con filtros y paginación
router.get(
  "/",
  validarRequest({ query: rlInfraestructuraJerarquiaFiltrosSchema }),
  rlInfraestructuraJerarquiaController.obtenerTodasLasJerarquias
);

// 📊 Obtener cadena completa de dependencias (debe ir antes de la ruta genérica)
router.get(
  "/:id_rl_infraestructura_jerarquia/cadena",
  validarRequest({ params: rlInfraestructuraJerarquiaIdParamSchema }),
  rlInfraestructuraJerarquiaController.obtenerCadenaCompletaDependencias
);

// 📦 Obtener jerarquía específica por ID
router.get(
  "/:id_rl_infraestructura_jerarquia",
  validarRequest({ params: rlInfraestructuraJerarquiaIdParamSchema }),
  rlInfraestructuraJerarquiaController.obtenerJerarquiaPorId
);

// 📦 Crear nueva jerarquía (requiere autenticación)
router.post(
  "/",
  verificarAutenticacion, // 🔐 Middleware de autenticación OBLIGATORIO
  validarRequest({ body: crearRlInfraestructuraJerarquiaSchema }),
  rlInfraestructuraJerarquiaController.crearJerarquia
);

// 📦 Actualizar jerarquía existente (requiere autenticación)
router.put(
  "/:id_rl_infraestructura_jerarquia",
  verificarAutenticacion, // 🔐 Middleware de autenticación OBLIGATORIO
  validarRequest({
    params: rlInfraestructuraJerarquiaIdParamSchema,
    body: actualizarRlInfraestructuraJerarquiaSchema,
  }),
  rlInfraestructuraJerarquiaController.actualizarJerarquia
);

// 📦 Eliminar jerarquía (requiere autenticación)
router.delete(
  "/:id_rl_infraestructura_jerarquia",
  verificarAutenticacion, // 🔐 Middleware de autenticación OBLIGATORIO
  validarRequest({
    params: rlInfraestructuraJerarquiaIdParamSchema,
  }),
  rlInfraestructuraJerarquiaController.eliminarJerarquia
);

export default router;

/*
🎉 API REST completa para rl_infraestructura_jerarquia:
GET    /api/rl_infraestructura_jerarquia                  - Listar con filtros/paginación (público)
GET    /api/rl_infraestructura_jerarquia/:id              - Obtener por ID (público)
GET    /api/rl_infraestructura_jerarquia/:id/cadena       - Obtener cadena completa de dependencias (público)
POST   /api/rl_infraestructura_jerarquia                  - Crear (🔐 requiere auth)
PUT    /api/rl_infraestructura_jerarquia/:id              - Actualizar (🔐 requiere auth)
DELETE /api/rl_infraestructura_jerarquia/:id              - Eliminar (🔐 requiere auth)

📊 Query Parameters soportados:
- id_instancia: Filtrar por ID de instancia
- id_ct_infraestructura_tipo_instancia: Filtrar por tipo
- id_dependencia: Filtrar por dependencia (null para nivel superior)
- incluir_tipo_instancia: Incluir información del tipo de instancia
- incluir_dependencia: Incluir información de la dependencia (solo en GET por ID)
- pagina: Número de página (default: 1)
- limite: Elementos por página (default: 10)

💡 Ejemplos:
GET /api/rl_infraestructura_jerarquia?id_instancia=5&incluir_tipo_instancia=true
GET /api/rl_infraestructura_jerarquia/10?incluir_dependencia=true
GET /api/rl_infraestructura_jerarquia?id_dependencia=null (jerarquías de nivel superior)
*/
