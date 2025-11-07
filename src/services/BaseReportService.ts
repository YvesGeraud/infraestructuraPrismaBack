/**
 * @fileoverview BaseReportService - Template base para servicios de reportes
 * Proporciona operaciones comunes de generación de reportes con puntos de personalización
 */

import { ConfiguracionReporte, ColumnaReporte } from "./reportes.service";

/**
 * Configuración base para un servicio de reportes
 */
export interface BaseReportServiceConfig {
  tipoReporte: string;
  tituloBase: string;
  descripcionBase: string;
}

/**
 * BaseReportService genérico para generación de reportes
 */
export abstract class BaseReportService<FilterInput> {
  protected abstract config: BaseReportServiceConfig;

  /**
   * Método abstracto para configurar columnas específicas del reporte
   */
  protected abstract configurarColumnas(
    filters?: FilterInput
  ): ColumnaReporte[];

  /**
   * Método abstracto para generar título dinámico
   */
  protected abstract generarTitulo(
    filters?: FilterInput,
    datos?: any[]
  ): string;

  /**
   * Método abstracto para generar descripción dinámica
   */
  protected abstract generarDescripcion(
    filters?: FilterInput,
    datos?: any[]
  ): string;

  /**
   * Método para generar metadatos específicos del reporte
   */
  protected generarMetadatos(
    filters?: FilterInput,
    datos?: any[]
  ): Record<string, any> {
    return {
      filtros: filters || {},
      tipoReporte: this.config.tipoReporte,
      totalRegistros: datos?.length || 0,
      fechaGeneracion: new Date().toISOString(),
      generadoPor: "Sistema de Reportes",
    };
  }

  /**
   * 📊 Generar configuración completa del reporte
   */
  protected generarConfiguracion(
    filters?: FilterInput,
    datos?: any[]
  ): ConfiguracionReporte {
    return {
      titulo: this.generarTitulo(filters, datos),
      descripcion: this.generarDescripcion(filters, datos),
      columnas: this.configurarColumnas(filters),
      metadatos: this.generarMetadatos(filters, datos),
    };
  }

  /**
   * 🎯 Método principal para generar reporte (implementado por servicios específicos)
   */
  abstract generarReporte(datos: any[], filters?: FilterInput): Promise<Buffer>;
}
