import { Router } from "express";
import { EmailController } from "../controllers/emailController";
import { asyncHandler } from "../middleware/errorHandler";
import { verificarAutenticacion, verificarAdmin } from "../middleware/authMiddleware";

const router = Router();
const emailController = new EmailController();

/**
 * @route   GET /api/emails/estado
 * @desc    Obtener estado del servicio de email
 * @access  Admin
 */
router.get(
  "/estado",
  verificarAutenticacion,
  verificarAdmin,
  asyncHandler(emailController.obtenerEstado.bind(emailController))
);

/**
 * @route   GET /api/emails/estadisticas
 * @desc    Obtener estadísticas del servicio de email
 * @access  Admin
 */
router.get(
  "/estadisticas",
  verificarAutenticacion,
  verificarAdmin,
  asyncHandler(emailController.obtenerEstadisticas.bind(emailController))
);

/**
 * @route   GET /api/emails/plantillas
 * @desc    Obtener plantillas disponibles
 * @access  Admin
 */
router.get(
  "/plantillas",
  verificarAutenticacion,
  verificarAdmin,
  asyncHandler(emailController.obtenerPlantillas.bind(emailController))
);

/**
 * @route   GET /api/emails/configuracion
 * @desc    Obtener configuración del servicio
 * @access  Admin
 */
router.get(
  "/configuracion",
  verificarAutenticacion,
  verificarAdmin,
  asyncHandler(emailController.obtenerConfiguracion.bind(emailController))
);

/**
 * @route   POST /api/emails/enviar
 * @desc    Enviar email simple
 * @access  Admin
 */
router.post(
  "/enviar",
  verificarAutenticacion,
  verificarAdmin,
  asyncHandler(emailController.enviarEmail.bind(emailController))
);

/**
 * @route   POST /api/emails/enviar-plantilla
 * @desc    Enviar email con plantilla
 * @access  Admin
 */
router.post(
  "/enviar-plantilla",
  verificarAutenticacion,
  verificarAdmin,
  asyncHandler(emailController.enviarEmailConPlantilla.bind(emailController))
);

/**
 * @route   POST /api/emails/bienvenida
 * @desc    Enviar email de bienvenida
 * @access  Admin
 */
router.post(
  "/bienvenida",
  verificarAutenticacion,
  verificarAdmin,
  asyncHandler(emailController.enviarEmailBienvenida.bind(emailController))
);

/**
 * @route   POST /api/emails/confirmacion
 * @desc    Enviar email de confirmación
 * @access  Admin
 */
router.post(
  "/confirmacion",
  verificarAutenticacion,
  verificarAdmin,
  asyncHandler(emailController.enviarEmailConfirmacion.bind(emailController))
);

/**
 * @route   POST /api/emails/reset-password
 * @desc    Enviar email de reset de contraseña
 * @access  Admin
 */
router.post(
  "/reset-password",
  verificarAutenticacion,
  verificarAdmin,
  asyncHandler(emailController.enviarEmailResetPassword.bind(emailController))
);

/**
 * @route   POST /api/emails/notificacion
 * @desc    Enviar email de notificación
 * @access  Admin
 */
router.post(
  "/notificacion",
  verificarAutenticacion,
  verificarAdmin,
  asyncHandler(emailController.enviarEmailNotificacion.bind(emailController))
);

/**
 * @route   POST /api/emails/masivo
 * @desc    Enviar email masivo
 * @access  Admin
 */
router.post(
  "/masivo",
  verificarAutenticacion,
  verificarAdmin,
  asyncHandler(emailController.enviarEmailMasivo.bind(emailController))
);

/**
 * @route   POST /api/emails/probar-conexion
 * @desc    Probar conexión SMTP
 * @access  Admin
 */
router.post(
  "/probar-conexion",
  verificarAutenticacion,
  verificarAdmin,
  asyncHandler(emailController.probarConexion.bind(emailController))
);

/**
 * @route   POST /api/emails/reinicializar
 * @desc    Reinicializar el servicio de email
 * @access  Admin
 */
router.post(
  "/reinicializar",
  verificarAutenticacion,
  verificarAdmin,
  asyncHandler(emailController.reinicializarServicio.bind(emailController))
);

export default router;
