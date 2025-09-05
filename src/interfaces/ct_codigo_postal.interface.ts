/**
 * @fileoverview Interfaz específica para el servicio de códigos postales
 * Define todos los contratos para operaciones con códigos postales
 * Basado en la estructura real de la base de datos
 */

import { Request, Response } from "express";

// ==========================================
// INTERFACES DE DATOS
// ==========================================

/**
 * Interfaz para el modelo de código postal (basada en campos reales de BD)
 */
export interface CodigoPostal {
  id: number;
  codigoPostal: string;
  asentamiento?: string;
  idLocalidad?: number;
  fechaCreacion?: Date;
  fechaActualizacion?: Date;
  // Información relacionada opcional
  localidad?: {
    id: number;
    nombre: string;
    ambito?: string;
    municipio?: {
      id: number;
      nombre: string;
      cveMun: string;
      entidad?: {
        id: number;
        nombre: string;
        abreviatura?: string;
      };
    };
  };
}

/**
 * Datos para crear un código postal
 */
export interface DatosCrearCodigoPostal {
  codigoPostal: string;
  asentamiento?: string;
  idLocalidad?: number;
}

/**
 * Datos para actualizar un código postal
 */
export interface DatosActualizarCodigoPostal extends Partial<DatosCrearCodigoPostal> {}

/**
 * Filtros para consulta de códigos postales
 */
export interface FiltrosCodigoPostal {
  buscar?: string;
  codigoPostal?: string;
  asentamiento?: string;
  idLocalidad?: number;
  pagina?: number;
  limite?: number;
}

// ==========================================
// INTERFACES DE SERVICIO
// ==========================================

/**
 * Interfaz del servicio de códigos postales
 */
export interface IServicioCodigoPostal {
  // Operaciones básicas CRUD
  obtenerTodos(filtros?: FiltrosCodigoPostal): Promise<CodigoPostal[]>;
  obtenerPorId(id: number): Promise<CodigoPostal | null>;
  crear(datos: DatosCrearCodigoPostal): Promise<CodigoPostal>;
  actualizar(id: number, datos: DatosActualizarCodigoPostal): Promise<CodigoPostal>;
  eliminar(id: number): Promise<boolean>;

  // Operaciones específicas
  buscarPorCodigo(codigoPostal: string): Promise<CodigoPostal[]>;
  obtenerInformacionGeograficaCompleta(codigoPostal: string): Promise<CodigoPostal[]>;

  // Métodos legacy para compatibilidad
  obtenerCodigosPostales(): Promise<CodigoPostal[]>;
  buscarPorNombre(codigoPostal: string): Promise<CodigoPostal[]>;
}

// ==========================================
// INTERFACES DE CONTROLADOR
// ==========================================

/**
 * Interfaz del controlador de códigos postales
 */
export interface IControladorCodigoPostal {
  obtenerTodos(req: Request, res: Response): Promise<void>;
  obtenerPorId(req: Request, res: Response): Promise<void>;
  crear(req: Request, res: Response): Promise<void>;
  actualizar(req: Request, res: Response): Promise<void>;
  eliminar(req: Request, res: Response): Promise<void>;
  obtenerInformacionGeografica(req: Request, res: Response): Promise<void>;
}
