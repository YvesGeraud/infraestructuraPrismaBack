import { z } from "zod";

//TODO ===== SCHEMAS PARA DT_ESCUELA_ALUMNO =====
//? Esquemas para crear un nuevo registro de alumno en la escuela
export const crearRlEscuelaAlumnoGradoSchema = z.object({
  id_escuela_alumno: z
    .number()
    .int()
    .min(1, "El ID del alumno debe ser un número entero"),
  id_escuela_plantel: z
    .number()
    .int()
    .min(1, "El ID de la escuela debe ser un número entero"),
  id_escuela_ciclo_escolar: z
    .number()
    .int()
    .min(1, "El ID del ciclo escolar debe ser un número entero"),
  nivel: z.number().int().min(1, "El nivel debe ser un número entero"),
  grado: z.number().int().min(1, "El grado debe ser un número entero"),
  intento: z.number().int().min(1, "El intento debe ser un número entero"),
  id_escuela_alumno_estatus: z
    .number()
    .int()
    .min(1, "El ID del estatus del alumno debe ser un número entero"),
  id_escuela_alumno_estatus_grado: z
    .number()
    .int()
    .min(1, "El ID del estatus del grado debe ser un número entero"),
});

//? Esquemas para actualizar un registro de alumno en la escuela
export const actualizarRlEscuelaAlumnoGradoSchema = z.object({
  id_escuela_plantel: z
    .number()
    .int()
    .min(1, "El ID de la escuela debe ser un número entero"),
  id_escuela_ciclo_escolar: z
    .number()
    .int()
    .min(1, "El ID del ciclo escolar debe ser un número entero"),
  nivel: z.number().int().min(1, "El nivel debe ser un número entero"),
  grado: z.number().int().min(1, "El grado debe ser un número entero"),
  intento: z.number().int().min(1, "El intento debe ser un número entero"),
  id_escuela_alumno_estatus: z
    .number()
    .int()
    .min(1, "El ID del estatus del alumno debe ser un número entero"),
  id_escuela_alumno_estatus_grado: z
    .number()
    .int()
    .min(1, "El ID del estatus del grado debe ser un número entero"),
});

//? Esquemas para query con filtros
export const rlEscuelaAlumnoGradoFiltersSchema = z.object({
  id_escuela_alumno: z
    .number()
    .int()
    .min(1, "El ID del alumno debe ser un número entero")
    .optional(),
  id_escuela_plantel: z
    .number()
    .int()
    .min(1, "El ID de la escuela debe ser un número entero")
    .optional(),
  id_escuela_ciclo_escolar: z
    .number()
    .int()
    .min(1, "El ID del ciclo escolar debe ser un número entero")
    .optional(),
  nivel: z
    .number()
    .int()
    .min(1, "El nivel debe ser un número entero")
    .optional(),
  grado: z
    .number()
    .int()
    .min(1, "El grado debe ser un número entero")
    .optional(),
  intento: z
    .number()
    .int()
    .min(1, "El intento debe ser un número entero")
    .optional(),
  id_escuela_alumno_estatus: z
    .number()
    .int()
    .min(1, "El ID del estatus del alumno debe ser un número entero")
    .optional(),
  id_escuela_alumno_estatus_grado: z
    .number()
    .int()
    .min(1, "El ID del estatus del grado debe ser un número entero")
    .optional(),
  // Parámetros de include
  includeAlumno: z
    .string()
    .transform((val) => val === "true")
    .optional(),
});

//? Importamos schemas comunes
export { paginationSchema, idParamSchema } from "./commonSchemas";

export type RlEscuelaAlumnoGradoFiltersInput = z.infer<
  typeof rlEscuelaAlumnoGradoFiltersSchema
>;

export const rlEscuelaAlumnoGradoIdParamSchema = z.object({
  id_escuela_alumno: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(
      z.number().int().positive("ID del alumno debe ser un número positivo")
    ),
});

export interface escuelaAlumnoIncluir {
  includeAlumno?: boolean;
  includePlantel?: boolean;
  includeCicloEscolar?: boolean;
  includeNivel?: boolean;
  includeGrado?: boolean;
  includeIntento?: boolean;
  includeEstatusAlumno?: boolean;
  includeEstatusGrado?: boolean;
}

export type CrearRlEscuelaAlumnoGradoInput = z.infer<
  typeof crearRlEscuelaAlumnoGradoSchema
>;
export type ActualizarRlEscuelaAlumnoGradoInput = z.infer<
  typeof actualizarRlEscuelaAlumnoGradoSchema
>;

export type RlEscuelaAlumnoGradoIdParam = z.infer<
  typeof rlEscuelaAlumnoGradoIdParamSchema
>;
