import { z } from "zod";

//TODO ===== SCHEMAS PARA CT_TIPO_INSTANCIA =====
//? Esquemas para crear una nueva tipo de instancia

export const crearCtTipoInstanciaSchema = z.object({
  descripcion: z
    .string()
    .min(2, "La descripción debe tener al menos 2 caracteres"),
});

//? Esquemas para actualizar una acción
export const actualizarCtTipoInstanciaSchema = z.object({
  descripcion: z
    .string()
    .min(2, "La descripción debe tener al menos 2 caracteres"),
});

//? Schema para filtros de búsqueda
export const buscarTipoInstanciasSchema = z.object({
  descripcion: z.string().optional(),
});

export { paginationSchema, idParamSchema } from "../commonSchemas";

export type CrearCtTipoInstanciaInput = z.infer<
  typeof crearCtTipoInstanciaSchema
>;
export type ActualizarCtTipoInstanciaInput = z.infer<
  typeof actualizarCtTipoInstanciaSchema
>;
export type BuscarTipoInstanciasInput = z.infer<
  typeof buscarTipoInstanciasSchema
>;

export const ctTipoInstanciaIdParamSchema = z.object({
  id_tipo_instancia: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(
      z
        .number()
        .int()
        .positive("ID de la tipo de instancia debe ser un número positivo")
    ),
});

export type CtTipoInstanciaIdParam = z.infer<
  typeof ctTipoInstanciaIdParamSchema
>;
