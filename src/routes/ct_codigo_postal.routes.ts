/**
 * @fileoverview Rutas para el módulo de códigos postales
 * Define todas las rutas HTTP y conecta con el controlador tipado
 * Ejemplo práctico de implementación completa con interfaces
 */

import { Router } from "express";
import ctCodigoPostalController from "../controllers/ct_codigo_postal.controller";
import {
  validarBody,
  validarParametros,
  validarQuery,
} from "../middlewares/validation.middleware";
import {
  crearCodigoPostalSchema,
  actualizarCodigoPostalSchema,
  parametroIdSchema,
  parametroCodigoPostalSchema,
  filtrosCodigoPostalSchema,
} from "../schemas/codigo_postal.schemas";

const router = Router();

/**
 * @route   GET /api/codigos-postales
 * @desc    Obtener todos los códigos postales con filtros opcionales
 * @access  Público (ajustar según necesidades)
 * @example GET /api/codigos-postales?codigoPostal=90210&pagina=1&limite=10
 */
router.get(
  "/",
  validarQuery(filtrosCodigoPostalSchema),
  ctCodigoPostalController.obtenerTodos
);

/**
 * @route   GET /api/codigos-postales/:id
 * @desc    Obtener un código postal específico por ID
 * @access  Público
 * @example GET /api/codigos-postales/1
 */
router.get(
  "/:id",
  validarParametros(parametroIdSchema),
  ctCodigoPostalController.obtenerPorId
);

/**
 * @route   POST /api/codigos-postales
 * @desc    Crear un nuevo código postal
 * @access  Privado (requiere autenticación)
 * @example POST /api/codigos-postales
 *          Body: { "codigoPostal": "90210", "asentamiento": "Centro", "idLocalidad": 123 }
 */
router.post("/", validarBody(crearCodigoPostalSchema), ctCodigoPostalController.crear);

/**
 * @route   PUT /api/codigos-postales/:id
 * @desc    Actualizar un código postal existente
 * @access  Privado (requiere autenticación)
 * @example PUT /api/codigos-postales/1
 *          Body: { "asentamiento": "Centro Histórico" }
 */
router.put(
  "/:id",
  validarParametros(parametroIdSchema),
  validarBody(actualizarCodigoPostalSchema),
  ctCodigoPostalController.actualizar
);

/**
 * @route   DELETE /api/codigos-postales/:id
 * @desc    Eliminar un código postal
 * @access  Privado (requiere autenticación)
 * @example DELETE /api/codigos-postales/1
 */
router.delete(
  "/:id",
  validarParametros(parametroIdSchema),
  ctCodigoPostalController.eliminar
);

/**
 * @route   GET /api/codigos-postales/:codigo/geografia
 * @desc    🌟 FUNCIONALIDAD ESPECIAL: Obtener información geográfica completa
 * @desc    Devuelve toda la cadena geográfica: código postal → localidad → municipio → entidad
 * @param   codigo - Código postal de 5 dígitos
 * @access  Público
 * @example GET /api/codigos-postales/90210/geografia
 */
router.get(
  "/:codigo/geografia",
  validarParametros(parametroCodigoPostalSchema),
  ctCodigoPostalController.obtenerInformacionGeografica
);

/**
 * @route   GET /api/codigos-postales/buscar/:codigo
 * @desc    Buscar códigos postales por código
 * @access  Público
 * @example GET /api/codigos-postales/buscar/90210
 */
router.get("/buscar/:codigo", ctCodigoPostalController.buscarPorCodigo);

// ========================================================================
// RUTAS LEGACY - Para compatibilidad con código existente
// ========================================================================

/**
 * @route GET /api/codigos-postales/legacy
 * @desc Método legacy para compatibilidad
 * @deprecated Usar GET /api/codigos-postales en su lugar
 * @access Public
 */
router.get("/legacy", ctCodigoPostalController.obtenerCodigosPostales);

export default router;

/**
 * Ejemplos de uso de la API
 *
 * @example ✅ Crear código postal básico
 * POST /api/codigos-postales
 * Body: { "codigoPostal": "90210" }
 *
 * @example ✅ Crear código postal completo
 * POST /api/codigos-postales
 * Body: { "codigoPostal": "90210", "asentamiento": "Centro", "idLocalidad": 123 }
 *
 * @example ✅ Actualizar código postal
 * PUT /api/codigos-postales/1
 * Body: { "asentamiento": "Centro Histórico" }
 *
 * @example ✅ Eliminar código postal
 * DELETE /api/codigos-postales/1
 *
 * @example Buscar códigos postales con filtros
 * GET /api/codigos-postales?buscar=90210&limite=20&pagina=1
 *
 * @example Obtener código postal específico
 * GET /api/codigos-postales/123
 *
 * @example Buscar por código específico
 * GET /api/codigos-postales/buscar/90210
 *
 * @example Obtener información geográfica completa
 * GET /api/codigos-postales/90210/geografia
 *
 * @example Respuesta típica de creación exitosa
 * {
 *   "exito": true,
 *   "datos": {
 *     "id": 123,
 *     "codigoPostal": "90210",
 *     "asentamiento": "Centro",
 *     "idLocalidad": 456
 *   },
 *   "mensaje": "Código postal creado exitosamente"
 * }
 *
 * @example Respuesta típica CRUD completo disponible
 * - GET    /api/codigos-postales           → Obtener todos con filtros
 * - GET    /api/codigos-postales/:id       → Obtener por ID
 * - POST   /api/codigos-postales           → Crear nuevo
 * - PUT    /api/codigos-postales/:id       → Actualizar existente
 * - DELETE /api/codigos-postales/:id       → Eliminar
 * - GET    /api/codigos-postales/:codigo/geografia → Info geográfica
 * - GET    /api/codigos-postales/buscar/:codigo   → Buscar por código
 */
