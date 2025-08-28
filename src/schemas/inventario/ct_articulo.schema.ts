import { z } from "zod";

//TODO ===== SCHEMAS PARA CT_INVENTARIO_ARTICULO =====

//? Schema para crear un nuevo artículo de inventario
export const crearCtArticuloSchema = z.object({
  // Campos obligatorios básicos
  folio: z
    .string()
    .min(1, "El folio es obligatorio")
    .max(255, "El folio no puede exceder 255 caracteres"),

  // Relaciones obligatorias
  id_subclase: z
    .number()
    .int()
    .positive("ID de subclase debe ser un número positivo"),

  // Campos opcionales de identificación
  folio_nuevo: z
    .string()
    .max(255, "El folio nuevo no puede exceder 255 caracteres")
    .optional(),

  no_serie: z
    .string()
    .max(255, "El número de serie no puede exceder 255 caracteres")
    .optional(),

  modelo: z
    .string()
    .max(250, "El modelo no puede exceder 250 caracteres")
    .optional(),

  observaciones: z
    .string()
    .max(255, "Las observaciones no pueden exceder 255 caracteres")
    .optional(),

  cct: z.string().max(255, "El CCT no puede exceder 255 caracteres").optional(),

  // Estatus (TinyInt: 0-255)
  estatus: z
    .number()
    .int()
    .min(0, "El estatus debe ser 0 o mayor")
    .max(255, "El estatus debe ser 255 o menor")
    .optional(),

  // Relaciones opcionales (Foreign Keys)
  id_jerarquia: z
    .number()
    .int()
    .positive("ID de jerarquía debe ser un número positivo")
    .optional(),

  id_marca: z
    .number()
    .int()
    .positive("ID de marca debe ser un número positivo")
    .optional(),

  id_material: z
    .number()
    .int()
    .positive("ID de material debe ser un número positivo")
    .optional(),

  id_color: z
    .number()
    .int()
    .positive("ID de color debe ser un número positivo")
    .optional(),

  id_proveedor: z
    .number()
    .int()
    .positive("ID de proveedor debe ser un número positivo")
    .optional(),

  id_accion: z
    .number()
    .int()
    .positive("ID de acción debe ser un número positivo")
    .optional(),

  id_estado_fisico: z
    .number()
    .int()
    .positive("ID de estado físico debe ser un número positivo")
    .optional(),

  id_consecutivo: z
    .number()
    .int()
    .positive("ID de consecutivo debe ser un número positivo")
    .optional(),

  // Fechas (se manejan automáticamente en el backend)
  fecha_alta: z
    .string()
    .datetime("Formato de fecha inválido")
    .transform((str) => new Date(str))
    .optional(),

  fecha_baja: z
    .string()
    .datetime("Formato de fecha inválido")
    .transform((str) => new Date(str))
    .optional(),
});

//? Schema para actualizar un artículo (todos los campos opcionales excepto validaciones)
export const actualizarCtArticuloSchema = z.object({
  folio: z
    .string()
    .min(1, "El folio no puede estar vacío")
    .max(255, "El folio no puede exceder 255 caracteres")
    .optional(),

  folio_nuevo: z
    .string()
    .max(255, "El folio nuevo no puede exceder 255 caracteres")
    .optional(),

  no_serie: z
    .string()
    .max(255, "El número de serie no puede exceder 255 caracteres")
    .optional(),

  modelo: z
    .string()
    .max(250, "El modelo no puede exceder 250 caracteres")
    .optional(),

  observaciones: z
    .string()
    .max(255, "Las observaciones no pueden exceder 255 caracteres")
    .optional(),

  cct: z.string().max(255, "El CCT no puede exceder 255 caracteres").optional(),

  estatus: z
    .number()
    .int()
    .min(0, "El estatus debe ser 0 o mayor")
    .max(255, "El estatus debe ser 255 o menor")
    .optional(),

  // Relaciones opcionales
  id_jerarquia: z
    .number()
    .int()
    .positive("ID de jerarquía debe ser un número positivo")
    .optional(),

  id_subclase: z
    .number()
    .int()
    .positive("ID de subclase debe ser un número positivo")
    .optional(),

  id_marca: z
    .number()
    .int()
    .positive("ID de marca debe ser un número positivo")
    .optional(),

  id_material: z
    .number()
    .int()
    .positive("ID de material debe ser un número positivo")
    .optional(),

  id_color: z
    .number()
    .int()
    .positive("ID de color debe ser un número positivo")
    .optional(),

  id_proveedor: z
    .number()
    .int()
    .positive("ID de proveedor debe ser un número positivo")
    .optional(),

  id_accion: z
    .number()
    .int()
    .positive("ID de acción debe ser un número positivo")
    .optional(),

  id_estado_fisico: z
    .number()
    .int()
    .positive("ID de estado físico debe ser un número positivo")
    .optional(),

  id_consecutivo: z
    .number()
    .int()
    .positive("ID de consecutivo debe ser un número positivo")
    .optional(),

  fecha_alta: z
    .string()
    .datetime("Formato de fecha inválido")
    .transform((str) => new Date(str))
    .optional(),

  fecha_baja: z
    .string()
    .datetime("Formato de fecha inválido")
    .transform((str) => new Date(str))
    .optional(),
});

//? Schema para filtros de búsqueda
export const buscarArticulosSchema = z.object({
  // Búsqueda por texto
  folio: z.string().optional(),
  folio_nuevo: z.string().optional(),
  no_serie: z.string().optional(),
  modelo: z.string().optional(),
  cct: z.string().optional(),

  // Filtros por IDs (convertir de string a number desde query params)
  id_jerarquia: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().positive())
    .optional(),

  id_subclase: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().positive())
    .optional(),

  id_marca: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().positive())
    .optional(),

  id_material: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().positive())
    .optional(),

  id_color: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().positive())
    .optional(),

  id_proveedor: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().positive())
    .optional(),

  id_accion: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().positive())
    .optional(),

  id_estado_fisico: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().positive())
    .optional(),

  estatus: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().min(0).max(255))
    .optional(),

  // Filtros de fecha (rangos)
  fecha_alta_desde: z
    .string()
    .datetime("Formato de fecha inválido")
    .transform((str) => new Date(str))
    .optional(),

  fecha_alta_hasta: z
    .string()
    .datetime("Formato de fecha inválido")
    .transform((str) => new Date(str))
    .optional(),

  fecha_baja_desde: z
    .string()
    .datetime("Formato de fecha inválido")
    .transform((str) => new Date(str))
    .optional(),

  fecha_baja_hasta: z
    .string()
    .datetime("Formato de fecha inválido")
    .transform((str) => new Date(str))
    .optional(),

  // Flags para controlar includes (condicionales)
  incluir_jerarquia: z
    .string()
    .transform((val) => val === "true")
    .pipe(z.boolean())
    .optional(),

  incluir_marca: z
    .string()
    .transform((val) => val === "true")
    .pipe(z.boolean())
    .optional(),

  incluir_color: z
    .string()
    .transform((val) => val === "true")
    .pipe(z.boolean())
    .optional(),

  incluir_material: z
    .string()
    .transform((val) => val === "true")
    .pipe(z.boolean())
    .optional(),

  incluir_proveedor: z
    .string()
    .transform((val) => val === "true")
    .pipe(z.boolean())
    .optional(),

  incluir_subclase: z
    .string()
    .transform((val) => val === "true")
    .pipe(z.boolean())
    .optional(),

  incluir_estado_fisico: z
    .string()
    .transform((val) => val === "true")
    .pipe(z.boolean())
    .optional(),

  incluir_accion: z
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

// Importar schemas comunes
import { createIdParamSchema } from "../commonSchemas";
export { paginationSchema } from "../commonSchemas";

// Tipos inferidos
export type CrearCtArticuloInput = z.infer<typeof crearCtArticuloSchema>;
export type ActualizarCtArticuloInput = z.infer<
  typeof actualizarCtArticuloSchema
>;
export type BuscarArticulosInput = z.infer<typeof buscarArticulosSchema>;

// Schema para parámetros de ID
export const ctArticuloIdParamSchema = createIdParamSchema(
  "id_articulo",
  "ID del artículo debe ser un número positivo"
);

export type CtArticuloIdParam = z.infer<typeof ctArticuloIdParamSchema>;
