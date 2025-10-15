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

//TODO ===== SCHEMAS PARA CT_INVENTARIO_MATERIAL =====

//? Esquema para crear un nuevo material
export const crearCtInventarioMaterialSchema = z.object({
  nombre: esquemaTextoRequerido(2, 50),
  estado: esquemaEstadoRequerido,
  id_ct_usuario_in: esquemaUsuarioCreacion,
});

//? Esquema para actualizar un material
export const actualizarCtInventarioMaterialSchema = z.object({
  nombre: esquemaTextoOpcional(50),
  estado: esquemaEstadoOpcional,
  id_ct_usuario_up: esquemaUsuarioCreacion, // Requerido para actualización
  fecha_up: esquemaFechaOpcional,
});

//? Schema para filtros y paginación de materiales
//! NOTA: Implementa soft delete - por defecto solo muestra registros activos
export const ctInventarioMaterialFiltrosSchema = z.object({
  //? Filtros específicos
  id_ct_inventario_marca: esquemaQueryId, // Nota: En Prisma se llama id_ct_inventario_marca
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

export type CrearCtInventarioMaterialInput = z.infer<typeof crearCtInventarioMaterialSchema>;
export type ActualizarCtInventarioMaterialInput = z.infer<
  typeof actualizarCtInventarioMaterialSchema
>;

export type BuscarCtInventarioMaterialInput = z.infer<typeof ctInventarioMaterialFiltrosSchema>;

//? Esquema para parámetros de URL (ID de material)
export const ctInventarioMaterialIdParamSchema = z.object({
  id_ct_inventario_marca: esquemaParamId, // Nota: En Prisma se llama id_ct_inventario_marca
});

//? Esquema para validar el body del DELETE - quién ejecuta la eliminación
export const eliminarCtInventarioMaterialSchema = esquemaDeleteConUsuario;

export type CtInventarioMaterialIdParam = z.infer<typeof ctInventarioMaterialIdParamSchema>;

export type EliminarCtInventarioMaterialInput = z.infer<typeof eliminarCtInventarioMaterialSchema>;

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
