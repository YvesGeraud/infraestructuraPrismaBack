/**
 * @fileoverview Rutas para el módulo de localidades
 * Define todas las rutas HTTP y conecta con el controlador tipado
 * Ejemplo práctico de implementación completa con interfaces
 */

import { Router } from "express";
import ctLocalidadController from "../controllers/ct_localidad.controller";
import {
  validarBody,
  validarParametros,
  validarQuery,
} from "../middlewares/validation.middleware";
import {
  crearLocalidadSchema,
  actualizarLocalidadSchema,
  parametroIdSchema,
  filtrosLocalidadSchema,
  consultaLocalidadSchema,
} from "../schemas/localidad.schemas";

const router = Router();

/**
 * @route   GET /api/localidad
 * @desc    Obtener todas las localidades con filtros opcionales
 * @access  Público (ajustar según necesidades)
 * @example GET /api/localidad?ambito=U&buscar=centro&pagina=1&limite=10
 */
router.get(
  "/",
  validarQuery(filtrosLocalidadSchema),
  ctLocalidadController.obtenerTodos
);

/**
 * @route   GET /api/localidad/:id
 * @desc    Obtener una localidad específica por ID
 * @access  Público
 * @example GET /api/localidad/1
 */
router.get(
  "/:id",
  validarParametros(parametroIdSchema),
  ctLocalidadController.obtenerPorId
);

/**
 * @route   POST /api/localidad
 * @desc    Crear una nueva localidad
 * @access  Privado (requiere autenticación)
 * @example POST /api/localidad
 *          Body: { "nombre": "San José", "ambito": "R", "idMunicipio": 123 }
 */
router.post("/", validarBody(crearLocalidadSchema), ctLocalidadController.crear);

/**
 * @route   PUT /api/localidad/:id
 * @desc    Actualizar una localidad existente
 * @access  Privado (requiere autenticación)
 * @example PUT /api/localidad/1
 *          Body: { "nombre": "San José Centro" }
 */
router.put(
  "/:id",
  validarParametros(parametroIdSchema),
  validarBody(actualizarLocalidadSchema),
  ctLocalidadController.actualizar
);

/**
 * @route   DELETE /api/localidad/:id
 * @desc    Eliminar una localidad
 * @access  Privado (requiere autenticación)
 * @example DELETE /api/localidad/1
 */
router.delete(
  "/:id",
  validarParametros(parametroIdSchema),
  ctLocalidadController.eliminar
);

/**
 * @route   GET /api/localidad/buscar/:nombre
 * @desc    Buscar localidades por nombre
 * @access  Público
 * @example GET /api/localidad/buscar/san jose
 */
router.get("/buscar/:nombre", ctLocalidadController.buscarPorNombre);

// ========================================================================
// RUTAS LEGACY - Mantener por compatibilidad (DEPRECATED)
// Se recomienda usar las rutas principales con filtros
// ========================================================================

/**
 * @deprecated Usar GET /api/localidades con filtros
 * @route GET /api/localidades/todas
 */
router.get("/todas", ctLocalidadController.obtenerTodasLasLocalidades);

/**
 * @deprecated Usar GET /api/localidades con filtros
 * @route GET /api/localidades/legacy
 */
router.get(
  "/legacy",
  validarQuery(consultaLocalidadSchema),
  ctLocalidadController.obtenerLocalidades
);

/**
 * @deprecated Usar GET /api/localidades/:id con filtros
 * @route GET /api/localidades/:id/completa
 */
router.get(
  "/:id/completa",
  validarParametros(parametroIdSchema),
  ctLocalidadController.obtenerLocalidadCompleta
);

/**
 * @deprecated Usar GET /api/localidades?idMunicipio=:id
 * @route GET /api/localidades/municipio/:id
 */
router.get(
  "/municipio/:id",
  validarParametros(parametroIdSchema),
  ctLocalidadController.obtenerLocalidadesPorMunicipio
);

export default router;

/**
 * Ejemplos de uso de la API
 *
 * @example ✅ Crear localidad básica
 * POST /api/localidad
 * Body: { "nombre": "San José", "ambito": "R", "idMunicipio": 123 }
 *
 * @example ✅ Crear localidad urbana
 * POST /api/localidad
 * Body: { "nombre": "Centro", "ambito": "U", "idMunicipio": 456 }
 *
 * @example ✅ Actualizar localidad
 * PUT /api/localidad/1
 * Body: { "nombre": "San José Centro" }
 *
 * @example ✅ Eliminar localidad
 * DELETE /api/localidad/1
 *
 * @example Buscar localidades con filtros
 * GET /api/localidad?ambito=U&buscar=centro&limite=20&pagina=1
 *
 * @example Obtener localidad específica
 * GET /api/localidad/123
 *
 * @example Buscar por nombre específico
 * GET /api/localidad/buscar/san jose
 *
 * @example Obtener con información del municipio
 * GET /api/localidad?incluirMunicipio=true
 *
 * @example Filtrar por municipio
 * GET /api/localidad?idMunicipio=456
 *
 * @example Respuesta típica de creación exitosa
 * {
 *   "exito": true,
 *   "datos": {
 *     "id": 123,
 *     "nombre": "San José",
 *     "ambito": "R",
 *     "idMunicipio": 456
 *   },
 *   "mensaje": "Localidad creada exitosamente"
 * }
 *
 * @example Respuesta típica CRUD completo disponible
 * - GET    /api/localidad           → Obtener todas con filtros
 * - GET    /api/localidad/:id       → Obtener por ID
 * - POST   /api/localidad           → Crear nueva
 * - PUT    /api/localidad/:id       → Actualizar existente
 * - DELETE /api/localidad/:id       → Eliminar
 * - GET    /api/localidad/buscar/:nombre → Buscar por nombre
 * 
 * Legacy (DEPRECATED):
 * - GET    /api/localidad/todas     → Usar GET /api/localidad
 * - GET    /api/localidad/:id/completa → Usar GET /api/localidad/:id?incluirCodigosPostales=true
 * - GET    /api/localidad/municipio/:id → Usar GET /api/localidad?idMunicipio=:id
 */
