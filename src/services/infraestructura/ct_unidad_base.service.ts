/**
 * @fileoverview Servicio de ct_unidad usando BaseService
 * Prueba de concepto para ver cómo se simplifica el código
 */

import { BaseService } from "../BaseService";
import { Ct_infraestructura_unidad } from "@prisma/client";
import {
  CrearCtUnidadInput,
  ActualizarCtUnidadInput,
  BuscarUnidadesInput,
  UnidadesPorMunicipioInput,
  UnidadesPorCCTInput,
} from "../../schemas/infraestructura/ct_unidad.schema";

//TODO ===== SERVICIO PARA CT_INFRAESTRUCTURA_UNIDAD CON BASE SERVICE =====

export class CtUnidadBaseService extends BaseService<
  Ct_infraestructura_unidad,
  CrearCtUnidadInput,
  ActualizarCtUnidadInput,
  BuscarUnidadesInput
> {
  // 🔧 Configuración específica del modelo
  protected config = {
    tableName: "ct_infraestructura_unidad",
    defaultOrderBy: { id_unidad: "asc" as const },
  };

  // 🔗 Configurar includes específicos de unidades
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

  // 🔍 Construir filtros específicos de unidades
  protected construirWhereClause(filters?: BuscarUnidadesInput) {
    const where: any = {};

    if (filters?.cct) {
      where.cct = { contains: filters.cct };
    }

    if (filters?.nombre_unidad) {
      where.nombre_unidad = { contains: filters.nombre_unidad };
    }

    if (filters?.id_localidad) {
      where.id_localidad = filters.id_localidad;
    }

    if (filters?.id_sostenimiento) {
      where.id_sostenimiento = filters.id_sostenimiento;
    }

    if (filters?.vigente !== undefined) {
      where.vigente = filters.vigente;
    }

    if (filters?.id_tipo_escuela) {
      where.id_tipo_escuela = filters.id_tipo_escuela;
    }

    // Filtro por municipio usando cve_mun
    if (filters?.municipio_cve) {
      where.ct_localidad = {
        ct_municipio: {
          cve_mun: filters.municipio_cve,
        },
      };
    }

    return where;
  }

  // 🔧 Hook personalizado: validar CCT único antes de crear
  protected async antesDeCrear(datos: CrearCtUnidadInput): Promise<void> {
    if (datos.cct) {
      const unidadExistente = await this.model.findFirst({
        where: { cct: datos.cct },
      });

      if (unidadExistente) {
        throw new Error("Ya existe una unidad con este CCT");
      }
    }
  }

  // 🔧 Sobrescribir el campo de clave primaria
  protected getPrimaryKeyField(): string {
    return "id_unidad";
  }

  // ==========================================
  // MÉTODOS ADICIONALES ESPECÍFICOS DE UNIDADES
  // ==========================================

  /**
   * 📍 Obtener unidad por CCT
   */
  async obtenerPorCCT(cct: string): Promise<Ct_infraestructura_unidad | null> {
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

  /**
   * 🗺️ Obtener unidades por municipio
   */
  async obtenerPorMunicipio(
    params: UnidadesPorMunicipioInput
  ): Promise<Ct_infraestructura_unidad[]> {
    try {
      const unidades = await this.model.findMany({
        where: {
          ct_localidad: {
            ct_municipio: {
              cve_mun: params.cve_mun,
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

  /**
   * 🔍 Obtener unidades por CCT (búsqueda parcial)
   */
  async obtenerPorCCTBusqueda(
    params: UnidadesPorCCTInput
  ): Promise<Ct_infraestructura_unidad[]> {
    try {
      const unidades = await this.model.findMany({
        where: {
          cct: { contains: params.cct },
        },
        include: this.configurarIncludes(),
        orderBy: this.config.defaultOrderBy,
      });
      return unidades;
    } catch (error) {
      console.error("Error al obtener unidades por CCT:", error);
      throw new Error("Error al obtener unidades por CCT");
    }
  }

  /**
   * 📝 Buscar unidades por nombre (método de conveniencia)
   */
  async buscarPorNombre(
    nombre: string,
    limite: number = 10
  ): Promise<Ct_infraestructura_unidad[]> {
    try {
      const filtros: BuscarUnidadesInput = {
        nombre_unidad: nombre,
      };
      const paginacion = { page: 1, limit: limite };

      const resultado = await this.obtenerTodos(filtros, paginacion);
      return resultado.data;
    } catch (error) {
      console.error("Error al buscar unidades por nombre:", error);
      throw new Error("Error al buscar unidades por nombre");
    }
  }

  // ==========================================
  // MÉTODOS LEGACY PARA COMPATIBILIDAD
  // ==========================================

  /**
   * Método legacy - obtener todas las unidades
   */
  async obtenerUnidades(): Promise<Ct_infraestructura_unidad[]> {
    const resultado = await this.obtenerTodos({}, { page: 1, limit: 100 });
    return resultado.data;
  }

  /**
   * Método legacy - obtener unidad por ID
   */
  async obtenerUnidadPorId(
    id: number
  ): Promise<Ct_infraestructura_unidad | null> {
    return await this.obtenerPorId(id);
  }

  /**
   * Método legacy - obtener unidades por municipio
   */
  async obtenerUnidadesPorMunicipio(
    idMunicipio: number
  ): Promise<Ct_infraestructura_unidad[]> {
    // Necesitaríamos obtener el cve_mun del idMunicipio
    // Por simplicidad, mantenemos la funcionalidad original
    try {
      const unidades = await this.model.findMany({
        where: {
          ct_localidad: {
            id_municipio: idMunicipio,
          },
        },
        include: this.configurarIncludes(),
        orderBy: this.config.defaultOrderBy,
      });
      return unidades;
    } catch (error) {
      console.error("Error al obtener unidades por municipio (legacy):", error);
      throw new Error("Error al obtener unidades por municipio");
    }
  }

  /**
   * Método legacy - crear unidad
   */
  async crearUnidad(
    datos: CrearCtUnidadInput
  ): Promise<Ct_infraestructura_unidad> {
    return await this.crear(datos);
  }

  /**
   * Método legacy - actualizar unidad
   */
  async actualizarUnidad(
    id: number,
    datos: ActualizarCtUnidadInput
  ): Promise<Ct_infraestructura_unidad> {
    return await this.actualizar(id, datos);
  }

  /**
   * Método legacy - eliminar unidad
   */
  async eliminarUnidad(id: number): Promise<void> {
    await this.eliminar(id);
  }
}
