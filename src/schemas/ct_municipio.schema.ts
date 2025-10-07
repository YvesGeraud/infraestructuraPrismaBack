import { z } from "zod";
import {
  esquemaTextoRequerido,
  esquemaTextoOpcional,
  esquemaEstadoRequerido,
  esquemaEstadoOpcional,
  esquemaUsuarioCreacion,
  esquemaUsuarioActualizacion,
  esquemaFechaOpcional,
  esquemaQueryId,
  esquemaQueryTexto,
  esquemaQueryBoolean,
  esquemaPaginaQuery,
  esquemaLimiteQuery,
  esquemaParamId,
  esquemaDeleteConUsuario,
  esquemaNumeroRequerido,
  esquemaQueryNumeroRequerido,
  paginationSchema,
  idParamSchema,
  esquemaQueryNumeroOpcional,
  esquemaNumeroOpcional,
} from "./commonSchemas";

//TODO ===== SCHEMAS PARA CT_MUNICIPIO =====

//? Esquema para crear una nueva capitulo
export const crearCtMunicipioSchema = z.object({
  cve_mun: esquemaTextoRequerido(3, 3),
  nombre: esquemaTextoRequerido(2, 100),
  id_ct_entidad: esquemaNumeroRequerido(1, 100000),
  estado: esquemaEstadoRequerido,
  id_ct_usuario_in: esquemaUsuarioCreacion,
});

//? Esquema para actualizar una capitulo
export const actualizarCtMunicipioSchema = z.object({
  cve_mun: esquemaTextoOpcional(3),
  nombre: esquemaTextoOpcional(100),
  id_ct_entidad: esquemaNumeroOpcional(1, 100000),
  estado: esquemaEstadoOpcional,
  id_ct_usuario_up: esquemaUsuarioCreacion, // Requerido para actualización
  fecha_up: esquemaFechaOpcional,
});

//? Schema para filtros y paginación de capitulos
//! NOTA: Implementa soft delete - por defecto solo muestra registros activos
export const ctMunicipioFiltrosSchema = z.object({
  //? Filtros específicos
  id_ct_municipio: esquemaQueryId,
  cve_mun: esquemaQueryTexto,
  nombre: esquemaQueryTexto,
  id_ct_entidad: esquemaQueryNumeroOpcional,
  estado: esquemaQueryBoolean,
  id_ct_usuario_in: esquemaQueryId,
  fecha_in: esquemaFechaOpcional,
  incluir_ct_entidad: esquemaQueryBoolean,

  //? Filtros para incluir inactivos de capitulos
  incluirInactivos: esquemaQueryBoolean,

  //? Paginación
  pagina: esquemaPaginaQuery,
  limite: esquemaLimiteQuery,
});

export type CrearCtMunicipioInput = z.infer<typeof crearCtMunicipioSchema>;
export type ActualizarCtMunicipioInput = z.infer<
  typeof actualizarCtMunicipioSchema
>;

export type BuscarCtMunicipioInput = z.infer<typeof ctMunicipioFiltrosSchema>;

//? Esquema para parámetros de URL (ID de capitulo)
export const ctMunicipioIdParamSchema = z.object({
  id_ct_municipio: esquemaParamId,
});

//? Esquema para validar el body del DELETE - quién ejecuta la eliminación
export const eliminarCtMunicipioSchema = esquemaDeleteConUsuario;

export type CtMunicipioIdParam = z.infer<typeof ctMunicipioIdParamSchema>;

export type EliminarCtMunicipioInput = z.infer<typeof eliminarCtMunicipioSchema>;

/*
🎉 SCHEMA REFACTORIZADO CON ESQUEMAS BASE REUTILIZABLES

✅ Beneficios:
- ✨ Código más limpio y mantenible
- 🔄 Reutilización de validaciones comunes
- 📝 Consistencia en mensajes de error
- 🚀 Fácil actualización de validaciones globales
- 🛡️ Menos duplicación de código

🔧 Esquemas utilizados:
- esquemaTextoRequerido/Opcional - Para campos de texto
- esquemaEstadoRequerido/Opcional - Para campos booleanos de estado
- esquemaUsuarioCreacion/Actualización - Para auditoría de usuarios
- esquemaQueryId/Texto/Boolean - Para filtros en query parameters
- esquemaPaginaQuery/LimiteQuery - Para paginación
- esquemaParamId - Para parámetros de URL
- esquemaDeleteConUsuario - Para eliminación con auditoría
*/
