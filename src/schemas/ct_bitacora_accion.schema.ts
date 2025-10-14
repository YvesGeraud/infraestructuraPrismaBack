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

//TODO ===== SCHEMAS PARA CT_BITACORA_ACCION =====

//? Esquema para crear una nueva accion
export const crearCtBitacoraAccionSchema = z.object({
  nombre: esquemaTextoRequerido(2, 100),
  descripcion: esquemaTextoRequerido(2, 255),
  estado: esquemaEstadoRequerido,
  id_ct_usuario_in: esquemaUsuarioCreacion,
});

//? Esquema para actualizar una accion
export const actualizarCtBitacoraAccionSchema = z.object({
  nombre: esquemaTextoOpcional(100),
  descripcion: esquemaTextoOpcional(10),
  estado: esquemaEstadoOpcional,
  id_ct_usuario_up: esquemaUsuarioCreacion, // Requerido para actualización
  fecha_up: esquemaFechaOpcional,
});

//? Schema para filtros y paginación de acciones
//! NOTA: Implementa soft delete - por defecto solo muestra registros activos
export const ctBitacoraAccionFiltrosSchema = z.object({
  //? Filtros específicos
  id_ct_bitacora_accion: esquemaQueryId,
  nombre: esquemaQueryTexto,
  descripcion: esquemaQueryTexto,
  estado: esquemaQueryBoolean,
  id_ct_usuario_in: esquemaQueryId,
  fecha_in: esquemaFechaOpcional,

  //? Filtros para incluir inactivos de acciones
  incluirInactivos: esquemaQueryBoolean,

  //? Paginación
  pagina: esquemaPaginaQuery,
  limite: esquemaLimiteQuery,
});

export type CrearCtBitacoraAccionInput = z.infer<typeof crearCtBitacoraAccionSchema>;
export type ActualizarCtBitacoraAccionInput = z.infer<
  typeof actualizarCtBitacoraAccionSchema
>;

export type BuscarCtBitacoraAccionInput = z.infer<typeof ctBitacoraAccionFiltrosSchema>;

//? Esquema para parámetros de URL (ID de capitulo)
export const ctBitacoraAccionIdParamSchema = z.object({
  id_ct_bitacora_accion: esquemaParamId,
});

//? Esquema para validar el body del DELETE - quién ejecuta la eliminación
export const eliminarCtBitacoraAccionSchema = esquemaDeleteConUsuario;

export type CtBitacoraAccionIdParam = z.infer<typeof ctBitacoraAccionIdParamSchema>;

export type EliminarCtBitacoraAccionInput = z.infer<typeof eliminarCtBitacoraAccionSchema>;

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
