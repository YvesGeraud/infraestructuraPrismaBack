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

//TODO ===== SCHEMAS PARA CT_INFRAESTRUCTURA_SUPERVISOR =====

//? Esquema para crear un nuevo supervisor
export const crearCtInfraestructuraSupervisorSchema = z.object({
  nombre: esquemaTextoRequerido(2, 255),
  cct: esquemaTextoRequerido(11, 11),
  id_dt_infraestructura_ubicacion: esquemaNumeroRequerido(1, 2147483647),
  estado: esquemaEstadoRequerido,
  id_ct_usuario_in: esquemaUsuarioCreacion,
});

//? Esquema para actualizar un supervisor
export const actualizarCtInfraestructuraSupervisorSchema = z.object({
  nombre: esquemaTextoOpcional(255),
  cct: esquemaTextoOpcional(11),
  id_dt_infraestructura_ubicacion: esquemaNumeroOpcional(1, 2147483647),
  estado: esquemaEstadoOpcional,
  id_ct_usuario_up: esquemaUsuarioCreacion, // Requerido para actualización
  fecha_up: esquemaFechaOpcional,
});

//? Schema para filtros y paginación de supervisores
//! NOTA: Implementa soft delete - por defecto solo muestra registros activos
export const ctInfraestructuraSupervisorFiltrosSchema = z.object({
  //? Filtros específicos
  id_ct_infraestructura_supervisor: esquemaQueryId,
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

export type CrearCtInfraestructuraSupervisorInput = z.infer<typeof crearCtInfraestructuraSupervisorSchema>;
export type ActualizarCtInfraestructuraSupervisorInput = z.infer<
  typeof actualizarCtInfraestructuraSupervisorSchema
>;

export type BuscarCtInfraestructuraSupervisorInput = z.infer<typeof ctInfraestructuraSupervisorFiltrosSchema>;

//? Esquema para parámetros de URL (ID de supervisor)
export const ctInfraestructuraSupervisorIdParamSchema = z.object({
  id_ct_infraestructura_supervisor: esquemaParamId,
});

//? Esquema para validar el body del DELETE - quién ejecuta la eliminación
export const eliminarCtInfraestructuraSupervisorSchema = esquemaDeleteConUsuario;

export type CtInfraestructuraSupervisorIdParam = z.infer<typeof ctInfraestructuraSupervisorIdParamSchema>;

export type EliminarCtInfraestructuraSupervisorInput = z.infer<typeof eliminarCtInfraestructuraSupervisorSchema>;

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
