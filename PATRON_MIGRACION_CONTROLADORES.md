# 🎯 Patrón de Migración: ct_localidad.controller.ts

## ✅ Controlador Migrado Exitosamente

Hemos migrado el controlador de `ct_localidad` como **template** para replicar en los demás controladores.

---

## 📋 Cambios Realizados (Paso a Paso)

### **Cambio 1: Agregar Imports Necesarios**

**AGREGAR** estas importaciones al inicio del archivo:

```typescript
import { RequestAutenticado } from "../middleware/authMiddleware";
import {
  obtenerIdSesionDesdeJwt,
  obtenerIdUsuarioDesdeJwt,
} from "../utils/bitacoraUtils";
```

**Ubicación:** Después de `import { Request, Response } from "express";`

---

### **Cambio 2: Método `crear` (CREATE)**

#### ✨ Firma del Método

**ANTES:**

```typescript
crearLocalidad = async (req: Request, res: Response): Promise<void> => {
```

**DESPUÉS:**

```typescript
crearLocalidad = async (
  req: RequestAutenticado,  // 🔐 Cambio de Request a RequestAutenticado
  res: Response
): Promise<void> => {
```

#### ✨ Contenido del Método

**ANTES:**

```typescript
await this.manejarCreacion(
  req,
  res,
  async () => {
    const localidadData: CrearCtLocalidadInput = req.body;
    return await ctLocalidadBaseService.crear(localidadData);
  },
  "Localidad creada exitosamente"
);
```

**DESPUÉS:**

```typescript
await this.manejarCreacion(
  req,
  res,
  async () => {
    // 🔐 AGREGAR: Extraer id_sesion desde JWT
    const idSesion = obtenerIdSesionDesdeJwt(req);

    const localidadData: CrearCtLocalidadInput = req.body;

    // 🔐 AGREGAR: Pasar idSesion como segundo parámetro
    return await ctLocalidadBaseService.crear(localidadData, idSesion);
  },
  "Localidad creada exitosamente"
);
```

#### 🎯 Resumen del Cambio

1. Cambiar `Request` → `RequestAutenticado`
2. Agregar `const idSesion = obtenerIdSesionDesdeJwt(req);`
3. Pasar `idSesion` como segundo parámetro al servicio

---

### **Cambio 3: Método `actualizar` (UPDATE)**

#### ✨ Firma del Método

**ANTES:**

```typescript
actualizarLocalidad = async (req: Request, res: Response): Promise<void> => {
```

**DESPUÉS:**

```typescript
actualizarLocalidad = async (
  req: RequestAutenticado,  // 🔐 Cambio de Request a RequestAutenticado
  res: Response
): Promise<void> => {
```

#### ✨ Contenido del Método

**ANTES:**

```typescript
await this.manejarActualizacion(
  req,
  res,
  async () => {
    const { id_ct_localidad } = this.validarDatosConEsquema<CtLocalidadIdParam>(
      ctLocalidadIdParamSchema,
      req.params
    );
    const localidadData: ActualizarCtLocalidadInput = req.body;

    return await ctLocalidadBaseService.actualizar(
      id_ct_localidad,
      localidadData
    );
  },
  "Localidad actualizada exitosamente"
);
```

**DESPUÉS:**

```typescript
await this.manejarActualizacion(
  req,
  res,
  async () => {
    // 🔐 AGREGAR: Extraer id_sesion desde JWT
    const idSesion = obtenerIdSesionDesdeJwt(req);

    const { id_ct_localidad } = this.validarDatosConEsquema<CtLocalidadIdParam>(
      ctLocalidadIdParamSchema,
      req.params
    );
    const localidadData: ActualizarCtLocalidadInput = req.body;

    // 🔐 AGREGAR: Pasar idSesion como tercer parámetro
    return await ctLocalidadBaseService.actualizar(
      id_ct_localidad,
      localidadData,
      idSesion
    );
  },
  "Localidad actualizada exitosamente"
);
```

#### 🎯 Resumen del Cambio

1. Cambiar `Request` → `RequestAutenticado`
2. Agregar `const idSesion = obtenerIdSesionDesdeJwt(req);`
3. Pasar `idSesion` como **tercer parámetro** al servicio

---

### **Cambio 4: Método `eliminar` (DELETE)**

#### ✨ Firma del Método

**ANTES:**

```typescript
eliminarLocalidad = async (
  req: Request,
  res: Response
): Promise<void> => {
```

**DESPUÉS:**

```typescript
eliminarLocalidad = async (
  req: RequestAutenticado,  // 🔐 Cambio de Request a RequestAutenticado
  res: Response
): Promise<void> => {
```

#### ✨ Contenido del Método

**ANTES:**

```typescript
await this.manejarEliminacion(
  req,
  res,
  async () => {
    const { id_ct_localidad } = this.validarDatosConEsquema<CtLocalidadIdParam>(
      ctLocalidadIdParamSchema,
      req.params
    );

    const { id_ct_usuario_up } =
      this.validarDatosConEsquema<EliminarCtLocalidadInput>(
        eliminarCtLocalidadSchema,
        req.body
      );

    await ctLocalidadBaseService.eliminar(id_ct_localidad, id_ct_usuario_up);
  },
  "Localidad eliminada exitosamente"
);
```

**DESPUÉS:**

```typescript
await this.manejarEliminacion(
  req,
  res,
  async () => {
    // 🔐 AGREGAR: Extraer id_sesion e id_usuario desde JWT
    const idSesion = obtenerIdSesionDesdeJwt(req);
    const idUsuario = obtenerIdUsuarioDesdeJwt(req);

    const { id_ct_localidad } = this.validarDatosConEsquema<CtLocalidadIdParam>(
      ctLocalidadIdParamSchema,
      req.params
    );

    // 🔐 ELIMINAR: Ya no necesitamos obtener id_ct_usuario_up del body
    // const { id_ct_usuario_up } = this.validarDatosConEsquema<EliminarCtLocalidadInput>(...);

    // 🔐 CAMBIAR: Pasar idUsuario e idSesion como parámetros
    await ctLocalidadBaseService.eliminar(id_ct_localidad, idUsuario, idSesion);
  },
  "Localidad eliminada exitosamente"
);
```

#### 🎯 Resumen del Cambio

1. Cambiar `Request` → `RequestAutenticado`
2. Agregar `const idSesion = obtenerIdSesionDesdeJwt(req);`
3. Agregar `const idUsuario = obtenerIdUsuarioDesdeJwt(req);`
4. **ELIMINAR** la validación de `id_ct_usuario_up` del body
5. Cambiar llamada al servicio: `.eliminar(id, idUsuario, idSesion)`

---

### **Cambio 5: Métodos de Lectura (GET)**

**✅ NO REQUIEREN CAMBIOS**

Los métodos de lectura **NO necesitan** ser modificados:

- `obtenerLocalidadPorId` ✅ Sin cambios
- `obtenerTodasLasLocalidades` ✅ Sin cambios

**Razón:** Los métodos de lectura no modifican datos, por lo tanto no necesitan bitácora ni validación de sesión.

---

## 🔄 Fórmula para Replicar en Otros Controladores

### 📝 Checklist por Controlador

Para cada controlador que uses como base:

#### ✅ Paso 1: Imports (Una vez por archivo)

```typescript
import { RequestAutenticado } from "../middleware/authMiddleware";
import {
  obtenerIdSesionDesdeJwt,
  obtenerIdUsuarioDesdeJwt,
} from "../utils/bitacoraUtils";
```

#### ✅ Paso 2: Método `crear`

- [ ] Cambiar `req: Request` → `req: RequestAutenticado`
- [ ] Agregar `const idSesion = obtenerIdSesionDesdeJwt(req);`
- [ ] Cambiar: `service.crear(datos)` → `service.crear(datos, idSesion)`

#### ✅ Paso 3: Método `actualizar`

- [ ] Cambiar `req: Request` → `req: RequestAutenticado`
- [ ] Agregar `const idSesion = obtenerIdSesionDesdeJwt(req);`
- [ ] Cambiar: `service.actualizar(id, datos)` → `service.actualizar(id, datos, idSesion)`

#### ✅ Paso 4: Método `eliminar`

- [ ] Cambiar `req: Request` → `req: RequestAutenticado`
- [ ] Agregar `const idSesion = obtenerIdSesionDesdeJwt(req);`
- [ ] Agregar `const idUsuario = obtenerIdUsuarioDesdeJwt(req);`
- [ ] Eliminar validación de `id_ct_usuario_up` del body
- [ ] Cambiar: `service.eliminar(id)` → `service.eliminar(id, idUsuario, idSesion)`

---

## 🎨 Template Visual de Cambios

```typescript
// ==========================================
// TEMPLATE: MÉTODO CREAR
// ==========================================
nombreMetodo = async (
  req: RequestAutenticado, // ← CAMBIO 1
  res: Response
): Promise<void> => {
  await this.manejarCreacion(
    req,
    res,
    async () => {
      const idSesion = obtenerIdSesionDesdeJwt(req); // ← CAMBIO 2

      const datos = req.body;
      return await service.crear(datos, idSesion); // ← CAMBIO 3: Agregar idSesion
    },
    "Mensaje exitoso"
  );
};

// ==========================================
// TEMPLATE: MÉTODO ACTUALIZAR
// ==========================================
nombreMetodo = async (
  req: RequestAutenticado, // ← CAMBIO 1
  res: Response
): Promise<void> => {
  await this.manejarActualizacion(
    req,
    res,
    async () => {
      const idSesion = obtenerIdSesionDesdeJwt(req); // ← CAMBIO 2

      const id = parseInt(req.params.id);
      const datos = req.body;

      return await service.actualizar(id, datos, idSesion); // ← CAMBIO 3
    },
    "Mensaje exitoso"
  );
};

// ==========================================
// TEMPLATE: MÉTODO ELIMINAR
// ==========================================
nombreMetodo = async (
  req: RequestAutenticado, // ← CAMBIO 1
  res: Response
): Promise<void> => {
  await this.manejarEliminacion(
    req,
    res,
    async () => {
      const idSesion = obtenerIdSesionDesdeJwt(req); // ← CAMBIO 2
      const idUsuario = obtenerIdUsuarioDesdeJwt(req); // ← CAMBIO 3

      const id = parseInt(req.params.id);

      // ⚠️ ELIMINAR: const { id_ct_usuario_up } = ...del body

      await service.eliminar(id, idUsuario, idSesion); // ← CAMBIO 4
    },
    "Mensaje exitoso"
  );
};
```

---

## 🚀 Ejemplo de Aplicación en Otro Controlador

### ct_municipio.controller.ts

Aplicando el mismo patrón:

```typescript
// 1. Agregar imports
import { RequestAutenticado } from "../middleware/authMiddleware";
import {
  obtenerIdSesionDesdeJwt,
  obtenerIdUsuarioDesdeJwt,
} from "../utils/bitacoraUtils";

// 2. Método crear
crearMunicipio = async (
  req: RequestAutenticado, // ✅
  res: Response
): Promise<void> => {
  await this.manejarCreacion(
    req,
    res,
    async () => {
      const idSesion = obtenerIdSesionDesdeJwt(req); // ✅
      const municipioData = req.body;
      return await municipioService.crear(municipioData, idSesion); // ✅
    },
    "Municipio creado exitosamente"
  );
};

// 3. Método actualizar
actualizarMunicipio = async (
  req: RequestAutenticado, // ✅
  res: Response
): Promise<void> => {
  await this.manejarActualizacion(
    req,
    res,
    async () => {
      const idSesion = obtenerIdSesionDesdeJwt(req); // ✅
      const id = parseInt(req.params.id);
      const municipioData = req.body;
      return await municipioService.actualizar(id, municipioData, idSesion); // ✅
    },
    "Municipio actualizado exitosamente"
  );
};

// 4. Método eliminar
eliminarMunicipio = async (
  req: RequestAutenticado, // ✅
  res: Response
): Promise<void> => {
  await this.manejarEliminacion(
    req,
    res,
    async () => {
      const idSesion = obtenerIdSesionDesdeJwt(req); // ✅
      const idUsuario = obtenerIdUsuarioDesdeJwt(req); // ✅
      const id = parseInt(req.params.id);
      await municipioService.eliminar(id, idUsuario, idSesion); // ✅
    },
    "Municipio eliminado exitosamente"
  );
};
```

---

## ⚡ Atajos de Búsqueda y Reemplazo (VSCode)

Para acelerar la migración, usa estos patrones de búsqueda en VSCode:

### Buscar:

```regex
async crear\w+\s*=\s*async\s*\(req:\s*Request
```

### Reemplazar con:

```typescript
async crear = async (req: RequestAutenticado
```

### Buscar:

```regex
async actualizar\w+\s*=\s*async\s*\(req:\s*Request
```

### Reemplazar con:

```typescript
async actualizar = async (req: RequestAutenticado
```

### Buscar:

```regex
async eliminar\w+\s*=\s*async\s*\(req:\s*Request
```

### Reemplazar con:

```typescript
async eliminar = async (req: RequestAutenticado
```

---

## 🎯 Lista de Controladores por Migrar

Aplica este mismo patrón a estos controladores:

### ✅ Catálogos Generales (3 archivos):

- [x] `ct_localidad.controller.ts` ← **✅ COMPLETADO (Template)**
- [ ] `ct_municipio.controller.ts`
- [ ] `ct_entidad.controller.ts`

### 📊 Bitácora (3 archivos):

- [ ] `ct_bitacora_accion.controller.ts`
- [ ] `ct_bitacora_tabla.controller.ts`
- [ ] `dt_bitacora.controller.ts`

### 🏗️ Infraestructura (11 archivos):

- [ ] `ct_infraestructura_anexo.controller.ts`
- [ ] `ct_infraestructura_area.controller.ts`
- [ ] `ct_infraestructura_departamento.controller.ts`
- [ ] `ct_infraestructura_direccion.controller.ts`
- [ ] `ct_infraestructura_escuela.controller.ts`
- [ ] `ct_infraestructura_jefe_sector.controller.ts`
- [ ] `ct_infraestructura_sostenimiento.controller.ts`
- [ ] `ct_infraestructura_supervisor.controller.ts`
- [ ] `ct_infraestructura_tipo_escuela.controller.ts`
- [ ] `ct_infraestructura_tipo_instancia.controller.ts`
- [ ] `dt_infraestructura_ubicacion.controller.ts`

### 📦 Inventario (11 archivos):

- [ ] `ct_inventario_alta.controller.ts`
- [ ] `ct_inventario_baja.controller.ts`
- [ ] `ct_inventario_clase.controller.ts`
- [ ] `ct_inventario_color.controller.ts`
- [ ] `ct_inventario_estado_fisico.controller.ts`
- [ ] `ct_inventario_marca.controller.ts`
- [ ] `ct_inventario_material.controller.ts`
- [ ] `ct_inventario_proveedor.controller.ts`
- [ ] `ct_inventario_subclase.controller.ts`
- [ ] `ct_inventario_tipo_articulo.controller.ts`
- [ ] `dt_inventario_articulo.controller.ts`

---

## 🎉 ¡Listo para Replicar!

Ahora tienes el patrón completo. Para cada controlador:

1. Abre el archivo
2. Agrega los imports
3. Busca método `crear` → Aplica patrón
4. Busca método `actualizar` → Aplica patrón
5. Busca método `eliminar` → Aplica patrón
6. Guarda y verifica compilación

**Tiempo estimado por controlador: 2-3 minutos** ⚡

🚀 ¡Comienza con los más simples y ve avanzando!
