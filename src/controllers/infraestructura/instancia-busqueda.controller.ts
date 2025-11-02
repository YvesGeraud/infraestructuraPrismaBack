/**
 * @fileoverview Controlador para búsqueda unificada de instancias
 */

import { Request, Response, NextFunction } from "express";
import { createError } from "../../middleware/errorHandler";
import { enviarRespuestaExitosa } from "../../utils/responseUtils";
import logger from "../../config/logger";
import instanciaBusquedaService from "../../services/infraestructura/instancia-busqueda.service";
import { InstanciaBusquedaQueryInput } from "../../schemas/infraestructura/instancia-busqueda.schema";

/**
 * 🎯 CONTROLADOR PARA BÚSQUEDA UNIFICADA DE INSTANCIAS
 */
export class InstanciaBusquedaController {
  /**
   * 🔍 BUSCAR INSTANCIAS POR CCT O NOMBRE
   *
   * Endpoint: GET /api/infraestructura/instancias/buscar
   *
   * Query parameters:
   * - q: Término de búsqueda (CCT o nombre) - requerido, mínimo 2 caracteres
   * - pagina: Número de página (default: 1)
   * - limite: Registros por página (default: 10, máximo: 100)
   * - incluir_jerarquia: Incluir información de jerarquía (default: true)
   *
   * @returns Respuesta paginada con instancias encontradas
   */
  async buscar(req: Request, res: Response, next: NextFunction) {
    try {
      // Los query params ya vienen validados por el middleware de validación
      const queryParams = req.query as unknown as InstanciaBusquedaQueryInput;
      const { q } = queryParams;

      // Extraer y normalizar parámetros de paginación
      const pagina =
        typeof queryParams.pagina === "number"
          ? queryParams.pagina
          : queryParams.pagina
          ? parseInt(queryParams.pagina as unknown as string, 10) || 1
          : 1;

      const limite =
        typeof queryParams.limite === "number"
          ? queryParams.limite
          : queryParams.limite
          ? parseInt(queryParams.limite as unknown as string, 10) || 10
          : 10;

      // incluir_jerarquia ya viene transformado a boolean por el schema
      const incluirJerarquia =
        typeof queryParams.incluir_jerarquia === "boolean"
          ? queryParams.incluir_jerarquia
          : true; // Default

      logger.info(
        `🔍 Búsqueda unificada: "${q}" (página: ${pagina}, límite: ${limite}, incluirJerarquia: ${incluirJerarquia})`
      );

      const resultado = await instanciaBusquedaService.buscarPorCctONombre(q, {
        pagina,
        limite,
        incluirJerarquia,
      });

      return enviarRespuestaExitosa(res, {
        datos: resultado.datos,
        mensaje: `Se encontraron ${resultado.paginacion.total} instancia(s)`,
        codigoEstado: 200,
        metaAdicional: {
          paginacion: resultado.paginacion,
        },
      });
    } catch (error) {
      logger.error("❌ Error en búsqueda unificada:", error);
      next(error);
    }
  }
}

// Exportar instancia única
const instanciaBusquedaController = new InstanciaBusquedaController();
export default instanciaBusquedaController;
