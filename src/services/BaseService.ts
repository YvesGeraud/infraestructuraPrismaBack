/**
 * @fileoverview BaseService - Template base para servicios Prisma
 * Proporciona operaciones CRUD comunes con puntos de personalización
 */

import { prisma } from "../config/database";
import { PaginatedResponse } from "../types";
import { PaginationInput } from "../schemas/commonSchemas";

/**
 * Configuración base para un servicio
 */
export interface BaseServiceConfig {
  tableName: string;
  defaultOrderBy: Record<string, "asc" | "desc">;
  relations?: Record<string, any>;
  campoActivo?: string; // Campo que indica si el registro está activo (por defecto 'activo')
}

/**
 * BaseService genérico para operaciones CRUD
 */
export abstract class BaseService<T, CreateInput, UpdateInput, FilterInput> {
  protected abstract config: BaseServiceConfig;

  /**
   * 📝 SISTEMA DE BITÁCORA (Automático)
   *
   * Para activar en un servicio, solo necesitas 2 líneas:
   * ```typescript
   * protected registrarEnBitacora = true;
   * protected nombreTablaParaBitacora = "LOCALIDAD"; // Nombre para dt_bitacora
   * ```
   *
   * BaseService se encarga automáticamente de:
   * - Capturar datos antes/después del cambio
   * - Registrar en dt_bitacora dentro de la misma transacción
   * - Hacer rollback si falla la bitácora
   */
  protected registrarEnBitacora: boolean = false;
  protected nombreTablaParaBitacora: string = "";

  /**
   * 🎯 Campos a excluir del registro en bitácora (para no registrar datos sensibles)
   * Override en servicios específicos si necesitas excluir más campos
   *
   * Por defecto excluye: contraseñas, tokens, archivos grandes
   */
  protected camposExcluidosBitacora: string[] = [
    "password",
    "contrasena",
    "token",
    "refresh_token",
    "archivo",
    "imagen",
    "pdf",
  ];

  /**
   * Método abstracto para configurar includes específicos del modelo
   */
  protected abstract configurarIncludes(filters?: FilterInput): any;

  /**
   * Método abstracto para construir WHERE clause específico del modelo
   */
  protected abstract construirWhereClause(filters?: FilterInput): any;

  /**
   * Obtener modelo Prisma dinámicamente
   */
  protected get model() {
    return (prisma as any)[this.config.tableName];
  }

  /**
   * 🔧 Obtener modelo desde transacción o desde prisma global
   * Útil para operaciones que pueden ejecutarse dentro o fuera de transacciones
   */
  protected obtenerModelo(tx?: any) {
    return tx ? (tx as any)[this.config.tableName] : this.model;
  }

  /**
   * 🔍 Obtener todos los registros con filtros y paginación
   */
  async obtenerTodos(
    filters: FilterInput = {} as FilterInput,
    pagination: PaginationInput = {}
  ): Promise<PaginatedResponse<T>> {
    try {
      // 🌐 Soporte para español (principal) e inglés (compatibilidad)
      const pagina = pagination.pagina || 1;
      const limite = pagination.limite || 10;
      const skip = (pagina - 1) * limite;

      // Construir clauses específicos del modelo
      const baseWhere = this.construirWhereClause(filters);

      // 🔍 FILTRO AUTOMÁTICO: Solo mostrar registros activos por defecto
      // A menos que se especifique explícitamente incluir inactivos
      const campoActivo = this.config.campoActivo || "activo";
      const where = {
        ...baseWhere,
        // Solo agregar filtro de activo si no se especifica en los filtros
        ...(!(filters as any)?.incluirInactivos && { [campoActivo]: true }),
      };

      const include = this.configurarIncludes(filters);

      const [records, total] = await Promise.all([
        this.model.findMany({
          where,
          skip,
          take: limite,
          include,
          orderBy: this.config.defaultOrderBy,
        }),
        this.model.count({ where }),
      ]);

      const totalPaginas = Math.ceil(total / limite);

      return {
        data: records,
        pagination: {
          pagina,
          limite,
          total,
          totalPaginas,
          tieneSiguiente: pagina < totalPaginas,
          tieneAnterior: pagina > 1,
        },
      };
    } catch (error) {
      console.error(`Error al obtener ${this.config.tableName}:`, error);
      throw new Error(`Error al obtener registros de ${this.config.tableName}`);
    }
  }

  /**
   * 🔍 Obtener un registro por ID
   */
  async obtenerPorId(id: number, filters?: FilterInput): Promise<T | null> {
    try {
      const include = this.configurarIncludes(filters);

      const campoActivo = this.config.campoActivo || "activo";
      const record = await this.model.findUnique({
        where: {
          [this.getPrimaryKeyField()]: id,
          // 🔍 FILTRO AUTOMÁTICO: Solo buscar registros activos por defecto
          ...(!(filters as any)?.incluirInactivos && { [campoActivo]: true }),
        },
        include,
      });

      return record;
    } catch (error) {
      console.error(`Error al obtener ${this.config.tableName} por ID:`, error);
      throw new Error(`Error al obtener registro de ${this.config.tableName}`);
    }
  }

  /**
   * 📊 Obtener TODOS los registros sin paginación
   * Útil para reportes, exportaciones, etc.
   * ⚠️ PRECAUCIÓN: Puede retornar muchos registros
   */
  async obtenerTodosSinPaginacion(
    filters?: Partial<FilterInput>
  ): Promise<T[]> {
    try {
      const where = this.construirWhereClause(filters as FilterInput);
      const include = this.configurarIncludes(filters as FilterInput);

      // 🔍 FILTRO AUTOMÁTICO: Solo mostrar registros activos por defecto
      const campoActivo = this.config.campoActivo || "activo";
      const whereCompleto = {
        ...where,
        ...(!(filters as any)?.incluirInactivos && { [campoActivo]: true }),
      };

      const records = await this.model.findMany({
        where: whereCompleto,
        include,
        orderBy: this.config.defaultOrderBy,
        // Sin take/skip = trae TODOS los registros
      });

      return records;
    } catch (error) {
      console.error(
        `Error al obtener todos los ${this.config.tableName}:`,
        error
      );
      throw new Error(`Error al obtener registros de ${this.config.tableName}`);
    }
  }

  /**
   * 🔢 Contar registros que cumplan con los filtros
   * Útil para decidir si usar streaming o carga normal
   */
  async contarRegistros(filters?: Partial<FilterInput>): Promise<number> {
    try {
      const where = this.construirWhereClause(filters as FilterInput);

      // 🔍 FILTRO AUTOMÁTICO: Solo contar registros activos por defecto
      const campoActivo = this.config.campoActivo || "activo";
      const whereCompleto = {
        ...where,
        ...(!(filters as any)?.incluirInactivos && { [campoActivo]: true }),
      };

      const count = await this.model.count({ where: whereCompleto });
      return count;
    } catch (error) {
      console.error(`Error al contar ${this.config.tableName}:`, error);
      throw new Error(`Error al contar registros de ${this.config.tableName}`);
    }
  }

  /**
   * ✨ Crear un nuevo registro
   * Ejecuta dentro de una transacción para garantizar atomicidad con bitácora
   */
  async crear(datos: CreateInput): Promise<T> {
    try {
      return await this.ejecutarEnTransaccion(async (tx) => {
        // Hook para validaciones personalizadas antes de crear
        await this.antesDeCrear(datos);

        const include = this.configurarIncludes();
        const modelo = this.obtenerModelo(tx);

        // Crear el registro
        const record = await modelo.create({
          data: datos,
          include,
        });

        // 📝 Hook de bitácora (solo si está habilitado)
        if (this.registrarEnBitacora) {
          await this.registrarCreacionEnBitacora(datos, record, tx);
        }

        // Hook para acciones personalizadas después de crear
        await this.despuesDeCrear(record);

        return record;
      });
    } catch (error) {
      console.error(`Error al crear ${this.config.tableName}:`, error);
      throw this.manejarErrorPrisma(error);
    }
  }

  /**
   * ✏️ Actualizar un registro existente
   * Ejecuta dentro de una transacción para garantizar atomicidad con bitácora
   */
  async actualizar(id: number, datos: UpdateInput): Promise<T> {
    try {
      return await this.ejecutarEnTransaccion(async (tx) => {
        // Hook para validaciones personalizadas antes de actualizar
        await this.antesDeActualizar(id, datos);

        const modelo = this.obtenerModelo(tx);
        const include = this.configurarIncludes();

        // 📸 Obtener datos anteriores (para bitácora)
        const datosAnteriores = await modelo.findUnique({
          where: { [this.getPrimaryKeyField()]: id },
          include,
        });

        if (!datosAnteriores) {
          throw new Error(`${this.config.tableName} no encontrado`);
        }

        // Actualizar el registro
        const record = await modelo.update({
          where: { [this.getPrimaryKeyField()]: id },
          data: {
            ...datos,
            // 🕐 Actualizar automáticamente updatedAt en cada UPDATE
            fecha_up: new Date(),
          },
          include,
        });

        // 📝 Hook de bitácora (solo si está habilitado)
        if (this.registrarEnBitacora) {
          await this.registrarActualizacionEnBitacora(
            id,
            datos,
            datosAnteriores,
            record,
            tx
          );
        }

        // Hook para acciones personalizadas después de actualizar
        await this.despuesDeActualizar(record);

        return record;
      });
    } catch (error) {
      console.error(`Error al actualizar ${this.config.tableName}:`, error);
      throw this.manejarErrorPrisma(error);
    }
  }

  /**
   * 🗑️ Eliminar un registro (soft delete)
   * Ejecuta dentro de una transacción para garantizar atomicidad con bitácora
   * @param id - ID del registro a eliminar
   * @param idUsuarioUp - ID del usuario que ejecuta la eliminación (opcional)
   */
  async eliminar(id: number, idUsuarioUp?: number): Promise<void> {
    try {
      await this.ejecutarEnTransaccion(async (tx) => {
        // Hook para validaciones personalizadas antes de eliminar
        await this.antesDeEliminar(id);

        const modelo = this.obtenerModelo(tx);
        const include = this.configurarIncludes();

        // 📸 Obtener datos antes de eliminar (para bitácora)
        const datosAnteriores = await modelo.findUnique({
          where: { [this.getPrimaryKeyField()]: id },
          include,
        });

        if (!datosAnteriores) {
          throw new Error(`${this.config.tableName} no encontrado`);
        }

        // 🚫 SOFT DELETE: Actualizar estado a false en lugar de eliminar físicamente
        // Esto preserva los datos para auditoría y evita problemas de integridad referencial
        const campoActivo = this.config.campoActivo || "activo";
        const updateData: any = {
          [campoActivo]: false,
          // Si existe campo de actualización, también lo actualizamos
          ...(datosAnteriores.hasOwnProperty("fecha_up") && {
            fecha_up: new Date(),
          }),
          // Si se proporciona el usuario que elimina, registrarlo
          ...(idUsuarioUp &&
            datosAnteriores.hasOwnProperty("id_ct_usuario_up") && {
              id_ct_usuario_up: idUsuarioUp,
            }),
        };

        const registroEliminado = await modelo.update({
          where: { [this.getPrimaryKeyField()]: id },
          data: updateData,
          include,
        });

        // 📝 Hook de bitácora (solo si está habilitado)
        if (this.registrarEnBitacora) {
          await this.registrarEliminacionEnBitacora(
            id,
            datosAnteriores,
            registroEliminado,
            idUsuarioUp,
            tx
          );
        }

        // Hook para acciones personalizadas después de eliminar (soft delete)
        await this.despuesDeEliminar(datosAnteriores);
      });
    } catch (error) {
      console.error(
        `Error al eliminar (soft delete) ${this.config.tableName}:`,
        error
      );
      throw error; // Re-lanzar para que el controlador lo maneje
    }
  }

  // ===========================================
  // MÉTODOS PARA PERSONALIZAR (HOOKS)
  // ===========================================

  /**
   * Hook ejecutado antes de crear un registro
   * Override en servicios específicos para validaciones personalizadas
   */
  protected async antesDeCrear(datos: CreateInput): Promise<void> {
    // Implementar en servicios específicos si es necesario
  }

  /**
   * Hook ejecutado después de crear un registro
   * Override en servicios específicos para acciones post-creación
   */
  protected async despuesDeCrear(record: T): Promise<void> {
    // Implementar en servicios específicos si es necesario
  }

  /**
   * Hook ejecutado antes de actualizar un registro
   * Override en servicios específicos para validaciones personalizadas
   */
  protected async antesDeActualizar(
    id: number,
    datos: UpdateInput
  ): Promise<void> {
    // Implementar en servicios específicos si es necesario
  }

  /**
   * Hook ejecutado después de actualizar un registro
   * Override en servicios específicos para acciones post-actualización
   */
  protected async despuesDeActualizar(record: T): Promise<void> {
    // Implementar en servicios específicos si es necesario
  }

  /**
   * Hook ejecutado antes de eliminar un registro
   * Override en servicios específicos para validaciones personalizadas
   */
  protected async antesDeEliminar(id: number): Promise<void> {
    // Implementar en servicios específicos si es necesario
  }

  /**
   * Hook ejecutado después de eliminar un registro
   * Override en servicios específicos para acciones post-eliminación
   */
  protected async despuesDeEliminar(record: T): Promise<void> {
    // Implementar en servicios específicos si es necesario
  }

  // ===========================================
  // 📝 MÉTODOS AUTOMÁTICOS DE BITÁCORA
  // ===========================================

  /**
   * 🔍 Extraer datos relevantes de un registro para bitácora
   * Excluye campos sensibles y metadatos innecesarios
   */
  private extraerDatosParaBitacora(registro: any): any {
    if (!registro) return null;

    const datos: any = {};

    for (const [key, value] of Object.entries(registro)) {
      // Excluir campos sensibles
      if (this.camposExcluidosBitacora.includes(key)) continue;

      // Excluir campos de metadata que no son relevantes para auditoría
      if (key.startsWith("id_ct_usuario")) continue; // Ya se registra por separado
      if (key === "fecha_in" || key === "fecha_up") continue;

      // Excluir relaciones anidadas (solo IDs son relevantes)
      if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
      ) {
        continue;
      }

      datos[key] = value;
    }

    return datos;
  }

  /**
   * 📝 Registrar operación en bitácora (automático)
   */
  private async registrarEnBitacoraAutomatico(
    accion: "CREATE" | "UPDATE" | "DELETE",
    idRegistro: number,
    datosAnteriores: any | null,
    datosNuevos: any,
    idUsuario: number | undefined,
    tx: any
  ): Promise<void> {
    try {
      // Validar que se configuró el nombre de la tabla
      if (!this.nombreTablaParaBitacora) {
        console.warn(
          `⚠️  registrarEnBitacora está activado pero nombreTablaParaBitacora no está configurado en ${this.config.tableName}`
        );
        return;
      }

      await tx.dt_bitacora.create({
        data: {
          tabla: this.nombreTablaParaBitacora,
          accion,
          id_registro: idRegistro,
          datos_anteriores: datosAnteriores
            ? this.extraerDatosParaBitacora(datosAnteriores)
            : null,
          datos_nuevos: this.extraerDatosParaBitacora(datosNuevos),
          id_ct_usuario: idUsuario || 1, // Usuario por defecto si no se proporciona
          observaciones: this.generarObservacionAutomatica(
            accion,
            datosAnteriores,
            datosNuevos
          ),
          fecha: new Date(),
        },
      });
    } catch (error) {
      console.error(`Error al registrar en bitácora:`, error);
      // Re-lanzar para que se haga rollback de toda la transacción
      throw error;
    }
  }

  /**
   * 📝 Generar observación legible automáticamente
   */
  private generarObservacionAutomatica(
    accion: string,
    datosAnteriores: any | null,
    datosNuevos: any
  ): string {
    const nombreCampo = datosNuevos?.nombre || datosNuevos?.descripcion || "";
    const tabla = this.nombreTablaParaBitacora;

    switch (accion) {
      case "CREATE":
        return nombreCampo
          ? `${tabla} "${nombreCampo}" creado`
          : `Nuevo registro en ${tabla}`;
      case "UPDATE":
        return nombreCampo
          ? `${tabla} "${nombreCampo}" actualizado`
          : `Registro en ${tabla} actualizado`;
      case "DELETE":
        return nombreCampo
          ? `${tabla} "${nombreCampo}" desactivado`
          : `Registro en ${tabla} desactivado`;
      default:
        return `Operación ${accion} en ${tabla}`;
    }
  }

  /**
   * 🎯 HOOKS OPCIONALES para personalizar bitácora
   * Si necesitas lógica personalizada, puedes sobrescribir estos métodos
   */
  protected async registrarCreacionEnBitacora(
    datos: CreateInput,
    resultado: T,
    tx: any
  ): Promise<void> {
    // Por defecto, usar registro automático
    const idRegistro = (resultado as any)[this.getPrimaryKeyField()];
    const idUsuario = (datos as any).id_ct_usuario_in;

    await this.registrarEnBitacoraAutomatico(
      "CREATE",
      idRegistro,
      null,
      resultado,
      idUsuario,
      tx
    );
  }

  protected async registrarActualizacionEnBitacora(
    id: number,
    datos: UpdateInput,
    datosAnteriores: T,
    resultado: T,
    tx: any
  ): Promise<void> {
    // Por defecto, usar registro automático
    const idUsuario = (datos as any).id_ct_usuario_up;

    await this.registrarEnBitacoraAutomatico(
      "UPDATE",
      id,
      datosAnteriores,
      resultado,
      idUsuario,
      tx
    );
  }

  protected async registrarEliminacionEnBitacora(
    id: number,
    datosAnteriores: T,
    registroEliminado: T,
    idUsuarioUp: number | undefined,
    tx: any
  ): Promise<void> {
    // Por defecto, usar registro automático
    await this.registrarEnBitacoraAutomatico(
      "DELETE",
      id,
      datosAnteriores,
      { estado: false },
      idUsuarioUp,
      tx
    );
  }

  /**
   * Obtener el nombre del campo de clave primaria
   * Override en servicios específicos si no es el estándar
   */
  protected getPrimaryKeyField(): string {
    // 🔧 Algoritmo inteligente para detectar PK automáticamente
    const tableName = this.config.tableName.toLowerCase();

    // 📋 Casos especiales conocidos
    if (tableName === "ct_localidad") {
      return "id_localidad";
    }

    if (tableName === "rl_infraestructura_jerarquia") {
      return "id_jerarquia";
    }

    // 🔗 Tablas de relación (Rl_)
    if (tableName.startsWith("rl_")) {
      // Para tablas de relación, asumimos id_[tabla_completa]
      // Rl_infraestructura_unidad_nivel → id_infraestructura_unidad_nivel
      return `id_${tableName.replace("rl_", "")}`;
    }

    // 📊 Tablas de datos (Dt_)
    if (tableName.startsWith("dt_")) {
      // Dt_bitacora → id_bitacora
      return `id_${tableName.replace("dt_", "")}`;
    }

    // 📋 Tablas de catálogo estándar (Ct_)
    if (tableName.startsWith("ct_")) {
      const cleanName = tableName.replace("ct_", "");

      // 🏗️ Casos de infraestructura
      if (cleanName.startsWith("infraestructura_")) {
        // ct_infraestructura_unidad → id_unidad
        // ct_infraestructura_tipo_escuela → id_tipo_escuela
        return `id_${cleanName.replace("infraestructura_", "")}`;
      }

      // 📦 Casos de inventario
      if (cleanName.startsWith("inventario_")) {
        // ct_inventario_marca → id_marca
        // ct_inventario_color → id_color
        return `id_${cleanName.replace("inventario_", "")}`;
      }

      // 🏫 Casos generales de catálogo
      // ct_municipio → id_municipio
      // ct_localidad → id_localidad (ya manejado arriba)
      return `id_${cleanName}`;
    }

    // 🤷‍♂️ Fallback: usar el nombre completo
    // Si no coincide con ningún patrón, usar tabla completa
    console.warn(
      `⚠️  No se pudo determinar PK para tabla '${tableName}'. Usando 'id_${tableName}'`
    );
    return `id_${tableName}`;
  }

  /**
   * 🛡️ Manejar errores de Prisma y convertirlos en mensajes amigables
   */
  protected manejarErrorPrisma(error: any): Error {
    // Error de constraint UNIQUE violado
    if (error.code === "P2002") {
      const campo = error.meta?.target?.[0] || "campo";
      return new Error(
        `Ya existe un registro con ese ${campo}. Por favor, use un valor diferente.`
      );
    }

    // Error de registro no encontrado
    if (error.code === "P2025") {
      return new Error(`${this.config.tableName} no encontrado`);
    }

    // Error de foreign key constraint
    if (error.code === "P2003") {
      return new Error(
        `No se puede realizar la operación. Existe una referencia a otro registro.`
      );
    }

    // Error de constraint requerido
    if (error.code === "P2011") {
      const campo = error.meta?.constraint || "campo requerido";
      return new Error(`El campo ${campo} es obligatorio`);
    }

    // Para otros errores, devolver el error original
    return error;
  }

  // ===========================================
  // 🔄 MÉTODOS DE TRANSACCIONES
  // ===========================================

  /**
   * 🔄 Ejecutar operación dentro de una transacción
   * Garantiza atomicidad: TODO se ejecuta o NADA se ejecuta
   *
   * @param operacion - Función que recibe el cliente de transacción (tx)
   * @returns Resultado de la operación
   *
   * @example
   * ```typescript
   * await this.ejecutarEnTransaccion(async (tx) => {
   *   const usuario = await tx.ct_usuario.create({ data: datosUsuario });
   *   await tx.dt_perfil.create({ data: { id_usuario: usuario.id, ...datos } });
   *   return usuario;
   * });
   * ```
   */
  async ejecutarEnTransaccion<R>(
    operacion: (tx: any) => Promise<R>
  ): Promise<R> {
    try {
      return await prisma.$transaction(operacion, {
        maxWait: 5000, // 5 segundos de espera para obtener conexión
        timeout: 10000, // 10 segundos de timeout
      });
    } catch (error) {
      console.error(
        `Error en transacción para ${this.config.tableName}:`,
        error
      );
      throw this.manejarErrorPrisma(error);
    }
  }

  /**
   * 📦 Crear múltiples registros de una vez (bulk insert)
   * Más eficiente que crear uno por uno
   *
   * @param datosArray - Array de datos a crear
   * @returns Número de registros creados
   *
   * @example
   * ```typescript
   * await municipioService.crearMultiples([
   *   { nombre: "Mun 1", ... },
   *   { nombre: "Mun 2", ... }
   * ]);
   * ```
   */
  async crearMultiples(datosArray: CreateInput[]): Promise<number> {
    try {
      if (!datosArray || datosArray.length === 0) {
        throw new Error("No se proporcionaron datos para crear");
      }

      // Hook para validaciones de cada registro
      for (const datos of datosArray) {
        await this.antesDeCrear(datos);
      }

      // Usar createMany para inserción masiva eficiente
      const resultado = await this.model.createMany({
        data: datosArray,
        skipDuplicates: false, // Fallar si hay duplicados
      });

      console.log(
        `✅ ${resultado.count} registros creados en ${this.config.tableName}`
      );

      return resultado.count;
    } catch (error) {
      console.error(
        `Error al crear múltiples ${this.config.tableName}:`,
        error
      );
      throw this.manejarErrorPrisma(error);
    }
  }
}

/*
🔄 SOFT DELETE IMPLEMENTADO:

✅ Cambios realizados:
1. 🚫 método eliminar() - Ahora hace UPDATE activo=false en lugar de DELETE físico
2. 🔍 método obtenerTodos() - Solo muestra registros activos por defecto
3. 🔍 método obtenerPorId() - Solo busca registros activos por defecto
4. 🛡️ manejarErrorPrisma() - Convierte errores de BD en mensajes amigables
5. 🕐 método actualizar() - Actualiza automáticamente updatedAt en cada UPDATE

📋 Beneficios:
- ✅ Preserva datos para auditoría
- ✅ Evita problemas de integridad referencial
- ✅ Permite recuperación de datos "eliminados"
- ✅ Mantiene historial completo del sistema

🔧 Para incluir registros inactivos:
- Pasar { incluirInactivos: true } en los filtros
- Ejemplo: obtenerTodos({}, { incluirInactivos: true })

⚠️  Nota: Todos los modelos deben tener campo 'activo' (Boolean)
*/
