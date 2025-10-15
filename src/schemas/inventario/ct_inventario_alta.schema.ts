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
} from "../commonSchemas";

//TODO ===== SCHEMAS PARA CT_MUNICIPIO =====

//? Esquema para crear una nueva capitulo
export const crearCtInventarioAltaSchema = z.object({
  nombre: esquemaTextoRequerido(2, 100),
  abreviatura: esquemaTextoRequerido(2, 10),
  estado: esquemaEstadoRequerido,
  id_ct_usuario_in: esquemaUsuarioCreacion,
});

//? Esquema para actualizar una capitulo
export const actualizarCtInventarioAltaSchema = z.object({
  nombre: esquemaTextoOpcional(100),
  abreviatura: esquemaTextoOpcional(10),
  estado: esquemaEstadoOpcional,
  id_ct_usuario_up: esquemaUsuarioCreacion, // Requerido para actualización
  fecha_up: esquemaFechaOpcional,
});

//? Schema para filtros y paginación de capitulos
//! NOTA: Implementa soft delete - por defecto solo muestra registros activos
export const ctInventarioAltaFiltrosSchema = z.object({
  //? Filtros específicos
  id_ct_inventario_alta: esquemaQueryId,
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

export type CrearCtInventarioAltaInput = z.infer<typeof crearCtInventarioAltaSchema>;
export type ActualizarCtInventarioAltaInput = z.infer<
  typeof actualizarCtInventarioAltaSchema
>;

export type BuscarCtInventarioAltaInput = z.infer<typeof ctInventarioAltaFiltrosSchema>;

//? Esquema para parámetros de URL (ID de capitulo)
export const ctInventarioAltaIdParamSchema = z.object({
  id_ct_inventario_alta: esquemaParamId,
});

//? Esquema para validar el body del DELETE - quién ejecuta la eliminación
export const eliminarCtInventarioAltaSchema = esquemaDeleteConUsuario;

export type CtInventarioAltaIdParam = z.infer<typeof ctInventarioAltaIdParamSchema>;

export type EliminarCtInventarioAltaInput = z.infer<typeof eliminarCtInventarioAltaSchema>;

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
