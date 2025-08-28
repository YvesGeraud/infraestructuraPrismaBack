import { z } from "zod";

//TODO ===== SCHEMAS PARA RL_JERARQUIA =====
//? Esquemas para crear una nueva jerarquía

export const crearRlJerarquiaSchema = z.object({
  id_instancia: z
    .number()
    .int()
    .positive("ID de la instancia debe ser un número positivo"),
  id_tipo_instancia: z
    .number()
    .int()
    .positive("ID del tipo de instancia debe ser un número positivo"),
  id_dependencia: z
    .number()
    .int()
    .positive("ID de la dependencia debe ser un número positivo")
    .optional(),
});

//? Esquemas para actualizar una acción
export const actualizarRlJerarquiaSchema = z.object({
  id_instancia: z
    .number()
    .int()
    .positive("ID de la instancia debe ser un número positivo")
    .optional(),
  id_dependencia: z
    .number()
    .int()
    .positive("ID de la dependencia debe ser un número positivo")
    .optional(),
});

//? Schema para filtros de búsqueda
export const buscarJerarquiasSchema = z.object({
  id_instancia: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().positive())
    .optional()
    .default(0),
  id_dependencia: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().positive())
    .optional()
    .default(0),
  id_tipo_instancia: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().positive())
    .optional()
    .default(0),
});

import { createIdParamSchema } from "../commonSchemas";
export { paginationSchema, idParamSchema } from "../commonSchemas";

export type CrearRlJerarquiaInput = z.infer<typeof crearRlJerarquiaSchema>;
export type ActualizarRlJerarquiaInput = z.infer<
  typeof actualizarRlJerarquiaSchema
>;
export type BuscarJerarquiasInput = z.infer<typeof buscarJerarquiasSchema>;

// ✅ Usando helper para manejar el problema de Express parseando números automáticamente
export const rlJerarquiaIdParamSchema = createIdParamSchema(
  "id_jerarquia",
  "ID de la jerarquía debe ser un número positivo"
);

export type RlJerarquiaIdParam = z.infer<typeof rlJerarquiaIdParamSchema>;
