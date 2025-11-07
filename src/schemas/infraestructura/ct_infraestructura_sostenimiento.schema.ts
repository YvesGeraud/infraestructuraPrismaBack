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

//TODO ===== SCHEMAS PARA CT_INFRAESTRUCTURA_SOSTENIMIENTO =====

//? Esquema para crear un nuevo sostenimiento
export const crearCtInfraestructuraSostenimientoSchema = z.object({
  sostenimiento: esquemaTextoRequerido(1, 50),
  estado: esquemaEstadoRequerido,});

//? Esquema para actualizar un sostenimiento
export const actualizarCtInfraestructuraSostenimientoSchema = z.object({
  sostenimiento: esquemaTextoOpcional(50),
  estado: esquemaEstadoOpcional,
  id_ct_usuario_up: esquemaUsuarioCreacion, // Requerido para actualización
  fecha_up: esquemaFechaOpcional,
});

//? Schema para filtros y paginación de sostenimientos
//! NOTA: Implementa soft delete - por defecto solo muestra registros activos
export const ctInfraestructuraSostenimientoFiltrosSchema = z.object({
  //? Filtros específicos
  id_ct_infraestructura_sostenimiento: esquemaQueryId,
  sostenimiento: esquemaQueryTexto,
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

export type CrearCtInfraestructuraSostenimientoInput = z.infer<typeof crearCtInfraestructuraSostenimientoSchema>;
export type ActualizarCtInfraestructuraSostenimientoInput = z.infer<
  typeof actualizarCtInfraestructuraSostenimientoSchema
>;

export type BuscarCtInfraestructuraSostenimientoInput = z.infer<typeof ctInfraestructuraSostenimientoFiltrosSchema>;

//? Esquema para parámetros de URL (ID de sostenimiento)
export const ctInfraestructuraSostenimientoIdParamSchema = z.object({
  id_ct_infraestructura_sostenimiento: esquemaParamId,
});

//? Esquema para validar el body del DELETE - quién ejecuta la eliminación
// Ya no se usa esquemaDeleteConUsuario - id_ct_usuario_up se obtiene del JWT
export type CtInfraestructuraSostenimientoIdParam = z.infer<typeof ctInfraestructuraSostenimientoIdParamSchema>;

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
