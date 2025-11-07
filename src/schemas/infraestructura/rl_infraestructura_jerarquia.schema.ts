import { z } from "zod";
import {
  esquemaTextoRequerido,
  esquemaTextoOpcional,
  esquemaEstadoRequerido,
  esquemaEstadoOpcional,
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
  esquemaFechaOpcional,
} from "../commonSchemas";

//TODO ===== SCHEMAS PARA RL_INFRAESTRUCTURA_JERARQUIA =====

//? Esquema para crear una nueva relación jerárquica
export const crearRlInfraestructuraJerarquiaSchema = z.object({
  id_instancia: esquemaNumeroRequerido(1, 2147483647),
  id_ct_infraestructura_tipo_instancia: esquemaNumeroRequerido(1, 2147483647),
  id_dependencia: esquemaNumeroOpcional(1, 2147483647).nullable(),
  estado: esquemaEstadoRequerido,
});

//? Esquema para actualizar una relación jerárquica
export const actualizarRlInfraestructuraJerarquiaSchema = z.object({
  id_instancia: esquemaNumeroOpcional(1, 2147483647),
  id_ct_infraestructura_tipo_instancia: esquemaNumeroOpcional(1, 2147483647),
  id_dependencia: esquemaNumeroOpcional(1, 2147483647).nullable(),
  estado: esquemaEstadoOpcional,
  // id_ct_usuario_up se obtiene automáticamente del JWT
});

//? Schema para filtros y paginación de relaciones jerárquicas
//! NOTA: Implementa soft delete - por defecto solo muestra registros activos
export const rlInfraestructuraJerarquiaFiltrosSchema = z.object({
  //? Filtros específicos
  id_rl_infraestructura_jerarquia: esquemaQueryId,
  // Usar esquemaQueryId en lugar de esquemaQueryNumeroOpcional para transformar string a number
  id_instancia: esquemaQueryId,
  id_ct_infraestructura_tipo_instancia: esquemaQueryId,
  id_dependencia: esquemaQueryId,
  estado: esquemaQueryBoolean,
  id_ct_usuario_in: esquemaQueryId,
  id_ct_usuario_up: esquemaQueryId,
  fecha_in: esquemaFechaOpcional,

  //? Includes condicionales
  incluir_tipo_instancia: esquemaQueryBoolean,
  incluir_dependencia: esquemaQueryBoolean,

  //? Filtros para incluir inactivos
  incluirInactivos: esquemaQueryBoolean,

  //? Paginación
  pagina: esquemaPaginaQuery,
  limite: esquemaLimiteQuery,
});

export type CrearRlInfraestructuraJerarquiaInput = z.infer<
  typeof crearRlInfraestructuraJerarquiaSchema
>;
export type ActualizarRlInfraestructuraJerarquiaInput = z.infer<
  typeof actualizarRlInfraestructuraJerarquiaSchema
>;

export type BuscarRlInfraestructuraJerarquiaInput = z.infer<
  typeof rlInfraestructuraJerarquiaFiltrosSchema
>;

//? Esquema para parámetros de URL (ID de jerarquía)
export const rlInfraestructuraJerarquiaIdParamSchema = z.object({
  id_rl_infraestructura_jerarquia: esquemaParamId,
});

export type RlInfraestructuraJerarquiaIdParam = z.infer<
  typeof rlInfraestructuraJerarquiaIdParamSchema
>;

/*
🎉 SCHEMA PARA RL_INFRAESTRUCTURA_JERARQUIA

✅ Características:
- ✨ Sigue el patrón estándar de schemas del proyecto
- 🔄 Reutilización de esquemas base
- 📝 Validaciones completas
- 🚀 Includes configurables (tipo_instancia, dependencia)

🔧 Esquemas utilizados:
- esquemaNumeroRequerido/Opcional - Para IDs numéricos
- esquemaEstadoRequerido/Opcional - Para campos booleanos de estado
- esquemaQueryId/Numero/Boolean - Para filtros en query parameters
- esquemaPaginaQuery/LimiteQuery - Para paginación
- esquemaParamId - Para parámetros de URL

📊 Campos:
- id_instancia: ID de la instancia específica (ej: ID del jefe de sector)
- id_ct_infraestructura_tipo_instancia: Tipo de instancia
- id_dependencia: ID de otra entrada en rl_infraestructura_jerarquia (self-reference, nullable)
*/
