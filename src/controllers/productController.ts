import { Request, Response } from "express";
import { ProductService } from "../services/productService";
import {
  CreateProductInput,
  UpdateProductInput,
  UpdateStockInput,
  ProductFiltersInput,
} from "../schemas/productSchemas";
import { PaginationInput } from "../schemas/userSchemas";

const productService = new ProductService();

export class ProductController {
  /**
   * Crear un nuevo producto
   * POST /api/products
   */
  async createProduct(req: Request, res: Response): Promise<void> {
    try {
      const productData: CreateProductInput = req.body;
      const product = await productService.createProduct(productData);

      res.status(201).json({
        success: true,
        message: "Producto creado exitosamente",
        data: product,
      });
    } catch (error) {
      console.error("Error al crear producto:", error);

      if (error instanceof Error) {
        if (error.message.includes("SKU ya existe")) {
          res.status(409).json({
            success: false,
            message: error.message,
          });
          return;
        }
      }

      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
      });
    }
  }

  /**
   * Obtener producto por ID
   * GET /api/products/:id
   */
  async getProductById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const productId = parseInt(id, 10);

      if (isNaN(productId)) {
        res.status(400).json({
          success: false,
          message: "ID de producto inválido",
        });
        return;
      }

      const product = await productService.getProductById(productId);

      if (!product) {
        res.status(404).json({
          success: false,
          message: "Producto no encontrado",
        });
        return;
      }

      res.json({
        success: true,
        data: product,
      });
    } catch (error) {
      console.error("Error al obtener producto:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
      });
    }
  }

  /**
   * Obtener producto por SKU
   * GET /api/products/sku/:sku
   */
  async getProductBySku(req: Request, res: Response): Promise<void> {
    try {
      const { sku } = req.params;

      const product = await productService.getProductBySku(sku);

      if (!product) {
        res.status(404).json({
          success: false,
          message: "Producto no encontrado",
        });
        return;
      }

      res.json({
        success: true,
        data: product,
      });
    } catch (error) {
      console.error("Error al obtener producto por SKU:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
      });
    }
  }

  /**
   * Obtener productos con filtros y paginación
   * GET /api/products
   */
  async getProducts(req: Request, res: Response): Promise<void> {
    try {
      const filters: ProductFiltersInput = req.query as any;
      const pagination: PaginationInput = req.query as any;

      const result = await productService.getProducts(filters, pagination);

      res.json({
        success: true,
        ...result,
      });
    } catch (error) {
      console.error("Error al obtener productos:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
      });
    }
  }

  /**
   * Obtener productos destacados
   * GET /api/products/featured
   */
  async getFeaturedProducts(req: Request, res: Response): Promise<void> {
    try {
      const { limit } = req.query;
      const limitNumber = limit ? parseInt(limit as string, 10) : 10;

      const products = await productService.getFeaturedProducts(limitNumber);

      res.json({
        success: true,
        data: products,
      });
    } catch (error) {
      console.error("Error al obtener productos destacados:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
      });
    }
  }

  /**
   * Obtener productos por categoría
   * GET /api/products/category/:category
   */
  async getProductsByCategory(req: Request, res: Response): Promise<void> {
    try {
      const { category } = req.params;
      const pagination: PaginationInput = req.query as any;

      const result = await productService.getProductsByCategory(
        category,
        pagination
      );

      res.json({
        success: true,
        ...result,
      });
    } catch (error) {
      console.error("Error al obtener productos por categoría:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
      });
    }
  }

  /**
   * Actualizar producto
   * PUT /api/products/:id
   */
  async updateProduct(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const productId = parseInt(id, 10);

      if (isNaN(productId)) {
        res.status(400).json({
          success: false,
          message: "ID de producto inválido",
        });
        return;
      }

      const productData: UpdateProductInput = req.body;
      const product = await productService.updateProduct(
        productId,
        productData
      );

      res.json({
        success: true,
        message: "Producto actualizado exitosamente",
        data: product,
      });
    } catch (error) {
      console.error("Error al actualizar producto:", error);

      if (error instanceof Error) {
        if (error.message.includes("no encontrado")) {
          res.status(404).json({
            success: false,
            message: error.message,
          });
          return;
        }

        if (error.message.includes("SKU ya existe")) {
          res.status(409).json({
            success: false,
            message: error.message,
          });
          return;
        }
      }

      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
      });
    }
  }

  /**
   * Eliminar producto (soft delete)
   * DELETE /api/products/:id
   */
  async deleteProduct(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const productId = parseInt(id, 10);

      if (isNaN(productId)) {
        res.status(400).json({
          success: false,
          message: "ID de producto inválido",
        });
        return;
      }

      await productService.deleteProduct(productId);

      res.json({
        success: true,
        message: "Producto eliminado exitosamente",
      });
    } catch (error) {
      console.error("Error al eliminar producto:", error);

      if (error instanceof Error && error.message.includes("no encontrado")) {
        res.status(404).json({
          success: false,
          message: error.message,
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
      });
    }
  }

  /**
   * Actualizar stock de producto
   * PATCH /api/products/:id/stock
   */
  async updateStock(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const productId = parseInt(id, 10);

      if (isNaN(productId)) {
        res.status(400).json({
          success: false,
          message: "ID de producto inválido",
        });
        return;
      }

      const { stock }: UpdateStockInput = req.body;
      const product = await productService.updateStock(productId, stock);

      res.json({
        success: true,
        message: "Stock actualizado exitosamente",
        data: product,
      });
    } catch (error) {
      console.error("Error al actualizar stock:", error);

      if (error instanceof Error && error.message.includes("no encontrado")) {
        res.status(404).json({
          success: false,
          message: error.message,
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
      });
    }
  }

  /**
   * Verificar disponibilidad de stock
   * GET /api/products/:id/stock/:quantity
   */
  async checkStock(req: Request, res: Response): Promise<void> {
    try {
      const { id, quantity } = req.params;
      const productId = parseInt(id, 10);
      const quantityNumber = parseInt(quantity, 10);

      if (isNaN(productId) || isNaN(quantityNumber)) {
        res.status(400).json({
          success: false,
          message: "Parámetros inválidos",
        });
        return;
      }

      const isAvailable = await productService.checkStock(
        productId,
        quantityNumber
      );

      res.json({
        success: true,
        data: {
          productId,
          quantity: quantityNumber,
          available: isAvailable,
        },
      });
    } catch (error) {
      console.error("Error al verificar stock:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
      });
    }
  }

  /**
   * Obtener categorías únicas
   * GET /api/products/categories
   */
  async getCategories(req: Request, res: Response): Promise<void> {
    try {
      const categories = await productService.getCategories();

      res.json({
        success: true,
        data: categories,
      });
    } catch (error) {
      console.error("Error al obtener categorías:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
      });
    }
  }

  /**
   * Obtener marcas únicas
   * GET /api/products/brands
   */
  async getBrands(req: Request, res: Response): Promise<void> {
    try {
      const brands = await productService.getBrands();

      res.json({
        success: true,
        data: brands,
      });
    } catch (error) {
      console.error("Error al obtener marcas:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
      });
    }
  }
}
