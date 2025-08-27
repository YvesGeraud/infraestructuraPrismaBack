import { z } from "zod";

//TODO ===== SCHEMAS PARA CT_COLOR =====
//? Esquemas para crear un nuevo color

export const crearCtColorSchema = z.object({
  descripcion: z
    .string()
    .min(2, "La descripción debe tener al menos 2 caracteres"),
});

//? Esquemas para actualizar un color
export const actualizarCtColorSchema = z.object({
  descripcion: z
    .string()
    .min(2, "La descripción debe tener al menos 2 caracteres"),
});

export { paginationSchema, idParamSchema } from "../commonSchemas";

export type CrearCtColorInput = z.infer<typeof crearCtColorSchema>;
export type ActualizarCtColorInput = z.infer<typeof actualizarCtColorSchema>;

export const ctColorIdParamSchema = z.object({
  id_color: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(
      z.number().int().positive("ID del color debe ser un número positivo")
    ),
});

export type CtColorIdParam = z.infer<typeof ctColorIdParamSchema>;
