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

//TODO ===== SCHEMAS PARA CT_INFRAESTRUCTURA_ESCUELA =====

//? Esquema para crear una nueva escuela
export const crearCtInfraestructuraEscuelaSchema = z.object({
  id_escuela_plantel: esquemaNumeroRequerido(0, 2147483647),
  id_ct_tipo_escuela: esquemaNumeroRequerido(0, 2147483647),
  cct: esquemaTextoRequerido(11, 11),
  nombre: esquemaTextoRequerido(2, 255),
  id_ct_sostenimiento: esquemaNumeroRequerido(0, 2147483647),
  id_dt_infraestructura_ubicacion: esquemaNumeroRequerido(0, 2147483647),
  estado: esquemaEstadoRequerido,
  id_ct_usuario_in: esquemaUsuarioCreacion,
});

//? Esquema para actualizar una escuela
export const actualizarCtInfraestructuraEscuelaSchema = z.object({
  id_escuela_plantel: esquemaNumeroOpcional(0, 2147483647),
  id_ct_tipo_escuela: esquemaNumeroOpcional(0, 2147483647),
  cct: esquemaTextoOpcional(11),
  nombre: esquemaTextoOpcional(255),
  id_ct_sostenimiento: esquemaNumeroOpcional(0, 2147483647),
  id_dt_infraestructura_ubicacion: esquemaNumeroOpcional(0, 2147483647),
  estado: esquemaEstadoOpcional,
  id_ct_usuario_up: esquemaUsuarioCreacion, // Requerido para actualización
  fecha_up: esquemaFechaOpcional,
});

//? Schema para filtros y paginación de escuelas
//! NOTA: Implementa soft delete - por defecto solo muestra registros activos
export const ctInfraestructuraEscuelaFiltrosSchema = z.object({
  //? Filtros específicos
  id_ct_infraestructura_escuela: esquemaQueryId,
  id_escuela_plantel: esquemaQueryNumeroOpcional,
  id_ct_tipo_escuela: esquemaQueryNumeroOpcional,
  cct: esquemaQueryTexto,
  nombre: esquemaQueryTexto,
  id_ct_sostenimiento: esquemaQueryNumeroOpcional,
  id_dt_infraestructura_ubicacion: esquemaQueryNumeroOpcional,
  estado: esquemaQueryBoolean,
  id_ct_usuario_in: esquemaQueryId,
  fecha_in: esquemaFechaOpcional,
  incluir_ubicacion: esquemaQueryBoolean,
  incluir_sostenimiento: esquemaQueryBoolean,
  incluir_tipo_escuela: esquemaQueryBoolean,
  incluir_todas_relaciones: esquemaQueryBoolean,

  //? Filtros para incluir inactivos
  incluirInactivos: esquemaQueryBoolean,

  //? Paginación
  pagina: esquemaPaginaQuery,
  limite: esquemaLimiteQuery,
});

export type CrearCtInfraestructuraEscuelaInput = z.infer<typeof crearCtInfraestructuraEscuelaSchema>;
export type ActualizarCtInfraestructuraEscuelaInput = z.infer<
  typeof actualizarCtInfraestructuraEscuelaSchema
>;

export type BuscarCtInfraestructuraEscuelaInput = z.infer<typeof ctInfraestructuraEscuelaFiltrosSchema>;

//? Esquema para parámetros de URL (ID de escuela)
export const ctInfraestructuraEscuelaIdParamSchema = z.object({
  id_ct_infraestructura_escuela: esquemaParamId,
});

//? Esquema para validar el body del DELETE - quién ejecuta la eliminación
export const eliminarCtInfraestructuraEscuelaSchema = esquemaDeleteConUsuario;

export type CtInfraestructuraEscuelaIdParam = z.infer<typeof ctInfraestructuraEscuelaIdParamSchema>;

export type EliminarCtInfraestructuraEscuelaInput = z.infer<typeof eliminarCtInfraestructuraEscuelaSchema>;

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
