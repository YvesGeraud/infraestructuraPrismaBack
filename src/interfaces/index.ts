/**
 * @fileoverview Índice de interfaces del backend
 * Ejemplo práctico: Módulo de colores completo
 */

// Re-exportar interfaces de tipos existentes
export * from "../types/response.types";

// Ejemplo específico: Interfaz de colores
//export * from "./inventario/ct_color.interface";

/**
 * ==========================================
 * EJEMPLO PRÁCTICO COMPLETO: CT_COLOR
 * ==========================================
 *
 * Este ejemplo muestra cómo implementar interfaces en todo el flujo:
 *
 * 1. INTERFAZ (ct_color.interface.ts):
 *    - Define contratos para datos, servicio y controlador
 *    - Tipado fuerte para Color, DatosCrearColor, etc.
 *
 * 2. SCHEMA (schemas/inventario/color.schemas.ts):
 *    - Validación con Zod
 *    - Tipos derivados automáticamente
 *
 * 3. SERVICIO (services/inventario/ct_color.service.ts):
 *    - Implementa IServicioColor
 *    - Todos los métodos CRUD tipados
 *    - Compatible con código existente
 *
 * 4. CONTROLADOR (controllers/inventario/ct_color.controller.ts):
 *    - Usa interfaces tipadas
 *    - Manejo de errores consistente
 *    - Validaciones automáticas
 *
 * 5. RUTAS (routes/inventario/ct_color.routes.ts):
 *    - Conecta todo el flujo
 *    - Documentación completa
 *    - Endpoints RESTful
 *
 * ==========================================
 * CÓMO USAR ESTE PATRÓN:
 * ==========================================
 *
 * Para cualquier nuevo módulo (ej: ct_marca):
 *
 * 1. Copiar ct_color.interface.ts → ct_marca.interface.ts
 * 2. Copiar color.schemas.ts → marca.schemas.ts
 * 3. Actualizar ct_marca.service.ts para implementar interfaz
 * 4. Actualizar ct_marca.controller.ts para usar tipos
 * 5. Actualizar ct_marca.routes.ts con nuevas rutas
 *
 * ¡Listo! Tendrás tipado completo y código consistente.
 *
 * ==========================================
 */
