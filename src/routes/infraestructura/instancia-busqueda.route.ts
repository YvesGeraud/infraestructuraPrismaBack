import { Router } from "express";
import instanciaBusquedaController from "../../controllers/infraestructura/instancia-busqueda.controller";
import { validarRequest } from "../../middleware/validacion";
import { instanciaBusquedaQuerySchema } from "../../schemas/infraestructura/instancia-busqueda.schema";

/**
 * 🎯 RUTAS PARA BÚSQUEDA UNIFICADA DE INSTANCIAS
 */

const router = Router();

/**
 * 🔍 GET /api/infraestructura/instancias/buscar
 * Buscar instancias por CCT o nombre con paginación
 *
 * @query {string} q - Término de búsqueda (CCT o nombre) - requerido, mínimo 2 caracteres
 * @query {number} pagina - Número de página (default: 1)
 * @query {number} limite - Registros por página (default: 10, máximo: 100)
 * @query {boolean} incluir_jerarquia - Incluir información de jerarquía (default: true)
 *
 * @returns {200} Respuesta paginada con instancias encontradas
 * @returns {400} Término de búsqueda inválido o parámetros incorrectos
 * @returns {500} Error del servidor
 */
router.get(
  "/buscar",
  validarRequest({ query: instanciaBusquedaQuerySchema }),
  instanciaBusquedaController.buscar.bind(instanciaBusquedaController)
);

export default router;

/*
🎉 RUTA DE BÚSQUEDA UNIFICADA DE INSTANCIAS

✅ Características:
- 🔍 Búsqueda en todas las tablas de instancias
- 📊 Retorna información completa (CCT, nombre, tipo, jerarquía)
- 🎯 Optimizado para búsquedas rápidas
- 📈 Incluye contador de artículos por instancia

💡 Ejemplos:
GET /api/infraestructura/instancias/buscar?q=29PPR0103C
GET /api/infraestructura/instancias/buscar?q=Primaria&incluir_jerarquia=true
*/
