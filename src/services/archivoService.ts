import fs from "fs";
import path from "path";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import { uploadConfig } from "../config/upload";
import logger from "../config/logger";

export interface MetadatosArchivo {
  id: string;
  nombreOriginal: string;
  nombreArchivo: string;
  ruta: string;
  url: string;
  tamanio: number;
  tipo: string;
  extension: string;
  fechaSubida: Date;
  usuarioId?: number;
  descripcion?: string;
  etiquetas?: string[];
}

export interface ImagenOptimizada {
  original: MetadatosArchivo;
  thumbnail?: MetadatosArchivo;
  optimizada?: MetadatosArchivo;
}

export class ArchivoService {
  /**
   * Optimizar imagen usando Sharp
   */
  async optimizarImagen(
    rutaArchivo: string,
    opciones: {
      calidad?: number;
      maxWidth?: number;
      maxHeight?: number;
      formato?: string;
    } = {}
  ): Promise<Buffer> {
    try {
      const {
        calidad = uploadConfig.imagenes.calidad,
        maxWidth = uploadConfig.imagenes.maxWidth,
        maxHeight = uploadConfig.imagenes.maxHeight,
        formato = "jpeg",
      } = opciones;

      let imagen = sharp(rutaArchivo);

      // Redimensionar si es necesario
      const metadata = await imagen.metadata();
      if (metadata.width && metadata.height) {
        if (metadata.width > maxWidth || metadata.height > maxHeight) {
          imagen = imagen.resize(maxWidth, maxHeight, {
            fit: "inside",
            withoutEnlargement: true,
          });
        }
      }

      // Aplicar formato y calidad
      switch (formato.toLowerCase()) {
        case "jpeg":
        case "jpg":
          imagen = imagen.jpeg({ quality: calidad });
          break;
        case "png":
          imagen = imagen.png({ quality: calidad });
          break;
        case "webp":
          imagen = imagen.webp({ quality: calidad });
          break;
        default:
          imagen = imagen.jpeg({ quality: calidad });
      }

      return await imagen.toBuffer();
    } catch (error) {
      logger.error("Error al optimizar imagen:", error);
      throw new Error("Error al optimizar la imagen");
    }
  }

  /**
   * Crear thumbnail de imagen
   */
  async crearThumbnail(
    rutaArchivo: string,
    opciones: {
      width?: number;
      height?: number;
      calidad?: number;
    } = {}
  ): Promise<Buffer> {
    try {
      const {
        width = uploadConfig.imagenes.thumbnail.width,
        height = uploadConfig.imagenes.thumbnail.height,
        calidad = uploadConfig.imagenes.thumbnail.calidad,
      } = opciones;

      const thumbnail = await sharp(rutaArchivo)
        .resize(width, height, {
          fit: "cover",
          position: "center",
        })
        .jpeg({ quality: calidad })
        .toBuffer();

      return thumbnail;
    } catch (error) {
      logger.error("Error al crear thumbnail:", error);
      throw new Error("Error al crear el thumbnail");
    }
  }

  /**
   * Guardar archivo optimizado
   */
  async guardarArchivoOptimizado(
    buffer: Buffer,
    nombreOriginal: string,
    directorio: string,
    extension: string = ".jpg"
  ): Promise<string> {
    try {
      const nombreArchivo = `${uuidv4()}${extension}`;
      const rutaCompleta = path.join(directorio, nombreArchivo);

      await fs.promises.writeFile(rutaCompleta, buffer);
      logger.info(`Archivo optimizado guardado: ${rutaCompleta}`);

      return nombreArchivo;
    } catch (error) {
      logger.error("Error al guardar archivo optimizado:", error);
      throw new Error("Error al guardar el archivo optimizado");
    }
  }

  /**
   * Procesar imagen completa (original + thumbnail + optimizada)
   */
  async procesarImagen(
    rutaArchivo: string,
    nombreOriginal: string
  ): Promise<ImagenOptimizada> {
    try {
      const extension = path.extname(nombreOriginal);
      const directorio = uploadConfig.directorios.imagenes;
      const id = uuidv4();

      // Información del archivo original
      const stats = await fs.promises.stat(rutaArchivo);
      const original: MetadatosArchivo = {
        id,
        nombreOriginal,
        nombreArchivo: path.basename(rutaArchivo),
        ruta: rutaArchivo,
        url: `/uploads/imagenes/${path.basename(rutaArchivo)}`,
        tamanio: stats.size,
        tipo: "image",
        extension,
        fechaSubida: new Date(),
      };

      const resultado: ImagenOptimizada = { original };

      // Crear thumbnail
      try {
        const thumbnailBuffer = await this.crearThumbnail(rutaArchivo);
        const thumbnailNombre = await this.guardarArchivoOptimizado(
          thumbnailBuffer,
          nombreOriginal,
          directorio,
          "_thumb.jpg"
        );

        resultado.thumbnail = {
          id: `${id}_thumb`,
          nombreOriginal: `${nombreOriginal}_thumb`,
          nombreArchivo: thumbnailNombre,
          ruta: path.join(directorio, thumbnailNombre),
          url: `/uploads/imagenes/${thumbnailNombre}`,
          tamanio: thumbnailBuffer.length,
          tipo: "image",
          extension: ".jpg",
          fechaSubida: new Date(),
        };
      } catch (error) {
        logger.warn("No se pudo crear thumbnail:", error);
      }

      // Crear versión optimizada
      try {
        const optimizadaBuffer = await this.optimizarImagen(rutaArchivo);
        const optimizadaNombre = await this.guardarArchivoOptimizado(
          optimizadaBuffer,
          nombreOriginal,
          directorio,
          "_opt.jpg"
        );

        resultado.optimizada = {
          id: `${id}_opt`,
          nombreOriginal: `${nombreOriginal}_opt`,
          nombreArchivo: optimizadaNombre,
          ruta: path.join(directorio, optimizadaNombre),
          url: `/uploads/imagenes/${optimizadaNombre}`,
          tamanio: optimizadaBuffer.length,
          tipo: "image",
          extension: ".jpg",
          fechaSubida: new Date(),
        };
      } catch (error) {
        logger.warn("No se pudo optimizar imagen:", error);
      }

      return resultado;
    } catch (error) {
      logger.error("Error al procesar imagen:", error);
      throw new Error("Error al procesar la imagen");
    }
  }

  /**
   * Eliminar archivo del sistema
   */
  async eliminarArchivo(rutaArchivo: string): Promise<boolean> {
    try {
      if (fs.existsSync(rutaArchivo)) {
        await fs.promises.unlink(rutaArchivo);
        logger.info(`Archivo eliminado: ${rutaArchivo}`);
        return true;
      }
      return false;
    } catch (error) {
      logger.error("Error al eliminar archivo:", error);
      return false;
    }
  }

  /**
   * Eliminar archivo y sus variantes (thumbnail, optimizada)
   */
  async eliminarArchivoCompleto(archivo: MetadatosArchivo): Promise<boolean> {
    try {
      const eliminaciones = [];

      // Eliminar archivo original
      eliminaciones.push(this.eliminarArchivo(archivo.ruta));

      // Eliminar thumbnail si existe
      const rutaThumbnail = archivo.ruta.replace(/\.[^/.]+$/, "_thumb.jpg");
      eliminaciones.push(this.eliminarArchivo(rutaThumbnail));

      // Eliminar versión optimizada si existe
      const rutaOptimizada = archivo.ruta.replace(/\.[^/.]+$/, "_opt.jpg");
      eliminaciones.push(this.eliminarArchivo(rutaOptimizada));

      const resultados = await Promise.all(eliminaciones);
      return resultados.some((resultado) => resultado);
    } catch (error) {
      logger.error("Error al eliminar archivo completo:", error);
      return false;
    }
  }

  /**
   * Obtener información del archivo
   */
  async obtenerInformacionArchivo(
    rutaArchivo: string
  ): Promise<MetadatosArchivo | null> {
    try {
      if (!fs.existsSync(rutaArchivo)) {
        return null;
      }

      const stats = await fs.promises.stat(rutaArchivo);
      const nombreArchivo = path.basename(rutaArchivo);
      const extension = path.extname(nombreArchivo);

      return {
        id: uuidv4(),
        nombreOriginal: nombreArchivo,
        nombreArchivo,
        ruta: rutaArchivo,
        url: `/uploads/${path.basename(
          path.dirname(rutaArchivo)
        )}/${nombreArchivo}`,
        tamanio: stats.size,
        tipo: this.obtenerTipoArchivo(extension),
        extension,
        fechaSubida: stats.birthtime,
      };
    } catch (error) {
      logger.error("Error al obtener información del archivo:", error);
      return null;
    }
  }

  /**
   * Obtener tipo de archivo basado en extensión
   */
  private obtenerTipoArchivo(extension: string): string {
    const extensionesImagen = [
      ".jpg",
      ".jpeg",
      ".png",
      ".gif",
      ".webp",
      ".svg",
    ];
    const extensionesDocumento = [
      ".pdf",
      ".doc",
      ".docx",
      ".xls",
      ".xlsx",
      ".txt",
      ".csv",
    ];

    if (extensionesImagen.includes(extension.toLowerCase())) {
      return "image";
    }
    if (extensionesDocumento.includes(extension.toLowerCase())) {
      return "document";
    }
    return "file";
  }

  /**
   * Limpiar archivos temporales
   */
  async limpiarArchivosTemporales(): Promise<number> {
    try {
      const directorioTemp = uploadConfig.directorios.temporales;
      if (!fs.existsSync(directorioTemp)) {
        return 0;
      }

      const archivos = await fs.promises.readdir(directorioTemp);
      let eliminados = 0;

      for (const archivo of archivos) {
        const rutaArchivo = path.join(directorioTemp, archivo);
        const stats = await fs.promises.stat(rutaArchivo);

        // Eliminar archivos más antiguos de 1 hora
        const unaHoraAtras = Date.now() - 60 * 60 * 1000;
        if (stats.mtime.getTime() < unaHoraAtras) {
          await this.eliminarArchivo(rutaArchivo);
          eliminados++;
        }
      }

      logger.info(`Archivos temporales eliminados: ${eliminados}`);
      return eliminados;
    } catch (error) {
      logger.error("Error al limpiar archivos temporales:", error);
      return 0;
    }
  }

  /**
   * Obtener estadísticas de uso de almacenamiento
   */
  async obtenerEstadisticasAlmacenamiento(): Promise<{
    totalArchivos: number;
    tamanioTotal: number;
    porTipo: Record<string, { cantidad: number; tamanio: number }>;
  }> {
    try {
      const directorios = [
        uploadConfig.directorios.imagenes,
        uploadConfig.directorios.documentos,
        uploadConfig.directorios.uploads,
      ];

      let totalArchivos = 0;
      let tamanioTotal = 0;
      const porTipo: Record<string, { cantidad: number; tamanio: number }> = {};

      for (const directorio of directorios) {
        if (!fs.existsSync(directorio)) continue;

        const archivos = await fs.promises.readdir(directorio);

        for (const archivo of archivos) {
          const rutaArchivo = path.join(directorio, archivo);
          const stats = await fs.promises.stat(rutaArchivo);

          if (stats.isFile()) {
            totalArchivos++;
            tamanioTotal += stats.size;

            const extension = path.extname(archivo).toLowerCase();
            const tipo = this.obtenerTipoArchivo(extension);

            if (!porTipo[tipo]) {
              porTipo[tipo] = { cantidad: 0, tamanio: 0 };
            }

            porTipo[tipo].cantidad++;
            porTipo[tipo].tamanio += stats.size;
          }
        }
      }

      return {
        totalArchivos,
        tamanioTotal,
        porTipo,
      };
    } catch (error) {
      logger.error("Error al obtener estadísticas de almacenamiento:", error);
      return {
        totalArchivos: 0,
        tamanioTotal: 0,
        porTipo: {},
      };
    }
  }
}
