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

//TODO ===== SCHEMAS PARA CT_INFRAESTRUCTURA_TIPO_INSTANCIA =====

//? Esquema para crear un nuevo tipo de instancia
export const crearCtInfraestructuraTipoInstanciaSchema = z.object({
  nombre: esquemaTextoRequerido(1, 50),
  estado: esquemaEstadoRequerido,
  id_ct_usuario_in: esquemaUsuarioCreacion,
});

//? Esquema para actualizar un tipo de instancia
export const actualizarCtInfraestructuraTipoInstanciaSchema = z.object({
  nombre: esquemaTextoOpcional(50),
  estado: esquemaEstadoOpcional,
  id_ct_usuario_up: esquemaUsuarioCreacion, // Requerido para actualización
  fecha_up: esquemaFechaOpcional,
});

//? Schema para filtros y paginación de tipos de instancia
//! NOTA: Implementa soft delete - por defecto solo muestra registros activos
export const ctInfraestructuraTipoInstanciaFiltrosSchema = z.object({
  //? Filtros específicos
  id_ct_infraestructura_tipo_instancia: esquemaQueryId,
  nombre: esquemaQueryTexto,
  estado: esquemaQueryBoolean,
  id_ct_usuario_in: esquemaQueryId,
  fecha_in: esquemaFechaOpcional,
  incluir_jerarquias: esquemaQueryBoolean,

  //? Filtros para incluir inactivos
  incluirInactivos: esquemaQueryBoolean,

  //? Paginación
  pagina: esquemaPaginaQuery,
  limite: esquemaLimiteQuery,
});

export type CrearCtInfraestructuraTipoInstanciaInput = z.infer<typeof crearCtInfraestructuraTipoInstanciaSchema>;
export type ActualizarCtInfraestructuraTipoInstanciaInput = z.infer<
  typeof actualizarCtInfraestructuraTipoInstanciaSchema
>;

export type BuscarCtInfraestructuraTipoInstanciaInput = z.infer<typeof ctInfraestructuraTipoInstanciaFiltrosSchema>;

//? Esquema para parámetros de URL (ID de tipo de instancia)
export const ctInfraestructuraTipoInstanciaIdParamSchema = z.object({
  id_ct_infraestructura_tipo_instancia: esquemaParamId,
});

//? Esquema para validar el body del DELETE - quién ejecuta la eliminación
export const eliminarCtInfraestructuraTipoInstanciaSchema = esquemaDeleteConUsuario;

export type CtInfraestructuraTipoInstanciaIdParam = z.infer<typeof ctInfraestructuraTipoInstanciaIdParamSchema>;

export type EliminarCtInfraestructuraTipoInstanciaInput = z.infer<typeof eliminarCtInfraestructuraTipoInstanciaSchema>;

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
