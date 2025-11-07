import { Router } from "express";
import inventarioAltaBatchController from "../../controllers/inventario/dt_inventario_alta_batch.controller";
import { verificarAutenticacion } from "../../middleware/authMiddleware";
import multer from "multer";
import { createError } from "../../middleware/errorHandler";

/**
 * 🎯 RUTAS PARA ALTA MASIVA DE INVENTARIO
 *
 * Todas las rutas requieren autenticación JWT
 */

const router = Router();

// 📤 CONFIGURACIÓN DE MULTER PARA UPLOAD DE ARCHIVOS
const upload = multer({
  storage: multer.memoryStorage(), // Almacenar en memoria temporalmente
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB máximo
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
 * 🚀 POST /api/inventario/alta/batch
 * Crear alta masiva de inventario con múltiples artículos y PDF
 *
 * @requires Authentication JWT
 * @body multipart/form-data
 *   - data: JSON string con id_ct_inventario_alta, observaciones y articulos
 *   - archivo: PDF file
 *
 * @returns {201} Alta creada exitosamente
 * @returns {400} Errores de validación
 * @returns {401} No autenticado
 * @returns {404} Catálogo de alta no encontrado
 * @returns {500} Error del servidor
 */
router.post(
  "/",
  verificarAutenticacion,
  upload.single("archivo"),
  inventarioAltaBatchController.crearAltaMasiva.bind(
    inventarioAltaBatchController
  )
);

/**
 * 📊 GET /api/inventario/alta/batch/:id
 * Obtener detalle de un alta específica con artículos y archivos
 *
 * @requires Authentication JWT
 * @param {number} id - ID del alta
 *
 * @returns {200} Detalle del alta
 * @returns {401} No autenticado
 * @returns {404} Alta no encontrada
 * @returns {500} Error del servidor
 */
router.get(
  "/:id",
  verificarAutenticacion,
  inventarioAltaBatchController.obtenerDetalleAlta.bind(
    inventarioAltaBatchController
  )
);

/**
 * 📋 GET /api/inventario/alta/batch
 * Listar altas con paginación y filtros
 *
 * @requires Authentication JWT
 * @query {number} pagina - Página actual (default: 1)
 * @query {number} limite - Elementos por página (default: 10)
 * @query {number} id_ct_inventario_alta - Filtrar por tipo de alta
 * @query {boolean} estado - Filtrar por estado (activo/inactivo)
 *
 * @returns {200} Lista de altas
 * @returns {401} No autenticado
 * @returns {500} Error del servidor
 */
router.get(
  "/",
  verificarAutenticacion,
  inventarioAltaBatchController.listarAltas.bind(inventarioAltaBatchController)
);

export default router;

/*
🎉 RUTAS DE ALTA MASIVA DE INVENTARIO

✅ Características:
- 🔐 Todas las rutas requieren autenticación
- 📤 Multer configurado para archivos PDF
- 🛡️ Validación de tipo de archivo
- 📏 Límite de tamaño 10MB
- 📝 Documentación completa de endpoints

🔧 Endpoints disponibles:
- POST   / - Crear alta masiva
- GET    /:id - Obtener detalle
- GET    / - Listar con filtros

📄 Configuración de Multer:
- Storage: Memory (temporal)
- Max size: 10MB
- Only: PDF files
*/
