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

//TODO ===== SCHEMAS PARA DT_INFRAESTRUCTURA_UBICACION =====

//? Esquema para crear una nueva ubicación
export const crearDtInfraestructuraUbicacionSchema = z.object({
  calle: esquemaTextoRequerido(2, 255),
  numero_exterior: esquemaNumeroOpcional(1, 2147483647),
  numero_interior: esquemaNumeroOpcional(1, 2147483647),
  id_ct_localidad: esquemaNumeroRequerido(1, 2147483647),
  colonia: esquemaTextoRequerido(2, 255),
  id_ct_codigo_postal: esquemaNumeroRequerido(1, 2147483647),
  latitud: esquemaNumeroOpcional(-90, 90),
  longitud: esquemaNumeroOpcional(-180, 180),
  estado: esquemaEstadoRequerido,});

//? Esquema para actualizar una ubicación
export const actualizarDtInfraestructuraUbicacionSchema = z.object({
  calle: esquemaTextoOpcional(255),
  numero_exterior: esquemaNumeroOpcional(1, 2147483647),
  numero_interior: esquemaNumeroOpcional(1, 2147483647),
  id_ct_localidad: esquemaNumeroOpcional(1, 2147483647),
  colonia: esquemaTextoOpcional(255),
  id_ct_codigo_postal: esquemaNumeroOpcional(1, 2147483647),
  latitud: esquemaNumeroOpcional(-90, 90),
  longitud: esquemaNumeroOpcional(-180, 180),
  estado: esquemaEstadoOpcional,
  id_ct_usuario_up: esquemaUsuarioCreacion, // Requerido para actualización
  fecha_up: esquemaFechaOpcional,
});

//? Schema para filtros y paginación de ubicaciones
//! NOTA: Implementa soft delete - por defecto solo muestra registros activos
export const dtInfraestructuraUbicacionFiltrosSchema = z.object({
  //? Filtros específicos
  id_dt_infraestructura_ubicacion: esquemaQueryId,
  calle: esquemaQueryTexto,
  colonia: esquemaQueryTexto,
  id_ct_localidad: esquemaQueryNumeroOpcional,
  id_ct_codigo_postal: esquemaQueryNumeroOpcional,
  estado: esquemaQueryBoolean,
  id_ct_usuario_in: esquemaQueryId,
  fecha_in: esquemaFechaOpcional,
  incluir_localidad: esquemaQueryBoolean,
  incluir_codigo_postal: esquemaQueryBoolean,
  incluir_todas_relaciones: esquemaQueryBoolean,

  //? Filtros para incluir inactivos
  incluirInactivos: esquemaQueryBoolean,

  //? Paginación
  pagina: esquemaPaginaQuery,
  limite: esquemaLimiteQuery,
});

export type CrearDtInfraestructuraUbicacionInput = z.infer<typeof crearDtInfraestructuraUbicacionSchema>;
export type ActualizarDtInfraestructuraUbicacionInput = z.infer<
  typeof actualizarDtInfraestructuraUbicacionSchema
>;

export type BuscarDtInfraestructuraUbicacionInput = z.infer<typeof dtInfraestructuraUbicacionFiltrosSchema>;

//? Esquema para parámetros de URL (ID de ubicación)
export const dtInfraestructuraUbicacionIdParamSchema = z.object({
  id_dt_infraestructura_ubicacion: esquemaParamId,
});

//? Esquema para validar el body del DELETE - quién ejecuta la eliminación
// Ya no se usa esquemaDeleteConUsuario - id_ct_usuario_up se obtiene del JWT
export type DtInfraestructuraUbicacionIdParam = z.infer<typeof dtInfraestructuraUbicacionIdParamSchema>;

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

📝 Nota sobre dt_infraestructura_ubicacion:
- Tabla principal de ubicaciones con coordenadas geográficas
- Incluye validación de rangos para latitud (-90 a 90) y longitud (-180 a 180)
- Relaciones con localidad y código postal
- Soporta includes condicionales para optimizar consultas
*/
