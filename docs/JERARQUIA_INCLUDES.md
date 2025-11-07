# 📚 Guía de Includes para Relaciones Jerárquicas

## 🎯 Introducción

Esta guía explica cómo obtener las relaciones jerárquicas usando `includes` en Prisma para la tabla `rl_infraestructura_jerarquia`.

## 📊 Estructura de la Jerarquía

La tabla `rl_infraestructura_jerarquia` relaciona instancias según su nivel jerárquico:

- **id_instancia**: ID de la instancia específica (ej: ID del jefe de sector)
- **id_ct_infraestructura_tipo_instancia**: Tipo de instancia (ej: 4 = "Jefe de Sector")
- **id_dependencia**: ID de otra entrada en `rl_infraestructura_jerarquia` (self-reference)

### Ejemplo de Estructura:

```
Dirección (id_instancia: 1, tipo: 1, id_dependencia: null)
  └─ Departamento (id_instancia: 5, tipo: 2, id_dependencia: ID_Direccion)
      └─ Área (id_instancia: 10, tipo: 3, id_dependencia: ID_Departamento)
          └─ Jefe de Sector (id_instancia: 20, tipo: 4, id_dependencia: ID_Area)
```

## 🔍 Casos de Uso Comunes

### 1. Obtener un Jefe de Sector con su Jerarquía

```typescript
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Obtener jefe de sector con su relación jerárquica
const jefeSector = await prisma.ct_infraestructura_jefe_sector.findUnique({
  where: {
    id_ct_infraestructura_jefe_sector: 5,
  },
});

// Obtener la relación jerárquica del jefe de sector
const jerarquia = await prisma.rl_infraestructura_jerarquia.findFirst({
  where: {
    id_instancia: 5,
    id_ct_infraestructura_tipo_instancia: 4, // Tipo "Jefe de Sector"
  },
  include: {
    // Incluir el tipo de instancia
    ct_infraestructura_tipo_instancia: true,
  },
});
```

### 2. Obtener Jerarquía con Dependencia (Nivel Superior)

```typescript
// Obtener una jerarquía con su dependencia (nivel padre)
const jerarquia = await prisma.rl_infraestructura_jerarquia.findUnique({
  where: {
    id_rl_infraestructura_jerarquia: 10,
  },
  include: {
    // Tipo de instancia actual
    ct_infraestructura_tipo_instancia: {
      select: {
        id_ct_infraestructura_tipo_instancia: true,
        nombre: true,
      },
    },
  },
});

// Para obtener la dependencia, necesitas hacer una consulta adicional
// porque Prisma no tiene self-reference automática en este schema
if (jerarquia?.id_dependencia) {
  const dependencia = await prisma.rl_infraestructura_jerarquia.findUnique({
    where: {
      id_rl_infraestructura_jerarquia: jerarquia.id_dependencia,
    },
    include: {
      ct_infraestructura_tipo_instancia: true,
    },
  });
}
```

### 3. Obtener Árbol Completo de Jerarquía (Recursivo)

```typescript
/**
 * Obtener toda la cadena jerárquica desde una instancia hasta la raíz
 */
async function obtenerCadenaJerarquica(idJerarquia: number) {
  const cadena: any[] = [];
  let idActual = idJerarquia;

  while (idActual) {
    const nivel = await prisma.rl_infraestructura_jerarquia.findUnique({
      where: {
        id_rl_infraestructura_jerarquia: idActual,
      },
      include: {
        ct_infraestructura_tipo_instancia: true,
      },
    });

    if (!nivel) break;

    cadena.unshift(nivel); // Agregar al inicio
    idActual = nivel.id_dependencia || null;
  }

  return cadena;
}

// Uso
const cadena = await obtenerCadenaJerarquica(10);
// Resultado: [Dirección, Departamento, Área, Jefe de Sector]
```

### 4. Obtener Todos los Hijos de una Jerarquía

```typescript
/**
 * Obtener todas las instancias que dependen de una jerarquía específica
 */
async function obtenerHijosJerarquia(idJerarquiaPadre: number) {
  const hijos = await prisma.rl_infraestructura_jerarquia.findMany({
    where: {
      id_dependencia: idJerarquiaPadre,
      estado: true,
    },
    include: {
      ct_infraestructura_tipo_instancia: true,
    },
    orderBy: {
      id_ct_infraestructura_tipo_instancia: "asc",
    },
  });

  return hijos;
}

// Uso
const hijos = await obtenerHijosJerarquia(1); // Hijos de la Dirección
```

### 5. Obtener Inventario con Jerarquía Completa

```typescript
// Obtener artículos de inventario con su jerarquía
const articulos = await prisma.dt_inventario_articulo.findMany({
  where: {
    estado: true,
  },
  include: {
    // Incluir la relación jerárquica
    rl_infraestructura_jerarquia: {
      include: {
        // Tipo de instancia
        ct_infraestructura_tipo_instancia: true,
      },
    },
  },
});

// Para cada artículo, obtener la cadena completa de jerarquía
for (const articulo of articulos) {
  if (articulo.rl_infraestructura_jerarquia) {
    const jerarquia = articulo.rl_infraestructura_jerarquia;

    // Obtener dependencia si existe
    if (jerarquia.id_dependencia) {
      const dependencia = await prisma.rl_infraestructura_jerarquia.findUnique({
        where: {
          id_rl_infraestructura_jerarquia: jerarquia.id_dependencia,
        },
        include: {
          ct_infraestructura_tipo_instancia: true,
        },
      });

      console.log("Jerarquía:", jerarquia);
      console.log("Dependencia:", dependencia);
    }
  }
}
```

### 6. Obtener Tipo de Instancia con Todas sus Jerarquías

```typescript
// Obtener un tipo de instancia con todas sus jerarquías
const tipoInstancia = await prisma.ct_infraestructura_tipo_instancia.findUnique(
  {
    where: {
      id_ct_infraestructura_tipo_instancia: 4, // "Jefe de Sector"
    },
    include: {
      // Todas las jerarquías de este tipo
      rl_infraestructura_jerarquia: {
        where: {
          estado: true,
        },
        include: {
          // Información de dependencia si existe
          // NOTA: Esto requiere una consulta adicional porque Prisma no tiene
          // self-reference automática en este schema
        },
      },
    },
  }
);
```

## 🔧 Helper Functions Recomendadas

### Función Helper para Obtener Jerarquía Completa

```typescript
/**
 * Obtener jerarquía con toda su información relacionada
 */
export async function obtenerJerarquiaCompleta(
  idJerarquia: number,
  prisma: PrismaClient
) {
  const jerarquia = await prisma.rl_infraestructura_jerarquia.findUnique({
    where: {
      id_rl_infraestructura_jerarquia: idJerarquia,
      estado: true,
    },
    include: {
      ct_infraestructura_tipo_instancia: true,
    },
  });

  if (!jerarquia) {
    return null;
  }

  // Obtener dependencia si existe
  let dependencia = null;
  if (jerarquia.id_dependencia) {
    dependencia = await prisma.rl_infraestructura_jerarquia.findUnique({
      where: {
        id_rl_infraestructura_jerarquia: jerarquia.id_dependencia,
      },
      include: {
        ct_infraestructura_tipo_instancia: true,
      },
    });
  }

  // Obtener hijos
  const hijos = await prisma.rl_infraestructura_jerarquia.findMany({
    where: {
      id_dependencia: jerarquia.id_rl_infraestructura_jerarquia,
      estado: true,
    },
    include: {
      ct_infraestructura_tipo_instancia: true,
    },
  });

  return {
    ...jerarquia,
    dependencia,
    hijos,
  };
}
```

## 📝 Notas Importantes

1. **Self-Reference**: Prisma no tiene una relación self-reference automática configurada en el schema actual. Para obtener la dependencia, necesitas hacer una consulta adicional usando `id_dependencia`.

2. **Performance**: Si necesitas obtener muchas jerarquías con sus dependencias, considera usar `Promise.all()` para consultas paralelas.

3. **Estado**: Siempre filtra por `estado: true` para obtener solo registros activos.

4. **Validación**: Antes de usar `id_dependencia`, valida que no sea `null` para evitar errores.

## 🚀 Uso en Servicios

En tus servicios, puedes usar estos patrones así:

```typescript
// En un servicio de artículos
export class DtInventarioArticuloService {
  async obtenerArticuloConJerarquia(idArticulo: number) {
    const articulo = await this.prisma.dt_inventario_articulo.findUnique({
      where: {
        id_dt_inventario_articulo: idArticulo,
      },
      include: {
        rl_infraestructura_jerarquia: {
          include: {
            ct_infraestructura_tipo_instancia: true,
          },
        },
      },
    });

    // Obtener dependencia de la jerarquía
    if (articulo?.rl_infraestructura_jerarquia?.id_dependencia) {
      const dependencia =
        await this.prisma.rl_infraestructura_jerarquia.findUnique({
          where: {
            id_rl_infraestructura_jerarquia:
              articulo.rl_infraestructura_jerarquia.id_dependencia,
          },
          include: {
            ct_infraestructura_tipo_instancia: true,
          },
        });

      return {
        ...articulo,
        rl_infraestructura_jerarquia: {
          ...articulo.rl_infraestructura_jerarquia,
          dependencia,
        },
      };
    }

    return articulo;
  }
}
```

## ✅ Resumen

- ✅ Usa `include` para obtener relaciones directas
- ✅ Haz consultas adicionales para obtener dependencias (self-reference)
- ✅ Filtra siempre por `estado: true`
- ✅ Valida que `id_dependencia` no sea `null` antes de usarlo
- ✅ Considera usar helpers para código reutilizable
