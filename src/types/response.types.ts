/**
 * @fileoverview Tipos de respuesta estandarizados para todos los endpoints
 * Proporciona una estructura consistente para todas las respuestas de la API
 */

/**
 * Interfaz base para todas las respuestas de la API
 * @template T - Tipo de datos que se devuelve en caso de éxito
 */
export interface RespuestaApi<T = any> {
    /** Indica si la operación fue exitosa */
    exito: boolean;
    /** Mensaje descriptivo sobre el resultado de la operación */
    mensaje: string;
    /** Datos devueltos en caso de éxito */
    datos?: T;
    /** Información de error en caso de fallo */
    error?: InformacionError;
    /** Información adicional opcional */
    meta?: {
      /** Código de estado HTTP */
      codigoEstado: number;
      /** Timestamp de la respuesta */
      fechaHora: string;
      /** Información de paginación (si aplica) */
      paginacion?: InformacionPaginacion;
    };
  }
  
  /**
   * Información detallada de errores
   */
  export interface InformacionError {
    /** Código de error interno */
    codigo: string;
    /** Mensaje de error para el usuario */
    mensaje: string;
    /** Detalles técnicos del error (solo en desarrollo) */
    detalles?: any;
    /** Errores de validación específicos */
    validacion?: ErrorValidacion[];
  }
  
  /**
   * Error de validación específico
   */
  export interface ErrorValidacion {
    /** Campo que causó el error */
    campo: string;
    /** Mensaje de error específico del campo */
    mensaje: string;
    /** Valor que causó el error */
    valor?: any;
  }
  
  /**
   * Información de paginación
   */
  export interface InformacionPaginacion {
    /** Página actual */
    paginaActual: number;
    /** Número de elementos por página */
    porPagina: number;
    /** Total de elementos */
    totalElementos: number;
    /** Total de páginas */
    totalPaginas: number;
    /** Indica si hay página siguiente */
    tienePaginaSiguiente: boolean;
    /** Indica si hay página anterior */
    tienePaginaAnterior: boolean;
  }
  
  /**
   * Tipos de códigos de error comunes
   */
  export enum CodigosError {
    // Errores de validación
    ERROR_VALIDACION = "ERROR_VALIDACION",
    CAMPO_REQUERIDO_FALTANTE = "CAMPO_REQUERIDO_FALTANTE",
    FORMATO_INVALIDO = "FORMATO_INVALIDO",
  
    // Errores de autenticación y autorización
    NO_AUTORIZADO = "NO_AUTORIZADO",
    PROHIBIDO = "PROHIBIDO",
    TOKEN_EXPIRADO = "TOKEN_EXPIRADO",
    CREDENCIALES_INVALIDAS = "CREDENCIALES_INVALIDAS",
  
    // Errores de recursos
    RECURSO_NO_ENCONTRADO = "RECURSO_NO_ENCONTRADO",
    RECURSO_YA_EXISTE = "RECURSO_YA_EXISTE",
    CONFLICTO = "CONFLICTO",
  
    // Errores de base de datos
    ERROR_BASE_DATOS = "ERROR_BASE_DATOS",
    ERROR_CONEXION = "ERROR_CONEXION",
  
    // Errores del servidor
    ERROR_INTERNO_SERVIDOR = "ERROR_INTERNO_SERVIDOR",
    SERVICIO_NO_DISPONIBLE = "SERVICIO_NO_DISPONIBLE",
  }
  