import { Ct_infraestructura_unidad } from "@prisma/client";
import { prisma } from "../../config/database";
import { PaginatedResponse } from "../../types";
import { PaginationInput } from "../../schemas/commonSchemas";
import {
  CrearCtUnidadInput,
  ActualizarCtUnidadInput,
  BuscarUnidadesInput,
  UnidadesPorMunicipioInput,
  UnidadesPorCCTInput,
} from "../../schemas/infraestructura/ct_unidad.schema";

//TODO ===== SERVICIO PARA CT_INFRAESTRUCTURA_UNIDAD =====

//? ===== TIPOS PARA RESPUESTAS =====
export type CtUnidadResponse = Ct_infraestructura_unidad;

export class CtUnidadService {
  //TODO ===== MÉTODOS PARA CREAR DATOS =====
  //? Crear una nueva unidad de infraestructura

  async crearUnidad(unidadData: CrearCtUnidadInput): Promise<CtUnidadResponse> {
    //TODO ===== VALIDACIÓN DE DATOS =====
    //? Verificar si la unidad ya existe por CCT
    //? Si existe, se lanza un error
    //? Si no existe, se crea la unidad

    const unidadExistente = await prisma.ct_infraestructura_unidad.findFirst({
      where: { cct: unidadData.cct },
    });

    if (unidadExistente) {
      throw new Error("Ya existe una unidad con este CCT");
    }

    const unidad = await prisma.ct_infraestructura_unidad.create({
      data: unidadData,
    });

    return unidad; // No es necesario mapear, devolvemos directamente
  }

  //TODO ===== MÉTODOS PARA OBTENER DATOS =====
  //? Obtener una unidad por ID

  async obtenerUnidadPorId(
    id_unidad: number
  ): Promise<CtUnidadResponse | null> {
    const unidad = await prisma.ct_infraestructura_unidad.findUnique({
      where: { id_unidad },
      include: {
        ct_infraestructura_tipo_escuela: true,
        ct_localidad: true,
        ct_infraestructura_sostenimiento: true,
      },
    });

    return unidad; // No es necesario mapear
  }

  //? Obtener todas las unidades con filtros y paginación
  async obtenerUnidades(
    filters: BuscarUnidadesInput = {},
    pagination: PaginationInput = {}
  ): Promise<PaginatedResponse<CtUnidadResponse>> {
    const page = pagination.page || 1;
    const limit = pagination.limit || 10;
    const skip = (page - 1) * limit;

    // Construir where clause
    const where: any = {};

    if (filters.cct) {
      where.cct = { contains: filters.cct };
    }

    if (filters.nombre_unidad) {
      where.nombre_unidad = { contains: filters.nombre_unidad };
    }

    if (filters.id_localidad) {
      where.id_localidad = filters.id_localidad;
    }

    if (filters.id_sostenimiento) {
      where.id_sostenimiento = filters.id_sostenimiento;
    }

    if (filters.vigente !== undefined) {
      where.vigente = filters.vigente;
    }

    if (filters.id_tipo_escuela) {
      where.id_tipo_escuela = filters.id_tipo_escuela;
    }

    //? Obtener todas las unidades
    const [unidades, total] = await Promise.all([
      prisma.ct_infraestructura_unidad.findMany({
        where,
        skip,
        take: limit,
        include: {
          ct_infraestructura_tipo_escuela: true,
          ct_localidad: true,
          ct_infraestructura_sostenimiento: true,
        },
        orderBy: { id_unidad: "asc" },
      }),
      prisma.ct_infraestructura_unidad.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: unidades, // No es necesario mapear
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  //? Obtener unidades por municipio
  async obtenerUnidadesPorMunicipio(
    params: UnidadesPorMunicipioInput
  ): Promise<CtUnidadResponse[]> {
    const unidades = await prisma.ct_infraestructura_unidad.findMany({
      where: {
        ct_localidad: {
          ct_municipio: {
            cve_mun: params.cve_mun,
          },
        },
      },
      include: {
        ct_infraestructura_tipo_escuela: true,
        ct_localidad: {
          include: {
            ct_municipio: true,
          },
        },
        ct_infraestructura_sostenimiento: true,
      },
      orderBy: { nombre_unidad: "asc" },
    });

    return unidades; // No es necesario mapear
  }

  //? Obtener unidades por CCT
  async obtenerUnidadesPorCCT(
    params: UnidadesPorCCTInput
  ): Promise<CtUnidadResponse[]> {
    const unidades = await prisma.ct_infraestructura_unidad.findMany({
      where: {
        cct: { contains: params.cct },
      },
      include: {
        ct_infraestructura_tipo_escuela: true,
        ct_localidad: true,
        ct_infraestructura_sostenimiento: true,
      },
      orderBy: { nombre_unidad: "asc" },
    });

    return unidades; // No es necesario mapear
  }

  //? Actualizar una unidad
  async actualizarUnidad(
    id_unidad: number,
    unidadData: ActualizarCtUnidadInput
  ): Promise<CtUnidadResponse> {
    //TODO ===== VALIDACIÓN DE DATOS =====
    //? Verificar si la unidad existe
    //* Si existe, se actualiza la unidad
    //! Si no existe, se lanza un error

    const unidad = await prisma.ct_infraestructura_unidad.findUnique({
      where: { id_unidad },
    });

    if (!unidad) {
      throw new Error("La unidad no existe");
    }

    //? Actualizar la unidad
    const unidadActualizada = await prisma.ct_infraestructura_unidad.update({
      where: { id_unidad },
      data: unidadData,
      include: {
        ct_infraestructura_tipo_escuela: true,
        ct_localidad: true,
        ct_infraestructura_sostenimiento: true,
      },
    });

    return unidadActualizada; // No es necesario mapear
  }

  //? Eliminar una unidad
  async eliminarUnidad(id_unidad: number): Promise<void> {
    const unidad = await prisma.ct_infraestructura_unidad.findUnique({
      where: { id_unidad },
    });

    if (!unidad) {
      throw new Error("La unidad no existe");
    }

    //? Eliminar la unidad
    await prisma.ct_infraestructura_unidad.delete({
      where: { id_unidad },
    });
  }
}
