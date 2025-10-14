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
} from "./commonSchemas";

//TODO ===== SCHEMAS PARA CT_BITACORA_TABLA =====

//? Esquema para crear una nueva tabla de bitácora
export const crearCtBitacoraTablaSchema = z.object({
  nombre: esquemaTextoRequerido(2, 100),
  descripcion: esquemaTextoOpcional(255),
  estado: esquemaEstadoRequerido,
  auditar: esquemaEstadoRequerido,
  id_ct_usuario_in: esquemaUsuarioCreacion,
});

//? Esquema para actualizar una tabla de bitácora
export const actualizarCtBitacoraTablaSchema = z.object({
  nombre: esquemaTextoOpcional(100),
  descripcion: esquemaTextoOpcional(255),
  estado: esquemaEstadoOpcional,
  auditar: esquemaEstadoOpcional,
  id_ct_usuario_up: esquemaUsuarioCreacion, // Requerido para actualización
  fecha_up: esquemaFechaOpcional,
});

//? Schema para filtros y paginación de tablas de bitácora
//! NOTA: Implementa soft delete - por defecto solo muestra registros activos
export const ctBitacoraTablaFiltrosSchema = z.object({
  //? Filtros específicos
  id_ct_bitacora_tabla: esquemaQueryId,
  nombre: esquemaQueryTexto,
  descripcion: esquemaQueryTexto,
  estado: esquemaQueryBoolean,
  auditar: esquemaQueryBoolean,
  id_ct_usuario_in: esquemaQueryId,
  fecha_in: esquemaFechaOpcional,

  //? Filtros para incluir inactivos
  incluirInactivos: esquemaQueryBoolean,

  //? Paginación
  pagina: esquemaPaginaQuery,
  limite: esquemaLimiteQuery,
});

export type CrearCtBitacoraTablaInput = z.infer<typeof crearCtBitacoraTablaSchema>;
export type ActualizarCtBitacoraTablaInput = z.infer<
  typeof actualizarCtBitacoraTablaSchema
>;

export type BuscarCtBitacoraTablaInput = z.infer<typeof ctBitacoraTablaFiltrosSchema>;

//? Esquema para parámetros de URL (ID de tabla de bitácora)
export const ctBitacoraTablaIdParamSchema = z.object({
  id_ct_bitacora_tabla: esquemaParamId,
});

//? Esquema para validar el body del DELETE - quién ejecuta la eliminación
export const eliminarCtBitacoraTablaSchema = esquemaDeleteConUsuario;

export type CtBitacoraTablaIdParam = z.infer<typeof ctBitacoraTablaIdParamSchema>;

export type EliminarCtBitacoraTablaInput = z.infer<typeof eliminarCtBitacoraTablaSchema>;

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

