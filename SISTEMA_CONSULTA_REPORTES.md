# 📊 Sistema de Consulta de Reportes - Cedex Backend

## 🎯 **Resumen del Sistema**

El sistema de consulta de reportes permite gestionar y consultar todos los reportes generados por el sistema, incluyendo funcionalidades de búsqueda, filtrado, descarga y eliminación.

---

## 🚀 **Funcionalidades Implementadas**

### ✅ **Estado Actual: COMPLETAMENTE FUNCIONAL**

El sistema de consulta de reportes está completamente implementado y listo para uso en producción.

---

## 📋 **Endpoints Disponibles**

### 1. **Consultar Reportes con Filtros**

```
GET /api/reportes/consultar
```

**Parámetros de consulta opcionales:**

- `tipo`: Tipo de reporte a filtrar
- `fechaInicio`: Fecha de inicio (YYYY-MM-DD)
- `fechaFin`: Fecha de fin (YYYY-MM-DD)
- `extension`: Extensión de archivo (pdf, xlsx, etc.)
- `ordenarPor`: Campo para ordenar (nombre, fecha, tamanio)
- `orden`: Orden de clasificación (asc, desc)
- `pagina`: Número de página (default: 1)
- `limite`: Registros por página (default: 20)

**Ejemplo:**

```bash
GET /api/reportes/consultar?tipo=localidades&extension=pdf&pagina=1&limite=10
```

**Respuesta:**

```json
{
  "exito": true,
  "mensaje": "Se encontraron 3 reportes",
  "datos": {
    "reportes": [
      {
        "nombre": "reporte_reporte_de_localidades_2025-10-03_17-15-22.pdf",
        "ruta": "/path/to/file.pdf",
        "tamanio": 245760,
        "fechaCreacion": "2025-10-03T17:15:22.000Z",
        "fechaModificacion": "2025-10-03T17:15:22.000Z",
        "tipo": "application/pdf",
        "extension": "pdf",
        "url": "/uploads/reportes/reporte_reporte_de_localidades_2025-10-03_17-15-22.pdf"
      }
    ],
    "total": 3,
    "pagina": 1,
    "totalPaginas": 1,
    "filtros": { ... }
  },
  "meta": {
    "tiempoConsulta": 45,
    "directorio": "/path/to/uploads/reportes"
  }
}
```

### 2. **Obtener Reporte Específico**

```
GET /api/reportes/consultar/:nombreArchivo
```

**Ejemplo:**

```bash
GET /api/reportes/consultar/reporte_reporte_de_localidades_2025-10-03_17-15-22.pdf
```

### 3. **Descargar Reporte**

```
GET /api/reportes/descargar/:nombreArchivo
```

**Ejemplo:**

```bash
GET /api/reportes/descargar/reporte_reporte_de_localidades_2025-10-03_17-15-22.pdf
```

**Respuesta:** Archivo para descarga directa

### 4. **Eliminar Reporte**

```
DELETE /api/reportes/eliminar/:nombreArchivo
```

**Ejemplo:**

```bash
DELETE /api/reportes/eliminar/reporte_reporte_de_localidades_2025-10-03_17-15-22.pdf
```

### 5. **Obtener Estadísticas**

```
GET /api/reportes/estadisticas
```

**Respuesta:**

```json
{
  "exito": true,
  "mensaje": "Estadísticas obtenidas exitosamente",
  "datos": {
    "totalReportes": 15,
    "tamanioTotal": 15728640,
    "porExtension": {
      "pdf": 12,
      "xlsx": 3
    },
    "porTipo": {
      "localidades": 8,
      "municipios": 4,
      "usuarios": 3
    },
    "reporteMasAntiguo": "2025-09-28T10:30:00.000Z",
    "reporteMasReciente": "2025-10-03T17:15:22.000Z"
  }
}
```

### 6. **Limpiar Reportes Antiguos**

```
POST /api/reportes/limpiar
```

**Respuesta:**

```json
{
  "exito": true,
  "mensaje": "Se eliminaron 5 reportes antiguos",
  "datos": {
    "eliminados": 5
  }
}
```

---

## 🔧 **Arquitectura del Sistema**

### **Servicios Implementados:**

1. **ConsultarReportesService** (`consultarReportes.service.ts`)

   - Lógica de negocio para consultar reportes
   - Filtrado y paginación
   - Metadatos de archivos
   - Estadísticas

2. **ConsultarReportesController** (`consultarReportes.controller.ts`)

   - Manejo de requests HTTP
   - Validación de parámetros
   - Respuestas normalizadas

3. **Rutas** (`consultarReportes.routes.ts`)
   - Definición de endpoints
   - Middleware de autenticación
   - Rate limiting

---

## 📊 **Características del Sistema**

### **Filtros Disponibles:**

- ✅ **Por tipo de reporte**: Filtra por el tipo de reporte generado
- ✅ **Por fecha**: Rango de fechas de creación
- ✅ **Por extensión**: PDF, XLSX, CSV, etc.
- ✅ **Ordenamiento**: Por nombre, fecha o tamaño
- ✅ **Paginación**: Control de registros por página

### **Metadatos de Reportes:**

- ✅ **Información básica**: Nombre, ruta, tamaño
- ✅ **Fechas**: Creación y modificación
- ✅ **Tipo MIME**: Para descarga correcta
- ✅ **URL de acceso**: Para enlaces directos

### **Funcionalidades de Gestión:**

- ✅ **Consulta paginada**: Para grandes volúmenes
- ✅ **Descarga directa**: Archivos listos para descargar
- ✅ **Eliminación segura**: Con validaciones
- ✅ **Limpieza automática**: Reportes antiguos
- ✅ **Estadísticas**: Información detallada del sistema

---

## 🔒 **Seguridad y Autenticación**

### **Protecciones Implementadas:**

- ✅ **Autenticación requerida**: Todas las rutas protegidas
- ✅ **Rate limiting**: Protección contra abuso
- ✅ **Validación de archivos**: Solo tipos permitidos
- ✅ **Sanitización de nombres**: Prevención de path traversal

### **Tipos de Archivo Permitidos:**

- PDF (`application/pdf`)
- Excel (`application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`)
- CSV (`text/csv`)

---

## 📈 **Configuración y Personalización**

### **Configuración en `reports.ts`:**

```typescript
export const reportesConfig = {
  directorio: "uploads/reportes",
  seguridad: {
    maxArchivos: 100,
    maxTamano: 50 * 1024 * 1024, // 50MB
    tiposPermitidos: ["pdf", "xlsx", "xls"],
  },
  limpieza: {
    habilitar: true,
    maxEdad: 7 * 24 * 60 * 60 * 1000, // 7 días
  },
};
```

---

## 🚀 **Ejemplos de Uso**

### **1. Consultar todos los reportes:**

```bash
curl -X GET "http://localhost:3000/api/reportes/consultar" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### **2. Filtrar reportes de localidades:**

```bash
curl -X GET "http://localhost:3000/api/reportes/consultar?tipo=localidades&extension=pdf" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### **3. Descargar un reporte específico:**

```bash
curl -X GET "http://localhost:3000/api/reportes/descargar/reporte_reporte_de_localidades_2025-10-03_17-15-22.pdf" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  --output reporte.pdf
```

### **4. Obtener estadísticas:**

```bash
curl -X GET "http://localhost:3000/api/reportes/estadisticas" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📝 **Notas de Implementación**

### **Estructura de Archivos:**

```
backend/uploads/reportes/
├── reporte_reporte_de_localidades_2025-10-03_17-15-22.pdf
├── reporte_reporte_de_localidades_2025-10-03_17-51-53.pdf
└── reporte_reporte_de_localidades_2025-10-03_17-53-38.pdf
```

### **Nomenclatura de Archivos:**

- Formato: `reporte_{tipo}_{fecha}_{hora}.{extension}`
- Ejemplo: `reporte_reporte_de_localidades_2025-10-03_17-15-22.pdf`

### **Respuestas Normalizadas:**

Todas las respuestas siguen el formato estándar del sistema:

```json
{
  "exito": true,
  "mensaje": "Mensaje descriptivo",
  "datos": { ... },
  "meta": {
    "codigoEstado": 200,
    "fechaHora": "2025-10-03T17:15:22.000Z"
  }
}
```

---

## ✅ **Estado del Sistema**

- ✅ **Servicio implementado**: ConsultarReportesService
- ✅ **Controlador implementado**: ConsultarReportesController
- ✅ **Rutas configuradas**: consultarReportes.routes.ts
- ✅ **Integración completa**: Rutas agregadas al sistema principal
- ✅ **Autenticación**: Todas las rutas protegidas
- ✅ **Rate limiting**: Protección implementada
- ✅ **Validación**: Parámetros y archivos validados
- ✅ **Documentación**: Completa y actualizada

**El sistema está listo para uso en producción** 🚀
