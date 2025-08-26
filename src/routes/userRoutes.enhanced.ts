import { Router } from "express";
import { UserController } from "../controllers/userController";
import { validateRequest } from "../middleware/validateRequest";
import { asyncHandler } from "../middleware/errorHandler";
import { authLimiter, createResourceLimiter } from "../middleware/rateLimiter";
import {
  createUserSchema,
  updateUserSchema,
  changePasswordSchema,
  loginSchema,
  userFiltersSchema,
  paginationSchema,
  idParamSchema,
} from "../schemas/userSchemas";

const router = Router();
const userController = new UserController();

// Crear usuario con rate limiting y validación
router.post(
  "/",
  createResourceLimiter, // Rate limiting para creación
  validateRequest({
    body: createUserSchema,
  }),
  asyncHandler(userController.createUser.bind(userController))
);

// Obtener usuario por ID
router.get(
  "/:id",
  validateRequest({
    params: idParamSchema,
  }),
  asyncHandler(userController.getUserById.bind(userController))
);

// Obtener usuarios con filtros y paginación
router.get(
  "/",
  validateRequest({
    query: userFiltersSchema.merge(paginationSchema),
  }),
  asyncHandler(userController.getUsers.bind(userController))
);

// Actualizar usuario
router.put(
  "/:id",
  validateRequest({
    params: idParamSchema,
    body: updateUserSchema,
  }),
  asyncHandler(userController.updateUser.bind(userController))
);

// Eliminar usuario
router.delete(
  "/:id",
  validateRequest({
    params: idParamSchema,
  }),
  asyncHandler(userController.deleteUser.bind(userController))
);

// Cambiar contraseña con rate limiting
router.post(
  "/:id/change-password",
  authLimiter, // Rate limiting para operaciones de autenticación
  validateRequest({
    params: idParamSchema,
    body: changePasswordSchema,
  }),
  asyncHandler(userController.changePassword.bind(userController))
);

// Verificar credenciales con rate limiting
router.post(
  "/verify-credentials",
  authLimiter, // Rate limiting estricto para login
  validateRequest({
    body: loginSchema,
  }),
  asyncHandler(userController.verifyCredentials.bind(userController))
);

export default router;
