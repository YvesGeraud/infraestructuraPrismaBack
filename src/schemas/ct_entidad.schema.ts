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
export const crearCtEntidadSchema = z.object({
  nombre: esquemaTextoRequerido(2, 100),
  abreviatura: esquemaTextoRequerido(2, 10),
  estado: esquemaEstadoRequerido,
  id_ct_usuario_in: esquemaUsuarioCreacion,
});

//? Esquema para actualizar una capitulo
export const actualizarCtEntidadSchema = z.object({
  nombre: esquemaTextoOpcional(100),
  abreviatura: esquemaTextoOpcional(10),
  estado: esquemaEstadoOpcional,
  id_ct_usuario_up: esquemaUsuarioCreacion, // Requerido para actualización
  fecha_up: esquemaFechaOpcional,
});

//? Schema para filtros y paginación de capitulos
//! NOTA: Implementa soft delete - por defecto solo muestra registros activos
export const ctEntidadFiltrosSchema = z.object({
  //? Filtros específicos
  id_ct_entidad: esquemaQueryId,
  nombre: esquemaQueryTexto,
  abreviatura: esquemaQueryTexto,
  estado: esquemaQueryBoolean,
  id_ct_usuario_in: esquemaQueryId,
  fecha_in: esquemaFechaOpcional,

  //? Filtros para incluir inactivos de capitulos
  incluirInactivos: esquemaQueryBoolean,

  //? Paginación
  pagina: esquemaPaginaQuery,
  limite: esquemaLimiteQuery,
});

export type CrearCtEntidadInput = z.infer<typeof crearCtEntidadSchema>;
export type ActualizarCtEntidadInput = z.infer<
  typeof actualizarCtEntidadSchema
>;

export type BuscarCtEntidadInput = z.infer<typeof ctEntidadFiltrosSchema>;

//? Esquema para parámetros de URL (ID de capitulo)
export const ctEntidadIdParamSchema = z.object({
  id_ct_entidad: esquemaParamId,
});

//? Esquema para validar el body del DELETE - quién ejecuta la eliminación
export const eliminarCtEntidadSchema = esquemaDeleteConUsuario;

export type CtEntidadIdParam = z.infer<typeof ctEntidadIdParamSchema>;

export type EliminarCtEntidadInput = z.infer<typeof eliminarCtEntidadSchema>;

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
