import { z } from "zod";

// Esquemas para validación de productos
export const createProductSchema = z.object({
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(200, "El nombre es demasiado largo")
    .trim(),
  description: z
    .string()
    .max(1000, "La descripción es demasiado larga")
    .optional(),
  price: z
    .number()
    .positive("El precio debe ser mayor a 0")
    .max(999999.99, "El precio es demasiado alto"),
  stock: z
    .number()
    .int("El stock debe ser un número entero")
    .min(0, "El stock no puede ser negativo"),
  sku: z
    .string()
    .min(3, "El SKU debe tener al menos 3 caracteres")
    .max(50, "El SKU es demasiado largo")
    .regex(
      /^[A-Z0-9-_]+$/,
      "El SKU solo puede contener letras mayúsculas, números, guiones y guiones bajos"
    )
    .trim(),
  category: z
    .string()
    .min(2, "La categoría debe tener al menos 2 caracteres")
    .max(100, "La categoría es demasiado larga")
    .trim(),
  brand: z
    .string()
    .min(2, "La marca debe tener al menos 2 caracteres")
    .max(100, "La marca es demasiado larga")
    .trim()
    .optional(),
  images: z
    .array(z.string().url("URL de imagen inválida"))
    .max(10, "Máximo 10 imágenes permitidas")
    .optional(),
  isFeatured: z.boolean().optional().default(false),
  weight: z
    .number()
    .positive("El peso debe ser mayor a 0")
    .max(9999.99, "El peso es demasiado alto")
    .optional(),
  dimensions: z
    .object({
      length: z.number().positive().optional(),
      width: z.number().positive().optional(),
      height: z.number().positive().optional(),
    })
    .optional(),
  tags: z
    .array(z.string().min(1).max(50))
    .max(20, "Máximo 20 tags permitidos")
    .optional(),
});

export const updateProductSchema = z.object({
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(200, "El nombre es demasiado largo")
    .trim()
    .optional(),
  description: z
    .string()
    .max(1000, "La descripción es demasiado larga")
    .optional(),
  price: z
    .number()
    .positive("El precio debe ser mayor a 0")
    .max(999999.99, "El precio es demasiado alto")
    .optional(),
  stock: z
    .number()
    .int("El stock debe ser un número entero")
    .min(0, "El stock no puede ser negativo")
    .optional(),
  sku: z
    .string()
    .min(3, "El SKU debe tener al menos 3 caracteres")
    .max(50, "El SKU es demasiado largo")
    .regex(
      /^[A-Z0-9-_]+$/,
      "El SKU solo puede contener letras mayúsculas, números, guiones y guiones bajos"
    )
    .trim()
    .optional(),
  category: z
    .string()
    .min(2, "La categoría debe tener al menos 2 caracteres")
    .max(100, "La categoría es demasiado larga")
    .trim()
    .optional(),
  brand: z
    .string()
    .min(2, "La marca debe tener al menos 2 caracteres")
    .max(100, "La marca es demasiado larga")
    .trim()
    .optional(),
  images: z
    .array(z.string().url("URL de imagen inválida"))
    .max(10, "Máximo 10 imágenes permitidas")
    .optional(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  weight: z
    .number()
    .positive("El peso debe ser mayor a 0")
    .max(9999.99, "El peso es demasiado alto")
    .optional(),
  dimensions: z
    .object({
      length: z.number().positive().optional(),
      width: z.number().positive().optional(),
      height: z.number().positive().optional(),
    })
    .optional(),
  tags: z
    .array(z.string().min(1).max(50))
    .max(20, "Máximo 20 tags permitidos")
    .optional(),
});

export const updateStockSchema = z.object({
  stock: z
    .number()
    .int("El stock debe ser un número entero")
    .min(0, "El stock no puede ser negativo"),
});

// Esquemas para query parameters
export const productFiltersSchema = z.object({
  category: z.string().optional(),
  brand: z.string().optional(),
  minPrice: z
    .string()
    .transform((val) => parseFloat(val))
    .pipe(z.number().positive())
    .optional(),
  maxPrice: z
    .string()
    .transform((val) => parseFloat(val))
    .pipe(z.number().positive())
    .optional(),
  isActive: z
    .string()
    .transform((val) => val === "true")
    .pipe(z.boolean())
    .optional(),
  isFeatured: z
    .string()
    .transform((val) => val === "true")
    .pipe(z.boolean())
    .optional(),
  search: z.string().optional(),
});

// Tipos inferidos
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type UpdateStockInput = z.infer<typeof updateStockSchema>;
export type ProductFiltersInput = z.infer<typeof productFiltersSchema>;

// Schemas específicos para parámetros de URL
export const skuParamSchema = z.object({
  sku: z.string().min(1, "SKU es requerido"),
});

export const categoryParamSchema = z.object({
  category: z.string().min(1, "Categoría es requerida"),
});

export const stockCheckSchema = z.object({
  id: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().positive()),
  quantity: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().positive()),
});

// Importar schemas comunes para productos
export { paginationSchema, searchSchema } from "./commonSchemas";
