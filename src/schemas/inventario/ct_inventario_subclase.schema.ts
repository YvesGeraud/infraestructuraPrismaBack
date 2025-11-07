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
  esquemaNumeroRequerido,
  esquemaNumeroOpcional,
  esquemaQueryNumeroOpcional,
} from "../commonSchemas";

//TODO ===== SCHEMAS PARA CT_INVENTARIO_SUBCLASE =====

//? Esquema para crear una nueva subclase
export const crearCtInventarioSubclaseSchema = z.object({
  id_ct_inventario_clase: esquemaNumeroRequerido(1, 100000),
  no_subclase: esquemaNumeroRequerido(1, 9999),
  nombre: esquemaTextoRequerido(2, 100),
  estado: esquemaEstadoRequerido,});

//? Esquema para actualizar una subclase
export const actualizarCtInventarioSubclaseSchema = z.object({
  id_ct_inventario_clase: esquemaNumeroOpcional(1, 100000),
  no_subclase: esquemaNumeroOpcional(1, 9999),
  nombre: esquemaTextoOpcional(100),
  estado: esquemaEstadoOpcional,
  id_ct_usuario_up: esquemaUsuarioCreacion, // Requerido para actualización
  fecha_up: esquemaFechaOpcional,
});

//? Schema para filtros y paginación de subclases
//! NOTA: Implementa soft delete - por defecto solo muestra registros activos
export const ctInventarioSubclaseFiltrosSchema = z.object({
  //? Filtros específicos
  id_ct_inventario_subclase: esquemaQueryId,
  id_ct_inventario_clase: esquemaQueryNumeroOpcional,
  no_subclase: esquemaQueryNumeroOpcional,
  nombre: esquemaQueryTexto,
  estado: esquemaQueryBoolean,
  id_ct_usuario_in: esquemaQueryId,
  fecha_in: esquemaFechaOpcional,
  incluir_clase: esquemaQueryBoolean,

  //? Filtros para incluir inactivos
  incluirInactivos: esquemaQueryBoolean,

  //? Paginación
  pagina: esquemaPaginaQuery,
  limite: esquemaLimiteQuery,
});

export type CrearCtInventarioSubclaseInput = z.infer<typeof crearCtInventarioSubclaseSchema>;
export type ActualizarCtInventarioSubclaseInput = z.infer<
  typeof actualizarCtInventarioSubclaseSchema
>;

export type BuscarCtInventarioSubclaseInput = z.infer<typeof ctInventarioSubclaseFiltrosSchema>;

//? Esquema para parámetros de URL (ID de subclase)
export const ctInventarioSubclaseIdParamSchema = z.object({
  id_ct_inventario_subclase: esquemaParamId,
});

//? Esquema para validar el body del DELETE - quién ejecuta la eliminación
// Ya no se usa esquemaDeleteConUsuario - id_ct_usuario_up se obtiene del JWT
export type CtInventarioSubclaseIdParam = z.infer<typeof ctInventarioSubclaseIdParamSchema>;

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
- esquemaNumeroRequerido/Opcional - Para campos numéricos
- esquemaQueryId/Texto/Boolean/Numero - Para filtros en query parameters
- esquemaPaginaQuery/LimiteQuery - Para paginación
- esquemaParamId - Para parámetros de URL
- esquemaDeleteConUsuario - Para eliminación con auditoría
*/
