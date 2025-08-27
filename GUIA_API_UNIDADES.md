# 📚 **Guía de API - Unidades de Infraestructura**

## 🎯 **Endpoints Disponibles**

### **1. Obtener todas las unidades (con filtros)**

```
GET /api/infraestructura/unidad
```

**Query Parameters:**

- `cct` - Filtrar por CCT (búsqueda parcial)
- `nombre_unidad` - Filtrar por nombre (búsqueda parcial)
- `municipio_cve` - Filtrar por clave de municipio (ej: "051")
- `id_localidad` - Filtrar por ID de localidad
- `id_sostenimiento` - Filtrar por ID de sostenimiento
- `id_tipo_escuela` - Filtrar por ID de tipo de escuela
- `vigente` - Filtrar por estado vigente (0 o 1)
- `page` - Número de página (default: 1)
- `limit` - Elementos por página (default: 10, max: 1000)

**Ejemplos de uso:**

```bash
# Buscar por CCT
GET /api/infraestructura/unidad?cct=29DPR

# Buscar por nombre y municipio
GET /api/infraestructura/unidad?nombre_unidad=primaria&municipio_cve=051

# Buscar solo unidades vigentes con paginación
GET /api/infraestructura/unidad?vigente=1&page=2&limit=20

# Buscar por tipo de escuela y sostenimiento
GET /api/infraestructura/unidad?id_tipo_escuela=1&id_sostenimiento=2
```

**Respuesta:**

```json
{
  "exito": true,
  "mensaje": "Unidades obtenidas exitosamente (150 encontradas)",
  "datos": [
    {
      "id_unidad": 1,
      "nombre_unidad": "Escuela Primaria Benito Juárez",
      "cct": "29DPR0001K",
      "vigente": 1,
      "ct_infraestructura_tipo_escuela": {
        "id_tipo_escuela": 1,
        "tipo_escuela": "Primaria"
      },
      "ct_localidad": {
        "id_localidad": 123,
        "localidad": "Tlaxcala de Xicohténcatl",
        "ct_municipio": {
          "id_municipio": 29,
          "nombre": "Tlaxcala",
          "cve_mun": "051"
        }
      },
      "ct_infraestructura_sostenimiento": {
        "id_sostenimiento": 1,
        "sostenimiento": "Público"
      }
    }
  ],
  "meta": {
    "codigoEstado": 200,
    "fechaHora": "2024-01-15T10:30:00.000Z",
    "paginacion": {
      "page": 1,
      "limit": 10,
      "total": 150,
      "totalPages": 15,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### **2. Obtener una unidad por ID**

```
GET /api/infraestructura/unidad/:id_unidad
```

**Ejemplo:**

```bash
GET /api/infraestructura/unidad/123
```

### **3. Crear una nueva unidad**

```
POST /api/infraestructura/unidad
```

**Body:**

```json
{
  "nombre_unidad": "Nueva Escuela",
  "cct": "29DPR0999K",
  "id_tipo_escuela": 1,
  "id_sostenimiento": 2,
  "id_localidad": 456,
  "vigente": 1
}
```

### **4. Actualizar una unidad**

```
PUT /api/infraestructura/unidad/:id_unidad
```

**Body:**

```json
{
  "nombre_unidad": "Escuela Actualizada",
  "vigente": 1
}
```

### **5. Eliminar una unidad**

```
DELETE /api/infraestructura/unidad/:id_unidad
```

## 🚀 **Ventajas de la API Unificada**

### ✅ **Simplicidad**

- **Una sola ruta GET** para todas las búsquedas
- **Query parameters flexibles** - combina filtros como necesites
- **Paginación integrada** - maneja grandes conjuntos de datos

### ✅ **Rendimiento**

- **Filtros a nivel de base de datos** - no carga datos innecesarios
- **Relaciones optimizadas** - incluye municipio, sostenimiento y tipo de escuela
- **Paginación eficiente** - cuenta total sin cargar todos los registros

### ✅ **Flexibilidad**

- **Filtros combinables** - usa tantos como necesites
- **Búsqueda parcial** - tanto para CCT como nombre
- **Filtros geográficos** - por municipio o localidad

## 📝 **Casos de Uso Comunes**

### 🔍 **Autocompletar**

```bash
GET /api/infraestructura/unidad?nombre_unidad=prim&limit=5
```

### 🗺️ **Filtrar por Municipio**

```bash
GET /api/infraestructura/unidad?municipio_cve=051&vigente=1
```

### 📊 **Reporte de Unidades**

```bash
GET /api/infraestructura/unidad?id_sostenimiento=1&page=1&limit=100
```

### 🔎 **Búsqueda Específica**

```bash
GET /api/infraestructura/unidad?cct=29DPR0001K
```

## ⚡ **Optimizaciones Aplicadas**

1. **Eliminación de rutas redundantes** - de 4 endpoints a 1
2. **Filtros dinámicos** - query parameters flexibles
3. **Relaciones incluidas** - datos completos en una consulta
4. **Validación robusta** - Zod + TypeScript
5. **Respuestas normalizadas** - formato consistente
6. **Manejo de errores centralizado** - experiencia coherente

Esta API consolidada es más eficiente, más fácil de mantener y proporciona la misma funcionalidad que múltiples endpoints especializados.
