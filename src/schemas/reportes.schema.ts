import { z } from "zod";

//TODO ===== SCHEMAS PARA REPORTES =====

//? Schema para filtros de localidades en reportes
export const reporteLocalidadesFiltrosSchema = z.object({
  localidad: z.string().optional(),
  ambito: z.enum(["U", "R"]).optional(),
  id_municipio: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().positive())
    .optional(),
  incluir_municipio: z
    .string()
    .transform((val) => val === "true")
    .pipe(z.boolean())
    .optional(),
  incluir_municipio_con_entidad: z
    .string()
    .transform((val) => val === "true")
    .pipe(z.boolean())
    .optional(),
});

//? Schema para configuración de columnas de reporte
export const columnaReporteSchema = z.object({
  campo: z.string().min(1, "El campo es requerido"),
  titulo: z.string().min(1, "El título es requerido"),
  tipo: z.enum(["texto", "numero", "fecha", "booleano"]).optional(),
  ancho: z.string().optional(),
  // Las funciones de formato no se pueden validar con Zod
  // Se manejan directamente en el servicio
});

//? Schema para configuración completa de reporte
export const configuracionReporteSchema = z.object({
  titulo: z.string().min(1, "Título es requerido"),
  descripcion: z.string().optional(),
  columnas: z
    .array(columnaReporteSchema)
    .min(1, "Debe incluir al menos una columna"),
  filtros: z.record(z.string(), z.any()).optional(),
  metadatos: z.record(z.string(), z.any()).optional(),
});

//? Schema para reporte genérico completo
export const reporteGenericoSchema = z.object({
  datos: z.array(z.any()).min(1, "Debe incluir al menos un registro"),
  configuracion: configuracionReporteSchema,
});

//? Schema para parámetros de reporte por municipio
export const reporteMunicipioParamSchema = z.object({
  id_municipio: z
    .union([z.string(), z.number()])
    .transform((val) => (typeof val === "string" ? parseInt(val, 10) : val))
    .pipe(
      z.number().int().positive("ID de municipio debe ser un número positivo")
    ),
});

//? Tipos TypeScript derivados
export type ReporteLocalidadesFiltros = z.infer<
  typeof reporteLocalidadesFiltrosSchema
>;
export type ColumnaReporte = z.infer<typeof columnaReporteSchema>;
export type ConfiguracionReporte = z.infer<typeof configuracionReporteSchema>;
export type ReporteGenerico = z.infer<typeof reporteGenericoSchema>;
export type ReporteMunicipioParam = z.infer<typeof reporteMunicipioParamSchema>;

//? Schemas para tipos específicos de reportes (futuras expansiones)

// Schema para reporte de municipios
export const reporteMunicipiosFiltrosSchema = z.object({
  nombre: z.string().optional(),
  cve_mun: z.string().optional(),
  id_ct_entidad: z.number().optional(),
  incluir_entidad: z
    .string()
    .transform((val) => val === "true")
    .pipe(z.boolean())
    .optional(),
});

// Schema para reporte de entidades
export const reporteEntidadesFiltrosSchema = z.object({
  nombre: z.string().optional(),
  abreviatura: z.string().optional(),
});

// Schema para reportes con rango de fechas
export const reporteFechasSchema = z.object({
  fecha_inicio: z.string().datetime().optional(),
  fecha_fin: z.string().datetime().optional(),
});

export type ReporteMunicipiosFiltros = z.infer<
  typeof reporteMunicipiosFiltrosSchema
>;
export type ReporteEntidadesFiltros = z.infer<
  typeof reporteEntidadesFiltrosSchema
>;
export type ReporteFechas = z.infer<typeof reporteFechasSchema>;
