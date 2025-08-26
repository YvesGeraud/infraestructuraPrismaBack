import { env } from "./env";

export const reportesConfig = {
  // Configuración general
  directorio: "uploads/reportes",
  formatoFecha: "DD/MM/YYYY HH:mm:ss",
  zonaHoraria: "America/Mexico_City",
  
  // Configuración PDF
  pdf: {
    formato: "A4" as "A4" | "A3" | "Letter" | "Legal",
    orientacion: "portrait" as "portrait" | "landscape",
    margenes: {
      superior: 20,
      inferior: 20,
      izquierdo: 20,
      derecho: 20,
    },
    encabezado: {
      mostrar: true,
      logo: "assets/logo.png",
      titulo: "Cedex System",
      subtitulo: "Reporte Generado",
    },
    piePagina: {
      mostrar: true,
      texto: "Generado el {fecha} por {usuario}",
      numeracion: true,
    },
    estilos: {
      titulo: {
        fuente: {
          familia: "Helvetica",
          tamanio: 18,
          negrita: true,
          color: "#2c3e50",
        },
        alineacion: {
          horizontal: "center" as "left" | "center" | "right",
          vertical: "middle" as "top" | "middle" | "bottom",
        },
      },
      subtitulo: {
        fuente: {
          familia: "Helvetica",
          tamanio: 14,
          negrita: true,
          color: "#34495e",
        },
        alineacion: {
          horizontal: "left" as "left" | "center" | "right",
          vertical: "middle" as "top" | "middle" | "bottom",
        },
      },
      texto: {
        fuente: {
          familia: "Helvetica",
          tamanio: 12,
          negrita: false,
          color: "#2c3e50",
        },
        alineacion: {
          horizontal: "left" as "left" | "center" | "right",
          vertical: "middle" as "top" | "middle" | "bottom",
        },
      },
      tabla: {
        encabezado: {
          fuente: {
            familia: "Helvetica",
            tamanio: 12,
            negrita: true,
            color: "#ffffff",
          },
          relleno: {
            tipo: "solid" as "solid" | "gradient",
            color: "#3498db",
          },
        },
        filas: {
          fuente: {
            familia: "Helvetica",
            tamanio: 11,
            negrita: false,
            color: "#2c3e50",
          },
          alternado: true,
          colorAlternado: "#f8f9fa",
        },
        bordes: {
          color: "#dee2e6",
          grosor: 1,
        },
      },
    },
  },
  
  // Configuración Excel
  excel: {
    formato: "xlsx" as "xlsx" | "xls",
    hoja: {
      nombre: "Reporte",
      colorFondo: "#ffffff",
    },
    estilos: {
      titulo: {
        fuente: {
          familia: "Arial",
          tamanio: 16,
          negrita: true,
          color: "#2c3e50",
        },
        relleno: {
          tipo: "solid" as "solid" | "gradient",
          color: "#ecf0f1",
        },
        alineacion: {
          horizontal: "center" as "left" | "center" | "right",
          vertical: "middle" as "top" | "middle" | "bottom",
        },
        borde: {
          estilo: "solid" as "solid" | "dashed" | "dotted",
          grosor: 2,
          color: "#bdc3c7",
        },
      },
      subtitulo: {
        fuente: {
          familia: "Arial",
          tamanio: 14,
          negrita: true,
          color: "#34495e",
        },
        relleno: {
          tipo: "solid" as "solid" | "gradient",
          color: "#f8f9fa",
        },
        alineacion: {
          horizontal: "left" as "left" | "center" | "right",
          vertical: "middle" as "top" | "middle" | "bottom",
        },
      },
      encabezado: {
        fuente: {
          familia: "Arial",
          tamanio: 12,
          negrita: true,
          color: "#ffffff",
        },
        relleno: {
          tipo: "solid" as "solid" | "gradient",
          color: "#3498db",
        },
        alineacion: {
          horizontal: "center" as "left" | "center" | "right",
          vertical: "middle" as "top" | "middle" | "bottom",
        },
        borde: {
          estilo: "solid" as "solid" | "dashed" | "dotted",
          grosor: 1,
          color: "#2980b9",
        },
      },
      datos: {
        fuente: {
          familia: "Arial",
          tamanio: 11,
          negrita: false,
          color: "#2c3e50",
        },
        alineacion: {
          horizontal: "left" as "left" | "center" | "right",
          vertical: "middle" as "top" | "middle" | "bottom",
        },
        borde: {
          estilo: "solid" as "solid" | "dashed" | "dotted",
          grosor: 1,
          color: "#dee2e6",
        },
      },
      totales: {
        fuente: {
          familia: "Arial",
          tamanio: 12,
          negrita: true,
          color: "#ffffff",
        },
        relleno: {
          tipo: "solid" as "solid" | "gradient",
          color: "#27ae60",
        },
        alineacion: {
          horizontal: "right" as "left" | "center" | "right",
          vertical: "middle" as "top" | "middle" | "bottom",
        },
      },
    },
    columnas: {
      anchoAutomatico: true,
      anchoMinimo: 10,
      anchoMaximo: 50,
    },
    filtros: {
      habilitar: true,
      aplicarAutomaticamente: true,
    },
    graficos: {
      habilitar: true,
      tipos: ["bar", "line", "pie", "doughnut"],
      colores: ["#3498db", "#e74c3c", "#2ecc71", "#f39c12", "#9b59b6"],
    },
  },
  
  // Configuración de plantillas
  plantillas: {
    directorio: "src/templates/reportes",
    extension: ".hbs",
    encoding: "utf-8" as BufferEncoding,
  },
  
  // Configuración de caché
  cache: {
    habilitar: true,
    duracion: 3600, // 1 hora en segundos
    directorio: "cache/reportes",
  },
  
  // Configuración de seguridad
  seguridad: {
    maxArchivos: 100,
    maxTamano: 50 * 1024 * 1024, // 50MB
    tiposPermitidos: ["pdf", "xlsx", "xls"],
    validarContenido: true,
  },
  
  // Configuración de limpieza
  limpieza: {
    habilitar: true,
    intervalo: 24 * 60 * 60 * 1000, // 24 horas en ms
    maxEdad: 7 * 24 * 60 * 60 * 1000, // 7 días en ms
  },
};

// Configuraciones específicas por tipo de reporte
export const tiposReporte = {
  usuarios: {
    nombre: "Reporte de Usuarios",
    descripcion: "Listado completo de usuarios del sistema",
    columnas: [
      { campo: "id", titulo: "ID", ancho: 8 },
      { campo: "email", titulo: "Email", ancho: 25 },
      { campo: "firstName", titulo: "Nombre", ancho: 20 },
      { campo: "lastName", titulo: "Apellido", ancho: 20 },
      { campo: "role", titulo: "Rol", ancho: 15 },
      { campo: "createdAt", titulo: "Fecha Creación", ancho: 20 },
    ],
    filtros: ["role", "fechaCreacion"],
    agrupacion: ["role"],
    ordenamiento: ["lastName", "firstName"],
  },
  
  productos: {
    nombre: "Reporte de Productos",
    descripcion: "Inventario completo de productos",
    columnas: [
      { campo: "id", titulo: "ID", ancho: 8 },
      { campo: "name", titulo: "Nombre", ancho: 30 },
      { campo: "category", titulo: "Categoría", ancho: 20 },
      { campo: "brand", titulo: "Marca", ancho: 15 },
      { campo: "price", titulo: "Precio", ancho: 12, formato: "moneda" },
      { campo: "stock", titulo: "Stock", ancho: 10, formato: "numero" },
      { campo: "featured", titulo: "Destacado", ancho: 12, formato: "booleano" },
    ],
    filtros: ["category", "brand", "featured", "rangoPrecio"],
    agrupacion: ["category", "brand"],
    ordenamiento: ["name"],
  },
  
  archivos: {
    nombre: "Reporte de Archivos",
    descripcion: "Estadísticas de archivos subidos",
    columnas: [
      { campo: "nombre", titulo: "Nombre", ancho: 30 },
      { campo: "tipo", titulo: "Tipo", ancho: 15 },
      { campo: "tamanio", titulo: "Tamaño", ancho: 15, formato: "bytes" },
      { campo: "fechaSubida", titulo: "Fecha Subida", ancho: 20 },
      { campo: "usuario", titulo: "Usuario", ancho: 20 },
    ],
    filtros: ["tipo", "fechaSubida", "usuario"],
    agrupacion: ["tipo", "usuario"],
    ordenamiento: ["fechaSubida"],
  },
  
  emails: {
    nombre: "Reporte de Emails",
    descripcion: "Historial de emails enviados",
    columnas: [
      { campo: "destinatario", titulo: "Destinatario", ancho: 25 },
      { campo: "asunto", titulo: "Asunto", ancho: 40 },
      { campo: "tipo", titulo: "Tipo", ancho: 15 },
      { campo: "estado", titulo: "Estado", ancho: 12 },
      { campo: "fechaEnvio", titulo: "Fecha Envío", ancho: 20 },
    ],
    filtros: ["tipo", "estado", "fechaEnvio"],
    agrupacion: ["tipo", "estado"],
    ordenamiento: ["fechaEnvio"],
  },
  
  sistema: {
    nombre: "Reporte del Sistema",
    descripcion: "Estadísticas generales del sistema",
    secciones: [
      "usuarios",
      "productos", 
      "archivos",
      "emails",
      "rendimiento",
    ],
    graficos: ["usuariosPorRol", "productosPorCategoria", "archivosPorTipo"],
  },
};

// Funciones de utilidad
export const obtenerConfiguracionReporte = (tipo: string) => {
  return tiposReporte[tipo as keyof typeof tiposReporte] || null;
};

export const obtenerEstilosPDF = (tipo: string) => {
  return reportesConfig.pdf.estilos;
};

export const obtenerEstilosExcel = (tipo: string) => {
  return reportesConfig.excel.estilos;
};

export const generarNombreArchivo = (tipo: string, formato: string) => {
  const fecha = new Date().toISOString().split('T')[0];
  const hora = new Date().toISOString().split('T')[1].split('.')[0].replace(/:/g, '-');
  return `reporte_${tipo}_${fecha}_${hora}.${formato}`;
};

export const validarTipoReporte = (tipo: string): boolean => {
  return Object.keys(tiposReporte).includes(tipo);
};

export const obtenerColumnasReporte = (tipo: string) => {
  const config = obtenerConfiguracionReporte(tipo);
  if (config && 'columnas' in config) {
    return config.columnas || [];
  }
  return [];
};

export const obtenerFiltrosReporte = (tipo: string) => {
  const config = obtenerConfiguracionReporte(tipo);
  if (config && 'filtros' in config) {
    return config.filtros || [];
  }
  return [];
};

export const obtenerAgrupacionReporte = (tipo: string) => {
  const config = obtenerConfiguracionReporte(tipo);
  if (config && 'agrupacion' in config) {
    return config.agrupacion || [];
  }
  return [];
};

export const obtenerOrdenamientoReporte = (tipo: string) => {
  const config = obtenerConfiguracionReporte(tipo);
  if (config && 'ordenamiento' in config) {
    return config.ordenamiento || [];
  }
  return [];
};
