import { z } from "zod";

//TODO ===== SCHEMAS PARA DT_ESCUELA_ALUMNO =====
//? Esquemas para crear un nuevo registro de alumno en la escuela
export const crearDtEscuelaAlumnoSchema = z.object({
  nombre: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre es demasiado largo")
    .trim(),
  app: z
    .string()
    .min(2, "El apellido paterno debe tener al menos 2 caracteres")
    .max(50, "El apellido paterno es demasiado largo")
    .trim(),
  apm: z
    .string()
    .min(2, "El apellido materno debe tener al menos 2 caracteres")
    .max(50, "El apellido materno es demasiado largo")
    .trim(),
  curp: z
    .string()
    .min(16, "El CURP debe tener 16 caracteres minimo")
    .max(18, "El CURP es demasiado largo")
    .trim(),
  telefono: z
    .string()
    .min(10, "El teléfono debe tener al menos 10 caracteres")
    .max(15, "El teléfono es demasiado largo")
    .trim(),
  id_localidad: z
    .number()
    .int()
    .min(1, "El ID de la localidad debe ser un número entero"),
  codigo_postal: z
    .number()
    .int()
    .min(6, "El código postal debe tener al menos 6 caracteres")
    .max(6, "El código postal es demasiado largo"),
  fecha_nacimiento: z.date(),

  //? Campos opcionales de promedios
  primaria_promedio_1: z.number().min(0).max(10).optional(),
  primaria_promedio_2: z.number().min(0).max(10).optional(),
  primaria_promedio_general: z.number().min(0).max(10).optional(),
  primaria_promedio_general_letra: z.string().max(50).optional(),
  secundaria_promedio_1: z.number().min(0).max(10).optional(),
  secundaria_promedio_2: z.number().min(0).max(10).optional(),
  secundaria_promedio_3: z.number().min(0).max(10).optional(),
  secundaria_promedio_general: z.number().min(0).max(10).optional(),
  secundaria_promedio_general_letra: z.string().max(50).optional(),
  primaria_folio_certificado: z.string().max(50).optional(),
  secundaria_folio_certificado: z.string().max(50).optional(),
});

//? Esquemas para actualizar un registro de alumno en la escuela
export const actualizarDtEscuelaAlumnoSchema = z.object({
  nombre: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre es demasiado largo")
    .trim()
    .optional(),
  app: z
    .string()
    .min(2, "El apellido paterno debe tener al menos 2 caracteres")
    .max(50, "El apellido paterno es demasiado largo")
    .trim()
    .optional(),
  apm: z
    .string()
    .min(2, "El apellido materno debe tener al menos 2 caracteres")
    .max(50, "El apellido materno es demasiado largo")
    .trim()
    .optional(),
  curp: z
    .string()
    .min(16, "El CURP debe tener 16 caracteres minimo")
    .max(18, "El CURP es demasiado largo")
    .trim()
    .optional(),
  telefono: z
    .string()
    .min(10, "El teléfono debe tener al menos 10 caracteres")
    .max(15, "El teléfono es demasiado largo")
    .trim()
    .optional(),
  id_localidad: z
    .number()
    .int()
    .min(1, "El ID de la localidad debe ser un número entero")
    .optional(),
  codigo_postal: z
    .number()
    .int()
    .min(6, "El código postal debe tener al menos 6 caracteres")
    .max(6, "El código postal es demasiado largo")
    .optional(),
  fecha_nacimiento: z.date().optional(),
});

//? Esquemas para query con filtros
export const dtEscuelaAlumnoFiltersSchema = z.object({
  nombre: z.string().optional(),
  app: z.string().optional(),
  apm: z.string().optional(),
  curp: z.string().optional(),
  telefono: z.string().optional(),
});

//? Importamos schemas comunes
export { paginationSchema, idParamSchema } from "./commonSchemas";

export type DtEscuelaAlumnoFiltersInput = z.infer<
  typeof dtEscuelaAlumnoFiltersSchema
>;

export const dtEscuelaAlumnoIdParamSchema = z.object({
  id_escuela_alumno: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(
      z.number().int().positive("ID del alumno debe ser un número positivo")
    ),
});

export type CrearDtEscuelaAlumnoInput = z.infer<
  typeof crearDtEscuelaAlumnoSchema
>;
export type ActualizarDtEscuelaAlumnoInput = z.infer<
  typeof actualizarDtEscuelaAlumnoSchema
>;

export type DtEscuelaAlumnoIdParam = z.infer<
  typeof dtEscuelaAlumnoIdParamSchema
>;
