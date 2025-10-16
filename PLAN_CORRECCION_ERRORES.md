# 📋 Plan de Corrección de Errores TypeScript

## Resumen de Errores Encontrados

Total de errores: **~150 errores de compilación**

### Categorías de Errores:

#### 1. **Errores en Rutas** (120+ errores similares)

**Problema:** Rutas que usan `RequestAutenticado` no tienen el middleware `verificarAutenticacion`
**Afectadas:** Todas las rutas de POST/PUT/DELETE que requieren autenticación

**Archivos afectados:**

- Todas las rutas en `src/routes/*.route.ts`
- Todas las rutas en `src/routes/inventario/*.route.ts`
- Todas las rutas en `src/routes/infraestructura/*.route.ts`

**Solución:** Agregar middleware `verificarAutenticacion` ANTES de los controladores que usan `RequestAutenticado`

```typescript
// ❌ INCORRECTO
router.post("/", validarRequest({...}), controller.crear);

// ✅ CORRECTO
router.post("/", verificarAutenticacion, validarRequest({...}), controller.crear);
```

---

#### 2. **Error en auth.controller.ts:143**

**Problema:** Falta propiedad `tokensRevocados` en respuesta de logout
**Archivo:** `src/controllers/auth.controller.ts`
**Línea:** 143

**Código actual:**

```typescript
sesionesTerminadas,
tokensRevocados, // ❌ No existe en resultado
```

**Solución:** Eliminar `tokensRevocados`:

```typescript
sesionesTerminadas,
// tokensRevocados ya no existe
```

---

#### 3. **Errores en dt_bitacora.controller.ts**

**Problema:** Argumentos incorrectos en métodos crear/actualizar/eliminar
**Archivo:** `src/controllers/dt_bitacora.controller.ts`

**Errores:**

- Línea 26: `crear()` espera 2 argumentos, recibe 1
- Línea 101: `actualizar()` espera 3 argumentos, recibe 2
- Línea 121: `eliminar()` espera 3 argumentos, recibe 1

**Solución:** Agregar `idSesion` y `idUsuario` desde JWT:

```typescript
// Crear
const idSesion = obtenerIdSesionDesdeJwt(req);
return await service.crear(datos, idSesion);

// Actualizar
const idSesion = obtenerIdSesionDesdeJwt(req);
return await service.actualizar(id, datos, idSesion);

// Eliminar
const idSesion = obtenerIdSesionDesdeJwt(req);
const idUsuario = obtenerIdUsuarioDesdeJwt(req);
return await service.eliminar(id, idUsuario, idSesion);
```

---

#### 4. **Error en auth.service.ts:277**

**Problema:** `sesionId` puede ser string o number, pero se espera solo number
**Archivo:** `src/services/auth.service.ts`
**Línea:** 277

**Código actual:**

```typescript
const sesionId = input.sesionId || sesionActual.id_ct_sesion; // string | number
```

**Solución:** Convertir a number:

```typescript
const sesionId = input.sesionId
  ? parseInt(input.sesionId.toString())
  : sesionActual.id_ct_sesion;
```

---

#### 5. **Implementar Refresh Token SIN tabla**

**Archivo:** `src/services/auth.service.ts`

**Solución:** Sistema de refresh basado en JWT + validación de sesión activa:

```typescript
static async refreshToken(input: RefreshTokenInput): Promise<RespuestaRefresh> {
  try {
    // 1. Decodificar y validar el JWT (sin verificar exp)
    const decoded = jwt.decode(input.refreshToken) as PayloadJwt;

    if (!decoded || !decoded.jti) {
      throw new ErrorAuth("Token inválido", "TOKEN_INVALIDO", 401);
    }

    // 2. Verificar que la sesión siga activa en BD
    const sesion = await prisma.ct_sesion.findUnique({
      where: { jti: decoded.jti },
      include: { ct_usuario: true }
    });

    if (!sesion || !sesion.activa) {
      throw new ErrorAuth("Sesión inactiva o no encontrada", "SESION_INVALIDA", 401);
    }

    if (!sesion.ct_usuario.estado) {
      throw new ErrorAuth("Usuario inactivo", "USUARIO_INACTIVO", 401);
    }

    // 3. Generar nuevo JWT con nuevo JTI
    const nuevoJti = uuidv4();
    const payload: PayloadJwt = {
      sub: sesion.ct_usuario.id_ct_usuario,
      uuid: sesion.ct_usuario.uuid_usuario,
      usuario: sesion.ct_usuario.usuario,
      jti: nuevoJti,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + this.parseTimeToSeconds(jwtConfig.expiresIn),
      iss: "infraestructura-system",
    };

    const nuevoAccessToken = jwt.sign(payload, jwtConfig.secret, { algorithm: "HS256" });

    // 4. Actualizar sesión con nuevo JTI
    await prisma.ct_sesion.update({
      where: { id_ct_sesion: sesion.id_ct_sesion },
      data: {
        jti: nuevoJti,
        fecha_ultimo_uso: new Date(),
        fecha_expiracion: new Date(payload.exp * 1000),
      },
    });

    // 5. Retornar nuevo token
    return {
      exito: true,
      mensaje: "Token renovado exitosamente",
      datos: {
        accessToken: nuevoAccessToken,
        refreshToken: nuevoAccessToken, // El mismo token sirve como refresh
        tipoToken: "Bearer",
        expiraEn: this.parseTimeToSeconds(jwtConfig.expiresIn),
        jti: nuevoJti,
      },
    };
  } catch (error) {
    if (error instanceof ErrorAuth) throw error;
    console.error("❌ Error en refresh token:", error);
    throw new ErrorAuth("Error interno durante la renovación del token", "ERROR_INTERNO", 500);
  }
}
```

---

## 🚀 Orden de Corrección Sugerido

1. ✅ **Arreglar auth.controller.ts** (1 error simple)
2. ✅ **Arreglar auth.service.ts:277** (1 error simple)
3. ✅ **Arreglar dt_bitacora.controller.ts** (3 errores similares)
4. ✅ **Implementar refreshToken funcional**
5. ✅ **Agregar middleware de autenticación a TODAS las rutas** (uso de script)

---

## 📝 Script para Agregar Middleware Masivamente

Para arreglar las 120+ rutas, puedo crear un script que:

1. Busque todas las rutas con POST/PUT/DELETE
2. Verifique si ya tienen `verificarAutenticacion`
3. Agregue el middleware si falta

¿Quieres que proceda con las correcciones en este orden?
