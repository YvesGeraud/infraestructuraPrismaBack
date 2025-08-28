# 🔍 **GUÍA: Manejo de Filtros en Prisma con BaseService**

## 🎯 **Lección Aprendida: ct_localidad**

### **🐛 Problema Encontrado:**

```typescript
// ❌ ESTO NO FUNCIONA en campos nullable:
where.localidad = { contains: "granja", mode: "insensitive" };
```

**Error**: `Unknown argument 'mode'. Did you mean 'lte'?`

### **✅ Solución Aplicada:**

```typescript
// ✅ ESTO SÍ FUNCIONA:
if (filters?.localidad) {
  conditions.push({
    localidad: {
      contains: filters.localidad,
      // Sin mode - la BD maneja case sensitivity automáticamente
    },
  });
}
```

## 📋 **Patrones por Tipo de Campo**

### **🔤 Campos String Regulares (NOT NULL)**

```typescript
// ✅ FUNCIONA con mode
where.nombre = { contains: filtro, mode: "insensitive" };
```

### **🔤 Campos String Nullable (String?)**

```typescript
// ✅ FUNCIONA sin mode
where.descripcion = { contains: filtro };

// ✅ O con verificación explícita de null
where.AND = [
  { descripcion: { not: null } },
  { descripcion: { contains: filtro } },
];
```

### **🔢 Campos Numéricos**

```typescript
// ✅ Comparaciones exactas
where.id_municipio = filtro;

// ✅ Rangos
where.precio = { gte: minimo, lte: maximo };
```

### **📅 Campos Fecha**

```typescript
// ✅ Rangos de fecha
where.fecha_creacion = {
  gte: new Date(fechaInicio),
  lte: new Date(fechaFin),
};
```

### **🎯 Campos Enum**

```typescript
// ✅ Valores exactos
where.estado = filtro; // "ACTIVO" | "INACTIVO"
```

## 🏗️ **Estructura Recomendada para construirWhereClause()**

```typescript
protected construirWhereClause(filters?: TuFiltroType) {
  const where: any = {};
  const conditions: any[] = [];

  // 🔤 Filtros de texto (campos nullable)
  if (filters?.nombre) {
    conditions.push({
      nombre: { contains: filters.nombre }
    });
  }

  // 🔢 Filtros numéricos exactos
  if (filters?.id_categoria) {
    conditions.push({
      id_categoria: filters.id_categoria
    });
  }

  // 🎯 Filtros enum
  if (filters?.estado) {
    conditions.push({
      estado: filters.estado
    });
  }

  // 📅 Filtros de fecha
  if (filters?.fecha_desde || filters?.fecha_hasta) {
    const fechaCondition: any = {};
    if (filters.fecha_desde) fechaCondition.gte = new Date(filters.fecha_desde);
    if (filters.fecha_hasta) fechaCondition.lte = new Date(filters.fecha_hasta);

    conditions.push({
      fecha_creacion: fechaCondition
    });
  }

  // 🔗 Si hay condiciones, usar AND
  if (conditions.length > 0) {
    where.AND = conditions;
  }

  return where;
}
```

## 🛡️ **Consideraciones de Seguridad**

### **❌ NUNCA en Producción:**

```typescript
// ❌ Logs que exponen datos sensibles
console.log("🐛 DEBUG - Usuario buscando:", filters);
console.log("🐛 DEBUG - WHERE:", where);
```

### **✅ SÍ en Producción (si es necesario):**

```typescript
// ✅ Solo logs básicos sin datos
if (process.env.NODE_ENV === "development") {
  console.log("Filtros aplicados:", Object.keys(filters));
}
```

## 🚀 **Recomendaciones por Tipo de Tabla**

### **📊 Tablas de Catálogo (ct\_)**

- ✅ Filtros simples: `contains` para nombres/descripciones
- ✅ Filtros exactos: IDs, códigos, enums
- ✅ Sin `mode` para compatibilidad

### **📋 Tablas de Datos (dt\_)**

- ✅ Rangos de fecha obligatorios
- ✅ Filtros por usuario/propietario
- ✅ Estados de proceso

### **🔗 Tablas de Relación (rl\_)**

- ✅ Filtros por ambas entidades relacionadas
- ✅ Estados activo/inactivo
- ✅ Fechas de vigencia

## 🎯 **Template para Nuevos Servicios**

```typescript
export class TuNuevoBaseService extends BaseService<...> {
  protected config = {
    tableName: "tu_tabla",
    defaultOrderBy: { nombre: "asc" as const },
  };

  protected configurarIncludes() {
    return {
      // Solo las relaciones que necesites
      relacion_necesaria: true,
    };
  }

  protected construirWhereClause(filters?: TuFiltroType) {
    const where: any = {};
    const conditions: any[] = [];

    // 🔤 Campos de texto (sin mode para compatibilidad)
    if (filters?.texto) {
      conditions.push({
        campo_texto: { contains: filters.texto }
      });
    }

    // 🔢 Campos exactos
    if (filters?.id_exacto) {
      conditions.push({
        id_exacto: filters.id_exacto
      });
    }

    if (conditions.length > 0) {
      where.AND = conditions;
    }

    return where;
  }
}
```

## ✅ **Resultado: Sistema Robusto**

- ✅ **BaseService funciona** para cualquier tabla
- ✅ **Filtros personalizables** según necesidades específicas
- ✅ **Compatible** con diferentes tipos de BD
- ✅ **Sin logs** en producción por seguridad
- ✅ **Patrones claros** para casos comunes

¡El BaseService es oficialmente maduro y listo para producción! 🚀
