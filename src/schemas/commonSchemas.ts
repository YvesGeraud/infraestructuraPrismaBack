import { z } from "zod";

//TODO ===== SCHEMAS COMUNES PARA TODA LA APLICACIÓN =====

//? Schema para paginación - usado en todos los módulos
export const paginationSchema = z.object({
  pagina: z
    .string()
    .transform((val) => parseInt(val, 10) || 1)
    .pipe(z.number().int().min(1))
    .optional(),
  limite: z
    .string()
    .transform((val) => parseInt(val, 10) || 10)
    .pipe(z.number().int().min(1).max(100))
    .optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

//? Schema para validar IDs en parámetros de ruta (maneja string y number)
export const idParamSchema = z.object({
  id: z
    .union([z.string(), z.number()])
    .transform((val) => (typeof val === "string" ? parseInt(val, 10) : val))
    .pipe(z.number().int().positive("ID debe ser un número positivo")),
});

//? Helper para crear schemas de ID específicos (soluciona problema de Express parseando números)
export const createIdParamSchema = (fieldName: string, message?: string) => {
  return z.object({
    [fieldName]: z
      .union([z.string(), z.number()])
      .transform((val) => (typeof val === "string" ? parseInt(val, 10) : val))
      .pipe(
        z
          .number()
          .int()
          .positive(message || `${fieldName} debe ser un número positivo`)
      ),
  });
};

//? Esquema base para transformar string/number a number en parámetros de URL
export const esquemaParamId = z
  .union([z.string(), z.number()])
  .transform((val) => (typeof val === "string" ? parseInt(val, 10) : val))
  .pipe(z.number().int().positive("ID debe ser un número positivo"));

//? Schema para búsqueda general
export const searchSchema = z.object({
  search: z.string().min(1, "El término de búsqueda es requerido").optional(),
});

//? Schema para fechas
export const dateRangeSchema = z.object({
  fechaInicio: z
    .string()
    .transform((val) => new Date(val))
    .pipe(z.date())
    .optional(),
  fechaFin: z
    .string()
    .transform((val) => new Date(val))
    .pipe(z.date())
    .optional(),
});

//? Schema para estados de vigencia
export const vigenciaSchema = z.object({
  vigente: z.enum(["S", "N"]).optional(),
});

//TODO ===== ESQUEMAS BASE REUTILIZABLES =====

//? Esquemas para campos de ID (números enteros positivos)
export const esquemaNumeroRequerido = (min: number = 1, max: number = 100000) =>
  z.number().int().min(min).max(max);
export const esquemaNumeroOpcional = (min: number = 1, max: number = 100000) =>
  z.number().int().min(min).max(max).optional();
export const esquemaIdRequerido = z.number().int().positive();
export const esquemaIdOpcional = z.number().int().positive().optional();
export const esquemaDecimalOpcional = (
  min: number = 0,
  max: number = 999999.999
) => z.number().min(min).max(max).optional();
export const esquemaDecimalRequerido = (
  min: number = 0,
  max: number = 999999.999
) => z.number().min(min).max(max);

//? Esquemas para campos de texto
export const esquemaTextoRequerido = (
  minLength: number = 1,
  maxLength: number = 255
) =>
  z
    .string()
    .min(minLength, `Debe tener al menos ${minLength} caracteres`)
    .max(maxLength, `No puede exceder ${maxLength} caracteres`);

export const esquemaTextoOpcional = (maxLength: number = 255) =>
  z
    .string()
    .max(maxLength, `No puede exceder ${maxLength} caracteres`)
    .optional();

//? Esquemas para campos booleanos
export const esquemaBooleanRequerido = z.boolean();
export const esquemaBooleanOpcional = z.boolean().optional();

//? Esquemas para fechas
export const esquemaFechaRequerida = z.date();
export const esquemaFechaOpcional = z.date().optional();

//? Esquemas para campos de usuario (auditoría)
export const esquemaUsuarioCreacion = z
  .number()
  .int()
  .positive("ID de usuario de creación debe ser positivo");
export const esquemaUsuarioActualizacion = z
  .number()
  .int()
  .positive("ID de usuario de actualización debe ser positivo")
  .optional();

//? Esquemas para campos de estado/activo
export const esquemaEstadoRequerido = z.boolean().default(true);
export const esquemaEstadoOpcional = z.boolean().optional();
export const esquemaActivoRequerido = z.boolean().default(true);
export const esquemaActivoOpcional = z.boolean().optional();

//? Esquemas para transformaciones de query parameters (string a number/boolean)
export const esquemaQueryId = z
  .string()
  .optional()
  .transform((val) => {
    if (val === undefined || val === null || val === "") return undefined;
    const num = parseInt(val, 10);
    return isNaN(num) || num <= 0 ? undefined : num;
  })
  .pipe(z.number().int().positive().optional());

export const esquemaQueryBoolean = z
  .string()
  .optional()
  .transform((val) => {
    if (val === undefined || val === null || val === "") return undefined;
    return val === "true" || val === "1";
  })
  .pipe(z.boolean().optional());

export const esquemaQueryTexto = z.string().optional();

//? Esquemas para números en query parameters (transforman string a number)
export const esquemaQueryNumeroRequerido = z
  .string()
  .transform((val) => {
    const num = parseInt(val, 10);
    if (isNaN(num) || num <= 0) {
      throw new Error("Debe ser un número positivo");
    }
    return num;
  })
  .pipe(z.number().int().positive());

export const esquemaQueryNumeroOpcional = z
  .string()
  .optional()
  .transform((val) => {
    if (val === undefined || val === null || val === "") return undefined;
    const num = parseInt(val, 10);
    return isNaN(num) || num <= 0 ? undefined : num;
  })
  .pipe(z.number().int().positive().optional());

//? Esquemas para paginación mejorados
export const esquemaPaginaQuery = z
  .string()
  .optional()
  .transform((val) => {
    if (val === undefined || val === null || val === "") return 1;
    const num = parseInt(val, 10);
    return isNaN(num) || num < 1 ? 1 : num;
  })
  .pipe(z.number().int().min(1));

export const esquemaLimiteQuery = z
  .string()
  .optional()
  .transform((val) => {
    if (val === undefined || val === null || val === "") return 10;
    const num = parseInt(val, 10);
    return isNaN(num) || num < 1 ? 10 : Math.min(num, 100);
  })
  .pipe(z.number().int().min(1).max(100));

//? Esquema para el body de DELETE con auditoría
// Ya no se usa - id_ct_usuario_up se obtiene del JWT
// export const esquemaDeleteConUsuario = z.object({
//   id_ct_usuario_up: esquemaUsuarioCreacion,
// });

//TODO ===== TIPOS INFERIDOS =====
export type PaginationInput = z.infer<typeof paginationSchema>;
export type IdParam = z.infer<typeof idParamSchema>;
export type SearchInput = z.infer<typeof searchSchema>;
export type DateRangeInput = z.infer<typeof dateRangeSchema>;
export type VigenciaInput = z.infer<typeof vigenciaSchema>;
