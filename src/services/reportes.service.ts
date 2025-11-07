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
 *
 * 🎯 SISTEMA HÍBRIDO:
 * - Reportes pequeños (<5000): Método normal con buffer
 * - Reportes grandes (≥5000): Streaming con PDFKit para eficiencia
 */
export class ReportesService {
  private pdfService: any;

  // 🔧 Configuración de umbrales
  private readonly UMBRAL_STREAMING_PDF = 5000; // Registros para activar streaming PDF
  private readonly UMBRAL_STREAMING_EXCEL = 50000; // Registros para activar streaming Excel
  private readonly TAMAÑO_LOTE_STREAMING = 1000; // Registros por lote en streaming

  constructor() {
    const { PDFService } = require("./pdfService");
    this.pdfService = new PDFService();
  }

  /**
   * 🎯 Método híbrido inteligente para generar reportes
   * Decide automáticamente entre método normal o streaming según el tamaño
   */
  async generarReportePDFHibrido(
    totalRegistros: number,
    obtenerDatos: () => Promise<any[]> | any[],
    configuracion: ConfiguracionReporte
  ): Promise<Buffer> {
    console.log(`📊 Generando reporte: ${totalRegistros} registros`);

    if (totalRegistros >= this.UMBRAL_STREAMING_PDF) {
      console.log(`🚀 Usando STREAMING para ${totalRegistros} registros`);
      return this.generarReportePDFConStreaming(
        obtenerDatos,
        configuracion,
        totalRegistros
      );
    } else {
      console.log(`⚡ Usando método NORMAL para ${totalRegistros} registros`);
      const datos = await obtenerDatos();
      return this.generarReportePDF(datos, configuracion);
    }
  }

  /**
   * Genera un reporte PDF a partir de datos y configuración (método original)
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
   * 🚀 Genera reporte PDF con STREAMING para datasets grandes
   * Procesa datos en lotes para evitar saturar memoria
   */
  async generarReportePDFConStreaming(
    obtenerDatos: () => Promise<any[]> | any[],
    configuracion: ConfiguracionReporte,
    totalRegistros: number
  ): Promise<Buffer> {
    try {
      const PDFDocument = require("pdfkit");
      const chunks: Buffer[] = [];

      // Crear documento PDF
      const doc = new PDFDocument({
        size: "A4",
        layout: "landscape",
        margin: 50,
      });

      // Capturar chunks del stream
      doc.on("data", (chunk: Buffer) => chunks.push(chunk));

      // Promise que se resuelve cuando el PDF esté completo
      const pdfPromise = new Promise<Buffer>((resolve, reject) => {
        doc.on("end", () => resolve(Buffer.concat(chunks)));
        doc.on("error", reject);
      });

      // 📝 ENCABEZADO DEL REPORTE
      doc
        .fontSize(16)
        .font("Helvetica-Bold")
        .text(configuracion.titulo, { align: "center" });

      if (configuracion.descripcion) {
        doc
          .fontSize(12)
          .font("Helvetica")
          .text(configuracion.descripcion, { align: "center" });
      }

      doc
        .text(`Total de registros: ${totalRegistros}`, { align: "center" })
        .text(`Generado: ${new Date().toLocaleString("es-MX")}`, {
          align: "center",
        })
        .moveDown(2);

      // 📊 ENCABEZADOS DE TABLA
      const startX = 50;
      let currentY = doc.y;
      const columnWidths = this.calcularAnchosColumnas(configuracion.columnas);

      doc.fontSize(10).font("Helvetica-Bold");
      let currentX = startX;

      configuracion.columnas.forEach((columna, index) => {
        doc.text(columna.titulo, currentX, currentY, {
          width: columnWidths[index],
          align: "left",
        });
        currentX += columnWidths[index];
      });

      doc.moveDown(1);
      currentY = doc.y;

      // 🔄 PROCESAR DATOS EN STREAMING
      const datos = await obtenerDatos();
      const totalLotes = Math.ceil(datos.length / this.TAMAÑO_LOTE_STREAMING);

      console.log(
        `📊 Procesando ${datos.length} registros en ${totalLotes} lotes`
      );

      doc.fontSize(9).font("Helvetica");

      for (let lote = 0; lote < totalLotes; lote++) {
        const inicio = lote * this.TAMAÑO_LOTE_STREAMING;
        const fin = Math.min(inicio + this.TAMAÑO_LOTE_STREAMING, datos.length);
        const datosLote = datos.slice(inicio, fin);

        console.log(
          `📦 Procesando lote ${lote + 1}/${totalLotes} (${inicio}-${fin})`
        );

        // Procesar cada registro del lote
        for (const registro of datosLote) {
          // Verificar si necesitamos nueva página
          if (currentY > 500) {
            doc.addPage();
            currentY = 50;
          }

          currentX = startX;

          configuracion.columnas.forEach((columna, index) => {
            const valor = this.extraerValorAnidado(registro, columna.campo);
            const textoFormateado = columna.formato
              ? columna.formato(valor)
              : valor?.toString() || "";

            doc.text(textoFormateado, currentX, currentY, {
              width: columnWidths[index],
              align: "left",
              ellipsis: true,
            });
            currentX += columnWidths[index];
          });

          currentY += 15;
        }
      }

      // Finalizar documento
      doc.end();

      return await pdfPromise;
    } catch (error) {
      throw new Error(
        `Error en ReportesService (streaming): ${
          error instanceof Error ? error.message : "Error desconocido"
        }`
      );
    }
  }

  /**
   * 📐 Calcular anchos de columnas para PDFKit
   */
  private calcularAnchosColumnas(columnas: ColumnaReporte[]): number[] {
    const anchoTotal = 500; // Ancho disponible en landscape
    return columnas.map((columna) => {
      if (columna.ancho) {
        const porcentaje = parseInt(columna.ancho.replace("%", ""));
        return (anchoTotal * porcentaje) / 100;
      }
      return anchoTotal / columnas.length; // Distribución uniforme
    });
  }

  /**
   * 🔍 Extraer valor anidado de objetos (ej: ct_municipio.nombre)
   */
  private extraerValorAnidado(objeto: any, ruta: string): any {
    return ruta.split(".").reduce((actual, propiedad) => {
      return actual && actual[propiedad] !== undefined
        ? actual[propiedad]
        : null;
    }, objeto);
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
   * Genera reporte de localidades usando el nuevo patrón BaseReportService
   * Delega toda la lógica al servicio especializado
   */
  async generarReporteLocalidadesCompleto(
    localidadesData: any[],
    filtros?: any
  ): Promise<Buffer> {
    const { LocalidadesReportService } = await import(
      "./reportes/localidadesReport.service"
    );
    const localidadesReportService = new LocalidadesReportService();

    return localidadesReportService.generarReporte(localidadesData, filtros);
  }

  /**
   * Genera reporte simplificado de localidades por municipio
   */
  async generarReporteLocalidadesPorMunicipio(
    localidadesData: any[],
    municipioInfo?: any
  ): Promise<Buffer> {
    const { LocalidadesReportService } = await import(
      "./reportes/localidadesReport.service"
    );
    const localidadesReportService = new LocalidadesReportService();

    return localidadesReportService.generarReportePorMunicipio(
      localidadesData,
      municipioInfo
    );
  }

  /**
   * Helper para convertir códigos de ámbito a texto legible
   */
  private obtenerTextoAmbito(ambito: string | null | undefined): string {
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

  /**
   * Helper genérico para formatear estados/estatus
   * Útil para diferentes tipos de datos
   */
  private formatearEstado(estado: any): string {
    if (estado === null || estado === undefined) return "Sin estado";

    if (typeof estado === "boolean") {
      return estado ? "Activo" : "Inactivo";
    }

    if (typeof estado === "number") {
      switch (estado) {
        case 0:
          return "Inactivo";
        case 1:
          return "Activo";
        case 2:
          return "En proceso";
        case 3:
          return "Suspendido";
        default:
          return `Estado ${estado}`;
      }
    }

    return estado.toString();
  }

  // ===== MÉTODOS PARA EXCEL =====

  /**
   * 📊 Método híbrido inteligente para generar reportes Excel
   * Decide automáticamente entre método hermoso o streaming según el tamaño
   */
  async generarReporteExcelHibrido(
    totalRegistros: number,
    obtenerDatos: () => Promise<any[]> | any[],
    configuracion: ConfiguracionReporte
  ): Promise<Buffer> {
    console.log(`📊 Generando reporte Excel: ${totalRegistros} registros`);

    if (totalRegistros >= this.UMBRAL_STREAMING_EXCEL) {
      console.log(`🚀 Usando STREAMING Excel para ${totalRegistros} registros`);
      return this.generarReporteExcelConStreaming(
        obtenerDatos,
        configuracion,
        totalRegistros
      );
    } else {
      console.log(`⚡ Usando Excel HERMOSO para ${totalRegistros} registros`);
      const datos = await obtenerDatos();
      return this.generarReporteExcelHermoso(datos, configuracion);
    }
  }

  /**
   * 🎨 Generar Excel hermoso con estilos (para datasets pequeños/medianos)
   */
  async generarReporteExcelHermoso(
    datos: any[],
    configuracion: ConfiguracionReporte
  ): Promise<Buffer> {
    try {
      const ExcelJS = require("exceljs");
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Reporte");

      // 📊 CONFIGURAR METADATA
      workbook.creator = "Sistema de Reportes";
      workbook.created = new Date();
      workbook.modified = new Date();

      // 🎨 ENCABEZADO PRINCIPAL
      worksheet.mergeCells(
        "A1",
        `${String.fromCharCode(64 + configuracion.columnas.length)}1`
      );
      const tituloCell = worksheet.getCell("A1");
      tituloCell.value = configuracion.titulo;
      tituloCell.font = { size: 16, bold: true, color: { argb: "FF1F4E79" } };
      tituloCell.alignment = { horizontal: "center" };
      tituloCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFF2F2F2" },
      };

      // 📝 DESCRIPCIÓN
      if (configuracion.descripcion) {
        worksheet.mergeCells(
          "A2",
          `${String.fromCharCode(64 + configuracion.columnas.length)}2`
        );
        const descripcionCell = worksheet.getCell("A2");
        descripcionCell.value = configuracion.descripcion;
        descripcionCell.font = { size: 12, italic: true };
        descripcionCell.alignment = { horizontal: "center" };
      }

      // 📊 ENCABEZADOS DE COLUMNAS
      const filaEncabezado = configuracion.descripcion ? 4 : 3;
      configuracion.columnas.forEach((columna, index) => {
        const cell = worksheet.getCell(filaEncabezado, index + 1);
        cell.value = columna.titulo;
        cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FF4A90E2" },
        };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
        cell.alignment = { horizontal: "center", vertical: "middle" };
      });

      // 📊 DATOS
      datos.forEach((registro, filaIndex) => {
        const filaActual = filaEncabezado + 1 + filaIndex;

        configuracion.columnas.forEach((columna, colIndex) => {
          const cell = worksheet.getCell(filaActual, colIndex + 1);
          const valor = this.extraerValorAnidado(registro, columna.campo);

          cell.value = columna.formato ? columna.formato(valor) : valor;

          // Aplicar formato según tipo
          if (columna.tipo === "numero") {
            cell.numFmt = "#,##0";
          } else if (columna.tipo === "fecha") {
            cell.numFmt = "dd/mm/yyyy";
          }

          // Bordes para todas las celdas
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };

          // Alternar color de filas
          if (filaIndex % 2 === 0) {
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FFF9F9F9" },
            };
          }
        });
      });

      // 🔧 AUTO-AJUSTAR ANCHOS
      configuracion.columnas.forEach((columna, index) => {
        const column = worksheet.getColumn(index + 1);
        if (columna.ancho) {
          const ancho = parseInt(columna.ancho.replace("%", "")) / 4; // Convertir % a unidades Excel
          column.width = Math.max(ancho, 10);
        } else {
          column.width = 15;
        }
      });

      // 🎯 TOTALES (si hay datos numéricos)
      const filaTotales = filaEncabezado + datos.length + 1;
      worksheet.getCell(filaTotales, 1).value = "TOTAL REGISTROS:";
      worksheet.getCell(filaTotales, 2).value = datos.length;
      worksheet.getCell(filaTotales, 1).font = { bold: true };
      worksheet.getCell(filaTotales, 2).font = { bold: true };

      return (await workbook.xlsx.writeBuffer()) as Buffer;
    } catch (error) {
      throw new Error(
        `Error en Excel hermoso: ${
          error instanceof Error ? error.message : "Error desconocido"
        }`
      );
    }
  }

  /**
   * 🚀 Generar Excel con STREAMING para datasets masivos
   */
  async generarReporteExcelConStreaming(
    obtenerDatos: () => Promise<any[]> | any[],
    configuracion: ConfiguracionReporte,
    totalRegistros: number
  ): Promise<Buffer> {
    try {
      const ExcelJS = require("exceljs");
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Reporte");

      // 📝 ENCABEZADO SIMPLE
      worksheet.getCell("A1").value = configuracion.titulo;
      worksheet.getCell("A1").font = { bold: true, size: 14 };

      let filaActual = 2;
      if (configuracion.descripcion) {
        worksheet.getCell(`A${filaActual}`).value = configuracion.descripcion;
        filaActual++;
      }

      worksheet.getCell(
        `A${filaActual}`
      ).value = `Total registros: ${totalRegistros}`;
      filaActual += 2; // Saltar una fila

      // 📊 ENCABEZADOS
      configuracion.columnas.forEach((col, index) => {
        const cell = worksheet.getCell(filaActual, index + 1);
        cell.value = col.titulo;
        cell.font = { bold: true };
      });
      filaActual++;

      // 🔄 PROCESAR DATOS EN LOTES
      const datos = await obtenerDatos();

      if (!datos || datos.length === 0) {
        throw new Error("No se obtuvieron datos para el reporte");
      }

      const totalLotes = Math.ceil(datos.length / this.TAMAÑO_LOTE_STREAMING);

      console.log(
        `📊 Procesando ${datos.length} registros Excel en ${totalLotes} lotes`
      );

      for (let lote = 0; lote < totalLotes; lote++) {
        const inicio = lote * this.TAMAÑO_LOTE_STREAMING;
        const fin = Math.min(inicio + this.TAMAÑO_LOTE_STREAMING, datos.length);
        const datosLote = datos.slice(inicio, fin);

        console.log(
          `📦 Procesando lote Excel ${
            lote + 1
          }/${totalLotes} (${inicio}-${fin})`
        );

        // Procesar cada registro del lote
        for (const registro of datosLote) {
          configuracion.columnas.forEach((columna, colIndex) => {
            const valor = this.extraerValorAnidado(registro, columna.campo);
            const valorFormateado = columna.formato
              ? columna.formato(valor)
              : valor;
            worksheet.getCell(filaActual, colIndex + 1).value = valorFormateado;
          });
          filaActual++;
        }
      }

      // Finalizar y obtener buffer
      return (await workbook.xlsx.writeBuffer()) as Buffer;
    } catch (error) {
      throw new Error(
        `Error en Excel streaming: ${
          error instanceof Error ? error.message : "Error desconocido"
        }`
      );
    }
  }

  /**
   * 📄 Generar CSV ultra-rápido para datasets masivos
   * Alternativa más rápida que Excel para datos masivos
   */
  async generarReporteCSVStreaming(
    obtenerDatos: () => Promise<any[]> | any[],
    configuracion: ConfiguracionReporte,
    totalRegistros: number
  ): Promise<Buffer> {
    try {
      let csvContent = "";

      // 📝 ENCABEZADO
      csvContent += `"${configuracion.titulo}"\n`;
      if (configuracion.descripcion) {
        csvContent += `"${configuracion.descripcion}"\n`;
      }
      csvContent += `"Total registros: ${totalRegistros}"\n\n`;

      // 📊 ENCABEZADOS DE COLUMNAS
      const encabezados = configuracion.columnas
        .map((col) => `"${col.titulo}"`)
        .join(",");
      csvContent += encabezados + "\n";

      // 🔄 PROCESAR DATOS EN LOTES
      const datos = await obtenerDatos();
      const totalLotes = Math.ceil(datos.length / this.TAMAÑO_LOTE_STREAMING);

      console.log(
        `📊 Procesando ${datos.length} registros CSV en ${totalLotes} lotes`
      );

      for (let lote = 0; lote < totalLotes; lote++) {
        const inicio = lote * this.TAMAÑO_LOTE_STREAMING;
        const fin = Math.min(inicio + this.TAMAÑO_LOTE_STREAMING, datos.length);
        const datosLote = datos.slice(inicio, fin);

        console.log(
          `📦 Procesando lote CSV ${lote + 1}/${totalLotes} (${inicio}-${fin})`
        );

        // Procesar cada registro del lote
        for (const registro of datosLote) {
          const fila = configuracion.columnas
            .map((columna) => {
              const valor = this.extraerValorAnidado(registro, columna.campo);
              const valorFormateado = columna.formato
                ? columna.formato(valor)
                : valor;
              // Escapar comillas en CSV
              return `"${(valorFormateado || "")
                .toString()
                .replace(/"/g, '""')}"`;
            })
            .join(",");

          csvContent += fila + "\n";
        }
      }

      return Buffer.from(csvContent, "utf-8");
    } catch (error) {
      throw new Error(
        `Error en CSV streaming: ${
          error instanceof Error ? error.message : "Error desconocido"
        }`
      );
    }
  }
}
