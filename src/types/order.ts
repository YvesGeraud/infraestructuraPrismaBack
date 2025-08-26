import { Order, User, OrderItem, Product } from "@prisma/client";

// Tipos para respuestas con relaciones
export type OrderWithUser = Order & {
  user: User;
};

export type OrderWithItems = Order & {
  items: (OrderItem & {
    product: Product;
  })[];
};

export type OrderWithUserAndItems = Order & {
  user: User;
  items: (OrderItem & {
    product: Product;
  })[];
};

// Tipo principal para respuestas de orden
export type OrderResponse = OrderWithUserAndItems;

// Tipo para estadísticas
export type OrderStats = {
  totalOrdenes: number;
  ordenesPendientes: number;
  ordenesConfirmadas: number;
  ordenesEnviadas: number;
  ordenesEntregadas: number;
  ordenesCanceladas: number;
  totalVentas: number;
};

// Tipos para filtros de includes
export interface OrderIncludeOptions {
  includeUser?: boolean;
  includeItems?: boolean;
  includeProductInItems?: boolean;
}

// Tipo para respuesta dinámica basada en includes
export type OrderResponseWithIncludes = Order &
  (OrderIncludeOptions["includeUser"] extends true ? { user: User } : {}) &
  (OrderIncludeOptions["includeItems"] extends true
    ? {
        items: (OrderItem &
          (OrderIncludeOptions["includeProductInItems"] extends true
            ? { product: Product }
            : {}))[];
      }
    : {});
