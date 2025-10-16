/**
 * @fileoverview Servicio de dt_infraestructura_ubicacion usando BaseService
 * Tabla principal de ubicaciones de infraestructura
 */

import { BaseService } from "../BaseService";
import { dt_infraestructura_ubicacion } from "@prisma/client";
import {
  CrearDtInfraestructuraUbicacionInput,
  ActualizarDtInfraestructuraUbicacionInput,
  BuscarDtInfraestructuraUbicacionInput,
} from "../../schemas/infraestructura/dt_infraestructura_ubicacion.schema";

//TODO ===== SERVICIO PARA DT_INFRAESTRUCTURA_UBICACION CON BASE SERVICE =====

export class DtInfraestructuraUbicacionBaseService extends BaseService<
  dt_infraestructura_ubicacion,
  CrearDtInfraestructuraUbicacionInput,
  ActualizarDtInfraestructuraUbicacionInput,
  BuscarDtInfraestructuraUbicacionInput
> {
  // 🔧 Configuración específica del modelo
  protected config = {
    tableName: "dt_infraestructura_ubicacion",
    defaultOrderBy: { id_dt_infraestructura_ubicacion: "desc" as const }, // Más recientes primero
    campoActivo: "estado",
  };

  // 🔗 Includes condicionales basados en filtros
  protected configurarIncludes(filters?: BuscarDtInfraestructuraUbicacionInput) {
    const includes: any = {};

    // Include individual de localidad
    if (filters?.incluir_localidad) {
      includes.ct_localidad = true;
    }

    // Include individual de código postal
    if (filters?.incluir_codigo_postal) {
      includes.ct_codigo_postal = true;
    }

    // Include de todas las relaciones
    if (filters?.incluir_todas_relaciones) {
      includes.ct_localidad = true;
      includes.ct_codigo_postal = true;
    }

    // 🎯 IMPORTANTE: Si no hay includes, retornar undefined
    return Object.keys(includes).length > 0 ? includes : undefined;
  }

  // 🔍 Filtros específicos para ubicaciones
  protected construirWhereClause(filters?: BuscarDtInfraestructuraUbicacionInput) {
    const where: any = {};
    const conditions: any[] = [];

    // Filtro por ID
    if (filters?.id_dt_infraestructura_ubicacion) {
      conditions.push({
        id_dt_infraestructura_ubicacion: filters.id_dt_infraestructura_ubicacion,
      });
    }

    // Filtro por calle (búsqueda parcial)
    if (filters?.calle) {
      conditions.push({
        calle: {
          contains: filters.calle,
        },
      });
    }

    // Filtro por colonia (búsqueda parcial)
    if (filters?.colonia) {
      conditions.push({
        colonia: {
          contains: filters.colonia,
        },
      });
    }

    // Filtro por localidad
    if (filters?.id_ct_localidad) {
      conditions.push({
        id_ct_localidad: filters.id_ct_localidad,
      });
    }

    // Filtro por código postal
    if (filters?.id_ct_codigo_postal) {
      conditions.push({
        id_ct_codigo_postal: filters.id_ct_codigo_postal,
      });
    }

    // Si hay condiciones, usar AND, sino where vacío
    if (conditions.length > 0) {
      where.AND = conditions;
    }

    return where;
  }

  // 🔧 Sobrescribir campo PK
  protected getPrimaryKeyField(): string {
    return "id_dt_infraestructura_ubicacion";
  }

  // ===========================================
  // 📝 BITÁCORA AUTOMÁTICA ACTIVADA ✅
  // ===========================================
  // BaseService registrará automáticamente CREATE, UPDATE, DELETE
  // en dt_bitacora usando los catálogos de acciones y tablas

  protected registrarEnBitacora = true;
  protected nombreTablaParaBitacora = "dt_infraestructura_ubicacion"; // Nombre exacto de la tabla

  // ✨ ¡CRUD COMPLETO AUTOMÁTICAMENTE!
  // - obtenerTodos() con paginación ✅
  // - obtenerPorId() ✅
  // - crear() con validaciones ✅
  // - actualizar() con verificaciones ✅
  // - eliminar() con manejo de errores ✅
}
