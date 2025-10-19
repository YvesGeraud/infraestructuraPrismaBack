import { z } from "zod";
import {
  esquemaTextoRequerido,
  esquemaTextoOpcional,
  esquemaEstadoRequerido,
  esquemaNumeroRequerido,
  esquemaNumeroOpcional,
  esquemaFechaRequerida,
} from "../commonSchemas";

//TODO ===== SCHEMAS PARA ALTA MASIVA DE INVENTARIO =====

/**
 * 🎯 FLUJO DEL PROCESO DE ALTA MASIVA:
 *
 * 1. 🛒 Frontend: Carrito temporal con artículos
 * 2. 📄 Frontend: Usuario sube PDF
 * 3. 🚀 Backend: Transacción atómica
 *    ├─ dt_inventario_articulo (Múltiples artículos)
 *    ├─ dt_inventario_alta (Un registro de alta)
 *    ├─ rl_inventario_alta_articulo (Relaciones)
 *    ├─ Upload del PDF a upload/inventario/altas/
 *    └─ dt_inventario_alta_archivo (Registro del archivo)
 */

//? ===== ESQUEMA PARA UN ARTÍCULO INDIVIDUAL =====
export const articuloAltaSchema = z.object({
  // Datos del artículo (solo los que envía el frontend)
  no_serie: esquemaTextoRequerido(1, 50),
  modelo: esquemaTextoRequerido(1, 50),
  observaciones: esquemaTextoOpcional(65535), // Opcional según el frontend
  id_ct_inventario_tipo_articulo: esquemaNumeroRequerido(1, 2147483647),
  id_ct_inventario_marca: esquemaNumeroRequerido(1, 2147483647),
  id_ct_inventario_material: esquemaNumeroRequerido(1, 2147483647),
  id_ct_inventario_color: esquemaNumeroRequerido(1, 2147483647),
  id_ct_inventario_proveedor: esquemaNumeroRequerido(1, 2147483647),
  id_ct_inventario_estado_fisico: esquemaNumeroRequerido(1, 2147483647),

  // Campos que se agregarán automáticamente en el backend:
  // - id_rl_infraestructura_jerarquia: 1 (por defecto)
  // - folio: generado automáticamente (INV-YYYY-0000000)
  // - fecha_registro: fecha actual
  // - estado: true (por defecto)
});

//? ===== ESQUEMA PARA DATOS DEL ARCHIVO PDF =====
export const archivoPdfSchema = z.object({
  nombre_archivo: esquemaTextoRequerido(1, 255), // Nombre original del archivo
  nombre_sistema: esquemaTextoRequerido(1, 255), // Nombre único generado por el sistema
  ruta_archivo: esquemaTextoRequerido(1, 500), // Ruta completa del archivo
});

//? ===== ESQUEMA PRINCIPAL PARA ALTA MASIVA =====
export const crearAltaMasivaSchema = z.object({
  // Tipo de alta (catálogo)
  id_ct_inventario_alta: esquemaNumeroRequerido(1, 2147483647),

  // Observaciones del alta (opcional)
  observaciones: z
    .string()
    .max(65535, "Las observaciones no pueden exceder 65535 caracteres")
    .optional()
    .nullable(),

  // Array de artículos (mínimo 1, máximo 100 para evitar problemas de rendimiento)
  articulos: z
    .array(articuloAltaSchema)
    .min(1, "Debe incluir al menos un artículo")
    .max(100, "No se pueden agregar más de 100 artículos a la vez"),

  // Datos del archivo PDF
  archivo: archivoPdfSchema,
});

//? ===== ESQUEMA PARA VALIDAR ARCHIVO MULTIPART =====
export const validarArchivoAltaSchema = z.object({
  mimetype: z
    .string()
    .refine(
      (mime) => mime === "application/pdf",
      "Solo se permiten archivos PDF"
    ),
  size: z.number().max(10 * 1024 * 1024, "El archivo no puede exceder 10MB"), // 10MB
  originalname: z
    .string()
    .min(1, "El nombre del archivo es requerido")
    .max(255, "El nombre del archivo no puede exceder 255 caracteres"),
});

//? ===== TIPOS INFERIDOS =====
export type ArticuloAltaInput = z.infer<typeof articuloAltaSchema>;
export type ArchivoPdfInput = z.infer<typeof archivoPdfSchema>;
export type CrearAltaMasivaInput = z.infer<typeof crearAltaMasivaSchema>;
export type ValidarArchivoAltaInput = z.infer<typeof validarArchivoAltaSchema>;

/**
 * 📝 EJEMPLO DE USO EN EL FRONTEND:
 *
 * ```typescript
 * const altaMasiva: CrearAltaMasivaInput = {
 *   id_ct_inventario_alta: 1, // ID del catálogo de tipo de alta
 *   observaciones: "Alta por compra directa 2024",
 *   articulos: [
 *     {
 *       id_rl_infraestructura_jerarquia: 1,
 *       folio: "INV-2024-001",
 *       no_serie: "ABC123",
 *       observaciones: "Artículo nuevo",
 *       modelo: "Modelo X",
 *       fecha_registro: "2024-01-15",
 *       id_ct_inventario_subclase: 1,
 *       id_ct_inventario_material: 2,
 *       id_ct_inventario_marca: 3,
 *       id_ct_inventario_color: 4,
 *       id_ct_inventario_proveedor: 5,
 *       id_ct_inventario_estado_fisico: 1,
 *       id_ct_inventario_tipo_articulo: 2,
 *       cct: "14DPR0001A",
 *       estado: true,
 *     },
 *     // ... más artículos
 *   ],
 *   archivo: {
 *     nombre_archivo: "compra_2024.pdf",
 *     nombre_sistema: "1704067200000_compra_2024.pdf",
 *     ruta_archivo: "upload/inventario/altas/1704067200000_compra_2024.pdf",
 *   },
 * };
 * ```
 *
 * 📄 FORMATO DEL REQUEST:
 *
 * Endpoint: POST /api/inventario/alta/batch
 * Content-Type: multipart/form-data
 *
 * Body:
 * - data: JSON.stringify(altaMasiva) // Sin el campo 'archivo'
 * - archivo: File (PDF)
 *
 * El backend procesará el archivo y generará los campos de 'archivo' automáticamente.
 */

/*
🎉 SCHEMA PARA ALTA MASIVA DE INVENTARIO

✅ Características:
- 🔄 Transacción atómica - todo o nada
- 📦 Soporte para múltiples artículos (1-100)
- 📄 Validación de archivo PDF
- 🛡️ Validaciones robustas en cada nivel
- 📝 Observaciones opcionales
- 🎯 Tipo de alta desde catálogo

🔧 Validaciones incluidas:
- ✅ Mínimo 1 artículo, máximo 100
- ✅ Solo archivos PDF
- ✅ Tamaño máximo 10MB
- ✅ Validación de campos requeridos en cada artículo
- ✅ Validación de longitudes de texto
- ✅ Validación de rangos numéricos

🏗️ Estructura de la transacción:
1. Validar datos de entrada
2. Subir archivo PDF
3. Crear artículos en dt_inventario_articulo
4. Crear registro en dt_inventario_alta
5. Crear relaciones en rl_inventario_alta_articulo
6. Registrar archivo en dt_inventario_alta_archivo
7. Si algo falla, rollback completo
*/
