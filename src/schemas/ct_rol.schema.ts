import { z } from "zod";
import {
  esquemaTextoRequerido,
  esquemaTextoOpcional,
  esquemaEstadoRequerido,
  esquemaEstadoOpcional,
  esquemaUsuarioCreacion,
  esquemaFechaOpcional,
  esquemaQueryId,
  esquemaQueryTexto,
  esquemaQueryBoolean,
  esquemaPaginaQuery,
  esquemaLimiteQuery,
  esquemaParamId,
} from "./commonSchemas";

//TODO ===== SCHEMAS PARA CT_ROL =====

//? Esquema para crear un nuevo rol
export const crearCtRolSchema = z.object({
  nombre: esquemaTextoRequerido(2, 50),
  descripcion: esquemaTextoOpcional(255),
  estado: esquemaEstadoRequerido,
});

//? Esquema para actualizar un rol
export const actualizarCtRolSchema = z.object({
  nombre: esquemaTextoOpcional(50),
  descripcion: esquemaTextoOpcional(255),
  estado: esquemaEstadoOpcional,
  id_ct_usuario_up: esquemaUsuarioCreacion,
  fecha_up: esquemaFechaOpcional,
});

//? Schema para filtros y paginación de roles
export const ctRolFiltrosSchema = z.object({
  id_ct_rol: esquemaQueryId,
  nombre: esquemaQueryTexto,
  descripcion: esquemaQueryTexto,
  estado: esquemaQueryBoolean,
  id_ct_usuario_in: esquemaQueryId,
  fecha_in: esquemaFechaOpcional,
  incluirInactivos: esquemaQueryBoolean,
  pagina: esquemaPaginaQuery,
  limite: esquemaLimiteQuery,
});

export type CrearCtRolInput = z.infer<typeof crearCtRolSchema>;
export type ActualizarCtRolInput = z.infer<typeof actualizarCtRolSchema>;
export type BuscarCtRolInput = z.infer<typeof ctRolFiltrosSchema>;

//? Esquema para parámetros de URL
export const ctRolIdParamSchema = z.object({
  id_ct_rol: esquemaParamId,
});

export type CtRolIdParam = z.infer<typeof ctRolIdParamSchema>;

