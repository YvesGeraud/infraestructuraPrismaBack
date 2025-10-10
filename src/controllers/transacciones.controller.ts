/**
 * 🔄 CONTROLADOR DE TRANSACCIONES
 *
 * Maneja endpoints para operaciones complejas multi-tabla
 */

import { Request, Response } from "express";
import { BaseController } from "./BaseController";
import { TransaccionesService } from "../services/transacciones.service";
import {
  TransferirLocalidadesInput,
  ImportarEstructuraGeograficaInput,
  ActualizacionMasivaInput,
} from "../schemas/transacciones.schema";

export class TransaccionesController extends BaseController {
  private transaccionesService: TransaccionesService;

  constructor() {
    super();
    this.transaccionesService = new TransaccionesService();
  }

  /**
   * 🔄 Transferir múltiples localidades a otro municipio
   * @route POST /api/transacciones/localidades/transferir
   *
   * Body esperado:
   * {
   *   "idsLocalidades": [1, 10, 150, 1600],
   *   "idMunicipioDestino": 2,
   *   "observaciones": "Reasignación territorial"
   * }
   *
   * Respuesta exitosa:
   * {
   *   "exito": true,
   *   "mensaje": "4 localidades transferidas...",
   *   "datos": {
   *     "totalActualizadas": 4,
   *     "municipioDestino": { ... },
   *     "localidades": [ ... ]
   *   }
   * }
   */
  transferirLocalidades = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    await this.manejarOperacion(
      req,
      res,
      async () => {
        const datosTransferencia: TransferirLocalidadesInput = req.body;

        // Obtener usuario autenticado (lo pone authMiddleware)
        const idUsuario = (req as any).user?.id_ct_usuario;

        if (!idUsuario) {
          throw new Error("Usuario no autenticado");
        }

        const resultado = await this.transaccionesService.transferirLocalidades(
          datosTransferencia,
          idUsuario
        );

        return resultado;
      },
      `${
        req.body.idsLocalidades?.length || 0
      } localidades transferidas exitosamente`
    );
  };

  /**
   * 📥 Importar estructura geográfica completa
   * @route POST /api/transacciones/geografia/importar
   *
   * Body esperado:
   * {
   *   "entidad": { "nombre": "Tlaxcala", "abreviatura": "TLAX" },
   *   "municipios": [
   *     {
   *       "cve_mun": "001",
   *       "nombre": "Tlaxcala",
   *       "localidades": [
   *         { "nombre": "Tlaxcala Centro", "ambito": "U" }
   *       ]
   *     }
   *   ],
   *   "idUsuario": 1
   * }
   */
  importarEstructuraGeografica = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    await this.manejarCreacion(
      req,
      res,
      async () => {
        const datosImportacion: ImportarEstructuraGeograficaInput = req.body;

        const resultado =
          await this.transaccionesService.importarEstructuraGeografica(
            datosImportacion
          );

        return resultado;
      },
      `Estructura geográfica importada exitosamente`
    );
  };

  /**
   * 🔄 Actualización masiva genérica
   * @route POST /api/transacciones/actualizar-masivo
   *
   * Body esperado:
   * {
   *   "tabla": "LOCALIDAD",
   *   "ids": [1, 2, 3],
   *   "cambios": { "ambito": "U", "estado": true },
   *   "observaciones": "Actualización masiva de ámbito"
   * }
   */
  actualizacionMasiva = async (req: Request, res: Response): Promise<void> => {
    await this.manejarOperacion(
      req,
      res,
      async () => {
        const datosActualizacion: ActualizacionMasivaInput = req.body;

        const idUsuario = (req as any).user?.id_ct_usuario;

        if (!idUsuario) {
          throw new Error("Usuario no autenticado");
        }

        const resultado = await this.transaccionesService.actualizacionMasiva(
          datosActualizacion,
          idUsuario
        );

        return resultado;
      },
      `Actualización masiva completada`
    );
  };
}

/*
📝 RESPONSABILIDADES DEL CONTROLADOR:

✅ QUÉ HACE:
1. Valida datos de entrada (con middleware validarRequest + Zod)
2. Extrae información del request (usuario autenticado, params, body)
3. Llama al servicio correspondiente
4. Formatea y envía la respuesta

❌ QUÉ NO HACE:
1. Lógica de negocio (eso va en el servicio)
2. Acceso directo a Prisma (usa el servicio)
3. Manejo de transacciones (eso va en el servicio)

🔄 FLUJO COMPLETO:
1. Frontend envía POST con datos
2. authMiddleware verifica JWT → req.user
3. validarRequest valida con Zod
4. Controlador extrae datos y usuario
5. Controlador llama al servicio
6. Servicio ejecuta transacción
7. Controlador retorna respuesta normalizada

🎯 EJEMPLO DE USO DESDE FRONTEND:

// Angular Service
transferirLocalidades(datos: any) {
  return this.http.post('/api/transacciones/localidades/transferir', datos);
}

// Componente
this.service.transferirLocalidades({
  idsLocalidades: [1, 10, 150, 1600],
  idMunicipioDestino: 2,
  observaciones: 'Cambio territorial'
}).subscribe({
  next: (resp) => console.log('✅', resp.datos.totalActualizadas),
  error: (err) => console.error('❌ Rollback automático')
});
*/
