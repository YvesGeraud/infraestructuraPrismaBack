import { z } from "zod";

//TODO ===== SCHEMAS PARA CT_MARCA =====
//? Esquemas para crear un nuevo marca

export const crearCtMarcaSchema = z.object({
  descripcion: z
    .string()
    .min(2, "La descripción debe tener al menos 2 caracteres"),
});

//? Esquemas para actualizar un marca
export const actualizarCtMarcaSchema = z.object({
  descripcion: z
    .string()
    .min(2, "La descripción debe tener al menos 2 caracteres"),
});

export { paginationSchema, idParamSchema } from "../commonSchemas";

export type CrearCtMarcaInput = z.infer<typeof crearCtMarcaSchema>;
export type ActualizarCtMarcaInput = z.infer<typeof actualizarCtMarcaSchema>;

export const ctMarcaIdParamSchema = z.object({
  id_marca: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(
      z.number().int().positive("ID del marca debe ser un número positivo")
    ),
});

export type CtMarcaIdParam = z.infer<typeof ctMarcaIdParamSchema>;
