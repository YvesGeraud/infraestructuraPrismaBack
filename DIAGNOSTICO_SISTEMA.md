# 🔍 Sistema de Diagnóstico Cedex

## ¿Qué es `process.getuid()`?

`process.getuid()` es una función de Node.js que devuelve el **User ID (UID)** del proceso actual en sistemas Unix/Linux/macOS. Es extremadamente útil para:

- **Detectar problemas de permisos** antes que se conviertan en errores
- **Verificar seguridad** (¿está corriendo como root?)
- **Diagnosticar diferencias** entre desarrollo y producción
- **Debugging de acceso a archivos** y directorios

## 🚀 Funcionalidades Implementadas

### 1. Utilidad de Diagnóstico (`diagnosticoSistema.ts`)

```typescript
import { realizarDiagnosticoSistema } from "./utils/diagnosticoSistema";

const diagnostico = realizarDiagnosticoSistema();
console.log(diagnostico);
```

**Información que obtiene:**

- UID/GID del proceso (Unix/Linux)
- Usuario del sistema operativo
- PID del proceso
- Uso de memoria
- Verificación de permisos críticos
- Errores potenciales

### 2. Endpoints API

#### `GET /api/diagnostico`

Diagnóstico básico del sistema (usuarios autenticados)

```bash
curl -H "Authorization: Bearer <token>" \
     http://localhost:3000/api/diagnostico
```

#### `GET /api/diagnostico/usuario`

Información del usuario del sistema

```bash
curl -H "Authorization: Bearer <token>" \
     http://localhost:3000/api/diagnostico/usuario
```

#### `GET /api/diagnostico/permisos`

Verificación completa de permisos (solo ADMIN)

```bash
curl -H "Authorization: Bearer <token>" \
     http://localhost:3000/api/diagnostico/permisos
```

### 3. Script de Diagnóstico

```bash
# Ejecutar diagnóstico completo
npm run diagnostico
```

### 4. Diagnóstico Automático

Al iniciar en modo desarrollo, el sistema muestra automáticamente:

```
🔍 ===== DIAGNÓSTICO DEL SISTEMA =====
👤 Usuario:
   • Nombre: tu-usuario
   • UID: 1000
   • GID: 1000
   • Es root: ✅ No
   • Directorio inicio: /home/tu-usuario

🔧 Proceso:
   • PID: 12345
   • Plataforma: linux
   • Node.js: v18.17.0
   • Arquitectura: x64
   • Memoria: 45 MB
   • Directorio trabajo: /ruta/a/cedex

🔒 Permisos:
   • Uploads: ✅
   • Logs: ✅
   • Crear archivos: ✅
=====================================
```

## 🛠️ Casos de Uso Comunes

### 1. Problemas de Uploads

```bash
# Si uploads no funciona, verificar:
npm run diagnostico

# Respuesta típica:
# ❌ No se puede escribir en uploads
# Solución: chmod 755 uploads/
```

### 2. Ejecutándose como Root

```bash
# Si aparece:
# ⚠️ EJECUTÁNDOSE COMO ROOT - Riesgo de seguridad

# Solución:
sudo useradd -r -s /bin/false cedex-app
sudo chown -R cedex-app:cedex-app /ruta/a/cedex
sudo -u cedex-app npm start
```

### 3. Problemas de Base de Datos

```bash
# Si hay errores de conexión, el diagnóstico puede mostrar:
# • UID: 1001 (usuario diferente)
# • Permisos de directorio incorrectos
```

### 4. Debugging en Producción

```bash
# Acceder al endpoint para ver el estado:
curl -H "Authorization: Bearer $TOKEN" \
     https://tu-servidor.com/api/diagnostico/permisos
```

## 🔧 Comandos Útiles por Sistema

### Linux/macOS

```bash
# Ver usuario actual
id
whoami

# Ver permisos
ls -la uploads/
ls -la logs/

# Cambiar propietario
sudo chown -R usuario:grupo directorio/

# Cambiar permisos
chmod 755 directorio/
chmod 644 archivo.txt
```

### Windows

```bash
# Ver usuario actual
whoami

# Ver permisos
icacls uploads
dir uploads

# Cambiar permisos
icacls uploads /grant todos:(F)
```

## 🚨 Alertas de Seguridad

El sistema detecta automáticamente:

1. **Ejecución como root** (UID = 0)

   - ⚠️ Riesgo crítico de seguridad
   - Recomendación: Usuario específico

2. **Permisos excesivos**

   - Archivos con permisos 777
   - Directorios mundo-escribibles

3. **Alto uso de memoria**
   - > 512MB = advertencia
   - > 1GB = crítico

## 📊 Respuesta de la API

```json
{
  "exito": true,
  "mensaje": "Diagnóstico del sistema obtenido exitosamente",
  "datos": {
    "usuario": {
      "uid": 1000,
      "gid": 1000,
      "nombreUsuario": "cedex-user",
      "directorioInicio": "/home/cedex-user"
    },
    "proceso": {
      "pid": 12345,
      "plataforma": "linux",
      "version": "v18.17.0",
      "arquitectura": "x64",
      "memoriaUsada": 67,
      "directorioTrabajo": "/opt/cedex"
    },
    "permisos": {
      "directorioUploads": true,
      "puedeEscribirLogs": true,
      "puedeCrearArchivos": true
    },
    "problemas": [],
    "recomendaciones": [
      {
        "categoria": "Seguridad",
        "prioridad": "MEDIA",
        "descripcion": "Configurar logrotate para logs",
        "comandos": ["sudo logrotate -f /etc/logrotate.conf"]
      }
    ]
  }
}
```

## 🔄 Integración con Logs

El sistema se integra automáticamente con Winston para registrar:

- Solicitudes de diagnóstico
- Problemas detectados
- Cambios de permisos
- Alertas de seguridad

```typescript
// En tu código:
import logger from "../config/logger";

const diagnostico = realizarDiagnosticoSistema();
if (diagnostico.usuario.uid === 0) {
  logger.warn("Aplicación ejecutándose como root", { uid: 0 });
}
```

## 📝 Notas Importantes

1. **Solo Unix/Linux**: `process.getuid()` no existe en Windows
2. **Desarrollo vs Producción**: El diagnóstico automático solo se muestra en desarrollo
3. **Permisos de Admin**: Algunos endpoints requieren rol ADMIN
4. **Cache**: Los diagnósticos no se cachean para obtener información en tiempo real

¡Este sistema te ayudará a identificar problemas de permisos antes de que se conviertan en errores en producción! 🎯
