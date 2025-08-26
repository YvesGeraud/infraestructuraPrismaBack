import { Rl_escuela_alumno_grado } from "@prisma/client";
import { prisma } from "../config/database";
import { PaginatedResponse } from "../types";
import { PaginationInput } from "../schemas/commonSchemas";
import {
  CrearRlEscuelaAlumnoGradoInput,
  ActualizarRlEscuelaAlumnoGradoInput,
  RlEscuelaAlumnoGradoFiltersInput,
  escuelaAlumnoIncluir,
} from "../schemas/rl_escuela_alumno_grado.schema";

//TODO ===== SERVICIO PARA DT_ESCUELA_ALUMNO =====

//? ===== TIPOS PARA RESPUESTAS =====
export type RlEscuelaAlumnoGradoResponse = any; // Flexible para incluir relaciones

export class RlEscuelaAlumnoGradoService {
  //TODO ===== MÉTODOS PARA CREAR DATOS =====

  //? Incluir los datos de los alumnos
  private construirInclude(options: escuelaAlumnoIncluir = {}): any {
    const include: Record<string, any> = {};

    if (options.includeAlumno) {
      include.dt_escuela_alumno = true;
    }

    return Object.keys(include).length > 0 ? include : undefined;
  }

  //? Crear un nuevo registro de alumno en la escuela
  async createRlEscuelaAlumnoGrado(
    rlEscuelaAlumnoGradoData: CrearRlEscuelaAlumnoGradoInput
  ): Promise<RlEscuelaAlumnoGradoResponse> {
    //TODO ===== VALIDACIÓN DE DATOS =====
    //? Verificar si el alumno existe en dt_escuela_alumno
    //? Si no existe, se lanza un error
    //? Si existe, se crea el registro en rl_escuela_alumno_grado

    const alumnoExiste = await prisma.dt_escuela_alumno.findUnique({
      where: {
        id_escuela_alumno: rlEscuelaAlumnoGradoData.id_escuela_alumno,
      },
    });

    if (!alumnoExiste) {
      throw new Error("El alumno no existe en el sistema");
    }

    const rlEscuelaAlumnoGrado = await prisma.rl_escuela_alumno_grado.create({
      data: {
        id_escuela_alumno: rlEscuelaAlumnoGradoData.id_escuela_alumno,
        id_escuela_plantel: rlEscuelaAlumnoGradoData.id_escuela_plantel,
        id_escuela_ciclo_escolar:
          rlEscuelaAlumnoGradoData.id_escuela_ciclo_escolar,
        nivel: rlEscuelaAlumnoGradoData.nivel,
        grado: rlEscuelaAlumnoGradoData.grado,
        intento: rlEscuelaAlumnoGradoData.intento,
        id_escuela_alumno_estatus:
          rlEscuelaAlumnoGradoData.id_escuela_alumno_estatus,
        id_escuela_alumno_estatus_grado:
          rlEscuelaAlumnoGradoData.id_escuela_alumno_estatus_grado,
      },
    });

    return this.mapToRlEscuelaAlumnoGradoResponse(rlEscuelaAlumnoGrado);
  }
  //todo ===== MÉTODOS PARA OBTENER DATOS =====
  //? Obtener un registro de alumno en la escuela

  async obtenerRlEscuelaAlumnoGrado(
    id_escuela_alumno_grado: number,
    includeOptions: escuelaAlumnoIncluir = {}
  ): Promise<RlEscuelaAlumnoGradoResponse | null> {
    const include = this.construirInclude(includeOptions);

    const escuelaAlumnoGrado = await prisma.rl_escuela_alumno_grado.findUnique({
      where: { id_escuela_alumno_grado },
      include,
    });

    return escuelaAlumnoGrado
      ? this.mapToRlEscuelaAlumnoGradoResponse(escuelaAlumnoGrado)
      : null;
  }

  //? Obtener todos los registros de alumnos en la escuela
  async obtenerTodosLosRlEscuelaAlumnoGrado(
    filters: Partial<RlEscuelaAlumnoGradoFiltersInput> = {},
    pagination: PaginationInput = {},
    includeOptions: escuelaAlumnoIncluir = {}
  ): Promise<PaginatedResponse<RlEscuelaAlumnoGradoResponse>> {
    const page = pagination.page || 1;
    const limit = pagination.limit || 10;
    const skip = (page - 1) * limit;

    // Construir where clause
    const where: any = {};

    if (filters.id_escuela_alumno) {
      where.id_escuela_alumno = filters.id_escuela_alumno;
    }

    if (filters.id_escuela_plantel) {
      where.id_escuela_plantel = filters.id_escuela_plantel;
    }

    if (filters.id_escuela_ciclo_escolar) {
      where.id_escuela_ciclo_escolar = filters.id_escuela_ciclo_escolar;
    }

    if (filters.nivel) {
      where.nivel = filters.nivel;
    }

    if (filters.grado) {
      where.grado = filters.grado;
    }

    if (filters.intento) {
      where.intento = filters.intento;
    }

    if (filters.id_escuela_alumno_estatus) {
      where.id_escuela_alumno_estatus = filters.id_escuela_alumno_estatus;
    }

    if (filters.id_escuela_alumno_estatus_grado) {
      where.id_escuela_alumno_estatus_grado =
        filters.id_escuela_alumno_estatus_grado;
    }

    // Construir include basado en opciones
    const include = this.construirInclude(includeOptions);

    // Obtener todos los registros de alumnos en la escuela
    const [escuelaAlumnos, total] = await Promise.all([
      prisma.rl_escuela_alumno_grado.findMany({
        where,
        skip,
        take: limit,
        orderBy: { fecha_in: "desc" },
        include,
      }),
      prisma.rl_escuela_alumno_grado.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: escuelaAlumnos.map((escuelaAlumno: any) =>
        this.mapToRlEscuelaAlumnoGradoResponse(escuelaAlumno)
      ),
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

  //? Actualizar un registro de alumno en la escuela
  async actualizarRlEscuelaAlumnoGrado(
    id_escuela_alumno_grado: number,
    rlEscuelaAlumnoGradoData: ActualizarRlEscuelaAlumnoGradoInput
  ): Promise<RlEscuelaAlumnoGradoResponse> {
    //TODO ===== VALIDACIÓN DE DATOS =====
    //? Verificar si el alumno existe en la escuela
    //* Si existe, se actualiza el alumno
    //! Si no existe, se lanza un error

    const escuelaAlumno = await prisma.rl_escuela_alumno_grado.findUnique({
      where: { id_escuela_alumno_grado },
    });

    if (!escuelaAlumno) {
      throw new Error("El alumno no existe");
    }

    //? actualizar el alumno
    const escuelaAlumnoActualizado =
      await prisma.rl_escuela_alumno_grado.update({
        where: { id_escuela_alumno_grado },
        data: rlEscuelaAlumnoGradoData,
      });

    return this.mapToRlEscuelaAlumnoGradoResponse(escuelaAlumnoActualizado);
  }

  //? Eliminar un registro de alumno en la escuela
  async eliminarRlEscuelaAlumnoGrado(
    id_escuela_alumno_grado: number
  ): Promise<void> {
    const escuelaAlumno = await prisma.rl_escuela_alumno_grado.findUnique({
      where: { id_escuela_alumno_grado },
    });

    if (!escuelaAlumno) {
      throw new Error("El alumno no existe");
    }

    //? Eliminar el alumno
    await prisma.rl_escuela_alumno_grado.delete({
      where: { id_escuela_alumno_grado },
    });
  }

  //TODO ===== MÉTODOS PRIVADOS =====
  //? sirven para mapear los datos de la base de datos a los datos de la respuesta

  private mapToRlEscuelaAlumnoGradoResponse(rlEscuelaAlumnoGrado: any): any {
    // Preservar todos los datos incluidos (como dt_escuela_alumno)
    return rlEscuelaAlumnoGrado;
  }
}
