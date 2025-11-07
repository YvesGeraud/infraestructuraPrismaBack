# 🔄 Guía de Migración al Sistema de Bitácora Seguro

## 📋 Resumen

Has implementado correctamente el sistema de bitácora seguro con JWT. Ahora necesitas actualizar **todos los controladores existentes** para que utilicen el `id_ct_sesion` obligatorio.

---

## ✅ ¿Qué cambió?

### ANTES (Sistema Antiguo):

```typescript
await service.crear(datos); // ❌ Sin idSesion
await service.actualizar(id, datos); // ❌ Sin idSesion
await service.eliminar(id); // ❌ Sin idSesion o idUsuario
```

### AHORA (Sistema Seguro):

```typescript
await service.crear(datos, idSesion); // ✅ Con idSesion obligatorio
await service.actualizar(id, datos, idSesion); // ✅ Con idSesion obligatorio
await service.eliminar(id, idUsuario, idSesion); // ✅ Con ambos obligatorios
```

---

## 🔧 Pasos para Migrar un Controlador

### Paso 1: Importar utilidades

```typescript
import {
  obtenerIdSesionDesdeJwt,
  obtenerIdUsuarioDesdeJwt,
} from "../utils/bitacoraUtils";
import { RequestAutenticado } from "../middleware/authMiddleware";
```

### Paso 2: Actualizar método `crear`

**ANTES:**

```typescript
async crear(req: Request, res: Response): Promise<void> {
  try {
    const datos = req.body;
    const resultado = await service.crear(datos);  // ❌

    enviarRespuestaExitosa(res, { datos: resultado });
  } catch (error: any) {
    enviarRespuestaError(res, error.message, 400);
  }
}
```

**DESPUÉS:**

```typescript
async crear(req: RequestAutenticado, res: Response): Promise<void> {
  try {
    // 🔐 Extraer id_sesion desde JWT (OBLIGATORIO)
    const idSesion = obtenerIdSesionDesdeJwt(req);

    const datos = req.body;
    const resultado = await service.crear(datos, idSesion);  // ✅

    enviarRespuestaExitosa(res, { datos: resultado });
  } catch (error: any) {
    enviarRespuestaError(res, error.message, 400);
  }
}
```

### Paso 3: Actualizar método `actualizar`

**ANTES:**

```typescript
async actualizar(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id);
    const datos = req.body;
    const resultado = await service.actualizar(id, datos);  // ❌

    enviarRespuestaExitosa(res, { datos: resultado });
  } catch (error: any) {
    enviarRespuestaError(res, error.message, 400);
  }
}
```

**DESPUÉS:**

```typescript
async actualizar(req: RequestAutenticado, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id);

    // 🔐 Extraer id_sesion desde JWT (OBLIGATORIO)
    const idSesion = obtenerIdSesionDesdeJwt(req);

    const datos = req.body;
    const resultado = await service.actualizar(id, datos, idSesion);  // ✅

    enviarRespuestaExitosa(res, { datos: resultado });
  } catch (error: any) {
    enviarRespuestaError(res, error.message, 400);
  }
}
```

### Paso 4: Actualizar método `eliminar`

**ANTES:**

```typescript
async eliminar(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id);
    await service.eliminar(id);  // ❌

    enviarRespuestaExitosa(res, { mensaje: "Eliminado" });
  } catch (error: any) {
    enviarRespuestaError(res, error.message, 400);
  }
}
```

**DESPUÉS:**

```typescript
async eliminar(req: RequestAutenticado, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id);

    // 🔐 Extraer id_sesion e id_usuario desde JWT (OBLIGATORIOS)
    const idSesion = obtenerIdSesionDesdeJwt(req);
    const idUsuario = obtenerIdUsuarioDesdeJwt(req);

    await service.eliminar(id, idUsuario, idSesion);  // ✅

    enviarRespuestaExitosa(res, { mensaje: "Eliminado" });
  } catch (error: any) {
    enviarRespuestaError(res, error.message, 400);
  }
}
```

---

## 📝 Lista de Controladores a Actualizar

Según los errores de compilación, necesitas actualizar estos controladores:

### ✅ Catálogos de Bitácora:

- [x] `ct_bitacora_accion.controller.ts`
- [x] `ct_bitacora_tabla.controller.ts`

### ✅ Catálogos Generales:

- [x] `ct_entidad.controller.ts`
- [x] `ct_localidad.controller.ts`
- [x] `ct_municipio.controller.ts`

### ✅ Datos:

- [x] `dt_bitacora.controller.ts`

### ✅ Infraestructura (10 archivos):

- [x] `ct_infraestructura_anexo.controller.ts`
- [x] `ct_infraestructura_area.controller.ts`
- [x] `ct_infraestructura_departamento.controller.ts`
- [x] `ct_infraestructura_direccion.controller.ts`
- [x] `ct_infraestructura_escuela.controller.ts`
- [x] `ct_infraestructura_jefe_sector.controller.ts`
- [x] `ct_infraestructura_sostenimiento.controller.ts`
- [x] `ct_infraestructura_supervisor.controller.ts`
- [x] `ct_infraestructura_tipo_escuela.controller.ts`
- [x] `ct_infraestructura_tipo_instancia.controller.ts`
- [x] `dt_infraestructura_ubicacion.controller.ts`

### ✅ Inventario (10 archivos):

- [x] `ct_inventario_alta.controller.ts`
- [x] `ct_inventario_baja.controller.ts`
- [x] `ct_inventario_clase.controller.ts`
- [x] `ct_inventario_color.controller.ts`
- [x] `ct_inventario_estado_fisico.controller.ts`
- [x] `ct_inventario_marca.controller.ts`
- [x] `ct_inventario_material.controller.ts`
- [x] `ct_inventario_proveedor.controller.ts`
- [x] `ct_inventario_subclase.controller.ts`
- [x] `ct_inventario_tipo_articulo.controller.ts`
- [x] `dt_inventario_articulo.controller.ts`

### ✅ Ejemplos:

- [x] `ejemplo_servicio_con_bitacora.ts`

**TOTAL: ~26 archivos**

---

## 🚀 Script de Migración Automática (Opcional)

Puedes crear un script Node.js para automatizar la migración:

```javascript
// scripts/migrar-controladores.js
const fs = require("fs");
const path = require("path");

// Paso 1: Agregar imports
const addImports = (content) => {
  if (!content.includes("obtenerIdSesionDesdeJwt")) {
    const importLine = `import { obtenerIdSesionDesdeJwt, obtenerIdUsuarioDesdeJwt } from "../utils/bitacoraUtils";\n`;
    // Buscar última línea de import
    const lastImportIndex = content.lastIndexOf("import ");
    const endOfLastImport = content.indexOf("\n", lastImportIndex);
    return (
      content.slice(0, endOfLastImport + 1) +
      importLine +
      content.slice(endOfLastImport + 1)
    );
  }
  return content;
};

// Paso 2: Actualizar método crear
const updateCrear = (content) => {
  return content.replace(
    /async crear\(req: Request, res: Response\): Promise<void> \{\s*try \{/g,
    `async crear(req: RequestAutenticado, res: Response): Promise<void> {
    try {
      const idSesion = obtenerIdSesionDesdeJwt(req);`
  );
};

// Continúa con otros métodos...
```

---

## 💡 Recomendación

**Migra los controladores por módulos:**

1. **Primero**: Catálogos más simples (ct_entidad, ct_municipio, ct_localidad)
2. **Segundo**: Infraestructura
3. **Tercero**: Inventario
4. **Último**: Bitácora y ejemplos

---

## ✅ Checklist por Controlador

Para cada controlador:

- [ ] Importar `obtenerIdSesionDesdeJwt` y `obtenerIdUsuarioDesdeJwt`
- [ ] Importar `RequestAutenticado`
- [ ] Cambiar `req: Request` a `req: RequestAutenticado`
- [ ] En `crear`: Agregar `const idSesion = obtenerIdSesionDesdeJwt(req)`
- [ ] En `crear`: Pasar `idSesion` al servicio
- [ ] En `actualizar`: Agregar `const idSesion = obtenerIdSesionDesdeJwt(req)`
- [ ] En `actualizar`: Pasar `idSesion` al servicio
- [ ] En `eliminar`: Agregar ambas funciones para obtener `idSesion` e `idUsuario`
- [ ] En `eliminar`: Pasar ambos parámetros al servicio
- [ ] Verificar compilación con `npm run build`
- [ ] Probar endpoint con Postman/cURL

---

## 🎯 Ejemplo Completo Actualizado

Archivo: `backend/src/controllers/ct_municipio.controller.ts`

```typescript
import { Response } from "express";
import { RequestAutenticado } from "../middleware/authMiddleware";
import {
  obtenerIdSesionDesdeJwt,
  obtenerIdUsuarioDesdeJwt,
} from "../utils/bitacoraUtils";
import { CtMunicipioBaseService } from "../services/ct_municipio.service";
import {
  CrearCtMunicipioInput,
  ActualizarCtMunicipioInput,
  BuscarCtMunicipioInput,
} from "../schemas/ct_municipio.schema";
import {
  manejarErrorAsincrono,
  enviarRespuestaExitosa,
} from "../utils/responseUtils";

class CtMunicipioController {
  private service = new CtMunicipioBaseService();

  async crear(req: RequestAutenticado, res: Response): Promise<void> {
    await manejarErrorAsincrono(res, async () => {
      // 🔐 Obtener id_sesion desde JWT (OBLIGATORIO)
      const idSesion = obtenerIdSesionDesdeJwt(req);

      const datos: CrearCtMunicipioInput = req.body;
      const resultado = await this.service.crear(datos, idSesion);

      enviarRespuestaExitosa(res, {
        datos: resultado,
        mensaje: "Municipio creado exitosamente",
      });
    });
  }

  async actualizar(req: RequestAutenticado, res: Response): Promise<void> {
    await manejarErrorAsincrono(res, async () => {
      const id = parseInt(req.params.id);

      // 🔐 Obtener id_sesion desde JWT (OBLIGATORIO)
      const idSesion = obtenerIdSesionDesdeJwt(req);

      const datos: ActualizarCtMunicipioInput = req.body;
      const resultado = await this.service.actualizar(id, datos, idSesion);

      enviarRespuestaExitosa(res, {
        datos: resultado,
        mensaje: "Municipio actualizado exitosamente",
      });
    });
  }

  async eliminar(req: RequestAutenticado, res: Response): Promise<void> {
    await manejarErrorAsincrono(res, async () => {
      const id = parseInt(req.params.id);

      // 🔐 Obtener id_sesion e id_usuario desde JWT (OBLIGATORIOS)
      const idSesion = obtenerIdSesionDesdeJwt(req);
      const idUsuario = obtenerIdUsuarioDesdeJwt(req);

      await this.service.eliminar(id, idUsuario, idSesion);

      enviarRespuestaExitosa(res, {
        mensaje: "Municipio eliminado exitosamente",
      });
    });
  }

  // ... otros métodos (obtenerTodos, obtenerPorId) no necesitan cambios
}

export default new CtMunicipioController();
```

---

## 🎉 Beneficios Después de la Migración

Una vez completada la migración:

✅ **100% de auditoría segura** - Todas las operaciones están rastreadas  
✅ **No se puede falsificar sesiones** - Validación completa contra BD  
✅ **Prevención de ataques** - Detecta intentos de usar sesiones ajenas  
✅ **Cumplimiento normativo** - Auditoría completa para regulaciones  
✅ **Debugging mejorado** - Mensajes de error claros y específicos  
✅ **Trazabilidad completa** - Sabes quién, cuándo y desde dónde

---

## ❓ Preguntas Frecuentes

### P: ¿Puedo hacer las migraciones gradualmente?

**R:** Sí, pero los controladores no migrados darán error de compilación. Recomendamos migrar por módulos completos.

### P: ¿Qué pasa con los endpoints sin autenticación?

**R:** Si un endpoint NO requiere autenticación, **NO debe** usar BaseService con bitácora activada.

### P: ¿Se puede usar el sistema antiguo temporalmente?

**R:** No, la firma de los métodos ha cambiado. Todos deben migrar al nuevo sistema.

### P: ¿Qué pasa si olvido pasar el idSesion?

**R:** TypeScript te avisará con error de compilación. En runtime, el sistema lanzará error claro.

---

## 📞 Siguiente Paso

¿Quieres que te ayude a migrar un controlador específico como ejemplo, o prefieres hacerlo tú mismo siguiendo esta guía?
