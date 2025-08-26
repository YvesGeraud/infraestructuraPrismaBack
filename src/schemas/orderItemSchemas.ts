import { z } from "zod";

// ===== SCHEMAS PARA ORDER ITEM =====
// Schema para crear un item individual de orden
export const crearOrderItemSchema = z.object({
  productId: z
    .number()
    .int()
    .positive("El ID del producto debe ser un número positivo"),
  quantity: z.number().int().min(1, "La cantidad debe ser al menos 1"),
  price: z
    .number()
    .positive("El precio debe ser un número positivo")
    .max(999999.99, "El precio no puede exceder 999,999.99")
    .transform((val) => Number(val.toFixed(2))), // Redondear a 2 decimales
});

// Schema para actualizar un item de orden
export const actualizarOrderItemSchema = z.object({
  quantity: z
    .number()
    .int()
    .min(1, "La cantidad debe ser al menos 1")
    .optional(),
  price: z
    .number()
    .positive("El precio debe ser un número positivo")
    .max(999999.99, "El precio no puede exceder 999,999.99")
    .transform((val) => Number(val.toFixed(2)))
    .optional(),
});

// Schema para validar ID de item en parámetros de ruta
export const orderItemIdParamSchema = z.object({
  id: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().positive("ID debe ser un número positivo")),
});

// ===== TIPOS INFERIDOS =====
export type CrearOrderItemInput = z.infer<typeof crearOrderItemSchema>;
export type ActualizarOrderItemInput = z.infer<
  typeof actualizarOrderItemSchema
>;
export type OrderItemIdParam = z.infer<typeof orderItemIdParamSchema>;
