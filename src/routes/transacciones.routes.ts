/**
 * 🔄 RUTAS PARA OPERACIONES TRANSACCIONALES
 *
 * Endpoints para operaciones complejas que cruzan múltiples tablas
 */

import { Router } from "express";
import { TransaccionesController } from "../controllers/transacciones.controller";
import { validarRequest } from "../middleware/validacion";
import {
  transferirLocalidadesSchema,
  importarEstructuraGeograficaSchema,
  actualizacionMasivaSchema,
} from "../schemas/transacciones.schema";

const router = Router();
const controller = new TransaccionesController();

// ===========================================
// 🔄 TRANSFERENCIAS
// ===========================================

/**
 * Transferir múltiples localidades a otro municipio
 * POST /api/transacciones/localidades/transferir
 *
 * Body:
 * {
 *   "idsLocalidades": [1, 10, 150, 1600],
 *   "idMunicipioDestino": 2,
 *   "observaciones": "Motivo del cambio"
 * }
 *
 * Respuesta:
 * {
 *   "exito": true,
 *   "mensaje": "4 localidades transferidas exitosamente",
 *   "datos": {
 *     "totalActualizadas": 4,
 *     "municipioDestino": { id, nombre, cve_mun },
 *     "localidades": [ ... ]
 *   }
 * }
 */
router.post(
  "/localidades/transferir",
  validarRequest({ body: transferirLocalidadesSchema }),
  controller.transferirLocalidades
);

// ===========================================
// 📥 IMPORTACIONES
// ===========================================

/**
 * Importar estructura geográfica completa
 * POST /api/transacciones/geografia/importar
 *
 * Body:
 * {
 *   "entidad": { "nombre": "...", "abreviatura": "..." },
 *   "municipios": [
 *     {
 *       "cve_mun": "001",
 *       "nombre": "...",
 *       "localidades": [ ... ]
 *     }
 *   ],
 *   "idUsuario": 1
 * }
 */
router.post(
  "/geografia/importar",
  validarRequest({ body: importarEstructuraGeograficaSchema }),
  controller.importarEstructuraGeografica
);

// ===========================================
// 🔄 ACTUALIZACIONES MASIVAS
// ===========================================

/**
 * Actualización masiva genérica
 * POST /api/transacciones/actualizar-masivo
 *
 * Body:
 * {
 *   "tabla": "LOCALIDAD",
 *   "ids": [1, 2, 3],
 *   "cambios": { "ambito": "U" },
 *   "observaciones": "..."
 * }
 */
router.post(
  "/actualizar-masivo",
  validarRequest({ body: actualizacionMasivaSchema }),
  controller.actualizacionMasiva
);

export default router;

/*
🎉 API TRANSACCIONAL COMPLETA:

POST /api/transacciones/localidades/transferir   - Transferir localidades
POST /api/transacciones/geografia/importar       - Importar estructura completa
POST /api/transacciones/actualizar-masivo        - Actualización masiva genérica

📋 ORDEN DE RUTAS:
⚠️ IMPORTANTE: Las rutas más específicas van ANTES de las genéricas
Ejemplo:
  ✅ /localidades/transferir (específica primero)
  ✅ /geografia/importar
  ✅ /:id (genérica al final)

🔒 SEGURIDAD:
- Todas las rutas requieren validación con Zod (validarRequest)
- El authMiddleware se debe aplicar en el index.ts principal
- Los datos se validan ANTES de llegar al controlador

🏗️ REGISTRO EN INDEX:
Para activar estas rutas, agregar en /routes/index.ts:

```typescript
import transaccionesRoutes from './transacciones.routes';

// Aplicar autenticación a todas las rutas de transacciones
router.use('/transacciones', authMiddleware, transaccionesRoutes);
```

🎯 EJEMPLO DE USO DESDE FRONTEND:

```typescript
// Angular Service
export class TransaccionesService {
  private apiUrl = `${environment.apiUrl}/transacciones`;

  transferirLocalidades(datos: any) {
    return this.http.post(`${this.apiUrl}/localidades/transferir`, datos);
  }

  importarGeografia(datos: any) {
    return this.http.post(`${this.apiUrl}/geografia/importar`, datos);
  }
}

// En el componente
this.transaccionesService.transferirLocalidades({
  idsLocalidades: [1, 10, 150, 1600],
  idMunicipioDestino: 2,
  observaciones: 'Reasignación territorial'
}).subscribe({
  next: (resp) => {
    console.log(`✅ ${resp.datos.totalActualizadas} localidades transferidas`);
  },
  error: (err) => {
    console.error('❌ Error: nada se cambió (rollback automático)');
  }
});
```

🔄 FLUJO COMPLETO:
1. Frontend envía POST /api/transacciones/localidades/transferir
2. authMiddleware verifica JWT
3. validarRequest valida datos con Zod
4. Controller extrae datos y llama al servicio
5. Service ejecuta transacción (actualiza + bitácora)
6. Si falla algo → ROLLBACK automático
7. Controller retorna respuesta normalizada
*/
