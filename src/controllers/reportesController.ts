import { Request, Response } from "express";
import { ReportesService } from "../services/reportesService";
import { SolicitudReporte } from "../types/reports";
import { RespuestaUtil } from "../utils/respuestas";
import logger from "../config/logger";

export class ReportesController {
  private reportesService: ReportesService;

  constructor() {
    this.reportesService = new ReportesService();
  }

  /**
   * Genera un reporte según la solicitud con validación mejorada
   */
  generarReporte = async (req: Request, res: Response): Promise<void> => {
    try {
      const solicitud: SolicitudReporte = req.body;
      const usuarioGenerador = req.usuario?.email || "sistema";

      // Validación de entrada
      if (!solicitud.tipo || !solicitud.formato) {
        return RespuestaUtil.errorValidacion(
          res,
          "Tipo y formato de reporte son requeridos"
        );
      }

      logger.info(
        `Solicitud de reporte: ${solicitud.tipo} en formato ${solicitud.formato} por ${usuarioGenerador}`
      );

      const resultado = await this.reportesService.generarReporte(
        solicitud,
        usuarioGenerador
      );

      if (resultado.exito) {
        RespuestaUtil.exito(
          res,
          {
            archivo: resultado.datos?.archivo,
            metadatos: resultado.datos?.metadatos,
          },
          resultado.mensaje
        );
      } else {
        RespuestaUtil.errorValidacion(
          res,
          resultado.mensaje,
          resultado.errores?.join(", ")
        );
      }
    } catch (error) {
      logger.error("Error generando reporte:", error);
      RespuestaUtil.error(
        res,
        "Error interno del servidor",
        500,
        error instanceof Error ? error.message : "Error desconocido"
      );
    }
  };

  /**
   * Genera un reporte de usuarios optimizado
   */
  generarReporteUsuarios = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const {
        formato = "pdf",
        incluirGraficos = false,
        incluirTotales = true,
        filtros = [],
        ordenamiento = [],
        agrupacion = [],
      } = req.body;

      const usuarioGenerador = req.usuario?.email || "sistema";

      const solicitud: SolicitudReporte = {
        tipo: "usuarios",
        formato: formato as "pdf" | "excel",
        filtros,
        ordenamiento,
        agrupacion,
        opciones: {
          incluirGraficos,
          incluirTotales,
          incluirMetadatos: true,
        },
      };

      logger.info(`Generando reporte de usuarios en formato ${formato}`);

      const resultado = await this.reportesService.generarReporte(
        solicitud,
        usuarioGenerador
      );

      if (resultado.exito) {
        RespuestaUtil.exito(
          res,
          {
            archivo: resultado.datos?.archivo,
            metadatos: resultado.datos?.metadatos,
          },
          "Reporte de usuarios generado exitosamente"
        );
      } else {
        RespuestaUtil.errorValidacion(
          res,
          resultado.mensaje,
          resultado.errores?.join(", ")
        );
      }
    } catch (error) {
      logger.error("Error generando reporte de usuarios:", error);
      RespuestaUtil.error(
        res,
        "Error interno del servidor",
        500,
        error instanceof Error ? error.message : "Error desconocido"
      );
    }
  };

  /**
   * Genera un reporte de productos optimizado
   */
  generarReporteProductos = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const {
        formato = "pdf",
        incluirGraficos = false,
        incluirTotales = true,
        filtros = [],
        ordenamiento = [],
        agrupacion = [],
      } = req.body;

      const usuarioGenerador = req.usuario?.email || "sistema";

      const solicitud: SolicitudReporte = {
        tipo: "productos",
        formato: formato as "pdf" | "excel",
        filtros,
        ordenamiento,
        agrupacion,
        opciones: {
          incluirGraficos,
          incluirTotales,
          incluirMetadatos: true,
        },
      };

      logger.info(`Generando reporte de productos en formato ${formato}`);

      const resultado = await this.reportesService.generarReporte(
        solicitud,
        usuarioGenerador
      );

      if (resultado.exito) {
        RespuestaUtil.exito(
          res,
          {
            archivo: resultado.datos?.archivo,
            metadatos: resultado.datos?.metadatos,
          },
          "Reporte de productos generado exitosamente"
        );
      } else {
        RespuestaUtil.errorValidacion(
          res,
          resultado.mensaje,
          resultado.errores?.join(", ")
        );
      }
    } catch (error) {
      logger.error("Error generando reporte de productos:", error);
      RespuestaUtil.error(
        res,
        "Error interno del servidor",
        500,
        error instanceof Error ? error.message : "Error desconocido"
      );
    }
  };

  /**
   * Genera un reporte de archivos optimizado
   */
  generarReporteArchivos = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const {
        formato = "pdf",
        incluirGraficos = false,
        incluirTotales = true,
        filtros = [],
        ordenamiento = [],
        agrupacion = [],
      } = req.body;

      const usuarioGenerador = req.usuario?.email || "sistema";

      const solicitud: SolicitudReporte = {
        tipo: "archivos",
        formato: formato as "pdf" | "excel",
        filtros,
        ordenamiento,
        agrupacion,
        opciones: {
          incluirGraficos,
          incluirTotales,
          incluirMetadatos: true,
        },
      };

      logger.info(`Generando reporte de archivos en formato ${formato}`);

      const resultado = await this.reportesService.generarReporte(
        solicitud,
        usuarioGenerador
      );

      if (resultado.exito) {
        RespuestaUtil.exito(
          res,
          {
            archivo: resultado.datos?.archivo,
            metadatos: resultado.datos?.metadatos,
          },
          "Reporte de archivos generado exitosamente"
        );
      } else {
        RespuestaUtil.errorValidacion(
          res,
          resultado.mensaje,
          resultado.errores?.join(", ")
        );
      }
    } catch (error) {
      logger.error("Error generando reporte de archivos:", error);
      RespuestaUtil.error(
        res,
        "Error interno del servidor",
        500,
        error instanceof Error ? error.message : "Error desconocido"
      );
    }
  };

  /**
   * Genera un reporte de emails optimizado
   */
  generarReporteEmails = async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        formato = "pdf",
        incluirGraficos = false,
        incluirTotales = true,
        filtros = [],
        ordenamiento = [],
        agrupacion = [],
      } = req.body;

      const usuarioGenerador = req.usuario?.email || "sistema";

      const solicitud: SolicitudReporte = {
        tipo: "emails",
        formato: formato as "pdf" | "excel",
        filtros,
        ordenamiento,
        agrupacion,
        opciones: {
          incluirGraficos,
          incluirTotales,
          incluirMetadatos: true,
        },
      };

      logger.info(`Generando reporte de emails en formato ${formato}`);

      const resultado = await this.reportesService.generarReporte(
        solicitud,
        usuarioGenerador
      );

      if (resultado.exito) {
        RespuestaUtil.exito(
          res,
          {
            archivo: resultado.datos?.archivo,
            metadatos: resultado.datos?.metadatos,
          },
          "Reporte de emails generado exitosamente"
        );
      } else {
        RespuestaUtil.errorValidacion(
          res,
          resultado.mensaje,
          resultado.errores?.join(", ")
        );
      }
    } catch (error) {
      logger.error("Error generando reporte de emails:", error);
      RespuestaUtil.error(
        res,
        "Error interno del servidor",
        500,
        error instanceof Error ? error.message : "Error desconocido"
      );
    }
  };

  /**
   * Genera un reporte del sistema optimizado
   */
  generarReporteSistema = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const {
        formato = "pdf",
        incluirGraficos = true,
        incluirTotales = true,
        filtros = [],
        ordenamiento = [],
        agrupacion = [],
      } = req.body;

      const usuarioGenerador = req.usuario?.email || "sistema";

      const solicitud: SolicitudReporte = {
        tipo: "sistema",
        formato: formato as "pdf" | "excel",
        filtros,
        ordenamiento,
        agrupacion,
        opciones: {
          incluirGraficos,
          incluirTotales,
          incluirMetadatos: true,
        },
      };

      logger.info(`Generando reporte del sistema en formato ${formato}`);

      const resultado = await this.reportesService.generarReporte(
        solicitud,
        usuarioGenerador
      );

      if (resultado.exito) {
        RespuestaUtil.exito(
          res,
          {
            archivo: resultado.datos?.archivo,
            metadatos: resultado.datos?.metadatos,
          },
          "Reporte del sistema generado exitosamente"
        );
      } else {
        RespuestaUtil.errorValidacion(
          res,
          resultado.mensaje,
          resultado.errores?.join(", ")
        );
      }
    } catch (error) {
      logger.error("Error generando reporte del sistema:", error);
      RespuestaUtil.error(
        res,
        "Error interno del servidor",
        500,
        error instanceof Error ? error.message : "Error desconocido"
      );
    }
  };

  /**
   * Obtiene las estadísticas de reportes optimizado
   */
  obtenerEstadisticas = async (req: Request, res: Response): Promise<void> => {
    try {
      const estadisticas = this.reportesService.getEstadisticas();

      RespuestaUtil.exito(
        res,
        estadisticas,
        "Estadísticas obtenidas exitosamente"
      );
    } catch (error) {
      logger.error("Error obteniendo estadísticas:", error);
      RespuestaUtil.error(
        res,
        "Error interno del servidor",
        500,
        error instanceof Error ? error.message : "Error desconocido"
      );
    }
  };

  /**
   * Obtiene las métricas de reportes optimizado
   */
  obtenerMetricas = async (req: Request, res: Response): Promise<void> => {
    try {
      const metricas = this.reportesService.getMetricas();

      RespuestaUtil.exito(res, metricas, "Métricas obtenidas exitosamente");
    } catch (error) {
      logger.error("Error obteniendo métricas:", error);
      RespuestaUtil.error(
        res,
        "Error interno del servidor",
        500,
        error instanceof Error ? error.message : "Error desconocido"
      );
    }
  };

  /**
   * Obtiene los tipos de reporte disponibles optimizado
   */
  obtenerTiposDisponibles = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const tipos = this.reportesService.getTiposDisponibles();

      RespuestaUtil.exito(
        res,
        {
          tipos,
          total: tipos.length,
        },
        "Tipos de reporte obtenidos exitosamente"
      );
    } catch (error) {
      logger.error("Error obteniendo tipos de reporte:", error);
      RespuestaUtil.error(
        res,
        "Error interno del servidor",
        500,
        error instanceof Error ? error.message : "Error desconocido"
      );
    }
  };

  /**
   * Limpia archivos temporales optimizado
   */
  limpiarArchivosTemporales = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const resultado = await this.reportesService.limpiarArchivosTemporales();

      RespuestaUtil.exito(
        res,
        resultado,
        "Limpieza de archivos temporales completada"
      );
    } catch (error) {
      logger.error("Error limpiando archivos temporales:", error);
      RespuestaUtil.error(
        res,
        "Error interno del servidor",
        500,
        error instanceof Error ? error.message : "Error desconocido"
      );
    }
  };

  /**
   * Obtiene la configuración de reportes optimizado
   */
  obtenerConfiguracion = async (req: Request, res: Response): Promise<void> => {
    try {
      const tipos = this.reportesService.getTiposDisponibles();

      const configuracion = {
        tiposDisponibles: tipos,
        formatosSoportados: ["pdf", "excel"],
        opciones: {
          graficos: true,
          totales: true,
          metadatos: true,
          filtros: true,
          ordenamiento: true,
          agrupacion: true,
          cache: true,
        },
        limitaciones: {
          maxElementos: 10000,
          maxTamanoArchivo: "50MB",
          tiempoMaximoGeneracion: "5 minutos",
          duracionCache: "1 hora",
        },
        caracteristicas: {
          filtrosAvanzados: true,
          ordenamientoMultiple: true,
          agrupacionDinamica: true,
          cacheInteligente: true,
          limpiezaAutomatica: true,
          metricasEnTiempoReal: true,
        },
      };

      RespuestaUtil.exito(
        res,
        configuracion,
        "Configuración obtenida exitosamente"
      );
    } catch (error) {
      logger.error("Error obteniendo configuración:", error);
      RespuestaUtil.error(
        res,
        "Error interno del servidor",
        500,
        error instanceof Error ? error.message : "Error desconocido"
      );
    }
  };

  /**
   * Prueba la generación de un reporte simple optimizado
   */
  probarGeneracion = async (req: Request, res: Response): Promise<void> => {
    try {
      const { tipo = "usuarios", formato = "pdf" } = req.query;
      const usuarioGenerador = req.usuario?.email || "sistema";

      const solicitud: SolicitudReporte = {
        tipo: tipo as string,
        formato: formato as "pdf" | "excel",
        opciones: {
          incluirGraficos: false,
          incluirTotales: true,
          incluirMetadatos: false,
        },
      };

      logger.info(
        `Probando generación de reporte: ${tipo} en formato ${formato}`
      );

      const resultado = await this.reportesService.generarReporte(
        solicitud,
        usuarioGenerador
      );

      if (resultado.exito) {
        RespuestaUtil.exito(
          res,
          {
            archivo: resultado.datos?.archivo,
            tiempoGeneracion: resultado.datos?.metadatos?.tiempoGeneracion,
            elementos: resultado.datos?.metadatos?.elementos,
          },
          "Prueba de generación exitosa"
        );
      } else {
        RespuestaUtil.errorValidacion(
          res,
          resultado.mensaje,
          resultado.errores?.join(", ")
        );
      }
    } catch (error) {
      logger.error("Error probando generación:", error);
      RespuestaUtil.error(
        res,
        "Error interno del servidor",
        500,
        error instanceof Error ? error.message : "Error desconocido"
      );
    }
  };

  /**
   * Descarga un archivo de reporte optimizado
   */
  descargarReporte = async (req: Request, res: Response): Promise<void> => {
    try {
      const { nombreArchivo } = req.params;

      if (!nombreArchivo) {
        return RespuestaUtil.errorValidacion(
          res,
          "Nombre de archivo requerido"
        );
      }

      const rutaArchivo = `uploads/reportes/${nombreArchivo}`;

      // Verificar que el archivo existe
      const fs = require("fs");
      if (!fs.existsSync(rutaArchivo)) {
        return RespuestaUtil.noEncontrado(res, "Archivo no encontrado");
      }

      // Configurar headers para descarga
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${nombreArchivo}"`
      );

      if (nombreArchivo.endsWith(".pdf")) {
        res.setHeader("Content-Type", "application/pdf");
      } else if (nombreArchivo.endsWith(".xlsx")) {
        res.setHeader(
          "Content-Type",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
      } else if (nombreArchivo.endsWith(".xls")) {
        res.setHeader("Content-Type", "application/vnd.ms-excel");
      }

      // Enviar archivo
      res.sendFile(rutaArchivo, { root: process.cwd() });
    } catch (error) {
      logger.error("Error descargando archivo:", error);
      RespuestaUtil.error(
        res,
        "Error interno del servidor",
        500,
        error instanceof Error ? error.message : "Error desconocido"
      );
    }
  };

  /**
   * Cierra recursos del servicio optimizado
   */
  cerrarServicio = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.reportesService.cerrar();

      RespuestaUtil.exito(
        res,
        null,
        "Servicio de reportes cerrado exitosamente"
      );
    } catch (error) {
      logger.error("Error cerrando servicio:", error);
      RespuestaUtil.error(
        res,
        "Error interno del servidor",
        500,
        error instanceof Error ? error.message : "Error desconocido"
      );
    }
  };
}
