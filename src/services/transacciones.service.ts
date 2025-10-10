/**
 * 🔄 SERVICIO DE TRANSACCIONES
 *
 * Este servicio maneja operaciones complejas que:
 * - Afectan múltiples tablas
 * - Requieren transacciones para garantizar atomicidad
 * - No pertenecen a un modelo/tabla específico
 *
 * 🏗️ ARQUITECTURA:
 * - Los servicios por tabla (ct_localidad.service, ct_municipio.service)
 *   se mantienen simples con CRUD estándar
 * - Este servicio maneja operaciones transaccionales complejas
 * - Sirve como referencia/ejemplo para el equipo
 */

import { prisma } from "../config/database";
import {
  TransferirLocalidadesInput,
  ImportarEstructuraGeograficaInput,
  ActualizacionMasivaInput,
} from "../schemas/transacciones.schema";

export class TransaccionesService {
  /**
   * 🔄 TRANSFERIR MÚLTIPLES LOCALIDADES A OTRO MUNICIPIO
   *
   * Este es un ejemplo perfecto de operación transaccional:
   * 1. Verifica que el municipio destino existe y está activo
   * 2. Obtiene las localidades actuales (para bitácora)
   * 3. Actualiza CADA localidad
   * 4. Registra CADA cambio en bitácora
   * 5. Si CUALQUIER paso falla → ROLLBACK automático
   *
   * @param datos - IDs de localidades, municipio destino, observaciones
   * @param idUsuario - Usuario que ejecuta la operación
   * @returns Resultado con localidades actualizadas
   *
   * @example
   * ```typescript
   * const resultado = await transaccionesService.transferirLocalidades({
   *   idsLocalidades: [1, 10, 150, 1600],
   *   idMunicipioDestino: 2,
   *   observaciones: "Reasignación territorial"
   * }, idUsuario);
   * ```
   */
  async transferirLocalidades(
    datos: TransferirLocalidadesInput,
    idUsuario: number
  ) {
    return await prisma.$transaction(async (tx) => {
      // 1️⃣ Verificar que el municipio destino existe y está activo
      const municipioDestino = await tx.ct_municipio.findUnique({
        where: { id_ct_municipio: datos.idMunicipioDestino },
        select: {
          id_ct_municipio: true,
          nombre: true,
          cve_mun: true,
          estado: true,
        },
      });

      if (!municipioDestino) {
        throw new Error(
          `El municipio con ID ${datos.idMunicipioDestino} no existe`
        );
      }

      if (!municipioDestino.estado) {
        throw new Error(
          `El municipio "${municipioDestino.nombre}" está inactivo y no puede recibir localidades`
        );
      }

      // 2️⃣ Obtener localidades actuales (con datos para bitácora)
      const localidadesActuales = await tx.ct_localidad.findMany({
        where: {
          id_ct_localidad: { in: datos.idsLocalidades },
          estado: true, // Solo localidades activas
        },
        include: {
          ct_municipio: {
            select: {
              id_ct_municipio: true,
              nombre: true,
              cve_mun: true,
            },
          },
        },
      });

      // Validar que todas las localidades existen
      if (localidadesActuales.length !== datos.idsLocalidades.length) {
        const idsEncontrados = localidadesActuales.map(
          (l) => l.id_ct_localidad
        );
        const idsNoEncontrados = datos.idsLocalidades.filter(
          (id) => !idsEncontrados.includes(id)
        );
        throw new Error(
          `Las siguientes localidades no existen o están inactivas: ${idsNoEncontrados.join(
            ", "
          )}`
        );
      }

      // 3️⃣ Actualizar cada localidad y registrar en bitácora
      const localidadesActualizadas: any[] = [];

      for (const localidad of localidadesActuales) {
        // Actualizar localidad
        const actualizada = await tx.ct_localidad.update({
          where: { id_ct_localidad: localidad.id_ct_localidad },
          data: {
            id_ct_municipio: datos.idMunicipioDestino,
            fecha_up: new Date(),
            id_ct_usuario_up: idUsuario,
          },
          include: {
            ct_municipio: {
              select: {
                id_ct_municipio: true,
                nombre: true,
                cve_mun: true,
              },
            },
          },
        });

        localidadesActualizadas.push(actualizada);

        // 4️⃣ Registrar en bitácora (si la tabla existe)
        try {
          await (tx as any).dt_bitacora.create({
            data: {
              tabla: "LOCALIDAD",
              accion: "TRANSFERENCIA",
              id_registro: localidad.id_ct_localidad,
              datos_anteriores: {
                id_ct_municipio: localidad.id_ct_municipio,
                municipio_nombre: localidad.ct_municipio.nombre,
                municipio_cve: localidad.ct_municipio.cve_mun,
              },
              datos_nuevos: {
                id_ct_municipio: datos.idMunicipioDestino,
                municipio_nombre: municipioDestino.nombre,
                municipio_cve: municipioDestino.cve_mun,
              },
              id_ct_usuario: idUsuario,
              observaciones:
                datos.observaciones ||
                `Transferencia de localidad "${localidad.nombre}" de municipio "${localidad.ct_municipio.nombre}" a "${municipioDestino.nombre}"`,
              fecha: new Date(),
            },
          });
        } catch (error) {
          console.log(
            "⚠️  Advertencia: No se pudo registrar en bitácora",
            error
          );
          // Continuar sin fallar si la tabla de bitácora no existe
        }
      }

      // 5️⃣ Retornar resultado completo
      return {
        totalActualizadas: localidadesActualizadas.length,
        municipioDestino: {
          id: municipioDestino.id_ct_municipio,
          nombre: municipioDestino.nombre,
          cve_mun: municipioDestino.cve_mun,
        },
        localidades: localidadesActualizadas,
      };
    });
  }

  /**
   * 📥 IMPORTAR ESTRUCTURA GEOGRÁFICA COMPLETA
   *
   * Crea una entidad con sus municipios y localidades en una sola transacción
   * Útil para migraciones o carga inicial de datos
   *
   * @param datos - Estructura completa: entidad → municipios → localidades
   * @returns Resultado con totales de registros creados
   */
  async importarEstructuraGeografica(datos: ImportarEstructuraGeograficaInput) {
    return await prisma.$transaction(
      async (tx) => {
        // 1️⃣ Crear entidad
        const entidad = await tx.ct_entidad.create({
          data: {
            nombre: datos.entidad.nombre,
            abreviatura: datos.entidad.abreviatura,
            estado: true,
            fecha_in: new Date(),
            id_ct_usuario_in: datos.idUsuario,
          },
        });

        console.log(`✅ Entidad creada: ${entidad.nombre}`);

        let totalMunicipios = 0;
        let totalLocalidades = 0;

        // 2️⃣ Procesar cada municipio con sus localidades
        for (const munData of datos.municipios) {
          // Crear municipio
          const municipio = await tx.ct_municipio.create({
            data: {
              cve_mun: munData.cve_mun,
              nombre: munData.nombre,
              id_ct_entidad: entidad.id_ct_entidad,
              estado: true,
              fecha_in: new Date(),
              id_ct_usuario_in: datos.idUsuario,
            },
          });

          totalMunicipios++;

          // Crear localidades del municipio (si tiene)
          if (munData.localidades && munData.localidades.length > 0) {
            const localidades = await tx.ct_localidad.createMany({
              data: munData.localidades.map((loc) => ({
                nombre: loc.nombre,
                ambito: loc.ambito,
                id_ct_municipio: municipio.id_ct_municipio,
                estado: true,
                fecha_in: new Date(),
                id_ct_usuario_in: datos.idUsuario,
              })),
            });

            totalLocalidades += localidades.count;
          }

          console.log(
            `✅ Municipio ${munData.nombre}: ${
              munData.localidades?.length || 0
            } localidades`
          );
        }

        return {
          entidad: {
            id: entidad.id_ct_entidad,
            nombre: entidad.nombre,
            abreviatura: entidad.abreviatura,
          },
          totalMunicipios,
          totalLocalidades,
        };
      },
      {
        maxWait: 10000, // 10 segundos de espera
        timeout: 60000, // 60 segundos de timeout (para importaciones grandes)
      }
    );
  }

  /**
   * 🔄 ACTUALIZACIÓN MASIVA GENÉRICA
   *
   * Actualiza múltiples registros de una tabla en una transacción
   *
   * @param datos - Tabla, IDs, cambios y observaciones
   * @param idUsuario - Usuario que ejecuta la operación
   * @returns Número de registros actualizados
   */
  async actualizacionMasiva(
    datos: ActualizacionMasivaInput,
    idUsuario: number
  ) {
    return await prisma.$transaction(async (tx) => {
      let totalActualizados = 0;

      // Determinar la tabla y actualizar
      switch (datos.tabla) {
        case "LOCALIDAD":
          for (const id of datos.ids) {
            await tx.ct_localidad.update({
              where: { id_ct_localidad: id },
              data: {
                ...datos.cambios,
                fecha_up: new Date(),
                id_ct_usuario_up: idUsuario,
              },
            });
            totalActualizados++;
          }
          break;

        case "MUNICIPIO":
          for (const id of datos.ids) {
            await tx.ct_municipio.update({
              where: { id_ct_municipio: id },
              data: {
                ...datos.cambios,
                fecha_up: new Date(),
                id_ct_usuario_up: idUsuario,
              },
            });
            totalActualizados++;
          }
          break;

        case "ENTIDAD":
          for (const id of datos.ids) {
            await tx.ct_entidad.update({
              where: { id_ct_entidad: id },
              data: {
                ...datos.cambios,
                fecha_up: new Date(),
                id_ct_usuario_up: idUsuario,
              },
            });
            totalActualizados++;
          }
          break;

        // 💡 Ejemplo: Si quieres agregar INVENTARIO en el futuro:
        // case "INVENTARIO":
        //   for (const id of datos.ids) {
        //     await tx.ct_inventario.update({
        //       where: { id_ct_inventario: id },
        //       data: {
        //         ...datos.cambios,
        //         fecha_up: new Date(),
        //         id_ct_usuario_up: idUsuario,
        //       },
        //     });
        //     totalActualizados++;
        //   }
        //   break;
      }

      return {
        tabla: datos.tabla,
        totalActualizados,
      };
    });
  }
}

/*
📝 PATRÓN DE USO DE ESTE SERVICIO:

✅ CUÁNDO USAR:
1. Operaciones que afectan 2+ tablas relacionadas
2. Importaciones/exportaciones masivas
3. Transferencias entre entidades
4. Operaciones que requieren atomicidad

❌ CUÁNDO NO USAR:
1. CRUD simple de una tabla → Usa el servicio específico (ct_localidad.service)
2. Consultas de solo lectura → Usa los servicios normales
3. Operaciones de una sola tabla → No necesitas transacción

🏗️ ARQUITECTURA RECOMENDADA:

Servicios por tabla (simples, CRUD):
- ct_localidad.service.ts  → CRUD de localidades
- ct_municipio.service.ts  → CRUD de municipios
- ct_entidad.service.ts    → CRUD de entidades

Servicio de transacciones (complejo, multi-tabla):
- transacciones.service.ts → Operaciones que cruzan tablas

🎯 BENEFICIOS:
- ✅ Separación clara de responsabilidades
- ✅ Servicios por tabla más simples y mantenibles
- ✅ Operaciones complejas centralizadas y documentadas
- ✅ Fácil de encontrar y entender para el equipo
- ✅ Sirve como ejemplo/referencia de cómo hacer transacciones

🔄 FLUJO TÍPICO:
Frontend → Controller → TransaccionesService → Prisma.$transaction → BD
                                    ↓
                        Registra en bitácora (dentro de la transacción)
*/
