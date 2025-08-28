import { Request, Response } from "express";
import { BaseController } from "../BaseController";
import { CtArticuloBaseService } from "../../services/inventario/ct_articulo.service";
import {
  CrearCtArticuloInput,
  ActualizarCtArticuloInput,
  ctArticuloIdParamSchema,
  CtArticuloIdParam,
} from "../../schemas/inventario/ct_articulo.schema";
import { PaginationInput } from "../../schemas/commonSchemas";

//TODO ===== CONTROLADOR PARA CT_ARTICULO CON BASE SERVICE =====
const ctArticuloBaseService = new CtArticuloBaseService();

export class CtArticuloBaseController extends BaseController {
  /**
   * 📦 Crear nuevo artículo
   * @route POST /api/inventario/articulo
   */
  crearArticulo = async (req: Request, res: Response): Promise<void> => {
    await this.manejarCreacion(
      req,
      res,
      async () => {
        const articuloData: CrearCtArticuloInput = req.body;
        return await ctArticuloBaseService.crear(articuloData);
      },
      "Artículo creado exitosamente"
    );
  };

  /**
   * 📦 Obtener artículo por ID
   * @route GET /api/inventario/articulo/:id_articulo
   */
  obtenerArticuloPorId = async (req: Request, res: Response): Promise<void> => {
    await this.manejarOperacion(
      req,
      res,
      async () => {
        const { id_articulo } = this.validarDatosConEsquema<CtArticuloIdParam>(
          ctArticuloIdParamSchema,
          req.params
        );

        return await ctArticuloBaseService.obtenerPorId(id_articulo);
      },
      "Artículo obtenido exitosamente"
    );
  };

  obtenerTodosLosArticulos = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    await this.manejarListaPaginada(
      req,
      res,
      async () => {
        const filters = req.query as any;
        const pagination: PaginationInput = req.query as any;

        return await ctArticuloBaseService.obtenerTodos(filters, pagination);
      },
      "Artículos obtenidos exitosamente"
    );
  };

  /**
   * 📦 Actualizar artículo
   * @route PUT /api/inventario/articulo/:id_articulo
   */
  actualizarArticulo = async (req: Request, res: Response): Promise<void> => {
    await this.manejarActualizacion(
      req,
      res,
      async () => {
        const { id_articulo } = this.validarDatosConEsquema<CtArticuloIdParam>(
          ctArticuloIdParamSchema,
          req.params
        );
        const articuloData: ActualizarCtArticuloInput = req.body;

        return await ctArticuloBaseService.actualizar(
          id_articulo,
          articuloData
        );
      },
      "Artículo actualizado exitosamente"
    );
  };

  /**
   * 📦 Eliminar artículo
   * @route DELETE /api/inventario/articulo/:id_articulo
   */
  eliminarArticulo = async (req: Request, res: Response): Promise<void> => {
    await this.manejarEliminacion(
      req,
      res,
      async () => {
        const { id_articulo } = this.validarDatosConEsquema<CtArticuloIdParam>(
          ctArticuloIdParamSchema,
          req.params
        );

        await ctArticuloBaseService.eliminar(id_articulo);
      },
      "Artículo eliminado exitosamente"
    );
  };

  // ========== ENDPOINTS DE REPORTES ==========

  /**
   * 📄 Generar reporte PDF de artículos por jerarquía
   * @route GET /api/inventario/articulo/reporte/jerarquia/:id_jerarquia/pdf
   * @param id_jerarquia ID de la jerarquía
   * @returns Archivo PDF con el reporte de artículos
   */
  generarReportePDFPorJerarquia = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const idJerarquia = parseInt(req.params.id_jerarquia, 10);

      if (!idJerarquia || idJerarquia <= 0) {
        res.status(400).json({
          exito: false,
          mensaje: "ID de jerarquía inválido",
          datos: null,
          meta: {
            codigoEstado: 400,
            fechaHora: new Date().toISOString(),
          },
        });
        return;
      }

      // Obtener artículos con información completa
      const articulos =
        await ctArticuloBaseService.obtenerArticulosParaReportePorJerarquia(
          idJerarquia
        );

      if (articulos.length === 0) {
        res.status(404).json({
          exito: false,
          mensaje: `No se encontraron artículos para la jerarquía ${idJerarquia}`,
          datos: null,
          meta: {
            codigoEstado: 404,
            fechaHora: new Date().toISOString(),
          },
        });
        return;
      }

      // Preparar datos para el reporte en formato DatosReporte
      const articulosFormateados = articulos.map((articulo: any) => ({
        id_articulo: articulo.id_articulo,
        folio: articulo.folio || "N/A",
        folio_nuevo: articulo.folio_nuevo || "N/A",
        no_serie: articulo.no_serie || "N/A",
        modelo: articulo.modelo || "N/A",
        estatus: this.obtenerTextoEstatus(articulo.estatus),
        observaciones: articulo.observaciones || "Sin observaciones",
        cct: articulo.cct || "N/A",
        marca: articulo.ct_inventario_marca?.descripcion || "Sin marca",
        color: articulo.ct_inventario_color?.descripcion || "Sin color",
        material:
          articulo.ct_inventario_material?.descripcion || "Sin material",
        proveedor:
          articulo.ct_inventario_proveedor?.descripcion || "Sin proveedor",
        subclase:
          articulo.ct_inventario_subclase?.descripcion || "Sin subclase",
        estado_fisico:
          articulo.ct_inventario_estado_fisico?.descripcion || "Sin estado",
        accion: articulo.ct_accion?.descripcion || "Sin acción",
        fecha_alta: articulo.fecha_alta
          ? new Date(articulo.fecha_alta).toLocaleDateString("es-ES")
          : "N/A",
        fecha_baja: articulo.fecha_baja
          ? new Date(articulo.fecha_baja).toLocaleDateString("es-ES")
          : "N/A",
      }));

      const datosReporte = {
        titulo: `Reporte de Artículos - Jerarquía ${idJerarquia}`,
        descripcion: `Inventario de artículos correspondientes a la jerarquía ${idJerarquia}`,
        fechaGeneracion: new Date(),
        usuarioGenerador: "Sistema", // Aquí podrías obtener el usuario autenticado
        datos: articulosFormateados, // Usar el formato correcto para DatosReporte
        totales: {
          totalArticulos: articulos.length,
        },
        metadatos: {
          idJerarquia: idJerarquia,
          jerarquiaInfo: articulos[0]?.rl_infraestructura_jerarquia || null,
        },
      };

      // Preparar configuración del PDF
      const configuracionPDF = {
        formato: "A4" as const,
        orientacion: "landscape" as const,
        margenes: {
          superior: 20,
          inferior: 20,
          izquierdo: 15,
          derecho: 15,
        },
        encabezado: {
          mostrar: false,
        },
        piePagina: {
          mostrar: false,
        },
      };

      // Generar PDF
      const { PDFService } = require("../../services/pdfService");
      const pdfService = new PDFService();

      const resultado = await pdfService.generarPDFConPuppeteer(
        datosReporte,
        configuracionPDF
      );
      console.log("Resultado PDF:", resultado);
      const pdfBuffer = resultado.buffer;

      // Configurar headers de respuesta
      const nombreArchivo = `articulos_jerarquia_${idJerarquia}_${
        new Date().toISOString().split("T")[0]
      }.pdf`;

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${nombreArchivo}"`
      );
      res.setHeader("Content-Length", pdfBuffer.length);

      // Enviar el PDF
      res.send(pdfBuffer);
    } catch (error) {
      console.error("Error generando reporte PDF:", error);
      res.status(500).json({
        exito: false,
        mensaje: "Error interno al generar reporte PDF",
        datos: null,
        meta: {
          codigoEstado: 500,
          fechaHora: new Date().toISOString(),
          detalle: error instanceof Error ? error.message : "Error desconocido",
        },
      });
    }
  };

  /**
   * Convierte el código de estatus a texto legible
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
