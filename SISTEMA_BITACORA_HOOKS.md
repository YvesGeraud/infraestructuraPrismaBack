# 📝 Sistema de Bitácora con Hooks en BaseService

## 📋 Índice

1. [Introducción](#introducción)
2. [¿Cómo Funciona?](#cómo-funciona)
3. [Activar Bitácora en un Servicio](#activar-bitácora-en-un-servicio)
4. [Ejemplo Completo](#ejemplo-completo)
5. [Estructura de la Tabla dt_bitacora](#estructura-de-la-tabla-dt_bitacora)
6. [Ventajas del Sistema](#ventajas-del-sistema)
7. [Testing y Verificación](#testing-y-verificación)

---

## 🎯 Introducción

El sistema de bitácora está **integrado directamente en BaseService** usando el patrón de **Hooks opcionales (opt-in)**.

### ¿Qué significa esto?

- ✅ **Por defecto**: Los servicios NO registran en bitácora
- ✅ **Opt-in**: Solo activas bitácora en los servicios que lo necesiten
- ✅ **Automático**: Una vez activado, el registro es automático
- ✅ **Transaccional**: Garantiza atomicidad (si falla bitácora, se hace rollback de TODO)

---

## 🔧 ¿Cómo Funciona?

### Flujo de Operaciones CRUD con Bitácora

```
┌─────────────────────────────────────────────────────────┐
│  Usuario llama: localidadService.crear(datos)          │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  BaseService.crear() inicia TRANSACCIÓN                │
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
        ▼                         ▼
┌──────────────┐         ┌─────────────────┐
│ 1. Validar   │         │ Si todo OK:     │
│ 2. Crear     │────────►│ COMMIT          │
│ 3. Bitácora? │         │                 │
│    (si está  │         │ Si falla algo:  │
│     activada)│         │ ROLLBACK        │
└──────────────┘         └─────────────────┘
```

### Componentes del Sistema

```typescript
// 1️⃣ BANDERA DE ACTIVACIÓN (en cada servicio)
protected registrarEnBitacora = false; // Por defecto OFF

// 2️⃣ HOOKS IMPLEMENTABLES (override en servicios específicos)
protected async registrarCreacionEnBitacora(datos, resultado, tx) { }
protected async registrarActualizacionEnBitacora(id, datos, datosAnteriores, resultado, tx) { }
protected async registrarEliminacionEnBitacora(id, datosAnteriores, registroEliminado, idUsuario, tx) { }

// 3️⃣ MÉTODOS CRUD MODIFICADOS (BaseService)
async crear()     // ← Llama a registrarCreacionEnBitacora si está activado
async actualizar() // ← Llama a registrarActualizacionEnBitacora si está activado
async eliminar()   // ← Llama a registrarEliminacionEnBitacora si está activado
```

---

## 🚀 Activar Bitácora en un Servicio

### ✨ Super Simple: Solo 2 líneas

```typescript
// ct_localidad.service.ts

export class CtLocalidadBaseService extends BaseService<...> {
  protected config = {
    tableName: "ct_localidad",
    defaultOrderBy: { id_ct_localidad: "asc" as const },
    campoActivo: "estado",
  };

  // ✅ ACTIVAR BITÁCORA (solo 2 líneas)
  protected registrarEnBitacora = true;
  protected nombreTablaParaBitacora = "LOCALIDAD";

  // ... resto del código ...
}
```

### ¡Listo! 🎉

**Eso es TODO.** BaseService automáticamente:

- ✅ Captura datos antes/después de cada cambio
- ✅ Registra en `dt_bitacora` dentro de la misma transacción
- ✅ Hace rollback si falla la bitácora
- ✅ Genera observaciones legibles automáticamente
- ✅ Excluye campos sensibles (contraseñas, tokens, etc.)

Ahora **TODOS los CRUD registrarán automáticamente en bitácora**:

```typescript
// Crear localidad
await localidadService.crear({
  nombre: "Nueva Localidad",
  ambito: "U",
  id_ct_municipio: 5,
  id_ct_usuario_in: 123,
});
// ✅ Registro automático en dt_bitacora

// Actualizar localidad
await localidadService.actualizar(10, {
  nombre: "Nombre Actualizado",
  id_ct_usuario_up: 123,
});
// ✅ Registro automático en dt_bitacora

// Eliminar (soft delete) localidad
await localidadService.eliminar(10, 123);
// ✅ Registro automático en dt_bitacora
```

---

## 💡 Ejemplo Completo

Ver archivo: `backend/src/services/ct_localidad.service.ts`

El ejemplo está **comentado** al final del archivo. Para activarlo:

1. Descomentar las 2 líneas de bitácora
2. ¡Listo!

```typescript
// Líneas 113-114 en ct_localidad.service.ts (comentadas)
// protected registrarEnBitacora = true;
// protected nombreTablaParaBitacora = "LOCALIDAD";
```

---

## 🗄️ Estructura de la Tabla dt_bitacora

### Esquema Esperado

```prisma
model dt_bitacora {
  id_dt_bitacora    Int       @id @default(autoincrement())
  tabla             String    // "LOCALIDAD", "MUNICIPIO", etc.
  accion            String    // "CREATE", "UPDATE", "DELETE"
  id_registro       Int       // ID del registro afectado
  datos_anteriores  Json?     // Estado anterior (null en CREATE)
  datos_nuevos      Json      // Estado nuevo
  id_ct_usuario     Int       // Usuario que ejecutó la acción
  observaciones     String?   // Descripción legible
  fecha             DateTime  @default(now())

  // Relación opcional con usuario
  ct_usuario        ct_usuario @relation(fields: [id_ct_usuario], references: [id_ct_usuario])
}
```

### Ejemplo de Registro en Bitácora

#### CREATE

```json
{
  "tabla": "LOCALIDAD",
  "accion": "CREATE",
  "id_registro": 150,
  "datos_anteriores": null,
  "datos_nuevos": {
    "nombre": "San Miguel",
    "ambito": "U",
    "id_ct_municipio": 5
  },
  "id_ct_usuario": 123,
  "observaciones": "Localidad \"San Miguel\" creada",
  "fecha": "2025-10-10T10:30:00.000Z"
}
```

#### UPDATE

```json
{
  "tabla": "LOCALIDAD",
  "accion": "UPDATE",
  "id_registro": 150,
  "datos_anteriores": {
    "nombre": "San Miguel",
    "ambito": "U",
    "id_ct_municipio": 5
  },
  "datos_nuevos": {
    "nombre": "San Miguel de Allende",
    "ambito": "U",
    "id_ct_municipio": 8
  },
  "id_ct_usuario": 123,
  "observaciones": "Localidad \"San Miguel de Allende\" actualizada",
  "fecha": "2025-10-10T11:45:00.000Z"
}
```

#### DELETE (Soft Delete)

```json
{
  "tabla": "LOCALIDAD",
  "accion": "DELETE",
  "id_registro": 150,
  "datos_anteriores": {
    "nombre": "San Miguel de Allende",
    "ambito": "U",
    "estado": true
  },
  "datos_nuevos": {
    "estado": false
  },
  "id_ct_usuario": 123,
  "observaciones": "Localidad \"San Miguel de Allende\" desactivada",
  "fecha": "2025-10-10T14:20:00.000Z"
}
```

---

## ✅ Ventajas del Sistema

### 1. **Opt-in (No Invasivo)**

```typescript
// Servicio SIN bitácora (por defecto)
export class CtEntidadService extends BaseService<...> {
  // No activas nada, no implementas nada
  // ✅ CRUD funciona normalmente
}

// Servicio CON bitácora
export class CtLocalidadService extends BaseService<...> {
  protected registrarEnBitacora = true; // ← Solo esta línea + hooks
  // ✅ CRUD + bitácora automática
}
```

### 2. **Transaccional (ACID)**

```typescript
await localidadService.crear({ ... }); // Operación atómica:
// ✅ Si crear() falla → No se registra en bitácora
// ✅ Si bitácora falla → Se hace ROLLBACK del crear()
// ✅ Si ambos OK → COMMIT de ambos
```

### 3. **Captura Automática de Cambios**

```typescript
// BaseService automáticamente:
// 1. Captura datos ANTES del cambio
// 2. Ejecuta el cambio
// 3. Captura datos DESPUÉS del cambio
// 4. Pasa TODO a tu hook de bitácora
```

### 4. **Flexible por Servicio**

```typescript
// En localidades: Registrar nombre, ámbito, municipio
protected async registrarCreacionEnBitacora(datos, resultado, tx) {
  datos_nuevos: {
    nombre: resultado.nombre,
    ambito: resultado.ambito,
    id_ct_municipio: resultado.id_ct_municipio,
  }
}

// En usuarios: Registrar email, rol, estado
protected async registrarCreacionEnBitacora(datos, resultado, tx) {
  datos_nuevos: {
    email: resultado.email,
    rol: resultado.rol,
    estado: resultado.estado,
  }
}
```

### 5. **No Rompe Servicios Existentes**

```typescript
// Servicios existentes siguen funcionando SIN cambios
// Solo servicios nuevos o que TÚ DECIDAS, activan bitácora
```

---

## 🧪 Testing y Verificación

### 1. Crear una Localidad

```typescript
const resultado = await localidadService.crear({
  nombre: "Test Localidad",
  ambito: "U",
  id_ct_municipio: 5,
  id_ct_usuario_in: 123,
  estado: true,
  fecha_in: new Date(),
});

console.log("Localidad creada:", resultado.id_ct_localidad);
```

### 2. Verificar en Base de Datos

```sql
-- Ver registro en bitácora
SELECT * FROM dt_bitacora
WHERE tabla = 'LOCALIDAD'
  AND accion = 'CREATE'
  AND id_registro = 150  -- ID de la localidad creada
ORDER BY fecha DESC
LIMIT 1;
```

**Resultado esperado:**

```
+----------------+-----------+--------+-------------+-------------------+------------------------------------------+---------------+---------------------+
| id_dt_bitacora | tabla     | accion | id_registro | datos_anteriores  | datos_nuevos                             | id_ct_usuario | fecha               |
+----------------+-----------+--------+-------------+-------------------+------------------------------------------+---------------+---------------------+
| 1              | LOCALIDAD | CREATE | 150         | null              | {"nombre":"Test Localidad","ambito":"U"} | 123           | 2025-10-10 10:30:00 |
+----------------+-----------+--------+-------------+-------------------+------------------------------------------+---------------+---------------------+
```

### 3. Actualizar la Localidad

```typescript
await localidadService.actualizar(150, {
  nombre: "Test Localidad EDITADA",
  id_ct_usuario_up: 123,
});
```

### 4. Verificar Cambio en Bitácora

```sql
SELECT * FROM dt_bitacora
WHERE tabla = 'LOCALIDAD'
  AND accion = 'UPDATE'
  AND id_registro = 150
ORDER BY fecha DESC
LIMIT 1;
```

**Resultado esperado:**

```
+----------------+-----------+--------+-------------+--------------------------------+---------------------------------------------+---------------+---------------------+
| id_dt_bitacora | tabla     | accion | id_registro | datos_anteriores               | datos_nuevos                                | id_ct_usuario | fecha               |
+----------------+-----------+--------+-------------+--------------------------------+---------------------------------------------+---------------+---------------------+
| 2              | LOCALIDAD | UPDATE | 150         | {"nombre":"Test Localidad"}    | {"nombre":"Test Localidad EDITADA"}         | 123           | 2025-10-10 11:00:00 |
+----------------+-----------+--------+-------------+--------------------------------+---------------------------------------------+---------------+---------------------+
```

### 5. Probar Rollback (Transacción)

```typescript
// Forzar error en bitácora (pasar datos inválidos)
protected async registrarCreacionEnBitacora(datos, resultado, tx) {
  await tx.dt_bitacora.create({
    data: {
      // ❌ Falta campo obligatorio 'tabla'
      accion: "CREATE",
      // ...
    }
  });
}

// Resultado:
// ❌ Falla bitácora → ROLLBACK automático
// ✅ Localidad NO se crea (rollback completo)
```

---

## 📝 Checklist de Implementación

Cuando vayas a activar bitácora en un servicio:

**Preparación (solo una vez):**

- [ ] ¿Ya tienes la tabla `dt_bitacora` en Prisma?
- [ ] ¿Ya ejecutaste las migraciones?

**Activación por servicio (2 líneas):**

- [ ] ¿Agregaste `protected registrarEnBitacora = true;`?
- [ ] ¿Agregaste `protected nombreTablaParaBitacora = "NOMBRE_TABLA";`?

**Testing:**

- [ ] ¿Probaste CREATE y verificaste en BD?
- [ ] ¿Probaste UPDATE y verificaste en BD?
- [ ] ¿Probaste DELETE y verificaste en BD?
- [ ] ¿Probaste rollback (forzar error en bitácora)?

**Opcional (solo si necesitas personalizar):**

- [ ] ¿Necesitas excluir campos adicionales? → Sobrescribe `camposExcluidosBitacora`
- [ ] ¿Necesitas lógica personalizada? → Sobrescribe los métodos `registrar*EnBitacora()`

---

## 🎯 Resumen

| Aspecto                 | Descripción                                                                               |
| ----------------------- | ----------------------------------------------------------------------------------------- |
| **Activación**          | ✨ **Solo 2 líneas**: `registrarEnBitacora = true` + `nombreTablaParaBitacora = "NOMBRE"` |
| **Hooks a implementar** | ✅ **NINGUNO** - Todo es automático (opcional si quieres personalizar)                    |
| **Transaccional**       | ✅ Sí - Atomicidad garantizada                                                            |
| **Automático**          | ✅ Captura TODO automáticamente (datos antes/después, observaciones, fechas)              |
| **Opt-in**              | ✅ Solo servicios que TÚ decidas                                                          |
| **Performance**         | ✅ Sin impacto en servicios sin bitácora                                                  |
| **Simplicidad**         | 🚀 Tan fácil como configurar `campoActivo` o `defaultOrderBy`                             |

---

## 🚀 Próximos Pasos

**Cuando crees la tabla `dt_bitacora`:**

1. ✅ Crear modelo en `schema.prisma`
2. ✅ Ejecutar `npx prisma migrate dev --name agregar_dt_bitacora`
3. ✅ En cualquier servicio, agregar 2 líneas:
   ```typescript
   protected registrarEnBitacora = true;
   protected nombreTablaParaBitacora = "NOMBRE_TABLA";
   ```
4. ✅ Probar CREATE, UPDATE, DELETE
5. ✅ Verificar registros en BD con `SELECT * FROM dt_bitacora`

**Ejemplo completo comentado:** Ver `backend/src/services/ct_localidad.service.ts` líneas 113-114

¡El sistema está listo y esperando! Solo descomentar 2 líneas cuando lo necesites 🎉
