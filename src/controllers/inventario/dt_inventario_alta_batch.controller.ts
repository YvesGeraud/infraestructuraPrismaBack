import { Request, Response, NextFunction } from "express";
import inventarioAltaBatchService from "../../services/inventario/dt_inventario_alta_batch.service";
import { crearAltaMasivaSchema } from "../../schemas/inventario/dt_inventario_alta_batch.schema";
import { createError } from "../../middleware/errorHandler";
import { enviarRespuestaExitosa } from "../../utils/responseUtils";

/**
 * 🎯 CONTROLADOR PARA ALTA MASIVA DE INVENTARIO
 *
 * Maneja las peticiones HTTP para el proceso de alta masiva,
 * validando datos y coordinando con el servicio orquestador.
 */

export class InventarioAltaBatchController {
  /**
   * 🚀 CREAR ALTA MASIVA DE INVENTARIO
   *
   * POST /api/inventario/alta/batch
   * Content-Type: multipart/form-data
   *
   * Body:
   * - data: JSON (string) con los datos del alta y artículos
   * - archivo: File (PDF)
   *
   * @example
   * ```typescript
   * const formData = new FormData();
   * formData.append('data', JSON.stringify({
   *   id_ct_inventario_alta: 1,
   *   observaciones: "Alta por compra directa",
   *   articulos: [{ ... }]
   * }));
   * formData.append('archivo', pdfFile);
   * ```
   */
  async crearAltaMasiva(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("🎯 ===== CONTROLADOR ALTA MASIVA =====");
      console.log("📦 req.file:", req.file ? "✅ EXISTE" : "❌ NO EXISTE");
      console.log("📦 req.body:", req.body);
      console.log(
        "📦 req.body.data:",
        req.body.data ? "✅ EXISTE" : "❌ NO EXISTE"
      );
      console.log("=====================================");

      // 🔍 1. VALIDAR QUE EXISTE EL ARCHIVO
      if (!req.file) {
        throw createError("Debe adjuntar un archivo PDF", 400);
      }

      // 🔍 2. VALIDAR QUE EXISTE EL BODY CON DATA
      if (!req.body.data) {
        throw createError(
          "Debe enviar los datos del alta en el campo 'data'",
          400
        );
      }

      // 🔄 3. PARSEAR EL JSON DEL BODY
      let datosAlta;
      try {
        datosAlta = JSON.parse(req.body.data);
      } catch (error) {
        throw createError("El campo 'data' debe ser un JSON válido", 400);
      }

      // ➕ 4. AGREGAR ARCHIVO SIN PROCESAR A LOS DATOS
      const datosCompletos = {
        ...datosAlta,
        archivo: req.file, // Pasar el archivo sin procesar
      };

      // ✅ 6. VALIDAR DATOS CON ZOD
      const datosValidados = crearAltaMasivaSchema.parse(datosCompletos);

      // 🔐 7. OBTENER ID DEL USUARIO Y SESIÓN DEL JWT
      console.log("🔍 DEBUG AUTENTICACIÓN:");
      console.log("   req.user:", (req as any).user);
      console.log("   req.headers.authorization:", req.headers.authorization);

      const userId = (req as any).user?.id_ct_usuario;
      const sessionId = parseInt((req as any).user?.id_sesion /* || "1"*/); // Convertir a number

      console.log("   userId:", userId);
      console.log("   sessionId:", sessionId);

      if (!userId) {
        throw createError("Usuario no autenticado", 401);
      }

      // 🚀 8. EJECUTAR EL PROCESO DE ALTA MASIVA CON BITÁCORA
      const resultado = await inventarioAltaBatchService.crearBatch(
        datosValidados,
        userId,
        sessionId
      );

      // ✨ 9. RETORNAR RESPUESTA EXITOSA
      return enviarRespuestaExitosa(res, {
        datos: resultado.data,
        mensaje: resultado.message,
        codigoEstado: 201,
      });
    } catch (error) {
      // 🔥 MANEJO DE ERRORES

      // Si hay un archivo subido y ocurre un error, intentar eliminarlo
      if (req.file && req.body.archivo?.ruta_archivo) {
        await inventarioAltaBatchService.eliminarArchivoPdf(
          req.body.archivo.ruta_archivo
        );
      }

      // Error de validación de Zod
      if (error instanceof Error && error.name === "ZodError") {
        const zodError = error as any;
        const errores = (zodError.errors || []).map((e: any) => ({
          campo: e.path.join("."),
          mensaje: e.message,
        }));
        const err = createError("Errores de validación", 400);
        (err as any).errores = errores;
        return next(err);
      }

      // Pasar el error al middleware de errores
      next(error);
    }
  }

  /**
   * 📊 OBTENER DETALLE DE UN ALTA
   *
   * GET /api/inventario/alta/batch/:id
   */
  async obtenerDetalleAlta(req: Request, res: Response, next: NextFunction) {
    try {
      const idAlta = parseInt(req.params.id);

      if (isNaN(idAlta) || idAlta <= 0) {
        throw createError("ID de alta inválido", 400);
      }

      const resultado = await inventarioAltaBatchService.obtenerDetalleAlta(
        idAlta
      );

      return enviarRespuestaExitosa(res, {
        datos: resultado.data,
        mensaje: "Detalle del alta obtenido exitosamente",
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 📋 LISTAR ALTAS
   *
   * GET /api/inventario/alta/batch
   *
   * Query params:
   * - pagina: number (default: 1)
   * - limite: number (default: 10)
   * - id_ct_inventario_alta: number (opcional)
   * - estado: boolean (opcional)
   */
  async listarAltas(req: Request, res: Response, next: NextFunction) {
    try {
      const filtros = {
        pagina: req.query.pagina ? parseInt(req.query.pagina as string) : 1,
        limite: req.query.limite ? parseInt(req.query.limite as string) : 10,
        id_ct_inventario_alta: req.query.id_ct_inventario_alta
          ? parseInt(req.query.id_ct_inventario_alta as string)
          : undefined,
        estado:
          req.query.estado !== undefined
            ? req.query.estado === "true"
            : undefined,
      };

      const resultado = await inventarioAltaBatchService.listarAltas(filtros);

      return enviarRespuestaExitosa(res, {
        datos: resultado.data,
        mensaje: "Altas obtenidas exitosamente",
        metaAdicional: resultado.paginacion,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new InventarioAltaBatchController();

/*
🎉 CONTROLADOR DE ALTA MASIVA DE INVENTARIO

✅ Características:
- 📤 Manejo de multipart/form-data
- 📄 Procesamiento de archivos PDF
- ✅ Validación con Zod
- 🔐 Autenticación JWT
- 🛡️ Manejo robusto de errores
- 🔙 Limpieza de archivos en caso de error

🔧 Endpoints:
- POST /api/inventario/alta/batch - Crear alta masiva
- GET /api/inventario/alta/batch/:id - Obtener detalle
- GET /api/inventario/alta/batch - Listar altas

📝 Formato del request (multipart/form-data):
- data: JSON string con id_ct_inventario_alta, observaciones y articulos
- archivo: PDF file

🔐 Requiere autenticación JWT en el header:
Authorization: Bearer <token>
*/
