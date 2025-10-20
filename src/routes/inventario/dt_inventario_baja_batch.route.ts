import { Router } from "express";
import inventarioBajaBatchController from "../../controllers/inventario/dt_inventario_baja_batch.controller";
import { verificarAutenticacion } from "../../middleware/authMiddleware";
import multer from "multer";
import { createError } from "../../middleware/errorHandler";

/**
 * 🎯 RUTAS PARA BAJA MASIVA DE INVENTARIO
 *
 * Todas las rutas requieren autenticación JWT
 */

const router = Router();

// 📤 CONFIGURACIÓN DE MULTER PARA UPLOAD DE ARCHIVOS
const upload = multer({
  storage: multer.memoryStorage(), // Almacenar en memoria temporalmente
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB máximo
  },
  fileFilter: (req, file, cb) => {
    // Solo permitir archivos PDF
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(createError("Solo se permiten archivos PDF", 400) as any, false);
    }
  },
});

/**
 * 🚀 POST /api/inventario/baja/batch
 * Crear baja masiva de inventario con múltiples artículos y PDF
 *
 * @requires Authentication JWT
 * @body multipart/form-data
 *   - data: JSON string con id_ct_inventario_baja, observaciones y articulos
 *   - archivo: PDF file
 *
 * @returns {201} Baja creada exitosamente
 * @returns {400} Errores de validación
 * @returns {401} No autenticado
 * @returns {404} Catálogo de baja no encontrado o artículos no encontrados
 * @returns {500} Error del servidor
 */
router.post(
  "/",
  verificarAutenticacion,
  upload.single("archivo"),
  inventarioBajaBatchController.crearBajaMasiva.bind(
    inventarioBajaBatchController
  )
);

export default router;

/*
🎉 RUTAS DE BAJA MASIVA DE INVENTARIO

✅ Características:
- 🔐 Todas las rutas requieren autenticación
- 📤 Multer configurado para archivos PDF
- 🛡️ Validación de tipo de archivo
- 📏 Límite de tamaño 5MB
- 📝 Documentación completa de endpoints

🔧 Endpoints disponibles:
- POST   / - Crear baja masiva

📄 Configuración de Multer:
- Storage: Memory (temporal)
- Max size: 5MB
- Only: PDF files

🎯 Body esperado:
```json
{
  "archivo": <archivo PDF>,
  "data": {
    "id_ct_inventario_baja": 1,
    "observaciones": "Motivo de la baja",
    "articulos": [
      { "id_dt_inventario_articulo": 123 },
      { "id_dt_inventario_articulo": 124 }
    ]
  }
}
```
*/
