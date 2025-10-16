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
  esquemaQueryNumeroRequerido,
  esquemaQueryNumeroOpcional,
  esquemaNumeroOpcional,
} from "../commonSchemas";

//TODO ===== SCHEMAS PARA DT_BITACORA =====

//? Esquema para crear un nuevo registro de bitácora
export const crearDtBitacoraSchema = z.object({
  id_ct_bitacora_accion: esquemaNumeroRequerido(1, 100000),
  id_ct_bitacora_tabla: esquemaNumeroRequerido(1, 100000),
  id_registro_afectado: esquemaNumeroRequerido(1, 2147483647), // Int max
  datos_anteriores: esquemaTextoRequerido(0, 16777215), // LongText max
  datos_nuevos: esquemaTextoRequerido(0, 16777215), // LongText max
  estado: esquemaEstadoRequerido,
});

//? Esquema para actualizar un registro de bitácora
export const actualizarDtBitacoraSchema = z.object({
  id_ct_bitacora_accion: esquemaNumeroOpcional(1, 100000),
  id_ct_bitacora_tabla: esquemaNumeroOpcional(1, 100000),
  id_registro_afectado: esquemaNumeroOpcional(1, 2147483647),
  datos_anteriores: esquemaTextoOpcional(16777215),
  datos_nuevos: esquemaTextoOpcional(16777215),
  estado: esquemaEstadoOpcional,
  // id_ct_usuario_up se obtiene automáticamente del JWT
  fecha_up: esquemaFechaOpcional,
});

//? Schema para filtros y paginación de registros de bitácora
//! NOTA: Implementa soft delete - por defecto solo muestra registros activos
export const dtBitacoraFiltrosSchema = z.object({
  //? Filtros específicos
  id_dt_bitacora: esquemaQueryId,
  id_ct_bitacora_accion: esquemaQueryNumeroOpcional,
  id_ct_bitacora_tabla: esquemaQueryNumeroOpcional,
  id_registro_afectado: esquemaQueryNumeroOpcional,
  estado: esquemaQueryBoolean,
  id_ct_usuario_in: esquemaQueryId,
  fecha_in: esquemaFechaOpcional,

  //? Filtros de includes
  incluir_accion: esquemaQueryBoolean,
  incluir_tabla: esquemaQueryBoolean,
  incluir_todas_relaciones: esquemaQueryBoolean,

  //? Filtros para incluir inactivos
  incluirInactivos: esquemaQueryBoolean,

  //? Paginación
  pagina: esquemaPaginaQuery,
  limite: esquemaLimiteQuery,
});

export type CrearDtBitacoraInput = z.infer<typeof crearDtBitacoraSchema>;
export type ActualizarDtBitacoraInput = z.infer<
  typeof actualizarDtBitacoraSchema
>;

export type BuscarDtBitacoraInput = z.infer<typeof dtBitacoraFiltrosSchema>;

//? Esquema para parámetros de URL (ID de registro de bitácora)
export const dtBitacoraIdParamSchema = z.object({
  id_dt_bitacora: esquemaParamId,
});

//? Esquema para validar el body del DELETE - quién ejecuta la eliminación
// Ya no se usa esquemaDeleteConUsuario - id_ct_usuario_up se obtiene del JWT
export type DtBitacoraIdParam = z.infer<typeof dtBitacoraIdParamSchema>;

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
- esquemaTextoRequerido/Opcional - Para campos de texto (incluye LongText)
- esquemaEstadoRequerido/Opcional - Para campos booleanos de estado
- esquemaUsuarioCreacion/Actualización - Para auditoría de usuarios
- esquemaNumeroRequerido/Opcional - Para campos numéricos con validación de rangos
- esquemaQueryId/Texto/Boolean/Numero - Para filtros en query parameters
- esquemaPaginaQuery/LimiteQuery - Para paginación
- esquemaParamId - Para parámetros de URL
- esquemaDeleteConUsuario - Para eliminación con auditoría

📝 Nota sobre dt_bitacora:
- Esta tabla registra todos los cambios realizados en el sistema
- Incluye relaciones con ct_bitacora_accion, ct_bitacora_tabla
- Los campos datos_anteriores y datos_nuevos son LongText (hasta 16MB)
- Permite filtrar por acción, tabla y registro afectado
*/
