# 🚀 Guía Completa para Crear APIs

## 📋 Índice

1. [Introducción](#introducción)
2. [Paso 1: Definir el Schema en Prisma](#paso-1-definir-el-schema-en-prisma)
3. [Paso 2: Crear Validaciones con Zod](#paso-2-crear-validaciones-con-zod)
4. [Paso 3: Crear el Servicio](#paso-3-crear-el-servicio)
5. [Paso 4: Crear el Controlador](#paso-4-crear-el-controlador)
6. [Paso 5: Crear las Rutas](#paso-5-crear-las-rutas)
7. [Paso 6: Registrar en la Aplicación](#paso-6-registrar-en-la-aplicación)
8. [Ejemplo Completo: API de Categorías](#ejemplo-completo-api-de-categorías)
9. [Mejores Prácticas](#mejores-prácticas)
10. [Testing](#testing)

---

## 🎯 Introducción

Esta guía te enseñará cómo crear APIs completas siguiendo las mejores prácticas establecidas en el proyecto. Cada API debe incluir:

- ✅ **Schema Prisma** con relaciones y validaciones
- ✅ **Validaciones Zod** para entrada de datos
- ✅ **Servicio** con filtros, includes y operaciones CRUD
- ✅ **Controlador** con manejo de errores estandarizado
- ✅ **Rutas** organizadas y documentadas
- ✅ **Respuestas normalizadas** usando RespuestaUtil

---

## 📝 Paso 1: Definir el Schema en Prisma

### 1.1 Agregar el modelo en `prisma/schema.prisma`

```prisma
// Ejemplo: Modelo de Categoría
model Categoria {
  id          String   @id @default(cuid())
  nombre      String   @unique
  descripcion String?
  activa      Boolean  @default(true)
  color       String?  @default("#3B82F6")
  icono       String?

  // Relaciones
  productos   Producto[]

  // Timestamps
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Índices para optimización
  @@index([activa])
  @@index([createdAt])
  @@map("categorias")
}
```

### 1.2 Crear la migración

```bash
npx prisma migrate dev --name add_categorias
```

### 1.3 Actualizar el cliente Prisma

```bash
npx prisma generate
```

---

## 🔍 Paso 2: Crear Validaciones con Zod

### 2.1 Crear archivo de schemas en `src/schemas/`

```typescript
// src/schemas/categoria.schemas.ts
import { z } from "zod";

// Schema para crear categoría
export const crearCategoriaSchema = z.object({
  nombre: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede exceder 50 caracteres")
    .regex(
      /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
      "El nombre solo puede contener letras y espacios"
    ),
  descripcion: z
    .string()
    .max(200, "La descripción no puede exceder 200 caracteres")
    .optional(),
  activa: z.boolean().default(true),
  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, "El color debe ser un código hexadecimal válido")
    .default("#3B82F6"),
  icono: z
    .string()
    .max(50, "El icono no puede exceder 50 caracteres")
    .optional(),
});

// Schema para actualizar categoría
export const actualizarCategoriaSchema = crearCategoriaSchema.partial();

// Schema para filtros de búsqueda
export const filtrosCategoriaSchema = z.object({
  nombre: z.string().optional(),
  activa: z.boolean().optional(),
  fechaDesde: z.string().datetime().optional(),
  fechaHasta: z.string().datetime().optional(),
  ordenarPor: z.enum(["nombre", "createdAt", "updatedAt"]).default("nombre"),
  direccion: z.enum(["asc", "desc"]).default("asc"),
  pagina: z.number().min(1).default(1),
  elementosPorPagina: z.number().min(1).max(100).default(10),
});

// Schema para ID de categoría
export const categoriaIdSchema = z.object({
  id: z.string().cuid("ID de categoría inválido"),
});

// Tipos TypeScript derivados
export type CrearCategoriaInput = z.infer<typeof crearCategoriaSchema>;
export type ActualizarCategoriaInput = z.infer<
  typeof actualizarCategoriaSchema
>;
export type FiltrosCategoriaInput = z.infer<typeof filtrosCategoriaSchema>;
export type CategoriaIdInput = z.infer<typeof categoriaIdSchema>;
```

---

## ⚙️ Paso 3: Crear el Servicio

### 3.1 Crear archivo de servicio en `src/services/`

```typescript
// src/services/categoriaService.ts
import { PrismaClient, Categoria, Prisma } from "@prisma/client";
import {
  CrearCategoriaInput,
  ActualizarCategoriaInput,
  FiltrosCategoriaInput,
} from "../schemas/categoria.schemas";
import logger from "../config/logger";

export class CategoriaService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  /**
   * Crea una nueva categoría
   */
  async crearCategoria(datos: CrearCategoriaInput): Promise<Categoria> {
    try {
      // Verificar si ya existe una categoría con el mismo nombre
      const categoriaExistente = await this.prisma.categoria.findUnique({
        where: { nombre: datos.nombre },
      });

      if (categoriaExistente) {
        throw new Error(
          `Ya existe una categoría con el nombre "${datos.nombre}"`
        );
      }

      const categoria = await this.prisma.categoria.create({
        data: datos,
      });

      logger.info(
        `Categoría creada: ${categoria.nombre} (ID: ${categoria.id})`
      );
      return categoria;
    } catch (error) {
      logger.error("Error creando categoría:", error);
      throw error;
    }
  }

  /**
   * Obtiene una categoría por ID con relaciones opcionales
   */
  async obtenerCategoriaPorId(
    id: string,
    incluirProductos: boolean = false
  ): Promise<Categoria | null> {
    try {
      const categoria = await this.prisma.categoria.findUnique({
        where: { id },
        include: incluirProductos
          ? {
              productos: {
                select: {
                  id: true,
                  nombre: true,
                  precio: true,
                  stock: true,
                  activo: true,
                },
              },
            }
          : undefined,
      });

      return categoria;
    } catch (error) {
      logger.error(`Error obteniendo categoría ${id}:`, error);
      throw error;
    }
  }

  /**
   * Obtiene categorías con filtros avanzados
   */
  async obtenerCategorias(filtros: FiltrosCategoriaInput = {}): Promise<{
    categorias: Categoria[];
    total: number;
    pagina: number;
    elementosPorPagina: number;
    totalPaginas: number;
  }> {
    try {
      const {
        nombre,
        activa,
        fechaDesde,
        fechaHasta,
        ordenarPor = "nombre",
        direccion = "asc",
        pagina = 1,
        elementosPorPagina = 10,
      } = filtros;

      // Construir filtros de búsqueda
      const where: Prisma.CategoriaWhereInput = {};

      if (nombre) {
        where.nombre = {
          contains: nombre,
          mode: "insensitive",
        };
      }

      if (activa !== undefined) {
        where.activa = activa;
      }

      if (fechaDesde || fechaHasta) {
        where.createdAt = {};
        if (fechaDesde) where.createdAt.gte = new Date(fechaDesde);
        if (fechaHasta) where.createdAt.lte = new Date(fechaHasta);
      }

      // Calcular skip para paginación
      const skip = (pagina - 1) * elementosPorPagina;

      // Ejecutar consultas en paralelo
      const [categorias, total] = await Promise.all([
        this.prisma.categoria.findMany({
          where,
          orderBy: { [ordenarPor]: direccion },
          skip,
          take: elementosPorPagina,
          include: {
            _count: {
              select: { productos: true },
            },
          },
        }),
        this.prisma.categoria.count({ where }),
      ]);

      const totalPaginas = Math.ceil(total / elementosPorPagina);

      return {
        categorias,
        total,
        pagina,
        elementosPorPagina,
        totalPaginas,
      };
    } catch (error) {
      logger.error("Error obteniendo categorías:", error);
      throw error;
    }
  }

  /**
   * Actualiza una categoría
   */
  async actualizarCategoria(
    id: string,
    datos: ActualizarCategoriaInput
  ): Promise<Categoria> {
    try {
      // Verificar si la categoría existe
      const categoriaExistente = await this.prisma.categoria.findUnique({
        where: { id },
      });

      if (!categoriaExistente) {
        throw new Error(`Categoría con ID ${id} no encontrada`);
      }

      // Si se está actualizando el nombre, verificar que no exista otro con el mismo nombre
      if (datos.nombre && datos.nombre !== categoriaExistente.nombre) {
        const categoriaConMismoNombre = await this.prisma.categoria.findUnique({
          where: { nombre: datos.nombre },
        });

        if (categoriaConMismoNombre) {
          throw new Error(
            `Ya existe una categoría con el nombre "${datos.nombre}"`
          );
        }
      }

      const categoria = await this.prisma.categoria.update({
        where: { id },
        data: datos,
      });

      logger.info(
        `Categoría actualizada: ${categoria.nombre} (ID: ${categoria.id})`
      );
      return categoria;
    } catch (error) {
      logger.error(`Error actualizando categoría ${id}:`, error);
      throw error;
    }
  }

  /**
   * Elimina una categoría (soft delete)
   */
  async eliminarCategoria(id: string): Promise<Categoria> {
    try {
      // Verificar si la categoría existe
      const categoriaExistente = await this.prisma.categoria.findUnique({
        where: { id },
        include: {
          _count: { select: { productos: true } },
        },
      });

      if (!categoriaExistente) {
        throw new Error(`Categoría con ID ${id} no encontrada`);
      }

      // Verificar si tiene productos asociados
      if (categoriaExistente._count.productos > 0) {
        throw new Error(
          `No se puede eliminar la categoría "${categoriaExistente.nombre}" porque tiene ${categoriaExistente._count.productos} productos asociados`
        );
      }

      const categoria = await this.prisma.categoria.delete({
        where: { id },
      });

      logger.info(
        `Categoría eliminada: ${categoria.nombre} (ID: ${categoria.id})`
      );
      return categoria;
    } catch (error) {
      logger.error(`Error eliminando categoría ${id}:`, error);
      throw error;
    }
  }

  /**
   * Obtiene estadísticas de categorías
   */
  async obtenerEstadisticas(): Promise<{
    total: number;
    activas: number;
    inactivas: number;
    conProductos: number;
    sinProductos: number;
    promedioProductos: number;
  }> {
    try {
      const [total, activas, categoriasConProductos, totalProductos] =
        await Promise.all([
          this.prisma.categoria.count(),
          this.prisma.categoria.count({ where: { activa: true } }),
          this.prisma.categoria.count({
            where: { productos: { some: {} } },
          }),
          this.prisma.producto.count(),
        ]);

      const inactivas = total - activas;
      const sinProductos = total - categoriasConProductos;
      const promedioProductos = total > 0 ? totalProductos / total : 0;

      return {
        total,
        activas,
        inactivas,
        conProductos: categoriasConProductos,
        sinProductos,
        promedioProductos: Math.round(promedioProductos * 100) / 100,
      };
    } catch (error) {
      logger.error("Error obteniendo estadísticas de categorías:", error);
      throw error;
    }
  }

  /**
   * Cierra la conexión de Prisma
   */
  async cerrar(): Promise<void> {
    await this.prisma.$disconnect();
  }
}
```

---

## 🎮 Paso 4: Crear el Controlador

### 4.1 Crear archivo de controlador en `src/controllers/`

```typescript
// src/controllers/categoriaController.ts
import { Request, Response } from "express";
import { CategoriaService } from "../services/categoriaService";
import { RespuestaUtil } from "../utils/respuestas";
import {
  crearCategoriaSchema,
  actualizarCategoriaSchema,
  filtrosCategoriaSchema,
  categoriaIdSchema,
} from "../schemas/categoria.schemas";
import logger from "../config/logger";

export class CategoriaController {
  private categoriaService: CategoriaService;

  constructor() {
    this.categoriaService = new CategoriaService();
  }

  /**
   * Crea una nueva categoría
   * POST /api/categorias
   */
  crearCategoria = async (req: Request, res: Response): Promise<void> => {
    try {
      // Validar datos de entrada
      const datosValidados = crearCategoriaSchema.parse(req.body);
      const usuarioCreador = req.usuario?.email || "sistema";

      logger.info(
        `Creando categoría: ${datosValidados.nombre} por ${usuarioCreador}`
      );

      const categoria = await this.categoriaService.crearCategoria(
        datosValidados
      );

      RespuestaUtil.exito(
        res,
        categoria,
        `Categoría "${categoria.nombre}" creada exitosamente`
      );
    } catch (error) {
      if (error instanceof Error) {
        logger.error("Error creando categoría:", error);
        RespuestaUtil.errorValidacion(res, error.message);
      } else {
        logger.error("Error desconocido creando categoría:", error);
        RespuestaUtil.error(res, "Error interno del servidor", 500);
      }
    }
  };

  /**
   * Obtiene una categoría por ID
   * GET /api/categorias/:id
   */
  obtenerCategoriaPorId = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = categoriaIdSchema.parse(req.params);
      const incluirProductos = req.query.incluirProductos === "true";

      const categoria = await this.categoriaService.obtenerCategoriaPorId(
        id,
        incluirProductos
      );

      if (!categoria) {
        return RespuestaUtil.noEncontrado(res, "Categoría no encontrada");
      }

      RespuestaUtil.exito(res, categoria, "Categoría obtenida exitosamente");
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error obteniendo categoría ${req.params.id}:`, error);
        RespuestaUtil.errorValidacion(res, error.message);
      } else {
        logger.error("Error desconocido obteniendo categoría:", error);
        RespuestaUtil.error(res, "Error interno del servidor", 500);
      }
    }
  };

  /**
   * Obtiene categorías con filtros
   * GET /api/categorias
   */
  obtenerCategorias = async (req: Request, res: Response): Promise<void> => {
    try {
      const filtros = filtrosCategoriaSchema.parse(req.query);

      const resultado = await this.categoriaService.obtenerCategorias(filtros);

      RespuestaUtil.exito(
        res,
        resultado,
        `${resultado.categorias.length} categorías obtenidas de ${resultado.total} total`
      );
    } catch (error) {
      if (error instanceof Error) {
        logger.error("Error obteniendo categorías:", error);
        RespuestaUtil.errorValidacion(res, error.message);
      } else {
        logger.error("Error desconocido obteniendo categorías:", error);
        RespuestaUtil.error(res, "Error interno del servidor", 500);
      }
    }
  };

  /**
   * Actualiza una categoría
   * PUT /api/categorias/:id
   */
  actualizarCategoria = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = categoriaIdSchema.parse(req.params);
      const datosValidados = actualizarCategoriaSchema.parse(req.body);
      const usuarioActualizador = req.usuario?.email || "sistema";

      logger.info(`Actualizando categoría ${id} por ${usuarioActualizador}`);

      const categoria = await this.categoriaService.actualizarCategoria(
        id,
        datosValidados
      );

      RespuestaUtil.exito(
        res,
        categoria,
        `Categoría "${categoria.nombre}" actualizada exitosamente`
      );
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error actualizando categoría ${req.params.id}:`, error);
        RespuestaUtil.errorValidacion(res, error.message);
      } else {
        logger.error("Error desconocido actualizando categoría:", error);
        RespuestaUtil.error(res, "Error interno del servidor", 500);
      }
    }
  };

  /**
   * Elimina una categoría
   * DELETE /api/categorias/:id
   */
  eliminarCategoria = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = categoriaIdSchema.parse(req.params);
      const usuarioEliminador = req.usuario?.email || "sistema";

      logger.info(`Eliminando categoría ${id} por ${usuarioEliminador}`);

      const categoria = await this.categoriaService.eliminarCategoria(id);

      RespuestaUtil.exito(
        res,
        categoria,
        `Categoría "${categoria.nombre}" eliminada exitosamente`
      );
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error eliminando categoría ${req.params.id}:`, error);
        RespuestaUtil.errorValidacion(res, error.message);
      } else {
        logger.error("Error desconocido eliminando categoría:", error);
        RespuestaUtil.error(res, "Error interno del servidor", 500);
      }
    }
  };

  /**
   * Obtiene estadísticas de categorías
   * GET /api/categorias/estadisticas
   */
  obtenerEstadisticas = async (req: Request, res: Response): Promise<void> => {
    try {
      const estadisticas = await this.categoriaService.obtenerEstadisticas();

      RespuestaUtil.exito(
        res,
        estadisticas,
        "Estadísticas obtenidas exitosamente"
      );
    } catch (error) {
      if (error instanceof Error) {
        logger.error("Error obteniendo estadísticas:", error);
        RespuestaUtil.errorValidacion(res, error.message);
      } else {
        logger.error("Error desconocido obteniendo estadísticas:", error);
        RespuestaUtil.error(res, "Error interno del servidor", 500);
      }
    }
  };

  /**
   * Cierra recursos del servicio
   */
  cerrarServicio = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.categoriaService.cerrar();
      RespuestaUtil.exito(
        res,
        null,
        "Servicio de categorías cerrado exitosamente"
      );
    } catch (error) {
      logger.error("Error cerrando servicio:", error);
      RespuestaUtil.error(res, "Error interno del servidor", 500);
    }
  };
}
```

---

## 🛣️ Paso 5: Crear las Rutas

### 5.1 Crear archivo de rutas en `src/routes/`

```typescript
// src/routes/categoriaRoutes.ts
import { Router } from "express";
import { CategoriaController } from "../controllers/categoriaController";
import { validarToken } from "../middleware/auth";
import { validarPermisos } from "../middleware/permisos";

const router = Router();
const categoriaController = new CategoriaController();

/**
 * @swagger
 * /api/categorias:
 *   post:
 *     summary: Crear una nueva categoría
 *     tags: [Categorías]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *             properties:
 *               nombre:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *               descripcion:
 *                 type: string
 *                 maxLength: 200
 *               activa:
 *                 type: boolean
 *                 default: true
 *               color:
 *                 type: string
 *                 pattern: '^#[0-9A-F]{6}$'
 *                 default: "#3B82F6"
 *               icono:
 *                 type: string
 *                 maxLength: 50
 *     responses:
 *       201:
 *         description: Categoría creada exitosamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 */
router.post(
  "/",
  validarToken,
  validarPermisos(["admin", "gerente"]),
  categoriaController.crearCategoria
);

/**
 * @swagger
 * /api/categorias:
 *   get:
 *     summary: Obtener categorías con filtros
 *     tags: [Categorías]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: nombre
 *         schema:
 *           type: string
 *         description: Filtrar por nombre
 *       - in: query
 *         name: activa
 *         schema:
 *           type: boolean
 *         description: Filtrar por estado activo
 *       - in: query
 *         name: ordenarPor
 *         schema:
 *           type: string
 *           enum: [nombre, createdAt, updatedAt]
 *           default: nombre
 *         description: Campo para ordenar
 *       - in: query
 *         name: direccion
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *         description: Dirección del ordenamiento
 *       - in: query
 *         name: pagina
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: elementosPorPagina
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Elementos por página
 *     responses:
 *       200:
 *         description: Lista de categorías
 *       401:
 *         description: No autorizado
 */
router.get("/", validarToken, categoriaController.obtenerCategorias);

/**
 * @swagger
 * /api/categorias/{id}:
 *   get:
 *     summary: Obtener categoría por ID
 *     tags: [Categorías]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la categoría
 *       - in: query
 *         name: incluirProductos
 *         schema:
 *           type: boolean
 *         description: Incluir productos asociados
 *     responses:
 *       200:
 *         description: Categoría encontrada
 *       404:
 *         description: Categoría no encontrada
 *       401:
 *         description: No autorizado
 */
router.get("/:id", validarToken, categoriaController.obtenerCategoriaPorId);

/**
 * @swagger
 * /api/categorias/{id}:
 *   put:
 *     summary: Actualizar categoría
 *     tags: [Categorías]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la categoría
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *               descripcion:
 *                 type: string
 *                 maxLength: 200
 *               activa:
 *                 type: boolean
 *               color:
 *                 type: string
 *                 pattern: '^#[0-9A-F]{6}$'
 *               icono:
 *                 type: string
 *                 maxLength: 50
 *     responses:
 *       200:
 *         description: Categoría actualizada exitosamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Categoría no encontrada
 *       401:
 *         description: No autorizado
 */
router.put(
  "/:id",
  validarToken,
  validarPermisos(["admin", "gerente"]),
  categoriaController.actualizarCategoria
);

/**
 * @swagger
 * /api/categorias/{id}:
 *   delete:
 *     summary: Eliminar categoría
 *     tags: [Categorías]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la categoría
 *     responses:
 *       200:
 *         description: Categoría eliminada exitosamente
 *       400:
 *         description: No se puede eliminar (tiene productos asociados)
 *       404:
 *         description: Categoría no encontrada
 *       401:
 *         description: No autorizado
 */
router.delete(
  "/:id",
  validarToken,
  validarPermisos(["admin"]),
  categoriaController.eliminarCategoria
);

/**
 * @swagger
 * /api/categorias/estadisticas:
 *   get:
 *     summary: Obtener estadísticas de categorías
 *     tags: [Categorías]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas obtenidas exitosamente
 *       401:
 *         description: No autorizado
 */
router.get(
  "/estadisticas",
  validarToken,
  categoriaController.obtenerEstadisticas
);

export default router;
```

---

## 🔧 Paso 6: Registrar en la Aplicación

### 6.1 Agregar las rutas en `src/app.ts`

```typescript
// src/app.ts
import categoriaRoutes from "./routes/categoriaRoutes";

// ... código existente ...

// Rutas de la API
app.use("/api/categorias", categoriaRoutes);

// ... código existente ...
```

### 6.2 Actualizar el archivo de tipos `src/types/index.ts`

```typescript
// src/types/index.ts
// ... tipos existentes ...

// Tipos para Categorías
export interface Categoria {
  id: string;
  nombre: string;
  descripcion?: string;
  activa: boolean;
  color: string;
  icono?: string;
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    productos: number;
  };
  productos?: Producto[];
}

export interface CategoriaConProductos extends Categoria {
  productos: Producto[];
}

export interface EstadisticasCategoria {
  total: number;
  activas: number;
  inactivas: number;
  conProductos: number;
  sinProductos: number;
  promedioProductos: number;
}

export interface FiltrosCategoria {
  nombre?: string;
  activa?: boolean;
  fechaDesde?: string;
  fechaHasta?: string;
  ordenarPor?: "nombre" | "createdAt" | "updatedAt";
  direccion?: "asc" | "desc";
  pagina?: number;
  elementosPorPagina?: number;
}

export interface ResultadoPaginadoCategoria {
  categorias: Categoria[];
  total: number;
  pagina: number;
  elementosPorPagina: number;
  totalPaginas: number;
}
```

---

## 📋 Ejemplo Completo: API de Categorías

### Estructura de archivos creados:

```
src/
├── schemas/
│   └── categoria.schemas.ts
├── services/
│   └── categoriaService.ts
├── controllers/
│   └── categoriaController.ts
├── routes/
│   └── categoriaRoutes.ts
└── types/
    └── index.ts (actualizado)

prisma/
└── schema.prisma (actualizado)
```

### Endpoints disponibles:

| Método | Endpoint                       | Descripción          | Permisos       |
| ------ | ------------------------------ | -------------------- | -------------- |
| POST   | `/api/categorias`              | Crear categoría      | admin, gerente |
| GET    | `/api/categorias`              | Listar categorías    | todos          |
| GET    | `/api/categorias/:id`          | Obtener categoría    | todos          |
| PUT    | `/api/categorias/:id`          | Actualizar categoría | admin, gerente |
| DELETE | `/api/categorias/:id`          | Eliminar categoría   | admin          |
| GET    | `/api/categorias/estadisticas` | Estadísticas         | todos          |

---

## 🎯 Mejores Prácticas

### 1. **Nomenclatura en Español**

- ✅ Usar nombres en español para variables, funciones y archivos
- ✅ Mantener consistencia en todo el proyecto
- ✅ Documentar en español

### 2. **Validaciones Robustas**

- ✅ Usar Zod para validación de entrada
- ✅ Validar tanto en frontend como backend
- ✅ Proporcionar mensajes de error claros

### 3. **Manejo de Errores**

- ✅ Usar RespuestaUtil para respuestas estandarizadas
- ✅ Logging detallado de errores
- ✅ Try-catch en todas las operaciones asíncronas

### 4. **Optimización de Consultas**

- ✅ Usar includes para relaciones necesarias
- ✅ Implementar paginación
- ✅ Índices en campos de búsqueda frecuente

### 5. **Seguridad**

- ✅ Validación de permisos con middleware
- ✅ Sanitización de datos de entrada
- ✅ Validación de IDs con CUID

### 6. **Documentación**

- ✅ Comentarios JSDoc en métodos
- ✅ Swagger/OpenAPI para endpoints
- ✅ README actualizado

---

## 🧪 Testing

### 7.1 Crear archivo de tests

```typescript
// src/tests/categoria.test.ts
import request from "supertest";
import { app } from "../app";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("API de Categorías", () => {
  beforeAll(async () => {
    // Limpiar base de datos de prueba
    await prisma.categoria.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("POST /api/categorias", () => {
    it("debe crear una categoría válida", async () => {
      const categoriaData = {
        nombre: "Electrónicos",
        descripcion: "Productos electrónicos",
        color: "#FF0000",
      };

      const response = await request(app)
        .post("/api/categorias")
        .send(categoriaData)
        .expect(201);

      expect(response.body.exito).toBe(true);
      expect(response.body.datos.nombre).toBe(categoriaData.nombre);
    });

    it("debe rechazar datos inválidos", async () => {
      const categoriaData = {
        nombre: "A", // Muy corto
        color: "invalid", // Color inválido
      };

      const response = await request(app)
        .post("/api/categorias")
        .send(categoriaData)
        .expect(400);

      expect(response.body.exito).toBe(false);
    });
  });

  describe("GET /api/categorias", () => {
    it("debe obtener lista de categorías", async () => {
      const response = await request(app).get("/api/categorias").expect(200);

      expect(response.body.exito).toBe(true);
      expect(Array.isArray(response.body.datos.categorias)).toBe(true);
    });
  });
});
```

### 7.2 Ejecutar tests

```bash
npm test
```

---

## 🚀 Resumen del Proceso

1. **Schema Prisma** → Define el modelo y relaciones
2. **Validaciones Zod** → Valida datos de entrada
3. **Servicio** → Lógica de negocio y operaciones CRUD
4. **Controlador** → Manejo de requests y responses
5. **Rutas** → Definición de endpoints y middleware
6. **Registro** → Integración en la aplicación
7. **Testing** → Pruebas automatizadas

### ✅ Checklist de Verificación

- [ ] Schema Prisma creado y migrado
- [ ] Validaciones Zod implementadas
- [ ] Servicio con filtros e includes
- [ ] Controlador con manejo de errores
- [ ] Rutas con middleware de autenticación
- [ ] Registrado en app.ts
- [ ] Tipos TypeScript actualizados
- [ ] Documentación Swagger agregada
- [ ] Tests implementados
- [ ] README actualizado

**¡Siguiendo esta guía tendrás APIs robustas, seguras y mantenibles!** 🎉
