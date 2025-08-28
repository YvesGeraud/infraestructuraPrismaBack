import { z } from "zod";

//TODO ===== SCHEMAS PARA CT_LOCALIDAD =====
//? Esquemas para crear una nueva localidad

export const crearCtLocalidadSchema = z.object({
  localidad: z.string().min(2, "La localidad debe tener al menos 2 caracteres"),
  ambito: z.enum(["U", "R"]),
  id_municipio: z
    .number()
    .int()
    .positive("ID del municipio debe ser un número positivo"),
});

//? Esquemas para actualizar una acción
export const actualizarCtLocalidadSchema = z.object({
  localidad: z.string().min(2, "La localidad debe tener al menos 2 caracteres"),
  ambito: z.enum(["U", "R"]),
  id_municipio: z
    .number()
    .int()
    .positive("ID del municipio debe ser un número positivo"),
});

//? Schema para filtros de búsqueda
export const buscarLocalidadesSchema = z.object({
  localidad: z.string().optional(),
  id_municipio: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().positive())
    .optional(),
  ambito: z.enum(["U", "R"]).optional(),
  // Flags para controlar includes
  incluir_municipio: z
    .string()
    .transform((val) => val === "true")
    .pipe(z.boolean())
    .optional(),
  incluir_detalle_completo: z
    .string()
    .transform((val) => val === "true")
    .pipe(z.boolean())
    .optional(),
});

import { createIdParamSchema } from "./commonSchemas";
export { paginationSchema, idParamSchema } from "./commonSchemas";

export type CrearCtLocalidadInput = z.infer<typeof crearCtLocalidadSchema>;
export type ActualizarCtLocalidadInput = z.infer<
  typeof actualizarCtLocalidadSchema
>;
export type BuscarLocalidadesInput = z.infer<typeof buscarLocalidadesSchema>;

// ✅ Usando helper para manejar el problema de Express parseando números automáticamente
export const ctLocalidadIdParamSchema = createIdParamSchema(
  "id_localidad",
  "ID de la localidad debe ser un número positivo"
);

export type CtLocalidadIdParam = z.infer<typeof ctLocalidadIdParamSchema>;
