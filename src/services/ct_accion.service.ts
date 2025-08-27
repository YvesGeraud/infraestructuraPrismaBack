import { Ct_accion } from "@prisma/client";
import { prisma } from "../config/database";
import { PaginatedResponse } from "../types";
import { PaginationInput } from "../schemas/commonSchemas";
import {
  CrearCtAccionInput,
  ActualizarCtAccionInput,
} from "../schemas/ct_accion.schema";

//TODO ===== SERVICIO PARA CT_ACCION =====

//? ===== TIPOS PARA RESPUESTAS =====
export type CtAccionResponse = Ct_accion;

export class CtAccionService {
  //TODO ===== MÉTODOS PARA CREAR DATOS =====
  //? Crear un nuevo registro de alumno en la escuela

  async createCtAccion(
    ctAccionData: CrearCtAccionInput
  ): Promise<CtAccionResponse> {
    //TODO ===== VALIDACIÓN DE DATOS =====
    //? Verificar si la acción ya existe
    //? Si existe, se lanza un error
    //? Si no existe, se crea la acción

    const accionExistente = await prisma.ct_accion.findFirst({
      where: { nombre_accion: ctAccionData.nombre_accion },
    });

    if (accionExistente) {
      throw new Error("La acción ya existe");
    }

    const accion = await prisma.ct_accion.create({
      data: {
        descripcion: ctAccionData.descripcion,
      },
    });

    return this.mapToCtAccionResponse(accion);
  }
  //todo ===== MÉTODOS PARA OBTENER DATOS =====
  //? Obtener un registro de alumno en la escuela

  async obtenerCtAccion(id_accion: number): Promise<CtAccionResponse | null> {
    const accion = await prisma.ct_accion.findUnique({
      where: { id_accion },
    });

    return accion ? this.mapToCtAccionResponse(accion) : null;
  }

  //? Obtener todos los registros de alumnos en la escuela
  async obtenerTodosLosCtAccion(
    filters: any = {},
    pagination: PaginationInput = {}
  ): Promise<PaginatedResponse<CtAccionResponse>> {
    const pagina = pagination.pagina || 1;
    const limite = pagination.limite || 10;
    const skip = (pagina - 1) * limite;

    // Construir where clause
    const where: any = {};

    if (filters.descripcion) {
      where.descripcion = {
        contains: filters.descripcion,
      };
    }

    //? Obtener todos los registros de alumnos en la escuela
    const [ctAccion, total] = await Promise.all([
      prisma.ct_accion.findMany({
        where,
        skip,
        take: limite,
      }),
      prisma.ct_accion.count({ where }),
    ]);

    const totalPaginas = Math.ceil(total / limite);

    return {
      data: ctAccion.map((ctAccion: any) =>
        this.mapToCtAccionResponse(ctAccion)
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

  //? Actualizar un registro de alumno en la escuela
  async actualizarCtAccion(
    id_accion: number,
    ctAccionData: ActualizarCtAccionInput
  ): Promise<CtAccionResponse> {
    //TODO ===== VALIDACIÓN DE DATOS =====
    //? Verificar si el alumno existe en la escuela
    //* Si existe, se actualiza el alumno
    //! Si no existe, se lanza un error

    const accion = await prisma.ct_accion.findUnique({
      where: { id_accion },
    });

    if (!accion) {
      throw new Error("La acción no existe");
    }

    //? actualizar el alumno
    const accionActualizado = await prisma.ct_accion.update({
      where: { id_accion },
      data: ctAccionData,
    });

    return this.mapToCtAccionResponse(accionActualizado);
  }

  //? Eliminar un registro de alumno en la escuela
  async eliminarCtAccion(id_accion: number): Promise<void> {
    const accion = await prisma.ct_accion.findUnique({
      where: { id_accion },
    });

    if (!accion) {
      throw new Error("La acción no existe");
    }

    //? Eliminar el alumno
    await prisma.ct_accion.delete({
      where: { id_accion },
    });
  }

  //TODO ===== MÉTODOS PRIVADOS =====
  //? sirven para mapear los datos de la base de datos a los datos de la respuesta

  private mapToCtAccionResponse(ctAccion: Ct_accion): CtAccionResponse {
    return {
      id_accion: ctAccion.id_accion,
      nombre_accion: ctAccion.nombre_accion,
      descripcion: ctAccion.descripcion,
    };
  }
}
