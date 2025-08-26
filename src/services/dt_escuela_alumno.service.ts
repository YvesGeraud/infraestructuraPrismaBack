import { Dt_escuela_alumno } from "@prisma/client";
import { prisma } from "../config/database";
import { PaginatedResponse } from "../types";
import { PaginationInput } from "../schemas/commonSchemas";
import {
  CrearDtEscuelaAlumnoInput,
  ActualizarDtEscuelaAlumnoInput,
  DtEscuelaAlumnoIdParam,
  DtEscuelaAlumnoFiltersInput,
} from "../schemas/dt_escuela_alumno.schema";

//TODO ===== SERVICIO PARA DT_ESCUELA_ALUMNO =====

//? ===== TIPOS PARA RESPUESTAS =====
export type DtEscuelaAlumnoResponse = Dt_escuela_alumno;

export class DtEscuelaAlumnoService {
  //TODO ===== MÉTODOS PARA CREAR DATOS =====
  //? Crear un nuevo registro de alumno en la escuela

  async createDtEscuelaAlumno(
    dtEscuelaAlumnoData: CrearDtEscuelaAlumnoInput
  ): Promise<DtEscuelaAlumnoResponse> {
    //TODO ===== VALIDACIÓN DE DATOS =====
    //? Verificar si el alumno ya existe en la escuela
    //? Si existe, se lanza un error
    //? Si no existe, se crea el alumno

    const alumnoExistente = await prisma.dt_escuela_alumno.findUnique({
      where: { curp: dtEscuelaAlumnoData.curp },
    });

    if (alumnoExistente) {
      throw new Error("El alumno ya existe en la escuela");
    }

    const escuelaAlumno = await prisma.dt_escuela_alumno.create({
      data: {
        nombre: dtEscuelaAlumnoData.nombre,
        app: dtEscuelaAlumnoData.app,
        apm: dtEscuelaAlumnoData.apm,
        curp: dtEscuelaAlumnoData.curp,
        telefono: dtEscuelaAlumnoData.telefono,
        id_localidad: dtEscuelaAlumnoData.id_localidad,
        codigo_postal: dtEscuelaAlumnoData.codigo_postal,
        fecha_nacimiento: dtEscuelaAlumnoData.fecha_nacimiento,
      },
    });

    return this.mapToDtEscuelaAlumnoResponse(escuelaAlumno);
  }
  //todo ===== MÉTODOS PARA OBTENER DATOS =====
  //? Obtener un registro de alumno en la escuela

  async obtenerDtEscuelaAlumno(
    id_escuela_alumno: number
  ): Promise<DtEscuelaAlumnoResponse | null> {
    const escuelaAlumno = await prisma.dt_escuela_alumno.findUnique({
      where: { id_escuela_alumno },
    });

    return escuelaAlumno
      ? this.mapToDtEscuelaAlumnoResponse(escuelaAlumno)
      : null;
  }

  //? Obtener todos los registros de alumnos en la escuela
  async obtenerTodosLosDtEscuelaAlumno(
    filters: DtEscuelaAlumnoFiltersInput = {},
    pagination: PaginationInput = {}
  ): Promise<PaginatedResponse<DtEscuelaAlumnoResponse>> {
    const page = pagination.page || 1;
    const limit = pagination.limit || 10;
    const skip = (page - 1) * limit;

    // Construir where clause
    const where: any = {};

    if (filters.nombre) {
      where.nombre = {
        contains: filters.nombre,
      };
    }

    if (filters.app) {
      where.app = {
        contains: filters.app,
      };
    }

    if (filters.apm) {
      where.apm = {
        contains: filters.apm,
      };
    }

    if (filters.curp) {
      where.curp = {
        contains: filters.curp,
      };
    }

    if (filters.telefono) {
      where.telefono = {
        contains: filters.telefono,
      };
    }

    //? Obtener todos los registros de alumnos en la escuela
    const [escuelaAlumnos, total] = await Promise.all([
      prisma.dt_escuela_alumno.findMany({
        where,
        skip,
        take: limit,
      }),
      prisma.dt_escuela_alumno.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: escuelaAlumnos.map((escuelaAlumno: any) =>
        this.mapToDtEscuelaAlumnoResponse(escuelaAlumno)
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
  async actualizarDtEscuelaAlumno(
    id_escuela_alumno: number,
    dtEscuelaAlumnoData: ActualizarDtEscuelaAlumnoInput
  ): Promise<DtEscuelaAlumnoResponse> {
    //TODO ===== VALIDACIÓN DE DATOS =====
    //? Verificar si el alumno existe en la escuela
    //* Si existe, se actualiza el alumno
    //! Si no existe, se lanza un error

    const escuelaAlumno = await prisma.dt_escuela_alumno.findUnique({
      where: { id_escuela_alumno },
    });

    if (!escuelaAlumno) {
      throw new Error("El alumno no existe");
    }

    //? actualizar el alumno
    const escuelaAlumnoActualizado = await prisma.dt_escuela_alumno.update({
      where: { id_escuela_alumno },
      data: dtEscuelaAlumnoData,
    });

    return this.mapToDtEscuelaAlumnoResponse(escuelaAlumno);
  }

  //? Eliminar un registro de alumno en la escuela
  async eliminarDtEscuelaAlumno(id_escuela_alumno: number): Promise<void> {
    const escuelaAlumno = await prisma.dt_escuela_alumno.findUnique({
      where: { id_escuela_alumno },
    });

    if (!escuelaAlumno) {
      throw new Error("El alumno no existe");
    }

    //? Eliminar el alumno
    await prisma.dt_escuela_alumno.delete({
      where: { id_escuela_alumno },
    });
  }

  //TODO ===== MÉTODOS PRIVADOS =====
  //? sirven para mapear los datos de la base de datos a los datos de la respuesta

  private mapToDtEscuelaAlumnoResponse(
    dtEscuelaAlumno: Dt_escuela_alumno
  ): DtEscuelaAlumnoResponse {
    return {
      id_escuela_alumno: dtEscuelaAlumno.id_escuela_alumno,
      nombre: dtEscuelaAlumno.nombre,
      app: dtEscuelaAlumno.app,
      apm: dtEscuelaAlumno.apm,
      curp: dtEscuelaAlumno.curp,
      telefono: dtEscuelaAlumno.telefono,
      id_localidad: dtEscuelaAlumno.id_localidad,
      codigo_postal: dtEscuelaAlumno.codigo_postal,
      fecha_nacimiento: dtEscuelaAlumno.fecha_nacimiento,
      primaria_promedio_1: dtEscuelaAlumno.primaria_promedio_1,
      primaria_promedio_2: dtEscuelaAlumno.primaria_promedio_2,
      primaria_promedio_general: dtEscuelaAlumno.primaria_promedio_general,
      primaria_promedio_general_letra:
        dtEscuelaAlumno.primaria_promedio_general_letra,
      secundaria_promedio_1: dtEscuelaAlumno.secundaria_promedio_1,
      secundaria_promedio_2: dtEscuelaAlumno.secundaria_promedio_2,
      secundaria_promedio_3: dtEscuelaAlumno.secundaria_promedio_3,
      secundaria_promedio_general: dtEscuelaAlumno.secundaria_promedio_general,
      secundaria_promedio_general_letra:
        dtEscuelaAlumno.secundaria_promedio_general_letra,
      primaria_folio_certificado: dtEscuelaAlumno.primaria_folio_certificado,
      secundaria_folio_certificado:
        dtEscuelaAlumno.secundaria_folio_certificado,
      vigente: dtEscuelaAlumno.vigente,
      fecha_in: dtEscuelaAlumno.fecha_in,
      fecha_at: dtEscuelaAlumno.fecha_at,
    };
  }
}
