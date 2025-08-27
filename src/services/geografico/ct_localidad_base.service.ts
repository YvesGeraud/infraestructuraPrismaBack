/**
 * @fileoverview Servicio de ct_localidad usando BaseService
 * Ejemplo de tabla fuera de carpetas estándar (geografico)
 */

import { BaseService } from "../BaseService";
import { Ct_localidad } from "@prisma/client";

//TODO ===== SERVICIO PARA CT_LOCALIDAD CON BASE SERVICE =====

interface CrearLocalidadInput {
  nombre_localidad: string;
  id_municipio: number;
  cve_localidad?: string;
}

interface ActualizarLocalidadInput {
  nombre_localidad?: string;
  id_municipio?: number;
  cve_localidad?: string;
}

interface FiltrosLocalidad {
  nombre_localidad?: string;
  id_municipio?: number;
  cve_localidad?: string;
}

export class CtLocalidadBaseService extends BaseService<
  Ct_localidad,
  CrearLocalidadInput,
  ActualizarLocalidadInput,
  FiltrosLocalidad
> {
  // 🔧 Configuración específica del modelo
  protected config = {
    tableName: "ct_localidad", // ✅ Sin prefijo - será detectado automáticamente
    defaultOrderBy: { nombre_localidad: "asc" as const },
  };

  // 🔗 Includes con municipio
  protected configurarIncludes(filters?: FiltrosLocalidad) {
    return {
      ct_municipio: true, // Incluir datos del municipio
    };
  }

  // 🔍 Filtros específicos para localidades
  protected construirWhereClause(filters?: FiltrosLocalidad) {
    const where: any = {};

    if (filters?.nombre_localidad) {
      where.nombre_localidad = { contains: filters.nombre_localidad };
    }

    if (filters?.id_municipio) {
      where.id_municipio = filters.id_municipio;
    }

    if (filters?.cve_localidad) {
      where.cve_localidad = { contains: filters.cve_localidad };
    }

    return where;
  }

  // ✅ NO necesitamos sobreescribir getPrimaryKeyField()
  // El algoritmo inteligente detecta: ct_localidad → id_localidad

  // ==========================================
  // MÉTODOS ESPECÍFICOS DE LOCALIDAD
  // ==========================================

  /**
   * 🗺️ Obtener localidades por municipio
   */
  async obtenerPorMunicipio(idMunicipio: number): Promise<Ct_localidad[]> {
    try {
      const filtros: FiltrosLocalidad = { id_municipio: idMunicipio };
      const resultado = await this.obtenerTodos(filtros, {
        page: 1,
        limit: 1000,
      });
      return resultado.data;
    } catch (error) {
      console.error("Error al obtener localidades por municipio:", error);
      throw new Error("Error al obtener localidades por municipio");
    }
  }

  /**
   * 🔍 Buscar localidad por clave
   */
  async obtenerPorClave(cveLocalidad: string): Promise<Ct_localidad | null> {
    try {
      const localidades = await this.model.findFirst({
        where: { cve_localidad: cveLocalidad },
        include: this.configurarIncludes(),
      });
      return localidades;
    } catch (error) {
      console.error("Error al obtener localidad por clave:", error);
      throw new Error("Error al obtener localidad por clave");
    }
  }
}

// 🎉 RESULTADO: Solo 25 líneas para CRUD completo con relaciones
// ✅ Detección automática de PK: id_localidad
// ✅ Incluye relación con ct_municipio
// ✅ Filtros específicos para búsquedas geográficas
// ✅ Métodos adicionales para casos de uso comunes
