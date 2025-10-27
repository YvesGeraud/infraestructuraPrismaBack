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
  paginationSchema,
  idParamSchema,
  esquemaQueryNumeroOpcional,
  esquemaNumeroOpcional,
} from "./commonSchemas";

//TODO ===== SCHEMAS PARA CT_LOCALIDAD =====

//? Esquema para crear una nueva capitulo
export const crearCtLocalidadSchema = z.object({
  nombre: esquemaTextoRequerido(2, 100),
  codigo_postal: esquemaNumeroRequerido(1, 100000),
  ambito: esquemaTextoRequerido(1, 1),
  id_ct_municipio: esquemaNumeroRequerido(1, 100000),
  estado: esquemaEstadoRequerido,
});

//? Esquema para actualizar una capitulo
export const actualizarCtLocalidadSchema = z.object({
  nombre: esquemaTextoOpcional(100),
  codigo_postal: esquemaNumeroOpcional(1, 100000),
  ambito: esquemaTextoOpcional(1),
  id_ct_municipio: esquemaQueryId,
  estado: esquemaEstadoOpcional,
  // id_ct_usuario_up se obtiene automáticamente del JWT
});

//? Schema para filtros y paginación de capitulos
//! NOTA: Implementa soft delete - por defecto solo muestra registros activos
export const ctLocalidadFiltrosSchema = z.object({
  //? Filtros específicos
  id_ct_localidad: esquemaQueryId,
  nombre: esquemaQueryTexto,
  codigo_postal: esquemaQueryNumeroOpcional,
  ambito: esquemaQueryTexto,
  id_ct_municipio: esquemaQueryId,
  estado: esquemaQueryBoolean,
  id_ct_usuario_up: esquemaQueryId,
  fecha_in: esquemaFechaOpcional,
  incluir_municipio: esquemaQueryBoolean,
  incluir_municipio_con_entidad: esquemaQueryBoolean,

  //? Filtros para incluir inactivos de capitulos
  incluirInactivos: esquemaQueryBoolean,

  //? Paginación
  pagina: esquemaPaginaQuery,
  limite: esquemaLimiteQuery,
});

export type CrearCtLocalidadInput = z.infer<typeof crearCtLocalidadSchema>;
export type ActualizarCtLocalidadInput = z.infer<
  typeof actualizarCtLocalidadSchema
>;

export type BuscarCtLocalidadInput = z.infer<typeof ctLocalidadFiltrosSchema>;

//? Esquema para parámetros de URL (ID de capitulo)
export const ctLocalidadIdParamSchema = z.object({
  id_ct_localidad: esquemaParamId,
});

//? Esquema para validar el body del DELETE - quién ejecuta la eliminación
// Ya no se usa esquemaDeleteConUsuario - id_ct_usuario_up se obtiene del JWT
export type CtLocalidadIdParam = z.infer<typeof ctLocalidadIdParamSchema>;

// Ya no se usa - DELETE no requiere body
// export type EliminarCtLocalidadInput = z.infer<
//   typeof eliminarCtLocalidadSchema
// >;

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
