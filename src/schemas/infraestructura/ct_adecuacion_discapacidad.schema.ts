import { z } from "zod";

//TODO ===== SCHEMAS PARA CT_ADECUACION_DISCAPACIDAD =====
//? Esquemas para crear una nueva adecuación de discapacidad

export const crearCtAdecuacionDiscapacidadSchema = z.object({
  descripcion: z
    .string()
    .min(2, "La descripción debe tener al menos 2 caracteres"),
});

//? Esquemas para actualizar una adecuación de discapacidad
export const actualizarCtAdecuacionDiscapacidadSchema = z.object({
  descripcion: z
    .string()
    .min(2, "La descripción debe tener al menos 2 caracteres"),
});

//? Schema para filtros de búsqueda
export const buscarAdecuacionDiscapacidadSchema = z.object({
  descripcion: z.string().optional(),
});

export { paginationSchema, idParamSchema } from "../commonSchemas";

export type CrearCtAdecuacionDiscapacidadInput = z.infer<
  typeof crearCtAdecuacionDiscapacidadSchema
>;
export type ActualizarCtAdecuacionDiscapacidadInput = z.infer<
  typeof actualizarCtAdecuacionDiscapacidadSchema
>;
export type BuscarAdecuacionDiscapacidadInput = z.infer<
  typeof buscarAdecuacionDiscapacidadSchema
>;

export const ctAdecuacionDiscapacidadIdParamSchema = z.object({
  id_adecuacion: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(
      z
        .number()
        .int()
        .positive(
          "ID de la adecuación de discapacidad debe ser un número positivo"
        )
    ),
});

export type CtAdecuacionDiscapacidadIdParam = z.infer<
  typeof ctAdecuacionDiscapacidadIdParamSchema
>;
