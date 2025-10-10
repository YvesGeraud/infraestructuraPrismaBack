import { z } from "zod";

/**
 * 🔄 SCHEMAS PARA OPERACIONES TRANSACCIONALES COMPLEJAS
 *
 * Este archivo contiene validaciones para operaciones que:
 * - Afectan múltiples tablas
 * - Requieren transacciones
 * - No pertenecen a un solo modelo/tabla
 *
 * Ejemplos: Transferencias, importaciones masivas, operaciones compuestas
 */

//? ===== TRANSFERENCIA DE LOCALIDADES =====

/**
 * Schema para transferir múltiples localidades a otro municipio
 *
 * Caso de uso:
 * - Usuario selecciona localidades [1, 10, 150, 1600]
 * - Las transfiere al municipio 2
 * - Se registra en bitácora cada cambio
 * - TODO en una transacción (atomicidad garantizada)
 */
export const transferirLocalidadesSchema = z.object({
  idsLocalidades: z
    .array(z.number().int().positive())
    .min(1, "Debe seleccionar al menos una localidad")
    .max(1000, "No puede transferir más de 1000 localidades a la vez"),

  idMunicipioDestino: z.number().int().positive("ID de municipio inválido"),

  observaciones: z
    .string()
    .min(10, "Las observaciones deben tener al menos 10 caracteres")
    .max(500, "Las observaciones no pueden exceder 500 caracteres")
    .optional(),
});

export type TransferirLocalidadesInput = z.infer<
  typeof transferirLocalidadesSchema
>;

//? ===== IMPORTACIÓN MASIVA GEOGRÁFICA =====

/**
 * Schema para importar estructura geográfica completa
 * Entidad → Municipios → Localidades en una sola operación
 */
export const importarEstructuraGeograficaSchema = z.object({
  entidad: z.object({
    nombre: z.string().min(3).max(100),
    abreviatura: z.string().min(2).max(10),
  }),

  municipios: z
    .array(
      z.object({
        cve_mun: z.string().length(3),
        nombre: z.string().min(3).max(100),
        localidades: z
          .array(
            z.object({
              nombre: z.string().min(3).max(150),
              ambito: z.enum(["U", "R"]),
            })
          )
          .optional()
          .default([]),
      })
    )
    .min(1, "Debe proporcionar al menos un municipio"),

  idUsuario: z.number().int().positive(),
});

export type ImportarEstructuraGeograficaInput = z.infer<
  typeof importarEstructuraGeograficaSchema
>;

//? ===== ACTUALIZACIÓN MASIVA =====

/**
 * Schema para actualizar múltiples registros de cualquier tabla
 * Útil para cambios coordinados
 */
export const actualizacionMasivaSchema = z.object({
  // 💡 Para agregar más tablas, agrégalas aquí y en el switch del servicio
  tabla: z.enum(["LOCALIDAD", "MUNICIPIO", "ENTIDAD"], {
    message: "Tabla no válida para actualización masiva",
  }),

  ids: z
    .array(z.number().int().positive())
    .min(1, "Debe proporcionar al menos un ID")
    .max(1000, "No puede actualizar más de 1000 registros a la vez"),

  cambios: z
    .record(z.string(), z.any())
    .refine((data) => Object.keys(data).length > 0, {
      message: "Debe proporcionar al menos un campo a actualizar",
    }),

  observaciones: z.string().max(500).optional(),
});

export type ActualizacionMasivaInput = z.infer<
  typeof actualizacionMasivaSchema
>;

/*
📝 PATRÓN DE USO:

✅ CUÁNDO USAR ESTOS SCHEMAS:
- Operaciones que afectan múltiples tablas
- Operaciones que requieren transacciones
- Importaciones/exportaciones masivas
- Transferencias entre entidades

❌ CUÁNDO NO USAR:
- CRUD simple de una tabla (usa el schema específico de la tabla)
- Consultas de solo lectura

🏗️ ARQUITECTURA:
schemas/transacciones.schema.ts     ← Validaciones (este archivo)
services/transacciones.service.ts   ← Lógica + Transacciones
controllers/transacciones.controller.ts ← Endpoints
routes/transacciones.routes.ts      ← Rutas

🎯 BENEFICIOS:
- Servicios por tabla se mantienen simples
- Operaciones complejas centralizadas
- Fácil de encontrar y mantener
- Ejemplos claros para el equipo
*/
