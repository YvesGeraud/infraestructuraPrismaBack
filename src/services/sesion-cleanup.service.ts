/**
 * @fileoverview Servicio de Limpieza Automática de Sesiones
 *
 * Limpia sesiones expiradas y gestiona la seguridad de sesiones activas.
 * Se ejecuta automáticamente cada hora para mantener la BD limpia.
 */

import { prisma } from "../config/database";
import * as cron from "node-cron";

export class SesionCleanupService {
  private static tareaLimpieza: cron.ScheduledTask | null = null;

  /**
   * 🧹 LIMPIAR SESIONES EXPIRADAS
   *
   * Marca como inactivas todas las sesiones cuya fecha de expiración ya pasó
   */
  static async limpiarSesionesExpiradas(): Promise<{
    sesionesLimpiadas: number;
  }> {
    const ahora = new Date();

    try {
      const resultado = await prisma.ct_sesion.updateMany({
        where: {
          activa: true,
          fecha_expiracion: {
            lt: ahora, // Menor que (less than) la fecha actual
          },
        },
        data: {
          activa: false,
        },
      });

      if (resultado.count > 0) {
        console.log(
          `🧹 Limpieza automática: ${resultado.count} sesiones expiradas marcadas como inactivas`
        );
      }

      return {
        sesionesLimpiadas: resultado.count,
      };
    } catch (error) {
      console.error("❌ Error al limpiar sesiones expiradas:", error);
      throw error;
    }
  }

  /**
   * 🗑️ ELIMINAR SESIONES ANTIGUAS (FÍSICAMENTE)
   *
   * Elimina físicamente de la BD las sesiones inactivas más antiguas de X días
   * Recomendado: 30 días para auditoría
   */
  static async eliminarSesionesAntiguas(diasAntiguedad: number = 30): Promise<{
    sesionesEliminadas: number;
  }> {
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() - diasAntiguedad);

    try {
      const resultado = await prisma.ct_sesion.deleteMany({
        where: {
          activa: false,
          fecha_expiracion: {
            lt: fechaLimite,
          },
        },
      });

      if (resultado.count > 0) {
        console.log(
          `🗑️  Limpieza profunda: ${resultado.count} sesiones antiguas eliminadas de la BD`
        );
      }

      return {
        sesionesEliminadas: resultado.count,
      };
    } catch (error) {
      console.error("❌ Error al eliminar sesiones antiguas:", error);
      throw error;
    }
  }

  /**
   * 🔒 LIMITAR SESIONES ACTIVAS POR USUARIO
   *
   * Si un usuario tiene más de X sesiones activas, cierra las más antiguas
   * Previene acumulación excesiva de sesiones
   */
  static async limitarSesionesPorUsuario(maxSesiones: number = 5): Promise<{
    usuariosLimitados: number;
    sesionesLimpiadas: number;
  }> {
    try {
      // Obtener usuarios con más sesiones activas del límite
      const usuariosConMuchasSesiones = await prisma.ct_sesion.groupBy({
        by: ["id_ct_usuario"],
        where: {
          activa: true,
        },
        _count: {
          id_ct_sesion: true,
        },
        having: {
          id_ct_sesion: {
            _count: {
              gt: maxSesiones,
            },
          },
        },
      });

      let sesionesLimpiadas = 0;

      // Para cada usuario con exceso de sesiones
      for (const usuario of usuariosConMuchasSesiones) {
        // Obtener todas sus sesiones activas ordenadas por fecha de uso
        const sesiones = await prisma.ct_sesion.findMany({
          where: {
            id_ct_usuario: usuario.id_ct_usuario,
            activa: true,
          },
          orderBy: {
            fecha_ultimo_uso: "desc", // Más recientes primero
          },
        });

        // Cerrar las sesiones que excedan el límite (las más antiguas)
        const sesionesACerrar = sesiones.slice(maxSesiones);

        if (sesionesACerrar.length > 0) {
          await prisma.ct_sesion.updateMany({
            where: {
              id_ct_sesion: {
                in: sesionesACerrar.map((s) => s.id_ct_sesion),
              },
            },
            data: {
              activa: false,
            },
          });

          sesionesLimpiadas += sesionesACerrar.length;
        }
      }

      if (sesionesLimpiadas > 0) {
        console.log(
          `🔒 Límite de sesiones: ${sesionesLimpiadas} sesiones antiguas cerradas para ${usuariosConMuchasSesiones.length} usuarios`
        );
      }

      return {
        usuariosLimitados: usuariosConMuchasSesiones.length,
        sesionesLimpiadas,
      };
    } catch (error) {
      console.error("❌ Error al limitar sesiones por usuario:", error);
      throw error;
    }
  }

  /**
   * 🔄 EJECUTAR LIMPIEZA COMPLETA
   *
   * Ejecuta todas las tareas de limpieza en secuencia
   */
  static async ejecutarLimpiezaCompleta(): Promise<{
    sesionesExpiradas: number;
    sesionesAntiguas: number;
    usuariosLimitados: number;
    sesionesLimitadas: number;
  }> {
    console.log("\n🔄 Iniciando limpieza automática de sesiones...");

    const resultadoExpiracion = await this.limpiarSesionesExpiradas();
    const resultadoAntiguas = await this.eliminarSesionesAntiguas(30);
    const resultadoLimite = await this.limitarSesionesPorUsuario(5);

    console.log("✅ Limpieza completa finalizada\n");

    return {
      sesionesExpiradas: resultadoExpiracion.sesionesLimpiadas,
      sesionesAntiguas: resultadoAntiguas.sesionesEliminadas,
      usuariosLimitados: resultadoLimite.usuariosLimitados,
      sesionesLimitadas: resultadoLimite.sesionesLimpiadas,
    };
  }

  /**
   * ⏰ INICIAR LIMPIEZA AUTOMÁTICA (CRON JOB)
   *
   * Ejecuta la limpieza automáticamente cada hora
   * Cron: "0 * * * *" = A la hora en punto de cada hora
   */
  static iniciarLimpiezaAutomatica(): void {
    if (this.tareaLimpieza) {
      console.log("⚠️  Limpieza automática ya está en ejecución");
      return;
    }

    // Ejecutar cada hora (a la hora en punto)
    this.tareaLimpieza = cron.schedule("0 * * * *", async () => {
      await this.ejecutarLimpiezaCompleta();
    });

    console.log("⏰ Limpieza automática de sesiones iniciada (cada hora)");

    // Ejecutar una limpieza inicial al arrancar
    setTimeout(async () => {
      await this.ejecutarLimpiezaCompleta();
    }, 5000); // Esperar 5 segundos después del arranque
  }

  /**
   * 🛑 DETENER LIMPIEZA AUTOMÁTICA
   */
  static detenerLimpiezaAutomatica(): void {
    if (this.tareaLimpieza) {
      this.tareaLimpieza.stop();
      this.tareaLimpieza = null;
      console.log("🛑 Limpieza automática detenida");
    }
  }
}
