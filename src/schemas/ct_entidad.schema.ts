import { z } from "zod";

//TODO ===== SCHEMAS PARA CT_ENTIDAD =====
//? Esquemas para crear una nueva entidad

export const crearCtEntidadSchema = z.object({
  nombre: z
    .string()
    .min(2, "El nombre de la entidad debe tener al menos 2 caracteres"),
  abreviatura: z
    .string()
    .min(2, "La abreviatura debe tener al menos 2 caracteres"),
});

//? Esquemas para actualizar una acción
export const actualizarCtEntidadSchema = z.object({
  nombre: z
    .string()
    .min(2, "El nombre de la entidad debe tener al menos 2 caracteres"),
  abreviatura: z
    .string()
    .min(2, "La abreviatura debe tener al menos 2 caracteres"),
});

export { paginationSchema, idParamSchema } from "./commonSchemas";

export type CrearCtEntidadInput = z.infer<typeof crearCtEntidadSchema>;
export type ActualizarCtEntidadInput = z.infer<
  typeof actualizarCtEntidadSchema
>;

export const ctEntidadIdParamSchema = z.object({
  id_entidad: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(
      z.number().int().positive("ID de la entidad debe ser un número positivo")
    ),
});

export type CtEntidadIdParam = z.infer<typeof ctEntidadIdParamSchema>;
