# 🏗️ Arquitectura de Transacciones

## 📋 Índice

1. [Filosofía](#filosofía)
2. [Estructura de Archivos](#estructura-de-archivos)
3. [Cuándo usar cada patrón](#cuándo-usar-cada-patrón)
4. [Ejemplo Completo](#ejemplo-completo)
5. [Registro de Rutas](#registro-de-rutas)
6. [Testing](#testing)

---

## 🎯 Filosofía

### Separación de Responsabilidades

```
Servicios por Tabla (Simples)          Servicio de Transacciones (Complejo)
─────────────────────────              ────────────────────────────────────
ct_localidad.service.ts                transacciones.service.ts
ct_municipio.service.ts
ct_entidad.service.ts

✅ CRUD estándar                       ✅ Operaciones multi-tabla
✅ Una tabla a la vez                  ✅ Transacciones complejas
✅ Extienden BaseService               ✅ Importaciones masivas
✅ Mantenibles y simples               ✅ Operaciones coordinadas
```

### Ventajas de esta Arquitectura

1. **✅ Servicios por tabla más limpios y simples**

   - Solo se enfocan en su tabla
   - Fáciles de entender y mantener
   - Heredan funcionalidad de BaseService

2. **✅ Operaciones complejas centralizadas**

   - Fácil encontrar transacciones complejas
   - Sirven como ejemplos para el equipo
   - Documentación en un solo lugar

3. **✅ Escalable**
   - Agregar nuevas transacciones es fácil
   - No contamina los servicios por tabla
   - Patrón claro y consistente

---

## 📁 Estructura de Archivos

```
backend/src/
├── schemas/
│   ├── ct_localidad.schema.ts           ← CRUD de localidad
│   ├── ct_municipio.schema.ts           ← CRUD de municipio
│   └── transacciones.schema.ts          ← ✨ Operaciones multi-tabla
│
├── services/
│   ├── ct_localidad.service.ts          ← CRUD de localidad
│   ├── ct_municipio.service.ts          ← CRUD de municipio
│   ├── BaseService.ts                   ← Base con transacciones
│   └── transacciones.service.ts         ← ✨ Operaciones complejas
│
├── controllers/
│   ├── ct_localidad.controller.ts       ← Endpoints CRUD localidad
│   ├── ct_municipio.controller.ts       ← Endpoints CRUD municipio
│   └── transacciones.controller.ts      ← ✨ Endpoints complejos
│
└── routes/
    ├── ct_localidad.route.ts            ← Rutas CRUD localidad
    ├── ct_municipio.route.ts            ← Rutas CRUD municipio
    ├── transacciones.routes.ts          ← ✨ Rutas transaccionales
    └── index.ts                         ← Registro de todas las rutas
```

---

## 🎯 Cuándo usar cada patrón

### ✅ Usar Servicio por Tabla

**Para operaciones de UNA sola tabla:**

```typescript
// ct_localidad.service.ts
export class CtLocalidadBaseService extends BaseService<...> {
  // ✅ Crear una localidad
  // ✅ Actualizar una localidad
  // ✅ Eliminar una localidad
  // ✅ Buscar localidades

  // Ya heredado de BaseService:
  // - crear()
  // - actualizar()
  // - eliminar()
  // - obtenerTodos()
  // - obtenerPorId()
}
```

**Endpoints:**

```
GET    /api/ct_localidad              ← Listar
GET    /api/ct_localidad/:id          ← Obtener uno
POST   /api/ct_localidad              ← Crear
PUT    /api/ct_localidad/:id          ← Actualizar
DELETE /api/ct_localidad/:id          ← Eliminar
```

### ✅ Usar Servicio de Transacciones

**Para operaciones de MÚLTIPLES tablas:**

```typescript
// transacciones.service.ts
export class TransaccionesService {
  // ✅ Transferir localidades (ct_localidad + dt_bitacora)
  // ✅ Importar geografía (ct_entidad + ct_municipio + ct_localidad)
  // ✅ Operaciones que cruzan tablas

  async transferirLocalidades(datos, idUsuario) {
    return await prisma.$transaction(async (tx) => {
      // Actualiza localidades
      // Registra en bitácora
      // TODO en una transacción atómica
    });
  }
}
```

**Endpoints:**

```
POST /api/transacciones/localidades/transferir   ← Operación compleja
POST /api/transacciones/geografia/importar       ← Importación masiva
POST /api/transacciones/actualizar-masivo        ← Actualización coordinada
```

---

## 💡 Ejemplo Completo

### Caso: Transferir Localidades entre Municipios

#### 1. Schema (Validación)

```typescript
// schemas/transacciones.schema.ts
export const transferirLocalidadesSchema = z.object({
  idsLocalidades: z.array(z.number()).min(1).max(1000),
  idMunicipioDestino: z.number().positive(),
  observaciones: z.string().min(10).max(500).optional(),
});
```

#### 2. Servicio (Lógica + Transacción)

```typescript
// services/transacciones.service.ts
export class TransaccionesService {
  async transferirLocalidades(datos, idUsuario) {
    return await prisma.$transaction(async (tx) => {
      // 1. Validar municipio destino
      const municipio = await tx.ct_municipio.findUnique({...});

      // 2. Obtener localidades actuales
      const localidades = await tx.ct_localidad.findMany({...});

      // 3. Actualizar cada localidad
      for (const loc of localidades) {
        await tx.ct_localidad.update({...});

        // 4. Registrar en bitácora
        await tx.dt_bitacora.create({...});
      }

      // 5. Retornar resultado
      return { totalActualizadas, ... };
    });
  }
}
```

#### 3. Controlador (Orquestación)

```typescript
// controllers/transacciones.controller.ts
export class TransaccionesController extends BaseController {
  transferirLocalidades = async (req, res) => {
    await this.manejarOperacion(
      req,
      res,
      async () => {
        const datos: TransferirLocalidadesInput = req.body;
        const idUsuario = req.user.id_ct_usuario;

        return await this.transaccionesService.transferirLocalidades(
          datos,
          idUsuario
        );
      },
      "Localidades transferidas exitosamente"
    );
  };
}
```

#### 4. Rutas (Endpoints)

```typescript
// routes/transacciones.routes.ts
router.post(
  "/localidades/transferir",
  validarRequest({ body: transferirLocalidadesSchema }),
  controller.transferirLocalidades
);
```

#### 5. Frontend (Angular)

```typescript
// services/transacciones.service.ts
@Injectable({ providedIn: "root" })
export class TransaccionesService {
  transferirLocalidades(datos: {
    idsLocalidades: number[];
    idMunicipioDestino: number;
    observaciones?: string;
  }) {
    return this.http.post("/api/transacciones/localidades/transferir", datos);
  }
}

// En el componente
this.transaccionesService
  .transferirLocalidades({
    idsLocalidades: [1, 10, 150, 1600],
    idMunicipioDestino: 2,
    observaciones: "Reasignación territorial",
  })
  .subscribe({
    next: (resp) => console.log("✅", resp.datos.totalActualizadas),
    error: (err) => console.error("❌ Rollback automático"),
  });
```

---

## 🔌 Registro de Rutas

Para activar las rutas de transacciones, agregar en `/routes/index.ts`:

```typescript
import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";

// Importar rutas
import ctLocalidadRoutes from "./ct_localidad.route";
import ctMunicipioRoutes from "./ct_municipio.route";
import transaccionesRoutes from "./transacciones.routes";

const router = Router();

// Rutas por tabla (CRUD)
router.use("/ct_localidad", authMiddleware, ctLocalidadRoutes);
router.use("/ct_municipio", authMiddleware, ctMunicipioRoutes);

// Rutas de transacciones (operaciones complejas)
router.use("/transacciones", authMiddleware, transaccionesRoutes);

export default router;
```

### Endpoints Resultantes

```
# CRUD Estándar
GET    /api/ct_localidad              ← Listar localidades
POST   /api/ct_localidad              ← Crear localidad
PUT    /api/ct_localidad/:id          ← Actualizar localidad
DELETE /api/ct_localidad/:id          ← Eliminar localidad

# Operaciones Transaccionales
POST   /api/transacciones/localidades/transferir   ← Transferir
POST   /api/transacciones/geografia/importar       ← Importar
POST   /api/transacciones/actualizar-masivo        ← Actualizar masivo
```

---

## 🧪 Testing

### Probar con Postman/Thunder Client

```http
POST http://localhost:3000/api/transacciones/localidades/transferir
Authorization: Bearer TU_TOKEN_JWT
Content-Type: application/json

{
  "idsLocalidades": [1, 2, 3],
  "idMunicipioDestino": 5,
  "observaciones": "Prueba de transferencia desde Postman"
}
```

### Respuesta Exitosa

```json
{
  "exito": true,
  "mensaje": "3 localidades transferidas exitosamente",
  "datos": {
    "totalActualizadas": 3,
    "municipioDestino": {
      "id": 5,
      "nombre": "Apizaco",
      "cve_mun": "002"
    },
    "localidades": [
      { "id_ct_localidad": 1, "nombre": "...", ... },
      { "id_ct_localidad": 2, "nombre": "...", ... },
      { "id_ct_localidad": 3, "nombre": "...", ... }
    ]
  }
}
```

### Verificar en Base de Datos

```sql
-- Ver localidades actualizadas
SELECT
  l.id_ct_localidad,
  l.nombre,
  l.id_ct_municipio,
  m.nombre AS municipio_nuevo
FROM ct_localidad l
JOIN ct_municipio m ON l.id_ct_municipio = m.id_ct_municipio
WHERE l.id_ct_localidad IN (1, 2, 3);

-- Ver registros en bitácora
SELECT *
FROM dt_bitacora
WHERE tabla = 'LOCALIDAD'
  AND accion = 'TRANSFERENCIA'
ORDER BY fecha DESC
LIMIT 10;
```

---

## 📝 Checklist de Implementación

Cuando agregues una nueva operación transaccional:

- [ ] ¿Afecta múltiples tablas? → Usa servicio de transacciones
- [ ] ¿Es CRUD de una tabla? → Usa servicio por tabla
- [ ] Crear schema de validación en `transacciones.schema.ts`
- [ ] Crear método en `transacciones.service.ts` con `prisma.$transaction`
- [ ] Crear endpoint en `transacciones.controller.ts`
- [ ] Agregar ruta en `transacciones.routes.ts`
- [ ] Documentar el uso en este archivo
- [ ] Probar con Postman
- [ ] Verificar rollback (probar con datos inválidos)
- [ ] Crear servicio Angular para consumir el endpoint

---

## 🎯 Conclusión

**Regla de Oro:**

> Una tabla = Servicio por tabla (CRUD simple)
>
> Múltiples tablas = Servicio de transacciones (operación compleja)

**Ventajas:**

- ✅ Código más organizado y mantenible
- ✅ Servicios por tabla simples y enfocados
- ✅ Transacciones centralizadas y documentadas
- ✅ Fácil de escalar y extender
- ✅ Sirve como referencia para el equipo

**Recuerda:**

- BaseService tiene métodos de transacciones disponibles
- Las transacciones SE EJECUTAN EN EL SERVICIO, no en el controlador
- El frontend hace UNA petición con todos los datos
- Si algo falla, TODO se revierte automáticamente (rollback)
