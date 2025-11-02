/**
 * @fileoverview Schemas de validación para búsqueda unificada de instancias
 */

import { z } from "zod";
import { paginationSchema } from "../commonSchemas";

/**
 * 🎯 SCHEMA PARA QUERY PARAMETERS DE BÚSQUEDA
 */
export const instanciaBusquedaQuerySchema = paginationSchema.extend({
  q: z
    .string()
    .min(2, "El término de búsqueda debe tener al menos 2 caracteres")
    .max(100, "El término de búsqueda no puede exceder 100 caracteres"),
  incluir_jerarquia: z
    .string()
    .optional()
    .transform((val) => {
      if (val === undefined || val === null || val === "") return true; // Default: incluir jerarquía
      return val === "true" || val === "1";
    }),
});

/**
 * Tipo inferido para los query parameters
 */
export type InstanciaBusquedaQueryInput = z.infer<
  typeof instanciaBusquedaQuerySchema
>;
