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
    `id_ct_usuario_at` INTEGER NULL,

    UNIQUE INDEX `nombre`(`nombre`),
    INDEX `FK_ct_infraestructura_area_dt_infraestructura_ubicacion`(`id_dt_infraestructura_ubicacion`),
    INDEX `estado`(`estado`),
    INDEX `id_ct_usuario_at`(`id_ct_usuario_at`),
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
    `id_ct_usuario_at` INTEGER NULL,

    UNIQUE INDEX `nombre`(`nombre`),
    INDEX `FK_ct_infraestructura_direccion_dt_infraestructura_ubicacion`(`id_dt_infraestructura_ubicacion`),
    INDEX `estado`(`estado`),
    INDEX `id_ct_usuario_at`(`id_ct_usuario_at`),
    INDEX `id_ct_usuario_in`(`id_ct_usuario_in`),
    PRIMARY KEY (`id_ct_infraestructura_direccion`)
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
    `tipo_escuela` INTEGER NOT NULL,
    `clave` INTEGER NOT NULL,
    `estado` BOOLEAN NULL DEFAULT true,
    `fecha_in` DATETIME(0) NOT NULL,
    `fecha_up` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
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
CREATE TABLE `ct_infraestructura_unidad` (
    `id_ct_infraestructura_unidad` INTEGER NOT NULL AUTO_INCREMENT,
    `id_escuela_Plantel` INTEGER NOT NULL DEFAULT 0,
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
    PRIMARY KEY (`id_ct_infraestructura_unidad`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ct_localidad` (
    `id_ct_localidad` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(150) NOT NULL,
    `ambito` CHAR(1) NOT NULL,
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
CREATE TABLE `ct_refresh_token` (
    `id_ct_refresh_token` VARCHAR(36) NOT NULL,
    `id_ct_usuario` INTEGER NOT NULL,
    `token_hash` VARCHAR(255) NOT NULL,
    `id_ct_sesion` VARCHAR(36) NULL,
    `fecha_creacion` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `fecha_expiracion` DATETIME(6) NOT NULL,
    `fecha_uso` DATETIME(6) NULL,
    `usado` BOOLEAN NOT NULL DEFAULT false,
    `revocado` BOOLEAN NOT NULL DEFAULT false,
    `motivo_revocacion` VARCHAR(100) NULL,

    UNIQUE INDEX `ct_refresh_token_token_hash_key`(`token_hash`),
    INDEX `ct_refresh_token_fecha_expiracion_idx`(`fecha_expiracion`),
    INDEX `ct_refresh_token_id_ct_usuario_idx`(`id_ct_usuario`),
    INDEX `ct_refresh_token_revocado_idx`(`revocado`),
    INDEX `ct_refresh_token_token_hash_idx`(`token_hash`),
    INDEX `ct_refresh_token_usado_idx`(`usado`),
    PRIMARY KEY (`id_ct_refresh_token`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ct_sesion` (
    `id_ct_sesion` VARCHAR(36) NOT NULL,
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
    `ultimo_login` DATETIME(6) NULL,
    `intentos_fallidos` INTEGER NOT NULL DEFAULT 0,
    `bloqueado_hasta` DATETIME(6) NULL,

    UNIQUE INDEX `IDX_daaab6a989ac4c341e57f18bbe`(`usuario`),
    UNIQUE INDEX `ct_usuario_uuid_usuario_key`(`uuid_usuario`),
    UNIQUE INDEX `ct_usuario_email_key`(`email`),
    PRIMARY KEY (`id_ct_usuario`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dt_infraestructura_ubicacion` (
    `id_dt_infraestructura_ubicacion` INTEGER NOT NULL AUTO_INCREMENT,
    `calle` VARCHAR(255) NOT NULL,
    `numero_exterior` INTEGER NULL,
    `numero_interior` INTEGER NULL,
    `id_ct_localidad` INTEGER NOT NULL,
    `colonia` VARCHAR(255) NOT NULL,
    `id_ct_codigo_postal` INTEGER NOT NULL,
    `latitud` FLOAT NULL,
    `longitud` FLOAT NULL,
    `estado` BOOLEAN NULL DEFAULT true,
    `fecha_in` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `fecha_up` DATETIME(0) NULL,
    `id_ct_usuario_in` INTEGER NOT NULL,
    `id_ct_usuario_up` INTEGER NULL,

    INDEX `estado`(`estado`),
    INDEX `id_ct_codigo_postal`(`id_ct_codigo_postal`),
    INDEX `id_ct_localidad`(`id_ct_localidad`),
    INDEX `id_ct_usuario_in`(`id_ct_usuario_in`),
    INDEX `id_ct_usuario_up`(`id_ct_usuario_up`),
    PRIMARY KEY (`id_dt_infraestructura_ubicacion`)
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

-- AddForeignKey
ALTER TABLE `ct_infraestructura_anexo` ADD CONSTRAINT `FK_ct_infraestructura_anexo_dt_infraestructura_ubicacion` FOREIGN KEY (`id_dt_infraestructura_ubicacion`) REFERENCES `dt_infraestructura_ubicacion`(`id_dt_infraestructura_ubicacion`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `ct_infraestructura_area` ADD CONSTRAINT `FK_ct_infraestructura_area_dt_infraestructura_ubicacion` FOREIGN KEY (`id_dt_infraestructura_ubicacion`) REFERENCES `dt_infraestructura_ubicacion`(`id_dt_infraestructura_ubicacion`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `ct_infraestructura_departamento` ADD CONSTRAINT `FK_ct_infraestructura_departamento_dt_infraestructura_ubicacion` FOREIGN KEY (`id_dt_infraestructura_ubicacion`) REFERENCES `dt_infraestructura_ubicacion`(`id_dt_infraestructura_ubicacion`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `ct_infraestructura_direccion` ADD CONSTRAINT `FK_ct_infraestructura_direccion_dt_infraestructura_ubicacion` FOREIGN KEY (`id_dt_infraestructura_ubicacion`) REFERENCES `dt_infraestructura_ubicacion`(`id_dt_infraestructura_ubicacion`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `ct_infraestructura_jefe_sector` ADD CONSTRAINT `FK_ct_infraestructura_jefe_sector_dt_infraestructura_ubicacion` FOREIGN KEY (`id_dt_infraestructura_ubicacion`) REFERENCES `dt_infraestructura_ubicacion`(`id_dt_infraestructura_ubicacion`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `ct_infraestructura_supervisor` ADD CONSTRAINT `FK_ct_infraestructura_supervisor_dt_infraestructura_ubicacion` FOREIGN KEY (`id_dt_infraestructura_ubicacion`) REFERENCES `dt_infraestructura_ubicacion`(`id_dt_infraestructura_ubicacion`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `ct_infraestructura_unidad` ADD CONSTRAINT `FK_ct_infraestructura_unidad_ct_infraestructura_sostenimiento` FOREIGN KEY (`id_ct_sostenimiento`) REFERENCES `ct_infraestructura_sostenimiento`(`id_ct_infraestructura_sostenimiento`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `ct_infraestructura_unidad` ADD CONSTRAINT `FK_ct_infraestructura_unidad_ct_infraestructura_tipo_escuela` FOREIGN KEY (`id_ct_tipo_escuela`) REFERENCES `ct_infraestructura_tipo_escuela`(`id_ct_infraestructura_tipo_escuela`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `ct_infraestructura_unidad` ADD CONSTRAINT `FK_ct_infraestructura_unidad_dt_infraestructura_ubicacion` FOREIGN KEY (`id_dt_infraestructura_ubicacion`) REFERENCES `dt_infraestructura_ubicacion`(`id_dt_infraestructura_ubicacion`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `ct_localidad` ADD CONSTRAINT `FK_ct_localidad_ct_municipio` FOREIGN KEY (`id_ct_municipio`) REFERENCES `ct_municipio`(`id_ct_municipio`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `ct_municipio` ADD CONSTRAINT `FK_ct_municipio_ct_entidad` FOREIGN KEY (`id_ct_entidad`) REFERENCES `ct_entidad`(`id_ct_entidad`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `ct_refresh_token` ADD CONSTRAINT `ct_refresh_token_id_ct_usuario_fkey` FOREIGN KEY (`id_ct_usuario`) REFERENCES `ct_usuario`(`id_ct_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ct_sesion` ADD CONSTRAINT `ct_sesion_id_ct_usuario_fkey` FOREIGN KEY (`id_ct_usuario`) REFERENCES `ct_usuario`(`id_ct_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rl_infraestructura_jerarquia` ADD CONSTRAINT `FK_rl_infraestructura_jerarquia_ct_infraestructura_tipo` FOREIGN KEY (`id_ct_infraestructura_tipo_instancia`) REFERENCES `ct_infraestructura_tipo_instancia`(`id_ct_infraestructura_tipo_instancia`) ON DELETE NO ACTION ON UPDATE NO ACTION;
