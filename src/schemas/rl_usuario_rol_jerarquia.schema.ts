import { z } from "zod";
import {
  esquemaNumeroRequerido,
  esquemaNumeroOpcional,
  esquemaEstadoRequerido,
  esquemaEstadoOpcional,
  esquemaUsuarioCreacion,
  esquemaFechaOpcional,
  esquemaQueryId,
  esquemaQueryBoolean,
  esquemaPaginaQuery,
  esquemaLimiteQuery,
  esquemaParamId,
} from "./commonSchemas";

//TODO ===== SCHEMAS PARA RL_USUARIO_ROL_JERARQUIA =====

//? Esquema para crear una nueva relación usuario-rol-jerarquía
export const crearRlUsuarioRolJerarquiaSchema = z.object({
  id_ct_usuario: esquemaNumeroRequerido(1, 2147483647),
  id_externo: esquemaNumeroRequerido(1, 2147483647),
  id_ct_rol: esquemaNumeroRequerido(1, 2147483647),
  id_rl_infraestructura_jerarquia: esquemaNumeroOpcional(1, 2147483647).nullable(),
  estado: esquemaEstadoRequerido,
});

//? Esquema para actualizar una relación usuario-rol-jerarquía
export const actualizarRlUsuarioRolJerarquiaSchema = z.object({
  id_ct_usuario: esquemaNumeroOpcional(1, 2147483647),
  id_externo: esquemaNumeroOpcional(1, 2147483647),
  id_ct_rol: esquemaNumeroOpcional(1, 2147483647),
  id_rl_infraestructura_jerarquia: esquemaNumeroOpcional(1, 2147483647).nullable(),
  estado: esquemaEstadoOpcional,
  id_ct_usuario_up: esquemaUsuarioCreacion,
  fecha_up: esquemaFechaOpcional,
});

//? Schema para filtros y paginación
export const rlUsuarioRolJerarquiaFiltrosSchema = z.object({
  id_rl_usuario_rol_jerarquia: esquemaQueryId,
  id_ct_usuario: esquemaQueryId,
  id_externo: esquemaQueryId,
  id_ct_rol: esquemaQueryId,
  id_rl_infraestructura_jerarquia: esquemaQueryId,
  estado: esquemaQueryBoolean,
  id_ct_usuario_in: esquemaQueryId,
  fecha_in: esquemaFechaOpcional,
  incluirInactivos: esquemaQueryBoolean,
  // Includes
  incluir_rol: esquemaQueryBoolean,
  incluir_usuario: esquemaQueryBoolean,
  incluir_jerarquia: esquemaQueryBoolean,
  // Paginación
  pagina: esquemaPaginaQuery,
  limite: esquemaLimiteQuery,
});

export type CrearRlUsuarioRolJerarquiaInput = z.infer<
  typeof crearRlUsuarioRolJerarquiaSchema
>;
export type ActualizarRlUsuarioRolJerarquiaInput = z.infer<
  typeof actualizarRlUsuarioRolJerarquiaSchema
>;
export type BuscarRlUsuarioRolJerarquiaInput = z.infer<
  typeof rlUsuarioRolJerarquiaFiltrosSchema
>;

//? Esquema para parámetros de URL
export const rlUsuarioRolJerarquiaIdParamSchema = z.object({
  id_rl_usuario_rol_jerarquia: esquemaParamId,
});

export type RlUsuarioRolJerarquiaIdParam = z.infer<
  typeof rlUsuarioRolJerarquiaIdParamSchema
>;

