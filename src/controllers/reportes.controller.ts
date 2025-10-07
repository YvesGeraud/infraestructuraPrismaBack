import { Request, Response } from "express";
import { ReportesService } from "../services/reportes.service";
import { CtLocalidadBaseService } from "../services/ct_localidad.service";
import {
  enviarRespuestaExitosa,
  enviarRespuestaError,
} from "../utils/responseUtils";

/**
 * Controlador específico para generación de reportes
 * Adaptado para trabajar con localidades y sus relaciones con municipios y estados
 */
export class ReportesController {
  private reportesService: ReportesService;
  private ctLocalidadService: CtLocalidadBaseService;

  constructor() {
    this.reportesService = new ReportesService();
    this.ctLocalidadService = new CtLocalidadBaseService();
  }

  /**
   * Genera reporte PDF de localidades con información de municipios y estados
   *
   * @route GET /api/reportes/localidades/pdf
   * @param {Request} req - Objeto de petición con filtros opcionales en query
   * @param {Response} res - Objeto de respuesta
   *
   * @example
   * GET /api/reportes/localidades/pdf?ambito=U&incluir_municipio_con_entidad=true
   *
   * @returns PDF file download con nombre: localidades_reporte_{fecha}.pdf
   */
  generarReporteLocalidades = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      // Debug: Log para verificar filtros
      console.log("🔍 Filtros para reportes:", req.query);

      // 🔢 PASO 1: Contar registros para decidir estrategia
      const totalRegistros = await this.ctLocalidadService.contarRegistros(
        req.query as any
      );

      console.log(`📊 Total de registros a procesar: ${totalRegistros}`);

      if (totalRegistros === 0) {
        enviarRespuestaError(
          res,
          "No se encontraron localidades para los filtros especificados",
          404,
          {
            filtros: req.query,
            totalEncontrados: 0,
          }
        );
        return;
      }

      // 🎯 PASO 2: Sistema híbrido inteligente
      const configuracion = {
        titulo: "Reporte de Localidades",
        descripcion:
          totalRegistros >= 5000
            ? `Reporte masivo con ${totalRegistros.toLocaleString()} localidades (generado con streaming)`
            : `Reporte con ${totalRegistros.toLocaleString()} localidades`,
        columnas: this.obtenerColumnasLocalidades(req.query as any),
        filtros: req.query,
      };

      // 📊 PASO 3: Generar PDF con estrategia híbrida
      const pdfBuffer = await this.reportesService.generarReportePDFHibrido(
        totalRegistros,
        () =>
          this.ctLocalidadService.obtenerTodosSinPaginacion(req.query as any),
        configuracion
      );

      // Configurar headers de respuesta para descarga
      const fechaActual = new Date().toISOString().split("T")[0];
      const nombreArchivo = `localidades_reporte_${fechaActual}.pdf`;

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${nombreArchivo}"`
      );
      res.setHeader("Content-Length", pdfBuffer.length);

      // Enviar el PDF
      res.send(pdfBuffer);
    } catch (error) {
      console.error("Error generando reporte de localidades:", error);
      enviarRespuestaError(
        res,
        "Error interno al generar reporte de localidades",
        500,
        {
          error: error instanceof Error ? error.message : "Error desconocido",
          filtros: req.query,
        }
      );
    }
  };

  /**
   * Genera reporte PDF de localidades filtrado por municipio específico
   *
   * @route GET /api/reportes/localidades/municipio/:id_municipio/pdf
   * @param {Request} req - Objeto de petición con id_municipio en params
   * @param {Response} res - Objeto de respuesta
   *
   * @example
   * GET /api/reportes/localidades/municipio/1/pdf
   *
   * @returns PDF file download con nombre: localidades_municipio_{id}_{fecha}.pdf
   */
  generarReporteLocalidadesPorMunicipio = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      // Validar y parsear parámetros
      const idMunicipio = parseInt(req.params.id_municipio, 10);

      if (!idMunicipio || idMunicipio <= 0) {
        enviarRespuestaError(res, "ID de municipio inválido", 400, {
          parametro: "id_municipio",
          valor: req.params.id_municipio,
        });
        return;
      }

      // Filtros específicos para el municipio
      const filtros = {
        id_ct_municipio: idMunicipio,
        incluir_municipio_con_entidad: true,
      };

      // 📊 REPORTES: Usar método sin paginación para obtener TODOS los registros
      const localidades =
        await this.ctLocalidadService.obtenerTodosSinPaginacion(filtros);

      if (!localidades || localidades.length === 0) {
        enviarRespuestaError(
          res,
          "No se encontraron localidades para el municipio especificado",
          404,
          {
            idMunicipio,
            totalEncontrados: 0,
          }
        );
        return;
      }

      // Obtener información del municipio para el título
      const municipioInfo = (localidades[0] as any)?.ct_municipio;

      // Usar el método específico del servicio
      const pdfBuffer =
        await this.reportesService.generarReporteLocalidadesPorMunicipio(
          localidades,
          municipioInfo
        );

      // Configurar headers de respuesta
      const fechaActual = new Date().toISOString().split("T")[0];
      const nombreArchivo = `localidades_municipio_${idMunicipio}_${fechaActual}.pdf`;

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${nombreArchivo}"`
      );
      res.setHeader("Content-Length", pdfBuffer.length);

      // Enviar el PDF
      res.send(pdfBuffer);
    } catch (error) {
      console.error(
        "Error generando reporte de localidades por municipio:",
        error
      );
      enviarRespuestaError(res, "Error interno al generar reporte", 500, {
        error: error instanceof Error ? error.message : "Error desconocido",
        idMunicipio: req.params.id_municipio,
      });
    }
  };

  /**
   * Ejemplo de reporte genérico para otros tipos de datos
   * Mantiene compatibilidad con el servicio genérico existente
   *
   * @route POST /api/reportes/generico/pdf
   * @param {Request} req - Objeto con datos y configuración del reporte en body
   * @param {Response} res - Objeto de respuesta
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

  /**
   * 📊 Genera reporte Excel de localidades (HÍBRIDO)
   *
   * @route GET /api/reportes/localidades/excel
   */
  generarReporteLocalidadesExcel = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      console.log("🔍 Filtros para reporte Excel:", req.query);

      // 🔢 PASO 1: Contar registros para decidir estrategia
      const totalRegistros = await this.ctLocalidadService.contarRegistros(
        req.query as any
      );

      console.log(`📊 Total de registros Excel a procesar: ${totalRegistros}`);

      if (totalRegistros === 0) {
        enviarRespuestaError(
          res,
          "No se encontraron localidades para los filtros especificados",
          404,
          {
            filtros: req.query,
            totalEncontrados: 0,
          }
        );
        return;
      }

      // 🎯 PASO 2: Sistema híbrido inteligente para Excel
      const configuracion = {
        titulo: "Reporte de Localidades",
        descripcion:
          totalRegistros >= 50000
            ? `Reporte masivo Excel con ${totalRegistros.toLocaleString()} localidades (streaming)`
            : `Reporte Excel con ${totalRegistros.toLocaleString()} localidades`,
        columnas: this.obtenerColumnasLocalidades(req.query as any),
        filtros: req.query,
      };

      // 📊 PASO 3: Generar Excel con estrategia híbrida
      const excelBuffer = await this.reportesService.generarReporteExcelHibrido(
        totalRegistros,
        () =>
          this.ctLocalidadService.obtenerTodosSinPaginacion(req.query as any),
        configuracion
      );

      // Configurar headers de respuesta para descarga
      const fechaActual = new Date().toISOString().split("T")[0];
      const nombreArchivo = `localidades_reporte_${fechaActual}.xlsx`;

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${nombreArchivo}"`
      );
      res.setHeader("Content-Length", excelBuffer.length);

      // Enviar el Excel
      res.send(excelBuffer);
    } catch (error) {
      console.error("Error generando reporte Excel de localidades:", error);
      enviarRespuestaError(
        res,
        "Error interno al generar reporte Excel de localidades",
        500,
        {
          error: error instanceof Error ? error.message : "Error desconocido",
          filtros: req.query,
        }
      );
    }
  };

  /**
   * 📊 Obtener configuración de columnas según filtros
   */
  private obtenerColumnasLocalidades(filtros: any): any[] {
    const tieneMunicipio = filtros?.incluir_municipio;
    const tieneMunicipioConEntidad = filtros?.incluir_municipio_con_entidad;
    const tieneAlgunInclude = tieneMunicipio || tieneMunicipioConEntidad;

    // Columnas base
    const columnas = [
      {
        campo: "id_ct_localidad",
        titulo: "ID",
        tipo: "numero",
        ancho: tieneAlgunInclude ? "10%" : "15%",
      },
      {
        campo: "nombre",
        titulo: "Localidad",
        tipo: "texto",
        ancho: tieneAlgunInclude
          ? tieneMunicipioConEntidad
            ? "25%"
            : "35%"
          : "60%",
      },
      {
        campo: "ambito",
        titulo: "Ámbito",
        tipo: "texto",
        ancho: tieneAlgunInclude
          ? tieneMunicipioConEntidad
            ? "12%"
            : "20%"
          : "25%",
        formato: (valor: any) =>
          valor === "U" ? "Urbano" : valor === "R" ? "Rural" : valor,
      },
    ];

    // Agregar columna de municipio si se incluye
    if (tieneMunicipio || tieneMunicipioConEntidad) {
      columnas.push({
        campo: "ct_municipio.nombre",
        titulo: "Municipio",
        tipo: "texto",
        ancho: tieneMunicipioConEntidad ? "28%" : "35%",
        formato: (valor: any) => valor || "Sin municipio",
      });
    }

    // Agregar columna de estado solo si se incluye con entidad
    if (tieneMunicipioConEntidad) {
      columnas.push({
        campo: "ct_municipio.ct_entidad.nombre",
        titulo: "Estado",
        tipo: "texto",
        ancho: "25%",
        formato: (valor: any) => valor || "Sin estado",
      });
    }

    return columnas;
  }
}

export const reportesController = new ReportesController();
