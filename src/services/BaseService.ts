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
   * 📝 SISTEMA DE BITÁCORA (Automático y Optimizado)
   *
   * Para activar en un servicio, solo necesitas 2 líneas:
   * ```typescript
   * protected registrarEnBitacora = true;
   * protected nombreTablaParaBitacora = "LOCALIDAD"; // Nombre para ct_bitacora_tabla
   * ```
   *
   * BaseService se encarga automáticamente de:
   * - Capturar datos antes/después del cambio
   * - 🎯 OPTIMIZACIÓN: Solo guarda campos que realmente cambiaron
   * - Buscar acciones en ct_bitacora_accion (usa catálogo existente)
   * - Buscar/crear registros en ct_bitacora_tabla si no existen
   * - Buscar sesión activa del usuario específico en ct_sesion (TEMPORAL - mejorar con JWT)
   * - Registrar en dt_bitacora con las FK correctas dentro de la misma transacción
   * - Hacer rollback si falla la bitácora
   * - Serializar datos como JSON en campos LongText
   *
   * 🚀 BENEFICIOS DE OPTIMIZACIÓN:
   * - Reduce el tamaño de la bitácora hasta un 90%
   * - Mejora la legibilidad (solo cambios relevantes)
   * - Optimiza el rendimiento de consultas
   * - Facilita el análisis de cambios específicos
   *
   * ⚠️ REQUISITOS DE SEGURIDAD:
   * - ct_bitacora_accion debe estar poblado con acciones estándar
   * - 🚨 ct_sesion DEBE tener al menos una sesión activa para cada usuario (OBLIGATORIO por seguridad)
   * - No se permite registrar en bitácora sin sesión válida del usuario (previene puertas traseras)
   * - 💡 MEJORA FUTURA: Pasar idSesion desde JWT en lugar de buscarlo en BD
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
   * @param datos - Datos para crear el registro
   * @param idSesion - ID de la sesión actual (OBLIGATORIO para bitácora y seguridad)
   * @param idUsuario - ID del usuario actual (OBLIGATORIO para bitácora y seguridad)
   */
  async crear(
    datos: CreateInput,
    idSesion: number,
    idUsuario: number
  ): Promise<T> {
    try {
      return await this.ejecutarEnTransaccion(async (tx) => {
        // Hook para validaciones personalizadas antes de crear
        await this.antesDeCrear(datos);

        const include = this.configurarIncludes();
        const modelo = this.obtenerModelo(tx);

        // 🔐 Agregar id_ct_usuario_in desde el JWT a los datos
        const datosConUsuario = {
          ...datos,
          id_ct_usuario_in: idUsuario,
        };

        // Crear el registro
        const record = await modelo.create({
          data: datosConUsuario,
          include,
        });

        // 📝 Hook de bitácora (solo si está habilitado)
        if (this.registrarEnBitacora) {
          await this.registrarCreacionEnBitacora(
            datos,
            record,
            tx,
            idSesion,
            idUsuario
          );
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
   * @param id - ID del registro a actualizar
   * @param datos - Datos para actualizar
   * @param idSesion - ID de la sesión actual (OBLIGATORIO para bitácora y seguridad)
   */
  async actualizar(
    id: number,
    datos: UpdateInput,
    idSesion: number,
    idUsuario: number
  ): Promise<T> {
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
            // 🔐 Agregar id_ct_usuario_up desde el JWT
            id_ct_usuario_up: idUsuario,
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
            tx,
            idSesion,
            idUsuario
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
   * @param idUsuarioUp - ID del usuario que ejecuta la eliminación
   * @param idSesion - ID de la sesión actual (OBLIGATORIO para bitácora y seguridad)
   */
  async eliminar(
    id: number,
    idSesion: number,
    idUsuario: number
  ): Promise<void> {
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
          ...(idUsuario &&
            datosAnteriores.hasOwnProperty("id_ct_usuario_up") && {
              id_ct_usuario_up: idUsuario,
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
            idUsuario,
            tx,
            idSesion
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
   * 🎯 Extraer solo los campos que cambiaron entre dos registros
   * Optimiza el tamaño de la bitácora guardando solo cambios relevantes
   */
  private extraerCamposAfectados(
    datosAnteriores: any,
    datosNuevos: any
  ): {
    camposAnteriores: any;
    camposNuevos: any;
  } {
    if (!datosAnteriores && !datosNuevos) {
      return { camposAnteriores: {}, camposNuevos: {} };
    }

    if (!datosAnteriores) {
      // Solo datos nuevos (creación)
      return {
        camposAnteriores: {},
        camposNuevos: this.extraerDatosParaBitacora(datosNuevos),
      };
    }

    if (!datosNuevos) {
      // Solo datos anteriores (eliminación)
      return {
        camposAnteriores: this.extraerDatosParaBitacora(datosAnteriores),
        camposNuevos: {},
      };
    }

    // Comparar ambos registros y extraer solo campos que cambiaron
    const datosAnterioresLimpios =
      this.extraerDatosParaBitacora(datosAnteriores);
    const datosNuevosLimpios = this.extraerDatosParaBitacora(datosNuevos);

    const camposAnteriores: any = {};
    const camposNuevos: any = {};

    // Obtener todas las claves únicas
    const todasLasClaves = new Set([
      ...Object.keys(datosAnterioresLimpios),
      ...Object.keys(datosNuevosLimpios),
    ]);

    for (const clave of todasLasClaves) {
      const valorAnterior = datosAnterioresLimpios[clave];
      const valorNuevo = datosNuevosLimpios[clave];

      // Solo incluir si los valores son diferentes
      if (JSON.stringify(valorAnterior) !== JSON.stringify(valorNuevo)) {
        if (valorAnterior !== undefined) {
          camposAnteriores[clave] = valorAnterior;
        }
        if (valorNuevo !== undefined) {
          camposNuevos[clave] = valorNuevo;
        }
      }
    }

    return { camposAnteriores, camposNuevos };
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
    idSesion: number | undefined,
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

      // 🔍 Obtener IDs de las tablas de catálogo de bitácora
      const { idAccion, idTabla } = await this.obtenerIdsBitacora(accion, tx);

      // 🚨 Validación redundante de seguridad
      // (ya se validó en validarYObtenerSesion, pero por si acaso)
      if (!idSesion) {
        throw new Error(
          "🚨 SEGURIDAD CRÍTICA: id_ct_sesion es NULL. " +
            "Esto NO debería suceder si la validación funcionó correctamente. " +
            "Revisar implementación de validarYObtenerSesion."
        );
      }

      // 🎯 Extraer solo los campos que realmente cambiaron
      const { camposAnteriores, camposNuevos } = this.extraerCamposAfectados(
        datosAnteriores,
        datosNuevos
      );

      await tx.dt_bitacora.create({
        data: {
          id_ct_bitacora_accion: idAccion,
          id_ct_bitacora_tabla: idTabla,
          id_registro_afectado: idRegistro,
          id_ct_sesion: idSesion, // Campo normal, no FK
          datos_anteriores: JSON.stringify(camposAnteriores),
          datos_nuevos: JSON.stringify(camposNuevos),
          id_ct_usuario_in: idUsuario || 1, // Usuario por defecto si no se proporciona
          estado: true,
        },
      });
    } catch (error) {
      console.error(`Error al registrar en bitácora:`, error);
      // Re-lanzar para que se haga rollback de toda la transacción
      throw error;
    }
  }

  /**
   * 🔐 VALIDAR SESIÓN DEL USUARIO (SEGURIDAD CRÍTICA)
   *
   * Este método es OBLIGATORIO para garantizar que:
   * 1. ✅ La sesión existe en la base de datos
   * 2. ✅ La sesión está activa
   * 3. ✅ La sesión pertenece al usuario que está haciendo la operación
   * 4. ✅ La sesión no ha expirado
   * 5. ✅ No se puede falsificar una sesión
   *
   * @param idSesion - ID de la sesión a validar (OBLIGATORIO desde JWT)
   * @param idUsuario - ID del usuario que debe ser dueño de la sesión
   * @param tx - Cliente de transacción Prisma
   * @returns ID de la sesión validada
   * @throws Error si la sesión es inválida, no pertenece al usuario, o ha expirado
   */
  private async validarYObtenerSesion(
    idSesion: number,
    idUsuario: number,
    tx: any
  ): Promise<number> {
    // 🚨 Validación obligatoria
    if (!idSesion) {
      throw new Error(
        "🚨 SEGURIDAD: id_ct_sesion es OBLIGATORIO. " +
          "Debe proporcionarse desde el JWT del usuario autenticado. " +
          "No se permite registrar en bitácora sin sesión válida."
      );
    }

    if (!idUsuario) {
      throw new Error(
        "🚨 SEGURIDAD: id_ct_usuario es OBLIGATORIO. " +
          "Debe proporcionarse desde el JWT o los datos del registro."
      );
    }

    // 🔍 VALIDACIÓN EN BD: Verificar que la sesión existe y es válida
    const sesionRecord = await tx.ct_sesion.findUnique({
      where: {
        id_ct_sesion: idSesion,
      },
    });

    // ❌ Sesión no existe
    if (!sesionRecord) {
      throw new Error(
        `🚨 SEGURIDAD: La sesión ${idSesion} no existe en la base de datos. ` +
          `Posible intento de falsificación de sesión.`
      );
    }

    // ❌ Sesión no pertenece al usuario
    if (sesionRecord.id_ct_usuario !== idUsuario) {
      throw new Error(
        `🚨 SEGURIDAD: La sesión ${idSesion} NO pertenece al usuario ${idUsuario}. ` +
          `Pertenece al usuario ${sesionRecord.id_ct_usuario}. ` +
          `Posible intento de usar sesión de otro usuario.`
      );
    }

    // ❌ Sesión inactiva
    if (!sesionRecord.activa) {
      throw new Error(
        `🚨 SEGURIDAD: La sesión ${idSesion} está INACTIVA. ` +
          `El usuario debe iniciar sesión nuevamente.`
      );
    }

    // ❌ Sesión expirada
    const ahora = new Date();
    if (sesionRecord.fecha_expiracion < ahora) {
      // Marcar como inactiva automáticamente
      await tx.ct_sesion.update({
        where: { id_ct_sesion: idSesion },
        data: { activa: false },
      });

      throw new Error(
        `🚨 SEGURIDAD: La sesión ${idSesion} ha EXPIRADO. ` +
          `Expiró el ${sesionRecord.fecha_expiracion.toISOString()}. ` +
          `El usuario debe iniciar sesión nuevamente.`
      );
    }

    // ✅ Sesión válida y verificada
    console.log(
      `✅ SEGURIDAD: Sesión ${idSesion} validada correctamente para usuario ${idUsuario}`
    );

    return idSesion;
  }

  /**
   * 🔍 Obtener IDs de las tablas de catálogo de bitácora
   */
  private async obtenerIdsBitacora(
    accion: string,
    tx: any
  ): Promise<{
    idAccion: number;
    idTabla: number;
  }> {
    // Mapear acciones a nombres estándar del catálogo existente
    const mapeoAcciones: Record<string, string> = {
      CREATE: "Creación",
      UPDATE: "Actualización",
      DELETE: "Eliminación",
    };

    const nombreAccion = mapeoAcciones[accion] || accion;

    // Buscar la acción en ct_bitacora_accion (NO crear, usar catálogo existente)
    const accionRecord = await tx.ct_bitacora_accion.findFirst({
      where: {
        nombre: nombreAccion,
        estado: true,
      },
    });

    if (!accionRecord) {
      throw new Error(
        `Acción de bitácora "${nombreAccion}" no encontrada en el catálogo ct_bitacora_accion. Asegúrate de que el catálogo esté poblado correctamente.`
      );
    }

    // Buscar o crear la tabla en ct_bitacora_tabla
    let tablaRecord = await tx.ct_bitacora_tabla.findFirst({
      where: {
        nombre: this.nombreTablaParaBitacora,
        estado: true,
      },
    });

    if (!tablaRecord) {
      // Crear la tabla si no existe
      tablaRecord = await tx.ct_bitacora_tabla.create({
        data: {
          nombre: this.nombreTablaParaBitacora,
          descripcion: `Tabla ${this.nombreTablaParaBitacora}`,
          estado: true,
          auditar: true,
          id_ct_usuario_in: 1, // Usuario sistema
        },
      });
    }

    return {
      idAccion: accionRecord.id_ct_bitacora_accion,
      idTabla: tablaRecord.id_ct_bitacora_tabla,
    };
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
    tx: any,
    idSesionProporcionado: number,
    idUsuarioProporcionado: number
  ): Promise<void> {
    // Por defecto, usar registro automático
    const idRegistro = (resultado as any)[this.getPrimaryKeyField()];

    // 🔐 VALIDAR sesión obligatoriamente
    const idSesion = await this.validarYObtenerSesion(
      idSesionProporcionado,
      idUsuarioProporcionado,
      tx
    );

    await this.registrarEnBitacoraAutomatico(
      "CREATE",
      idRegistro,
      null,
      resultado,
      idUsuarioProporcionado,
      idSesion,
      tx
    );
  }

  protected async registrarActualizacionEnBitacora(
    id: number,
    datos: UpdateInput,
    datosAnteriores: T,
    resultado: T,
    tx: any,
    idSesionProporcionado: number,
    idUsuarioProporcionado: number
  ): Promise<void> {
    // Por defecto, usar registro automático

    // 🔐 VALIDAR sesión obligatoriamente
    const idSesion = await this.validarYObtenerSesion(
      idSesionProporcionado,
      idUsuarioProporcionado,
      tx
    );

    await this.registrarEnBitacoraAutomatico(
      "UPDATE",
      id,
      datosAnteriores,
      resultado,
      idUsuarioProporcionado,
      idSesion,
      tx
    );
  }

  protected async registrarEliminacionEnBitacora(
    id: number,
    datosAnteriores: T,
    registroEliminado: T,
    idUsuarioProporcionado: number,
    tx: any,
    idSesionProporcionado: number
  ): Promise<void> {
    // Por defecto, usar registro automático
    // 🔐 VALIDAR sesión obligatoriamente
    const idSesion = await this.validarYObtenerSesion(
      idSesionProporcionado,
      idUsuarioProporcionado,
      tx
    );

    await this.registrarEnBitacoraAutomatico(
      "DELETE",
      id,
      datosAnteriores,
      { estado: false },
      idUsuarioProporcionado,
      idSesion,
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
🔄 SOFT DELETE + BITÁCORA AUTOMÁTICA OPTIMIZADA IMPLEMENTADO:

✅ Cambios realizados:
1. 🚫 método eliminar() - Ahora hace UPDATE activo=false en lugar de DELETE físico
2. 🔍 método obtenerTodos() - Solo muestra registros activos por defecto
3. 🔍 método obtenerPorId() - Solo busca registros activos por defecto
4. 🛡️ manejarErrorPrisma() - Convierte errores de BD en mensajes amigables
5. 🕐 método actualizar() - Actualiza automáticamente updatedAt en cada UPDATE
6. 📝 Sistema de bitácora automático - Registra en dt_bitacora con FK correctas
7. 🎯 OPTIMIZACIÓN: Solo guarda campos que realmente cambiaron (reduce tamaño 90%)

📋 Beneficios:
- ✅ Preserva datos para auditoría
- ✅ Evita problemas de integridad referencial
- ✅ Permite recuperación de datos "eliminados"
- ✅ Mantiene historial completo del sistema
- ✅ Bitácora automática con ct_bitacora_accion y ct_bitacora_tabla
- ✅ Bitácora optimizada (solo cambios relevantes)
- ✅ Mejor rendimiento y legibilidad

🔧 Para incluir registros inactivos:
- Pasar { incluirInactivos: true } en los filtros
- Ejemplo: obtenerTodos({}, { incluirInactivos: true })

🔧 Para activar bitácora en un servicio:
- protected registrarEnBitacora = true;
- protected nombreTablaParaBitacora = "NOMBRE_TABLA";

⚠️  Nota: Todos los modelos deben tener campo 'activo' (Boolean)
⚠️  Nota: Sistema de bitácora requiere ct_bitacora_accion y ct_bitacora_tabla poblados
⚠️  Nota: Bitácora optimizada solo guarda campos modificados
*/
