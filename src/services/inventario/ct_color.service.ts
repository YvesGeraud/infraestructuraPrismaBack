import { Ct_inventario_color } from "@prisma/client";
import { prisma } from "../../config/database";
import { PaginatedResponse } from "../../types";
import { PaginationInput } from "../../schemas/commonSchemas";
import {
  CrearCtColorInput,
  ActualizarCtColorInput,
} from "../../schemas/inventario/ct_color.schemas";

//TODO ===== SERVICIO PARA CT_COLOR =====

//? ===== TIPOS PARA RESPUESTAS =====
export type CtColorResponse = Ct_inventario_color;

export class CtColorService {
  //TODO ===== MÉTODOS PARA CREAR DATOS =====
  //? Crear un nuevo registro de alumno en la escuela

  async createCtColor(
    ctColorData: CrearCtColorInput
  ): Promise<CtColorResponse> {
    //TODO ===== VALIDACIÓN DE DATOS =====
    //? Verificar si el color ya existe
    //? Si existe, se lanza un error
    //? Si no existe, se crea el color

    const colorExistente = await prisma.ct_inventario_color.findUnique({
      where: { descripcion: ctColorData.descripcion },
    });

    if (colorExistente) {
      throw new Error("El color ya existe");
    }

    const color = await prisma.ct_inventario_color.create({
      data: {
        descripcion: ctColorData.descripcion,
      },
    });

    return this.mapToCtColorResponse(color);
  }
  //todo ===== MÉTODOS PARA OBTENER DATOS =====
  //? Obtener un registro de alumno en la escuela

  async obtenerCtColor(id_color: number): Promise<CtColorResponse | null> {
    const color = await prisma.ct_inventario_color.findUnique({
      where: { id_color },
    });

    return color ? this.mapToCtColorResponse(color) : null;
  }

  //? Obtener todos los registros de alumnos en la escuela
  async obtenerTodosLosCtColor(
    filters: any = {},
    pagination: PaginationInput = {}
  ): Promise<PaginatedResponse<CtColorResponse>> {
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
    const [ctColor, total] = await Promise.all([
      prisma.ct_inventario_color.findMany({
        where,
        skip,
        take: limite,
      }),
      prisma.ct_inventario_color.count({ where }),
    ]);

    const totalPaginas = Math.ceil(total / limite);

    return {
      data: ctColor.map((ctColor: any) => this.mapToCtColorResponse(ctColor)),
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
  async actualizarCtColor(
    id_color: number,
    ctColorData: ActualizarCtColorInput
  ): Promise<CtColorResponse> {
    //TODO ===== VALIDACIÓN DE DATOS =====
    //? Verificar si el alumno existe en la escuela
    //* Si existe, se actualiza el alumno
    //! Si no existe, se lanza un error

    const color = await prisma.ct_inventario_color.findUnique({
      where: { id_color },
    });

    if (!color) {
      throw new Error("El color no existe");
    }

    //? actualizar el alumno
    const colorActualizado = await prisma.ct_inventario_color.update({
      where: { id_color },
      data: ctColorData,
    });

    return this.mapToCtColorResponse(colorActualizado);
  }

  //? Eliminar un registro de alumno en la escuela
  async eliminarCtColor(id_color: number): Promise<void> {
    const color = await prisma.ct_inventario_color.findUnique({
      where: { id_color },
    });

    if (!color) {
      throw new Error("El color no existe");
    }

    //? Eliminar el alumno
    await prisma.ct_inventario_color.delete({
      where: { id_color },
    });
  }

  //TODO ===== MÉTODOS PRIVADOS =====
  //? sirven para mapear los datos de la base de datos a los datos de la respuesta

  private mapToCtColorResponse(ctColor: Ct_inventario_color): CtColorResponse {
    return {
      id_color: ctColor.id_color,
      descripcion: ctColor.descripcion,
    };
  }
}
