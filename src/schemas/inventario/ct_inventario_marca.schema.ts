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

//TODO ===== SCHEMAS PARA CT_INVENTARIO_MARCA =====

//? Esquema para crear una nueva marca
export const crearCtInventarioMarcaSchema = z.object({
  nombre: esquemaTextoRequerido(2, 50),
  estado: esquemaEstadoRequerido,});

//? Esquema para actualizar una marca
export const actualizarCtInventarioMarcaSchema = z.object({
  nombre: esquemaTextoOpcional(50),
  estado: esquemaEstadoOpcional,
  id_ct_usuario_up: esquemaUsuarioCreacion, // Requerido para actualización
  fecha_up: esquemaFechaOpcional,
});

//? Schema para filtros y paginación de marcas
//! NOTA: Implementa soft delete - por defecto solo muestra registros activos
export const ctInventarioMarcaFiltrosSchema = z.object({
  //? Filtros específicos
  id_ct_inventario_material: esquemaQueryId, // Nota: En Prisma se llama id_ct_inventario_material
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

export type CrearCtInventarioMarcaInput = z.infer<typeof crearCtInventarioMarcaSchema>;
export type ActualizarCtInventarioMarcaInput = z.infer<
  typeof actualizarCtInventarioMarcaSchema
>;

export type BuscarCtInventarioMarcaInput = z.infer<typeof ctInventarioMarcaFiltrosSchema>;

//? Esquema para parámetros de URL (ID de marca)
export const ctInventarioMarcaIdParamSchema = z.object({
  id_ct_inventario_material: esquemaParamId, // Nota: En Prisma se llama id_ct_inventario_material
});

//? Esquema para validar el body del DELETE - quién ejecuta la eliminación
// Ya no se usa esquemaDeleteConUsuario - id_ct_usuario_up se obtiene del JWT
export type CtInventarioMarcaIdParam = z.infer<typeof ctInventarioMarcaIdParamSchema>;

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
