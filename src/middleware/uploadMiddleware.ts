import multer, { FileFilterCallback, MulterError } from "multer";
import path from "path";
import fs from "fs";
import { Request, Response, NextFunction } from "express";
import {
  uploadConfig,
  esTipoPermitido,
  obtenerDirectorio,
  generarNombreArchivo,
} from "../config/upload";
import { enviarRespuestaError } from "../utils/responseUtils";
import logger from "../config/logger";

/**
 * Crear directorios si no existen
 */
const crearDirectorios = () => {
  Object.values(uploadConfig.directorios).forEach((directorio) => {
    if (!fs.existsSync(directorio)) {
      fs.mkdirSync(directorio, { recursive: true });
      logger.info(`Directorio creado: ${directorio}`);
    }
  });
};

// Crear directorios al importar el módulo
crearDirectorios();

/**
 * Filtro de archivos para validar tipo y seguridad
 */
const filtroArchivos = (
  req: Request,
  file: Express.Multer.File,
  callback: FileFilterCallback
) => {
  try {
    // Validar tipo de archivo
    if (!esTipoPermitido(file.mimetype)) {
      logger.warn(
        `Tipo de archivo no permitido: ${file.mimetype} - ${file.originalname}`
      );
      return callback(
        new Error(`Tipo de archivo no permitido: ${file.mimetype}`)
      );
    }

    // Validar extensión del archivo
    const extension = path.extname(file.originalname).toLowerCase();
    const extensionesPermitidas = [
      ".jpg",
      ".jpeg",
      ".png",
      ".gif",
      ".webp",
      ".svg",
      ".pdf",
      ".doc",
      ".docx",
      ".xls",
      ".xlsx",
      ".txt",
      ".csv",
    ];

    if (!extensionesPermitidas.includes(extension)) {
      logger.warn(
        `Extensión no permitida: ${extension} - ${file.originalname}`
      );
      return callback(new Error(`Extensión no permitida: ${extension}`));
    }

    // Validar nombre del archivo (evitar caracteres especiales)
    const nombreValido = /^[a-zA-Z0-9._-]+$/.test(
      path.basename(file.originalname, extension)
    );
    if (!nombreValido) {
      logger.warn(`Nombre de archivo inválido: ${file.originalname}`);
      return callback(
        new Error("Nombre de archivo contiene caracteres no permitidos")
      );
    }

    logger.info(`Archivo validado: ${file.originalname} (${file.mimetype})`);
    callback(null, true);
  } catch (error) {
    logger.error("Error en filtro de archivos:", error);
    callback(error as Error);
  }
};

/**
 * Configuración de almacenamiento
 */
const almacenamiento = multer.diskStorage({
  destination: (req, file, callback) => {
    const directorio = obtenerDirectorio(file.mimetype);
    callback(null, directorio);
  },
  filename: (req, file, callback) => {
    const nombreArchivo = uploadConfig.seguridad.nombresAleatorios
      ? generarNombreArchivo(file.originalname)
      : file.originalname;

    callback(null, nombreArchivo);
  },
});

/**
 * Configuración de límites
 */
const limites = {
  fileSize: uploadConfig.limites.archivo,
  files: uploadConfig.seguridad.maxArchivos,
  fieldSize: 1024 * 1024, // 1MB para campos de texto
};

/**
 * Middleware de upload para un solo archivo
 */
export const uploadArchivo = multer({
  storage: almacenamiento,
  fileFilter: filtroArchivos,
  limits: {
    ...limites,
    files: 1,
  },
}).single("archivo");

/**
 * Middleware de upload para múltiples archivos
 */
export const uploadMultiples = multer({
  storage: almacenamiento,
  fileFilter: filtroArchivos,
  limits: limites,
}).array("archivos", uploadConfig.seguridad.maxArchivos);

/**
 * Middleware de upload para campos específicos
 */
export const uploadCampos = multer({
  storage: almacenamiento,
  fileFilter: filtroArchivos,
  limits: limites,
}).fields([
  { name: "imagen", maxCount: 1 },
  { name: "documento", maxCount: 1 },
  { name: "archivos", maxCount: uploadConfig.seguridad.maxArchivos },
]);

/**
 * Wrapper para manejar errores de Multer
 */
export const manejarUpload = (uploadMiddleware: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    uploadMiddleware(req, res, (error: any) => {
      if (error instanceof MulterError) {
        logger.error(`Error de Multer: ${error.code}`, {
          field: error.field,
          message: error.message,
        });

        switch (error.code) {
          case "LIMIT_FILE_SIZE":
            return enviarRespuestaError(
              res,
              "El archivo excede el tamaño máximo permitido",
              400
            );
          case "LIMIT_FILE_COUNT":
            return enviarRespuestaError(
              res,
              "Se excedió el número máximo de archivos",
              400
            );
          case "LIMIT_UNEXPECTED_FILE":
            return enviarRespuestaError(
              res,
              "Campo de archivo inesperado",
              400
            );
          default:
            return enviarRespuestaError(
              res,
              `Error en la subida de archivos: ${error.message}`,
              400
            );
        }
      }

      if (error) {
        logger.error("Error en upload:", error);
        return enviarRespuestaError(
          res,
          error.message || "Error en la subida de archivos",
          400
        );
      }

      // Agregar información de archivos al request
      if (req.file) {
        req.archivo = {
          ...req.file,
          url: `/uploads/${path.basename(req.file.destination)}/${
            req.file.filename
          }`,
          tamanioMB: (req.file.size / (1024 * 1024)).toFixed(2),
        };
      }

      if (req.files) {
        if (Array.isArray(req.files)) {
          req.archivos = req.files.map((file) => ({
            ...file,
            url: `/uploads/${path.basename(file.destination)}/${file.filename}`,
            tamanioMB: (file.size / (1024 * 1024)).toFixed(2),
          }));
        } else {
          // Si es un objeto con campos múltiples, convertir a array
          const archivosArray: any[] = [];
          Object.values(req.files).forEach((files) => {
            if (Array.isArray(files)) {
              archivosArray.push(...files);
            }
          });
          req.archivos = archivosArray.map((file) => ({
            ...file,
            url: `/uploads/${path.basename(file.destination)}/${file.filename}`,
            tamanioMB: (file.size / (1024 * 1024)).toFixed(2),
          }));
        }
      }

      next();
    });
  };
};

/**
 * Middlewares listos para usar
 */
export const uploadArchivoMiddleware = manejarUpload(uploadArchivo);
export const uploadMultiplesMiddleware = manejarUpload(uploadMultiples);
export const uploadCamposMiddleware = manejarUpload(uploadCampos);

/**
 * Middleware para validar si se subió al menos un archivo
 */
export const validarArchivoSubido = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.file && !req.files) {
    return enviarRespuestaError(res, "No se ha subido ningún archivo", 400);
  }
  next();
};

/**
 * Middleware para limpiar archivos temporales en caso de error
 */
export const limpiarArchivosTemporales = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const limpiarArchivo = (archivo: Express.Multer.File) => {
    try {
      if (fs.existsSync(archivo.path)) {
        fs.unlinkSync(archivo.path);
        logger.info(`Archivo temporal eliminado: ${archivo.path}`);
      }
    } catch (error) {
      logger.error(
        `Error al eliminar archivo temporal: ${archivo.path}`,
        error
      );
    }
  };

  // Limpiar archivos si hay error en el siguiente middleware
  const originalSend = res.send;
  res.send = function (data) {
    if (res.statusCode >= 400) {
      if (req.file) limpiarArchivo(req.file);
      if (req.files) {
        Array.isArray(req.files)
          ? req.files.forEach(limpiarArchivo)
          : Object.values(req.files).flat().forEach(limpiarArchivo);
      }
    }
    return originalSend.call(this, data);
  };

  next();
};
