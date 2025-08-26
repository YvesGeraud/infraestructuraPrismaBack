import { Request, Response } from "express";
import { OrderService } from "../services/orderService";
import {
  CrearOrderInput,
  ActualizarOrderInput,
  OrderFiltersInput,
} from "../schemas/orderSchemas";
import { PaginationInput } from "../schemas/userSchemas";
import { OrderIncludeOptions } from "../types/order";

const orderService = new OrderService();

export class OrderController {
  /**
   * Crear nueva orden
   * POST /api/orders
   */
  async crearOrder(req: Request, res: Response): Promise<void> {
    try {
      const orderData: CrearOrderInput = req.body;
      const includeOptions: OrderIncludeOptions = {
        includeUser: req.query.includeUser === "true",
        includeItems: req.query.includeItems === "true",
        includeProductInItems: req.query.includeProductInItems === "true",
      };

      const order = await orderService.CrearOrder(orderData, includeOptions);

      res.status(201).json({
        success: true,
        message: "Orden creada exitosamente",
        data: order,
      });
    } catch (error) {
      console.error("Error al crear orden:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
      });
    }
  }

  /**
   * Obtener orden por ID
   * GET /api/orders/:id
   */
  async obtenerOrderPorId(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const includeOptions: OrderIncludeOptions = {
        includeUser: req.query.includeUser === "true",
        includeItems: req.query.includeItems === "true",
        includeProductInItems: req.query.includeProductInItems === "true",
      };

      const order = await orderService.obtenerOrderPorId(id, includeOptions);

      if (!order) {
        res.status(404).json({
          success: false,
          message: "Orden no encontrada",
        });
        return;
      }

      res.json({
        success: true,
        data: order,
      });
    } catch (error) {
      console.error("Error al obtener orden:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
      });
    }
  }

  /**
   * Obtener órdenes con filtros, paginación y opciones de include
   * GET /api/orders
   */
  async obtenerOrdenes(req: Request, res: Response): Promise<void> {
    try {
      const filters: OrderFiltersInput = req.query as any;
      const pagination: PaginationInput = req.query as any;
      const includeOptions: OrderIncludeOptions = {
        includeUser: req.query.includeUser === "true",
        includeItems: req.query.includeItems === "true",
        includeProductInItems: req.query.includeProductInItems === "true",
      };

      const result = await orderService.obtenerOrdenes(
        filters,
        pagination,
        includeOptions
      );

      res.json({
        success: true,
        ...result,
      });
    } catch (error) {
      console.error("Error al obtener órdenes:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
      });
    }
  }

  /**
   * Obtener órdenes por usuario
   * GET /api/orders/user/:userId
   */
  async obtenerOrdenesPorUsuario(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.userId);
      const pagination: PaginationInput = req.query as any;
      const includeOptions: OrderIncludeOptions = {
        includeUser: req.query.includeUser === "true",
        includeItems: req.query.includeItems === "true",
        includeProductInItems: req.query.includeProductInItems === "true",
      };

      const result = await orderService.obtenerOrdenesPorUsuario(
        userId,
        pagination,
        includeOptions
      );

      res.json({
        success: true,
        ...result,
      });
    } catch (error) {
      console.error("Error al obtener órdenes del usuario:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
      });
    }
  }

  /**
   * Actualizar orden
   * PUT /api/orders/:id
   */
  async actualizarOrder(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const orderData: ActualizarOrderInput = req.body;
      const includeOptions: OrderIncludeOptions = {
        includeUser: req.query.includeUser === "true",
        includeItems: req.query.includeItems === "true",
        includeProductInItems: req.query.includeProductInItems === "true",
      };

      const order = await orderService.actualizarOrder(
        id,
        orderData,
        includeOptions
      );

      res.json({
        success: true,
        message: "Orden actualizada exitosamente",
        data: order,
      });
    } catch (error) {
      console.error("Error al actualizar orden:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
      });
    }
  }

  /**
   * Eliminar orden (soft delete)
   * DELETE /api/orders/:id
   */
  async eliminarOrder(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);

      await orderService.eliminarOrder(id);

      res.json({
        success: true,
        message: "Orden eliminada exitosamente",
      });
    } catch (error) {
      console.error("Error al eliminar orden:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
      });
    }
  }

  /**
   * Obtener estadísticas de órdenes
   * GET /api/orders/stats
   */
  async obtenerEstadisticas(req: Request, res: Response): Promise<void> {
    try {
      const stats = await orderService.obtenerEstadisticas();

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      console.error("Error al obtener estadísticas:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
      });
    }
  }
}
