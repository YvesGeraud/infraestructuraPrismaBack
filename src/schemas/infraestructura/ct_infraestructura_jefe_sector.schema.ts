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
  esquemaNumeroOpcional,
  esquemaQueryNumeroOpcional,
} from "../commonSchemas";

//TODO ===== SCHEMAS PARA CT_INFRAESTRUCTURA_JEFE_SECTOR =====

//? Esquema para crear un nuevo jefe de sector
export const crearCtInfraestructuraJefeSectorSchema = z.object({
  nombre: esquemaTextoRequerido(2, 255),
  cct: esquemaTextoRequerido(11, 11),
  id_dt_infraestructura_ubicacion: esquemaNumeroRequerido(0, 2147483647),
  estado: esquemaEstadoRequerido,
  id_ct_usuario_in: esquemaUsuarioCreacion,
});

//? Esquema para actualizar un jefe de sector
export const actualizarCtInfraestructuraJefeSectorSchema = z.object({
  nombre: esquemaTextoOpcional(255),
  cct: esquemaTextoOpcional(11),
  id_dt_infraestructura_ubicacion: esquemaNumeroOpcional(0, 2147483647),
  estado: esquemaEstadoOpcional,
  id_ct_usuario_up: esquemaUsuarioCreacion, // Requerido para actualización
  fecha_up: esquemaFechaOpcional,
});

//? Schema para filtros y paginación de jefes de sector
//! NOTA: Implementa soft delete - por defecto solo muestra registros activos
export const ctInfraestructuraJefeSectorFiltrosSchema = z.object({
  //? Filtros específicos
  id_ct_infraestructura_jefe_sector: esquemaQueryId,
  nombre: esquemaQueryTexto,
  cct: esquemaQueryTexto,
  id_dt_infraestructura_ubicacion: esquemaQueryNumeroOpcional,
  estado: esquemaQueryBoolean,
  id_ct_usuario_in: esquemaQueryId,
  fecha_in: esquemaFechaOpcional,
  incluir_ubicacion: esquemaQueryBoolean,

  //? Filtros para incluir inactivos
  incluirInactivos: esquemaQueryBoolean,

  //? Paginación
  pagina: esquemaPaginaQuery,
  limite: esquemaLimiteQuery,
});

export type CrearCtInfraestructuraJefeSectorInput = z.infer<typeof crearCtInfraestructuraJefeSectorSchema>;
export type ActualizarCtInfraestructuraJefeSectorInput = z.infer<
  typeof actualizarCtInfraestructuraJefeSectorSchema
>;

export type BuscarCtInfraestructuraJefeSectorInput = z.infer<typeof ctInfraestructuraJefeSectorFiltrosSchema>;

//? Esquema para parámetros de URL (ID de jefe de sector)
export const ctInfraestructuraJefeSectorIdParamSchema = z.object({
  id_ct_infraestructura_jefe_sector: esquemaParamId,
});

//? Esquema para validar el body del DELETE - quién ejecuta la eliminación
export const eliminarCtInfraestructuraJefeSectorSchema = esquemaDeleteConUsuario;

export type CtInfraestructuraJefeSectorIdParam = z.infer<typeof ctInfraestructuraJefeSectorIdParamSchema>;

export type EliminarCtInfraestructuraJefeSectorInput = z.infer<typeof eliminarCtInfraestructuraJefeSectorSchema>;

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
- esquemaQueryId/Texto/Boolean/Numero - Para filtros en query parameters
- esquemaPaginaQuery/LimiteQuery - Para paginación
- esquemaParamId - Para parámetros de URL
- esquemaDeleteConUsuario - Para eliminación con auditoría
*/
