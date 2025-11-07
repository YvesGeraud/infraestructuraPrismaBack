import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import fs from "fs-extra";
import path from "path";
import handlebars from "handlebars";
import {
  reportesConfig,
  generarNombreArchivo,
  obtenerEstilosPDF,
  obtenerConfiguracionReporte,
} from "../config/reports";
import {
  DatosReporte,
  ConfiguracionPDF,
  ResultadoReporte,
  GraficoReporte,
} from "../types/reports";
import logger from "../config/logger";

// Configurar Puppeteer con Stealth
puppeteer.use(StealthPlugin());

export class PDFService {
  private browser: any = null;
  private plantillas: Map<string, handlebars.TemplateDelegate> = new Map();

  constructor() {
    this.cargarPlantillas();
  }

  /**
   * Carga las plantillas Handlebars para los reportes
   */
  private cargarPlantillas(): void {
    try {
      const directorioPlantillas = path.join(
        process.cwd(),
        reportesConfig.plantillas.directorio
      );

      if (!fs.existsSync(directorioPlantillas)) {
        fs.mkdirSync(directorioPlantillas, { recursive: true });
        logger.info("Directorio de plantillas PDF creado");
        return;
      }

      const archivos = fs.readdirSync(directorioPlantillas);

      archivos.forEach((archivo) => {
        if (archivo.endsWith(reportesConfig.plantillas.extension)) {
          const nombrePlantilla = archivo.replace(
            reportesConfig.plantillas.extension,
            ""
          );
          const contenido = fs.readFileSync(
            path.join(directorioPlantillas, archivo),
            reportesConfig.plantillas.encoding
          );

          this.plantillas.set(nombrePlantilla, handlebars.compile(contenido));
          logger.info(`Plantilla PDF cargada: ${nombrePlantilla}`);
        }
      });
    } catch (error) {
      logger.error("Error cargando plantillas PDF:", error);
    }
  }

  /**
   * Inicializa el navegador Puppeteer
   */
  private async inicializarNavegador(): Promise<void> {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: true,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-accelerated-2d-canvas",
          "--no-first-run",
          "--no-zygote",
          "--disable-gpu",
        ],
      });
      logger.info("Navegador Puppeteer inicializado");
    }
  }

  /**
   * Cierra el navegador Puppeteer
   */
  async cerrarNavegador(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      logger.info("Navegador Puppeteer cerrado");
    }
  }

  /**
   * Genera un reporte PDF usando Puppeteer
   */
  async generarPDFConPuppeteer(
    datos: DatosReporte,
    configuracion: ConfiguracionPDF = reportesConfig.pdf
  ): Promise<ResultadoReporte> {
    const tiempoInicio = Date.now();

    try {
      await this.inicializarNavegador();

      const pagina = await this.browser.newPage();

      // Configurar la página
      await pagina.setViewport({ width: 1200, height: 800 });
      await pagina.setContent(this.generarHTML(datos, configuracion));

      // Generar PDF
      const pdfBuffer = await pagina.pdf({
        format: configuracion.formato,
        landscape: configuracion.orientacion === "landscape",
        margin: {
          top: `${configuracion.margenes.superior}mm`,
          bottom: `${configuracion.margenes.inferior}mm`,
          left: `${configuracion.margenes.izquierdo}mm`,
          right: `${configuracion.margenes.derecho}mm`,
        },
        printBackground: true,
        displayHeaderFooter:
          configuracion.encabezado?.mostrar || configuracion.piePagina?.mostrar,
        headerTemplate: configuracion.encabezado?.mostrar
          ? this.generarHeaderHTML(configuracion)
          : "",
        footerTemplate: configuracion.piePagina?.mostrar
          ? this.generarFooterHTML(configuracion, datos)
          : "",
      });

      await pagina.close();

      // Guardar archivo
      const nombreArchivo = generarNombreArchivo(
        datos.titulo.toLowerCase().replace(/\s+/g, "_"),
        "pdf"
      );
      const rutaArchivo = path.join(
        process.cwd(),
        reportesConfig.directorio,
        nombreArchivo
      );

      await fs.ensureDir(path.dirname(rutaArchivo));
      await fs.writeFile(rutaArchivo, pdfBuffer);

      const tiempoGeneracion = Date.now() - tiempoInicio;

      logger.info(
        `PDF generado exitosamente: ${nombreArchivo} (${tiempoGeneracion}ms)`
      );

      return {
        exito: true,
        mensaje: "PDF generado exitosamente",
        archivo: {
          nombre: nombreArchivo,
          ruta: rutaArchivo,
          tamanio: pdfBuffer.length,
          tipo: "application/pdf",
          url: `/uploads/reportes/${nombreArchivo}`,
        },
        datos,
        tiempoGeneracion,
      };
    } catch (error) {
      logger.error("Error generando PDF con Puppeteer:", error);
      return {
        exito: false,
        mensaje: "Error generando PDF",
        errores: [error instanceof Error ? error.message : "Error desconocido"],
        tiempoGeneracion: Date.now() - tiempoInicio,
      };
    }
  }

  /**
   * Genera un reporte PDF usando PDF-Lib (para reportes simples)
   */
  async generarPDFConPDFLib(
    datos: DatosReporte,
    configuracion: ConfiguracionPDF = reportesConfig.pdf
  ): Promise<ResultadoReporte> {
    const tiempoInicio = Date.now();

    try {
      const pdfDoc = await PDFDocument.create();
      const pagina = pdfDoc.addPage([
        configuracion.formato === "A4" ? 595 : 842,
        configuracion.formato === "A4" ? 842 : 595,
      ]);

      const { width, height } = pagina.getSize();
      const estilos = obtenerEstilosPDF(datos.titulo);

      // Título
      const tituloFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      pagina.drawText(datos.titulo, {
        x: 50,
        y: height - 50,
        size: estilos.titulo.fuente.tamanio,
        font: tituloFont,
        color: rgb(0.17, 0.24, 0.31), // #2c3e50
      });

      // Descripción
      if (datos.descripcion) {
        const descFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
        pagina.drawText(datos.descripcion, {
          x: 50,
          y: height - 80,
          size: estilos.subtitulo.fuente.tamanio,
          font: descFont,
          color: rgb(0.2, 0.29, 0.37), // #34495e
        });
      }

      // Datos de la tabla
      if (datos.datos && datos.datos.length > 0) {
        await this.agregarTablaPDF(
          pagina,
          datos.datos,
          estilos,
          50,
          height - 120
        );
      }

      // Guardar archivo
      const pdfBytes = await pdfDoc.save();
      const nombreArchivo = generarNombreArchivo(
        datos.titulo.toLowerCase().replace(/\s+/g, "_"),
        "pdf"
      );
      const rutaArchivo = path.join(
        process.cwd(),
        reportesConfig.directorio,
        nombreArchivo
      );

      await fs.ensureDir(path.dirname(rutaArchivo));
      await fs.writeFile(rutaArchivo, pdfBytes);

      const tiempoGeneracion = Date.now() - tiempoInicio;

      logger.info(
        `PDF generado con PDF-Lib: ${nombreArchivo} (${tiempoGeneracion}ms)`
      );

      return {
        exito: true,
        mensaje: "PDF generado exitosamente",
        archivo: {
          nombre: nombreArchivo,
          ruta: rutaArchivo,
          tamanio: pdfBytes.length,
          tipo: "application/pdf",
          url: `/uploads/reportes/${nombreArchivo}`,
        },
        datos,
        tiempoGeneracion,
      };
    } catch (error) {
      logger.error("Error generando PDF con PDF-Lib:", error);
      return {
        exito: false,
        mensaje: "Error generando PDF",
        errores: [error instanceof Error ? error.message : "Error desconocido"],
        tiempoGeneracion: Date.now() - tiempoInicio,
      };
    }
  }

  /**
   * Genera HTML para el reporte
   */
  private generarHTML(
    datos: DatosReporte,
    configuracion: ConfiguracionPDF
  ): string {
    const estilos = obtenerEstilosPDF(datos.titulo);

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>${datos.titulo}</title>
        <style>
          body {
            font-family: ${estilos.texto.fuente.familia}, sans-serif;
            margin: 0;
            padding: 20px;
            color: ${estilos.texto.fuente.color};
          }
          .titulo {
            font-size: ${estilos.titulo.fuente.tamanio}px;
            font-weight: bold;
            text-align: center;
            color: ${estilos.titulo.fuente.color};
            margin-bottom: 20px;
          }
          .descripcion {
            font-size: ${estilos.subtitulo.fuente.tamanio}px;
            color: ${estilos.subtitulo.fuente.color};
            margin-bottom: 30px;
            text-align: center;
          }
          .tabla {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          .tabla th {
            background-color: ${
              estilos.tabla.encabezado.relleno?.color || "#3498db"
            };
            color: ${estilos.tabla.encabezado.fuente.color};
            padding: 12px;
            text-align: left;
            font-weight: bold;
            font-size: ${estilos.tabla.encabezado.fuente.tamanio}px;
          }
          .tabla td {
            padding: 10px;
            border-bottom: 1px solid ${estilos.tabla.bordes.color};
            font-size: ${estilos.tabla.filas.fuente.tamanio}px;
          }
          .tabla tr:nth-child(even) {
            background-color: ${estilos.tabla.filas.colorAlternado};
          }
          .metadatos {
            margin-top: 30px;
            padding: 15px;
            background-color: #f8f9fa;
            border-radius: 5px;
            font-size: 11px;
          }
        </style>
      </head>
      <body>
        <div class="titulo">${datos.titulo}</div>
        ${
          datos.descripcion
            ? `<div class="descripcion">${datos.descripcion}</div>`
            : ""
        }
        
        ${this.generarTablaHTML(datos.datos)}
        
        ${datos.totales ? this.generarTotalesHTML(datos.totales) : ""}
        
        <div class="metadatos">
          <strong>Generado el:</strong> ${datos.fechaGeneracion.toLocaleString()}<br>
          <strong>Por:</strong> ${datos.usuarioGenerador}<br>
          <strong>Elementos:</strong> ${datos.datos.length}
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Genera HTML para la tabla de datos
   */
  private generarTablaHTML(datos: any[]): string {
    if (!datos || datos.length === 0) {
      return "<p>No hay datos para mostrar</p>";
    }

    const columnas = Object.keys(datos[0]);

    return `
      <table class="tabla">
        <thead>
          <tr>
            ${columnas
              .map((col) => `<th>${this.formatearTituloColumna(col)}</th>`)
              .join("")}
          </tr>
        </thead>
        <tbody>
          ${datos
            .map(
              (fila) => `
            <tr>
              ${columnas
                .map((col) => `<td>${this.formatearValor(fila[col])}</td>`)
                .join("")}
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    `;
  }

  /**
   * Genera HTML para los totales
   */
  private generarTotalesHTML(totales: Record<string, any>): string {
    return `
      <div style="margin-top: 20px; padding: 15px; background-color: #27ae60; color: white; border-radius: 5px;">
        <h3>Totales</h3>
        ${Object.entries(totales)
          .map(
            ([clave, valor]) =>
              `<div><strong>${this.formatearTituloColumna(
                clave
              )}:</strong> ${this.formatearValor(valor)}</div>`
          )
          .join("")}
      </div>
    `;
  }

  /**
   * Genera HTML para el encabezado
   */
  private generarHeaderHTML(configuracion: ConfiguracionPDF): string {
    return `
      <div style="font-size: 10px; padding: 10px; text-align: center; width: 100%;">
        ${configuracion.encabezado?.titulo || "Cedex System"}
      </div>
    `;
  }

  /**
   * Genera HTML para el pie de página
   */
  private generarFooterHTML(
    configuracion: ConfiguracionPDF,
    datos: DatosReporte
  ): string {
    const texto =
      configuracion.piePagina?.texto || "Generado el {fecha} por {usuario}";
    const textoFormateado = texto
      .replace("{fecha}", datos.fechaGeneracion.toLocaleDateString())
      .replace("{usuario}", datos.usuarioGenerador);

    return `
      <div style="font-size: 10px; padding: 10px; text-align: center; width: 100%;">
        ${textoFormateado}
        ${
          configuracion.piePagina?.numeracion
            ? '<span class="pageNumber"></span> / <span class="totalPages"></span>'
            : ""
        }
      </div>
    `;
  }

  /**
   * Agrega una tabla al PDF usando PDF-Lib
   */
  private async agregarTablaPDF(
    pagina: any,
    datos: any[],
    estilos: any,
    x: number,
    y: number
  ): Promise<void> {
    if (!datos || datos.length === 0) return;

    const columnas = Object.keys(datos[0]);
    const filaAltura = 20;
    const columnaAncho = 100;
    let posY = y;

    // Encabezados
    const headerFont = await pagina.doc.embedFont(StandardFonts.HelveticaBold);
    columnas.forEach((col, index) => {
      pagina.drawText(this.formatearTituloColumna(col), {
        x: x + index * columnaAncho,
        y: posY,
        size: 10,
        font: headerFont,
        color: rgb(1, 1, 1),
      });
    });

    posY -= filaAltura;

    // Datos
    const dataFont = await pagina.doc.embedFont(StandardFonts.Helvetica);
    datos.forEach((fila, filaIndex) => {
      columnas.forEach((col, colIndex) => {
        pagina.drawText(this.formatearValor(fila[col]), {
          x: x + colIndex * columnaAncho,
          y: posY,
          size: 9,
          font: dataFont,
          color: rgb(0, 0, 0),
        });
      });
      posY -= filaAltura;
    });
  }

  /**
   * Formatea el título de una columna
   */
  private formatearTituloColumna(columna: string): string {
    return columna
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  }

  /**
   * Formatea un valor para mostrar
   */
  private formatearValor(valor: any): string {
    if (valor === null || valor === undefined) return "-";
    if (typeof valor === "boolean") return valor ? "Sí" : "No";
    if (valor instanceof Date) return valor.toLocaleDateString();
    if (typeof valor === "number") return valor.toLocaleString();
    return String(valor);
  }

  /**
   * Obtiene las plantillas disponibles
   */
  getPlantillasDisponibles(): string[] {
    return Array.from(this.plantillas.keys());
  }

  /**
   * Limpia archivos temporales
   */
  async limpiarArchivosTemporales(): Promise<{
    eliminados: number;
    espacioLiberado: number;
  }> {
    try {
      const directorio = path.join(process.cwd(), reportesConfig.directorio);
      if (!fs.existsSync(directorio))
        return { eliminados: 0, espacioLiberado: 0 };

      const archivos = await fs.readdir(directorio);
      let eliminados = 0;
      let espacioLiberado = 0;

      for (const archivo of archivos) {
        const rutaArchivo = path.join(directorio, archivo);
        const stats = await fs.stat(rutaArchivo);
        const edadArchivo = Date.now() - stats.mtime.getTime();

        if (edadArchivo > reportesConfig.limpieza.maxEdad) {
          await fs.unlink(rutaArchivo);
          eliminados++;
          espacioLiberado += stats.size;
        }
      }

      logger.info(
        `Limpieza PDF completada: ${eliminados} archivos eliminados, ${espacioLiberado} bytes liberados`
      );
      return { eliminados, espacioLiberado };
    } catch (error) {
      logger.error("Error en limpieza de archivos PDF:", error);
      return { eliminados: 0, espacioLiberado: 0 };
    }
  }
}
