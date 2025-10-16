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

//TODO ===== SCHEMAS PARA CT_INVENTARIO_PROVEEDOR =====

//? Esquema para crear un nuevo proveedor
export const crearCtInventarioProveedorSchema = z.object({
  nombre: esquemaTextoRequerido(2, 50),
  estado: esquemaEstadoRequerido,});

//? Esquema para actualizar un proveedor
export const actualizarCtInventarioProveedorSchema = z.object({
  nombre: esquemaTextoOpcional(50),
  estado: esquemaEstadoOpcional,
  id_ct_usuario_up: esquemaUsuarioCreacion, // Requerido para actualización
  fecha_up: esquemaFechaOpcional,
});

//? Schema para filtros y paginación de proveedores
//! NOTA: Implementa soft delete - por defecto solo muestra registros activos
export const ctInventarioProveedorFiltrosSchema = z.object({
  //? Filtros específicos
  id_ct_inventario_proveedor: esquemaQueryId,
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

export type CrearCtInventarioProveedorInput = z.infer<typeof crearCtInventarioProveedorSchema>;
export type ActualizarCtInventarioProveedorInput = z.infer<
  typeof actualizarCtInventarioProveedorSchema
>;

export type BuscarCtInventarioProveedorInput = z.infer<typeof ctInventarioProveedorFiltrosSchema>;

//? Esquema para parámetros de URL (ID de proveedor)
export const ctInventarioProveedorIdParamSchema = z.object({
  id_ct_inventario_proveedor: esquemaParamId,
});

//? Esquema para validar el body del DELETE - quién ejecuta la eliminación
// Ya no se usa esquemaDeleteConUsuario - id_ct_usuario_up se obtiene del JWT
export type CtInventarioProveedorIdParam = z.infer<typeof ctInventarioProveedorIdParamSchema>;

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
