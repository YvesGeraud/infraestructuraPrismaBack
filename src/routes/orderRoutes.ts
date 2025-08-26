import { Router } from "express";
import { OrderController } from "../controllers/orderController";
import { z } from "zod";
import { validateRequest } from "../middleware/validateRequest";
import { asyncHandler } from "../middleware/errorHandler";
import {
  verificarAutenticacion,
  verificarAdmin,
  autenticacionOpcional,
} from "../middleware/authMiddleware";
import {
  crearOrderSchema,
  actualizarOrderSchema,
  orderFiltersSchema,
  orderIdParamSchema,
  paginationSchema,
} from "../schemas/orderSchemas";

const router = Router();
const orderController = new OrderController();

/**
 * @route   POST /api/orders
 * @desc    Crear nueva orden
 * @access  Private
 */
router.post(
  "/",
  verificarAutenticacion,
  validateRequest({
    body: crearOrderSchema,
  }),
  asyncHandler(orderController.crearOrder.bind(orderController))
);

/**
 * @route   GET /api/orders/stats
 * @desc    Obtener estadísticas de órdenes
 * @access  Private (Admin)
 */
router.get(
  "/stats",
  verificarAutenticacion,
  verificarAdmin,
  asyncHandler(orderController.obtenerEstadisticas.bind(orderController))
);

/**
 * @route   GET /api/orders/user/:userId
 * @desc    Obtener órdenes por usuario
 * @access  Private
 */
router.get(
  "/user/:userId",
  verificarAutenticacion,
  validateRequest({
    params: z.object({ userId: orderIdParamSchema.shape.id }),
    query: paginationSchema,
  }),
  asyncHandler(orderController.obtenerOrdenesPorUsuario.bind(orderController))
);

/**
 * @route   GET /api/orders/:id
 * @desc    Obtener orden por ID
 * @access  Private
 */
router.get(
  "/:id",
  verificarAutenticacion,
  validateRequest({
    params: orderIdParamSchema,
  }),
  asyncHandler(orderController.obtenerOrderPorId.bind(orderController))
);

/**
 * @route   GET /api/orders
 * @desc    Obtener órdenes con filtros y paginación
 * @access  Private
 */
router.get(
  "/",
  /*verificarAutenticacion,*/
  validateRequest({
    query: orderFiltersSchema.merge(paginationSchema),
  }),
  asyncHandler(orderController.obtenerOrdenes.bind(orderController))
);

/**
 * @route   PUT /api/orders/:id
 * @desc    Actualizar orden
 * @access  Private (Admin)
 */
router.put(
  "/:id",
  verificarAutenticacion,
  verificarAdmin,
  validateRequest({
    params: orderIdParamSchema,
    body: actualizarOrderSchema,
  }),
  asyncHandler(orderController.actualizarOrder.bind(orderController))
);

/**
 * @route   DELETE /api/orders/:id
 * @desc    Eliminar orden (soft delete)
 * @access  Private (Admin)
 */
router.delete(
  "/:id",
  verificarAutenticacion,
  verificarAdmin,
  validateRequest({
    params: orderIdParamSchema,
  }),
  asyncHandler(orderController.eliminarOrder.bind(orderController))
);

export default router;
