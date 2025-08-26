import { Router } from "express";
import { ProductController } from "../controllers/productController";
import { validateRequest } from "../middleware/validateRequest";
import { asyncHandler } from "../middleware/errorHandler";
import {
  verificarAutenticacion,
  verificarAdmin,
  autenticacionOpcional,
} from "../middleware/authMiddleware";
import {
  createProductSchema,
  updateProductSchema,
  updateStockSchema,
  productFiltersSchema,
  paginationSchema,
  skuParamSchema,
  categoryParamSchema,
  stockCheckSchema,
} from "../schemas/productSchemas";

const router = Router();
const productController = new ProductController();

/**
 * @route   POST /api/products
 * @desc    Crear un nuevo producto
 * @access  Private (Admin)
 */
router.post(
  "/",
  verificarAutenticacion,
  verificarAdmin,
  validateRequest({
    body: createProductSchema,
  }),
  asyncHandler(productController.createProduct.bind(productController))
);

/**
 * @route   GET /api/products/featured
 * @desc    Obtener productos destacados
 * @access  Public
 */
router.get(
  "/featured",
  asyncHandler(productController.getFeaturedProducts.bind(productController))
);

/**
 * @route   GET /api/products/categories
 * @desc    Obtener categorías únicas
 * @access  Public
 */
router.get(
  "/categories",
  asyncHandler(productController.getCategories.bind(productController))
);

/**
 * @route   GET /api/products/brands
 * @desc    Obtener marcas únicas
 * @access  Public
 */
router.get(
  "/brands",
  asyncHandler(productController.getBrands.bind(productController))
);

/**
 * @route   GET /api/products/sku/:sku
 * @desc    Obtener producto por SKU
 * @access  Public
 */
router.get(
  "/sku/:sku",
  validateRequest({
    params: skuParamSchema,
  }),
  asyncHandler(productController.getProductBySku.bind(productController))
);

/**
 * @route   GET /api/products/category/:category
 * @desc    Obtener productos por categoría
 * @access  Public
 */
router.get(
  "/category/:category",
  validateRequest({
    params: categoryParamSchema,
    query: paginationSchema,
  }),
  asyncHandler(productController.getProductsByCategory.bind(productController))
);

/**
 * @route   GET /api/products/:id/stock/:quantity
 * @desc    Verificar disponibilidad de stock
 * @access  Public
 */
router.get(
  "/:id/stock/:quantity",
  validateRequest({
    params: stockCheckSchema,
  }),
  asyncHandler(productController.checkStock.bind(productController))
);

/**
 * @route   GET /api/products/:id
 * @desc    Obtener producto por ID
 * @access  Public
 */
router.get(
  "/:id",
  asyncHandler(productController.getProductById.bind(productController))
);

/**
 * @route   GET /api/products
 * @desc    Obtener productos con filtros y paginación
 * @access  Public
 *
 * @query   search - Búsqueda en tiempo real en: nombre, descripción, SKU, categoría, marca
 * @query   category - Filtrar por categoría específica
 * @query   brand - Filtrar por marca específica
 * @query   minPrice - Precio mínimo (número)
 * @query   maxPrice - Precio máximo (número)
 * @query   isActive - Filtrar por estado activo (true/false)
 * @query   isFeatured - Filtrar productos destacados (true/false)
 * @query   page - Número de página (default: 1)
 * @query   limit - Productos por página (default: 10)
 *
 * @example GET /api/products?search=laptop&category=electronics&minPrice=500&page=1&limit=20
 * @example GET /api/products?brand=apple&isActive=true&isFeatured=true
 * @example GET /api/products?search=gaming&maxPrice=1000&page=2
 */
router.get(
  "/",
  validateRequest({
    query: productFiltersSchema.merge(paginationSchema),
  }),
  asyncHandler(productController.getProducts.bind(productController))
);

/**
 * @route   PUT /api/products/:id
 * @desc    Actualizar producto
 * @access  Private (Admin)
 */
router.put(
  "/:id",
  verificarAutenticacion,
  verificarAdmin,
  validateRequest({
    body: updateProductSchema,
  }),
  asyncHandler(productController.updateProduct.bind(productController))
);

/**
 * @route   PATCH /api/products/:id/stock
 * @desc    Actualizar stock de producto
 * @access  Private (Admin)
 */
router.patch(
  "/:id/stock",
  verificarAutenticacion,
  verificarAdmin,
  validateRequest({
    body: updateStockSchema,
  }),
  asyncHandler(productController.updateStock.bind(productController))
);

/**
 * @route   DELETE /api/products/:id
 * @desc    Eliminar producto (soft delete)
 * @access  Private (Admin)
 */
router.delete(
  "/:id",
  verificarAutenticacion,
  verificarAdmin,
  asyncHandler(productController.deleteProduct.bind(productController))
);

export default router;
