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
   */
  async crear(datos: CreateInput): Promise<T> {
    try {
      // Hook para validaciones personalizadas antes de crear
      await this.antesDeCrear(datos);

      const include = this.configurarIncludes();

      const record = await this.model.create({
        data: datos,
        include,
      });

      // Hook para acciones después de crear
      await this.despuesDeCrear(record);

      return record;
    } catch (error) {
      console.error(`Error al crear ${this.config.tableName}:`, error);
      throw this.manejarErrorPrisma(error);
    }
  }

  /**
   * ✏️ Actualizar un registro existente
   */
  async actualizar(id: number, datos: UpdateInput): Promise<T> {
    try {
      // Hook para validaciones personalizadas antes de actualizar
      await this.antesDeActualizar(id, datos);

      // Verificar que el registro existe
      const existingRecord = await this.model.findUnique({
        where: { [this.getPrimaryKeyField()]: id },
      });

      if (!existingRecord) {
        throw new Error(`${this.config.tableName} no encontrado`);
      }

      const include = this.configurarIncludes();

      const record = await this.model.update({
        where: { [this.getPrimaryKeyField()]: id },
        data: {
          ...datos,
          // 🕐 Actualizar automáticamente updatedAt en cada UPDATE
          fecha_up: new Date(),
        },
        include,
      });

      // Hook para acciones después de actualizar
      await this.despuesDeActualizar(record);

      return record;
    } catch (error) {
      console.error(`Error al actualizar ${this.config.tableName}:`, error);
      throw this.manejarErrorPrisma(error);
    }
  }

  /**
   * 🗑️ Eliminar un registro
   * @param id - ID del registro a eliminar
   * @param idUsuarioUp - ID del usuario que ejecuta la eliminación (opcional)
   */
  async eliminar(id: number, idUsuarioUp?: number): Promise<void> {
    try {
      // Hook para validaciones personalizadas antes de eliminar
      await this.antesDeEliminar(id);

      const existingRecord = await this.model.findUnique({
        where: { [this.getPrimaryKeyField()]: id },
      });

      if (!existingRecord) {
        throw new Error(`${this.config.tableName} no encontrado`);
      }

      // 🚫 SOFT DELETE: Actualizar estado a false en lugar de eliminar físicamente
      // Esto preserva los datos para auditoría y evita problemas de integridad referencial
      const campoActivo = this.config.campoActivo || "activo";
      const updateData: any = {
        [campoActivo]: false,
        // Si existe campo de actualización, también lo actualizamos
        ...(existingRecord.hasOwnProperty("fecha_up") && {
          fecha_up: new Date(),
        }),
        // Si se proporciona el usuario que elimina, registrarlo
        ...(idUsuarioUp &&
          existingRecord.hasOwnProperty("id_ct_usuario_up") && {
            id_ct_usuario_up: idUsuarioUp,
          }),
      };

      await this.model.update({
        where: { [this.getPrimaryKeyField()]: id },
        data: updateData,
      });

      // Hook para acciones después de eliminar (soft delete)
      await this.despuesDeEliminar(existingRecord);
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
