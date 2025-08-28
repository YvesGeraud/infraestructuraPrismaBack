import { Router } from "express";
import { reportesController } from "../controllers/reportes.controller";
import { validateRequest } from "../middleware/validateRequest";
import { z } from "zod";

const router = Router();

// Schema para validar parámetros de jerarquía
const jerarquiaIdParamSchema = z.object({
  id_jerarquia: z
    .union([z.string(), z.number()])
    .transform((val) => (typeof val === "string" ? parseInt(val, 10) : val))
    .pipe(
      z.number().int().positive("ID de jerarquía debe ser un número positivo")
    ),
});

// Schema para reporte genérico
const reporteGenericoSchema = z.object({
  datos: z.array(z.any()).min(1, "Debe incluir al menos un registro"),
  configuracion: z.object({
    titulo: z.string().min(1, "Título es requerido"),
    descripcion: z.string().optional(),
    columnas: z
      .array(
        z.object({
          campo: z.string(),
          titulo: z.string(),
          tipo: z.enum(["texto", "numero", "fecha", "booleano"]).optional(),
          ancho: z.string().optional(),
        })
      )
      .min(1, "Debe incluir al menos una columna"),
    filtros: z.record(z.string(), z.any()).optional(),
    metadatos: z.record(z.string(), z.any()).optional(),
  }),
});

// ========== RUTAS DE REPORTES ESPECÍFICOS ==========

/**
 * @route GET /api/reportes/articulos/jerarquia/:id_jerarquia/pdf
 * @description Genera reporte PDF de artículos filtrado por jerarquía
 * @param {number} id_jerarquia - ID de la jerarquía para filtrar artículos
 * @returns {file} PDF - Archivo PDF descargable
 *
 * @example
 * GET /api/reportes/articulos/jerarquia/2160/pdf
 * Descarga: articulos_jerarquia_2160_2025-08-28.pdf
 */
router.get(
  "/articulos/jerarquia/:id_jerarquia/pdf",
  validateRequest({ params: jerarquiaIdParamSchema }),
  reportesController.generarReporteArticulosPorJerarquia
);

// ========== RUTAS DE REPORTES GENÉRICOS ==========

/**
 * @route POST /api/reportes/generico/pdf
 * @description Genera reporte PDF genérico a partir de datos y configuración
 * @body {object} datos - Array de objetos con los datos del reporte
 * @body {object} configuracion - Configuración del reporte (título, columnas, etc.)
 * @returns {file} PDF - Archivo PDF descargable
 *
 * @example
 * POST /api/reportes/generico/pdf
 * {
 *   "datos": [
 *     {"id": 1, "nombre": "Item 1", "fecha": "2025-01-01"},
 *     {"id": 2, "nombre": "Item 2", "fecha": "2025-01-02"}
 *   ],
 *   "configuracion": {
 *     "titulo": "Reporte de Items",
 *     "descripcion": "Lista de items del sistema",
 *     "columnas": [
 *       {"campo": "id", "titulo": "ID", "tipo": "numero"},
 *       {"campo": "nombre", "titulo": "Nombre", "tipo": "texto"},
 *       {"campo": "fecha", "titulo": "Fecha", "tipo": "fecha"}
 *     ]
 *   }
 * }
 */
router.post(
  "/generico/pdf",
  validateRequest({ body: reporteGenericoSchema }),
  reportesController.generarReporteGenerico
);

// ========== RUTAS FUTURAS (Para expansión) ==========

/**
 * Rutas futuras que se pueden implementar:
 *
 * GET /api/reportes/inventario/resumen/pdf
 * GET /api/reportes/infraestructura/estado/pdf
 * GET /api/reportes/usuarios/actividad/pdf
 * POST /api/reportes/dashboard/pdf
 * GET /api/reportes/plantillas
 * POST /api/reportes/plantilla/:id/pdf
 */

export default router;
