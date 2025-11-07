import { z } from "zod";
import {
  esquemaTextoRequerido,
  esquemaTextoOpcional,
  esquemaNumeroRequerido,
} from "../commonSchemas";

//TODO ===== SCHEMAS PARA BAJA MASIVA DE INVENTARIO =====

/**
 * 🎯 FLUJO DEL PROCESO DE BAJA MASIVA:
 *
 * 1. 🔍 Frontend: Usuario busca artículos por folio (solo activos)
 * 2. 🛒 Frontend: Carrito temporal con artículos a dar de baja
 * 3. 📄 Frontend: Usuario sube PDF y agrega motivo de baja
 * 4. 🚀 Backend: Transacción atómica
 *    ├─ dt_inventario_baja (Un registro de baja)
 *    ├─ rl_inventario_baja_articulo (Relaciones con artículos)
 *    ├─ Upload del PDF a upload/inventario/bajas/
 *    ├─ dt_inventario_baja_archivo (Registro del archivo)
 *    └─ Actualización de estado de artículos (estado = false)
 */

//? ===== ESQUEMA PARA UN ARTÍCULO EN LA BAJA =====
export const articuloBajaSchema = z.object({
  // ID del artículo existente (debe estar activo)
  id_dt_inventario_articulo: esquemaNumeroRequerido(1, 2147483647),
});

//? ===== ESQUEMA PARA ARCHIVO PDF DE MULTER =====
export const archivoMulterSchema = z.object({
  fieldname: z.string(),
  originalname: z.string(),
  encoding: z.string(),
  mimetype: z.string(),
  destination: z.string().optional(),
  filename: z.string().optional(),
  path: z.string().optional(),
  size: z.number().max(5 * 1024 * 1024, "El archivo no puede exceder 5MB"), // 5MB
  buffer: z.any(), // Buffer del archivo
});

//? ===== ESQUEMA PRINCIPAL PARA BAJA MASIVA =====
export const crearBajaMasivaSchema = z.object({
  // Tipo de baja (catálogo)
  id_ct_inventario_baja: esquemaNumeroRequerido(1, 2147483647),

  // Observaciones de la baja (motivo, etc.)
  observaciones: z
    .string()
    .max(65535, "Las observaciones no pueden exceder 65535 caracteres")
    .optional()
    .nullable(),

  // Array de artículos a dar de baja (mínimo 1, máximo 100)
  articulos: z
    .array(articuloBajaSchema)
    .min(1, "Debe incluir al menos un artículo")
    .max(100, "No se pueden dar de baja más de 100 artículos a la vez"),

  // Archivo PDF sin procesar (Multer)
  archivo: archivoMulterSchema,
});

//? ===== ESQUEMA PARA VALIDAR ARCHIVO MULTIPART =====
export const validarArchivoBajaSchema = z.object({
  mimetype: z
    .string()
    .refine(
      (mime) => mime === "application/pdf",
      "Solo se permiten archivos PDF"
    ),
  size: z.number().max(5 * 1024 * 1024, "El archivo no puede exceder 5MB"), // 5MB
  originalname: z
    .string()
    .min(1, "El nombre del archivo es requerido")
    .max(255, "El nombre del archivo no puede exceder 255 caracteres"),
});

//? ===== TIPOS INFERIDOS =====
export type ArticuloBajaInput = z.infer<typeof articuloBajaSchema>;
export type CrearBajaMasivaInput = z.infer<typeof crearBajaMasivaSchema>;
export type ValidarArchivoBajaInput = z.infer<typeof validarArchivoBajaSchema>;

/*
🎉 SCHEMAS DE VALIDACIÓN PARA BAJA MASIVA DE INVENTARIO

✅ Características:
- 📦 Validación de artículos existentes por ID
- 📄 Validación de archivo PDF (Multer)
- 🔍 Límite de 100 artículos por baja
- 🛡️ Validación de tamaño de archivo (5MB)
- 📝 Observaciones opcionales (motivo de baja)
- 🎯 Tipo de baja desde catálogo

🔧 Diferencias con Alta:
- Se valida por ID de artículo (no se crean nuevos)
- Solo se necesita el ID del artículo
- El backend desactivará los artículos (estado = false)

🎯 Uso:
```typescript
const datosValidados = crearBajaMasivaSchema.parse({
  id_ct_inventario_baja: 1,
  observaciones: "Artículos dañados en inundación",
  articulos: [
    { id_dt_inventario_articulo: 123 },
    { id_dt_inventario_articulo: 124 },
  ],
  archivo: req.file,
});
```
*/
