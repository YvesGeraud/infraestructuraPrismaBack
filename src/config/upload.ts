import path from "path";
import { fileConfig } from "./env";

/**
 * Configuración del sistema de upload de archivos
 */
export const uploadConfig = {
  // Directorios de almacenamiento
  directorios: {
    uploads: path.join(process.cwd(), "uploads"),
    imagenes: path.join(process.cwd(), "uploads", "imagenes"),
    documentos: path.join(process.cwd(), "uploads", "documentos"),
    temporales: path.join(process.cwd(), "uploads", "temp"),
  },

  // Tipos de archivo permitidos
  tiposPermitidos: {
    imagenes: [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
    ],
    documentos: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/plain",
      "text/csv",
    ],
    todos: [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/plain",
      "text/csv",
    ],
  },

  // Límites de tamaño (en bytes)
  limites: {
    imagen: 5 * 1024 * 1024, // 5MB
    documento: 10 * 1024 * 1024, // 10MB
    archivo: 20 * 1024 * 1024, // 20MB
  },

  // Configuración de imágenes
  imagenes: {
    formatos: ["jpeg", "jpg", "png", "webp"],
    calidad: 80,
    maxWidth: 1920,
    maxHeight: 1080,
    thumbnail: {
      width: 300,
      height: 300,
      calidad: 70,
    },
  },

  // Configuración de seguridad
  seguridad: {
    maxArchivos: 10, // Máximo archivos por request
    nombresAleatorios: true, // Generar nombres únicos
    validarExtension: true, // Validar extensión real del archivo
    escanearVirus: false, // Escaneo de virus (requiere librería adicional)
  },

  // Configuración de almacenamiento
  almacenamiento: {
    local: true, // Almacenamiento local
    nube: false, // Almacenamiento en la nube (AWS S3, etc.)
    backup: false, // Backup automático
  },
};

/**
 * Obtener configuración de límites según tipo de archivo
 */
export const obtenerLimiteArchivo = (tipo: string): number => {
  if (uploadConfig.tiposPermitidos.imagenes.includes(tipo)) {
    return uploadConfig.limites.imagen;
  }
  if (uploadConfig.tiposPermitidos.documentos.includes(tipo)) {
    return uploadConfig.limites.documento;
  }
  return uploadConfig.limites.archivo;
};

/**
 * Validar si un tipo de archivo está permitido
 */
export const esTipoPermitido = (tipo: string): boolean => {
  return uploadConfig.tiposPermitidos.todos.includes(tipo);
};

/**
 * Obtener directorio según tipo de archivo
 */
export const obtenerDirectorio = (tipo: string): string => {
  if (uploadConfig.tiposPermitidos.imagenes.includes(tipo)) {
    return uploadConfig.directorios.imagenes;
  }
  if (uploadConfig.tiposPermitidos.documentos.includes(tipo)) {
    return uploadConfig.directorios.documentos;
  }
  return uploadConfig.directorios.uploads;
};

/**
 * Generar nombre único para archivo
 */
export const generarNombreArchivo = (nombreOriginal: string): string => {
  const timestamp = Date.now();
  const extension = path.extname(nombreOriginal);
  const nombreBase = path.basename(nombreOriginal, extension);
  const nombreLimpio = nombreBase.replace(/[^a-zA-Z0-9]/g, "_");

  return `${nombreLimpio}_${timestamp}${extension}`;
};
