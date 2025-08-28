import { Request, Response } from "express";
import { ReportesService } from "../services/reportes.service";
import { CtArticuloBaseService } from "../services/inventario/ct_articulo.service";
import { enviarRespuestaError } from "../utils/responseUtils";

/**
 * Controlador específico para generación de reportes
 * Mantiene la lógica de reportes separada de los controladores de entidades
 */
export class ReportesController {
  private reportesService: ReportesService;
  private ctArticuloService: CtArticuloBaseService;

  constructor() {
    this.reportesService = new ReportesService();
    this.ctArticuloService = new CtArticuloBaseService();
  }

  /**
   * Genera reporte PDF de artículos filtrado por jerarquía
   *
   * @route GET /api/reportes/articulos/jerarquia/:id_jerarquia/pdf
   * @param {Request} req - Objeto de petición con id_jerarquia en params
   * @param {Response} res - Objeto de respuesta
   *
   * @example
   * GET /api/reportes/articulos/jerarquia/2160/pdf
   *
   * @returns PDF file download con nombre: articulos_jerarquia_{id}_{fecha}.pdf
   */
  generarReporteArticulosPorJerarquia = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      // Validar y parsear parámetros
      const idJerarquia = parseInt(req.params.id_jerarquia, 10);

      if (!idJerarquia || idJerarquia <= 0) {
        enviarRespuestaError(res, "ID de jerarquía inválido", 400, {
          parametro: "id_jerarquia",
          valor: req.params.id_jerarquia,
        });
        return;
      }

      // Obtener artículos con información completa
      const articulos =
        await this.ctArticuloService.obtenerArticulosParaReportePorJerarquia(
          idJerarquia
        );

      if (articulos.length === 0) {
        enviarRespuestaError(
          res,
          "No se encontraron artículos para la jerarquía especificada",
          404,
          {
            idJerarquia,
            totalEncontrados: 0,
          }
        );
        return;
      }

      // Generar PDF usando el servicio de reportes
      const pdfBuffer =
        await this.reportesService.generarReporteArticulosPorJerarquia(
          articulos,
          idJerarquia
        );

      // Configurar headers de respuesta para descarga
      const nombreArchivo = `articulos_jerarquia_${idJerarquia}_${
        new Date().toISOString().split("T")[0]
      }.pdf`;

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${nombreArchivo}"`
      );
      res.setHeader("Content-Length", pdfBuffer.length);

      // Enviar el PDF
      res.send(pdfBuffer);
    } catch (error) {
      console.error("Error generando reporte PDF:", error);
      enviarRespuestaError(res, "Error interno al generar reporte PDF", 500, {
        error: error instanceof Error ? error.message : "Error desconocido",
        idJerarquia: req.params.id_jerarquia,
      });
    }
  };

  /**
   * Ejemplo de reporte genérico para otros tipos de datos
   *
   * @route POST /api/reportes/generico/pdf
   * @param {Request} req - Objeto con datos y configuración del reporte en body
   * @param {Response} res - Objeto de respuesta
   *
   * @example
   * POST /api/reportes/generico/pdf
   * {
   *   "datos": [...],
   *   "configuracion": {
   *     "titulo": "Mi Reporte",
   *     "columnas": [...]
   *   }
   * }
   */
  generarReporteGenerico = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { datos, configuracion } = req.body;

      if (!datos || !Array.isArray(datos)) {
        enviarRespuestaError(
          res,
          "Datos inválidos. Se esperaba un array de datos.",
          400,
          {
            tipoRecibido: typeof datos,
          }
        );
        return;
      }

      if (!configuracion || !configuracion.titulo || !configuracion.columnas) {
        enviarRespuestaError(
          res,
          "Configuración inválida. Se requiere título y columnas.",
          400,
          {
            configuracionRecibida: configuracion,
          }
        );
        return;
      }

      // Generar PDF
      const pdfBuffer = await this.reportesService.generarReportePDF(
        datos,
        configuracion
      );

      // Configurar headers de respuesta
      const nombreArchivo = `reporte_${configuracion.titulo
        .toLowerCase()
        .replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`;

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${nombreArchivo}"`
      );
      res.setHeader("Content-Length", pdfBuffer.length);

      // Enviar el PDF
      res.send(pdfBuffer);
    } catch (error) {
      console.error("Error generando reporte genérico:", error);
      enviarRespuestaError(
        res,
        "Error interno al generar reporte genérico",
        500,
        {
          error: error instanceof Error ? error.message : "Error desconocido",
        }
      );
    }
  };
}

export const reportesController = new ReportesController();
