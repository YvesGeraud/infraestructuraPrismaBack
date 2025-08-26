import { z } from "zod";
import { crearOrderItemSchema } from "./orderItemSchemas";

// ===== ENUM DE ESTADOS =====
// Usamos el enum de Prisma para mantener consistencia
export const OrderStatusEnum = z.enum([
  "PENDIENTE",
  "CONFIRMADO",
  "ENVIADO",
  "ENTREGADO",
  "CANCELADO",
]);

// ===== SCHEMAS PARA ORDER =====
// Schema para crear una orden (solo los campos de la tabla Order)
export const crearOrderSchema = z.object({
  userId: z
    .number()
    .int()
    .positive("El ID del usuario debe ser un número positivo"),
  status: OrderStatusEnum.default("PENDIENTE"),
  // NOTA: total se calcula automáticamente en el servicio
  // NOTA: items se maneja por separado en el servicio
});

// Schema para crear una orden completa con items (para input de API)
export const crearOrderCompletaSchema = z.object({
  userId: z
    .number()
    .int()
    .positive("El ID del usuario debe ser un número positivo"),
  status: OrderStatusEnum.default("PENDIENTE"),
  items: z
    .array(crearOrderItemSchema)
    .min(1, "La orden debe tener al menos un item")
    .max(50, "La orden no puede tener más de 50 items"),
});

// Schema para actualizar una orden
export const actualizarOrderSchema = z.object({
  status: OrderStatusEnum.optional(),
});

// ===== SCHEMAS PARA CONSULTAS =====
// Schema para filtrar órdenes
export const orderFiltersSchema = z.object({
  status: OrderStatusEnum.optional(),
  userId: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().positive())
    .optional(),
  fechaInicio: z.string().datetime().optional(),
  fechaFin: z.string().datetime().optional(),
  search: z.string().optional(),
  // Parámetros de include - sin transform, solo permitir que pasen
  includeUser: z.string().optional(),
  includeItems: z.string().optional(),
  includeProductInItems: z.string().optional(),
});

// Reutilizamos paginationSchema de userSchemas
export { paginationSchema } from "./userSchemas";

// Schema para validar ID de orden en parámetros de ruta
export const orderIdParamSchema = z.object({
  id: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().positive("ID debe ser un número positivo")),
});

// ===== TIPOS INFERIDOS =====
export type CrearOrderInput = z.infer<typeof crearOrderSchema>;
export type CrearOrderCompletaInput = z.infer<typeof crearOrderCompletaSchema>;
export type ActualizarOrderInput = z.infer<typeof actualizarOrderSchema>;
export type OrderFiltersInput = z.infer<typeof orderFiltersSchema>;
export type OrderIdParam = z.infer<typeof orderIdParamSchema>;
export type OrderStatus = z.infer<typeof OrderStatusEnum>;
