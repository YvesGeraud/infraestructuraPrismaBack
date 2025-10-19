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
  esquemaFechaRequerida,
} from "../commonSchemas";

//TODO ===== SCHEMAS PARA DT_INVENTARIO_ARTICULO =====

//? Esquema para crear un nuevo artículo de inventario
export const crearDtInventarioArticuloSchema = z.object({
  id_rl_infraestructura_jerarquia: esquemaNumeroRequerido(1, 2147483647),
  folio_antiguo: esquemaTextoOpcional(50),
  folio: esquemaTextoRequerido(1, 50),
  no_serie: esquemaNumeroRequerido(1, 2147483647),
  observaciones: esquemaNumeroRequerido(0, 2147483647),
  modelo: esquemaNumeroRequerido(0, 2147483647),
  fecha_registro: esquemaFechaRequerida,
  id_ct_inventario_subclase: esquemaNumeroRequerido(1, 2147483647),
  id_ct_inventario_material: esquemaNumeroRequerido(1, 2147483647),
  id_ct_inventario_marca: esquemaNumeroRequerido(1, 2147483647),
  id_ct_inventario_color: esquemaNumeroRequerido(1, 2147483647),
  id_ct_inventario_proveedor: esquemaNumeroRequerido(1, 2147483647),
  id_ct_inventario_estado_fisico: esquemaNumeroRequerido(1, 2147483647),
  id_ct_inventario_tipo_articulo: esquemaNumeroRequerido(1, 2147483647),
  cct: esquemaTextoOpcional(11),
  estado: esquemaEstadoRequerido,
});

//? Esquema para actualizar un artículo de inventario
export const actualizarDtInventarioArticuloSchema = z.object({
  id_rl_infraestructura_jerarquia: esquemaNumeroOpcional(1, 2147483647),
  folio_antiguo: esquemaTextoOpcional(50),
  folio: esquemaTextoOpcional(50),
  no_serie: esquemaTextoOpcional(50),
  observaciones: esquemaTextoOpcional(50),
  modelo: esquemaTextoOpcional(50),
  fecha_registro: esquemaFechaOpcional,
  id_ct_inventario_subclase: esquemaNumeroOpcional(1, 2147483647),
  id_ct_inventario_material: esquemaNumeroOpcional(1, 2147483647),
  id_ct_inventario_marca: esquemaNumeroOpcional(1, 2147483647),
  id_ct_inventario_color: esquemaNumeroOpcional(1, 2147483647),
  id_ct_inventario_proveedor: esquemaNumeroOpcional(1, 2147483647),
  id_ct_inventario_estado_fisico: esquemaNumeroOpcional(1, 2147483647),
  id_ct_inventario_tipo_articulo: esquemaNumeroOpcional(1, 2147483647),
  cct: esquemaTextoOpcional(11),
  estado: esquemaEstadoOpcional,
  // id_ct_usuario_up se obtiene automáticamente del JWT
  fecha_up: esquemaFechaOpcional,
});

//? Schema para filtros y paginación de artículos de inventario
//! NOTA: Implementa soft delete - por defecto solo muestra registros activos
export const dtInventarioArticuloFiltrosSchema = z.object({
  //? Filtros específicos
  id_dt_inventario_articulo: esquemaQueryId,
  id_rl_infraestructura_jerarquia: esquemaQueryNumeroOpcional,
  folio: esquemaQueryTexto,
  folio_antiguo: esquemaQueryTexto,
  no_serie: esquemaQueryNumeroOpcional,
  cct: esquemaQueryTexto,
  id_ct_inventario_subclase: esquemaQueryNumeroOpcional,
  id_ct_inventario_material: esquemaQueryNumeroOpcional,
  id_ct_inventario_marca: esquemaQueryNumeroOpcional,
  id_ct_inventario_color: esquemaQueryNumeroOpcional,
  id_ct_inventario_proveedor: esquemaQueryNumeroOpcional,
  id_ct_inventario_estado_fisico: esquemaQueryNumeroOpcional,
  id_ct_inventario_tipo_articulo: esquemaQueryNumeroOpcional,
  estado: esquemaQueryBoolean,
  id_ct_usuario_in: esquemaQueryId,
  fecha_registro: esquemaFechaOpcional,
  fecha_in: esquemaFechaOpcional,

  //? Filtros de includes
  incluir_color: esquemaQueryBoolean,
  incluir_estado_fisico: esquemaQueryBoolean,
  incluir_marca: esquemaQueryBoolean,
  incluir_material: esquemaQueryBoolean,
  incluir_proveedor: esquemaQueryBoolean,
  incluir_subclase: esquemaQueryBoolean,
  incluir_tipo_articulo: esquemaQueryBoolean,
  incluir_jerarquia: esquemaQueryBoolean,
  incluir_todas_relaciones: esquemaQueryBoolean,

  //? Filtros para incluir inactivos
  incluirInactivos: esquemaQueryBoolean,

  //? Paginación
  pagina: esquemaPaginaQuery,
  limite: esquemaLimiteQuery,
});

export type CrearDtInventarioArticuloInput = z.infer<
  typeof crearDtInventarioArticuloSchema
>;
export type ActualizarDtInventarioArticuloInput = z.infer<
  typeof actualizarDtInventarioArticuloSchema
>;

export type BuscarDtInventarioArticuloInput = z.infer<
  typeof dtInventarioArticuloFiltrosSchema
>;

//? Esquema para parámetros de URL (ID de artículo de inventario)
export const dtInventarioArticuloIdParamSchema = z.object({
  id_dt_inventario_articulo: esquemaParamId,
});

//? Esquema para validar el body del DELETE - quién ejecuta la eliminación
// Ya no se usa esquemaDeleteConUsuario - id_ct_usuario_up se obtiene del JWT
export type DtInventarioArticuloIdParam = z.infer<
  typeof dtInventarioArticuloIdParamSchema
>;

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
- esquemaNumeroRequerido/Opcional - Para campos numéricos con validación de rangos
- esquemaFechaRequerida/Opcional - Para campos de fecha
- esquemaQueryId/Texto/Boolean/Numero - Para filtros en query parameters
- esquemaPaginaQuery/LimiteQuery - Para paginación
- esquemaParamId - Para parámetros de URL
- esquemaDeleteConUsuario - Para eliminación con auditoría

📝 Nota sobre dt_inventario_articulo:
- Esta es la tabla principal de inventario con múltiples relaciones
- Incluye todas las relaciones con catálogos de inventario
- Permite filtros por todos los catálogos relacionados
- Soporta includes condicionales para optimizar consultas
*/
