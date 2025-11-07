import { PrismaClient } from "@prisma/client";
import {
  DatosReporteInventario,
  FiltrosReporteInventario,
  RespuestaReporteInventario,
  ArticuloReporte,
} from "../../interfaces/inventario/reporte.interfaces";
import { enviarRespuestaExitosa } from "../../utils/responseUtils";

const prisma = new PrismaClient();

export class ReporteInventarioService {
  /**
   * Genera reporte de inventario por unidad
   */
  async generarReportePorUnidad(
    filtros: FiltrosReporteInventario
  ): Promise<RespuestaReporteInventario> {
    try {
      // Validar filtros
      if (!filtros.id_rl_infraestructura_jerarquia && !filtros.cct) {
        throw new Error(
          "Debe especificar una unidad (id_rl_infraestructura_jerarquia o cct)"
        );
      }

      // Obtener información de la unidad
      const unidad = await this.obtenerInformacionUnidad(filtros);
      if (!unidad) {
        throw new Error("Unidad no encontrada");
      }

      // Obtener artículos de la unidad
      const articulos = await this.obtenerArticulosPorUnidad(filtros);

      // Formatear datos del reporte
      const datosReporte: DatosReporteInventario = {
        direccion: "DIRECCION DE EDUCACION BASICA SEPE-USET",
        departamento: unidad.departamento || "DEPARTAMENTO NO ESPECIFICADO",
        subjefatura: unidad.subjefatura || "SUBJEFATURA NO ESPECIFICADA",
        nombre: unidad.nombre || "RESPONSABLE NO ASIGNADO",
        cct: unidad.cct || "CCT NO ASIGNADO",
        fecha: new Date().toLocaleDateString("es-MX"),
        articulos: this.formatearArticulos(articulos),
        totalArticulos: articulos.length,
      };

      return {
        exito: true,
        mensaje: "Reporte de inventario generado exitosamente",
        datos: datosReporte,
        meta: {
          codigoEstado: 200,
          fechaHora: new Date().toISOString(),
        },
      };
    } catch (error) {
      console.error("Error generando reporte de inventario:", error);
      throw new Error(
        error instanceof Error ? error.message : "Error desconocido"
      );
    }
  }

  /**
   * Obtiene información de la unidad
   */
  private async obtenerInformacionUnidad(filtros: FiltrosReporteInventario) {
    const whereClause: any = {
      estado: true,
    };

    if (filtros.id_rl_infraestructura_jerarquia) {
      whereClause.id_rl_infraestructura_jerarquia =
        filtros.id_rl_infraestructura_jerarquia;
    }

    const unidad = await prisma.rl_infraestructura_jerarquia.findFirst({
      where: whereClause,
      include: {
        ct_infraestructura_tipo_instancia: true,
      },
    });

    if (!unidad) return null;

    // Por ahora usamos datos mock, después se pueden obtener de otras tablas
    return {
      departamento: "DEPARTAMENTO DE RECURSOS MATERIALES Y SERVICIOS",
      subjefatura: "SUBJEFATURA DE BIENES MUEBLES E INMUEBLES",
      nombre: "RESPONSABLE DE INVENTARIO",
      cct: filtros.cct || "29PPR0103C",
    };
  }

  /**
   * Obtiene artículos de la unidad
   */
  private async obtenerArticulosPorUnidad(filtros: FiltrosReporteInventario) {
    const whereClause: any = {
      estado: filtros.incluirInactivos ? undefined : true,
    };

    if (filtros.id_rl_infraestructura_jerarquia) {
      whereClause.id_rl_infraestructura_jerarquia =
        filtros.id_rl_infraestructura_jerarquia;
    }

    if (filtros.cct) {
      whereClause.cct = filtros.cct;
    }

    const articulos = await prisma.dt_inventario_articulo.findMany({
      where: whereClause,
      include: {
        ct_inventario_tipo_articulo: true,
        ct_inventario_marca: true,
        ct_inventario_material: true,
      },
      orderBy: [{ folio: "asc" }],
    });

    return articulos;
  }

  /**
   * Formatea los artículos para el reporte
   */
  private formatearArticulos(articulos: any[]): ArticuloReporte[] {
    return articulos.map((articulo, index) => ({
      contador: index + 1,
      folio: articulo.folio || "SIN FOLIO",
      tipoArticulo:
        articulo.ct_inventario_tipo_articulo?.nombre || "NO ESPECIFICADO",
      marca: articulo.ct_inventario_marca?.nombre || "SIN MARCA",
      modelo: articulo.modelo || "S/M",
      serie: articulo.no_serie || "S/N",
      observaciones: articulo.observaciones || "SIN OBSERVACIONES",
      material: articulo.ct_inventario_material?.nombre || "NO ESPECIFICADO",
    }));
  }

  /**
   * Obtiene estadísticas del reporte
   */
  async obtenerEstadisticasReporte(filtros: FiltrosReporteInventario) {
    const whereClause: any = {
      estado: filtros.incluirInactivos ? undefined : true,
    };

    if (filtros.id_rl_infraestructura_jerarquia) {
      whereClause.id_rl_infraestructura_jerarquia =
        filtros.id_rl_infraestructura_jerarquia;
    }

    if (filtros.cct) {
      whereClause.cct = filtros.cct;
    }

    const total = await prisma.dt_inventario_articulo.count({
      where: whereClause,
    });

    const porTipo = await prisma.dt_inventario_articulo.groupBy({
      by: ["id_ct_inventario_tipo_articulo"],
      where: whereClause,
      _count: true,
    });

    return {
      totalArticulos: total,
      porTipo: porTipo.map((item) => ({
        tipo: `Tipo ${item.id_ct_inventario_tipo_articulo}`,
        cantidad: item._count,
      })),
    };
  }
}

export default new ReporteInventarioService();
