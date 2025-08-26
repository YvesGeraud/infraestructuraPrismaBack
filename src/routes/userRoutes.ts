import { Router } from "express";
import { UserController } from "../controllers/userController";
import { validateBody, validateQuery } from "../middleware/validation";
import {
  verificarAutenticacion,
  verificarAdmin,
} from "../middleware/authMiddleware";
import {
  createUserSchema,
  updateUserSchema,
  changePasswordSchema,
  loginSchema,
  userFiltersSchema,
  paginationSchema,
} from "../schemas/userSchemas";

const router = Router();
const userController = new UserController();

/**
 * @route   POST /api/users
 * @desc    Crear un nuevo usuario
 * @access  Private (Admin)
 */
router.post(
  "/",
  verificarAutenticacion,
  verificarAdmin,
  validateBody(createUserSchema),
  userController.createUser.bind(userController)
);

/**
 * @route   GET /api/users/:id
 * @desc    Obtener usuario por ID
 * @access  Private
 */
router.get(
  "/:id",
  verificarAutenticacion,
  userController.getUserById.bind(userController)
);

/**
 * @route   GET /api/users
 * @desc    Obtener usuarios con filtros y paginación
 * @access  Public
 */
router.get(
  "/",
  /*verificarAutenticacion,
  verificarAdmin,*/
  validateQuery(userFiltersSchema.merge(paginationSchema)),
  userController.getUsers.bind(userController)
);

/**
 * @route   PUT /api/users/:id
 * @desc    Actualizar usuario
 * @access  Private
 */
router.put(
  "/:id",
  verificarAutenticacion,
  validateBody(updateUserSchema),
  userController.updateUser.bind(userController)
);

/**
 * @route   DELETE /api/users/:id
 * @desc    Eliminar usuario (soft delete)
 * @access  Private (Admin)
 */
router.delete(
  "/:id",
  verificarAutenticacion,
  verificarAdmin,
  userController.deleteUser.bind(userController)
);

/**
 * @route   POST /api/users/:id/change-password
 * @desc    Cambiar contraseña de usuario
 * @access  Private
 */
router.post(
  "/:id/change-password",
  verificarAutenticacion,
  validateBody(changePasswordSchema),
  userController.changePassword.bind(userController)
);

/**
 * @route   POST /api/users/verify-credentials
 * @desc    Verificar credenciales (login)
 * @access  Public
 */
router.post(
  "/verify-credentials",
  validateBody(loginSchema),
  userController.verifyCredentials.bind(userController)
);

export default router;
