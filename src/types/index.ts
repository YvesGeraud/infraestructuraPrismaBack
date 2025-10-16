// ===== TIPOS COMUNES Y COMPARTIDOS =====

// Importar tipos de paginación desde schemas comunes
export type { PaginationInput } from "../schemas/commonSchemas";

// Mantener PaginationParams para compatibilidad hacia atrás (deprecated)
/** @deprecated Usar PaginationInput en su lugar */
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    pagina: number;
    limite: number;
    total: number;
    totalPaginas: number;
    tieneSiguiente: boolean;
    tieneAnterior: boolean;
  };
}

// ===== TIPOS PARA AUTENTICACIÓN JWT (ACTUALIZADOS CON SESIONES) =====

/**
 * 🔐 Información del usuario autenticado que se agrega a req.user
 * Este es el tipo que retorna el middleware verificarAutenticacion
 */
export interface UsuarioAutenticado {
  id_ct_usuario: number;
  uuid_usuario: string;
  usuario: string;
  email: string | null;
  estado: boolean;
  jti: string;
  id_sesion: string; // String porque viene del JWT, se convierte a number cuando se necesita
  ip_origen: string | null;
  fecha_expiracion: Date;
}

/**
 * @deprecated - Usar UsuarioAutenticado en su lugar
 * Mantener solo para compatibilidad hacia atrás
 */
export interface PayloadJwt {
  id: number;
  email: string;
  role: "USER" | "ADMIN";
  iat?: number;
  exp?: number;
}

export interface RespuestaLogin {
  success: boolean;
  message: string;
  data: {
    token: string;
    usuario: {
      id: number;
      email: string;
      firstName: string;
      lastName: string;
      role: "USER" | "ADMIN";
      isActive: boolean;
      emailVerified: boolean;
    };
    expiresIn: string;
  };
}

export interface RespuestaRefresh {
  success: boolean;
  message: string;
  data: {
    token: string;
    expiresIn: string;
  };
}

export interface RespuestaLogout {
  success: boolean;
  message: string;
}

// ===== TIPOS PARA ARCHIVOS =====
export interface ArchivoInfo {
  url?: string;
  tamanioMB?: string;
}

// ===== EXTENSIONES DE EXPRESS =====
declare global {
  namespace Express {
    interface Request {
      /**
       * 🔐 Usuario autenticado (NUEVO SISTEMA CON JWT + SESIONES)
       * Se llena automáticamente por el middleware verificarAutenticacion
       */
      user?: UsuarioAutenticado;

      /**
       * @deprecated - Usar req.user en su lugar
       * Mantener solo para compatibilidad temporal hacia atrás
       */
      usuario?: PayloadJwt;

      archivo?: Express.Multer.File & ArchivoInfo;
      archivos?: (Express.Multer.File & ArchivoInfo)[];
    }
  }
}
