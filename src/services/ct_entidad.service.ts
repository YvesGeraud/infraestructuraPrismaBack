import { Ct_entidad } from "@prisma/client";
import { prisma } from "../config/database";
import { PaginatedResponse } from "../types";
import { PaginationInput } from "../schemas/commonSchemas";
import {
  CrearCtEntidadInput,
  ActualizarCtEntidadInput,
} from "../schemas/ct_entidad.schema";

//TODO ===== SERVICIO PARA CT_ENTIDAD =====

//? ===== TIPOS PARA RESPUESTAS =====
export type CtEntidadResponse = Ct_entidad;

export class CtEntidadService {
  //TODO ===== MÉTODOS PARA CREAR DATOS =====
  //? Crear una nueva entidad

  async createCtEntidad(
    ctEntidadData: CrearCtEntidadInput
  ): Promise<CtEntidadResponse> {
    //TODO ===== VALIDACIÓN DE DATOS =====
    //? Verificar si la entidad ya existe
    //? Si existe, se lanza un error
    //? Si no existe, se crea la entidad

    const entidadExistente = await prisma.ct_entidad.findFirst({
      where: { nombre: ctEntidadData.nombre },
    });

    if (entidadExistente) {
      throw new Error("La entidad ya existe");
    }

    const entidad = await prisma.ct_entidad.create({
      data: {
        nombre: ctEntidadData.nombre,
        abreviatura: ctEntidadData.abreviatura,
      },
    });

    return this.mapToCtEntidadResponse(entidad);
  }
  //todo ===== MÉTODOS PARA OBTENER DATOS =====
  //? Obtener una entidad

  async obtenerCtEntidad(
    id_entidad: number
  ): Promise<CtEntidadResponse | null> {
    const entidad = await prisma.ct_entidad.findUnique({
      where: { id_entidad },
    });

    return entidad ? this.mapToCtEntidadResponse(entidad) : null;
  }

  //? Obtener todas las entidades
  async obtenerTodosLosCtEntidad(
    filters: any = {},
    pagination: PaginationInput = {}
  ): Promise<PaginatedResponse<CtEntidadResponse>> {
    const pagina = pagination.pagina || 1;
    const limite = pagination.limite || 10;
    const skip = (pagina - 1) * limite;

    // Construir where clause
    const where: any = {};

    if (filters.nombre) {
      where.nombre = {
        contains: filters.nombre,
      };
    }

    //? Obtener todas las entidades
    const [ctEntidad, total] = await Promise.all([
      prisma.ct_entidad.findMany({
        where,
        skip,
        take: limite,
      }),
      prisma.ct_entidad.count({ where }),
    ]);

    const totalPaginas = Math.ceil(total / limite);

    return {
      data: ctEntidad.map((ctEntidad: any) =>
        this.mapToCtEntidadResponse(ctEntidad)
      ),
      pagination: {
        pagina,
        limite,
        total,
        totalPaginas,
        tieneSiguiente: pagina < totalPaginas,
        tieneAnterior: pagina > 1,
      },
    };
  }

  //? Actualizar una entidad
  async actualizarCtEntidad(
    id_entidad: number,
    ctEntidadData: ActualizarCtEntidadInput
  ): Promise<CtEntidadResponse> {
    //TODO ===== VALIDACIÓN DE DATOS =====
    //? Verificar si la entidad existe
    //* Si existe, se actualiza la entidad
    //! Si no existe, se lanza un error

    const entidad = await prisma.ct_entidad.findUnique({
      where: { id_entidad },
    });

    if (!entidad) {
      throw new Error("La entidad no existe");
    }

    //? actualizar la entidad
    const entidadActualizado = await prisma.ct_entidad.update({
      where: { id_entidad },
      data: ctEntidadData,
    });

    return this.mapToCtEntidadResponse(entidadActualizado);
  }

  //? Eliminar una entidad
  async eliminarCtEntidad(id_entidad: number): Promise<void> {
    const entidad = await prisma.ct_entidad.findUnique({
      where: { id_entidad },
    });

    if (!entidad) {
      throw new Error("La entidad no existe");
    }

    //? Eliminar la entidad
    await prisma.ct_entidad.delete({
      where: { id_entidad },
    });
  }

  //TODO ===== MÉTODOS PRIVADOS =====
  //? sirven para mapear los datos de la base de datos a los datos de la respuesta

  private mapToCtEntidadResponse(ctEntidad: Ct_entidad): CtEntidadResponse {
    return {
      id_entidad: ctEntidad.id_entidad,
      nombre: ctEntidad.nombre,
      abreviatura: ctEntidad.abreviatura,
    };
  }
}
