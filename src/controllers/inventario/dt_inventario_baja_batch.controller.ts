import { Request, Response, NextFunction } from "express";
import inventarioBajaBatchService from "../../services/inventario/dt_inventario_baja_batch.service";
import {
  crearBajaMasivaSchema,
  validarArchivoBajaSchema,
} from "../../schemas/inventario/dt_inventario_baja_batch.schema";
import { enviarRespuestaExitosa } from "../../utils/responseUtils";
import { createError } from "../../middleware/errorHandler";
import logger from "../../config/logger";

/**
 * 🎯 CONTROLADOR PARA BAJA MASIVA DE INVENTARIO
 *
 * Maneja las peticiones HTTP para el proceso de baja masiva
 * de artículos de inventario
 *
 * 📋 RESPONSABILIDADES:
 * - Validar request (archivo + datos)
 * - Parsear y validar datos con Zod
 * - Invocar servicio de baja masiva
 * - Retornar respuesta normalizada
 * - Manejo de errores robusto
 */

class InventarioBajaBatchController {
  /**
   * 🎯 CREAR BAJA MASIVA
   *
   * Endpoint: POST /api/inventario/baja/batch
   * Content-Type: multipart/form-data
   *
   * Body:
   * - archivo: PDF (archivo binario)
   * - data: JSON stringificado con los datos de la baja
   *
   * @param req - Request con FormData
   * @param res - Response
   * @param next - NextFunction
   */
  async crearBajaMasiva(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("🎯 ===== CONTROLADOR BAJA MASIVA =====");
      console.log("📦 req.file:", req.file ? "✅ EXISTE" : "❌ NO EXISTE");
      console.log("📦 req.body:", req.body);
      console.log(
        "📦 req.body.data:",
        req.body.data ? "✅ EXISTE" : "❌ NO EXISTE"
      );
      console.log("=====================================");

      // ➕ 1. VALIDAR QUE EXISTA EL ARCHIVO
      if (!req.file) {
        throw createError("El archivo PDF es requerido", 400);
      }

      // ➕ 2. VALIDAR ARCHIVO CON ZOD
      const archivoValidado = validarArchivoBajaSchema.parse({
        mimetype: req.file.mimetype,
        size: req.file.size,
        originalname: req.file.originalname,
      });

      // ➕ 3. VALIDAR QUE EXISTAN LOS DATOS
      if (!req.body.data) {
        throw createError(
          "El campo 'data' con los datos de la baja es requerido",
          400
        );
      }

      // ➕ 4. PARSEAR DATOS JSON
      let datosBaja;
      try {
        datosBaja = JSON.parse(req.body.data);
      } catch (error) {
        throw createError("El campo 'data' debe ser un JSON válido", 400);
      }

      // ➕ 5. AGREGAR ARCHIVO SIN PROCESAR A LOS DATOS
      const datosCompletos = {
        ...datosBaja,
        archivo: req.file, // Pasar el archivo sin procesar
      };

      // ➕ 6. VALIDAR DATOS COMPLETOS CON ZOD
      const datosValidados = crearBajaMasivaSchema.parse(datosCompletos);

      // ➕ 7. OBTENER DATOS DEL USUARIO AUTENTICADO
      console.log("🔍 DEBUG AUTENTICACIÓN:");
      console.log("   req.user:", (req as any).user);
      console.log("   req.headers.authorization:", req.headers.authorization);

      const userId = (req as any).user?.id_ct_usuario;
      const sessionId = parseInt((req as any).user?.id_sesion);

      console.log("   userId:", userId);
      console.log("   sessionId:", sessionId);

      if (!userId) {
        throw createError("Usuario no autenticado", 401);
      }

      // ➕ 8. INVOCAR SERVICIO DE BAJA MASIVA
      const resultado = await inventarioBajaBatchService.crearBatch(
        datosValidados,
        userId,
        sessionId
      );

      // ➕ 9. RETORNAR RESPUESTA EXITOSA
      return enviarRespuestaExitosa(res, {
        datos: resultado.data,
        mensaje: "Baja masiva creada exitosamente",
        codigoEstado: 201,
      });
    } catch (error) {
      // ⚠️ MANEJO DE ERRORES DE VALIDACIÓN ZOD
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

      // ⚠️ OTROS ERRORES
      next(error);
    }
  }
}

// Exportar instancia única del controlador
export default new InventarioBajaBatchController();

/*
🎉 CONTROLADOR DE BAJA MASIVA DE INVENTARIO

✅ Características:
- 📄 Maneja multipart/form-data (archivo + JSON)
- 🔒 Requiere autenticación JWT
- 🛡️ Validación con Zod (archivo + datos)
- 📝 Logging completo para debug
- ⚠️ Manejo robusto de errores
- ✅ Respuesta normalizada

📋 Body esperado:
```json
{
  "archivo": <archivo PDF>,
  "data": {
    "id_ct_inventario_baja": 1,
    "observaciones": "Artículos dañados",
    "articulos": [
      { "id_dt_inventario_articulo": 123 },
      { "id_dt_inventario_articulo": 124 }
    ]
  }
}
```

🎯 Uso:
```typescript
router.post(
  "/baja/batch",
  authMiddleware,
  upload.single("archivo"),
  (req, res, next) => controller.crearBajaMasiva(req, res, next)
);
```
*/
