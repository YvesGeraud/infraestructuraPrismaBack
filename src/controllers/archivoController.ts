import { Request, Response } from "express";
import {
  ArchivoService,
  MetadatosArchivo,
  ImagenOptimizada,
} from "../services/archivoService";
import { BaseController } from "./BaseController";
import { uploadConfig } from "../config/upload";
import logger from "../config/logger";
import fs from "fs";
import path from "path";

const archivoService = new ArchivoService();

export class ArchivoController extends BaseController {
  /**
   * Subir un solo archivo
   */
  async subirArchivo(req: Request, res: Response): Promise<void> {
    await this.manejarOperacion(
      req,
      res,
      async () => {
        if (!req.archivo) {
          throw new Error("No se ha subido ningún archivo");
        }

        const archivo = req.archivo as any;
        const informacion = await archivoService.obtenerInformacionArchivo(
          archivo.path
        );

        if (!informacion) {
          throw new Error("No se pudo obtener información del archivo");
        }

        // Asignar usuario si está autenticado
        if (req.usuario) {
          informacion.usuarioId = req.usuario.id;
        }

        logger.info(
          `Archivo subido: ${informacion.nombreOriginal} por usuario ${
            req.usuario?.id || "anónimo"
          }`
        );

        return {
          archivo: informacion,
          mensaje: "Archivo subido exitosamente",
        };
      },
      "Archivo subido exitosamente"
    );
  }

  /**
   * Subir múltiples archivos
   */
  async subirMultiplesArchivos(req: Request, res: Response): Promise<void> {
    await this.manejarOperacion(
      req,
      res,
      async () => {
        if (!req.archivos || !Array.isArray(req.archivos)) {
          throw new Error("No se han subido archivos");
        }

        const archivos = req.archivos as any[];
        const informaciones: MetadatosArchivo[] = [];

        for (const archivo of archivos) {
          const informacion = await archivoService.obtenerInformacionArchivo(
            archivo.path
          );
          if (informacion) {
            if (req.usuario) {
              informacion.usuarioId = req.usuario.id;
            }
            informaciones.push(informacion);
          }
        }

        logger.info(
          `${informaciones.length} archivos subidos por usuario ${
            req.usuario?.id || "anónimo"
          }`
        );

        return {
          archivos: informaciones,
          total: informaciones.length,
          mensaje: `${informaciones.length} archivos subidos exitosamente`,
        };
      },
      "Archivos subidos exitosamente"
    );
  }

  /**
   * Procesar imagen (optimizar + crear thumbnail)
   */
  async procesarImagen(req: Request, res: Response): Promise<void> {
    await this.manejarOperacion(
      req,
      res,
      async () => {
        if (!req.archivo) {
          throw new Error("No se ha subido ninguna imagen");
        }

        const archivo = req.archivo as any;

        // Verificar que sea una imagen
        if (!uploadConfig.tiposPermitidos.imagenes.includes(archivo.mimetype)) {
          throw new Error("El archivo debe ser una imagen");
        }

        const imagenProcesada = await archivoService.procesarImagen(
          archivo.path,
          archivo.originalname
        );

        // Asignar usuario si está autenticado
        if (req.usuario) {
          imagenProcesada.original.usuarioId = req.usuario.id;
          if (imagenProcesada.thumbnail) {
            imagenProcesada.thumbnail.usuarioId = req.usuario.id;
          }
          if (imagenProcesada.optimizada) {
            imagenProcesada.optimizada.usuarioId = req.usuario.id;
          }
        }

        logger.info(
          `Imagen procesada: ${archivo.originalname} por usuario ${
            req.usuario?.id || "anónimo"
          }`
        );

        return {
          imagen: imagenProcesada,
          mensaje: "Imagen procesada exitosamente",
        };
      },
      "Imagen procesada exitosamente"
    );
  }

  /**
   * Eliminar archivo
   */
  async eliminarArchivo(req: Request, res: Response): Promise<void> {
    await this.manejarOperacion(
      req,
      res,
      async () => {
        const { id } = req.params;
        const { ruta } = req.body;

        if (!ruta) {
          throw new Error("Ruta del archivo es requerida");
        }

        const eliminado = await archivoService.eliminarArchivo(ruta);

        if (!eliminado) {
          throw new Error("No se pudo eliminar el archivo");
        }

        logger.info(
          `Archivo eliminado: ${ruta} por usuario ${
            req.usuario?.id || "anónimo"
          }`
        );

        return {
          eliminado: true,
          mensaje: "Archivo eliminado exitosamente",
        };
      },
      "Archivo eliminado exitosamente"
    );
  }

  /**
   * Obtener información de un archivo
   */
  async obtenerInformacionArchivo(req: Request, res: Response): Promise<void> {
    await this.manejarOperacion(
      req,
      res,
      async () => {
        const { ruta } = req.params;

        const informacion = await archivoService.obtenerInformacionArchivo(
          ruta
        );

        if (!informacion) {
          throw new Error("Archivo no encontrado");
        }

        return {
          archivo: informacion,
        };
      },
      "Información del archivo obtenida"
    );
  }

  /**
   * Obtener estadísticas de almacenamiento
   */
  async obtenerEstadisticas(req: Request, res: Response): Promise<void> {
    await this.manejarOperacion(
      req,
      res,
      async () => {
        const estadisticas =
          await archivoService.obtenerEstadisticasAlmacenamiento();

        return {
          estadisticas: {
            ...estadisticas,
            tamanioTotalMB: (estadisticas.tamanioTotal / (1024 * 1024)).toFixed(
              2
            ),
            tamanioTotalGB: (
              estadisticas.tamanioTotal /
              (1024 * 1024 * 1024)
            ).toFixed(2),
          },
        };
      },
      "Estadísticas obtenidas"
    );
  }

  /**
   * Limpiar archivos temporales
   */
  async limpiarArchivosTemporales(req: Request, res: Response): Promise<void> {
    await this.manejarOperacion(
      req,
      res,
      async () => {
        const eliminados = await archivoService.limpiarArchivosTemporales();

        return {
          eliminados,
          mensaje: `${eliminados} archivos temporales eliminados`,
        };
      },
      "Archivos temporales limpiados"
    );
  }

  /**
   * Optimizar imagen existente
   */
  async optimizarImagen(req: Request, res: Response): Promise<void> {
    await this.manejarOperacion(
      req,
      res,
      async () => {
        const { ruta } = req.body;
        const { calidad, maxWidth, maxHeight, formato } = req.body;

        if (!ruta) {
          throw new Error("Ruta de la imagen es requerida");
        }

        const bufferOptimizado = await archivoService.optimizarImagen(ruta, {
          calidad,
          maxWidth,
          maxHeight,
          formato,
        });

        // Guardar imagen optimizada
        const nombreArchivo = await archivoService.guardarArchivoOptimizado(
          bufferOptimizado,
          path.basename(ruta),
          uploadConfig.directorios.imagenes,
          `.${formato || "jpg"}`
        );

        const informacion = await archivoService.obtenerInformacionArchivo(
          path.join(uploadConfig.directorios.imagenes, nombreArchivo)
        );

        if (req.usuario && informacion) {
          informacion.usuarioId = req.usuario.id;
        }

        return {
          imagenOptimizada: informacion,
          tamanioOriginal: (await fs.promises.stat(ruta)).size,
          tamanioOptimizado: bufferOptimizado.length,
          reduccion:
            (
              (((await fs.promises.stat(ruta)).size - bufferOptimizado.length) /
                (await fs.promises.stat(ruta)).size) *
              100
            ).toFixed(2) + "%",
        };
      },
      "Imagen optimizada exitosamente"
    );
  }

  /**
   * Crear thumbnail de imagen existente
   */
  async crearThumbnail(req: Request, res: Response): Promise<void> {
    await this.manejarOperacion(
      req,
      res,
      async () => {
        const { ruta } = req.body;
        const { width, height, calidad } = req.body;

        if (!ruta) {
          throw new Error("Ruta de la imagen es requerida");
        }

        const bufferThumbnail = await archivoService.crearThumbnail(ruta, {
          width,
          height,
          calidad,
        });

        // Guardar thumbnail
        const nombreArchivo = await archivoService.guardarArchivoOptimizado(
          bufferThumbnail,
          path.basename(ruta),
          uploadConfig.directorios.imagenes,
          "_thumb.jpg"
        );

        const informacion = await archivoService.obtenerInformacionArchivo(
          path.join(uploadConfig.directorios.imagenes, nombreArchivo)
        );

        if (req.usuario && informacion) {
          informacion.usuarioId = req.usuario.id;
        }

        return {
          thumbnail: informacion,
          tamanio: bufferThumbnail.length,
        };
      },
      "Thumbnail creado exitosamente"
    );
  }

  /**
   * Obtener configuración de upload
   */
  async obtenerConfiguracion(req: Request, res: Response): Promise<void> {
    await this.manejarOperacion(
      req,
      res,
      async () => {
        return {
          configuracion: {
            tiposPermitidos: uploadConfig.tiposPermitidos,
            limites: {
              imagen: `${uploadConfig.limites.imagen / (1024 * 1024)}MB`,
              documento: `${uploadConfig.limites.documento / (1024 * 1024)}MB`,
              archivo: `${uploadConfig.limites.archivo / (1024 * 1024)}MB`,
            },
            maxArchivos: uploadConfig.seguridad.maxArchivos,
            directorios: Object.keys(uploadConfig.directorios),
          },
        };
      },
      "Configuración obtenida"
    );
  }
}
