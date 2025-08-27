-- CreateTable
CREATE TABLE `ct_accion` (
    `id_accion` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre_accion` VARCHAR(250) NULL,
    `descripcion` VARCHAR(250) NULL,

    PRIMARY KEY (`id_accion`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ct_codigo_postal` (
    `id_codigo_postal` INTEGER NOT NULL AUTO_INCREMENT,
    `codigo_postal` VARCHAR(10) NULL,
    `asentamiento` VARCHAR(150) NULL,
    `id_localidad` INTEGER NULL,

    PRIMARY KEY (`id_codigo_postal`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ct_entidad` (
    `id_entidad` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(100) NULL,
    `abreviatura` VARCHAR(10) NULL,

    UNIQUE INDEX `nombre`(`nombre`),
    PRIMARY KEY (`id_entidad`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ct_infraestructura_adecuacion_discapacidad` (
    `id_adecuacion` INTEGER NOT NULL AUTO_INCREMENT,
    `descripcion` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id_adecuacion`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ct_infraestructura_almacenamiento_agua` (
    `id_almacenamiento` INTEGER NOT NULL AUTO_INCREMENT,
    `descripcion` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id_almacenamiento`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ct_infraestructura_anexo` (
    `id_anexo` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(255) NOT NULL,
    `estado` BOOLEAN NOT NULL DEFAULT true,
    `fecha_in` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `fecha_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id_anexo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ct_infraestructura_antiguedad_inmueble` (
    `id_antiguedad` INTEGER NOT NULL,
    `descripcion` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`id_antiguedad`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ct_infraestructura_area` (
    `id_area` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(255) NOT NULL,
    `estado` BOOLEAN NOT NULL DEFAULT true,
    `fecha_in` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `fecha_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id_area`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ct_infraestructura_area_de_servicio` (
    `id_servicio` INTEGER NOT NULL AUTO_INCREMENT,
    `descripcion` VARCHAR(100) NULL,

    PRIMARY KEY (`id_servicio`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ct_infraestructura_construccion_inmueble` (
    `id_construccion` INTEGER NOT NULL AUTO_INCREMENT,
    `descripcion` VARCHAR(100) NULL,

    PRIMARY KEY (`id_construccion`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ct_infraestructura_departamento` (
    `id_departamento` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(255) NOT NULL,
    `estado` BOOLEAN NOT NULL DEFAULT true,
    `fecha_in` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `fecha_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id_departamento`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ct_infraestructura_dimension_terreno` (
    `id_dimension` INTEGER NOT NULL AUTO_INCREMENT,
    `descripcion` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id_dimension`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ct_infraestructura_direccion` (
    `id_direccion` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(255) NOT NULL,
    `estado` BOOLEAN NOT NULL DEFAULT true,
    `fecha_in` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `fecha_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id_direccion`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ct_infraestructura_edificio` (
    `id_edificio` INTEGER NOT NULL AUTO_INCREMENT,
    `id_unidad` INTEGER NOT NULL,
    `num_niveles` INTEGER NOT NULL,
    `id_material_paredes` INTEGER NULL,
    `material_paredes_otro` VARCHAR(255) NULL,
    `id_material_techo` INTEGER NULL,
    `material_techo_otro` VARCHAR(255) NULL,
    `id_material_pisos` INTEGER NULL,
    `material_pisos_otro` VARCHAR(255) NULL,

    PRIMARY KEY (`id_edificio`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ct_infraestructura_equipo_discapacidad` (
    `id_equipo` INTEGER NOT NULL AUTO_INCREMENT,
    `descripcion` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id_equipo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ct_infraestructura_espacio_educativo` (
    `id_espacio` INTEGER NOT NULL AUTO_INCREMENT,
    `descripcion` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id_espacio`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ct_infraestructura_espacio_inmueble` (
    `id_espacio` INTEGER NOT NULL AUTO_INCREMENT,
    `descripcion` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id_espacio`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ct_infraestructura_fin_inmueble` (
    `id_fin` INTEGER NOT NULL AUTO_INCREMENT,
    `descripcion` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id_fin`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ct_infraestructura_frecuencia_limpieza` (
    `id_frecuencia` INTEGER NOT NULL AUTO_INCREMENT,
    `descripcion` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id_frecuencia`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ct_infraestructura_jefe_sector` (
    `id_jefe_sector` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre_unidad` VARCHAR(255) NULL,
    `cct` VARCHAR(11) NULL,
    `calle` VARCHAR(255) NULL,
    `numero_exterior` VARCHAR(255) NULL,
    `id_localidad` INTEGER NULL,
    `colonia` VARCHAR(255) NULL,
    `codigo_postal` INTEGER NULL,
    `longitud` FLOAT NULL,
    `latitud` FLOAT NULL,
    `vigente` TINYINT NULL,
    `id_rupet_info` INTEGER NULL,

    PRIMARY KEY (`id_jefe_sector`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ct_infraestructura_material_pared` (
    `id_material_pared` INTEGER NOT NULL AUTO_INCREMENT,
    `descripcion` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id_material_pared`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ct_infraestructura_material_piso` (
    `id_material_piso` INTEGER NOT NULL AUTO_INCREMENT,
    `descripcion` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id_material_piso`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ct_infraestructura_material_techo` (
    `id_material_techo` INTEGER NOT NULL AUTO_INCREMENT,
    `descripcion` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id_material_techo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ct_infraestructura_nivel_educativo` (
    `id_nivel` INTEGER NOT NULL AUTO_INCREMENT,
    `descripcion` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id_nivel`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ct_infraestructura_obra_mantenimiento` (
    `id_obra` INTEGER NOT NULL AUTO_INCREMENT,
    `descripcion` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id_obra`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ct_infraestructura_pauta_de_seguridad` (
    `id_pauta` INTEGER NOT NULL AUTO_INCREMENT,
    `descripcion` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id_pauta`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ct_infraestructura_problema_edificio` (
    `id_problema` INTEGER NOT NULL AUTO_INCREMENT,
    `descripcion` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id_problema`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ct_infraestructura_razon_no_construccion` (
    `id_razon` INTEGER NOT NULL AUTO_INCREMENT,
    `descripcion` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id_razon`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ct_infraestructura_senalamiento_discapacidad` (
    `id_senalamiento` INTEGER NOT NULL AUTO_INCREMENT,
    `descripcion` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id_senalamiento`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ct_infraestructura_sostenimiento` (
    `id_sostenimiento` INTEGER NOT NULL AUTO_INCREMENT,
    `sostenimiento` VARCHAR(20) NOT NULL,

    UNIQUE INDEX `ct_infraestructura_sostenimiento_sostenimiento_key`(`sostenimiento`),
    PRIMARY KEY (`id_sostenimiento`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ct_infraestructura_suministro_agua` (
    `id_suministro_agua` INTEGER NOT NULL AUTO_INCREMENT,
    `descripcion` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id_suministro_agua`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ct_infraestructura_suministro_energia` (
    `id_suministro_energia` INTEGER NOT NULL AUTO_INCREMENT,
    `descripcion` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id_suministro_energia`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ct_infraestructura_suministro_gas` (
    `id_suministro_gas` INTEGER NOT NULL AUTO_INCREMENT,
    `descripcion` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id_suministro_gas`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ct_infraestructura_supervisor` (
    `id_supervisor` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre_unidad` VARCHAR(255) NULL,
    `cct` VARCHAR(11) NULL,
    `calle` VARCHAR(255) NULL,
    `numero_exterior` VARCHAR(255) NULL,
    `id_localidad` INTEGER NULL,
    `colonia` VARCHAR(255) NULL,
    `codigo_postal` INTEGER NULL,
    `longitud` FLOAT NULL,
    `latitud` FLOAT NULL,
    `vigente` TINYINT NULL,
    `id_rupet_info` INTEGER NULL,

    PRIMARY KEY (`id_supervisor`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ct_infraestructura_tipo_construccion` (
    `id_construccion` INTEGER NOT NULL AUTO_INCREMENT,
    `descripcion` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id_construccion`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ct_infraestructura_tipo_descarga` (
    `id_tipo_descarga` INTEGER NOT NULL AUTO_INCREMENT,
    `descripcion` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id_tipo_descarga`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ct_infraestructura_tipo_escuela` (
    `id_tipo_escuela` INTEGER NOT NULL AUTO_INCREMENT,
    `tipo_escuela` VARCHAR(85) NOT NULL,
    `clave` VARCHAR(2) NOT NULL,

    PRIMARY KEY (`id_tipo_escuela`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ct_infraestructura_tipo_instancia` (
    `id_tipo` INTEGER NOT NULL AUTO_INCREMENT,
    `descripcion` VARCHAR(50) NULL,

    PRIMARY KEY (`id_tipo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ct_infraestructura_unidad` (
    `id_unidad` INTEGER NOT NULL AUTO_INCREMENT,
    `id_escuelaPlantel` INTEGER NOT NULL DEFAULT 0,
    `id_tipo_escuela` INTEGER NOT NULL DEFAULT 0,
    `cct` VARCHAR(11) NOT NULL,
    `nombre_unidad` VARCHAR(255) NOT NULL,
    `calle` VARCHAR(255) NULL,
    `numero_exterior` VARCHAR(10) NULL,
    `numero_interior` VARCHAR(10) NULL,
    `id_localidad` INTEGER NULL,
    `colonia` VARCHAR(255) NULL,
    `codigo_postal` INTEGER NULL,
    `longitud` FLOAT NULL,
    `latitud` FLOAT NULL,
    `id_sostenimiento` INTEGER NULL,
    `vigente` TINYINT NULL,
    `id_rupet_info` INTEGER NULL,
    `num_centros_trabajo` INTEGER NULL DEFAULT 0,
    `construido_para_uso_educativo` BOOLEAN NULL DEFAULT false,
    `uso_temporal_educacion_basica` BOOLEAN NULL DEFAULT false,
    `id_razon_no_construccion` INTEGER NULL,
    `razon_no_construccion_otro` VARCHAR(255) NULL,
    `id_antiguedad_inmueble` INTEGER NULL,
    `id_dimension_terreno` INTEGER NULL,
    `num_edificios_educacion_basica` INTEGER NULL DEFAULT 0,
    `porcentaje_ocupacion_edificios` DECIMAL(5, 2) NULL,
    `servicio_agua_regular` BOOLEAN NULL DEFAULT false,
    `agua_potable_frecuente` BOOLEAN NULL DEFAULT false,
    `id_suministro_energia` INTEGER NULL,
    `id_suministro_gas` INTEGER NULL,
    `suministro_gas_otro` VARCHAR(255) NULL,
    `id_tipo_descarga` INTEGER NULL,
    `tipo_descarga_otro` VARCHAR(255) NULL,
    `separacion_aguas` BOOLEAN NULL DEFAULT false,
    `banios_hombres` INTEGER NULL DEFAULT 0,
    `banios_mujeres` INTEGER NULL DEFAULT 0,
    `banios_mixtos` INTEGER NULL DEFAULT 0,
    `tazas_sanitarias_uso` INTEGER NULL DEFAULT 0,
    `tazas_sanitarias_fuera_uso` INTEGER NULL DEFAULT 0,
    `mingitorios_uso` INTEGER NULL DEFAULT 0,
    `mingitorios_fuera_uso` INTEGER NULL DEFAULT 0,
    `letrinas_uso` INTEGER NULL DEFAULT 0,
    `letrinas_fuera_uso` INTEGER NULL DEFAULT 0,
    `tazas_hombres` INTEGER NULL DEFAULT 0,
    `tazas_mujeres` INTEGER NULL DEFAULT 0,
    `tazas_mixtos` INTEGER NULL DEFAULT 0,
    `tazas_alum` INTEGER NULL DEFAULT 0,
    `tazas_docadm` INTEGER NULL DEFAULT 0,
    `tazas_ambos` INTEGER NULL DEFAULT 0,
    `mingitorios_alum` INTEGER NULL DEFAULT 0,
    `mingitorios_docadm` INTEGER NULL DEFAULT 0,
    `mingitorios_ambos` INTEGER NULL DEFAULT 0,
    `letrinas_alum` INTEGER NULL DEFAULT 0,
    `letrinas_docadm` INTEGER NULL DEFAULT 0,
    `letrinas_ambos` INTEGER NULL DEFAULT 0,
    `lavamanos_hombres_uso` INTEGER NULL DEFAULT 0,
    `lavamanos_hombres_fuera_uso` INTEGER NULL DEFAULT 0,
    `lavamanos_mujeres_uso` INTEGER NULL DEFAULT 0,
    `lavamanos_mujeres_fuera_uso` INTEGER NULL DEFAULT 0,
    `lavamanos_mixtos_uso` INTEGER NULL DEFAULT 0,
    `lavamanos_mixtos_fuera_uso` INTEGER NULL DEFAULT 0,
    `bebederos_uso` INTEGER NULL DEFAULT 0,
    `bebederos_fuera_uso` INTEGER NULL DEFAULT 0,
    `area_mantenimiento` BOOLEAN NULL DEFAULT false,
    `rehabilitacion_5_anios` BOOLEAN NULL DEFAULT false,
    `reconversion_5_anios` BOOLEAN NULL DEFAULT false,
    `id_frecuencia_limpieza` INTEGER NULL,
    `programa_proteccion_civil` BOOLEAN NULL DEFAULT false,
    `alarmas_existentes` INTEGER NULL DEFAULT 0,
    `alarmas_uso` INTEGER NULL DEFAULT 0,
    `botiquines_existentes` INTEGER NULL DEFAULT 0,
    `botiquines_uso` INTEGER NULL DEFAULT 0,
    `extintores_existentes` INTEGER NULL DEFAULT 0,
    `extintores_uso` INTEGER NULL DEFAULT 0,
    `senales_emergencia_existentes` INTEGER NULL DEFAULT 0,
    `senales_emergencia_uso` INTEGER NULL DEFAULT 0,
    `salidas_emergencia_existentes` INTEGER NULL DEFAULT 0,
    `salidas_emergencia_uso` INTEGER NULL DEFAULT 0,
    `zonas_seguridad_existentes` INTEGER NULL DEFAULT 0,
    `zonas_seguridad_uso` INTEGER NULL DEFAULT 0,
    `estacionamiento` BOOLEAN NULL DEFAULT false,
    `estacionamiento_estudiantes` INTEGER NULL DEFAULT 0,
    `estacionamiento_docentes` INTEGER NULL DEFAULT 0,
    `estacionamiento_admin` INTEGER NULL DEFAULT 0,
    `estacionamiento_discapacidad` INTEGER NULL DEFAULT 0,
    `estacionamiento_otros` INTEGER NULL DEFAULT 0,
    `infraestructura_discapacidad` BOOLEAN NULL DEFAULT false,
    `aulas_accesibles` BOOLEAN NULL DEFAULT false,
    `biblioteca_accesible` BOOLEAN NULL DEFAULT false,
    `laboratorios_accesibles` BOOLEAN NULL DEFAULT false,
    `talleres_accesibles` BOOLEAN NULL DEFAULT false,
    `cafeteria_accesible` BOOLEAN NULL DEFAULT false,
    `sanitarios_accesibles` BOOLEAN NULL DEFAULT false,
    `bebederos_accesibles` BOOLEAN NULL DEFAULT false,
    `otras_areas_accesibles` BOOLEAN NULL DEFAULT false,
    `otras_areas_accesibles_desc` VARCHAR(255) NULL,
    `banios_discap_hombres_uso` INTEGER NULL DEFAULT 0,
    `banios_discap_mujeres_uso` INTEGER NULL DEFAULT 0,
    `banios_discap_mixtos_uso` INTEGER NULL DEFAULT 0,
    `banios_discap_hombres_fuera_uso` INTEGER NULL DEFAULT 0,
    `banios_discap_mujeres_fuera_uso` INTEGER NULL DEFAULT 0,
    `banios_discap_mixtos_fuera_uso` INTEGER NULL DEFAULT 0,
    `senializacion_discapacidad` BOOLEAN NULL DEFAULT false,
    `rampas` BOOLEAN NULL DEFAULT false,
    `pavimento_tactil` BOOLEAN NULL DEFAULT false,
    `barandales_pasamanos` BOOLEAN NULL DEFAULT false,
    `area_braille` BOOLEAN NULL DEFAULT false,
    `elevadores_plataformas` BOOLEAN NULL DEFAULT false,
    `tira_antiderrapante` BOOLEAN NULL DEFAULT false,
    `aula_especializada_discapacidad` BOOLEAN NULL DEFAULT false,
    `seniales_mundial_ciegos` INTEGER NULL DEFAULT 0,
    `seniales_mundial_sordos` INTEGER NULL DEFAULT 0,
    `seniales_accesibilidad_para_perros_guia` INTEGER NULL DEFAULT 0,
    `seniales_telefono_texto_sordos` INTEGER NULL DEFAULT 0,
    `num_software_discapacidad` INTEGER NULL DEFAULT 0,
    `claves_centros_trabajo` TEXT NULL,

    PRIMARY KEY (`id_unidad`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ct_inventario_alta` (
    `id_alta` INTEGER NOT NULL AUTO_INCREMENT,
    `descripcion` VARCHAR(50) NULL,

    PRIMARY KEY (`id_alta`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ct_inventario_articulo` (
    `id_articulo` INTEGER NOT NULL AUTO_INCREMENT,
    `id_jerarquia` INTEGER NULL,
    `folio` VARCHAR(255) NULL,
    `folio_nuevo` VARCHAR(255) NULL,
    `no_serie` VARCHAR(255) NULL,
    `estatus` TINYINT NULL,
    `observaciones` VARCHAR(255) NULL,
    `modelo` VARCHAR(250) NULL,
    `fecha_alta` DATETIME(0) NULL,
    `fecha_baja` DATETIME(0) NULL,
    `fecha_registro` DATETIME(0) NULL,
    `id_subclase` INTEGER NULL,
    `id_marca` INTEGER NULL,
    `id_material` INTEGER NULL,
    `id_color` INTEGER NULL,
    `id_proveedor` INTEGER NULL,
    `id_accion` INTEGER NULL,
    `id_estado_fisico` INTEGER NULL,
    `id_consecutivo` INTEGER NULL,
    `cct` VARCHAR(255) NULL,

    PRIMARY KEY (`id_articulo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ct_inventario_baja` (
    `id_baja` INTEGER NOT NULL AUTO_INCREMENT,
    `descripcion` VARCHAR(255) NULL,

    PRIMARY KEY (`id_baja`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ct_inventario_clase` (
    `id_clase` INTEGER NOT NULL AUTO_INCREMENT,
    `descripcion` VARCHAR(250) NOT NULL,

    PRIMARY KEY (`id_clase`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ct_inventario_clasificacion` (
    `id_clasificacion` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre_clasificacion` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id_clasificacion`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ct_inventario_color` (
    `id_color` INTEGER NOT NULL AUTO_INCREMENT,
    `descripcion` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `unique_nombre_color`(`descripcion`),
    PRIMARY KEY (`id_color`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ct_inventario_consecutivo` (
    `id_consecutivo` INTEGER NOT NULL AUTO_INCREMENT,
    `id_subclase` INTEGER NOT NULL,
    `no_consecutivo` INTEGER NOT NULL,
    `descripcion` VARCHAR(255) NOT NULL,
    `tipo_bien` VARCHAR(1) NOT NULL DEFAULT '0',

    PRIMARY KEY (`id_consecutivo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ct_inventario_estado_fisico` (
    `id_estado_fisico` INTEGER NOT NULL AUTO_INCREMENT,
    `descripcion` VARCHAR(50) NOT NULL,

    UNIQUE INDEX `unique_descripcion`(`descripcion`),
    PRIMARY KEY (`id_estado_fisico`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ct_inventario_marca` (
    `id_marca` INTEGER NOT NULL AUTO_INCREMENT,
    `descripcion` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `unique_descripcion`(`descripcion`),
    PRIMARY KEY (`id_marca`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ct_inventario_material` (
    `id_material` INTEGER NOT NULL AUTO_INCREMENT,
    `descripcion` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `unique_nombre_material`(`descripcion`),
    PRIMARY KEY (`id_material`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ct_inventario_modelo` (
    `id_modelo` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre_modelo` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id_modelo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ct_inventario_proveedor` (
    `id_proveedor` INTEGER NOT NULL AUTO_INCREMENT,
    `descripcion` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `unique_nombre_proveedor`(`descripcion`),
    PRIMARY KEY (`id_proveedor`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ct_inventario_subclase` (
    `id_subclase` INTEGER NOT NULL AUTO_INCREMENT,
    `id_clase` INTEGER NOT NULL,
    `no_subclase` VARCHAR(4) NOT NULL,
    `descripcion` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id_subclase`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ct_localidad` (
    `id_localidad` INTEGER NOT NULL AUTO_INCREMENT,
    `localidad` VARCHAR(150) NULL,
    `ambito` CHAR(1) NULL DEFAULT 'R',
    `id_municipio` INTEGER NULL,

    PRIMARY KEY (`id_localidad`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ct_municipio` (
    `id_municipio` INTEGER NOT NULL AUTO_INCREMENT,
    `cve_mun` VARCHAR(3) NOT NULL,
    `nombre` VARCHAR(100) NOT NULL,
    `id_entidad` INTEGER NOT NULL,

    PRIMARY KEY (`id_municipio`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ct_usuario` (
    `id_usuario` INTEGER NOT NULL AUTO_INCREMENT,
    `usuario` VARCHAR(100) NOT NULL,
    `contrasena` VARCHAR(255) NOT NULL,
    `estatus` INTEGER NOT NULL DEFAULT 1,
    `fecha_registro` DATETIME(6) NULL DEFAULT CURRENT_TIMESTAMP(6),
    `fecha_modificacion` DATETIME(6) NULL,

    UNIQUE INDEX `IDX_daaab6a989ac4c341e57f18bbe`(`usuario`),
    PRIMARY KEY (`id_usuario`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dt_bitacora` (
    `id_bitacora` INTEGER NOT NULL AUTO_INCREMENT,
    `id_usuario` INTEGER NULL,
    `id_accion` INTEGER NULL,
    `id_registro` INTEGER NULL,
    `tabla` VARCHAR(100) NULL,
    `ip_origen` VARCHAR(255) NULL,
    `dispositivo` VARCHAR(255) NULL,
    `modulo` VARCHAR(255) NULL,
    `descripcion_accion` TEXT NULL,
    `cct` VARCHAR(15) NULL,
    `fecha_in` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id_bitacora`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dt_inventario_bajas` (
    `id_baja` INTEGER NOT NULL AUTO_INCREMENT,
    `id_articulo` INTEGER NOT NULL,
    `tipo_baja` VARCHAR(50) NOT NULL,
    `motivo` TEXT NULL,
    `nombre_archivo_original` VARCHAR(255) NOT NULL,
    `nombre_archivo_sistema` VARCHAR(255) NOT NULL,
    `ruta_archivo` VARCHAR(500) NOT NULL,
    `tamaño_archivo` BIGINT NULL,
    `fecha_baja` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id_baja`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dt_inventario_observaciones` (
    `id_observacion` INTEGER NOT NULL AUTO_INCREMENT,
    `id_unidad` INTEGER NOT NULL,
    `id_usuario` INTEGER NOT NULL,
    `observacion` TEXT NOT NULL,
    `categoria` ENUM('INVENTARIO', 'INFRAESTRUCTURA', 'GENERAL', 'URGENTE') NOT NULL DEFAULT 'GENERAL',
    `prioridad` ENUM('BAJA', 'MEDIA', 'ALTA', 'CRITICA') NOT NULL DEFAULT 'MEDIA',
    `estado` ENUM('ACTIVA', 'EN_REVISION', 'RESUELTA') NOT NULL DEFAULT 'ACTIVA',
    `es_privada` BOOLEAN NOT NULL DEFAULT false,
    `fecha_creacion` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `fecha_actualizacion` TIMESTAMP(0) NULL,
    `fecha_resolucion` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id_observacion`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rl_infraestructura_edificio_problema` (
    `id_edificio` INTEGER NOT NULL,
    `id_problema` INTEGER NOT NULL,
    `descripcion_otro` VARCHAR(255) NULL,

    PRIMARY KEY (`id_edificio`, `id_problema`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rl_infraestructura_jerarquia` (
    `id_jerarquia` INTEGER NOT NULL AUTO_INCREMENT,
    `id_instancia` INTEGER NOT NULL,
    `id_tipo_instancia` INTEGER NOT NULL,
    `id_dependencia` INTEGER NULL,
    `fecha_in` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `usuario_in` INTEGER NULL,

    PRIMARY KEY (`id_jerarquia`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rl_infraestructura_unidad_almacenamiento_agua` (
    `id_unidad` INTEGER NOT NULL,
    `id_almacenamiento` INTEGER NOT NULL,
    `almacenamiento_otro` VARCHAR(255) NULL,

    PRIMARY KEY (`id_unidad`, `id_almacenamiento`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rl_infraestructura_unidad_construccion` (
    `id_unidad` INTEGER NOT NULL,
    `id_construccion` INTEGER NOT NULL,
    `descripcion_otro` VARCHAR(255) NULL,

    PRIMARY KEY (`id_unidad`, `id_construccion`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rl_infraestructura_unidad_construccion_inmueble` (
    `id_unidad` INTEGER NOT NULL,
    `id_construccion` INTEGER NOT NULL,
    `descripcion_otro` VARCHAR(255) NULL,

    PRIMARY KEY (`id_unidad`, `id_construccion`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rl_infraestructura_unidad_equipo_discapacidad` (
    `id_unidad` INTEGER NOT NULL,
    `id_equipo` INTEGER NOT NULL,
    `en_operacion` INTEGER NULL DEFAULT 0,
    `en_reparacion` INTEGER NULL DEFAULT 0,
    `en_reserva` INTEGER NULL DEFAULT 0,
    `total` INTEGER NULL DEFAULT 0,
    `especificacion_otro` VARCHAR(255) NULL,

    PRIMARY KEY (`id_unidad`, `id_equipo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rl_infraestructura_unidad_espacio_inmueble` (
    `id_unidad` INTEGER NOT NULL,
    `id_espacio` INTEGER NOT NULL,
    `descripcion_otro` VARCHAR(255) NULL,

    PRIMARY KEY (`id_unidad`, `id_espacio`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rl_infraestructura_unidad_espacios_educativos` (
    `id_unidad` INTEGER NOT NULL,
    `id_espacio` INTEGER NOT NULL,
    `total` INTEGER NULL DEFAULT 0,
    `en_uso` INTEGER NULL DEFAULT 0,
    `descripcion_otro` VARCHAR(255) NULL,

    PRIMARY KEY (`id_unidad`, `id_espacio`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rl_infraestructura_unidad_fin_inmueble` (
    `id_unidad` INTEGER NOT NULL,
    `id_fin` INTEGER NOT NULL,
    `fin_otro` VARCHAR(255) NULL,

    PRIMARY KEY (`id_unidad`, `id_fin`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rl_infraestructura_unidad_nivel` (
    `id_unidad` INTEGER NOT NULL,
    `id_nivel` INTEGER NOT NULL,

    PRIMARY KEY (`id_unidad`, `id_nivel`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rl_infraestructura_unidad_obra_mantenimiento` (
    `id_unidad` INTEGER NOT NULL,
    `id_obra` INTEGER NOT NULL,
    `descripcion_otro` VARCHAR(255) NULL,

    PRIMARY KEY (`id_unidad`, `id_obra`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rl_infraestructura_unidad_suministro_agua` (
    `id_unidad` INTEGER NOT NULL,
    `id_suministro_agua` INTEGER NOT NULL,
    `suministro_agua_otro` VARCHAR(255) NULL,

    PRIMARY KEY (`id_unidad`, `id_suministro_agua`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ct_codigo_postal` ADD CONSTRAINT `ct_codigo_postal_id_localidad_fkey` FOREIGN KEY (`id_localidad`) REFERENCES `ct_localidad`(`id_localidad`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ct_infraestructura_edificio` ADD CONSTRAINT `ct_infraestructura_edificio_id_unidad_fkey` FOREIGN KEY (`id_unidad`) REFERENCES `ct_infraestructura_unidad`(`id_unidad`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ct_infraestructura_jefe_sector` ADD CONSTRAINT `ct_infraestructura_jefe_sector_id_localidad_fkey` FOREIGN KEY (`id_localidad`) REFERENCES `ct_localidad`(`id_localidad`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ct_infraestructura_supervisor` ADD CONSTRAINT `ct_infraestructura_supervisor_id_localidad_fkey` FOREIGN KEY (`id_localidad`) REFERENCES `ct_localidad`(`id_localidad`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ct_infraestructura_unidad` ADD CONSTRAINT `ct_infraestructura_unidad_id_tipo_escuela_fkey` FOREIGN KEY (`id_tipo_escuela`) REFERENCES `ct_infraestructura_tipo_escuela`(`id_tipo_escuela`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ct_infraestructura_unidad` ADD CONSTRAINT `ct_infraestructura_unidad_id_frecuencia_limpieza_fkey` FOREIGN KEY (`id_frecuencia_limpieza`) REFERENCES `ct_infraestructura_frecuencia_limpieza`(`id_frecuencia`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ct_infraestructura_unidad` ADD CONSTRAINT `ct_infraestructura_unidad_id_localidad_fkey` FOREIGN KEY (`id_localidad`) REFERENCES `ct_localidad`(`id_localidad`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ct_infraestructura_unidad` ADD CONSTRAINT `ct_infraestructura_unidad_id_sostenimiento_fkey` FOREIGN KEY (`id_sostenimiento`) REFERENCES `ct_infraestructura_sostenimiento`(`id_sostenimiento`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ct_infraestructura_unidad` ADD CONSTRAINT `ct_infraestructura_unidad_id_razon_no_construccion_fkey` FOREIGN KEY (`id_razon_no_construccion`) REFERENCES `ct_infraestructura_razon_no_construccion`(`id_razon`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ct_infraestructura_unidad` ADD CONSTRAINT `ct_infraestructura_unidad_id_antiguedad_inmueble_fkey` FOREIGN KEY (`id_antiguedad_inmueble`) REFERENCES `ct_infraestructura_antiguedad_inmueble`(`id_antiguedad`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ct_infraestructura_unidad` ADD CONSTRAINT `ct_infraestructura_unidad_id_dimension_terreno_fkey` FOREIGN KEY (`id_dimension_terreno`) REFERENCES `ct_infraestructura_dimension_terreno`(`id_dimension`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ct_infraestructura_unidad` ADD CONSTRAINT `ct_infraestructura_unidad_id_suministro_energia_fkey` FOREIGN KEY (`id_suministro_energia`) REFERENCES `ct_infraestructura_suministro_energia`(`id_suministro_energia`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ct_infraestructura_unidad` ADD CONSTRAINT `ct_infraestructura_unidad_id_suministro_gas_fkey` FOREIGN KEY (`id_suministro_gas`) REFERENCES `ct_infraestructura_suministro_gas`(`id_suministro_gas`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ct_infraestructura_unidad` ADD CONSTRAINT `ct_infraestructura_unidad_id_tipo_descarga_fkey` FOREIGN KEY (`id_tipo_descarga`) REFERENCES `ct_infraestructura_tipo_descarga`(`id_tipo_descarga`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ct_inventario_articulo` ADD CONSTRAINT `ct_inventario_articulo_id_estado_fisico_fkey` FOREIGN KEY (`id_estado_fisico`) REFERENCES `ct_inventario_estado_fisico`(`id_estado_fisico`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ct_inventario_articulo` ADD CONSTRAINT `ct_inventario_articulo_id_jerarquia_fkey` FOREIGN KEY (`id_jerarquia`) REFERENCES `rl_infraestructura_jerarquia`(`id_jerarquia`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ct_inventario_articulo` ADD CONSTRAINT `ct_inventario_articulo_id_consecutivo_fkey` FOREIGN KEY (`id_consecutivo`) REFERENCES `ct_inventario_consecutivo`(`id_consecutivo`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ct_inventario_articulo` ADD CONSTRAINT `ct_inventario_articulo_id_accion_fkey` FOREIGN KEY (`id_accion`) REFERENCES `ct_accion`(`id_accion`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ct_inventario_articulo` ADD CONSTRAINT `ct_inventario_articulo_id_color_fkey` FOREIGN KEY (`id_color`) REFERENCES `ct_inventario_color`(`id_color`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ct_inventario_articulo` ADD CONSTRAINT `ct_inventario_articulo_id_material_fkey` FOREIGN KEY (`id_material`) REFERENCES `ct_inventario_material`(`id_material`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ct_inventario_articulo` ADD CONSTRAINT `ct_inventario_articulo_id_proveedor_fkey` FOREIGN KEY (`id_proveedor`) REFERENCES `ct_inventario_proveedor`(`id_proveedor`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ct_inventario_articulo` ADD CONSTRAINT `ct_inventario_articulo_id_subclase_fkey` FOREIGN KEY (`id_subclase`) REFERENCES `ct_inventario_subclase`(`id_subclase`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ct_inventario_articulo` ADD CONSTRAINT `ct_inventario_articulo_id_marca_fkey` FOREIGN KEY (`id_marca`) REFERENCES `ct_inventario_marca`(`id_marca`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ct_inventario_subclase` ADD CONSTRAINT `ct_inventario_subclase_id_clase_fkey` FOREIGN KEY (`id_clase`) REFERENCES `ct_inventario_clase`(`id_clase`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ct_localidad` ADD CONSTRAINT `ct_localidad_id_municipio_fkey` FOREIGN KEY (`id_municipio`) REFERENCES `ct_municipio`(`id_municipio`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ct_municipio` ADD CONSTRAINT `ct_municipio_id_entidad_fkey` FOREIGN KEY (`id_entidad`) REFERENCES `ct_entidad`(`id_entidad`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dt_bitacora` ADD CONSTRAINT `dt_bitacora_id_accion_fkey` FOREIGN KEY (`id_accion`) REFERENCES `ct_accion`(`id_accion`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dt_inventario_bajas` ADD CONSTRAINT `dt_inventario_bajas_id_articulo_fkey` FOREIGN KEY (`id_articulo`) REFERENCES `ct_inventario_articulo`(`id_articulo`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rl_infraestructura_edificio_problema` ADD CONSTRAINT `rl_infraestructura_edificio_problema_id_edificio_fkey` FOREIGN KEY (`id_edificio`) REFERENCES `ct_infraestructura_edificio`(`id_edificio`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rl_infraestructura_edificio_problema` ADD CONSTRAINT `rl_infraestructura_edificio_problema_id_problema_fkey` FOREIGN KEY (`id_problema`) REFERENCES `ct_infraestructura_problema_edificio`(`id_problema`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rl_infraestructura_jerarquia` ADD CONSTRAINT `rl_infraestructura_jerarquia_id_tipo_instancia_fkey` FOREIGN KEY (`id_tipo_instancia`) REFERENCES `ct_infraestructura_tipo_instancia`(`id_tipo`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rl_infraestructura_unidad_almacenamiento_agua` ADD CONSTRAINT `rl_infraestructura_unidad_almacenamiento_agua_id_unidad_fkey` FOREIGN KEY (`id_unidad`) REFERENCES `ct_infraestructura_unidad`(`id_unidad`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rl_infraestructura_unidad_almacenamiento_agua` ADD CONSTRAINT `rl_infraestructura_unidad_almacenamiento_agua_id_almacenami_fkey` FOREIGN KEY (`id_almacenamiento`) REFERENCES `ct_infraestructura_almacenamiento_agua`(`id_almacenamiento`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rl_infraestructura_unidad_construccion` ADD CONSTRAINT `rl_infraestructura_unidad_construccion_id_unidad_fkey` FOREIGN KEY (`id_unidad`) REFERENCES `ct_infraestructura_unidad`(`id_unidad`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rl_infraestructura_unidad_construccion` ADD CONSTRAINT `rl_infraestructura_unidad_construccion_id_construccion_fkey` FOREIGN KEY (`id_construccion`) REFERENCES `ct_infraestructura_tipo_construccion`(`id_construccion`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rl_infraestructura_unidad_construccion_inmueble` ADD CONSTRAINT `rl_infraestructura_unidad_construccion_inmueble_id_unidad_fkey` FOREIGN KEY (`id_unidad`) REFERENCES `ct_infraestructura_unidad`(`id_unidad`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rl_infraestructura_unidad_construccion_inmueble` ADD CONSTRAINT `rl_infraestructura_unidad_construccion_inmueble_id_construc_fkey` FOREIGN KEY (`id_construccion`) REFERENCES `ct_infraestructura_construccion_inmueble`(`id_construccion`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rl_infraestructura_unidad_equipo_discapacidad` ADD CONSTRAINT `rl_infraestructura_unidad_equipo_discapacidad_id_unidad_fkey` FOREIGN KEY (`id_unidad`) REFERENCES `ct_infraestructura_unidad`(`id_unidad`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rl_infraestructura_unidad_equipo_discapacidad` ADD CONSTRAINT `rl_infraestructura_unidad_equipo_discapacidad_id_equipo_fkey` FOREIGN KEY (`id_equipo`) REFERENCES `ct_infraestructura_equipo_discapacidad`(`id_equipo`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rl_infraestructura_unidad_espacio_inmueble` ADD CONSTRAINT `rl_infraestructura_unidad_espacio_inmueble_id_unidad_fkey` FOREIGN KEY (`id_unidad`) REFERENCES `ct_infraestructura_unidad`(`id_unidad`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rl_infraestructura_unidad_espacio_inmueble` ADD CONSTRAINT `rl_infraestructura_unidad_espacio_inmueble_id_espacio_fkey` FOREIGN KEY (`id_espacio`) REFERENCES `ct_infraestructura_espacio_inmueble`(`id_espacio`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rl_infraestructura_unidad_espacios_educativos` ADD CONSTRAINT `rl_infraestructura_unidad_espacios_educativos_id_unidad_fkey` FOREIGN KEY (`id_unidad`) REFERENCES `ct_infraestructura_unidad`(`id_unidad`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rl_infraestructura_unidad_espacios_educativos` ADD CONSTRAINT `rl_infraestructura_unidad_espacios_educativos_id_espacio_fkey` FOREIGN KEY (`id_espacio`) REFERENCES `ct_infraestructura_espacio_educativo`(`id_espacio`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rl_infraestructura_unidad_fin_inmueble` ADD CONSTRAINT `rl_infraestructura_unidad_fin_inmueble_id_unidad_fkey` FOREIGN KEY (`id_unidad`) REFERENCES `ct_infraestructura_unidad`(`id_unidad`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rl_infraestructura_unidad_fin_inmueble` ADD CONSTRAINT `rl_infraestructura_unidad_fin_inmueble_id_fin_fkey` FOREIGN KEY (`id_fin`) REFERENCES `ct_infraestructura_fin_inmueble`(`id_fin`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rl_infraestructura_unidad_nivel` ADD CONSTRAINT `rl_infraestructura_unidad_nivel_id_unidad_fkey` FOREIGN KEY (`id_unidad`) REFERENCES `ct_infraestructura_unidad`(`id_unidad`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rl_infraestructura_unidad_nivel` ADD CONSTRAINT `rl_infraestructura_unidad_nivel_id_nivel_fkey` FOREIGN KEY (`id_nivel`) REFERENCES `ct_infraestructura_nivel_educativo`(`id_nivel`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rl_infraestructura_unidad_obra_mantenimiento` ADD CONSTRAINT `rl_infraestructura_unidad_obra_mantenimiento_id_unidad_fkey` FOREIGN KEY (`id_unidad`) REFERENCES `ct_infraestructura_unidad`(`id_unidad`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rl_infraestructura_unidad_obra_mantenimiento` ADD CONSTRAINT `rl_infraestructura_unidad_obra_mantenimiento_id_obra_fkey` FOREIGN KEY (`id_obra`) REFERENCES `ct_infraestructura_obra_mantenimiento`(`id_obra`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rl_infraestructura_unidad_suministro_agua` ADD CONSTRAINT `rl_infraestructura_unidad_suministro_agua_id_unidad_fkey` FOREIGN KEY (`id_unidad`) REFERENCES `ct_infraestructura_unidad`(`id_unidad`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rl_infraestructura_unidad_suministro_agua` ADD CONSTRAINT `rl_infraestructura_unidad_suministro_agua_id_suministro_agu_fkey` FOREIGN KEY (`id_suministro_agua`) REFERENCES `ct_infraestructura_suministro_agua`(`id_suministro_agua`) ON DELETE RESTRICT ON UPDATE CASCADE;
