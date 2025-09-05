/**
 * @fileoverview Schemas de validación para localidades
 * Trabaja junto con las interfaces para garantizar datos válidos
 * Basado en la estructura real de la base de datos
 */

import { z } from "zod";

/**
 * Schema base para localidad
 */
const localidadBaseSchema = z.object({
  nombre: z
    .string({
      required_error: "El nombre de la localidad es requerido",
      invalid_type_error: "El nombre de la localidad debe ser texto",
    })
    .min(2, "El nombre de la localidad debe tener al menos 2 caracteres")
    .max(150, "El nombre de la localidad no puede exceder 150 caracteres")
    .trim(),

  ambito: z
    .enum(["R", "U"], {
      errorMap: () => ({
        message: "El ámbito debe ser 'R' (Rural) o 'U' (Urbano)",
      }),
    })
    .optional()
    .default("R"),

  idMunicipio: z
    .number({
      required_error: "El ID del municipio es requerido",
      invalid_type_error: "El ID del municipio debe ser un número",
    })
    .int("El ID del municipio debe ser un número entero")
    .positive("El ID del municipio debe ser mayor a 0"),
});

/**
 * Schema para crear una nueva localidad
 */
export const crearLocalidadSchema = localidadBaseSchema;

/**
 * Schema para actualizar una localidad existente
 * Todos los campos son opcionales para permitir actualizaciones parciales
 */
export const actualizarLocalidadSchema = localidadBaseSchema.partial();

/**
 * Schema para validar parámetros de ID
 */
export const parametroIdSchema = z.object({
  id: z
    .string({
      required_error: "El ID es requerido",
    })
    .regex(/^\d+$/, "El ID debe ser un número válido")
    .transform((val) => parseInt(val, 10))
    .refine((val) => val > 0, "El ID debe ser mayor a 0"),
});

/**
 * Schema para filtros de consulta
 */
export const filtrosLocalidadSchema = z.object({
  buscar: z
    .string()
    .min(2, "El término de búsqueda debe tener al menos 2 caracteres")
    .max(50, "El término de búsqueda no puede exceder 50 caracteres")
    .trim()
    .optional(),

  ambito: z.enum(["R", "U"]).optional(),

  idMunicipio: z
    .string()
    .regex(/^\d+$/, "El ID del municipio debe ser un número válido")
    .transform((val) => parseInt(val, 10))
    .optional(),

  incluirMunicipio: z
    .string()
    .transform((val) => val === "true" || val === "1")
    .optional(),

  incluirCodigosPostales: z
    .string()
    .transform((val) => val === "true" || val === "1")
    .optional(),

  pagina: z
    .string()
    .regex(/^\d+$/, "La página debe ser un número válido")
    .transform((val) => parseInt(val, 10))
    .refine((val) => val > 0, "La página debe ser mayor a 0")
    .optional(),

  limite: z
    .string()
    .regex(/^\d+$/, "El límite debe ser un número válido")
    .transform((val) => parseInt(val, 10))
    .refine((val) => val > 0 && val <= 100, "El límite debe ser entre 1 y 100")
    .optional(),
});

// ==========================================
// TIPOS DERIVADOS DE ZOD
// ==========================================

export type CrearLocalidadInput = z.infer<typeof crearLocalidadSchema>;
export type ActualizarLocalidadInput = z.infer<typeof actualizarLocalidadSchema>;
export type ParametroIdInput = z.infer<typeof parametroIdSchema>;
export type FiltrosLocalidadInput = z.infer<typeof filtrosLocalidadSchema>;

// ==========================================
// SCHEMAS LEGACY PARA COMPATIBILIDAD
// ==========================================

/**
 * @deprecated Usar filtrosLocalidadSchema
 */
export const consultaLocalidadSchema = filtrosLocalidadSchema;

/**
 * @deprecated Usar FiltrosLocalidadInput
 */
export type ConsultaLocalidadInput = FiltrosLocalidadInput;

/**
 * Ejemplos de uso en JSDoc para el equipo
 *
 * @example Crear localidad
 * const nuevaLocalidad = {
 *   nombre: "San José de las Flores",
 *   ambito: "R",
 *   idMunicipio: 123
 * };
 *
 * @example Actualizar localidad
 * const actualizacion = {
 *   nombre: "San José de las Flores Centro"
 * };
 *
 * @example Query parameters - Búsqueda con filtros combinados
 * const filtrosCombinados = {
 *   idMunicipio: "456",
 *   ambito: "U",
 *   buscar: "centro",
 *   incluirMunicipio: "true"
 * };
 *
 * @example Uso de endpoints siguiendo REST
 * // ✅ Para crear una localidad:
 * POST /api/localidades
 * Body: { "nombre": "San José", "ambito": "R", "idMunicipio": 123 }
 *
 * // ✅ Para obtener UNA localidad específica:
 * GET /api/localidades/123?incluirMunicipio=true
 *
 * // ✅ Para obtener MÚLTIPLES localidades con filtros:
 * GET /api/localidades?idMunicipio=456&ambito=U&buscar=centro
 */
