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
} from "../commonSchemas";

//TODO ===== SCHEMAS PARA CT_INVENTARIO_TIPO_ARTICULO =====

//? Esquema para crear un nuevo tipo de artículo
export const crearCtInventarioTipoArticuloSchema = z.object({
  nombre: esquemaTextoRequerido(2, 50),
  estado: esquemaEstadoRequerido,});

//? Esquema para actualizar un tipo de artículo
export const actualizarCtInventarioTipoArticuloSchema = z.object({
  nombre: esquemaTextoOpcional(50),
  estado: esquemaEstadoOpcional,
  id_ct_usuario_up: esquemaUsuarioCreacion, // Requerido para actualización
  fecha_up: esquemaFechaOpcional,
});

//? Schema para filtros y paginación de tipos de artículo
//! NOTA: Implementa soft delete - por defecto solo muestra registros activos
export const ctInventarioTipoArticuloFiltrosSchema = z.object({
  //? Filtros específicos
  id_ct_inventario_tipo_articulo: esquemaQueryId,
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

export type CrearCtInventarioTipoArticuloInput = z.infer<typeof crearCtInventarioTipoArticuloSchema>;
export type ActualizarCtInventarioTipoArticuloInput = z.infer<
  typeof actualizarCtInventarioTipoArticuloSchema
>;

export type BuscarCtInventarioTipoArticuloInput = z.infer<typeof ctInventarioTipoArticuloFiltrosSchema>;

//? Esquema para parámetros de URL (ID de tipo de artículo)
export const ctInventarioTipoArticuloIdParamSchema = z.object({
  id_ct_inventario_tipo_articulo: esquemaParamId,
});

//? Esquema para validar el body del DELETE - quién ejecuta la eliminación
// Ya no se usa esquemaDeleteConUsuario - id_ct_usuario_up se obtiene del JWT
export type CtInventarioTipoArticuloIdParam = z.infer<typeof ctInventarioTipoArticuloIdParamSchema>;

// Ya no se usa - DELETE no requiere body
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
