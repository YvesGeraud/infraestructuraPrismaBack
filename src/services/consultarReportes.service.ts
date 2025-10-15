import fs from 'fs';
import path from 'path';
import { reportesConfig } from '../config/reports';
import logger from '../config/logger';
import { PaginatedResponse } from '../types';

/**
 * Interfaz para metadatos de reportes
 */
export interface MetadatosReporte {
  nombre: string;
  ruta: string;
  tamanio: number;
  fechaCreacion: Date;
  fechaModificacion: Date;
  tipo: string;
  extension: string;
  url: string;
}

/**
 * Interfaz para filtros de consulta de reportes
 */
export interface BuscarReportesInput {
  tipo?: string;
  fechaInicio?: string;
  fechaFin?: string;
  extension?: string;
  ordenarPor?: 'nombre' | 'fecha' | 'tamanio';
  orden?: 'asc' | 'desc';
}

/**
 * Configuración del servicio de reportes
 */
interface ConsultarReportesServiceConfig {
  directorio: string;
  extensionesPermitidas: string[];
}

/**
 * Servicio para consultar reportes generados
 * Sigue el patrón de BaseService para consistencia arquitectónica
 */
export class ConsultarReportesService {
  protected config: ConsultarReportesServiceConfig;

  constructor() {
    this.config = {
      directorio: path.join(process.cwd(), reportesConfig.directorio),
      extensionesPermitidas: reportesConfig.seguridad.tiposPermitidos
    };
  }

  /**
   * 🔍 Obtener todos los reportes con filtros y paginación
   * Sigue el patrón de BaseService.obtenerTodos()
   */
  async obtenerTodos(
    filtros: BuscarReportesInput = {},
    paginacion: { pagina?: number; limite?: number } = {}
  ): Promise<PaginatedResponse<MetadatosReporte>> {
    try {
      const tiempoInicio = Date.now();

      // Verificar que el directorio existe
      if (!fs.existsSync(this.config.directorio)) {
        logger.warn(`📁 Directorio de reportes no existe: ${this.config.directorio}`);
        return this.crearRespuestaVacia(paginacion);
      }

      // Leer archivos del directorio
      const archivos = fs.readdirSync(this.config.directorio);
      
      // Procesar archivos: validar, obtener metadatos y aplicar filtros
      const reportes: MetadatosReporte[] = archivos
        .filter(archivo => this.esArchivoValido(archivo))
        .map(archivo => this.obtenerMetadatosArchivo(archivo))
        .filter(metadatos => this.aplicarFiltros(metadatos, filtros));

      // Ordenar reportes
      const reportesOrdenados = this.ordenarReportes(reportes, filtros.ordenarPor, filtros.orden);

      // Aplicar paginación
      const pagina = paginacion.pagina || 1;
      const limite = paginacion.limite || 20;
      const skip = (pagina - 1) * limite;
      const take = limite;
      
      const reportesPaginados = reportesOrdenados.slice(skip, skip + take);
      const total = reportesOrdenados.length;
      const totalPaginas = Math.ceil(total / limite);

      const tiempoConsulta = Date.now() - tiempoInicio;
      logger.info(`📊 Consulta de reportes: ${reportesPaginados.length} de ${total} reportes (${tiempoConsulta}ms)`);

      return {
        data: reportesPaginados,
        pagination: {
          pagina,
          limite,
          total,
          totalPaginas,
          tieneSiguiente: pagina < totalPaginas,
          tieneAnterior: pagina > 1
        }
      };

    } catch (error) {
      logger.error('❌ Error consultando reportes:', error);
      throw new Error('Error al consultar reportes');
    }
  }

  /**
   * Crear respuesta vacía cuando no hay reportes
   */
  private crearRespuestaVacia(paginacion: { pagina?: number; limite?: number }): PaginatedResponse<MetadatosReporte> {
    return {
      data: [],
      pagination: {
        pagina: paginacion.pagina || 1,
        limite: paginacion.limite || 20,
        total: 0,
        totalPaginas: 0,
        tieneSiguiente: false,
        tieneAnterior: false
      }
    };
  }

  /**
   * 🔍 Obtener un reporte específico por nombre
   * Sigue el patrón de BaseService.obtenerPorId()
   */
  async obtenerPorNombre(nombreArchivo: string): Promise<MetadatosReporte | null> {
    try {
      const rutaArchivo = path.join(this.config.directorio, nombreArchivo);
      
      if (!fs.existsSync(rutaArchivo)) {
        logger.warn(`📄 Reporte no encontrado: ${nombreArchivo}`);
        return null;
      }

      const metadatos = this.obtenerMetadatosArchivo(nombreArchivo);
      logger.info(`📄 Reporte encontrado: ${nombreArchivo} (${metadatos.tamanio} bytes)`);
      
      return metadatos;
    } catch (error) {
      logger.error(`❌ Error obteniendo reporte ${nombreArchivo}:`, error);
      throw new Error(`Error al obtener reporte: ${nombreArchivo}`);
    }
  }

  /**
   * 🗑️ Eliminar un reporte específico
   * Sigue el patrón de BaseService.eliminar()
   */
  async eliminar(nombreArchivo: string): Promise<void> {
    try {
      const rutaArchivo = path.join(this.config.directorio, nombreArchivo);
      
      if (!fs.existsSync(rutaArchivo)) {
        throw new Error(`Reporte no encontrado: ${nombreArchivo}`);
      }

      fs.unlinkSync(rutaArchivo);
      logger.info(`🗑️ Reporte eliminado exitosamente: ${nombreArchivo}`);
      
    } catch (error) {
      logger.error(`❌ Error eliminando reporte ${nombreArchivo}:`, error);
      throw new Error(`Error al eliminar reporte: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  /**
   * 🧹 Limpiar reportes antiguos según configuración
   * Método de utilidad específico del servicio
   */
  async limpiarReportesAntiguos(): Promise<number> {
    try {
      const maxEdad = reportesConfig.limpieza.maxEdad;
      const archivos = fs.readdirSync(this.config.directorio);
      let eliminados = 0;

      for (const archivo of archivos) {
        if (!this.esArchivoValido(archivo)) continue;

        const rutaArchivo = path.join(this.config.directorio, archivo);
        const stats = fs.statSync(rutaArchivo);
        const edadArchivo = Date.now() - stats.mtime.getTime();

        if (edadArchivo > maxEdad) {
          fs.unlinkSync(rutaArchivo);
          eliminados++;
          logger.info(`🧹 Reporte antiguo eliminado: ${archivo} (edad: ${Math.floor(edadArchivo / (24 * 60 * 60 * 1000))} días)`);
        }
      }

      logger.info(`🧹 Limpieza completada: ${eliminados} reportes antiguos eliminados`);
      return eliminados;

    } catch (error) {
      logger.error('❌ Error limpiando reportes antiguos:', error);
      throw new Error('Error al limpiar reportes antiguos');
    }
  }

  /**
   * 📊 Obtener estadísticas de los reportes
   * Método de utilidad específico del servicio
   */
  async obtenerEstadisticas(): Promise<{
    totalReportes: number;
    tamanioTotal: number;
    porExtension: Record<string, number>;
    porTipo: Record<string, number>;
    reporteMasAntiguo?: Date;
    reporteMasReciente?: Date;
  }> {
    try {
      if (!fs.existsSync(this.config.directorio)) {
        logger.warn(`📁 Directorio de reportes no existe: ${this.config.directorio}`);
        return this.crearEstadisticasVacias();
      }

      const archivos = fs.readdirSync(this.config.directorio);
      const reportes = archivos
        .filter(archivo => this.esArchivoValido(archivo))
        .map(archivo => this.obtenerMetadatosArchivo(archivo));

      const estadisticas = {
        totalReportes: reportes.length,
        tamanioTotal: reportes.reduce((total, reporte) => total + reporte.tamanio, 0),
        porExtension: {} as Record<string, number>,
        porTipo: {} as Record<string, number>,
        reporteMasAntiguo: undefined as Date | undefined,
        reporteMasReciente: undefined as Date | undefined
      };

      // Calcular estadísticas
      for (const reporte of reportes) {
        // Por extensión
        estadisticas.porExtension[reporte.extension] = 
          (estadisticas.porExtension[reporte.extension] || 0) + 1;

        // Por tipo (extraer del nombre del archivo)
        const tipo = this.extraerTipoReporte(reporte.nombre);
        estadisticas.porTipo[tipo] = (estadisticas.porTipo[tipo] || 0) + 1;

        // Fechas
        if (!estadisticas.reporteMasAntiguo || reporte.fechaCreacion < estadisticas.reporteMasAntiguo) {
          estadisticas.reporteMasAntiguo = reporte.fechaCreacion;
        }
        if (!estadisticas.reporteMasReciente || reporte.fechaCreacion > estadisticas.reporteMasReciente) {
          estadisticas.reporteMasReciente = reporte.fechaCreacion;
        }
      }

      logger.info(`📊 Estadísticas generadas: ${estadisticas.totalReportes} reportes, ${(estadisticas.tamanioTotal / 1024 / 1024).toFixed(2)}MB`);
      return estadisticas;

    } catch (error) {
      logger.error('❌ Error obteniendo estadísticas:', error);
      throw new Error('Error al obtener estadísticas de reportes');
    }
  }

  /**
   * Crear estadísticas vacías
   */
  private crearEstadisticasVacias() {
    return {
      totalReportes: 0,
      tamanioTotal: 0,
      porExtension: {},
      porTipo: {},
      reporteMasAntiguo: undefined,
      reporteMasReciente: undefined
    };
  }

  /**
   * 🔍 Verificar si un archivo es válido para reportes
   */
  private esArchivoValido(archivo: string): boolean {
    const extension = path.extname(archivo).toLowerCase().substring(1);
    return this.config.extensionesPermitidas.includes(extension);
  }

  /**
   * 📄 Obtener metadatos de un archivo
   */
  private obtenerMetadatosArchivo(archivo: string): MetadatosReporte {
    const rutaArchivo = path.join(this.config.directorio, archivo);
    const stats = fs.statSync(rutaArchivo);
    const extension = path.extname(archivo).toLowerCase().substring(1);

    return {
      nombre: archivo,
      ruta: rutaArchivo,
      tamanio: stats.size,
      fechaCreacion: stats.birthtime,
      fechaModificacion: stats.mtime,
      tipo: this.obtenerTipoMIME(extension),
      extension,
      url: `/uploads/reportes/${archivo}`
    };
  }

  /**
   * 🔧 Aplicar filtros a los reportes
   */
  private aplicarFiltros(reporte: MetadatosReporte, filtros: BuscarReportesInput): boolean {
    // Filtro por tipo
    if (filtros.tipo) {
      const tipoReporte = this.extraerTipoReporte(reporte.nombre);
      if (!tipoReporte.toLowerCase().includes(filtros.tipo.toLowerCase())) {
        return false;
      }
    }

    // Filtro por extensión
    if (filtros.extension && reporte.extension !== filtros.extension) {
      return false;
    }

    // Filtro por fecha
    if (filtros.fechaInicio) {
      const fechaInicio = new Date(filtros.fechaInicio);
      if (reporte.fechaCreacion < fechaInicio) {
        return false;
      }
    }

    if (filtros.fechaFin) {
      const fechaFin = new Date(filtros.fechaFin);
      if (reporte.fechaCreacion > fechaFin) {
        return false;
      }
    }

    return true;
  }

  /**
   * 🔀 Ordenar reportes según criterios
   */
  private ordenarReportes(
    reportes: MetadatosReporte[], 
    ordenarPor?: 'nombre' | 'fecha' | 'tamanio', 
    orden?: 'asc' | 'desc'
  ): MetadatosReporte[] {
    const ordenFinal = orden || 'desc';
    
    return reportes.sort((a, b) => {
      let valorA: any, valorB: any;

      switch (ordenarPor) {
        case 'nombre':
          valorA = a.nombre;
          valorB = b.nombre;
          break;
        case 'tamanio':
          valorA = a.tamanio;
          valorB = b.tamanio;
          break;
        case 'fecha':
        default:
          valorA = a.fechaCreacion.getTime();
          valorB = b.fechaCreacion.getTime();
          break;
      }

      if (ordenFinal === 'asc') {
        return valorA > valorB ? 1 : -1;
      } else {
        return valorA < valorB ? 1 : -1;
      }
    });
  }

  /**
   * 🏷️ Extraer el tipo de reporte del nombre del archivo
   */
  private extraerTipoReporte(nombreArchivo: string): string {
    // Ejemplo: "reporte_reporte_de_localidades_2025-10-03_17-15-22.pdf"
    const match = nombreArchivo.match(/reporte_(.+?)_\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}/);
    return match ? match[1].replace(/_/g, ' ') : 'desconocido';
  }

  /**
   * 📋 Obtener el tipo MIME según la extensión
   */
  private obtenerTipoMIME(extension: string): string {
    const tiposMIME: Record<string, string> = {
      'pdf': 'application/pdf',
      'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'xls': 'application/vnd.ms-excel',
      'csv': 'text/csv'
    };
    
    return tiposMIME[extension] || 'application/octet-stream';
  }
}
