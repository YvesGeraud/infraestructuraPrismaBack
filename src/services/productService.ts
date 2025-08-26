import { Product } from "@prisma/client";
import { prisma } from "../config/database";
import { PaginationParams, PaginatedResponse } from "../types";
import {
  CreateProductInput,
  UpdateProductInput,
  ProductFiltersInput,
} from "../schemas/productSchemas";

// Tipo para respuesta de producto
export type ProductResponse = Product;

export class ProductService {
  /**
   * Crear un nuevo producto
   */
  async createProduct(
    productData: CreateProductInput
  ): Promise<ProductResponse> {
    // Verificar si el SKU ya existe
    const existingProduct = await prisma.product.findUnique({
      where: { sku: productData.sku },
    });

    if (existingProduct) {
      throw new Error("El SKU ya está registrado");
    }

    // Crear el producto
    const product = await prisma.product.create({
      data: {
        name: productData.name,
        description: productData.description,
        price: productData.price,
        stock: productData.stock,
        sku: productData.sku,
        category: productData.category,
        brand: productData.brand,
        images: productData.images,
        isFeatured: productData.isFeatured || false,
        weight: productData.weight,
        dimensions: productData.dimensions,
        tags: productData.tags,
      },
    });

    return this.mapToProductResponse(product);
  }

  /**
   * Obtener producto por ID
   */
  async getProductById(id: number): Promise<ProductResponse | null> {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    return product ? this.mapToProductResponse(product) : null;
  }

  /**
   * Obtener producto por SKU
   */
  async getProductBySku(sku: string): Promise<ProductResponse | null> {
    const product = await prisma.product.findUnique({
      where: { sku },
    });

    return product ? this.mapToProductResponse(product) : null;
  }

  /**
   * Obtener productos con paginación y filtros
   */
  async getProducts(
    filters: ProductFiltersInput = {},
    pagination: PaginationParams = {}
  ): Promise<PaginatedResponse<ProductResponse>> {
    const page = pagination.page || 1;
    const limit = pagination.limit || 10;
    const skip = (page - 1) * limit;

    // Construir where clause
    const where: any = {};

    if (filters.category) {
      where.category = filters.category;
    }

    if (filters.brand) {
      where.brand = filters.brand;
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      where.price = {};
      if (filters.minPrice !== undefined) {
        where.price.gte = filters.minPrice;
      }
      if (filters.maxPrice !== undefined) {
        where.price.lte = filters.maxPrice;
      }
    }

    if (filters.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    if (filters.isFeatured !== undefined) {
      where.isFeatured = filters.isFeatured;
    }

    // Filtro de búsqueda en tiempo real
    // Busca en múltiples campos: nombre, descripción, SKU, categoría y marca
    // Ejemplo: search="laptop" encontrará productos con "laptop" en cualquiera de estos campos
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search } },
        { description: { contains: filters.search } },
        { sku: { contains: filters.search } },
        { category: { contains: filters.search } },
        { brand: { contains: filters.search } },
      ];
    }

    // Obtener productos y total
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: products.map((product: any) => this.mapToProductResponse(product)),
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  /**
   * Obtener productos destacados
   */
  async getFeaturedProducts(limit: number = 10): Promise<ProductResponse[]> {
    const products = await prisma.product.findMany({
      where: {
        isFeatured: true,
        isActive: true,
      },
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    return products.map((product: any) => this.mapToProductResponse(product));
  }

  /**
   * Obtener productos por categoría
   */
  async getProductsByCategory(
    category: string,
    pagination: PaginationParams = {}
  ): Promise<PaginatedResponse<ProductResponse>> {
    const page = pagination.page || 1;
    const limit = pagination.limit || 10;
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: {
          category,
          isActive: true,
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.count({
        where: {
          category,
          isActive: true,
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: products.map((product: any) => this.mapToProductResponse(product)),
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  /**
   * Actualizar producto
   */
  async updateProduct(
    id: number,
    productData: UpdateProductInput
  ): Promise<ProductResponse> {
    // Verificar si el producto existe
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      throw new Error("Producto no encontrado");
    }

    // Si se está actualizando el SKU, verificar que no exista
    if (productData.sku && productData.sku !== existingProduct.sku) {
      const skuExists = await prisma.product.findUnique({
        where: { sku: productData.sku },
      });

      if (skuExists) {
        throw new Error("El SKU ya está registrado");
      }
    }

    // Actualizar producto
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: productData,
    });

    return this.mapToProductResponse(updatedProduct);
  }

  /**
   * Eliminar producto (soft delete)
   */
  async deleteProduct(id: number): Promise<void> {
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      throw new Error("Producto no encontrado");
    }

    // Soft delete - marcar como inactivo
    await prisma.product.update({
      where: { id },
      data: { isActive: false },
    });
  }

  /**
   * Actualizar stock de producto
   */
  async updateStock(id: number, quantity: number): Promise<ProductResponse> {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new Error("Producto no encontrado");
    }

    const newStock = product.stock + quantity;

    if (newStock < 0) {
      throw new Error("Stock insuficiente");
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: { stock: newStock },
    });

    return this.mapToProductResponse(updatedProduct);
  }

  /**
   * Verificar disponibilidad de stock
   */
  async checkStock(id: number, quantity: number): Promise<boolean> {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product || !product.isActive) {
      return false;
    }

    return product.stock >= quantity;
  }

  /**
   * Obtener categorías disponibles
   */
  async getCategories(): Promise<string[]> {
    const categories = await prisma.product.findMany({
      where: { isActive: true },
      select: { category: true },
      distinct: ["category"],
    });

    return categories.map((cat: any) => cat.category);
  }

  /**
   * Obtener marcas disponibles
   */
  async getBrands(): Promise<string[]> {
    const brands = await prisma.product.findMany({
      where: {
        isActive: true,
        brand: { not: null },
      },
      select: { brand: true },
      distinct: ["brand"],
    });

    return brands.map((brand: any) => brand.brand!).filter(Boolean);
  }

  /**
   * Mapear Product de Prisma a ProductResponse
   */
  private mapToProductResponse(product: Product): ProductResponse {
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      sku: product.sku,
      category: product.category,
      brand: product.brand,
      images: product.images as string[],
      isActive: product.isActive,
      isFeatured: product.isFeatured,
      weight: product.weight,
      dimensions: product.dimensions,
      tags: product.tags as string[],
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }
}
