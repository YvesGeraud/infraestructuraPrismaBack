import ExcelJS from "exceljs";
import fs from "fs-extra";
import path from "path";
import { 
  reportesConfig, 
  generarNombreArchivo, 
  obtenerEstilosExcel,
  obtenerConfiguracionReporte 
} from "../config/reports";
import { 
  DatosReporte, 
  ConfiguracionExcel, 
  ResultadoReporte,
  GraficoReporte 
} from "../types/reports";
import logger from "../config/logger";

export class ExcelService {
  private workbook: ExcelJS.Workbook | null = null;

  /**
   * Genera un reporte Excel
   */
  async generarExcel(
    datos: DatosReporte, 
    configuracion: ConfiguracionExcel = reportesConfig.excel as ConfiguracionExcel
  ): Promise<ResultadoReporte> {
    const tiempoInicio = Date.now();
    
    try {
      this.workbook = new ExcelJS.Workbook();
      this.workbook.creator = "Cedex System";
      this.workbook.lastModifiedBy = datos.usuarioGenerador;
      this.workbook.created = datos.fechaGeneracion;
      this.workbook.modified = new Date();

      // Crear hoja principal
      const hoja = this.workbook.addWorksheet(configuracion.hoja.nombre);
      
      // Configurar propiedades de la hoja
      if (configuracion.hoja.colorFondo) {
        hoja.properties.tabColor = { argb: this.hexToArgb(configuracion.hoja.colorFondo) };
      }

      // Agregar título
      await this.agregarTitulo(hoja, datos, configuracion);
      
      // Agregar datos
      await this.agregarDatos(hoja, datos, configuracion);
      
      // Agregar totales si existen
      if (datos.totales) {
        await this.agregarTotales(hoja, datos.totales, configuracion);
      }
      
      // Agregar gráficos si están habilitados
      if (configuracion.graficos?.habilitar && datos.graficos) {
        await this.agregarGraficos(hoja, datos.graficos, configuracion);
      }
      
      // Configurar filtros
      if (configuracion.filtros?.habilitar) {
        await this.configurarFiltros(hoja, datos);
      }
      
      // Configurar columnas
      await this.configurarColumnas(hoja, datos, configuracion);

      // Guardar archivo
      const nombreArchivo = generarNombreArchivo(datos.titulo.toLowerCase().replace(/\s+/g, "_"), configuracion.formato);
      const rutaArchivo = path.join(process.cwd(), reportesConfig.directorio, nombreArchivo);
      
      await fs.ensureDir(path.dirname(rutaArchivo));
      await this.workbook.xlsx.writeFile(rutaArchivo);

      const tiempoGeneracion = Date.now() - tiempoInicio;

      logger.info(`Excel generado exitosamente: ${nombreArchivo} (${tiempoGeneracion}ms)`);

      return {
        exito: true,
        mensaje: "Excel generado exitosamente",
        archivo: {
          nombre: nombreArchivo,
          ruta: rutaArchivo,
          tamanio: await this.obtenerTamanioArchivo(rutaArchivo),
          tipo: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          url: `/uploads/reportes/${nombreArchivo}`
        },
        datos,
        tiempoGeneracion
      };

    } catch (error) {
      logger.error("Error generando Excel:", error);
      return {
        exito: false,
        mensaje: "Error generando Excel",
        errores: [error instanceof Error ? error.message : "Error desconocido"],
        tiempoGeneracion: Date.now() - tiempoInicio
      };
    }
  }

  /**
   * Agrega el título al reporte
   */
  private async agregarTitulo(
    hoja: ExcelJS.Worksheet, 
    datos: DatosReporte, 
    configuracion: ConfiguracionExcel
  ): Promise<void> {
    const estilos = obtenerEstilosExcel(datos.titulo);
    
    // Título principal
    const tituloRow = hoja.addRow([datos.titulo]);
    tituloRow.height = 30;
    
    const tituloCell = tituloRow.getCell(1);
    tituloCell.font = {
      name: estilos.titulo.fuente.familia,
      size: estilos.titulo.fuente.tamanio,
      bold: estilos.titulo.fuente.negrita,
      color: { argb: this.hexToArgb(estilos.titulo.fuente.color) }
    };
    tituloCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: this.hexToArgb(estilos.titulo.relleno.color) }
    };
    tituloCell.alignment = {
      horizontal: estilos.titulo.alineacion.horizontal as "left" | "center" | "right" | "fill" | "justify" | "centerContinuous" | "distributed",
      vertical: estilos.titulo.alineacion.vertical as "top" | "middle" | "bottom" | "distributed" | "justify"
    };
    tituloCell.border = {
      top: { style: 'thick', color: { argb: this.hexToArgb(estilos.titulo.borde.color) } },
      bottom: { style: 'thick', color: { argb: this.hexToArgb(estilos.titulo.borde.color) } },
      left: { style: 'thick', color: { argb: this.hexToArgb(estilos.titulo.borde.color) } },
      right: { style: 'thick', color: { argb: this.hexToArgb(estilos.titulo.borde.color) } }
    };
    
    // Combinar celdas para el título
    hoja.mergeCells(`A1:${this.obtenerLetraColumna(this.obtenerNumeroColumnas(datos.datos))}1`);
    
    // Descripción si existe
    if (datos.descripcion) {
      const descRow = hoja.addRow([datos.descripcion]);
      descRow.height = 25;
      
      const descCell = descRow.getCell(1);
      descCell.font = {
        name: estilos.subtitulo.fuente.familia,
        size: estilos.subtitulo.fuente.tamanio,
        bold: estilos.subtitulo.fuente.negrita,
        color: { argb: this.hexToArgb(estilos.subtitulo.fuente.color) }
      };
      descCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: this.hexToArgb(estilos.subtitulo.relleno.color) }
      };
      descCell.alignment = {
        horizontal: estilos.subtitulo.alineacion.horizontal as "left" | "center" | "right" | "fill" | "justify" | "centerContinuous" | "distributed",
        vertical: estilos.subtitulo.alineacion.vertical as "top" | "middle" | "bottom" | "distributed" | "justify"
      };
      
      hoja.mergeCells(`A2:${this.obtenerLetraColumna(this.obtenerNumeroColumnas(datos.datos))}2`);
    }
    
    // Línea en blanco
    hoja.addRow([]);
  }

  /**
   * Agrega los datos al reporte
   */
  private async agregarDatos(
    hoja: ExcelJS.Worksheet, 
    datos: DatosReporte, 
    configuracion: ConfiguracionExcel
  ): Promise<void> {
    if (!datos.datos || datos.datos.length === 0) {
      hoja.addRow(["No hay datos para mostrar"]);
      return;
    }

    const estilos = obtenerEstilosExcel(datos.titulo);
    const columnas = Object.keys(datos.datos[0]);
    
    // Encabezados
    const headerRow = hoja.addRow(columnas.map(col => this.formatearTituloColumna(col)));
    headerRow.height = 25;
    
    headerRow.eachCell((cell, colNumber) => {
      cell.font = {
        name: estilos.encabezado.fuente.familia,
        size: estilos.encabezado.fuente.tamanio,
        bold: estilos.encabezado.fuente.negrita,
        color: { argb: this.hexToArgb(estilos.encabezado.fuente.color) }
      };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: this.hexToArgb(estilos.encabezado.relleno.color) }
      };
      cell.alignment = {
        horizontal: estilos.encabezado.alineacion.horizontal as "left" | "center" | "right" | "fill" | "justify" | "centerContinuous" | "distributed",
        vertical: estilos.encabezado.alineacion.vertical as "top" | "middle" | "bottom" | "distributed" | "justify"
      };
      cell.border = {
        top: { style: 'thin', color: { argb: this.hexToArgb(estilos.encabezado.borde.color) } },
        bottom: { style: 'thin', color: { argb: this.hexToArgb(estilos.encabezado.borde.color) } },
        left: { style: 'thin', color: { argb: this.hexToArgb(estilos.encabezado.borde.color) } },
        right: { style: 'thin', color: { argb: this.hexToArgb(estilos.encabezado.borde.color) } }
      };
    });
    
    // Datos
    datos.datos.forEach((fila, index) => {
      const dataRow = hoja.addRow(columnas.map(col => this.formatearValor(fila[col])));
      dataRow.height = 20;
      
      dataRow.eachCell((cell, colNumber) => {
        cell.font = {
          name: estilos.datos.fuente.familia,
          size: estilos.datos.fuente.tamanio,
          bold: estilos.datos.fuente.negrita,
          color: { argb: this.hexToArgb(estilos.datos.fuente.color) }
        };
        cell.alignment = {
          horizontal: estilos.datos.alineacion.horizontal as "left" | "center" | "right" | "fill" | "justify" | "centerContinuous" | "distributed",
          vertical: estilos.datos.alineacion.vertical as "top" | "middle" | "bottom" | "distributed" | "justify"
        };
        cell.border = {
          top: { style: 'thin', color: { argb: this.hexToArgb(estilos.datos.borde.color) } },
          bottom: { style: 'thin', color: { argb: this.hexToArgb(estilos.datos.borde.color) } },
          left: { style: 'thin', color: { argb: this.hexToArgb(estilos.datos.borde.color) } },
          right: { style: 'thin', color: { argb: this.hexToArgb(estilos.datos.borde.color) } }
        };
        
        // Aplicar formato específico según el tipo de dato
        this.aplicarFormatoCelda(cell, fila[columnas[colNumber - 1]]);
      });
      
      // Alternar colores de filas
      if (index % 2 === 1) {
        dataRow.eachCell((cell) => {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: this.hexToArgb('#f8f9fa') }
          };
        });
      }
    });
  }

  /**
   * Agrega totales al reporte
   */
  private async agregarTotales(
    hoja: ExcelJS.Worksheet, 
    totales: Record<string, any>, 
    configuracion: ConfiguracionExcel
  ): Promise<void> {
    const estilos = obtenerEstilosExcel("totales");
    
    // Línea en blanco
    hoja.addRow([]);
    
    // Fila de totales
    const totalesArray = Object.entries(totales).map(([clave, valor]) => 
      `${this.formatearTituloColumna(clave)}: ${this.formatearValor(valor)}`
    );
    
    const totalesRow = hoja.addRow(totalesArray);
    totalesRow.height = 25;
    
    totalesRow.eachCell((cell) => {
      cell.font = {
        name: estilos.totales.fuente.familia,
        size: estilos.totales.fuente.tamanio,
        bold: estilos.totales.fuente.negrita,
        color: { argb: this.hexToArgb(estilos.totales.fuente.color) }
      };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: this.hexToArgb(estilos.totales.relleno.color) }
      };
      cell.alignment = {
        horizontal: estilos.totales.alineacion.horizontal as "left" | "center" | "right" | "fill" | "justify" | "centerContinuous" | "distributed",
        vertical: estilos.totales.alineacion.vertical as "top" | "middle" | "bottom" | "distributed" | "justify"
      };
    });
  }

  /**
   * Agrega gráficos al reporte
   */
  private async agregarGraficos(
    hoja: ExcelJS.Worksheet, 
    graficos: GraficoReporte[], 
    configuracion: ConfiguracionExcel
  ): Promise<void> {
    if (!configuracion.graficos?.tipos) return;
    
    graficos.forEach((grafico, index) => {
      if (!configuracion.graficos?.tipos?.includes(grafico.tipo)) return;
      
      // Crear gráfico - comentado temporalmente hasta resolver la API de ExcelJS
      // const chart = hoja.addChart({
      //   type: grafico.tipo as any,
      //   title: { name: grafico.titulo },
      //   legend: { position: 'bottom' },
      //   plotArea: {
      //     dataTable: { showHorizontalBorder: true, showVerticalBorder: true }
      //   }
      // });
      
      // Por ahora, solo agregamos un comentario sobre el gráfico
      const chartRow = hoja.rowCount + 2;
      const chartCell = hoja.getCell(chartRow, 1);
      chartCell.value = `Gráfico: ${grafico.titulo} (${grafico.tipo})`;
      chartCell.font = { bold: true, color: { argb: 'FF3498DB' } };
      
      // Configurar datos del gráfico - comentado temporalmente
      // const dataRange = this.obtenerRangoDatosGrafico(hoja, grafico);
      // chart.addSeries({
      //   name: grafico.titulo,
      //   categories: dataRange.categories,
      //   values: dataRange.values,
      //   fill: { type: 'solid', color: { argb: this.hexToArgb(configuracion.graficos?.colores?.[index] || '#3498db') } }
      // });
      
      // Posicionar gráfico - comentado temporalmente
      // chart.setPosition(chartRow, 0, chartRow + 15, 10);
    });
  }

  /**
   * Configura filtros en la hoja
   */
  private async configurarFiltros(hoja: ExcelJS.Worksheet, datos: DatosReporte): Promise<void> {
    if (!datos.datos || datos.datos.length === 0) return;
    
    const columnas = Object.keys(datos.datos[0]);
    const rangoFiltro = `A${this.obtenerFilaInicioDatos(datos)}:${this.obtenerLetraColumna(columnas.length)}${this.obtenerFilaInicioDatos(datos) + datos.datos.length}`;
    
    hoja.autoFilter = {
      from: { row: this.obtenerFilaInicioDatos(datos), column: 1 },
      to: { row: this.obtenerFilaInicioDatos(datos) + datos.datos.length, column: columnas.length }
    };
  }

  /**
   * Configura el ancho de las columnas
   */
  private async configurarColumnas(
    hoja: ExcelJS.Worksheet, 
    datos: DatosReporte, 
    configuracion: ConfiguracionExcel
  ): Promise<void> {
    if (!datos.datos || datos.datos.length === 0) return;
    
    const columnas = Object.keys(datos.datos[0]);
    
    columnas.forEach((columna, index) => {
      const col = hoja.getColumn(index + 1);
      
      if (configuracion.columnas.anchoAutomatico) {
        col.width = Math.min(
          Math.max(
            this.calcularAnchoColumna(columna, datos.datos),
            configuracion.columnas.anchoMinimo || 10
          ),
          configuracion.columnas.anchoMaximo || 50
        );
      } else {
        col.width = configuracion.columnas.anchoMinimo || 15;
      }
    });
  }

  /**
   * Aplica formato específico a una celda según el tipo de dato
   */
  private aplicarFormatoCelda(cell: ExcelJS.Cell, valor: any): void {
    if (typeof valor === 'number') {
      if (Number.isInteger(valor)) {
        cell.numFmt = '#,##0';
      } else {
        cell.numFmt = '#,##0.00';
      }
    } else if (valor instanceof Date) {
      cell.numFmt = 'dd/mm/yyyy';
    } else if (typeof valor === 'boolean') {
      cell.value = valor ? 'Sí' : 'No';
    }
  }

  /**
   * Obtiene el rango de datos para un gráfico
   */
  private obtenerRangoDatosGrafico(hoja: ExcelJS.Worksheet, grafico: GraficoReporte): any {
    // Implementación básica - se puede mejorar según necesidades específicas
    return {
      categories: grafico.datos.etiquetas,
      values: grafico.datos.valores
    };
  }

  /**
   * Calcula el ancho óptimo para una columna
   */
  private calcularAnchoColumna(columna: string, datos: any[]): number {
    const titulo = this.formatearTituloColumna(columna);
    let maxLength = titulo.length;
    
    datos.forEach(fila => {
      const valor = String(this.formatearValor(fila[columna]));
      maxLength = Math.max(maxLength, valor.length);
    });
    
    return Math.min(maxLength + 2, 50);
  }

  /**
   * Obtiene el número de columnas en los datos
   */
  private obtenerNumeroColumnas(datos: any[]): number {
    return datos.length > 0 ? Object.keys(datos[0]).length : 1;
  }

  /**
   * Obtiene la letra de columna basada en el número
   */
  private obtenerLetraColumna(numero: number): string {
    let letra = '';
    while (numero > 0) {
      numero--;
      letra = String.fromCharCode(65 + (numero % 26)) + letra;
      numero = Math.floor(numero / 26);
    }
    return letra;
  }

  /**
   * Obtiene la fila donde inician los datos
   */
  private obtenerFilaInicioDatos(datos: DatosReporte): number {
    let fila = 1; // Título
    if (datos.descripcion) fila++; // Descripción
    fila++; // Línea en blanco
    fila++; // Encabezados
    return fila;
  }

  /**
   * Convierte color hexadecimal a formato ARGB
   */
  private hexToArgb(hex: string): string {
    const cleanHex = hex.replace('#', '');
    return `FF${cleanHex}`;
  }

  /**
   * Formatea el título de una columna
   */
  private formatearTituloColumna(columna: string): string {
    return columna
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }

  /**
   * Formatea un valor para mostrar
   */
  private formatearValor(valor: any): any {
    if (valor === null || valor === undefined) return '-';
    if (typeof valor === 'boolean') return valor ? 'Sí' : 'No';
    if (valor instanceof Date) return valor;
    if (typeof valor === 'number') return valor;
    return String(valor);
  }

  /**
   * Obtiene el tamaño de un archivo
   */
  private async obtenerTamanioArchivo(ruta: string): Promise<number> {
    try {
      const stats = await fs.stat(ruta);
      return stats.size;
    } catch {
      return 0;
    }
  }

  /**
   * Limpia archivos temporales
   */
  async limpiarArchivosTemporales(): Promise<{ eliminados: number; espacioLiberado: number }> {
    try {
      const directorio = path.join(process.cwd(), reportesConfig.directorio);
      if (!fs.existsSync(directorio)) return { eliminados: 0, espacioLiberado: 0 };

      const archivos = await fs.readdir(directorio);
      let eliminados = 0;
      let espacioLiberado = 0;

      for (const archivo of archivos) {
        if (archivo.endsWith('.xlsx') || archivo.endsWith('.xls')) {
          const rutaArchivo = path.join(directorio, archivo);
          const stats = await fs.stat(rutaArchivo);
          const edadArchivo = Date.now() - stats.mtime.getTime();

          if (edadArchivo > reportesConfig.limpieza.maxEdad) {
            await fs.unlink(rutaArchivo);
            eliminados++;
            espacioLiberado += stats.size;
          }
        }
      }

      logger.info(`Limpieza Excel completada: ${eliminados} archivos eliminados, ${espacioLiberado} bytes liberados`);
      return { eliminados, espacioLiberado };

    } catch (error) {
      logger.error("Error en limpieza de archivos Excel:", error);
      return { eliminados: 0, espacioLiberado: 0 };
    }
  }
}
