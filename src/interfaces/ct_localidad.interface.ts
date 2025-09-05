/**
 * @fileoverview Interfaz específica para el servicio de localidades
 * Define todos los contratos para operaciones con localidades
 * Basado en la estructura real de la base de datos
 */

import { Request, Response } from "express";

// ==========================================
// INTERFACES DE DATOS
// ==========================================

/**
 * Interfaz para el modelo de localidad (basada en campos reales de BD)
 */
export interface Localidad {
  id: number;
  nombre: string;
  ambito: string;
  idMunicipio: number;
  fechaCreacion?: Date;
  fechaActualizacion?: Date;
  // Información relacionada opcional
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
  codigosPostales?: Array<{
    id: number;
    codigoPostal: string;
    asentamiento?: string;
  }>;
}

/**
 * Datos para crear una localidad
 */
export interface DatosCrearLocalidad {
  nombre: string;
  ambito: string;
  idMunicipio: number;
}

/**
 * Datos para actualizar una localidad
 */
export interface DatosActualizarLocalidad extends Partial<DatosCrearLocalidad> {}

/**
 * Filtros para consulta de localidades
 */
export interface FiltrosLocalidad {
  buscar?: string;
  ambito?: string;
  idMunicipio?: number;
  incluirMunicipio?: boolean;
  incluirCodigosPostales?: boolean;
  pagina?: number;
  limite?: number;
}

// ==========================================
// INTERFACES DE SERVICIO
// ==========================================

/**
 * Interfaz del servicio de localidades
 */
export interface IServicioLocalidad {
  // Operaciones básicas CRUD
  obtenerTodos(filtros?: FiltrosLocalidad): Promise<Localidad[]>;
  obtenerPorId(id: number): Promise<Localidad | null>;
  crear(datos: DatosCrearLocalidad): Promise<Localidad>;
  actualizar(id: number, datos: DatosActualizarLocalidad): Promise<Localidad>;
  eliminar(id: number): Promise<boolean>;

  // Operaciones específicas
  buscarPorNombre(nombre: string): Promise<Localidad[]>;
  obtenerPorMunicipio(idMunicipio: number): Promise<Localidad[]>;
  obtenerUrbanas(): Promise<Localidad[]>;
  obtenerRurales(): Promise<Localidad[]>;

  // Métodos legacy para compatibilidad
  obtenerLocalidades(filtros?: any): Promise<any[]>;
  obtenerLocalidadCompleta(id: number): Promise<any>;
}

// ==========================================
// INTERFACES DE CONTROLADOR
// ==========================================

/**
 * Interfaz del controlador de localidades
 */
export interface IControladorLocalidad {
  obtenerTodos(req: Request, res: Response): Promise<void>;
  obtenerPorId(req: Request, res: Response): Promise<void>;
  crear(req: Request, res: Response): Promise<void>;
  actualizar(req: Request, res: Response): Promise<void>;
  eliminar(req: Request, res: Response): Promise<void>;
}
