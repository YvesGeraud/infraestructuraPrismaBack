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
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// ===== TIPOS PARA AUTENTICACIÓN JWT =====
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

// ===== EXPORTACIONES DE TIPOS ESPECÍFICOS =====
export * from "./order";

// ===== EXTENSIONES DE EXPRESS =====
declare global {
  namespace Express {
    interface Request {
      usuario?: PayloadJwt;
      archivo?: Express.Multer.File & ArchivoInfo;
      archivos?: (Express.Multer.File & ArchivoInfo)[];
    }
  }
}
