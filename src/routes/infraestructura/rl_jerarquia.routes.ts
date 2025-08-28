import { Router } from "express";
import { RlJerarquiaBaseController } from "../../controllers/infraestructura/rl_jerarquia.controller";
import { validateRequest } from "../../middleware/validateRequest";
import {
  crearRlJerarquiaSchema,
  actualizarRlJerarquiaSchema,
  rlJerarquiaIdParamSchema,
  paginationSchema,
} from "../../schemas/infraestructura/rl_jerarquia.schema";

//TODO ===== RUTAS PARA RL_JERARQUIA CON BASE SERVICE =====

const router = Router();
const rlJerarquiaController = new RlJerarquiaBaseController();

// 📦 Obtener todas las jerarquías con filtros y paginación
router.get(
  "/",
  validateRequest({ query: paginationSchema }),
  rlJerarquiaController.obtenerTodasLasJerarquias
);

// 📦 Obtener jerarquía específica por ID
router.get(
  "/:id_jerarquia",
  validateRequest({ params: rlJerarquiaIdParamSchema }),
  rlJerarquiaController.obtenerJerarquiaPorId
);

// ========== RUTAS ESPECÍFICAS DE JERARQUÍA ==========

// 🔗 Obtener ruta completa desde un nodo hasta la raíz
router.get(
  "/:id_jerarquia/ruta",
  validateRequest({ params: rlJerarquiaIdParamSchema }),
  rlJerarquiaController.obtenerRutaJerarquia
);

// 🌳 Obtener todos los hijos directos de un nodo
router.get(
  "/:id_jerarquia/hijos",
  validateRequest({ params: rlJerarquiaIdParamSchema }),
  rlJerarquiaController.obtenerHijosJerarquia
);

// 🌲 Obtener árbol completo desde un nodo (recursivo)
router.get(
  "/:id_jerarquia/arbol",
  validateRequest({ params: rlJerarquiaIdParamSchema }),
  rlJerarquiaController.obtenerArbolJerarquia
);

// 🎯 Obtener nodo específico con información completa
router.get(
  "/:id_jerarquia/nodo",
  validateRequest({ params: rlJerarquiaIdParamSchema }),
  rlJerarquiaController.obtenerNodoJerarquia
);

// 📦 Crear nueva jerarquía
router.post(
  "/",
  validateRequest({ body: crearRlJerarquiaSchema }),
  rlJerarquiaController.crearJerarquia
);

// 📦 Actualizar jerarquía existente
router.put(
  "/:id_jerarquia",
  validateRequest({
    params: rlJerarquiaIdParamSchema,
    body: actualizarRlJerarquiaSchema,
  }),
  rlJerarquiaController.actualizarJerarquia
);

// 📦 Eliminar jerarquía
router.delete(
  "/:id_jerarquia",
  validateRequest({ params: rlJerarquiaIdParamSchema }),
  rlJerarquiaController.eliminarJerarquia
);

export default router;
