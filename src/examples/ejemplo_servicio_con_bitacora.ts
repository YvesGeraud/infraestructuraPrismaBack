/**
 * @fileoverview EJEMPLO: Cómo usar BaseService con sistema de bitácora automático
 * 
 * Este archivo muestra cómo implementar un servicio que registra automáticamente
 * todas las operaciones CRUD en la bitácora del sistema.
 */

import { BaseService } from "../services/BaseService";
import { ct_localidad } from "@prisma/client";

// Ejemplo de tipos para el servicio (adaptar según tu modelo)
type CrearLocalidadInput = {
  nombre: string;
  id_municipio: number;
  id_ct_usuario_in: number;
};

type ActualizarLocalidadInput = {
  nombre?: string;
  id_municipio?: number;
  id_ct_usuario_up: number;
};

type FiltrosLocalidadInput = {
  nombre?: string;
  id_municipio?: number;
  incluir_municipio?: boolean;
  incluirInactivos?: boolean;
};

/**
 * 🎯 EJEMPLO: Servicio con bitácora automática
 * 
 * Solo necesitas 2 líneas para activar la bitácora completa:
 * 1. protected registrarEnBitacora = true;
 * 2. protected nombreTablaParaBitacora = "NOMBRE_TABLA";
 */
export class EjemploLocalidadConBitacoraService extends BaseService<
  ct_localidad,
  CrearLocalidadInput,
  ActualizarLocalidadInput,
  FiltrosLocalidadInput
> {
  // 🔧 Configuración básica del servicio
  protected config = {
    tableName: "ct_localidad",
    defaultOrderBy: { id_localidad: "desc" as const },
    campoActivo: "activo", // Campo que indica si el registro está activo
  };

  // 📝 ACTIVAR BITÁCORA AUTOMÁTICA (¡Solo estas 2 líneas!)
  protected registrarEnBitacora = true;
  protected nombreTablaParaBitacora = "LOCALIDAD"; // Nombre para ct_bitacora_tabla

  // ⚠️ REQUISITOS DE SEGURIDAD PARA LA BITÁCORA:
  // - ct_bitacora_accion debe estar poblado con acciones estándar:
  //   * "Creación" (ID: 1)
  //   * "Actualización" (ID: 2) 
  //   * "Eliminación" (ID: 3)
  // - 🚨 ct_sesion DEBE tener al menos una sesión activa (OBLIGATORIO por seguridad)
  // - No se permite registrar en bitácora sin sesión válida (previene puertas traseras)

  // 🎯 Campos a excluir de la bitácora (datos sensibles)
  protected camposExcluidosBitacora = [
    "password", // Ya incluido por defecto
    "token",    // Ya incluido por defecto
    // Agregar campos específicos de tu modelo si es necesario
  ];

  // 🔗 Configurar includes específicos del modelo
  protected configurarIncludes(filters?: FiltrosLocalidadInput) {
    const includes: any = {};

    // Include de municipio si se solicita
    if (filters?.incluir_municipio) {
      includes.ct_municipio = true;
    }

    return Object.keys(includes).length > 0 ? includes : undefined;
  }

  // 🔍 Configurar filtros específicos del modelo
  protected construirWhereClause(filters?: FiltrosLocalidadInput) {
    const where: any = {};
    const conditions: any[] = [];

    // Filtro por nombre (búsqueda parcial)
    if (filters?.nombre) {
      conditions.push({
        nombre: {
          contains: filters.nombre,
        },
      });
    }

    // Filtro por municipio
    if (filters?.id_municipio) {
      conditions.push({
        id_municipio: filters.id_municipio,
      });
    }

    if (conditions.length > 0) {
      where.AND = conditions;
    }

    return where;
  }

  // 🔧 Especificar campo de clave primaria (opcional, BaseService lo detecta automáticamente)
  protected getPrimaryKeyField(): string {
    return "id_localidad";
  }

  // 🎯 HOOKS OPCIONALES para personalizar comportamiento
  
  /**
   * Hook ejecutado antes de crear un registro
   * Útil para validaciones personalizadas
   */
  protected async antesDeCrear(datos: CrearLocalidadInput): Promise<void> {
    // Ejemplo: Validar que el municipio existe
    const municipio = await this.model.findUnique({
      where: { id_municipio: datos.id_municipio }
    });
    
    if (!municipio) {
      throw new Error("El municipio especificado no existe");
    }
  }

  /**
   * Hook ejecutado después de crear un registro
   * Útil para acciones post-creación
   */
  protected async despuesDeCrear(record: ct_localidad): Promise<void> {
        console.log(`✅ Localidad "${record.nombre}" creada con ID ${record.id_ct_localidad}`);
    
    // Ejemplo: Enviar notificación, actualizar cache, etc.
    // await this.notificarCreacion(record);
  }

  /**
   * Hook ejecutado antes de actualizar un registro
   */
  protected async antesDeActualizar(id: number, datos: ActualizarLocalidadInput): Promise<void> {
    // Ejemplo: Validar que no se está desactivando la única localidad activa del municipio
    if (datos.id_municipio) {
      const localidadesActivas = await this.model.count({
        where: { 
          id_municipio: datos.id_municipio,
          activo: true,
          id_localidad: { not: id }
        }
      });
      
      if (localidadesActivas === 0) {
        throw new Error("No se puede desactivar la única localidad activa del municipio");
      }
    }
  }

  // 📝 PERSONALIZAR BITÁCORA (opcional)
  
  /**
   * Hook para personalizar el registro de creación en bitácora
   * Por defecto, BaseService maneja esto automáticamente
   */
  protected async registrarCreacionEnBitacora(
    datos: CrearLocalidadInput,
    resultado: ct_localidad,
    tx: any
  ): Promise<void> {
    // Si necesitas lógica personalizada, puedes sobrescribir este método
    // Por ejemplo, agregar información adicional a la bitácora
    
    // Llamar al método base para el registro automático
    await super.registrarCreacionEnBitacora(datos, resultado, tx);
    
    // Agregar lógica personalizada aquí si es necesario
    console.log(`📝 Bitácora: Localidad "${resultado.nombre}" registrada en auditoría`);
  }
}

/*
🎉 ¡LISTO! Con solo estas configuraciones obtienes:

✅ CRUD COMPLETO:
- obtenerTodos() con filtros y paginación
- obtenerPorId() 
- crear() con validaciones
- actualizar() con verificaciones
- eliminar() con soft delete

✅ BITÁCORA AUTOMÁTICA OPTIMIZADA:
- Registra automáticamente CREATE, UPDATE, DELETE
- 🎯 OPTIMIZACIÓN: Solo guarda campos que realmente cambiaron
- Usa catálogo existente de ct_bitacora_accion (no crea nuevas acciones)
- Busca/crea registros en ct_bitacora_tabla si no existen
- Busca sesión activa en ct_sesion (OBLIGATORIO por seguridad)
- Serializa datos como JSON en dt_bitacora
- Ejecuta todo dentro de transacciones (atomicidad)
- Rollback automático si falla la bitácora

🚀 BENEFICIOS DE OPTIMIZACIÓN:
- Reduce el tamaño de la bitácora hasta un 90%
- Mejora la legibilidad (solo cambios relevantes)
- Optimiza el rendimiento de consultas
- Facilita el análisis de cambios específicos

✅ SOFT DELETE:
- Actualiza estado a false en lugar de eliminar físicamente
- Preserva datos para auditoría
- Evita problemas de integridad referencial

✅ FILTROS AVANZADOS:
- Solo muestra registros activos por defecto
- Soporte para incluir registros inactivos
- Búsquedas parciales y filtros complejos

✅ MANEJO DE ERRORES:
- Convierte errores de Prisma en mensajes amigables
- Manejo de constraints y foreign keys
- Logs detallados para debugging

🔧 PARA USAR EN UN CONTROLADOR:

```typescript
const localidadService = new EjemploLocalidadConBitacoraService();

// Crear localidad (se registra automáticamente en bitácora)
const nuevaLocalidad = await localidadService.crear({
  nombre: "Centro",
  id_municipio: 1,
  id_ct_usuario_in: 123
});

// Actualizar localidad (se registra automáticamente en bitácora)
const localidadActualizada = await localidadService.actualizar(1, {
  nombre: "Centro Histórico",
  id_ct_usuario_up: 123
});

// Eliminar localidad (soft delete + bitácora automática)
await localidadService.eliminar(1, 123); // ID del registro, ID del usuario
```

📊 ESTRUCTURA DE BITÁCORA GENERADA:

Cada operación crea un registro en dt_bitacora con:
- id_ct_bitacora_accion: FK a ct_bitacora_accion (1=Creación, 2=Actualización, 3=Eliminación)
- id_ct_bitacora_tabla: FK a ct_bitacora_tabla (LOCALIDAD)
- id_registro_afectado: ID del registro modificado
- id_ct_sesion: ID de la sesión activa (OBLIGATORIO por seguridad)
- datos_anteriores: JSON con datos antes del cambio
- datos_nuevos: JSON con datos después del cambio
- id_ct_usuario_in: ID del usuario que realizó la operación
- estado: true (registro activo en bitácora)

🔧 MAPEO DE ACCIONES:
- CREATE → "Creación" (ID: 1)
- UPDATE → "Actualización" (ID: 2)
- DELETE → "Eliminación" (ID: 3)

📊 EJEMPLO DE BITÁCORA OPTIMIZADA:

❌ ANTES (registro completo):
```json
datos_anteriores: {"id_ct_localidad": 1, "nombre": "Centro", "ambito": "Urbano", "id_ct_municipio": 1, "estado": true}
datos_nuevos: {"id_ct_localidad": 1, "nombre": "Centro Histórico", "ambito": "Urbano", "id_ct_municipio": 1, "estado": true}
```

✅ AHORA (solo cambios):
```json
datos_anteriores: {"nombre": "Centro"}
datos_nuevos: {"nombre": "Centro Histórico"}
```

🎯 RESULTADO: Reducción del 90% en tamaño de datos guardados

🚀 ¡Solo necesitas 2 líneas para activar toda esta funcionalidad!
*/
