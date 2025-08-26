import { Request, Response } from "express";
import { BaseController } from "./BaseController";
import {
  realizarDiagnosticoSistema,
  obtenerInfoUsuarioSistema,
  mostrarDiagnosticoCompleto,
} from "../utils/diagnosticoSistema";
import logger from "../config/logger";

export class DiagnosticoController extends BaseController {
  /**
   * Obtener diagnóstico completo del sistema
   */
  async obtenerDiagnostico(req: Request, res: Response): Promise<void> {
    await this.manejarOperacion(
      req,
      res,
      async () => {
        const diagnostico = realizarDiagnosticoSistema();

        // Log para debugging
        logger.info("Diagnóstico del sistema solicitado", {
          usuario: req.usuario?.email || "anónimo",
          uid: diagnostico.usuario.uid,
          permisos: diagnostico.permisos,
        });

        return diagnostico;
      },
      "Diagnóstico del sistema obtenido exitosamente"
    );
  }

  /**
   * Obtener solo información del usuario actual
   */
  async obtenerInfoUsuario(req: Request, res: Response): Promise<void> {
    await this.manejarOperacion(
      req,
      res,
      async () => {
        const infoUsuario = obtenerInfoUsuarioSistema();

        logger.info("Información de usuario solicitada", {
          solicitadoPor: req.usuario?.email || "anónimo",
          uid: infoUsuario.uid,
          plataforma: infoUsuario.plataforma,
        });

        return infoUsuario;
      },
      "Información del usuario obtenida exitosamente"
    );
  }

  /**
   * Verificar permisos específicos (solo para administradores)
   */
  async verificarPermisos(req: Request, res: Response): Promise<void> {
    await this.manejarOperacion(
      req,
      res,
      async () => {
        // Solo administradores pueden ver información sensible
        if (req.usuario?.role !== "ADMIN") {
          throw new Error(
            "Solo los administradores pueden acceder a esta información"
          );
        }

        const diagnostico = realizarDiagnosticoSistema();

        // Mostrar diagnóstico completo en consola para debugging
        console.log("\n📋 Diagnóstico solicitado por:", req.usuario.email);
        mostrarDiagnosticoCompleto();

        // Análisis de problemas potenciales
        const problemas = [];

        if (diagnostico.usuario.uid === 0) {
          problemas.push({
            tipo: "SEGURIDAD_CRÍTICA",
            mensaje:
              "La aplicación se está ejecutando como root. Esto es un riesgo de seguridad.",
            solucion:
              "Crear un usuario específico para la aplicación y cambiar los permisos.",
          });
        }

        if (!diagnostico.permisos.directorioUploads) {
          problemas.push({
            tipo: "PERMISOS",
            mensaje: "No se puede escribir en el directorio de uploads.",
            solucion:
              "Verificar que el directorio existe y tiene permisos de escritura.",
          });
        }

        if (!diagnostico.permisos.puedeEscribirLogs) {
          problemas.push({
            tipo: "LOGGING",
            mensaje: "No se puede escribir archivos de log.",
            solucion: "Verificar permisos del directorio de logs.",
          });
        }

        if (diagnostico.proceso.memoriaUsada > 512) {
          problemas.push({
            tipo: "RENDIMIENTO",
            mensaje: `Alto uso de memoria: ${diagnostico.proceso.memoriaUsada} MB`,
            solucion: "Considerar optimización o aumento de recursos.",
          });
        }

        return {
          ...diagnostico,
          problemas,
          recomendaciones: generarRecomendaciones(diagnostico),
        };
      },
      "Verificación de permisos completada"
    );
  }
}

/**
 * Genera recomendaciones basadas en el diagnóstico
 */
const generarRecomendaciones = (diagnostico: any) => {
  const recomendaciones = [];

  // Recomendaciones de seguridad
  if (diagnostico.usuario.uid === 0) {
    recomendaciones.push({
      categoria: "Seguridad",
      prioridad: "ALTA",
      descripcion: "Ejecutar la aplicación con un usuario no-root",
      comandos: [
        "sudo useradd -r -s /bin/false cedex-app",
        "sudo chown -R cedex-app:cedex-app /ruta/a/tu/app",
        "sudo -u cedex-app node src/app.js",
      ],
    });
  }

  // Recomendaciones de permisos
  if (!diagnostico.permisos.directorioUploads) {
    recomendaciones.push({
      categoria: "Permisos",
      prioridad: "MEDIA",
      descripcion: "Configurar permisos para directorio de uploads",
      comandos: [
        "mkdir -p uploads",
        "chmod 755 uploads",
        "chown usuario:grupo uploads",
      ],
    });
  }

  // Recomendaciones de rendimiento
  if (diagnostico.proceso.memoriaUsada > 512) {
    recomendaciones.push({
      categoria: "Rendimiento",
      prioridad: "MEDIA",
      descripcion: "Monitorear y optimizar uso de memoria",
      comandos: [
        "node --max-old-space-size=1024 src/app.js",
        "pm2 start src/app.js --max-memory-restart 1000M",
      ],
    });
  }

  return recomendaciones;
};
