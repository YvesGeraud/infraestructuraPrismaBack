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

//TODO ===== SCHEMAS PARA CT_INFRAESTRUCTURA_TIPO_ESCUELA =====

//? Esquema para crear un nuevo tipo de escuela
export const crearCtInfraestructuraTipoEscuelaSchema = z.object({
  tipo_escuela: esquemaTextoRequerido(2, 85),
  clave: esquemaTextoRequerido(2, 2),
  estado: esquemaEstadoRequerido,});

//? Esquema para actualizar un tipo de escuela
export const actualizarCtInfraestructuraTipoEscuelaSchema = z.object({
  tipo_escuela: esquemaTextoOpcional(85),
  clave: esquemaTextoOpcional(2),
  estado: esquemaEstadoOpcional,
  id_ct_usuario_up: esquemaUsuarioCreacion, // Requerido para actualización
  fecha_up: esquemaFechaOpcional,
});

//? Schema para filtros y paginación de tipos de escuela
//! NOTA: Implementa soft delete - por defecto solo muestra registros activos
export const ctInfraestructuraTipoEscuelaFiltrosSchema = z.object({
  //? Filtros específicos
  id_ct_infraestructura_tipo_escuela: esquemaQueryId,
  tipo_escuela: esquemaQueryTexto,
  clave: esquemaQueryTexto,
  estado: esquemaQueryBoolean,
  id_ct_usuario_in: esquemaQueryId,
  fecha_in: esquemaFechaOpcional,
  incluir_escuelas: esquemaQueryBoolean,

  //? Filtros para incluir inactivos
  incluirInactivos: esquemaQueryBoolean,

  //? Paginación
  pagina: esquemaPaginaQuery,
  limite: esquemaLimiteQuery,
});

export type CrearCtInfraestructuraTipoEscuelaInput = z.infer<typeof crearCtInfraestructuraTipoEscuelaSchema>;
export type ActualizarCtInfraestructuraTipoEscuelaInput = z.infer<
  typeof actualizarCtInfraestructuraTipoEscuelaSchema
>;

export type BuscarCtInfraestructuraTipoEscuelaInput = z.infer<typeof ctInfraestructuraTipoEscuelaFiltrosSchema>;

//? Esquema para parámetros de URL (ID de tipo de escuela)
export const ctInfraestructuraTipoEscuelaIdParamSchema = z.object({
  id_ct_infraestructura_tipo_escuela: esquemaParamId,
});

//? Esquema para validar el body del DELETE - quién ejecuta la eliminación
// Ya no se usa esquemaDeleteConUsuario - id_ct_usuario_up se obtiene del JWT
export type CtInfraestructuraTipoEscuelaIdParam = z.infer<typeof ctInfraestructuraTipoEscuelaIdParamSchema>;

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
- esquemaQueryId/Texto/Boolean/Numero - Para filtros en query parameters
- esquemaPaginaQuery/LimiteQuery - Para paginación
- esquemaParamId - Para parámetros de URL
- esquemaDeleteConUsuario - Para eliminación con auditoría
*/
