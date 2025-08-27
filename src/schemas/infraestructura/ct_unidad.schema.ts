import { z } from "zod";

//TODO ===== SCHEMAS PARA CT_INFRAESTRUCTURA_UNIDAD =====

//? Esquemas para crear una nueva unidad de infraestructura
export const crearCtUnidadSchema = z.object({
  id_escuelaPlantel: z.number().default(0),
  id_tipo_escuela: z.number().default(0),
  cct: z.string().max(11, "El CCT debe tener máximo 11 caracteres"),
  nombre_unidad: z
    .string()
    .max(255, "El nombre de la unidad debe tener máximo 255 caracteres"),
  calle: z.string().max(255).optional(),
  numero_exterior: z.string().max(10).optional(),
  numero_interior: z.string().max(10).optional(),
  id_localidad: z.number().optional(),
  colonia: z.string().max(255).optional(),
  codigo_postal: z.number().optional(),
  longitud: z.number().optional(),
  latitud: z.number().optional(),
  id_sostenimiento: z.number().optional(),
  vigente: z.number().optional(),
  id_rupet_info: z.number().optional(),
  num_centros_trabajo: z.number().default(0),
  construido_para_uso_educativo: z.boolean().default(false),
  uso_temporal_educacion_basica: z.boolean().default(false),
  id_razon_no_construccion: z.number().optional(),
  razon_no_construccion_otro: z.string().max(255).optional(),
  id_antiguedad_inmueble: z.number().optional(),
  id_dimension_terreno: z.number().optional(),
  num_edificios_educacion_basica: z.number().default(0),
  porcentaje_ocupacion_edificios: z.number().min(0).max(100).optional(),
  servicio_agua_regular: z.boolean().default(false),
  agua_potable_frecuente: z.boolean().default(false),
  id_suministro_energia: z.number().optional(),
  id_suministro_gas: z.number().optional(),
  suministro_gas_otro: z.string().max(255).optional(),
  id_tipo_descarga: z.number().optional(),
  tipo_descarga_otro: z.string().max(255).optional(),
  separacion_aguas: z.boolean().default(false),
  banios_hombres: z.number().default(0),
  banios_mujeres: z.number().default(0),
  banios_mixtos: z.number().default(0),
  tazas_sanitarias_uso: z.number().default(0),
  tazas_sanitarias_fuera_uso: z.number().default(0),
  mingitorios_uso: z.number().default(0),
  mingitorios_fuera_uso: z.number().default(0),
  letrinas_uso: z.number().default(0),
  letrinas_fuera_uso: z.number().default(0),
  tazas_hombres: z.number().default(0),
  tazas_mujeres: z.number().default(0),
  tazas_mixtos: z.number().default(0),
  tazas_alum: z.number().default(0),
  tazas_docadm: z.number().default(0),
  tazas_ambos: z.number().default(0),
  mingitorios_alum: z.number().default(0),
  mingitorios_docadm: z.number().default(0),
  mingitorios_ambos: z.number().default(0),
  letrinas_alum: z.number().default(0),
  letrinas_docadm: z.number().default(0),
  letrinas_ambos: z.number().default(0),
  lavamanos_hombres_uso: z.number().default(0),
  lavamanos_hombres_fuera_uso: z.number().default(0),
  lavamanos_mujeres_uso: z.number().default(0),
  lavamanos_mujeres_fuera_uso: z.number().default(0),
  lavamanos_mixtos_uso: z.number().default(0),
  lavamanos_mixtos_fuera_uso: z.number().default(0),
  bebederos_uso: z.number().default(0),
  bebederos_fuera_uso: z.number().default(0),
  area_mantenimiento: z.boolean().default(false),
  rehabilitacion_5_anios: z.boolean().default(false),
  reconversion_5_anios: z.boolean().default(false),
  id_frecuencia_limpieza: z.number().optional(),
  programa_proteccion_civil: z.boolean().default(false),
  alarmas_existentes: z.number().default(0),
  alarmas_uso: z.number().default(0),
  botiquines_existentes: z.number().default(0),
  botiquines_uso: z.number().default(0),
  extintores_existentes: z.number().default(0),
  extintores_uso: z.number().default(0),
  senales_emergencia_existentes: z.number().default(0),
  senales_emergencia_uso: z.number().default(0),
  salidas_emergencia_existentes: z.number().default(0),
  salidas_emergencia_uso: z.number().default(0),
  zonas_seguridad_existentes: z.number().default(0),
  zonas_seguridad_uso: z.number().default(0),
  estacionamiento: z.boolean().default(false),
  estacionamiento_estudiantes: z.number().default(0),
  estacionamiento_docentes: z.number().default(0),
  estacionamiento_admin: z.number().default(0),
  estacionamiento_discapacidad: z.number().default(0),
  estacionamiento_otros: z.number().default(0),
  infraestructura_discapacidad: z.boolean().default(false),
  aulas_accesibles: z.boolean().default(false),
  biblioteca_accesible: z.boolean().default(false),
  laboratorios_accesibles: z.boolean().default(false),
  talleres_accesibles: z.boolean().default(false),
  cafeteria_accesible: z.boolean().default(false),
  sanitarios_accesibles: z.boolean().default(false),
  bebederos_accesibles: z.boolean().default(false),
  otras_areas_accesibles: z.boolean().default(false),
  otras_areas_accesibles_desc: z.string().max(255).optional(),
  banios_discap_hombres_uso: z.number().default(0),
  banios_discap_mujeres_uso: z.number().default(0),
  banios_discap_mixtos_uso: z.number().default(0),
  banios_discap_hombres_fuera_uso: z.number().default(0),
  banios_discap_mujeres_fuera_uso: z.number().default(0),
  banios_discap_mixtos_fuera_uso: z.number().default(0),
  senializacion_discapacidad: z.boolean().default(false),
  rampas: z.boolean().default(false),
  pavimento_tactil: z.boolean().default(false),
  barandales_pasamanos: z.boolean().default(false),
  area_braille: z.boolean().default(false),
  elevadores_plataformas: z.boolean().default(false),
  tira_antiderrapante: z.boolean().default(false),
  aula_especializada_discapacidad: z.boolean().default(false),
  seniales_mundial_ciegos: z.number().default(0),
  seniales_mundial_sordos: z.number().default(0),
  seniales_accesibilidad_para_perros_guia: z.number().default(0),
  seniales_telefono_texto_sordos: z.number().default(0),
  num_software_discapacidad: z.number().default(0),
  claves_centros_trabajo: z.string().optional(),
});

//? Esquemas para actualizar una unidad de infraestructura
export const actualizarCtUnidadSchema = crearCtUnidadSchema.partial();

//? Schema para búsqueda de unidades
export const buscarUnidadesSchema = z.object({
  cct: z.string().optional(),
  nombre_unidad: z.string().optional(),
  id_localidad: z.number().optional(),
  id_sostenimiento: z.number().optional(),
  vigente: z.number().optional(),
  id_tipo_escuela: z.number().optional(),
});

//? Schema para obtener unidades por municipio
export const unidadesPorMunicipioSchema = z.object({
  cve_mun: z
    .string()
    .regex(/^\d{2,3}$/, "La clave del municipio debe ser de 2 a 3 dígitos"),
});

//? Schema para obtener unidades por CCT
export const unidadesPorCCTSchema = z.object({
  cct: z.string().max(11, "El CCT debe tener máximo 11 caracteres"),
});

//? Importar schemas comunes
export { paginationSchema, idParamSchema } from "../commonSchemas";

//TODO ===== TIPOS INFERIDOS =====
export type CrearCtUnidadInput = z.infer<typeof crearCtUnidadSchema>;
export type ActualizarCtUnidadInput = z.infer<typeof actualizarCtUnidadSchema>;
export type BuscarUnidadesInput = z.infer<typeof buscarUnidadesSchema>;
export type UnidadesPorMunicipioInput = z.infer<
  typeof unidadesPorMunicipioSchema
>;
export type UnidadesPorCCTInput = z.infer<typeof unidadesPorCCTSchema>;

//? Schema para validar ID de unidad en parámetros de ruta
export const ctUnidadIdParamSchema = z.object({
  id_unidad: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(
      z.number().int().positive("ID de la unidad debe ser un número positivo")
    ),
});

export type CtUnidadIdParam = z.infer<typeof ctUnidadIdParamSchema>;
