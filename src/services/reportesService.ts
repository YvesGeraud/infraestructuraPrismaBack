import { PDFService } from "./pdfService";
import { ExcelService } from "./excelService";
import { UserService } from "./userService";
import { ProductService } from "./productService";
import { ArchivoService } from "./archivoService";
import { EmailService } from "./emailService";
import {
  reportesConfig,
  validarTipoReporte,
  obtenerConfiguracionReporte,
} from "../config/reports";
import {
  DatosReporte,
  ResultadoReporte,
  SolicitudReporte,
  RespuestaReporte,
  EstadisticasReporte,
  MetricasReporte,
  FiltroReporte,
  OrdenamientoReporte,
  AgrupacionReporte,
} from "../types/reports";

import logger from "../config/logger";
import { prisma } from "../config/database";
import fs from "fs-extra";
import path from "path";

export class ReportesService {
  private pdfService: PDFService;
  private excelService: ExcelService;
  private userService: UserService;
  private productService: ProductService;
  private archivoService: ArchivoService;
  private emailService: EmailService;
  private estadisticas: EstadisticasReporte;
  private metricas: MetricasReporte;
  private cache: Map<string, { datos: any; timestamp: number }> = new Map();

  constructor() {
    this.pdfService = new PDFService();
    this.excelService = new ExcelService();
    this.userService = new UserService();
    this.productService = new ProductService();
    this.archivoService = new ArchivoService();
    this.emailService = new EmailService();

    this.estadisticas = {
      totalGenerados: 0,
      porTipo: {},
      porFormato: {},
      porUsuario: {},
      tamanioPromedio: 0,
      tiempoPromedio: 0,
      errores: 0,
    };

    this.metricas = {
      totalGenerados: 0,
      exitosos: 0,
      fallidos: 0,
      tiempoPromedio: 0,
      tamanioPromedio: 0,
      tiposMasUsados: [],
      usuariosMasActivos: [],
      erroresComunes: [],
    };

    // Iniciar limpieza automática de caché
    this.iniciarLimpiezaCache();
  }

  /**
   * Genera un reporte según la solicitud con optimizaciones
   */
  async generarReporte(
    solicitud: SolicitudReporte,
    usuarioGenerador: string
  ): Promise<RespuestaReporte> {
    const tiempoInicio = Date.now();
    const cacheKey = this.generarClaveCache(solicitud, usuarioGenerador);

    try {
      // Validar tipo de reporte
      if (!validarTipoReporte(solicitud.tipo)) {
        throw new Error(`Tipo de reporte no válido: ${solicitud.tipo}`);
      }

      // Verificar caché si está habilitado
      if (reportesConfig.cache.habilitar) {
        const datosCache = this.obtenerDeCache(cacheKey);
        if (datosCache) {
          logger.info(`Reporte obtenido de caché: ${solicitud.tipo}`);
          return this.generarReporteDesdeCache(
            datosCache,
            solicitud,
            tiempoInicio
          );
        }
      }

      // Obtener datos según el tipo con filtros y ordenamiento
      const datos = await this.obtenerDatosReporteOptimizado(
        solicitud,
        usuarioGenerador
      );

      // Aplicar filtros si existen
      if (solicitud.filtros && solicitud.filtros.length > 0) {
        datos.datos = this.aplicarFiltros(datos.datos, solicitud.filtros);
      }

      // Aplicar ordenamiento si existe
      if (solicitud.ordenamiento && solicitud.ordenamiento.length > 0) {
        datos.datos = this.aplicarOrdenamiento(
          datos.datos,
          solicitud.ordenamiento
        );
      }

      // Aplicar agrupación si existe
      if (solicitud.agrupacion && solicitud.agrupacion.length > 0) {
        datos.datos = this.aplicarAgrupacion(datos.datos, solicitud.agrupacion);
      }

      // Generar reporte según formato
      let resultado: ResultadoReporte;

      if (solicitud.formato === "pdf") {
        resultado = await this.pdfService.generarPDFConPuppeteer(datos);
      } else {
        resultado = await this.excelService.generarExcel(datos);
      }

      // Guardar en caché si está habilitado
      if (reportesConfig.cache.habilitar && resultado.exito) {
        this.guardarEnCache(cacheKey, datos);
      }

      // Actualizar estadísticas
      this.actualizarEstadisticas(resultado, solicitud, usuarioGenerador);

      // Actualizar métricas
      this.actualizarMetricas(resultado, solicitud.tipo);

      if (resultado.exito && resultado.archivo) {
        logger.info(
          `Reporte ${solicitud.tipo} generado exitosamente en formato ${solicitud.formato}`
        );

        return {
          exito: true,
          mensaje: `Reporte ${solicitud.tipo} generado exitosamente`,
          datos: {
            archivo: {
              nombre: resultado.archivo.nombre,
              ruta: resultado.archivo.ruta,
              tamanio: resultado.archivo.tamanio,
              tipo: resultado.archivo.tipo,
              url:
                resultado.archivo.url ||
                `/uploads/reportes/${resultado.archivo.nombre}`,
            },
            metadatos: {
              tipo: solicitud.tipo,
              formato: solicitud.formato,
              fechaGeneracion: datos.fechaGeneracion,
              usuarioGenerador: datos.usuarioGenerador,
              tiempoGeneracion: resultado.tiempoGeneracion || 0,
              elementos: datos.datos.length,
              filtrosAplicados: solicitud.filtros?.length || 0,
              ordenamientoAplicado: solicitud.ordenamiento?.length || 0,
              agrupacionAplicada: solicitud.agrupacion?.length || 0,
            },
          },
        };
      } else {
        throw new Error(resultado.mensaje);
      }
    } catch (error) {
      logger.error("Error generando reporte:", error);

      // Actualizar métricas de error
      this.actualizarMetricasError(
        error instanceof Error ? error.message : "Error desconocido"
      );

      return {
        exito: false,
        mensaje: "Error generando reporte",
        errores: [error instanceof Error ? error.message : "Error desconocido"],
      };
    }
  }

  /**
   * Obtiene los datos para un tipo específico de reporte usando servicios establecidos
   */
  private async obtenerDatosReporteOptimizado(
    solicitud: SolicitudReporte,
    usuarioGenerador: string
  ): Promise<DatosReporte> {
    let datos: any[] = [];
    let totales: Record<string, any> = {};
    let graficos: any[] = [];

    const configuracion = obtenerConfiguracionReporte(solicitud.tipo);

    switch (solicitud.tipo) {
      case "usuarios":
        const respuestaUsuarios = await this.userService.getUsers(
          {},
          { page: 1, limit: 10000 }
        );
        datos = respuestaUsuarios.data;
        totales = this.calcularTotalesUsuarios(datos);
        graficos = this.generarGraficosUsuarios(datos);
        break;

      case "productos":
        const respuestaProductos = await this.productService.getProducts(
          {},
          { page: 1, limit: 10000 }
        );
        datos = respuestaProductos.data;
        totales = this.calcularTotalesProductos(datos);
        graficos = this.generarGraficosProductos(datos);
        break;

      case "archivos":
        datos = await this.obtenerDatosArchivosReales();
        totales = this.calcularTotalesArchivos(datos);
        graficos = this.generarGraficosArchivos(datos);
        break;

      case "emails":
        datos = await this.obtenerDatosEmailsReales();
        totales = this.calcularTotalesEmails(datos);
        graficos = this.generarGraficosEmails(datos);
        break;

      case "sistema":
        datos = await this.obtenerDatosSistemaReales();
        totales = this.calcularTotalesSistema(datos);
        graficos = this.generarGraficosSistema(datos);
        break;

      default:
        throw new Error(`Tipo de reporte no implementado: ${solicitud.tipo}`);
    }

    return {
      titulo:
        solicitud.personalizacion?.titulo ||
        configuracion?.nombre ||
        `Reporte de ${solicitud.tipo}`,
      descripcion:
        solicitud.personalizacion?.descripcion ||
        configuracion?.descripcion ||
        `Reporte detallado de ${solicitud.tipo}`,
      fechaGeneracion: new Date(),
      usuarioGenerador,
      datos,
      totales: solicitud.opciones?.incluirTotales ? totales : undefined,
      graficos: solicitud.opciones?.incluirGraficos ? graficos : undefined,
      metadatos: solicitud.opciones?.incluirMetadatos
        ? {
            tipo: solicitud.tipo,
            formato: solicitud.formato,
            filtros: solicitud.filtros?.length || 0,
            ordenamiento: solicitud.ordenamiento?.length || 0,
            agrupacion: solicitud.agrupacion?.length || 0,
            configuracion: configuracion,
          }
        : undefined,
    };
  }

  /**
   * Obtiene datos reales de archivos desde la base de datos
   */
  private async obtenerDatosArchivosReales(): Promise<any[]> {
    try {
      // Consulta directa a la base de datos para archivos
      const archivos = await prisma.$queryRaw`
        SELECT 
          id,
          nombre_original as nombre,
          tipo_mime as tipo,
          tamanio,
          fecha_subida as fechaSubida,
          usuario_id as usuarioId
        FROM archivos 
        WHERE eliminado = false
        ORDER BY fecha_subida DESC
      `;

      // Obtener información de usuarios para los archivos
      const archivosConUsuarios = await Promise.all(
        (archivos as any[]).map(async (archivo) => {
          const usuario = await prisma.user.findUnique({
            where: { id: archivo.usuarioId },
            select: { email: true, firstName: true, lastName: true },
          });

          return {
            ...archivo,
            usuario: usuario
              ? `${usuario.firstName} ${usuario.lastName} (${usuario.email})`
              : "Usuario no encontrado",
          };
        })
      );

      return archivosConUsuarios;
    } catch (error) {
      logger.error("Error obteniendo datos de archivos:", error);
      return [];
    }
  }

  /**
   * Obtiene datos reales de emails desde la base de datos
   */
  private async obtenerDatosEmailsReales(): Promise<any[]> {
    try {
      // Consulta directa a la base de datos para emails
      const emails = await prisma.$queryRaw`
        SELECT 
          id,
          destinatario,
          asunto,
          tipo,
          estado,
          fecha_envio as fechaEnvio,
          fecha_creacion as fechaCreacion
        FROM emails 
        ORDER BY fecha_envio DESC
        LIMIT 1000
      `;

      return emails as any[];
    } catch (error) {
      logger.error("Error obteniendo datos de emails:", error);
      return [];
    }
  }

  /**
   * Obtiene datos reales del sistema
   */
  private async obtenerDatosSistemaReales(): Promise<any[]> {
    try {
      const [
        totalUsuarios,
        usuariosActivos,
        totalProductos,
        productosDestacados,
        totalArchivos,
        tamanioTotalArchivos,
        totalEmails,
        emailsEnviados,
      ] = await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { isActive: true } }),
        prisma.product.count(),
        prisma.product.count({ where: { isFeatured: true } }),
        prisma.$queryRaw`SELECT COUNT(*) as total FROM archivos WHERE eliminado = false`,
        prisma.$queryRaw`SELECT COALESCE(SUM(tamanio), 0) as total FROM archivos WHERE eliminado = false`,
        prisma.$queryRaw`SELECT COUNT(*) as total FROM emails`,
        prisma.$queryRaw`SELECT COUNT(*) as total FROM emails WHERE estado = 'enviado'`,
      ]);

      return [
        {
          seccion: "Usuarios",
          total: totalUsuarios,
          activos: usuariosActivos,
          inactivos: totalUsuarios - usuariosActivos,
          fecha: new Date(),
        },
        {
          seccion: "Productos",
          total: totalProductos,
          destacados: productosDestacados,
          activos: await prisma.product.count({ where: { isActive: true } }),
          fecha: new Date(),
        },
        {
          seccion: "Archivos",
          total: (totalArchivos as any)[0]?.total || 0,
          tamanioTotal: (tamanioTotalArchivos as any)[0]?.total || 0,
          fecha: new Date(),
        },
        {
          seccion: "Emails",
          total: (totalEmails as any)[0]?.total || 0,
          enviados: (emailsEnviados as any)[0]?.total || 0,
          fecha: new Date(),
        },
      ];
    } catch (error) {
      logger.error("Error obteniendo datos del sistema:", error);
      return [];
    }
  }

  /**
   * Aplica filtros a los datos
   */
  private aplicarFiltros(datos: any[], filtros: FiltroReporte[]): any[] {
    return datos.filter((item) => {
      return filtros.every((filtro) => {
        const valor = item[filtro.campo];

        switch (filtro.operador) {
          case "igual":
            return valor === filtro.valor;
          case "contiene":
            return String(valor)
              .toLowerCase()
              .includes(String(filtro.valor).toLowerCase());
          case "mayor":
            return valor > filtro.valor;
          case "menor":
            return valor < filtro.valor;
          case "entre":
            return (
              valor >= filtro.valor && valor <= (filtro.valor2 || filtro.valor)
            );
          case "en":
            return Array.isArray(filtro.valor)
              ? filtro.valor.includes(valor)
              : false;
          default:
            return true;
        }
      });
    });
  }

  /**
   * Aplica ordenamiento a los datos
   */
  private aplicarOrdenamiento(
    datos: any[],
    ordenamiento: OrdenamientoReporte[]
  ): any[] {
    return datos.sort((a, b) => {
      for (const orden of ordenamiento) {
        const valorA = a[orden.campo];
        const valorB = b[orden.campo];

        if (valorA < valorB) return orden.direccion === "asc" ? -1 : 1;
        if (valorA > valorB) return orden.direccion === "asc" ? 1 : -1;
      }
      return 0;
    });
  }

  /**
   * Aplica agrupación a los datos
   */
  private aplicarAgrupacion(
    datos: any[],
    agrupacion: AgrupacionReporte[]
  ): any[] {
    const grupos = new Map<string, any[]>();

    datos.forEach((item) => {
      const claveGrupo = agrupacion.map((ag) => item[ag.campo]).join("|");
      if (!grupos.has(claveGrupo)) {
        grupos.set(claveGrupo, []);
      }
      grupos.get(claveGrupo)!.push(item);
    });

    return Array.from(grupos.entries()).map(([clave, items]) => {
      const valores = clave.split("|");
      const resultado: any = {};

      agrupacion.forEach((ag, index) => {
        resultado[ag.campo] = valores[index];
      });

      // Aplicar función de agrupación
      agrupacion.forEach((ag) => {
        const campoCalculado = `${ag.campo}_${ag.funcion}`;
        switch (ag.funcion) {
          case "count":
            resultado[campoCalculado] = items.length;
            break;
          case "sum":
            resultado[campoCalculado] = items.reduce(
              (sum, item) => sum + (Number(item[ag.campo]) || 0),
              0
            );
            break;
          case "avg":
            resultado[campoCalculado] =
              items.reduce(
                (sum, item) => sum + (Number(item[ag.campo]) || 0),
                0
              ) / items.length;
            break;
          case "min":
            resultado[campoCalculado] = Math.min(
              ...items.map((item) => Number(item[ag.campo]) || 0)
            );
            break;
          case "max":
            resultado[campoCalculado] = Math.max(
              ...items.map((item) => Number(item[ag.campo]) || 0)
            );
            break;
        }
      });

      return resultado;
    });
  }

  /**
   * Genera clave única para caché
   */
  private generarClaveCache(
    solicitud: SolicitudReporte,
    usuario: string
  ): string {
    const datos = {
      tipo: solicitud.tipo,
      formato: solicitud.formato,
      filtros: solicitud.filtros,
      ordenamiento: solicitud.ordenamiento,
      agrupacion: solicitud.agrupacion,
      opciones: solicitud.opciones,
      usuario,
    };
    return `reporte_${JSON.stringify(datos)}`;
  }

  /**
   * Obtiene datos del caché
   */
  private obtenerDeCache(clave: string): any | null {
    const entrada = this.cache.get(clave);
    if (!entrada) return null;

    const ahora = Date.now();
    if (ahora - entrada.timestamp > reportesConfig.cache.duracion * 1000) {
      this.cache.delete(clave);
      return null;
    }

    return entrada.datos;
  }

  /**
   * Guarda datos en caché
   */
  private guardarEnCache(clave: string, datos: any): void {
    this.cache.set(clave, {
      datos,
      timestamp: Date.now(),
    });
  }

  /**
   * Genera reporte desde caché
   */
  private async generarReporteDesdeCache(
    datos: DatosReporte,
    solicitud: SolicitudReporte,
    tiempoInicio: number
  ): Promise<RespuestaReporte> {
    let resultado: ResultadoReporte;

    if (solicitud.formato === "pdf") {
      resultado = await this.pdfService.generarPDFConPuppeteer(datos);
    } else {
      resultado = await this.excelService.generarExcel(datos);
    }

    if (resultado.exito && resultado.archivo) {
      return {
        exito: true,
        mensaje: `Reporte ${solicitud.tipo} generado exitosamente (desde caché)`,
        datos: {
          archivo: {
            nombre: resultado.archivo.nombre,
            ruta: resultado.archivo.ruta,
            tamanio: resultado.archivo.tamanio,
            tipo: resultado.archivo.tipo,
            url:
              resultado.archivo.url ||
              `/uploads/reportes/${resultado.archivo.nombre}`,
          },
          metadatos: {
            tipo: solicitud.tipo,
            formato: solicitud.formato,
            fechaGeneracion: datos.fechaGeneracion,
            usuarioGenerador: datos.usuarioGenerador,
            tiempoGeneracion: resultado.tiempoGeneracion || 0,
            elementos: datos.datos.length,
            desdeCache: true,
          },
        },
      };
    } else {
      throw new Error(resultado.mensaje);
    }
  }

  /**
   * Inicia limpieza automática de caché
   */
  private iniciarLimpiezaCache(): void {
    setInterval(() => {
      const ahora = Date.now();
      let eliminados = 0;

      for (const [clave, entrada] of this.cache.entries()) {
        if (ahora - entrada.timestamp > reportesConfig.cache.duracion * 1000) {
          this.cache.delete(clave);
          eliminados++;
        }
      }

      if (eliminados > 0) {
        logger.info(
          `Limpieza de caché completada: ${eliminados} entradas eliminadas`
        );
      }
    }, 60000); // Cada minuto
  }

  /**
   * Calcula totales para usuarios optimizado
   */
  private calcularTotalesUsuarios(datos: any[]): Record<string, any> {
    const totales = datos.reduce(
      (acc, user) => {
        acc.totalUsuarios++;
        acc.usuariosPorRol[user.role] =
          (acc.usuariosPorRol[user.role] || 0) + 1;
        if (user.isActive) acc.usuariosActivos++;
        if (user.emailVerified) acc.usuariosVerificados++;
        return acc;
      },
      {
        totalUsuarios: 0,
        usuariosActivos: 0,
        usuariosVerificados: 0,
        usuariosPorRol: {} as Record<string, number>,
      }
    );

    return totales;
  }

  /**
   * Calcula totales para productos optimizado
   */
  private calcularTotalesProductos(datos: any[]): Record<string, any> {
    const totales = datos.reduce(
      (acc, p) => {
        acc.totalProductos++;
        acc.valorTotal += Number(p.price) * p.stock;
        acc.stockTotal += p.stock;
        if (p.isFeatured) acc.productosDestacados++;
        if (p.isActive) acc.productosActivos++;
        acc.productosPorCategoria[p.category] =
          (acc.productosPorCategoria[p.category] || 0) + 1;
        return acc;
      },
      {
        totalProductos: 0,
        valorTotal: 0,
        stockTotal: 0,
        productosDestacados: 0,
        productosActivos: 0,
        productosPorCategoria: {} as Record<string, number>,
      }
    );

    return totales;
  }

  /**
   * Calcula totales para archivos optimizado
   */
  private calcularTotalesArchivos(datos: any[]): Record<string, any> {
    const totales = datos.reduce(
      (acc, a) => {
        acc.totalArchivos++;
        acc.tamanioTotal += Number(a.tamanio) || 0;
        acc.tiposArchivo[a.tipo] = (acc.tiposArchivo[a.tipo] || 0) + 1;
        return acc;
      },
      {
        totalArchivos: 0,
        tamanioTotal: 0,
        tamanioPromedio: 0,
        tiposArchivo: {} as Record<string, number>,
      }
    );

    totales.tamanioPromedio =
      totales.totalArchivos > 0
        ? totales.tamanioTotal / totales.totalArchivos
        : 0;
    return totales;
  }

  /**
   * Calcula totales para emails optimizado
   */
  private calcularTotalesEmails(datos: any[]): Record<string, any> {
    const totales = datos.reduce(
      (acc, e) => {
        acc.totalEmails++;
        if (e.estado === "enviado") acc.emailsEnviados++;
        acc.tiposEmail[e.tipo] = (acc.tiposEmail[e.tipo] || 0) + 1;
        return acc;
      },
      {
        totalEmails: 0,
        emailsEnviados: 0,
        tasaExito: 0,
        tiposEmail: {} as Record<string, number>,
      }
    );

    totales.tasaExito =
      totales.totalEmails > 0
        ? (totales.emailsEnviados / totales.totalEmails) * 100
        : 0;
    return totales;
  }

  /**
   * Calcula totales para sistema optimizado
   */
  private calcularTotalesSistema(datos: any[]): Record<string, any> {
    const totales = datos.reduce(
      (acc, d) => {
        acc.totalSecciones++;
        acc.totalElementos += Number(d.total) || 0;
        return acc;
      },
      {
        totalSecciones: 0,
        totalElementos: 0,
        promedioElementosPorSeccion: 0,
      }
    );

    totales.promedioElementosPorSeccion =
      totales.totalSecciones > 0
        ? totales.totalElementos / totales.totalSecciones
        : 0;
    return totales;
  }

  /**
   * Genera gráficos para usuarios optimizado
   */
  private generarGraficosUsuarios(datos: any[]): any[] {
    const usuariosPorRol = datos.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const usuariosPorEstado = datos.reduce((acc, user) => {
      acc[user.isActive ? "Activos" : "Inactivos"] =
        (acc[user.isActive ? "Activos" : "Inactivos"] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return [
      {
        tipo: "pie",
        titulo: "Usuarios por Rol",
        datos: {
          etiquetas: Object.keys(usuariosPorRol),
          valores: Object.values(usuariosPorRol),
        },
      },
      {
        tipo: "doughnut",
        titulo: "Usuarios por Estado",
        datos: {
          etiquetas: Object.keys(usuariosPorEstado),
          valores: Object.values(usuariosPorEstado),
        },
      },
    ];
  }

  /**
   * Genera gráficos para productos optimizado
   */
  private generarGraficosProductos(datos: any[]): any[] {
    const productosPorCategoria = datos.reduce((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const productosPorEstado = datos.reduce((acc, p) => {
      acc[p.isActive ? "Activos" : "Inactivos"] =
        (acc[p.isActive ? "Activos" : "Inactivos"] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return [
      {
        tipo: "bar",
        titulo: "Productos por Categoría",
        datos: {
          etiquetas: Object.keys(productosPorCategoria),
          valores: Object.values(productosPorCategoria),
        },
      },
      {
        tipo: "pie",
        titulo: "Productos por Estado",
        datos: {
          etiquetas: Object.keys(productosPorEstado),
          valores: Object.values(productosPorEstado),
        },
      },
    ];
  }

  /**
   * Genera gráficos para archivos optimizado
   */
  private generarGraficosArchivos(datos: any[]): any[] {
    const archivosPorTipo = datos.reduce((acc, a) => {
      acc[a.tipo] = (acc[a.tipo] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const archivosPorTamanio = datos.reduce((acc, a) => {
      const tamanioMB = Math.round((Number(a.tamanio) || 0) / (1024 * 1024));
      if (tamanioMB < 1) acc["< 1MB"] = (acc["< 1MB"] || 0) + 1;
      else if (tamanioMB < 5) acc["1-5MB"] = (acc["1-5MB"] || 0) + 1;
      else if (tamanioMB < 10) acc["5-10MB"] = (acc["5-10MB"] || 0) + 1;
      else acc["> 10MB"] = (acc["> 10MB"] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return [
      {
        tipo: "doughnut",
        titulo: "Archivos por Tipo",
        datos: {
          etiquetas: Object.keys(archivosPorTipo),
          valores: Object.values(archivosPorTipo),
        },
      },
      {
        tipo: "bar",
        titulo: "Archivos por Tamaño",
        datos: {
          etiquetas: Object.keys(archivosPorTamanio),
          valores: Object.values(archivosPorTamanio),
        },
      },
    ];
  }

  /**
   * Genera gráficos para emails optimizado
   */
  private generarGraficosEmails(datos: any[]): any[] {
    const emailsPorTipo = datos.reduce((acc, e) => {
      acc[e.tipo] = (acc[e.tipo] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const emailsPorEstado = datos.reduce((acc, e) => {
      acc[e.estado] = (acc[e.estado] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return [
      {
        tipo: "pie",
        titulo: "Emails por Tipo",
        datos: {
          etiquetas: Object.keys(emailsPorTipo),
          valores: Object.values(emailsPorTipo),
        },
      },
      {
        tipo: "doughnut",
        titulo: "Emails por Estado",
        datos: {
          etiquetas: Object.keys(emailsPorEstado),
          valores: Object.values(emailsPorEstado),
        },
      },
    ];
  }

  /**
   * Genera gráficos para sistema optimizado
   */
  private generarGraficosSistema(datos: any[]): any[] {
    return [
      {
        tipo: "bar",
        titulo: "Elementos por Sección",
        datos: {
          etiquetas: datos.map((d) => d.seccion),
          valores: datos.map((d) => d.total),
        },
      },
      {
        tipo: "line",
        titulo: "Distribución del Sistema",
        datos: {
          etiquetas: datos.map((d) => d.seccion),
          valores: datos.map((d) => d.total),
        },
      },
    ];
  }

  /**
   * Actualiza estadísticas del servicio
   */
  private actualizarEstadisticas(
    resultado: ResultadoReporte,
    solicitud: SolicitudReporte,
    usuario: string
  ): void {
    this.estadisticas.totalGenerados++;

    // Por tipo
    this.estadisticas.porTipo[solicitud.tipo] =
      (this.estadisticas.porTipo[solicitud.tipo] || 0) + 1;

    // Por formato
    this.estadisticas.porFormato[solicitud.formato] =
      (this.estadisticas.porFormato[solicitud.formato] || 0) + 1;

    // Por usuario
    this.estadisticas.porUsuario[usuario] =
      (this.estadisticas.porUsuario[usuario] || 0) + 1;

    // Tamaño promedio
    if (resultado.archivo) {
      const totalTamanio =
        this.estadisticas.tamanioPromedio *
          (this.estadisticas.totalGenerados - 1) +
        resultado.archivo.tamanio;
      this.estadisticas.tamanioPromedio =
        totalTamanio / this.estadisticas.totalGenerados;
    }

    // Tiempo promedio
    if (resultado.tiempoGeneracion) {
      const totalTiempo =
        this.estadisticas.tiempoPromedio *
          (this.estadisticas.totalGenerados - 1) +
        resultado.tiempoGeneracion;
      this.estadisticas.tiempoPromedio =
        totalTiempo / this.estadisticas.totalGenerados;
    }

    if (!resultado.exito) {
      this.estadisticas.errores++;
    }
  }

  /**
   * Actualiza métricas del servicio
   */
  private actualizarMetricas(resultado: ResultadoReporte, tipo: string): void {
    this.metricas.totalGenerados++;

    if (resultado.exito) {
      this.metricas.exitosos++;
    } else {
      this.metricas.fallidos++;
    }

    if (resultado.tiempoGeneracion) {
      const totalTiempo =
        this.metricas.tiempoPromedio * (this.metricas.totalGenerados - 1) +
        resultado.tiempoGeneracion;
      this.metricas.tiempoPromedio = totalTiempo / this.metricas.totalGenerados;
    }

    if (resultado.archivo) {
      const totalTamanio =
        this.metricas.tamanioPromedio * (this.metricas.totalGenerados - 1) +
        resultado.archivo.tamanio;
      this.metricas.tamanioPromedio =
        totalTamanio / this.metricas.totalGenerados;
    }

    // Actualizar tipos más usados
    const tipoIndex = this.metricas.tiposMasUsados.findIndex(
      (t) => t.tipo === tipo
    );
    if (tipoIndex >= 0) {
      this.metricas.tiposMasUsados[tipoIndex].cantidad++;
    } else {
      this.metricas.tiposMasUsados.push({ tipo, cantidad: 1 });
    }

    // Ordenar por cantidad
    this.metricas.tiposMasUsados.sort((a, b) => b.cantidad - a.cantidad);
  }

  /**
   * Actualiza métricas de error
   */
  private actualizarMetricasError(error: string): void {
    const errorIndex = this.metricas.erroresComunes.findIndex(
      (e) => e.error === error
    );
    if (errorIndex >= 0) {
      this.metricas.erroresComunes[errorIndex].frecuencia++;
    } else {
      this.metricas.erroresComunes.push({ error, frecuencia: 1 });
    }

    // Ordenar por frecuencia
    this.metricas.erroresComunes.sort((a, b) => b.frecuencia - a.frecuencia);
  }

  /**
   * Obtiene estadísticas del servicio
   */
  getEstadisticas(): EstadisticasReporte {
    return { ...this.estadisticas };
  }

  /**
   * Obtiene métricas del servicio
   */
  getMetricas(): MetricasReporte {
    return { ...this.metricas };
  }

  /**
   * Obtiene tipos de reporte disponibles
   */
  getTiposDisponibles(): string[] {
    return ["usuarios", "productos", "archivos", "emails", "sistema"];
  }

  /**
   * Limpia archivos temporales
   */
  async limpiarArchivosTemporales(): Promise<{ pdf: any; excel: any }> {
    const pdf = await this.pdfService.limpiarArchivosTemporales();
    const excel = await this.excelService.limpiarArchivosTemporales();

    return { pdf, excel };
  }

  /**
   * Cierra recursos del servicio
   */
  async cerrar(): Promise<void> {
    await this.pdfService.cerrarNavegador();
  }
}
