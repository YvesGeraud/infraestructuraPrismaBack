// Interfaces para el sistema de reportes

export interface FiltroReporte {
  campo: string;
  valor: string | number | boolean | Date;
  operador: "igual" | "contiene" | "mayor" | "menor" | "entre" | "en";
  valor2?: string | number | Date; // Para operadores como "entre"
}

export interface OrdenamientoReporte {
  campo: string;
  direccion: "asc" | "desc";
}

export interface AgrupacionReporte {
  campo: string;
  funcion: "count" | "sum" | "avg" | "min" | "max";
}

export interface ConfiguracionReporte {
  tipo: string;
  formato: "pdf" | "excel";
  filtros?: FiltroReporte[];
  ordenamiento?: OrdenamientoReporte[];
  agrupacion?: AgrupacionReporte[];
  incluirGraficos?: boolean;
  incluirTotales?: boolean;
  paginacion?: {
    pagina: number;
    elementosPorPagina: number;
  };
}

export interface DatosReporte {
  titulo: string;
  descripcion?: string;
  fechaGeneracion: Date;
  usuarioGenerador: string;
  datos: any[];
  totales?: Record<string, any>;
  graficos?: GraficoReporte[];
  metadatos?: Record<string, any>;
}

export interface GraficoReporte {
  tipo: "bar" | "line" | "pie" | "doughnut";
  titulo: string;
  datos: {
    etiquetas: string[];
    valores: number[];
    colores?: string[];
  };
  opciones?: Record<string, any>;
}

export interface ColumnaReporte {
  campo: string;
  titulo: string;
  ancho?: number;
  formato?:
    | "texto"
    | "numero"
    | "moneda"
    | "fecha"
    | "booleano"
    | "bytes"
    | "porcentaje";
  alineacion?: "left" | "center" | "right";
  visible?: boolean;
  ordenable?: boolean;
  filtrable?: boolean;
}

export interface EstiloReporte {
  fuente: {
    familia: string;
    tamanio: number;
    negrita?: boolean;
    cursiva?: boolean;
    color: string;
  };
  relleno?: {
    tipo: "solid" | "gradient";
    color: string;
    color2?: string;
  };
  borde?: {
    estilo: "solid" | "dashed" | "dotted";
    grosor: number;
    color: string;
  };
  alineacion?: {
    horizontal: "left" | "center" | "right";
    vertical: "top" | "middle" | "bottom";
  };
}

export interface ResultadoReporte {
  exito: boolean;
  mensaje: string;
  archivo?: {
    nombre: string;
    ruta: string;
    tamanio: number;
    tipo: string;
    url?: string;
  };
  datos?: DatosReporte;
  errores?: string[];
  tiempoGeneracion?: number;
}

export interface EstadisticasReporte {
  totalGenerados: number;
  porTipo: Record<string, number>;
  porFormato: Record<string, number>;
  porUsuario: Record<string, number>;
  tamanioPromedio: number;
  tiempoPromedio: number;
  errores: number;
  ultimaGeneracion?: Date;
}

export interface CacheReporte {
  clave: string;
  datos: any;
  fechaCreacion: Date;
  fechaExpiracion: Date;
  tamanio: number;
}

export interface PlantillaReporte {
  nombre: string;
  descripcion: string;
  tipo: string;
  formato: "pdf" | "excel";
  contenido: string;
  variables: string[];
  activa: boolean;
}

// Interfaces específicas para PDF
export interface ConfiguracionPDF {
  formato: "A4" | "A3" | "Letter" | "Legal";
  orientacion: "portrait" | "landscape";
  margenes: {
    superior: number;
    inferior: number;
    izquierdo: number;
    derecho: number;
  };
  encabezado?: {
    mostrar: boolean;
    logo?: string;
    titulo?: string;
    subtitulo?: string;
  };
  piePagina?: {
    mostrar: boolean;
    texto?: string;
    numeracion?: boolean;
  };
  estilos: {
    titulo: EstiloReporte;
    subtitulo: EstiloReporte;
    texto: EstiloReporte;
    tabla: {
      encabezado: EstiloReporte;
      filas: EstiloReporte & {
        alternado?: boolean;
        colorAlternado?: string;
      };
      bordes: {
        color: string;
        grosor: number;
      };
    };
  };
}

// Interfaces específicas para Excel
export interface ConfiguracionExcel {
  formato: "xlsx" | "xls";
  hoja: {
    nombre: string;
    colorFondo?: string;
  };
  estilos: {
    titulo: EstiloReporte;
    subtitulo: EstiloReporte;
    encabezado: EstiloReporte;
    datos: EstiloReporte;
    totales: EstiloReporte;
  };
  columnas: {
    anchoAutomatico?: boolean;
    anchoMinimo?: number;
    anchoMaximo?: number;
  };
  filtros: {
    habilitar?: boolean;
    aplicarAutomaticamente?: boolean;
  };
  graficos: {
    habilitar?: boolean;
    tipos?: string[];
    colores?: string[];
  };
}

// Interfaces para solicitudes de reportes
export interface SolicitudReporte {
  tipo: string;
  formato: "pdf" | "excel";
  filtros?: FiltroReporte[];
  ordenamiento?: OrdenamientoReporte[];
  agrupacion?: AgrupacionReporte[];
  opciones?: {
    incluirGraficos?: boolean;
    incluirTotales?: boolean;
    incluirMetadatos?: boolean;
    comprimir?: boolean;
    password?: string;
  };
  plantilla?: string;
  personalizacion?: {
    titulo?: string;
    descripcion?: string;
    logo?: string;
    colores?: {
      primario?: string;
      secundario?: string;
      acento?: string;
    };
  };
}

// Interfaces para respuestas de reportes
export interface RespuestaReporte {
  exito: boolean;
  mensaje: string;
  datos?: {
    archivo: {
      nombre: string;
      ruta: string;
      tamanio: number;
      tipo: string;
      url: string;
    };
    metadatos: {
      tipo: string;
      formato: string;
      fechaGeneracion: Date;
      usuarioGenerador: string;
      tiempoGeneracion: number;
      elementos: number;
      filtrosAplicados?: number;
      ordenamientoAplicado?: number;
      agrupacionAplicada?: number;
      desdeCache?: boolean;
      configuracion?: any;
    };
  };
  errores?: string[];
}

// Interfaces para gestión de plantillas
export interface PlantillaReporteCompleta {
  id: string;
  nombre: string;
  descripcion: string;
  tipo: string;
  formato: "pdf" | "excel";
  contenido: string;
  variables: string[];
  activa: boolean;
  fechaCreacion: Date;
  fechaModificacion: Date;
  creador: string;
  version: number;
}

// Interfaces para caché
export interface EntradaCache {
  clave: string;
  valor: any;
  fechaCreacion: Date;
  fechaExpiracion: Date;
  tamanio: number;
  hits: number;
  ultimoAcceso: Date;
}

// Interfaces para limpieza automática
export interface TareaLimpieza {
  archivosEliminados: number;
  espacioLiberado: number;
  errores: string[];
  fechaEjecucion: Date;
  duracion: number;
}

// Interfaces para monitoreo
export interface MetricasReporte {
  totalGenerados: number;
  exitosos: number;
  fallidos: number;
  tiempoPromedio: number;
  tamanioPromedio: number;
  tiposMasUsados: Array<{
    tipo: string;
    cantidad: number;
  }>;
  usuariosMasActivos: Array<{
    usuario: string;
    cantidad: number;
  }>;
  erroresComunes: Array<{
    error: string;
    frecuencia: number;
  }>;
}
