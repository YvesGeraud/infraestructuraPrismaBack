/**
 * @fileoverview Servicio de reportes de localidades usando BaseReportService
 * ¡Prueba de que solo necesitas ~30 líneas para un servicio de reportes completo!
 */

import { BaseReportService } from "../BaseReportService";
import { ReportesService, ColumnaReporte } from "../reportes.service";
import { BuscarCtLocalidadInput } from "../../schemas/ct_localidad.schema";

//TODO ===== SERVICIO PARA REPORTES DE LOCALIDADES CON BASE REPORT SERVICE =====

export class LocalidadesReportService extends BaseReportService<BuscarCtLocalidadInput> {
  private reportesService: ReportesService;

  constructor() {
    super();
    this.reportesService = new ReportesService();
  }

  // 🔧 Configuración específica del reporte (4 líneas)
  protected config = {
    tipoReporte: "localidades",
    tituloBase: "Reporte de Localidades",
    descripcionBase: "Listado de localidades",
  };

  // 📊 Configurar columnas dinámicamente según filtros
  protected configurarColumnas(
    filters?: BuscarCtLocalidadInput
  ): ColumnaReporte[] {
    // Determinar qué includes se están usando
    const tieneMunicipio = filters?.incluir_municipio;
    const tieneMunicipioConEntidad = filters?.incluir_municipio_con_entidad;
    const tieneAlgunInclude = tieneMunicipio || tieneMunicipioConEntidad;

    // Columnas base
    const columnas: ColumnaReporte[] = [
      {
        campo: "id_ct_localidad",
        titulo: "ID",
        tipo: "numero" as const,
        ancho: tieneAlgunInclude ? "10%" : "15%",
      },
      {
        campo: "nombre",
        titulo: "Localidad",
        tipo: "texto" as const,
        ancho: tieneAlgunInclude
          ? tieneMunicipioConEntidad
            ? "25%"
            : "35%"
          : "60%",
      },
      {
        campo: "ambito",
        titulo: "Ámbito",
        tipo: "texto" as const,
        ancho: tieneAlgunInclude
          ? tieneMunicipioConEntidad
            ? "12%"
            : "20%"
          : "25%",
        formato: (valor: any) => this.formatearAmbito(valor),
      },
    ];

    // Agregar columna de municipio si se incluye
    if (tieneMunicipio || tieneMunicipioConEntidad) {
      columnas.push({
        campo: "ct_municipio.nombre",
        titulo: "Municipio",
        tipo: "texto" as const,
        ancho: tieneMunicipioConEntidad ? "28%" : "35%",
        formato: (valor: any) => valor || "Sin municipio",
      });
    }

    // Agregar columna de estado solo si se incluye con entidad
    if (tieneMunicipioConEntidad) {
      columnas.push({
        campo: "ct_municipio.ct_entidad.nombre",
        titulo: "Estado",
        tipo: "texto" as const,
        ancho: "25%",
        formato: (valor: any) => valor || "Sin estado",
      });
    }

    return columnas;
  }

  // 🎯 Generar título dinámico
  protected generarTitulo(filters?: BuscarCtLocalidadInput): string {
    return this.config.tituloBase;
  }

  // 📝 Generar descripción dinámica
  protected generarDescripcion(filters?: BuscarCtLocalidadInput): string {
    const tieneMunicipio = filters?.incluir_municipio;
    const tieneMunicipioConEntidad = filters?.incluir_municipio_con_entidad;

    if (tieneMunicipioConEntidad) {
      return "Listado de localidades con información de municipios y estados";
    }
    if (tieneMunicipio) {
      return "Listado de localidades con información de municipios";
    }
    return this.config.descripcionBase;
  }

  // 🎨 Generar metadatos específicos
  protected generarMetadatos(
    filters?: BuscarCtLocalidadInput,
    datos?: any[]
  ): Record<string, any> {
    const metadatosBase = super.generarMetadatos(filters, datos);

    const tieneMunicipio = filters?.incluir_municipio;
    const tieneMunicipioConEntidad = filters?.incluir_municipio_con_entidad;
    const tieneAlgunInclude = tieneMunicipio || tieneMunicipioConEntidad;

    return {
      ...metadatosBase,
      incluye_relaciones: tieneAlgunInclude,
      tipo_include: tieneMunicipioConEntidad
        ? "municipio_con_entidad"
        : tieneMunicipio
        ? "solo_municipio"
        : "sin_includes",
    };
  }

  // 🚀 Método principal para generar reporte (HÍBRIDO)
  async generarReporte(
    datos: any[],
    filters?: BuscarCtLocalidadInput
  ): Promise<Buffer> {
    const configuracion = this.generarConfiguracion(filters, datos);

    // 🎯 Sistema híbrido: usar streaming para datasets grandes
    return this.reportesService.generarReportePDFHibrido(
      datos.length,
      () => datos, // Ya tenemos los datos
      configuracion
    );
  }

  // 🛠️ Helper para formatear ámbito
  private formatearAmbito(ambito: string | null | undefined): string {
    if (!ambito) return "Sin especificar";

    switch (ambito.toUpperCase()) {
      case "U":
        return "Urbano";
      case "R":
        return "Rural";
      default:
        return ambito;
    }
  }

  // 🎯 Método específico para reportes por municipio
  async generarReportePorMunicipio(
    datos: any[],
    municipioInfo?: any
  ): Promise<Buffer> {
    const configuracion = {
      titulo: `Localidades - ${
        municipioInfo?.nombre || "Municipio Seleccionado"
      }`,
      descripcion: `Estado: ${
        municipioInfo?.ct_entidad?.nombre || "Sin estado"
      } | Total: ${datos.length} localidades`,
      columnas: [
        {
          campo: "id_ct_localidad",
          titulo: "ID",
          tipo: "numero" as const,
          ancho: "15%",
        },
        {
          campo: "nombre",
          titulo: "Localidad",
          tipo: "texto" as const,
          ancho: "60%",
        },
        {
          campo: "ambito",
          titulo: "Ámbito",
          tipo: "texto" as const,
          ancho: "25%",
          formato: (valor: any) => this.formatearAmbito(valor),
        },
      ],
      metadatos: {
        tipoReporte: "localidades_municipio",
        municipio: municipioInfo?.nombre || "Sin información",
        estado: municipioInfo?.ct_entidad?.nombre || "Sin información",
        claveMunicipio: municipioInfo?.cve_mun || "N/A",
        totalRegistros: datos.length,
        fechaGeneracion: new Date().toISOString(),
        generadoPor: "Sistema de Reportes",
      },
    };

    return this.reportesService.generarReportePDF(datos, configuracion);
  }
}
