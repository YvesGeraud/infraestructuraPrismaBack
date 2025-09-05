/**
 * @fileoverview Schemas de validación para códigos postales
 * Trabaja junto con las interfaces para garantizar datos válidos
 * Basado en la estructura real de la base de datos
 */

import { z } from "zod";

/**
 * Schema base para código postal
 */
const codigoPostalBaseSchema = z.object({
  codigoPostal: z
    .string({
      required_error: "El código postal es requerido",
      invalid_type_error: "El código postal debe ser texto",
    })
    .regex(/^\d{5}$/, "El código postal debe ser de 5 dígitos numéricos")
    .trim(),

  asentamiento: z
    .string({
      invalid_type_error: "El asentamiento debe ser texto",
    })
    .min(2, "El asentamiento debe tener al menos 2 caracteres")
    .max(150, "El asentamiento no puede exceder 150 caracteres")
    .trim()
    .optional(),

  idLocalidad: z
    .number({
      invalid_type_error: "El ID de la localidad debe ser un número",
    })
    .int("El ID de la localidad debe ser un número entero")
    .positive("El ID de la localidad debe ser mayor a 0")
    .optional(),
});

/**
 * Schema para crear un nuevo código postal
 */
export const crearCodigoPostalSchema = codigoPostalBaseSchema.refine(
  (data) => {
    // Si se proporciona asentamiento, también debe proporcionarse idLocalidad
    if (data.asentamiento && !data.idLocalidad) {
      return false;
    }
    return true;
  },
  {
    message: "Si se proporciona un asentamiento, debe especificarse el ID de la localidad",
    path: ["idLocalidad"],
  }
);

/**
 * Schema para actualizar un código postal existente
 * Todos los campos son opcionales para permitir actualizaciones parciales
 */
export const actualizarCodigoPostalSchema = codigoPostalBaseSchema.partial();

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
 * Schema para validar parámetros de código postal
 */
export const parametroCodigoPostalSchema = z.object({
  codigo: z
    .string({
      required_error: "El código postal es requerido",
    })
    .regex(/^\d{5}$/, "El código postal debe ser de 5 dígitos numéricos"),
});

/**
 * Schema para filtros de consulta
 */
export const filtrosCodigoPostalSchema = z.object({
  buscar: z
    .string()
    .min(2, "El término de búsqueda debe tener al menos 2 caracteres")
    .max(50, "El término de búsqueda no puede exceder 50 caracteres")
    .trim()
    .optional(),

  codigoPostal: z
    .string()
    .regex(/^\d{5}$/, "El código postal debe ser de 5 dígitos numéricos")
    .optional(),

  asentamiento: z
    .string()
    .min(2, "El asentamiento debe tener al menos 2 caracteres")
    .max(150, "El asentamiento no puede exceder 150 caracteres")
    .trim()
    .optional(),

  idLocalidad: z
    .string()
    .regex(/^\d+$/, "El ID de la localidad debe ser un número válido")
    .transform((val) => parseInt(val, 10))
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

export type CrearCodigoPostalInput = z.infer<typeof crearCodigoPostalSchema>;
export type ActualizarCodigoPostalInput = z.infer<typeof actualizarCodigoPostalSchema>;
export type ParametroIdInput = z.infer<typeof parametroIdSchema>;
export type ParametroCodigoPostalInput = z.infer<typeof parametroCodigoPostalSchema>;
export type FiltrosCodigoPostalInput = z.infer<typeof filtrosCodigoPostalSchema>;

/**
 * Ejemplos de uso en JSDoc para el equipo
 *
 * @example Crear código postal básico
 * const nuevoCodigoPostal = {
 *   codigoPostal: "90210"
 * };
 *
 * @example Crear código postal con asentamiento
 * const codigoPostalCompleto = {
 *   codigoPostal: "90210",
 *   asentamiento: "Centro",
 *   idLocalidad: 123
 * };
 *
 * @example Actualizar código postal
 * const actualizacion = {
 *   asentamiento: "Centro Histórico"
 * };
 *
 * @example Query parameters - Búsqueda con filtros
 * const filtros = {
 *   buscar: "90210",
 *   limite: "20",
 *   pagina: "1"
 * };
 *
 * @example Uso de endpoints siguiendo REST
 * // ✅ Para crear un código postal:
 * POST /api/codigos-postales
 * Body: { "codigoPostal": "90210", "asentamiento": "Centro", "idLocalidad": 123 }
 *
 * // ✅ Para obtener UN código postal específico:
 * GET /api/codigos-postales/123
 *
 * // ✅ Para obtener información geográfica:
 * GET /api/codigos-postales/90210/geografia
 *
 * // ✅ Para obtener MÚLTIPLES códigos postales con filtros:
 * GET /api/codigos-postales?buscar=90210&limite=20
 */
