import { Request, Response } from 'express';
import { BaseController } from './BaseController';
import { ConsultarReportesService, BuscarReportesInput } from '../services/consultarReportes.service';
import { PaginationInput } from '../schemas/commonSchemas';

/**
 * Controlador para consultar reportes generados
 * Sigue el patrón de BaseController para consistencia arquitectónica
 */
export class ConsultarReportesController extends BaseController {
  private consultarReportesService: ConsultarReportesService;

  constructor() {
    super();
    this.consultarReportesService = new ConsultarReportesService();
  }

  /**
   * 📦 Obtener todos los reportes con filtros y paginación
   * @route GET /api/reportes/consultar
   * 
   * @example GET /api/reportes/consultar?tipo=localidades&extension=pdf&pagina=1&limite=10
   */
  obtenerTodos = async (req: Request, res: Response): Promise<void> => {
    await this.manejarOperacion(
      req,
      res,
      async () => {
        const filtros: BuscarReportesInput = {
          tipo: req.query.tipo as string,
          fechaInicio: req.query.fechaInicio as string,
          fechaFin: req.query.fechaFin as string,
          extension: req.query.extension as string,
          ordenarPor: (req.query.ordenarPor as 'nombre' | 'fecha' | 'tamanio') || 'fecha',
          orden: (req.query.orden as 'asc' | 'desc') || 'desc'
        };

        const paginacion: PaginationInput = {
          pagina: req.query.pagina ? parseInt(req.query.pagina as string) : 1,
          limite: req.query.limite ? parseInt(req.query.limite as string) : 20
        };

        return await this.consultarReportesService.obtenerTodos(filtros, paginacion);
      },
      'Reportes obtenidos exitosamente'
    );
  };

  /**
   * 📦 Obtener reporte específico por nombre
   * @route GET /api/reportes/consultar/:nombreArchivo
   * 
   * @example GET /api/reportes/consultar/reporte_reporte_de_localidades_2025-10-03_17-15-22.pdf
   */
  obtenerPorNombre = async (req: Request, res: Response): Promise<void> => {
    await this.manejarOperacion(
      req,
      res,
      async () => {
        const { nombreArchivo } = req.params;

        if (!nombreArchivo) {
          throw new Error('Nombre de archivo es requerido');
        }

        return await this.consultarReportesService.obtenerPorNombre(nombreArchivo);
      },
      'Reporte encontrado exitosamente'
    );
  };

  /**
   * 📥 Descargar reporte específico
   * @route GET /api/reportes/descargar/:nombreArchivo
   * 
   * @example GET /api/reportes/descargar/reporte_reporte_de_localidades_2025-10-03_17-15-22.pdf
   * 
   * Nota: Este método no usa manejarOperacion porque necesita manejar streaming de archivos
   */
  descargarReporte = async (req: Request, res: Response): Promise<void> => {
    try {
      const { nombreArchivo } = req.params;

      if (!nombreArchivo) {
        throw new Error('Nombre de archivo es requerido');
      }

      const reporte = await this.consultarReportesService.obtenerPorNombre(nombreArchivo);

      if (!reporte) {
        throw new Error('Reporte no encontrado');
      }

      // Configurar headers para descarga
      res.setHeader('Content-Type', reporte.tipo);
      res.setHeader('Content-Disposition', `attachment; filename="${reporte.nombre}"`);
      res.setHeader('Content-Length', reporte.tamanio.toString());

      // Enviar archivo usando streaming
      const fs = require('fs');
      const stream = fs.createReadStream(reporte.ruta);
      stream.pipe(res);

      stream.on('error', (error: Error) => {
        if (!res.headersSent) {
          throw error;
        }
      });

    } catch (error) {
      if (!res.headersSent) {
        const mensaje = error instanceof Error ? error.message : 'Error al descargar reporte';
        res.status(500).json({
          exito: false,
          mensaje,
          datos: null,
          meta: {
            codigoEstado: 500,
            fechaHora: new Date().toISOString()
          }
        });
      }
    }
  };

  /**
   * 👁️ Visualizar reporte en el navegador (inline)
   * @route GET /api/reportes/ver/:nombreArchivo
   * 
   * @example GET /api/reportes/ver/reporte_reporte_de_localidades_2025-10-03_17-15-22.pdf
   * 
   * Diferencia con descargar: Este muestra el PDF en el navegador en lugar de descargarlo
   */
  verReporte = async (req: Request, res: Response): Promise<void> => {
    try {
      const { nombreArchivo } = req.params;

      if (!nombreArchivo) {
        throw new Error('Nombre de archivo es requerido');
      }

      const reporte = await this.consultarReportesService.obtenerPorNombre(nombreArchivo);

      if (!reporte) {
        throw new Error('Reporte no encontrado');
      }

      // Configurar headers para visualización inline
      res.setHeader('Content-Type', reporte.tipo);
      res.setHeader('Content-Disposition', `inline; filename="${reporte.nombre}"`); // inline en lugar de attachment
      res.setHeader('Content-Length', reporte.tamanio.toString());

      // Enviar archivo usando streaming
      const fs = require('fs');
      const stream = fs.createReadStream(reporte.ruta);
      stream.pipe(res);

      stream.on('error', (error: Error) => {
        if (!res.headersSent) {
          throw error;
        }
      });

    } catch (error) {
      if (!res.headersSent) {
        const mensaje = error instanceof Error ? error.message : 'Error al visualizar reporte';
        res.status(500).json({
          exito: false,
          mensaje,
          datos: null,
          meta: {
            codigoEstado: 500,
            fechaHora: new Date().toISOString()
          }
        });
      }
    }
  };

  /**
   * 🗑️ Eliminar reporte específico
   * @route DELETE /api/reportes/eliminar/:nombreArchivo
   * 
   * @example DELETE /api/reportes/eliminar/reporte_reporte_de_localidades_2025-10-03_17-15-22.pdf
   */
  eliminar = async (req: Request, res: Response): Promise<void> => {
    await this.manejarOperacion(
      req,
      res,
      async () => {
        const { nombreArchivo } = req.params;

        if (!nombreArchivo) {
          throw new Error('Nombre de archivo es requerido');
        }

        await this.consultarReportesService.eliminar(nombreArchivo);
        return { nombreArchivo };
      },
      'Reporte eliminado exitosamente'
    );
  };

  /**
   * 📊 Obtener estadísticas de reportes
   * @route GET /api/reportes/estadisticas
   * 
   * @example GET /api/reportes/estadisticas
   */
  obtenerEstadisticas = async (req: Request, res: Response): Promise<void> => {
    await this.manejarOperacion(
      req,
      res,
      async () => {
        return await this.consultarReportesService.obtenerEstadisticas();
      },
      'Estadísticas obtenidas exitosamente'
    );
  };

  /**
   * 🧹 Limpiar reportes antiguos
   * @route POST /api/reportes/limpiar
   * 
   * @example POST /api/reportes/limpiar
   */
  limpiarReportesAntiguos = async (req: Request, res: Response): Promise<void> => {
    await this.manejarOperacion(
      req,
      res,
      async () => {
        const eliminados = await this.consultarReportesService.limpiarReportesAntiguos();
        return { eliminados };
      },
      'Reportes antiguos eliminados exitosamente'
    );
  };
}
