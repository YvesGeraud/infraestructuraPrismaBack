import { z } from "zod";

//TODO ===== SCHEMAS PARA CT_ACCION =====
//? Esquemas para crear una nueva acción

export const crearCtAccionSchema = z.object({
  nombre_accion: z
    .string()
    .min(2, "El nombre de la acción debe tener al menos 2 caracteres"),
  descripcion: z
    .string()
    .min(2, "La descripción debe tener al menos 2 caracteres"),
});

//? Esquemas para actualizar una acción
export const actualizarCtAccionSchema = z.object({
  nombre_accion: z
    .string()
    .min(2, "El nombre de la acción debe tener al menos 2 caracteres"),
  descripcion: z
    .string()
    .min(2, "La descripción debe tener al menos 2 caracteres"),
});

export { paginationSchema, idParamSchema } from "./commonSchemas";

export type CrearCtAccionInput = z.infer<typeof crearCtAccionSchema>;
export type ActualizarCtAccionInput = z.infer<typeof actualizarCtAccionSchema>;

export const ctAccionIdParamSchema = z.object({
  id_accion: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(
      z.number().int().positive("ID de la acción debe ser un número positivo")
    ),
});

export type CtAccionIdParam = z.infer<typeof ctAccionIdParamSchema>;
