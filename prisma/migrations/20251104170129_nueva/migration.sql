-- CreateTable
CREATE TABLE `ct_bitacora_accion` (
    `id_ct_bitacora_accion` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(50) NULL,
    `descripcion` VARCHAR(255) NULL,
    `estado` BOOLEAN NULL DEFAULT true,
    `fecha_in` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `fecha_up` DATETIME(0) NULL,
    `id_ct_usuario_in` INTEGER NOT NULL,
    `id_ct_usuario_up` INTEGER NULL,

    INDEX `estado`(`estado`),
    INDEX `id_ct_usuario_in`(`id_ct_usuario_in`),
    INDEX `id_ct_usuario_up`(`id_ct_usuario_up`),
    PRIMARY KEY (`id_ct_bitacora_accion`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ct_bitacora_tabla` (
    `id_ct_bitacora_tabla` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(100) NULL,
    `descripcion` VARCHAR(255) NULL,
    `estado` BOOLEAN NULL DEFAULT true,
    `auditar` BOOLEAN NULL DEFAULT true,
    `fecha_in` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `fecha_up` DATETIME(0) NULL,
    `id_ct_usuario_in` INTEGER NOT NULL,
    `id_ct_usuario_up` INTEGER NULL,

    INDEX `auditar`(`auditar`),
    INDEX `estado`(`estado`),
    INDEX `id_ct_usuario_in`(`id_ct_usuario_in`),
    INDEX `id_ct_usuario_up`(`id_ct_usuario_up`),
    PRIMARY KEY (`id_ct_bitacora_tabla`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ct_entidad` (
    `id_ct_entidad` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(100) NOT NULL,
    `abreviatura` VARCHAR(10) NOT NULL,
    `estado` BOOLEAN NULL DEFAULT true,
    `fecha_in` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `fecha_up` DATETIME(0) NULL,
    `id_ct_usuario_in` INTEGER NOT NULL,
    `id_ct_usuario_up` INTEGER NULL,

    UNIQUE INDEX `nombre`(`nombre`),
    INDEX `estado`(`estado`),
    INDEX `id_ct_usuario_in`(`id_ct_usuario_in`),
    INDEX `id_ct_usuario_up`(`id_ct_usuario_up`),
    PRIMARY KEY (`id_ct_entidad`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ct_folios_control` (
    `id_ct_folios_control` INTEGER NOT NULL AUTO_INCREMENT,
    `sistema` VARCHAR(10) NOT NULL,
    `anio` INTEGER NOT NULL,
    `ultimo_folio` INTEGER NOT NULL DEFAULT 0,
    `estado` BOOLEAN NULL DEFAULT true,
    `fecha_in` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `fecha_up` DATETIME(0) NULL,
    `id_ct_usuario_in` INTEGER NOT NULL,
    `id_ct_usuario_up` INTEGER NULL,

    INDEX `estado`(`estado`),
    INDEX `id_ct_usuario_in`(`id_ct_usuario_in`),
    INDEX `id_ct_usuario_up`(`id_ct_usuario_up`),
    INDEX `idx_sistema_anio`(`sistema`, `anio`),
    UNIQUE INDEX `sistema_anio`(`sistema`, `anio`),
    PRIMARY KEY (`id_ct_folios_control`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ct_infraestructura_anexo` (
    `id_ct_infraestructura_anexo` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(255) NOT NULL,
    `cct` VARCHAR(11) NOT NULL,
    `id_dt_infraestructura_ubicacion` INTEGER NOT NULL,
    `estado` BOOLEAN NULL DEFAULT true,
    `fecha_in` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `fecha_up` DATETIME(0) NULL,
    `id_ct_usuario_in` INTEGER NOT NULL,
    `id_ct_usuario_up` INTEGER NULL,

    UNIQUE INDEX `nombre`(`nombre`),
    INDEX `FK_ct_infraestructura_anexo_dt_infraestructura_ubicacion`(`id_dt_infraestructura_ubicacion`),
    INDEX `estado`(`estado`),
    INDEX `id_ct_usuario_in`(`id_ct_usuario_in`),
    INDEX `id_ct_usuario_up`(`id_ct_usuario_up`),
    PRIMARY KEY (`id_ct_infraestructura_anexo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ct_infraestructura_area` (
    `id_ct_infraestructura_area` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(255) NOT NULL,
    `cct` VARCHAR(11) NOT NULL,
    `id_dt_infraestructura_ubicacion` INTEGER NOT NULL,
    `estado` BOOLEAN NULL DEFAULT true,
    `fecha_in` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `fecha_up` DATETIME(0) NULL,
    `id_ct_usuario_in` INTEGER NOT NULL,
    `id_ct_usuario_up` INTEGER NULL,

    UNIQUE INDEX `nombre`(`nombre`),
    INDEX `FK_ct_infraestructura_area_dt_infraestructura_ubicacion`(`id_dt_infraestructura_ubicacion`),
    INDEX `estado`(`estado`),
    INDEX `id_ct_usuario_at`(`id_ct_usuario_up`),
    INDEX `id_ct_usuario_in`(`id_ct_usuario_in`),
    PRIMARY KEY (`id_ct_infraestructura_area`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ct_infraestructura_departamento` (
    `id_ct_infraestructura_departamento` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(255) NOT NULL,
    `cct` VARCHAR(11) NOT NULL,
    `id_dt_infraestructura_ubicacion` INTEGER NOT NULL,
    `estado` BOOLEAN NULL DEFAULT true,
    `fecha_in` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `fecha_up` DATETIME(0) NULL,
    `id_ct_usuario_in` INTEGER NOT NULL,
    `id_ct_usuario_up` INTEGER NULL,

    UNIQUE INDEX `nombre`(`nombre`),
    INDEX `FK_ct_infraestructura_departamento_dt_infraestructura_ubicacion`(`id_dt_infraestructura_ubicacion`),
    INDEX `estado`(`estado`),
    INDEX `id_ct_usuario_in`(`id_ct_usuario_in`),
    INDEX `id_ct_usuario_up`(`id_ct_usuario_up`),
    PRIMARY KEY (`id_ct_infraestructura_departamento`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ct_infraestructura_direccion` (
    `id_ct_infraestructura_direccion` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(255) NOT NULL,
    `cct` VARCHAR(11) NOT NULL,
    `id_dt_infraestructura_ubicacion` INTEGER NOT NULL,
    `estado` BOOLEAN NULL DEFAULT true,
    `fecha_in` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `fecha_up` DATETIME(0) NULL,
    `id_ct_usuario_in` INTEGER NOT NULL,
    `id_ct_usuario_up` INTEGER NULL,

    UNIQUE INDEX `nombre`(`nombre`),
    INDEX `FK_ct_infraestructura_direccion_dt_infraestructura_ubicacion`(`id_dt_infraestructura_ubicacion`),
    INDEX `estado`(`estado`),
    INDEX `id_ct_usuario_at`(`id_ct_usuario_up`),
    INDEX `id_ct_usuario_in`(`id_ct_usuario_in`),
    PRIMARY KEY (`id_ct_infraestructura_direccion`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ct_infraestructura_escuela` (
    `id_ct_infraestructura_escuela` INTEGER NOT NULL AUTO_INCREMENT,
    `id_escuela_plantel` INTEGER NOT NULL DEFAULT 0,
    `id_ct_tipo_escuela` INTEGER NOT NULL DEFAULT 0,
    `cct` VARCHAR(11) NOT NULL,
    `nombre` VARCHAR(255) NOT NULL,
    `id_ct_sostenimiento` INTEGER NOT NULL DEFAULT 0,
    `id_dt_infraestructura_ubicacion` INTEGER NOT NULL DEFAULT 0,
    `estado` BOOLEAN NULL DEFAULT true,
    `fecha_in` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `fecha_up` DATETIME(0) NULL,
    `id_ct_usuario_in` INTEGER NOT NULL,
    `id_ct_usuario_up` INTEGER NULL,

    UNIQUE INDEX `cct`(`cct`),
    INDEX `estado`(`estado`),
    INDEX `id_ct_sostenimiento`(`id_ct_sostenimiento`),
    INDEX `id_ct_tipo_escuela`(`id_ct_tipo_escuela`),
    INDEX `id_ct_usuario_in`(`id_ct_usuario_in`),
    INDEX `id_ct_usuario_up`(`id_ct_usuario_up`),
    INDEX `id_dt_infraestructura_ubicacion`(`id_dt_infraestructura_ubicacion`),
    PRIMARY KEY (`id_ct_infraestructura_escuela`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ct_infraestructura_jefe_sector` (
    `id_ct_infraestructura_jefe_sector` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(255) NOT NULL,
    `cct` VARCHAR(11) NOT NULL,
    `id_dt_infraestructura_ubicacion` INTEGER NOT NULL DEFAULT 0,
    `estado` BOOLEAN NULL DEFAULT true,
    `fecha_in` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `fecha_up` DATETIME(0) NULL,
    `id_ct_usuario_in` INTEGER NOT NULL,
    `id_ct_usuario_up` INTEGER NULL,

    UNIQUE INDEX `nombre`(`nombre`),
    INDEX `estado`(`estado`),
    INDEX `id_ct_usuario_in`(`id_ct_usuario_in`),
    INDEX `id_ct_usuario_up`(`id_ct_usuario_up`),
    INDEX `id_dt_infraestructura_ubicacion`(`id_dt_infraestructura_ubicacion`),
    PRIMARY KEY (`id_ct_infraestructura_jefe_sector`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ct_infraestructura_sostenimiento` (
    `id_ct_infraestructura_sostenimiento` INTEGER NOT NULL AUTO_INCREMENT,
    `sostenimiento` VARCHAR(50) NOT NULL DEFAULT '',
    `estado` BOOLEAN NOT NULL DEFAULT true,
    `fecha_in` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `fecha_up` DATETIME(0) NULL,
    `id_ct_usuario_in` INTEGER NOT NULL,
    `id_ct_usuario_up` INTEGER NULL,

    UNIQUE INDEX `sostenimiento`(`sostenimiento`),
    INDEX `estado`(`estado`),
    INDEX `id_ct_usuario_in`(`id_ct_usuario_in`),
    INDEX `id_ct_usuario_up`(`id_ct_usuario_up`),
    PRIMARY KEY (`id_ct_infraestructura_sostenimiento`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ct_infraestructura_supervisor` (
    `id_ct_infraestructura_supervisor` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(255) NOT NULL,
    `cct` VARCHAR(11) NOT NULL,
    `id_dt_infraestructura_ubicacion` INTEGER NOT NULL,
    `estado` BOOLEAN NULL DEFAULT true,
    `fecha_in` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `fecha_up` DATETIME(0) NULL,
    `id_ct_usuario_in` INTEGER NOT NULL,
    `id_ct_usuario_up` INTEGER NULL,

    UNIQUE INDEX `nombre`(`nombre`),
    INDEX `estado`(`estado`),
    INDEX `id_ct_usuario_in`(`id_ct_usuario_in`),
    INDEX `id_ct_usuario_up`(`id_ct_usuario_up`),
    INDEX `id_dt_infraestructura_ubicacion`(`id_dt_infraestructura_ubicacion`),
    PRIMARY KEY (`id_ct_infraestructura_supervisor`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ct_infraestructura_tipo_escuela` (
    `id_ct_infraestructura_tipo_escuela` INTEGER NOT NULL AUTO_INCREMENT,
    `tipo_escuela` VARCHAR(85) NOT NULL,
    `clave` VARCHAR(2) NOT NULL,
    `estado` BOOLEAN NULL DEFAULT true,
    `fecha_in` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `fecha_up` DATETIME(0) NULL,
    `id_ct_usuario_in` INTEGER NOT NULL,
    `id_ct_usuario_up` INTEGER NULL,

    INDEX `estado`(`estado`),
    INDEX `id_ct_usuario_in`(`id_ct_usuario_in`),
    INDEX `id_ct_usuario_up`(`id_ct_usuario_up`),
    PRIMARY KEY (`id_ct_infraestructura_tipo_escuela`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ct_infraestructura_tipo_instancia` (
    `id_ct_infraestructura_tipo_instancia` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(50) NOT NULL DEFAULT '0',
    `estado` BOOLEAN NULL DEFAULT true,
    `fecha_in` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `fecha_up` DATETIME(0) NULL,
    `id_ct_usuario_in` INTEGER NOT NULL,
    `id_ct_usuario_up` INTEGER NULL,

    UNIQUE INDEX `nombre`(`nombre`),
    INDEX `estado`(`estado`),
    INDEX `id_ct_usuario_in`(`id_ct_usuario_in`),
    INDEX `id_ct_usuario_up`(`id_ct_usuario_up`),
    PRIMARY KEY (`id_ct_infraestructura_tipo_instancia`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ct_inventario_alta` (
    `id_ct_inventario_alta` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(50) NOT NULL,
    `estado` BOOLEAN NULL DEFAULT true,
    `fecha_in` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `fecha_up` DATETIME(0) NULL,
    `id_ct_usuario_in` INTEGER NOT NULL,
    `id_ct_usuario_up` INTEGER NULL,

    UNIQUE INDEX `nombre`(`nombre`),
    INDEX `estado`(`estado`),
    INDEX `id_ct_usuario_in`(`id_ct_usuario_in`),
    INDEX `id_ct_usuario_up`(`id_ct_usuario_up`),
    PRIMARY KEY (`id_ct_inventario_alta`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ct_inventario_baja` (
    `id_ct_inventario_baja` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(50) NOT NULL,
    `estado` BOOLEAN NULL DEFAULT true,
    `fecha_in` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `fecha_up` DATETIME(0) NULL,
    `id_ct_usuario_in` INTEGER NOT NULL,
    `id_ct_usuario_up` INTEGER NULL,

    UNIQUE INDEX `nombre`(`nombre`),
    INDEX `estado`(`estado`),
    INDEX `id_ct_usuario_in`(`id_ct_usuario_in`),
    INDEX `id_ct_usuario_up`(`id_ct_usuario_up`),
    PRIMARY KEY (`id_ct_inventario_baja`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ct_inventario_clase` (
    `id_ct_inventario_clase` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(50) NOT NULL,
    `estado` BOOLEAN NULL DEFAULT true,
    `fecha_in` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `fecha_up` DATETIME(0) NULL,
    `id_ct_usuario_in` INTEGER NOT NULL,
    `id_ct_usuario_up` INTEGER NULL,

    UNIQUE INDEX `nombre`(`nombre`),
    INDEX `estado`(`estado`),
    INDEX `id_ct_usuario_in`(`id_ct_usuario_in`),
    INDEX `id_ct_usuario_up`(`id_ct_usuario_up`),
    PRIMARY KEY (`id_ct_inventario_clase`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ct_inventario_color` (
    `id_ct_inventario_color` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(50) NOT NULL,
    `estado` BOOLEAN NULL DEFAULT true,
    `fecha_in` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `fecha_up` DATETIME(0) NULL,
    `id_ct_usuario_in` INTEGER NOT NULL,
    `id_ct_usuario_up` INTEGER NULL,

    UNIQUE INDEX `nombre`(`nombre`),
    INDEX `estado`(`estado`),
    INDEX `id_ct_usuario_in`(`id_ct_usuario_in`),
    INDEX `id_ct_usuario_up`(`id_ct_usuario_up`),
    PRIMARY KEY (`id_ct_inventario_color`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ct_inventario_estado_fisico` (
    `id_ct_inventario_estado_fisico` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(50) NOT NULL,
    `estado` BOOLEAN NULL DEFAULT true,
    `fecha_in` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `fecha_up` DATETIME(0) NULL,
    `id_ct_usuario_in` INTEGER NOT NULL,
    `id_ct_usuario_up` INTEGER NULL,

    UNIQUE INDEX `nombre`(`nombre`),
    INDEX `estado`(`estado`),
    INDEX `id_ct_usuario_in`(`id_ct_usuario_in`),
    INDEX `id_ct_usuario_up`(`id_ct_usuario_up`),
    PRIMARY KEY (`id_ct_inventario_estado_fisico`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ct_inventario_marca` (
    `id_ct_inventario_marca` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(50) NOT NULL,
    `estado` BOOLEAN NULL DEFAULT true,
    `fecha_in` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `fecha_up` DATETIME(0) NULL,
    `id_ct_usuario_in` INTEGER NOT NULL,
    `id_ct_usuario_up` INTEGER NULL,

    UNIQUE INDEX `nombre`(`nombre`),
    INDEX `estado`(`estado`),
    INDEX `id_ct_usuario_in`(`id_ct_usuario_in`),
    INDEX `id_ct_usuario_up`(`id_ct_usuario_up`),
    PRIMARY KEY (`id_ct_inventario_marca`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ct_inventario_material` (
    `id_ct_inventario_material` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(50) NOT NULL,
    `estado` BOOLEAN NULL DEFAULT true,
    `fecha_in` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `fecha_up` DATETIME(0) NULL,
    `id_ct_usuario_in` INTEGER NOT NULL,
    `id_ct_usuario_up` INTEGER NULL,

    UNIQUE INDEX `nombre`(`nombre`),
    INDEX `estado`(`estado`),
    INDEX `id_ct_usuario_in`(`id_ct_usuario_in`),
    INDEX `id_ct_usuario_up`(`id_ct_usuario_up`),
    PRIMARY KEY (`id_ct_inventario_material`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ct_inventario_proveedor` (
    `id_ct_inventario_proveedor` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(50) NOT NULL,
    `estado` BOOLEAN NULL DEFAULT true,
    `fecha_in` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `fecha_up` DATETIME(0) NULL,
    `id_ct_usuario_in` INTEGER NOT NULL,
    `id_ct_usuario_up` INTEGER NULL,

    UNIQUE INDEX `nombre`(`nombre`),
    INDEX `estado`(`estado`),
    INDEX `id_ct_usuario_in`(`id_ct_usuario_in`),
    INDEX `id_ct_usuario_up`(`id_ct_usuario_up`),
    PRIMARY KEY (`id_ct_inventario_proveedor`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ct_inventario_subclase` (
    `id_ct_inventario_subclase` INTEGER NOT NULL AUTO_INCREMENT,
    `id_ct_inventario_clase` INTEGER NOT NULL,
    `no_subclase` INTEGER NOT NULL,
    `nombre` VARCHAR(100) NOT NULL,
    `estado` BOOLEAN NULL DEFAULT true,
    `fecha_in` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `fecha_up` DATETIME(0) NULL,
    `id_ct_usuario_in` INTEGER NOT NULL,
    `id_ct_usuario_up` INTEGER NULL,

    INDEX `FK_ct_inventario_subclase_ct_inventario_clase`(`id_ct_inventario_clase`),
    INDEX `estado`(`estado`),
    INDEX `id_ct_usuario_in`(`id_ct_usuario_in`),
    INDEX `id_ct_usuario_up`(`id_ct_usuario_up`),
    UNIQUE INDEX `ct_inventario_subclase_nombre_no_subclase_key`(`nombre`, `no_subclase`),
    PRIMARY KEY (`id_ct_inventario_subclase`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ct_inventario_tipo_articulo` (
    `id_ct_inventario_tipo_articulo` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(50) NOT NULL,
    `estado` BOOLEAN NULL DEFAULT true,
    `fecha_in` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `fecha_up` DATETIME(0) NULL,
    `id_ct_usuario_in` INTEGER NOT NULL,
    `id_ct_usuario_up` INTEGER NULL,

    UNIQUE INDEX `nombre`(`nombre`),
    INDEX `estado`(`estado`),
    INDEX `id_ct_usuario_in`(`id_ct_usuario_in`),
    INDEX `id_ct_usuario_up`(`id_ct_usuario_up`),
    PRIMARY KEY (`id_ct_inventario_tipo_articulo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ct_localidad` (
    `id_ct_localidad` INTEGER NOT NULL AUTO_INCREMENT,
    `codigo_postal` INTEGER NOT NULL DEFAULT 0,
    `nombre` VARCHAR(150) NOT NULL,
    `ambito` VARCHAR(50) NOT NULL DEFAULT '',
    `id_ct_municipio` INTEGER NOT NULL,
    `estado` BOOLEAN NULL DEFAULT true,
    `fecha_in` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `fecha_up` DATETIME(0) NULL,
    `id_ct_usuario_in` INTEGER NOT NULL,
    `id_ct_usuario_up` INTEGER NULL,

    INDEX `ct_localidad_id_ct_municipio_fkey`(`id_ct_municipio`),
    INDEX `estado`(`estado`),
    INDEX `id_ct_usuario_in`(`id_ct_usuario_in`),
    INDEX `id_ct_usuario_up`(`id_ct_usuario_up`),
    PRIMARY KEY (`id_ct_localidad`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ct_municipio` (
    `id_ct_municipio` INTEGER NOT NULL AUTO_INCREMENT,
    `cve_mun` VARCHAR(3) NOT NULL,
    `nombre` VARCHAR(100) NOT NULL,
    `id_ct_entidad` INTEGER NOT NULL,
    `estado` BOOLEAN NULL DEFAULT true,
    `fecha_in` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `fecha_up` DATETIME(0) NULL,
    `id_ct_usuario_in` INTEGER NOT NULL,
    `id_ct_usuario_up` INTEGER NULL,

    INDEX `ct_municipio_id_ct_entidad_fkey`(`id_ct_entidad`),
    INDEX `estado`(`estado`),
    INDEX `id_ct_usuario_in`(`id_ct_usuario_in`),
    INDEX `id_ct_usuario_up`(`id_ct_usuario_up`),
    PRIMARY KEY (`id_ct_municipio`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ct_rate_limit` (
    `id_ct_rate_limit` VARCHAR(36) NOT NULL,
    `identificador` VARCHAR(255) NOT NULL,
    `endpoint` VARCHAR(100) NOT NULL,
    `intentos` INTEGER NOT NULL DEFAULT 1,
    `ventana_inicio` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `bloqueado_hasta` DATETIME(6) NULL,

    INDEX `ct_rate_limit_bloqueado_hasta_idx`(`bloqueado_hasta`),
    INDEX `ct_rate_limit_identificador_endpoint_idx`(`identificador`, `endpoint`),
    INDEX `ct_rate_limit_ventana_inicio_idx`(`ventana_inicio`),
    PRIMARY KEY (`id_ct_rate_limit`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ct_rol` (
    `id_ct_rol` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(50) NOT NULL DEFAULT '',
    `descripcion` VARCHAR(255) NOT NULL DEFAULT '',
    `estado` BOOLEAN NULL DEFAULT true,
    `fecha_in` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `fecha_up` DATETIME(0) NULL,
    `id_ct_usuario_in` INTEGER NOT NULL,
    `id_ct_usuario_up` INTEGER NULL,

    INDEX `estado`(`estado`),
    PRIMARY KEY (`id_ct_rol`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ct_sesion` (
    `id_ct_sesion` INTEGER NOT NULL AUTO_INCREMENT,
    `id_ct_usuario` INTEGER NOT NULL,
    `jti` VARCHAR(36) NOT NULL,
    `ip_origen` VARCHAR(45) NULL,
    `user_agent` VARCHAR(500) NULL,
    `dispositivo` VARCHAR(100) NULL,
    `ubicacion` VARCHAR(100) NULL,
    `fecha_creacion` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `fecha_expiracion` DATETIME(6) NOT NULL,
    `fecha_ultimo_uso` DATETIME(6) NULL,
    `activa` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `ct_sesion_jti_key`(`jti`),
    INDEX `ct_sesion_activa_idx`(`activa`),
    INDEX `ct_sesion_fecha_expiracion_idx`(`fecha_expiracion`),
    INDEX `ct_sesion_id_ct_usuario_idx`(`id_ct_usuario`),
    INDEX `ct_sesion_jti_idx`(`jti`),
    PRIMARY KEY (`id_ct_sesion`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ct_usuario` (
    `id_ct_usuario` INTEGER NOT NULL AUTO_INCREMENT,
    `usuario` VARCHAR(100) NOT NULL,
    `contrasena` VARCHAR(255) NOT NULL,
    `estado` BOOLEAN NOT NULL DEFAULT true,
    `fecha_registro` DATETIME(6) NULL DEFAULT CURRENT_TIMESTAMP(6),
    `fecha_modificacion` DATETIME(6) NULL,
    `uuid_usuario` VARCHAR(36) NOT NULL,
    `email` VARCHAR(255) NULL,
    `primer_login` BOOLEAN NULL DEFAULT false,
    `ultimo_login` DATETIME(6) NULL,
    `intentos_fallidos` INTEGER NOT NULL DEFAULT 0,
    `bloqueado_hasta` DATETIME(6) NULL,

    UNIQUE INDEX `IDX_daaab6a989ac4c341e57f18bbe`(`usuario`),
    UNIQUE INDEX `ct_usuario_uuid_usuario_key`(`uuid_usuario`),
    UNIQUE INDEX `ct_usuario_email_key`(`email`),
    PRIMARY KEY (`id_ct_usuario`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dt_bitacora` (
    `id_dt_bitacora` INTEGER NOT NULL AUTO_INCREMENT,
    `id_ct_bitacora_accion` INTEGER NOT NULL,
    `id_ct_bitacora_tabla` INTEGER NOT NULL,
    `id_registro_afectado` INTEGER NOT NULL,
    `id_ct_sesion` INTEGER NOT NULL,
    `datos_anteriores` LONGTEXT NOT NULL,
    `datos_nuevos` LONGTEXT NOT NULL,
    `estado` BOOLEAN NULL DEFAULT true,
    `fecha_in` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `fecha_up` DATETIME(0) NULL,
    `id_ct_usuario_in` INTEGER NOT NULL,
    `id_ct_usuario_up` INTEGER NULL,

    INDEX `FK_dt_bitacora_ct_bitacora_tabla`(`id_ct_bitacora_tabla`),
    INDEX `FK_dt_bitacora_ct_sesion`(`id_ct_sesion`),
    INDEX `id_ct_bitacora_accion`(`id_ct_bitacora_accion`),
    INDEX `id_ct_usuario_in`(`id_ct_usuario_in`),
    INDEX `id_ct_usuario_up`(`id_ct_usuario_up`),
    INDEX `id_registro_afectado`(`id_registro_afectado`),
    PRIMARY KEY (`id_dt_bitacora`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dt_infraestructura_ubicacion` (
    `id_dt_infraestructura_ubicacion` INTEGER NOT NULL AUTO_INCREMENT,
    `calle` VARCHAR(255) NOT NULL,
    `cct` VARCHAR(11) NOT NULL,
    `numero_exterior` INTEGER NULL,
    `numero_interior` INTEGER NULL,
    `id_ct_localidad` INTEGER NOT NULL,
    `latitud` FLOAT NULL,
    `longitud` FLOAT NULL,
    `estado` BOOLEAN NULL DEFAULT true,
    `fecha_in` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `fecha_up` DATETIME(0) NULL,
    `id_ct_usuario_in` INTEGER NOT NULL,
    `id_ct_usuario_up` INTEGER NULL,

    INDEX `estado`(`estado`),
    INDEX `id_ct_localidad`(`id_ct_localidad`),
    INDEX `id_ct_usuario_in`(`id_ct_usuario_in`),
    INDEX `id_ct_usuario_up`(`id_ct_usuario_up`),
    PRIMARY KEY (`id_dt_infraestructura_ubicacion`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dt_inventario_alta` (
    `id_dt_inventario_alta` INTEGER NOT NULL AUTO_INCREMENT,
    `id_ct_inventario_alta` INTEGER NOT NULL,
    `observaciones` LONGTEXT NULL,
    `estado` BOOLEAN NULL DEFAULT true,
    `fecha_in` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `fecha_up` DATETIME(0) NULL,
    `id_ct_usuario_in` INTEGER NOT NULL,
    `id_ct_usuario_up` INTEGER NULL,

    INDEX `estado`(`estado`),
    INDEX `id_ct_inventario_alta`(`id_ct_inventario_alta`),
    INDEX `id_ct_usuario_in`(`id_ct_usuario_in`),
    INDEX `id_ct_usuario_up`(`id_ct_usuario_up`),
    PRIMARY KEY (`id_dt_inventario_alta`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dt_inventario_alta_archivo` (
    `id_dt_inventario_alta_archivo` INTEGER NOT NULL AUTO_INCREMENT,
    `id_dt_inventario_alta` INTEGER NOT NULL,
    `nombre_archivo` VARCHAR(255) NOT NULL,
    `nombre_sistema` VARCHAR(255) NOT NULL,
    `ruta_archivo` VARCHAR(500) NOT NULL,
    `estado` BOOLEAN NULL DEFAULT true,
    `fecha_in` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `fecha_up` DATETIME(0) NULL,
    `id_ct_usuario_in` INTEGER NOT NULL,
    `id_ct_usuario_up` INTEGER NULL,

    INDEX `FK__dt_inventario_alta`(`id_dt_inventario_alta`),
    INDEX `estado`(`estado`),
    INDEX `id_ct_usuario_in`(`id_ct_usuario_in`),
    INDEX `id_ct_usuario_up`(`id_ct_usuario_up`),
    PRIMARY KEY (`id_dt_inventario_alta_archivo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dt_inventario_articulo` (
    `id_dt_inventario_articulo` INTEGER NOT NULL AUTO_INCREMENT,
    `id_rl_infraestructura_jerarquia` INTEGER NULL,
    `folio_antiguo` VARCHAR(50) NULL,
    `folio` VARCHAR(50) NOT NULL DEFAULT '',
    `no_serie` VARCHAR(50) NOT NULL,
    `observaciones` VARCHAR(250) NULL,
    `modelo` VARCHAR(50) NOT NULL,
    `fecha_registro` DATETIME(0) NOT NULL,
    `id_ct_inventario_material` INTEGER NOT NULL,
    `id_ct_inventario_marca` INTEGER NOT NULL,
    `id_ct_inventario_color` INTEGER NOT NULL,
    `id_ct_inventario_proveedor` INTEGER NOT NULL,
    `id_ct_inventario_estado_fisico` INTEGER NOT NULL,
    `id_ct_inventario_tipo_articulo` INTEGER NOT NULL,
    `cct` VARCHAR(11) NULL,
    `estado` BOOLEAN NULL DEFAULT true,
    `fecha_in` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `fecha_up` DATETIME(0) NULL,
    `id_ct_usuario_in` INTEGER NOT NULL,
    `id_ct_usuario_up` INTEGER NULL,

    UNIQUE INDEX `folio`(`folio`),
    INDEX `FK_dt_inventario_articulo_ct_inventario_color`(`id_ct_inventario_color`),
    INDEX `FK_dt_inventario_articulo_ct_inventario_estado_fisico`(`id_ct_inventario_estado_fisico`),
    INDEX `FK_dt_inventario_articulo_ct_inventario_marca`(`id_ct_inventario_marca`),
    INDEX `FK_dt_inventario_articulo_ct_inventario_material`(`id_ct_inventario_material`),
    INDEX `FK_dt_inventario_articulo_ct_inventario_proveedor`(`id_ct_inventario_proveedor`),
    INDEX `FK_dt_inventario_articulo_ct_inventario_tipo_articulo`(`id_ct_inventario_tipo_articulo`),
    INDEX `FK_dt_inventario_articulo_rl_infraestructura_jerarquia`(`id_rl_infraestructura_jerarquia`),
    INDEX `estado`(`estado`),
    INDEX `id_ct_usuario_in`(`id_ct_usuario_in`),
    INDEX `id_ct_usuario_up`(`id_ct_usuario_up`),
    PRIMARY KEY (`id_dt_inventario_articulo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dt_inventario_baja` (
    `id_dt_inventario_baja` INTEGER NOT NULL AUTO_INCREMENT,
    `id_ct_inventario_baja` INTEGER NOT NULL,
    `observaciones` LONGTEXT NULL,
    `estado` BOOLEAN NULL DEFAULT true,
    `fecha_in` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `fecha_up` DATETIME(0) NULL,
    `id_ct_usuario_in` INTEGER NOT NULL,
    `id_ct_usuario_up` INTEGER NULL,

    INDEX `FK_dt_inventario_baja_ct_inventario_baja`(`id_ct_inventario_baja`),
    INDEX `estado`(`estado`),
    INDEX `id_ct_usuario_in`(`id_ct_usuario_in`),
    INDEX `id_ct_usuario_up`(`id_ct_usuario_up`),
    PRIMARY KEY (`id_dt_inventario_baja`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dt_inventario_baja_archivo` (
    `id_dt_inventario_baja_archivo` INTEGER NOT NULL AUTO_INCREMENT,
    `id_dt_inventario_baja` INTEGER NOT NULL,
    `nombre_archivo` VARCHAR(255) NOT NULL,
    `nombre_sistema` VARCHAR(255) NOT NULL,
    `ruta_archivo` VARCHAR(500) NOT NULL,
    `estado` BOOLEAN NULL DEFAULT true,
    `fecha_in` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `fecha_up` DATETIME(0) NULL,
    `id_ct_usuario_in` INTEGER NOT NULL,
    `id_ct_usuario_up` INTEGER NULL,

    INDEX `estado`(`estado`),
    INDEX `id_ct_usuario_in`(`id_ct_usuario_in`),
    INDEX `id_ct_usuario_up`(`id_ct_usuario_up`),
    INDEX `id_dt_inventario_alta`(`id_dt_inventario_baja`),
    PRIMARY KEY (`id_dt_inventario_baja_archivo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `escuelaPlantelEstadistica` (
    `id_escuelaPlantel` INTEGER NOT NULL AUTO_INCREMENT,
    `id_area` INTEGER NOT NULL,
    `id_escuelaTipoEscuela` INTEGER NOT NULL,
    `nombre` VARCHAR(150) NOT NULL,
    `cct` VARCHAR(11) NOT NULL,
    `id_localidad` INTEGER NULL,
    `domicilio` VARCHAR(150) NOT NULL,
    `referencia` MEDIUMTEXT NULL,
    `cp` VARCHAR(10) NULL,
    `tel` VARCHAR(20) NULL,
    `telOtro` VARCHAR(20) NULL,
    `fax` VARCHAR(20) NULL,
    `email` VARCHAR(100) NULL,
    `totalDeAulas` INTEGER NULL DEFAULT 0,
    `aulasEnUso` INTEGER NULL DEFAULT 0,
    `aulasAdaptadas` TINYINT NULL,
    `respLegalOProp` VARCHAR(120) NULL,
    `tipoRepLegalOProp` CHAR(1) NULL,
    `pagWeb` VARCHAR(150) NULL,
    `noDeAcuerdo` VARCHAR(30) NULL,
    `id_escuelaSostenimiento` INTEGER NOT NULL,
    `id_escuelaSupervisor` INTEGER NULL,
    `id_escuelaStatus` INTEGER NOT NULL,
    `regCalifExtra` CHAR(1) NULL DEFAULT 'N',
    `id_escuelaTipoEstrucOcupacional` INTEGER UNSIGNED NOT NULL,
    `cctComparteEdificio` VARCHAR(10) NULL,
    `tienePlano` CHAR(1) NULL DEFAULT 'N',
    `anioPlano` DATE NULL DEFAULT ('1970-01-01'),
    `apoyo` VARCHAR(45) NULL,
    `etapaRegistroPlaneacion` TINYINT NULL,
    `solicitudModDatos` TINYINT NULL DEFAULT 0,
    `fechaReg` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `id_acceso` INTEGER NOT NULL,
    `claveInmueble` VARCHAR(50) NULL,
    `id_escuelaTurno_uno` INTEGER NULL,
    `id_escuelaTurno_dos` INTEGER NULL,
    `vialidad_principal` VARCHAR(150) NULL,
    `vialidad_derecha` VARCHAR(150) NULL,
    `vialidad_izquierda` VARCHAR(150) NULL,
    `vialidad_posterior` VARCHAR(150) NULL,
    `clave_entidad` INTEGER NULL,
    `entidad` VARCHAR(150) NULL,
    `clave_municipio` INTEGER NULL,
    `municipio` VARCHAR(150) NULL,
    `clave_localidad` INTEGER NULL,
    `localidad` VARCHAR(150) NULL,
    `clave_colonia` INTEGER NULL,
    `coloniaNombre` VARCHAR(150) NULL,
    `numExterior` VARCHAR(50) NULL,
    `latitud` VARCHAR(50) NULL,
    `longitud` VARCHAR(50) NULL,
    `director` VARCHAR(150) NULL,
    `clave_supervisor` VARCHAR(50) NULL,
    `clave_jefe_sector` VARCHAR(50) NULL,
    `clave_servicio_regional` VARCHAR(50) NULL,
    `dep_operativa_uno` VARCHAR(255) NULL,
    `dep_operativa_dos` VARCHAR(255) NULL,
    `dep_operativa_tres` VARCHAR(255) NULL,
    `dep_operativa_cuarto` VARCHAR(255) NULL,
    `control` VARCHAR(50) NULL,
    `subcontrol` VARCHAR(50) NULL,
    `sostenimiento_dependencia_uno` VARCHAR(255) NULL,
    `sostenimiento_dependencia_dos` VARCHAR(255) NULL,
    `sostenimiento_dependencia_tres` VARCHAR(255) NULL,
    `sostenimiento_dependencia_cuarto` VARCHAR(255) NULL,
    `fecha_fundacion` DATE NULL,
    `institucion_plantel` VARCHAR(50) NULL,
    `modalidad` VARCHAR(50) NULL,
    `caracteristica_uno` VARCHAR(50) NULL,
    `caracteristica_dos` VARCHAR(50) NULL,

    UNIQUE INDEX `cct_UNIQUE`(`cct`),
    INDEX `fk_escuelaPlantel_acceso2`(`id_acceso`),
    INDEX `fk_escuelaPlantel_escuelaSostenimiento2`(`id_escuelaSostenimiento`),
    INDEX `fk_escuelaPlantel_escuelaStatus2`(`id_escuelaStatus`),
    INDEX `fk_escuelaPlantel_escuelaSupervisor2`(`id_escuelaSupervisor`),
    INDEX `fk_escuelaPlantel_escuelaTipoEscuela2`(`id_escuelaTipoEscuela`),
    INDEX `fk_escuelaPlantel_localidad2`(`id_localidad`),
    INDEX `fk_escuela_area2`(`id_area`),
    INDEX `id_escuelaTipoEstrucOcupacional2`(`id_escuelaTipoEstrucOcupacional`),
    INDEX `id_escuelaTurno_dos`(`id_escuelaTurno_dos`),
    INDEX `id_escuelaTurno_uno`(`id_escuelaTurno_uno`),
    PRIMARY KEY (`id_escuelaPlantel`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rl_infraestructura_jerarquia` (
    `id_rl_infraestructura_jerarquia` INTEGER NOT NULL AUTO_INCREMENT,
    `id_instancia` INTEGER NOT NULL,
    `id_ct_infraestructura_tipo_instancia` INTEGER NOT NULL,
    `id_dependencia` INTEGER NOT NULL,
    `estado` BOOLEAN NULL DEFAULT true,
    `fecha_in` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `fecha_up` DATETIME(0) NULL,
    `id_ct_usuario_in` INTEGER NOT NULL,
    `id_ct_usuario_up` INTEGER NULL,

    INDEX `estado`(`estado`),
    INDEX `id_ct_usuario_in`(`id_ct_usuario_in`),
    INDEX `id_ct_usuario_up`(`id_ct_usuario_up`),
    INDEX `id_dependencia`(`id_dependencia`),
    INDEX `id_instancia`(`id_instancia`),
    INDEX `id_tipo_instancia`(`id_ct_infraestructura_tipo_instancia`),
    PRIMARY KEY (`id_rl_infraestructura_jerarquia`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rl_inventario_alta_articulo` (
    `id_rl_inventario_alta_articulo` INTEGER NOT NULL AUTO_INCREMENT,
    `id_dt_inventario_alta` INTEGER NOT NULL,
    `id_dt_inventario_articulo` INTEGER NOT NULL,
    `estado` BOOLEAN NULL DEFAULT true,
    `fecha_in` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `fecha_up` DATETIME(0) NULL,
    `id_ct_usuario_in` INTEGER NOT NULL,
    `id_ct_usuario_up` INTEGER NULL,

    INDEX `estado`(`estado`),
    INDEX `id_ct_usuario_in`(`id_ct_usuario_in`),
    INDEX `id_ct_usuario_up`(`id_ct_usuario_up`),
    INDEX `id_dt_inventario_alta`(`id_dt_inventario_alta`),
    INDEX `id_dt_inventario_articulo`(`id_dt_inventario_articulo`),
    PRIMARY KEY (`id_rl_inventario_alta_articulo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rl_inventario_baja_articulo` (
    `id_rl_inventario_baja_articulo` INTEGER NOT NULL AUTO_INCREMENT,
    `id_dt_inventario_baja` INTEGER NOT NULL,
    `id_dt_inventario_articulo` INTEGER NOT NULL,
    `estado` BOOLEAN NULL DEFAULT true,
    `fecha_in` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `fecha_up` DATETIME(0) NULL,
    `id_ct_usuario_in` INTEGER NOT NULL,
    `id_ct_usuario_up` INTEGER NULL,

    INDEX `FK_rl_inventario_baja_articulo_dt_inventario_articulo`(`id_dt_inventario_articulo`),
    INDEX `FK_rl_inventario_baja_articulo_dt_inventario_baja`(`id_dt_inventario_baja`),
    INDEX `estado`(`estado`),
    INDEX `id_ct_usuario_in`(`id_ct_usuario_in`),
    INDEX `id_ct_usuario_up`(`id_ct_usuario_up`),
    PRIMARY KEY (`id_rl_inventario_baja_articulo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rl_usuario_rol_jerarquia` (
    `id_rl_usuario_rol_jerarquia` INTEGER NOT NULL AUTO_INCREMENT,
    `id_ct_usuario` INTEGER NOT NULL,
    `id_externo` INTEGER NOT NULL,
    `id_ct_rol` INTEGER NOT NULL,
    `id_rl_infraestructura_jerarquia` INTEGER NULL,
    `estado` BOOLEAN NULL DEFAULT true,
    `fecha_in` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `fecha_up` DATETIME(0) NULL,
    `id_ct_usuario_in` INTEGER NOT NULL,
    `id_ct_usuario_up` INTEGER NULL,

    INDEX `FK__ct_rol`(`id_ct_rol`),
    INDEX `FK__rl_infraestructura_jerarquia`(`id_rl_infraestructura_jerarquia`),
    INDEX `estado`(`estado`),
    INDEX `id_ct_usuario`(`id_ct_usuario`),
    PRIMARY KEY (`id_rl_usuario_rol_jerarquia`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ct_infraestructura_anexo` ADD CONSTRAINT `FK_ct_infraestructura_anexo_dt_infraestructura_ubicacion` FOREIGN KEY (`id_dt_infraestructura_ubicacion`) REFERENCES `dt_infraestructura_ubicacion`(`id_dt_infraestructura_ubicacion`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `ct_infraestructura_area` ADD CONSTRAINT `FK_ct_infraestructura_area_dt_infraestructura_ubicacion` FOREIGN KEY (`id_dt_infraestructura_ubicacion`) REFERENCES `dt_infraestructura_ubicacion`(`id_dt_infraestructura_ubicacion`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `ct_infraestructura_departamento` ADD CONSTRAINT `FK_ct_infraestructura_departamento_dt_infraestructura_ubicacion` FOREIGN KEY (`id_dt_infraestructura_ubicacion`) REFERENCES `dt_infraestructura_ubicacion`(`id_dt_infraestructura_ubicacion`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `ct_infraestructura_direccion` ADD CONSTRAINT `FK_ct_infraestructura_direccion_dt_infraestructura_ubicacion` FOREIGN KEY (`id_dt_infraestructura_ubicacion`) REFERENCES `dt_infraestructura_ubicacion`(`id_dt_infraestructura_ubicacion`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `ct_infraestructura_escuela` ADD CONSTRAINT `FK_ct_infraestructura_unidad_ct_infraestructura_sostenimiento` FOREIGN KEY (`id_ct_sostenimiento`) REFERENCES `ct_infraestructura_sostenimiento`(`id_ct_infraestructura_sostenimiento`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `ct_infraestructura_escuela` ADD CONSTRAINT `FK_ct_infraestructura_unidad_ct_infraestructura_tipo_escuela` FOREIGN KEY (`id_ct_tipo_escuela`) REFERENCES `ct_infraestructura_tipo_escuela`(`id_ct_infraestructura_tipo_escuela`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `ct_infraestructura_escuela` ADD CONSTRAINT `FK_ct_infraestructura_unidad_dt_infraestructura_ubicacion` FOREIGN KEY (`id_dt_infraestructura_ubicacion`) REFERENCES `dt_infraestructura_ubicacion`(`id_dt_infraestructura_ubicacion`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `ct_infraestructura_jefe_sector` ADD CONSTRAINT `FK_ct_infraestructura_jefe_sector_dt_infraestructura_ubicacion` FOREIGN KEY (`id_dt_infraestructura_ubicacion`) REFERENCES `dt_infraestructura_ubicacion`(`id_dt_infraestructura_ubicacion`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `ct_infraestructura_supervisor` ADD CONSTRAINT `FK_ct_infraestructura_supervisor_dt_infraestructura_ubicacion` FOREIGN KEY (`id_dt_infraestructura_ubicacion`) REFERENCES `dt_infraestructura_ubicacion`(`id_dt_infraestructura_ubicacion`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `ct_inventario_subclase` ADD CONSTRAINT `FK_ct_inventario_subclase_ct_inventario_clase` FOREIGN KEY (`id_ct_inventario_clase`) REFERENCES `ct_inventario_clase`(`id_ct_inventario_clase`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `ct_localidad` ADD CONSTRAINT `FK_ct_localidad_ct_municipio` FOREIGN KEY (`id_ct_municipio`) REFERENCES `ct_municipio`(`id_ct_municipio`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `ct_municipio` ADD CONSTRAINT `FK_ct_municipio_ct_entidad` FOREIGN KEY (`id_ct_entidad`) REFERENCES `ct_entidad`(`id_ct_entidad`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `ct_sesion` ADD CONSTRAINT `ct_sesion_id_ct_usuario_fkey` FOREIGN KEY (`id_ct_usuario`) REFERENCES `ct_usuario`(`id_ct_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dt_bitacora` ADD CONSTRAINT `FK_dt_bitacora_ct_bitacora_accion` FOREIGN KEY (`id_ct_bitacora_accion`) REFERENCES `ct_bitacora_accion`(`id_ct_bitacora_accion`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `dt_bitacora` ADD CONSTRAINT `FK_dt_bitacora_ct_bitacora_tabla` FOREIGN KEY (`id_ct_bitacora_tabla`) REFERENCES `ct_bitacora_tabla`(`id_ct_bitacora_tabla`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `dt_infraestructura_ubicacion` ADD CONSTRAINT `FK_dt_infraestructura_ubicacion_ct_localidad` FOREIGN KEY (`id_ct_localidad`) REFERENCES `ct_localidad`(`id_ct_localidad`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `dt_inventario_alta` ADD CONSTRAINT `FK_dt_inventario_alta_ct_inventario_alta` FOREIGN KEY (`id_ct_inventario_alta`) REFERENCES `ct_inventario_alta`(`id_ct_inventario_alta`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `dt_inventario_alta_archivo` ADD CONSTRAINT `FK__dt_inventario_alta` FOREIGN KEY (`id_dt_inventario_alta`) REFERENCES `dt_inventario_alta`(`id_dt_inventario_alta`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `dt_inventario_articulo` ADD CONSTRAINT `FK_dt_inventario_articulo_ct_inventario_color` FOREIGN KEY (`id_ct_inventario_color`) REFERENCES `ct_inventario_color`(`id_ct_inventario_color`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `dt_inventario_articulo` ADD CONSTRAINT `FK_dt_inventario_articulo_ct_inventario_estado_fisico` FOREIGN KEY (`id_ct_inventario_estado_fisico`) REFERENCES `ct_inventario_estado_fisico`(`id_ct_inventario_estado_fisico`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `dt_inventario_articulo` ADD CONSTRAINT `FK_dt_inventario_articulo_ct_inventario_marca` FOREIGN KEY (`id_ct_inventario_marca`) REFERENCES `ct_inventario_marca`(`id_ct_inventario_marca`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `dt_inventario_articulo` ADD CONSTRAINT `FK_dt_inventario_articulo_ct_inventario_material` FOREIGN KEY (`id_ct_inventario_material`) REFERENCES `ct_inventario_material`(`id_ct_inventario_material`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `dt_inventario_articulo` ADD CONSTRAINT `FK_dt_inventario_articulo_ct_inventario_proveedor` FOREIGN KEY (`id_ct_inventario_proveedor`) REFERENCES `ct_inventario_proveedor`(`id_ct_inventario_proveedor`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `dt_inventario_articulo` ADD CONSTRAINT `FK_dt_inventario_articulo_ct_inventario_tipo_articulo` FOREIGN KEY (`id_ct_inventario_tipo_articulo`) REFERENCES `ct_inventario_tipo_articulo`(`id_ct_inventario_tipo_articulo`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `dt_inventario_articulo` ADD CONSTRAINT `FK_dt_inventario_articulo_rl_infraestructura_jerarquia` FOREIGN KEY (`id_rl_infraestructura_jerarquia`) REFERENCES `rl_infraestructura_jerarquia`(`id_rl_infraestructura_jerarquia`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `dt_inventario_baja` ADD CONSTRAINT `FK_dt_inventario_baja_ct_inventario_baja` FOREIGN KEY (`id_ct_inventario_baja`) REFERENCES `ct_inventario_baja`(`id_ct_inventario_baja`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `dt_inventario_baja_archivo` ADD CONSTRAINT `FK_dt_inventario_baja_archivo_dt_inventario_baja` FOREIGN KEY (`id_dt_inventario_baja`) REFERENCES `dt_inventario_baja`(`id_dt_inventario_baja`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `rl_infraestructura_jerarquia` ADD CONSTRAINT `FK_rl_infraestructura_jerarquia_ct_infraestructura_tipo` FOREIGN KEY (`id_ct_infraestructura_tipo_instancia`) REFERENCES `ct_infraestructura_tipo_instancia`(`id_ct_infraestructura_tipo_instancia`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `rl_inventario_alta_articulo` ADD CONSTRAINT `FK_rl_inventario_alta_articulo_dt_inventario_alta` FOREIGN KEY (`id_dt_inventario_alta`) REFERENCES `dt_inventario_alta`(`id_dt_inventario_alta`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `rl_inventario_alta_articulo` ADD CONSTRAINT `FK_rl_inventario_alta_articulo_dt_inventario_articulo` FOREIGN KEY (`id_dt_inventario_articulo`) REFERENCES `dt_inventario_articulo`(`id_dt_inventario_articulo`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `rl_inventario_baja_articulo` ADD CONSTRAINT `FK_rl_inventario_baja_articulo_dt_inventario_articulo` FOREIGN KEY (`id_dt_inventario_articulo`) REFERENCES `dt_inventario_articulo`(`id_dt_inventario_articulo`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `rl_inventario_baja_articulo` ADD CONSTRAINT `FK_rl_inventario_baja_articulo_dt_inventario_baja` FOREIGN KEY (`id_dt_inventario_baja`) REFERENCES `dt_inventario_baja`(`id_dt_inventario_baja`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `rl_usuario_rol_jerarquia` ADD CONSTRAINT `FK__ct_rol` FOREIGN KEY (`id_ct_rol`) REFERENCES `ct_rol`(`id_ct_rol`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `rl_usuario_rol_jerarquia` ADD CONSTRAINT `FK__ct_usuario` FOREIGN KEY (`id_ct_usuario`) REFERENCES `ct_usuario`(`id_ct_usuario`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `rl_usuario_rol_jerarquia` ADD CONSTRAINT `FK__rl_infraestructura_jerarquia` FOREIGN KEY (`id_rl_infraestructura_jerarquia`) REFERENCES `rl_infraestructura_jerarquia`(`id_rl_infraestructura_jerarquia`) ON DELETE NO ACTION ON UPDATE NO ACTION;
