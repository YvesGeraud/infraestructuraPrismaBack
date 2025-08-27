import { Router } from "express";
import { DiagnosticoController } from "../controllers/diagnosticoController";
/*import {
  verificarAutenticacion,
  verificarRoles,
} from "../middleware/authMiddleware";*/

const router = Router();
const diagnosticoController = new DiagnosticoController();

/**
 * @route GET /api/diagnostico
 * @desc Obtener diagnóstico básico del sistema
 * @access Privado (usuarios autenticados)
 */
router.get(
  "/",
  /*verificarAutenticacion,*/ (req, res) =>
    diagnosticoController.obtenerDiagnostico(req, res)
);

/**
 * @route GET /api/diagnostico/usuario
 * @desc Obtener información del usuario actual del sistema
 * @access Privado (usuarios autenticados)
 */
router.get(
  "/usuario",
  /*verificarAutenticacion,*/ (req, res) =>
    diagnosticoController.obtenerInfoUsuario(req, res)
);

/**
 * @route GET /api/diagnostico/permisos
 * @desc Verificar permisos del sistema (solo administradores)
 * @access Privado (solo ADMIN)
 */
router.get(
  "/permisos",
  /*verificarAutenticacion,*/
  /*verificarRoles("ADMIN"),*/
  (req, res) => diagnosticoController.verificarPermisos(req, res)
);

export { router as diagnosticoRoutes };
