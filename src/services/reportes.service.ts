import {
  DatosReporte,
  ConfiguracionPDF,
  ResultadoReporte,
} from "../types/reports";
import * as fs from "fs-extra";

/**
 * Interfaz para configuración de reporte
 */
export interface ConfiguracionReporte {
  titulo: string;
  descripcion?: string;
  columnas: ColumnaReporte[];
  formato?: ConfiguracionPDF;
  filtros?: Record<string, any>;
  metadatos?: Record<string, any>;
}

/**
 * Interfaz para definir columnas del reporte
 */
export interface ColumnaReporte {
  campo: string;
  titulo: string;
  tipo?: "texto" | "numero" | "fecha" | "booleano";
  formato?: (valor: any) => string;
  ancho?: string;
}

/**
 * Servicio genérico para generación de reportes PDF
 * Reutilizable para cualquier tipo de datos
 */
export class ReportesService {
  private pdfService: any;

  constructor() {
    const { PDFService } = require("./pdfService");
    this.pdfService = new PDFService();
  }

  /**
   * Genera un reporte PDF a partir de datos y configuración
   */
  async generarReportePDF(
    datos: any[],
    configuracion: ConfiguracionReporte
  ): Promise<Buffer> {
    try {
      // Preparar datos en formato DatosReporte
      const datosReporte: DatosReporte = {
        titulo: configuracion.titulo,
        descripcion: configuracion.descripcion || "",
        fechaGeneracion: new Date(),
        usuarioGenerador: "Sistema",
        datos: this.formatearDatos(datos, configuracion.columnas),
        totales: {
          totalRegistros: datos.length,
        },
        metadatos: {
          filtros: configuracion.filtros,
          ...configuracion.metadatos,
        },
      };

      // Configuración PDF por defecto
      const configuracionPDF: ConfiguracionPDF = {
        formato: "A4",
        orientacion: "landscape",
        margenes: {
          superior: 20,
          inferior: 20,
          izquierdo: 15,
          derecho: 15,
        },
        encabezado: { mostrar: false },
        piePagina: { mostrar: false },
        estilos: {
          titulo: {
            fuente: {
              familia: "Arial",
              tamanio: 16,
              negrita: true,
              color: "#000000",
            },
          },
          subtitulo: {
            fuente: {
              familia: "Arial",
              tamanio: 14,
              negrita: false,
              color: "#333333",
            },
          },
          texto: {
            fuente: {
              familia: "Arial",
              tamanio: 12,
              negrita: false,
              color: "#000000",
            },
          },
          tabla: {
            encabezado: {
              fuente: {
                familia: "Arial",
                tamanio: 12,
                negrita: true,
                color: "#FFFFFF",
              },
              relleno: { tipo: "solid", color: "#4A90E2" },
            },
            filas: {
              fuente: {
                familia: "Arial",
                tamanio: 11,
                negrita: false,
                color: "#000000",
              },
              alternado: true,
              colorAlternado: "#F8F9FA",
            },
            bordes: { color: "#DDDDDD", grosor: 1 },
          },
        },
        ...configuracion.formato,
      };

      // Generar PDF usando el servicio existente
      const resultado = await this.pdfService.generarPDFConPuppeteer(
        datosReporte,
        configuracionPDF
      );

      if (!resultado.exito) {
        throw new Error(`Error generando PDF: ${resultado.mensaje}`);
      }

      // Leer el archivo generado y devolverlo como Buffer
      const buffer = await fs.readFile(resultado.archivo.ruta);

      // Opcionalmente limpiar el archivo temporal
      // await fs.remove(resultado.archivo.ruta);

      return buffer;
    } catch (error) {
      throw new Error(
        `Error en ReportesService: ${
          error instanceof Error ? error.message : "Error desconocido"
        }`
      );
    }
  }

  /**
   * Formatea los datos según las columnas definidas
   */
  private formatearDatos(datos: any[], columnas: ColumnaReporte[]): any[] {
    return datos.map((registro) => {
      const registroFormateado: any = {};

      columnas.forEach((columna) => {
        let valor = this.obtenerValorAnidado(registro, columna.campo);

        // Aplicar formato personalizado si existe
        if (columna.formato && typeof columna.formato === "function") {
          valor = columna.formato(valor);
        } else {
          // Formato por defecto según tipo
          valor = this.formatearPorTipo(valor, columna.tipo);
        }

        registroFormateado[columna.titulo] = valor;
      });

      return registroFormateado;
    });
  }

  /**
   * Obtiene un valor anidado usando dot notation (ej: "marca.descripcion")
   */
  private obtenerValorAnidado(objeto: any, ruta: string): any {
    return ruta.split(".").reduce((obj, prop) => {
      return obj && obj[prop] !== undefined ? obj[prop] : null;
    }, objeto);
  }

  /**
   * Formatea un valor según su tipo
   */
  private formatearPorTipo(valor: any, tipo?: string): string {
    if (valor === null || valor === undefined) {
      return "N/A";
    }

    switch (tipo) {
      case "fecha":
        return valor instanceof Date
          ? valor.toLocaleDateString("es-ES")
          : new Date(valor).toLocaleDateString("es-ES");

      case "numero":
        return typeof valor === "number"
          ? valor.toLocaleString("es-ES")
          : valor.toString();

      case "booleano":
        return valor ? "Sí" : "No";

      case "texto":
      default:
        return valor.toString();
    }
  }

  /**
   * Genera reporte de artículos por jerarquía (ejemplo específico)
   */
  async generarReporteArticulosPorJerarquia(
    articulosData: any[],
    idJerarquia: number
  ): Promise<Buffer> {
    const configuracion: ConfiguracionReporte = {
      titulo: `Reporte de Artículos - Jerarquía ${idJerarquia}`,
      descripcion: `Inventario de artículos correspondientes a la jerarquía ${idJerarquia}`,
      columnas: [
        { campo: "id_articulo", titulo: "ID", tipo: "numero" },
        { campo: "folio", titulo: "Folio", tipo: "texto" },
        { campo: "folio_nuevo", titulo: "Folio Nuevo", tipo: "texto" },
        { campo: "no_serie", titulo: "No. Serie", tipo: "texto" },
        { campo: "modelo", titulo: "Modelo", tipo: "texto" },
        {
          campo: "ct_inventario_marca.descripcion",
          titulo: "Marca",
          tipo: "texto",
          formato: (valor) => valor || "Sin marca",
        },
        {
          campo: "ct_inventario_color.descripcion",
          titulo: "Color",
          tipo: "texto",
          formato: (valor) => valor || "Sin color",
        },
        {
          campo: "ct_inventario_material.descripcion",
          titulo: "Material",
          tipo: "texto",
          formato: (valor) => valor || "Sin material",
        },
        {
          campo: "ct_inventario_subclase.descripcion",
          titulo: "Subclase",
          tipo: "texto",
          formato: (valor) => valor || "Sin subclase",
        },
        {
          campo: "estatus",
          titulo: "Estatus",
          tipo: "texto",
          formato: (valor) => this.obtenerTextoEstatus(valor),
        },
        {
          campo: "ct_inventario_estado_fisico.descripcion",
          titulo: "Estado Físico",
          tipo: "texto",
          formato: (valor) => valor || "Sin estado",
        },
        { campo: "fecha_alta", titulo: "Fecha Alta", tipo: "fecha" },
        { campo: "observaciones", titulo: "Observaciones", tipo: "texto" },
      ],
      metadatos: {
        idJerarquia,
        jerarquiaInfo: articulosData[0]?.rl_infraestructura_jerarquia || null,
      },
    };

    return this.generarReportePDF(articulosData, configuracion);
  }

  /**
   * Helper para convertir códigos de estatus a texto
   */
  private obtenerTextoEstatus(estatus: number | null | undefined): string {
    if (estatus === null || estatus === undefined) return "Sin estatus";

    switch (estatus) {
      case 0:
        return "Inactivo";
      case 1:
        return "Activo";
      case 2:
        return "En mantenimiento";
      case 3:
        return "Dado de baja";
      case 4:
        return "En proceso";
      default:
        return `Estatus ${estatus}`;
    }
  }
}
