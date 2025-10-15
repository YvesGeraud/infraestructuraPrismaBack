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
} from "../commonSchemas";

//TODO ===== SCHEMAS PARA CT_INVENTARIO_ESTADO_FISICO =====

//? Esquema para crear un nuevo estado físico
export const crearCtInventarioEstadoFisicoSchema = z.object({
  nombre: esquemaTextoRequerido(2, 50),
  estado: esquemaEstadoRequerido,
  id_ct_usuario_in: esquemaUsuarioCreacion,
});

//? Esquema para actualizar un estado físico
export const actualizarCtInventarioEstadoFisicoSchema = z.object({
  nombre: esquemaTextoOpcional(50),
  estado: esquemaEstadoOpcional,
  id_ct_usuario_up: esquemaUsuarioCreacion, // Requerido para actualización
  fecha_up: esquemaFechaOpcional,
});

//? Schema para filtros y paginación de estados físicos
//! NOTA: Implementa soft delete - por defecto solo muestra registros activos
export const ctInventarioEstadoFisicoFiltrosSchema = z.object({
  //? Filtros específicos
  id_ct_inventario_estado_fisico: esquemaQueryId,
  nombre: esquemaQueryTexto,
  estado: esquemaQueryBoolean,
  id_ct_usuario_in: esquemaQueryId,
  fecha_in: esquemaFechaOpcional,

  //? Filtros para incluir inactivos
  incluirInactivos: esquemaQueryBoolean,

  //? Paginación
  pagina: esquemaPaginaQuery,
  limite: esquemaLimiteQuery,
});

export type CrearCtInventarioEstadoFisicoInput = z.infer<typeof crearCtInventarioEstadoFisicoSchema>;
export type ActualizarCtInventarioEstadoFisicoInput = z.infer<
  typeof actualizarCtInventarioEstadoFisicoSchema
>;

export type BuscarCtInventarioEstadoFisicoInput = z.infer<typeof ctInventarioEstadoFisicoFiltrosSchema>;

//? Esquema para parámetros de URL (ID de estado físico)
export const ctInventarioEstadoFisicoIdParamSchema = z.object({
  id_ct_inventario_estado_fisico: esquemaParamId,
});

//? Esquema para validar el body del DELETE - quién ejecuta la eliminación
export const eliminarCtInventarioEstadoFisicoSchema = esquemaDeleteConUsuario;

export type CtInventarioEstadoFisicoIdParam = z.infer<typeof ctInventarioEstadoFisicoIdParamSchema>;

export type EliminarCtInventarioEstadoFisicoInput = z.infer<typeof eliminarCtInventarioEstadoFisicoSchema>;

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
