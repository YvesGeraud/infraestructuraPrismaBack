import { Request, Response } from "express";
import reporteInventarioService from "../../services/inventario/reporte-inventario.service";
import { FiltrosReporteInventario } from "../../interfaces/inventario/reporte.interfaces";
import { createError } from "../../middleware/errorHandler";

export class ReporteInventarioController {
  /**
   * Genera reporte de inventario por unidad
   * POST /api/inventario/reporte/generar
   */
  generarReporte = async (req: Request, res: Response) => {
    try {
      const { id_rl_infraestructura_jerarquia, cct, incluirInactivos } =
        req.body;

      const filtros: FiltrosReporteInventario = {
        id_rl_infraestructura_jerarquia,
        cct,
        incluirInactivos: incluirInactivos || false,
      };

      const resultado = await reporteInventarioService.generarReportePorUnidad(
        filtros
      );
      res.json(resultado);
    } catch (error: any) {
      res.status(500).json({
        exito: false,
        mensaje: error.message || "Error interno del servidor",
        datos: null,
        meta: {
          codigoEstado: 500,
          fechaHora: new Date().toISOString(),
        },
      });
    }
  };

  /**
   * Obtiene estadísticas del reporte
   * GET /api/inventario/reporte/estadisticas
   */
  obtenerEstadisticas = async (req: Request, res: Response) => {
    try {
      const { id_rl_infraestructura_jerarquia, cct, incluirInactivos } =
        req.query;

      const filtros: FiltrosReporteInventario = {
        id_rl_infraestructura_jerarquia: id_rl_infraestructura_jerarquia
          ? parseInt(id_rl_infraestructura_jerarquia as string)
          : undefined,
        cct: cct as string,
        incluirInactivos: incluirInactivos === "true",
      };

      const estadisticas =
        await reporteInventarioService.obtenerEstadisticasReporte(filtros);
      res.json({
        exito: true,
        mensaje: "Estadísticas obtenidas exitosamente",
        datos: estadisticas,
        meta: {
          codigoEstado: 200,
          fechaHora: new Date().toISOString(),
        },
      });
    } catch (error: any) {
      res.status(500).json({
        exito: false,
        mensaje: error.message || "Error interno del servidor",
        datos: null,
        meta: {
          codigoEstado: 500,
          fechaHora: new Date().toISOString(),
        },
      });
    }
  };
}

export default new ReporteInventarioController();
