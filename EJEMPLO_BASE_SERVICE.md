# 🏗️ **BaseService - Template Inteligente para Servicios**

## 🎯 **El Problema que Resuelve**

Cada servicio tiene particularidades únicas:

- **ct_unidad**: Relaciones complejas con localidad → municipio
- **ct_color**: Sin relaciones, filtros simples
- **ct_marca**: Relaciones con categorías

**Solución**: BaseService que estandariza lo común y personaliza lo específico.

## 📚 **Ejemplo: ct_unidad con BaseService**

```typescript
import { BaseService } from "../BaseService";
import { Ct_infraestructura_unidad } from "@prisma/client";
import {
  CrearCtUnidadInput,
  ActualizarCtUnidadInput,
  BuscarUnidadesInput,
} from "../../schemas/infraestructura/ct_unidad.schema";

export class CtUnidadService extends BaseService<
  Ct_infraestructura_unidad,
  CrearCtUnidadInput,
  ActualizarCtUnidadInput,
  BuscarUnidadesInput
> {
  // 🔧 Configuración específica del modelo
  protected config = {
    tableName: "ct_infraestructura_unidad",
    defaultOrderBy: { nombre_unidad: "asc" as const },
  };

  // 🔗 Includes específicos de unidades
  protected configurarIncludes(filters?: BuscarUnidadesInput) {
    return {
      ct_infraestructura_tipo_escuela: true,
      ct_localidad: {
        include: {
          ct_municipio: true,
        },
      },
      ct_infraestructura_sostenimiento: true,
    };
  }

  // 🔍 Filtros específicos de unidades
  protected construirWhereClause(filters?: BuscarUnidadesInput) {
    const where: any = {};

    if (filters?.cct) {
      where.cct = { contains: filters.cct };
    }

    if (filters?.nombre_unidad) {
      where.nombre_unidad = { contains: filters.nombre_unidad };
    }

    if (filters?.municipio_cve) {
      where.ct_localidad = {
        ct_municipio: {
          cve_mun: filters.municipio_cve,
        },
      };
    }

    if (filters?.vigente !== undefined) {
      where.vigente = filters.vigente;
    }

    return where;
  }

  // 🔧 Hook personalizado: validar CCT único antes de crear
  protected async antesDeCrear(datos: CrearCtUnidadInput): Promise<void> {
    if (datos.cct) {
      const existente = await this.model.findFirst({
        where: { cct: datos.cct },
      });

      if (existente) {
        throw new Error("Ya existe una unidad con este CCT");
      }
    }
  }

  // 📌 Métodos adicionales específicos de unidades
  async obtenerPorCCT(cct: string) {
    try {
      const unidad = await this.model.findFirst({
        where: { cct },
        include: this.configurarIncludes(),
      });
      return unidad;
    } catch (error) {
      console.error("Error al obtener unidad por CCT:", error);
      throw new Error("Error al obtener unidad por CCT");
    }
  }

  async obtenerPorMunicipio(cve_mun: string) {
    try {
      const unidades = await this.model.findMany({
        where: {
          ct_localidad: {
            ct_municipio: {
              cve_mun,
            },
          },
        },
        include: this.configurarIncludes(),
        orderBy: this.config.defaultOrderBy,
      });
      return unidades;
    } catch (error) {
      console.error("Error al obtener unidades por municipio:", error);
      throw new Error("Error al obtener unidades por municipio");
    }
  }
}
```

## 📚 **Ejemplo: ct_color Simple con BaseService**

```typescript
import { BaseService } from "../BaseService";
import { Ct_color } from "@prisma/client";
import {
  CrearCtColorInput,
  ActualizarCtColorInput,
  BuscarColoresInput,
} from "../../schemas/inventario/ct_color.schemas";

export class CtColorService extends BaseService<
  Ct_color,
  CrearCtColorInput,
  ActualizarCtColorInput,
  BuscarColoresInput
> {
  // 🔧 Configuración simple
  protected config = {
    tableName: "ct_color",
    defaultOrderBy: { nombre_color: "asc" as const },
  };

  // 🔗 Sin relaciones complejas
  protected configurarIncludes() {
    return {}; // ct_color no tiene relaciones
  }

  // 🔍 Filtros simples
  protected construirWhereClause(filters?: BuscarColoresInput) {
    const where: any = {};

    if (filters?.nombre_color) {
      where.nombre_color = { contains: filters.nombre_color };
    }

    if (filters?.activo !== undefined) {
      where.activo = filters.activo;
    }

    return where;
  }

  // 🔧 Hook personalizado: validar nombre único
  protected async antesDeCrear(datos: CrearCtColorInput): Promise<void> {
    const existente = await this.model.findFirst({
      where: { nombre_color: datos.nombre_color },
    });

    if (existente) {
      throw new Error("Ya existe un color con este nombre");
    }
  }

  // ¡Solo 40 líneas vs 200+ líneas del servicio manual!
}
```

## 📊 **Comparación: Tradicional vs BaseService**

### ❌ **Servicio Tradicional**

```typescript
export class CtColorService {
  // 200+ líneas de código repetitivo
  async obtenerTodos(filters, pagination) {
    try {
      const page = pagination.page || 1;
      const limit = pagination.limit || 10;
      const skip = (page - 1) * limit;

      const where = {};
      if (filters?.nombre_color) {
        where.nombre_color = { contains: filters.nombre_color };
      }
      // ... 150+ líneas más de código repetitivo
    } catch (error) {
      // ... manejo de errores repetitivo
    }
  }

  async obtenerPorId(id) {
    try {
      // ... código repetitivo
    } catch (error) {
      // ... manejo de errores repetitivo
    }
  }

  // ... métodos CRUD repetitivos
}
```

### ✅ **Con BaseService**

```typescript
export class CtColorService extends BaseService<...> {
  // 40 líneas de código específico
  protected config = { tableName: "ct_color", defaultOrderBy: { nombre_color: "asc" } };
  protected configurarIncludes() { return {}; }
  protected construirWhereClause(filters) { /* lógica específica */ }
  protected async antesDeCrear(datos) { /* validaciones específicas */ }

  // ¡CRUD automático heredado del BaseService!
}
```

## 🏆 **Beneficios del BaseService**

### 🚀 **Para Servicios Simples (ct_color, ct_marca)**

- **-80% menos código** (40 líneas vs 200+)
- **CRUD automático** - solo define la configuración
- **Consistencia garantizada** - mismo comportamiento en todos

### 🎯 **Para Servicios Complejos (ct_unidad)**

- **-50% menos código** (150 líneas vs 300+)
- **Personalización total** - hooks para casos específicos
- **Base sólida** - operaciones comunes ya implementadas
- **Mantenimiento centralizado** - cambios en BaseService afectan todos

## 📝 **Template para Nuevos Servicios**

```typescript
export class MiNuevoService extends BaseService<
  ModeloPrisma,
  CrearInput,
  ActualizarInput,
  FiltrosInput
> {
  protected config = {
    tableName: "nombre_tabla",
    defaultOrderBy: { campo_orden: "asc" as const },
  };

  protected configurarIncludes(filters?: FiltrosInput) {
    return {
      // Tus relaciones específicas
    };
  }

  protected construirWhereClause(filters?: FiltrosInput) {
    const where: any = {};
    // Tus filtros específicos
    return where;
  }

  // Hooks opcionales para validaciones/acciones personalizadas
  protected async antesDeCrear(datos: CrearInput): Promise<void> {
    // Validaciones específicas
  }
}
```

## 🎖️ **Resultado Final**

Con BaseService tienes:

- ✅ **Template reutilizable** para 80% del código común
- ✅ **Puntos de personalización** para el 20% específico
- ✅ **Desarrollo 4x más rápido** para servicios nuevos
- ✅ **Consistencia total** en operaciones CRUD
- ✅ **Mantenimiento centralizado** - cambios se propagan automáticamente

**¡BaseService = Lo mejor de ambos mundos!** 🚀
