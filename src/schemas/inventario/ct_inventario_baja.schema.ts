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

//TODO ===== SCHEMAS PARA CT_INVENTARIO_BAJA =====

//? Esquema para crear una nueva causa de baja
export const crearCtInventarioBajaSchema = z.object({
  nombre: esquemaTextoRequerido(2, 50),
  estado: esquemaEstadoRequerido,
  id_ct_usuario_in: esquemaUsuarioCreacion,
});

//? Esquema para actualizar una causa de baja
export const actualizarCtInventarioBajaSchema = z.object({
  nombre: esquemaTextoOpcional(50),
  estado: esquemaEstadoOpcional,
  id_ct_usuario_up: esquemaUsuarioCreacion, // Requerido para actualización
  fecha_up: esquemaFechaOpcional,
});

//? Schema para filtros y paginación de causas de baja
//! NOTA: Implementa soft delete - por defecto solo muestra registros activos
export const ctInventarioBajaFiltrosSchema = z.object({
  //? Filtros específicos
  id_ct_inventario_baja: esquemaQueryId,
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

export type CrearCtInventarioBajaInput = z.infer<typeof crearCtInventarioBajaSchema>;
export type ActualizarCtInventarioBajaInput = z.infer<
  typeof actualizarCtInventarioBajaSchema
>;

export type BuscarCtInventarioBajaInput = z.infer<typeof ctInventarioBajaFiltrosSchema>;

//? Esquema para parámetros de URL (ID de causa de baja)
export const ctInventarioBajaIdParamSchema = z.object({
  id_ct_inventario_baja: esquemaParamId,
});

//? Esquema para validar el body del DELETE - quién ejecuta la eliminación
export const eliminarCtInventarioBajaSchema = esquemaDeleteConUsuario;

export type CtInventarioBajaIdParam = z.infer<typeof ctInventarioBajaIdParamSchema>;

export type EliminarCtInventarioBajaInput = z.infer<typeof eliminarCtInventarioBajaSchema>;

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
