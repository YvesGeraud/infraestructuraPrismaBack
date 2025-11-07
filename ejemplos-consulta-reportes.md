# 🧪 Ejemplos Prácticos - Sistema de Consulta de Reportes

## 🎯 **Guía de Pruebas**

Esta guía te ayudará a probar todas las funcionalidades del sistema de consulta de reportes.

---

## 📋 **Prerequisitos**

1. **Servidor funcionando**: Asegúrate de que el backend esté ejecutándose
2. **Autenticación**: Obtén un token JWT válido
3. **Reportes existentes**: Debe haber al menos un reporte en `uploads/reportes/`

---

## 🚀 **Ejemplos de Uso**

### **1. Consultar Todos los Reportes**

```bash
# Obtener lista completa de reportes
curl -X GET "http://localhost:3000/api/reportes/consultar" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -H "Content-Type: application/json"
```

**Respuesta esperada:**

```json
{
  "exito": true,
  "mensaje": "Se encontraron 3 reportes",
  "datos": {
    "reportes": [
      {
        "nombre": "reporte_reporte_de_localidades_2025-10-03_17-15-22.pdf",
        "ruta": "/path/to/uploads/reportes/reporte_reporte_de_localidades_2025-10-03_17-15-22.pdf",
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
    "filtros": {}
  },
  "meta": {
    "tiempoConsulta": 45,
    "directorio": "/path/to/uploads/reportes"
  }
}
```

### **2. Filtrar por Tipo de Reporte**

```bash
# Buscar solo reportes de localidades
curl -X GET "http://localhost:3000/api/reportes/consultar?tipo=localidades" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -H "Content-Type: application/json"
```

### **3. Filtrar por Extensión**

```bash
# Buscar solo archivos PDF
curl -X GET "http://localhost:3000/api/reportes/consultar?extension=pdf" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -H "Content-Type: application/json"
```

### **4. Filtrar por Rango de Fechas**

```bash
# Reportes del último mes
curl -X GET "http://localhost:3000/api/reportes/consultar?fechaInicio=2025-09-01&fechaFin=2025-10-03" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -H "Content-Type: application/json"
```

### **5. Ordenar y Paginar**

```bash
# Ordenar por fecha descendente, 5 por página
curl -X GET "http://localhost:3000/api/reportes/consultar?ordenarPor=fecha&orden=desc&limite=5" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -H "Content-Type: application/json"
```

### **6. Obtener Reporte Específico**

```bash
# Obtener metadatos de un reporte específico
curl -X GET "http://localhost:3000/api/reportes/consultar/reporte_reporte_de_localidades_2025-10-03_17-15-22.pdf" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -H "Content-Type: application/json"
```

**Respuesta esperada:**

```json
{
  "exito": true,
  "mensaje": "Reporte encontrado",
  "datos": {
    "nombre": "reporte_reporte_de_localidades_2025-10-03_17-15-22.pdf",
    "ruta": "/path/to/uploads/reportes/reporte_reporte_de_localidades_2025-10-03_17-15-22.pdf",
    "tamanio": 245760,
    "fechaCreacion": "2025-10-03T17:15:22.000Z",
    "fechaModificacion": "2025-10-03T17:15:22.000Z",
    "tipo": "application/pdf",
    "extension": "pdf",
    "url": "/uploads/reportes/reporte_reporte_de_localidades_2025-10-03_17-15-22.pdf"
  },
  "meta": {
    "codigoEstado": 200,
    "fechaHora": "2025-10-03T17:15:22.000Z"
  }
}
```

### **7. Descargar Reporte**

```bash
# Descargar un reporte específico
curl -X GET "http://localhost:3000/api/reportes/descargar/reporte_reporte_de_localidades_2025-10-03_17-15-22.pdf" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  --output reporte_descargado.pdf
```

### **8. Obtener Estadísticas**

```bash
# Obtener estadísticas del sistema de reportes
curl -X GET "http://localhost:3000/api/reportes/estadisticas" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -H "Content-Type: application/json"
```

**Respuesta esperada:**

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
  },
  "meta": {
    "codigoEstado": 200,
    "fechaHora": "2025-10-03T17:15:22.000Z"
  }
}
```

### **9. Eliminar Reporte**

```bash
# Eliminar un reporte específico
curl -X DELETE "http://localhost:3000/api/reportes/eliminar/reporte_reporte_de_localidades_2025-10-03_17-15-22.pdf" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -H "Content-Type: application/json"
```

**Respuesta esperada:**

```json
{
  "exito": true,
  "mensaje": "Reporte eliminado exitosamente",
  "datos": {
    "nombreArchivo": "reporte_reporte_de_localidades_2025-10-03_17-15-22.pdf"
  },
  "meta": {
    "codigoEstado": 200,
    "fechaHora": "2025-10-03T17:15:22.000Z"
  }
}
```

### **10. Limpiar Reportes Antiguos**

```bash
# Limpiar reportes antiguos según configuración
curl -X POST "http://localhost:3000/api/reportes/limpiar" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -H "Content-Type: application/json"
```

**Respuesta esperada:**

```json
{
  "exito": true,
  "mensaje": "Se eliminaron 5 reportes antiguos",
  "datos": {
    "eliminados": 5
  },
  "meta": {
    "codigoEstado": 200,
    "fechaHora": "2025-10-03T17:15:22.000Z"
  }
}
```

---

## 🔧 **Ejemplos con JavaScript/Fetch**

### **Consultar Reportes con JavaScript**

```javascript
// Función para consultar reportes
async function consultarReportes(filtros = {}) {
  const params = new URLSearchParams(filtros);
  const url = `http://localhost:3000/api/reportes/consultar?${params}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${tuToken}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    console.log("Reportes encontrados:", data);
    return data;
  } catch (error) {
    console.error("Error consultando reportes:", error);
  }
}

// Ejemplos de uso
consultarReportes(); // Todos los reportes
consultarReportes({ tipo: "localidades" }); // Solo localidades
consultarReportes({ extension: "pdf" }); // Solo PDFs
consultarReportes({ limite: 5, pagina: 1 }); // Paginación
```

### **Descargar Reporte con JavaScript**

```javascript
// Función para descargar un reporte
async function descargarReporte(nombreArchivo) {
  const url = `http://localhost:3000/api/reportes/descargar/${nombreArchivo}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${tuToken}`,
      },
    });

    if (response.ok) {
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = nombreArchivo;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(downloadUrl);
    }
  } catch (error) {
    console.error("Error descargando reporte:", error);
  }
}
```

---

## 🧪 **Casos de Prueba**

### **1. Prueba de Filtros Combinados**

```bash
# Filtro complejo: localidades PDF del último mes, ordenadas por tamaño
curl -X GET "http://localhost:3000/api/reportes/consultar?tipo=localidades&extension=pdf&fechaInicio=2025-09-01&ordenarPor=tamanio&orden=desc" \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

### **2. Prueba de Paginación**

```bash
# Primera página
curl -X GET "http://localhost:3000/api/reportes/consultar?pagina=1&limite=2" \
  -H "Authorization: Bearer TU_TOKEN_AQUI"

# Segunda página
curl -X GET "http://localhost:3000/api/reportes/consultar?pagina=2&limite=2" \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

### **3. Prueba de Errores**

```bash
# Reporte que no existe
curl -X GET "http://localhost:3000/api/reportes/consultar/reporte_inexistente.pdf" \
  -H "Authorization: Bearer TU_TOKEN_AQUI"

# Sin autenticación (debe fallar)
curl -X GET "http://localhost:3000/api/reportes/consultar"
```

---

## 📊 **Monitoreo y Logs**

### **Verificar Logs del Sistema**

```bash
# Ver logs en tiempo real
tail -f backend/logs/combined.log | grep "reportes"

# Ver solo errores
tail -f backend/logs/error.log
```

### **Métricas de Rendimiento**

El sistema registra automáticamente:

- ✅ Tiempo de consulta
- ✅ Número de reportes encontrados
- ✅ Filtros aplicados
- ✅ Errores y excepciones

---

## ✅ **Checklist de Pruebas**

- [ ] **Consulta básica**: Obtener lista de reportes
- [ ] **Filtros**: Por tipo, extensión, fecha
- [ ] **Ordenamiento**: Por nombre, fecha, tamaño
- [ ] **Paginación**: Navegación entre páginas
- [ ] **Metadatos**: Información detallada de archivos
- [ ] **Descarga**: Archivos se descargan correctamente
- [ ] **Eliminación**: Reportes se eliminan sin errores
- [ ] **Estadísticas**: Datos agregados correctos
- [ ] **Limpieza**: Reportes antiguos se eliminan
- [ ] **Autenticación**: Rutas protegidas correctamente
- [ ] **Errores**: Manejo adecuado de casos de error

---

## 🚀 **Siguiente Paso**

Una vez que hayas probado todas las funcionalidades, el sistema estará listo para integrarse con el frontend para crear una interfaz de usuario completa para la gestión de reportes.
