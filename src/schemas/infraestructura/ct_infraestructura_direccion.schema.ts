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

//TODO ===== SCHEMAS PARA CT_INFRAESTRUCTURA_DIRECCION =====

//? Esquema para crear una nueva dirección
export const crearCtInfraestructuraDireccionSchema = z.object({
  nombre: esquemaTextoRequerido(2, 255),
  cct: esquemaTextoRequerido(11, 11),
  id_dt_infraestructura_ubicacion: esquemaNumeroRequerido(1, 2147483647),
  estado: esquemaEstadoRequerido,});

//? Esquema para actualizar una dirección
export const actualizarCtInfraestructuraDireccionSchema = z.object({
  nombre: esquemaTextoOpcional(255),
  cct: esquemaTextoOpcional(11),
  id_dt_infraestructura_ubicacion: esquemaNumeroOpcional(1, 2147483647),
  estado: esquemaEstadoOpcional,
  id_ct_usuario_up: esquemaUsuarioCreacion, // Requerido para actualización
  fecha_up: esquemaFechaOpcional,
});

//? Schema para filtros y paginación de direcciones
//! NOTA: Implementa soft delete - por defecto solo muestra registros activos
export const ctInfraestructuraDireccionFiltrosSchema = z.object({
  //? Filtros específicos
  id_ct_infraestructura_direccion: esquemaQueryId,
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

export type CrearCtInfraestructuraDireccionInput = z.infer<typeof crearCtInfraestructuraDireccionSchema>;
export type ActualizarCtInfraestructuraDireccionInput = z.infer<
  typeof actualizarCtInfraestructuraDireccionSchema
>;

export type BuscarCtInfraestructuraDireccionInput = z.infer<typeof ctInfraestructuraDireccionFiltrosSchema>;

//? Esquema para parámetros de URL (ID de dirección)
export const ctInfraestructuraDireccionIdParamSchema = z.object({
  id_ct_infraestructura_direccion: esquemaParamId,
});

//? Esquema para validar el body del DELETE - quién ejecuta la eliminación
// Ya no se usa esquemaDeleteConUsuario - id_ct_usuario_up se obtiene del JWT
export type CtInfraestructuraDireccionIdParam = z.infer<typeof ctInfraestructuraDireccionIdParamSchema>;

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
