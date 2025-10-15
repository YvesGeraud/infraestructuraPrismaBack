# 🔐 Guía de Uso del Sistema de Bitácora Seguro con JWT

## ✅ Sistema Implementado

El sistema de bitácora ahora tiene **validación de seguridad completa** que garantiza:

1. ✅ **id_ct_sesion es OBLIGATORIO** - No se puede omitir
2. ✅ **Sesión validada contra BD** - Se verifica que exista en `ct_sesion`
3. ✅ **Sesión pertenece al usuario** - No se puede usar sesión de otro usuario
4. ✅ **Sesión está activa** - No se aceptan sesiones cerradas
5. ✅ **Sesión no ha expirado** - Se verifica fecha_expiracion
6. ✅ **No se puede falsificar** - Cualquier intento lanza error

---

## 📝 Ejemplo Completo: Controlador con Bitácora Segura

```typescript
import { Response } from "express";
import { RequestAutenticado } from "../middleware/authMiddleware";
import {
  obtenerIdSesionDesdeJwt,
  obtenerIdUsuarioDesdeJwt,
} from "../utils/bitacoraUtils";
import { MunicipioService } from "../services/ct_municipio.service";
import {
  enviarRespuestaExitosa,
  enviarRespuestaError,
} from "../utils/responseUtils";

export class MunicipioController {
  /**
   * ✨ CREAR MUNICIPIO
   * POST /api/ct_municipio
   */
  async crear(req: RequestAutenticado, res: Response): Promise<void> {
    try {
      // 🔐 PASO 1: Extraer y validar id_sesion desde JWT (OBLIGATORIO)
      const idSesion = obtenerIdSesionDesdeJwt(req);
      // ✅ Si llegamos aquí, el id_sesion es válido y obligatorio

      // 📝 PASO 2: Preparar datos con id_usuario desde JWT
      const datos = {
        ...req.body,
        id_ct_usuario_in: req.user.id_ct_usuario, // Usuario que crea
      };

      // 💾 PASO 3: Crear con validación de sesión
      // BaseService validará que:
      // - La sesión existe en ct_sesion
      // - La sesión pertenece al usuario
      // - La sesión está activa
      // - La sesión no ha expirado
      const municipio = await MunicipioService.crear(datos, idSesion);

      enviarRespuestaExitosa(res, {
        datos: municipio,
        mensaje: "Municipio creado exitosamente",
      });
    } catch (error: any) {
      console.error("Error al crear municipio:", error);

      // Los errores de seguridad vienen con mensajes claros
      enviarRespuestaError(
        res,
        error.message || "Error al crear municipio",
        400
      );
    }
  }

  /**
   * ✏️ ACTUALIZAR MUNICIPIO
   * PUT /api/ct_municipio/:id
   */
  async actualizar(req: RequestAutenticado, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);

      // 🔐 PASO 1: Extraer y validar id_sesion desde JWT
      const idSesion = obtenerIdSesionDesdeJwt(req);

      // 📝 PASO 2: Preparar datos
      const datos = {
        ...req.body,
        id_ct_usuario_up: req.user.id_ct_usuario, // Usuario que actualiza
      };

      // 💾 PASO 3: Actualizar con validación de sesión
      const municipio = await MunicipioService.actualizar(id, datos, idSesion);

      enviarRespuestaExitosa(res, {
        datos: municipio,
        mensaje: "Municipio actualizado exitosamente",
      });
    } catch (error: any) {
      console.error("Error al actualizar municipio:", error);
      enviarRespuestaError(
        res,
        error.message || "Error al actualizar municipio",
        400
      );
    }
  }

  /**
   * 🗑️ ELIMINAR MUNICIPIO (soft delete)
   * DELETE /api/ct_municipio/:id
   */
  async eliminar(req: RequestAutenticado, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);

      // 🔐 PASO 1: Extraer datos desde JWT
      const idSesion = obtenerIdSesionDesdeJwt(req);
      const idUsuario = obtenerIdUsuarioDesdeJwt(req);

      // 💾 PASO 2: Eliminar con validación de sesión
      await MunicipioService.eliminar(id, idUsuario, idSesion);

      enviarRespuestaExitosa(res, {
        mensaje: "Municipio eliminado exitosamente",
      });
    } catch (error: any) {
      console.error("Error al eliminar municipio:", error);
      enviarRespuestaError(
        res,
        error.message || "Error al eliminar municipio",
        400
      );
    }
  }
}
```

---

## 🔒 Ejemplo con Función Helper Completa

Si quieres simplificar aún más, usa `obtenerDatosParaBitacora`:

```typescript
import { obtenerDatosParaBitacora } from "../utils/bitacoraUtils";

async crear(req: RequestAutenticado, res: Response): Promise<void> {
  try {
    // 🎯 Una sola línea obtiene id_usuario e id_sesion
    const { id_usuario, id_sesion } = obtenerDatosParaBitacora(req);

    const datos = {
      ...req.body,
      id_ct_usuario_in: id_usuario,
    };

    const resultado = await MunicipioService.crear(datos, id_sesion);

    enviarRespuestaExitosa(res, {
      datos: resultado,
      mensaje: "Creado exitosamente",
    });
  } catch (error: any) {
    enviarRespuestaError(res, error.message, 400);
  }
}
```

---

## 🚨 Validaciones de Seguridad que se Ejecutan Automáticamente

### 1. En `bitacoraUtils.ts` (Primer nivel):

```typescript
// ✅ Verifica JWT presente
// ✅ Verifica id_sesion en JWT
// ✅ Convierte a número
// ✅ Valida que sea > 0
```

### 2. En `BaseService.ts` → `validarYObtenerSesion()` (Segundo nivel):

```typescript
// ✅ Busca sesión en ct_sesion por id
// ✅ Verifica que exista (no falsificada)
// ✅ Verifica que pertenezca al usuario correcto
// ✅ Verifica que esté activa
// ✅ Verifica que no haya expirado
// ✅ Marca como inactiva si expiró
```

---

## ❌ Errores que se Pueden Generar

### Error 1: Usuario no autenticado

```
🚨 SEGURIDAD: Usuario no autenticado.
Todas las operaciones requieren autenticación JWT válida.
Asegúrate de que el middleware verificarAutenticacion esté activo.
```

### Error 2: JWT sin id_sesion

```
🚨 SEGURIDAD: JWT no contiene id_sesion.
El token JWT debe incluir información de sesión válida.
Esto puede indicar un token malformado o sistema de auth desactualizado.
```

### Error 3: Sesión no existe (falsificada)

```
🚨 SEGURIDAD: La sesión 999 no existe en la base de datos.
Posible intento de falsificación de sesión.
```

### Error 4: Sesión de otro usuario

```
🚨 SEGURIDAD: La sesión 2 NO pertenece al usuario 5.
Pertenece al usuario 3.
Posible intento de usar sesión de otro usuario.
```

### Error 5: Sesión inactiva

```
🚨 SEGURIDAD: La sesión 2 está INACTIVA.
El usuario debe iniciar sesión nuevamente.
```

### Error 6: Sesión expirada

```
🚨 SEGURIDAD: La sesión 2 ha EXPIRADO.
Expiró el 2025-10-15T22:00:00.000Z.
El usuario debe iniciar sesión nuevamente.
```

---

## 🛡️ Configuración de Rutas (IMPORTANTE)

Todas las rutas que usen bitácora **DEBEN** tener el middleware `verificarAutenticacion`:

```typescript
import { Router } from "express";
import { verificarAutenticacion } from "../middleware/authMiddleware";
import municipioController from "../controllers/ct_municipio.controller";

const router = Router();

// ✅ CORRECTO: Con autenticación
router.post(
  "/",
  verificarAutenticacion, // 🔐 OBLIGATORIO
  municipioController.crear.bind(municipioController)
);

router.put(
  "/:id",
  verificarAutenticacion, // 🔐 OBLIGATORIO
  municipioController.actualizar.bind(municipioController)
);

router.delete(
  "/:id",
  verificarAutenticacion, // 🔐 OBLIGATORIO
  municipioController.eliminar.bind(municipioController)
);

// ❌ INCORRECTO: Sin autenticación (NO hacer esto)
// router.post("/", municipioController.crear); // ⚠️ Fallará con error de seguridad

export default router;
```

---

## 📊 Flujo Completo de Seguridad

```
1. Usuario → Login → Recibe JWT con id_ct_sesion
                                    ↓
2. Usuario → Request con JWT → Middleware verificarAutenticacion
                                    ↓
3. Middleware → Valida JWT → Agrega req.user con id_sesion
                                    ↓
4. Controlador → obtenerIdSesionDesdeJwt(req) → Extrae id_sesion
                                    ↓
5. Service.crear/actualizar/eliminar(datos, idSesion)
                                    ↓
6. BaseService → validarYObtenerSesion() → VALIDA contra BD
                                    ↓
7. Si válido → Registra en dt_bitacora con id_ct_sesion
   Si inválido → Lanza error y hace rollback
```

---

## ✅ Checklist de Implementación

Para implementar bitácora segura en un nuevo endpoint:

- [ ] Agregar `verificarAutenticacion` al middleware de la ruta
- [ ] Importar `obtenerIdSesionDesdeJwt` en el controlador
- [ ] Llamar `obtenerIdSesionDesdeJwt(req)` al inicio del método
- [ ] Pasar `idSesion` como parámetro al servicio
- [ ] Activar bitácora en el servicio: `registrarEnBitacora = true`
- [ ] Configurar nombre de tabla: `nombreTablaParaBitacora = "NOMBRE"`
- [ ] Manejar errores en try-catch

---

## 🎯 Ventajas del Sistema Implementado

1. **Seguridad Máxima**: No se puede falsificar sesiones
2. **Auditoría Completa**: Toda operación queda registrada con sesión válida
3. **Prevención de Ataques**: Detecta intentos de usar sesiones de otros usuarios
4. **Errores Claros**: Mensajes descriptivos para debugging
5. **Validación Automática**: No hay que recordar validar manualmente
6. **Rollback Automático**: Si falla validación, no se guarda nada
7. **JWT First**: Usa el id_sesion del JWT sin consultas extras a BD

---

## 🚀 Resultado

Con este sistema implementado:

- ✅ Todas las operaciones tienen auditoría válida
- ✅ No se pueden hacer operaciones sin sesión válida
- ✅ No se pueden falsificar sesiones
- ✅ Las sesiones expiradas se detectan y marcan automáticamente
- ✅ Cada registro de bitácora está vinculado a una sesión verificada

🎉 **Tu sistema de bitácora es ahora 100% seguro y confiable!**
