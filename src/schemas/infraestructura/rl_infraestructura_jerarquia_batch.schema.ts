import { z } from "zod";
import {
  esquemaTextoRequerido,
  esquemaNumeroRequerido,
  esquemaNumeroOpcional,
} from "../commonSchemas";

//TODO ===== SCHEMAS PARA BATCH DE JERARQUÍA DE INFRAESTRUCTURA =====

/**
 * 🎯 FLUJO DEL PROCESO DE BATCH DE JERARQUÍA:
 *
 * 1. 🛒 Frontend: Lista de relaciones jerárquicas
 * 2. 🚀 Backend: Transacción atómica
 *    ├─ Validar tipos de instancia existan
 *    ├─ Validar dependencias existan (si se proporcionan)
 *    └─ rl_infraestructura_jerarquia (Múltiples registros)
 *
 * 📊 ESTRUCTURA DE LA JERARQUÍA:
 *
 * La tabla rl_infraestructura_jerarquia relaciona instancias según su nivel:
 *
 * Ejemplo:
 * - Dirección (id_instancia: 1, tipo: 1, id_dependencia: null)
 * - Departamento (id_instancia: 5, tipo: 2, id_dependencia: 1) ← depende de Dirección
 * - Área (id_instancia: 10, tipo: 3, id_dependencia: 5) ← depende de Departamento
 * - Jefe de Sector (id_instancia: 20, tipo: 4, id_dependencia: 10) ← depende de Área
 *
 * NOTA: id_dependencia hace referencia a id_rl_infraestructura_jerarquia (self-reference)
 */

//? ===== ESQUEMA PARA UNA RELACIÓN JERÁRQUICA INDIVIDUAL =====
export const jerarquiaItemSchema = z.object({
  // ID de la instancia específica (ej: ID 5 del jefe de sector)
  id_instancia: esquemaNumeroRequerido(1, 2147483647),

  // Tipo de instancia (ej: 4 = "Jefe de Sector")
  // Debe existir en ct_infraestructura_tipo_instancia
  id_ct_infraestructura_tipo_instancia: esquemaNumeroRequerido(1, 2147483647),

  // ID de la dependencia jerárquica (opcional)
  // Hace referencia a id_rl_infraestructura_jerarquia de otro registro
  // null o undefined para el nivel más alto (ej: Dirección)
  id_dependencia: esquemaNumeroOpcional(1, 2147483647).nullable(),

  // Campos que se agregarán automáticamente en el backend:
  // - estado: true (por defecto)
  // - fecha_in: fecha actual
  // - id_ct_usuario_in: del usuario autenticado
});

//? ===== ESQUEMA PRINCIPAL PARA BATCH DE JERARQUÍA =====
export const crearJerarquiaBatchSchema = z.object({
  // Array de relaciones jerárquicas (mínimo 1, máximo 500 para evitar problemas de rendimiento)
  jerarquias: z
    .array(jerarquiaItemSchema)
    .min(1, "Debe incluir al menos una relación jerárquica")
    .max(500, "No se pueden agregar más de 500 relaciones a la vez"),

  // Observaciones opcionales del proceso batch
  observaciones: z
    .string()
    .max(1000, "Las observaciones no pueden exceder 1000 caracteres")
    .optional()
    .nullable(),
});

//? ===== TIPOS INFERIDOS =====
export type JerarquiaItemInput = z.infer<typeof jerarquiaItemSchema>;
export type CrearJerarquiaBatchInput = z.infer<
  typeof crearJerarquiaBatchSchema
>;

/**
 * 📝 EJEMPLO DE USO:
 *
 * ```typescript
 * const batchJerarquia: CrearJerarquiaBatchInput = {
 *   observaciones: "Carga inicial de estructura organizacional 2024",
 *   jerarquias: [
 *     {
 *       // Dirección (nivel más alto, sin dependencia)
 *       id_instancia: 1, // ID de ct_infraestructura_direccion
 *       id_ct_infraestructura_tipo_instancia: 1, // Tipo "Dirección"
 *       id_dependencia: null, // Nivel más alto
 *     },
 *     {
 *       // Departamento que depende de la Dirección
 *       id_instancia: 5, // ID de ct_infraestructura_departamento
 *       id_ct_infraestructura_tipo_instancia: 2, // Tipo "Departamento"
 *       id_dependencia: null, // Se calculará después de crear la Dirección
 *       // NOTA: Si ya existe, usar el id_rl_infraestructura_jerarquia existente
 *     },
 *     {
 *       // Jefe de Sector que depende del Departamento
 *       id_instancia: 20, // ID de ct_infraestructura_jefe_sector
 *       id_ct_infraestructura_tipo_instancia: 4, // Tipo "Jefe de Sector"
 *       id_dependencia: 5, // ID de rl_infraestructura_jerarquia del Departamento
 *     },
 *   ],
 * };
 * ```
 *
 * 🔍 IMPORTANTE SOBRE id_dependencia:
 *
 * Si estás creando una estructura jerárquica completa desde cero:
 * - Los registros de nivel superior (ej: Dirección) deben tener id_dependencia: null
 * - Los registros de nivel inferior deben referenciar el id_rl_infraestructura_jerarquia
 *   del nivel superior que ya fue creado
 *
 * Si estás agregando a una estructura existente:
 * - Usa el id_rl_infraestructura_jerarquia del registro padre que ya existe
 *
 * 📄 FORMATO DEL REQUEST:
 *
 * Endpoint: POST /api/infraestructura/jerarquia/batch
 * Content-Type: application/json
 *
 * Body:
 * {
 *   "observaciones": "Carga inicial",
 *   "jerarquias": [
 *     {
 *       "id_instancia": 1,
 *       "id_ct_infraestructura_tipo_instancia": 1,
 *       "id_dependencia": null
 *     },
 *     ...
 *   ]
 * }
 */

/*
🎉 SCHEMA PARA BATCH DE JERARQUÍA DE INFRAESTRUCTURA

✅ Características:
- 🔄 Transacción atómica - todo o nada
- 📦 Soporte para múltiples relaciones (1-500)
- 🛡️ Validaciones robustas en cada nivel
- 🔗 Manejo de self-reference (id_dependencia)
- 📝 Observaciones opcionales

🔧 Validaciones incluidas:
- ✅ Mínimo 1 relación, máximo 500
- ✅ Validación de campos requeridos
- ✅ Validación de rangos numéricos
- ✅ id_dependencia opcional (null para nivel superior)

🏗️ Estructura de la transacción:
1. Validar datos de entrada
2. Validar que todos los tipos de instancia existan
3. Validar que las dependencias existan (si se proporcionan)
4. Crear registros en rl_infraestructura_jerarquia
5. Si algo falla, rollback completo

🔍 CÓMO OBTENER LAS RELACIONES JERÁRQUICAS:

Para obtener un jefe de sector con su jerarquía:
```typescript
const jefeSector = await prisma.ct_infraestructura_jefe_sector.findUnique({
  where: { id_ct_infraestructura_jefe_sector: 5 },
  include: {
    // Incluir la relación jerárquica
    rl_infraestructura_jerarquia: {
      include: {
        // Incluir el tipo de instancia
        ct_infraestructura_tipo_instancia: true,
        // Incluir la dependencia (recursivo)
        dependencia: {
          include: {
            ct_infraestructura_tipo_instancia: true,
          },
        },
      },
    },
  },
});
```

Para obtener todas las jerarquías con sus relaciones:
```typescript
const jerarquias = await prisma.rl_infraestructura_jerarquia.findMany({
  include: {
    ct_infraestructura_tipo_instancia: true,
    // Incluir la dependencia si existe
    dependencia: {
      include: {
        ct_infraestructura_tipo_instancia: true,
      },
    },
  },
});
```
*/
