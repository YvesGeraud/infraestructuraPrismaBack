/**
 * Interfaces para el reporte de inventario
 */

export interface DatosReporteInventario {
  // Datos del encabezado
  direccion: string;
  departamento: string;
  subjefatura: string;
  nombre: string;
  cct: string;
  fecha: string;

  // Datos de la tabla
  articulos: ArticuloReporte[];

  // Totales
  totalArticulos: number;
}

export interface ArticuloReporte {
  contador: number;
  folio: string;
  tipoArticulo: string;
  marca: string;
  modelo: string;
  serie: string;
  observaciones: string;
  material: string;
}

export interface FiltrosReporteInventario {
  id_rl_infraestructura_jerarquia?: number;
  cct?: string;
  incluirInactivos?: boolean;
}

export interface RespuestaReporteInventario {
  exito: boolean;
  mensaje: string;
  datos: DatosReporteInventario;
  meta: {
    codigoEstado: number;
    fechaHora: string;
  };
}
