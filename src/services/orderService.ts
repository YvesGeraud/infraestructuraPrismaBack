import { Order, OrderStatus } from "@prisma/client";
import { prisma } from "../config/database";
import { PaginationParams, PaginatedResponse } from "../types";
import {
  CrearOrderInput,
  ActualizarOrderInput,
  OrderFiltersInput,
} from "../schemas/orderSchemas";
import {
  OrderResponse,
  OrderStats,
  OrderIncludeOptions,
  OrderResponseWithIncludes,
} from "../types/order";

export class OrderService {
  // Constantes para opciones de include por defecto
  private static readonly DEFAULT_INCLUDE_ALL: OrderIncludeOptions = {
    includeUser: true,
    includeItems: true,
    includeProductInItems: true,
  };

  /**
   * Construir objeto include basado en las opciones
   */
  private construirInclude(options: OrderIncludeOptions = {}): any {
    const include: Record<string, any> = {};

    if (options.includeUser) {
      include.user = true;
    }

    if (options.includeItems) {
      include.items = options.includeProductInItems
        ? { include: { product: true } }
        : true;
    }

    return Object.keys(include).length > 0 ? include : undefined;
  }

  /**
   * Construir where clause para búsquedas con relaciones
   */
  private construirWhereConBusqueda(
    filters: OrderFiltersInput,
    includeUser: boolean = false
  ): any {
    const where: Record<string, any> = {};

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.userId) {
      where.userId = filters.userId;
    }

    if (filters.fechaInicio || filters.fechaFin) {
      where.createdAt = {};
      if (filters.fechaInicio) {
        where.createdAt.gte = new Date(filters.fechaInicio);
      }
      if (filters.fechaFin) {
        where.createdAt.lte = new Date(filters.fechaFin);
      }
    }

    if (filters.search) {
      where.OR = includeUser
        ? [
            { user: { firstName: { contains: filters.search } } },
            { user: { lastName: { contains: filters.search } } },
            { user: { email: { contains: filters.search } } },
            { status: { contains: filters.search } },
          ]
        : [
            { status: { contains: filters.search } },
            // Si no incluye user, solo busca en campos básicos
          ];
    }

    return where;
  }

  /**
   * Crear respuesta paginada estándar
   */
  private crearRespuestaPaginada<T>(
    data: T[],
    total: number,
    page: number,
    limit: number
  ): PaginatedResponse<T> {
    const totalPages = Math.ceil(total / limit);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  /**
   * Crear nueva orden
   */
  async CrearOrder(
    orderData: CrearOrderInput,
    includeOptions: OrderIncludeOptions = OrderService.DEFAULT_INCLUDE_ALL
  ): Promise<OrderResponseWithIncludes> {
    const order = await prisma.order.create({
      data: {
        userId: orderData.userId,
        status: orderData.status || "PENDIENTE",
        total: 0, // Se calculará después con los items
      },
      include: this.construirInclude(includeOptions),
    });
    return order;
  }

  /**
   * Obtener orden por ID con opciones de include
   */
  async obtenerOrderPorId(
    id: number,
    includeOptions: OrderIncludeOptions = OrderService.DEFAULT_INCLUDE_ALL
  ): Promise<OrderResponseWithIncludes | null> {
    return await prisma.order.findUnique({
      where: { id },
      include: this.construirInclude(includeOptions),
    });
  }

  /**
   * Obtener órdenes con paginación, filtros y opciones de include
   */
  async obtenerOrdenes(
    filters: OrderFiltersInput = {},
    pagination: PaginationParams = {},
    includeOptions: OrderIncludeOptions = {}
  ): Promise<PaginatedResponse<OrderResponseWithIncludes>> {
    const page = pagination.page || 1;
    const limit = pagination.limit || 10;
    const skip = (page - 1) * limit;

    const where = this.construirWhereConBusqueda(
      filters,
      includeOptions.includeUser
    );
    const include = this.construirInclude(includeOptions);

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include,
      }),
      prisma.order.count({ where }),
    ]);

    return this.crearRespuestaPaginada(orders, total, page, limit);
  }

  /**
   * Obtener órdenes por usuario con opciones de include
   */
  async obtenerOrdenesPorUsuario(
    userId: number,
    pagination: PaginationParams = {},
    includeOptions: OrderIncludeOptions = {}
  ): Promise<PaginatedResponse<OrderResponseWithIncludes>> {
    const page = pagination.page || 1;
    const limit = pagination.limit || 10;
    const skip = (page - 1) * limit;

    const where = { userId };
    const include = this.construirInclude(includeOptions);

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include,
      }),
      prisma.order.count({ where }),
    ]);

    return this.crearRespuestaPaginada(orders, total, page, limit);
  }

  /**
   * Actualizar orden con opciones de include
   */
  async actualizarOrder(
    id: number,
    orderData: ActualizarOrderInput,
    includeOptions: OrderIncludeOptions = OrderService.DEFAULT_INCLUDE_ALL
  ): Promise<OrderResponseWithIncludes> {
    return await prisma.order.update({
      where: { id },
      data: orderData,
      include: this.construirInclude(includeOptions),
    });
  }

  /**
   * Eliminar orden (soft delete)
   */
  async eliminarOrder(id: number): Promise<void> {
    // Para soft delete, podrías cambiar el status a CANCELADO
    await prisma.order.update({
      where: { id },
      data: { status: "CANCELADO" },
    });
  }

  /**
   * Obtener estadísticas de órdenes
   */
  async obtenerEstadisticas(): Promise<OrderStats> {
    const [
      totalOrdenes,
      ordenesPendientes,
      ordenesConfirmadas,
      ordenesEnviadas,
      ordenesEntregadas,
      ordenesCanceladas,
      totalVentas,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: "PENDIENTE" } }),
      prisma.order.count({ where: { status: "CONFIRMADO" } }),
      prisma.order.count({ where: { status: "ENVIADO" } }),
      prisma.order.count({ where: { status: "ENTREGADO" } }),
      prisma.order.count({ where: { status: "CANCELADO" } }),
      prisma.order.aggregate({
        where: { status: { not: "CANCELADO" } },
        _sum: { total: true },
      }),
    ]);

    return {
      totalOrdenes,
      ordenesPendientes,
      ordenesConfirmadas,
      ordenesEnviadas,
      ordenesEntregadas,
      ordenesCanceladas,
      totalVentas: Number(totalVentas._sum.total ?? 0) || 0,
    };
  }
}
