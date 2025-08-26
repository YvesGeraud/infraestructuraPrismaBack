import { Request, Response } from "express";
import { EmailService, EmailData, EmailResult } from "../services/emailService";
import { BaseController } from "./BaseController";
import { plantillasEmail, prioridadesEmail } from "../config/email";
import logger from "../config/logger";

const emailService = new EmailService();

export class EmailController extends BaseController {
  /**
   * Enviar email simple
   */
  async enviarEmail(req: Request, res: Response): Promise<void> {
    await this.manejarOperacion(
      req,
      res,
      async () => {
        const emailData: EmailData = req.body;

        if (!emailData.to || !emailData.subject) {
          throw new Error("Destinatario y asunto son requeridos");
        }

        const resultado = await emailService.enviarEmail(emailData);

        if (!resultado.success) {
          throw new Error(`Error al enviar email: ${resultado.error}`);
        }

        logger.info(`Email enviado exitosamente: ${emailData.subject} a ${resultado.destinatarios.join(", ")}`);

        return {
          resultado,
          mensaje: "Email enviado exitosamente"
        };
      },
      "Email enviado exitosamente"
    );
  }

  /**
   * Enviar email con plantilla
   */
  async enviarEmailConPlantilla(req: Request, res: Response): Promise<void> {
    await this.manejarOperacion(
      req,
      res,
      async () => {
        const { to, subject, template, context, opcionesAdicionales } = req.body;

        if (!to || !subject || !template) {
          throw new Error("Destinatario, asunto y plantilla son requeridos");
        }

        const resultado = await emailService.enviarEmailConPlantilla(
          to,
          subject,
          template,
          context || {},
          opcionesAdicionales || {}
        );

        if (!resultado.success) {
          throw new Error(`Error al enviar email: ${resultado.error}`);
        }

        logger.info(`Email con plantilla enviado: ${template} a ${resultado.destinatarios.join(", ")}`);

        return {
          resultado,
          mensaje: "Email con plantilla enviado exitosamente"
        };
      },
      "Email con plantilla enviado exitosamente"
    );
  }

  /**
   * Enviar email de bienvenida
   */
  async enviarEmailBienvenida(req: Request, res: Response): Promise<void> {
    await this.manejarOperacion(
      req,
      res,
      async () => {
        const { to, nombreUsuario, opcionesAdicionales } = req.body;

        if (!to || !nombreUsuario) {
          throw new Error("Destinatario y nombre de usuario son requeridos");
        }

        const resultado = await emailService.enviarEmailBienvenida(
          to,
          nombreUsuario,
          opcionesAdicionales || {}
        );

        if (!resultado.success) {
          throw new Error(`Error al enviar email de bienvenida: ${resultado.error}`);
        }

        logger.info(`Email de bienvenida enviado a: ${nombreUsuario} (${to})`);

        return {
          resultado,
          mensaje: "Email de bienvenida enviado exitosamente"
        };
      },
      "Email de bienvenida enviado exitosamente"
    );
  }

  /**
   * Enviar email de confirmación
   */
  async enviarEmailConfirmacion(req: Request, res: Response): Promise<void> {
    await this.manejarOperacion(
      req,
      res,
      async () => {
        const { to, token, opcionesAdicionales } = req.body;

        if (!to || !token) {
          throw new Error("Destinatario y token son requeridos");
        }

        const resultado = await emailService.enviarEmailConfirmacion(
          to,
          token,
          opcionesAdicionales || {}
        );

        if (!resultado.success) {
          throw new Error(`Error al enviar email de confirmación: ${resultado.error}`);
        }

        logger.info(`Email de confirmación enviado a: ${to}`);

        return {
          resultado,
          mensaje: "Email de confirmación enviado exitosamente"
        };
      },
      "Email de confirmación enviado exitosamente"
    );
  }

  /**
   * Enviar email de reset de contraseña
   */
  async enviarEmailResetPassword(req: Request, res: Response): Promise<void> {
    await this.manejarOperacion(
      req,
      res,
      async () => {
        const { to, token, opcionesAdicionales } = req.body;

        if (!to || !token) {
          throw new Error("Destinatario y token son requeridos");
        }

        const resultado = await emailService.enviarEmailResetPassword(
          to,
          token,
          opcionesAdicionales || {}
        );

        if (!resultado.success) {
          throw new Error(`Error al enviar email de reset: ${resultado.error}`);
        }

        logger.info(`Email de reset de contraseña enviado a: ${to}`);

        return {
          resultado,
          mensaje: "Email de reset de contraseña enviado exitosamente"
        };
      },
      "Email de reset de contraseña enviado exitosamente"
    );
  }

  /**
   * Enviar email de notificación
   */
  async enviarEmailNotificacion(req: Request, res: Response): Promise<void> {
    await this.manejarOperacion(
      req,
      res,
      async () => {
        const { to, titulo, mensaje, tipo, opcionesAdicionales } = req.body;

        if (!to || !titulo || !mensaje) {
          throw new Error("Destinatario, título y mensaje son requeridos");
        }

        const resultado = await emailService.enviarEmailNotificacion(
          to,
          titulo,
          mensaje,
          tipo || "info",
          opcionesAdicionales || {}
        );

        if (!resultado.success) {
          throw new Error(`Error al enviar email de notificación: ${resultado.error}`);
        }

        logger.info(`Email de notificación enviado: ${titulo} a ${resultado.destinatarios.join(", ")}`);

        return {
          resultado,
          mensaje: "Email de notificación enviado exitosamente"
        };
      },
      "Email de notificación enviado exitosamente"
    );
  }

  /**
   * Enviar email masivo
   */
  async enviarEmailMasivo(req: Request, res: Response): Promise<void> {
    await this.manejarOperacion(
      req,
      res,
      async () => {
        const { destinatarios, emailData, opciones } = req.body;

        if (!destinatarios || !Array.isArray(destinatarios) || destinatarios.length === 0) {
          throw new Error("Lista de destinatarios válida es requerida");
        }

        if (!emailData || !emailData.subject) {
          throw new Error("Datos del email con asunto son requeridos");
        }

        const resultados = await emailService.enviarEmailMasivo(
          destinatarios,
          emailData,
          opciones || {}
        );

        const exitosos = resultados.filter(r => r.success).length;
        const fallidos = resultados.filter(r => !r.success).length;

        logger.info(`Email masivo enviado: ${exitosos} exitosos, ${fallidos} fallidos`);

        return {
          resultados,
          resumen: {
            total: resultados.length,
            exitosos,
            fallidos,
            tasaExito: (exitosos / resultados.length) * 100
          },
          mensaje: `Email masivo procesado: ${exitosos} exitosos, ${fallidos} fallidos`
        };
      },
      "Email masivo procesado exitosamente"
    );
  }

  /**
   * Obtener estado del servicio de email
   */
  async obtenerEstado(req: Request, res: Response): Promise<void> {
    await this.manejarOperacion(
      req,
      res,
      async () => {
        const estado = await emailService.verificarEstado();

        return {
          estado,
          mensaje: "Estado del servicio obtenido"
        };
      },
      "Estado del servicio obtenido"
    );
  }

  /**
   * Obtener estadísticas del servicio
   */
  async obtenerEstadisticas(req: Request, res: Response): Promise<void> {
    await this.manejarOperacion(
      req,
      res,
      async () => {
        const estadisticas = emailService.getEstadisticas();

        return {
          estadisticas,
          mensaje: "Estadísticas obtenidas"
        };
      },
      "Estadísticas obtenidas"
    );
  }

  /**
   * Obtener plantillas disponibles
   */
  async obtenerPlantillas(req: Request, res: Response): Promise<void> {
    await this.manejarOperacion(
      req,
      res,
      async () => {
        const plantillas = emailService.getPlantillasDisponibles();

        return {
          plantillas,
          plantillasPredefinidas: plantillasEmail,
          prioridades: prioridadesEmail,
          mensaje: "Plantillas obtenidas"
        };
      },
      "Plantillas obtenidas"
    );
  }

  /**
   * Reinicializar el servicio de email
   */
  async reinicializarServicio(req: Request, res: Response): Promise<void> {
    await this.manejarOperacion(
      req,
      res,
      async () => {
        await emailService.reinicializar();

        const estado = await emailService.verificarEstado();

        logger.info("Servicio de email reinicializado");

        return {
          estado,
          mensaje: "Servicio de email reinicializado exitosamente"
        };
      },
      "Servicio de email reinicializado exitosamente"
    );
  }

  /**
   * Probar conexión SMTP
   */
  async probarConexion(req: Request, res: Response): Promise<void> {
    await this.manejarOperacion(
      req,
      res,
      async () => {
        const estado = await emailService.verificarEstado();

        if (!estado.conectado) {
          throw new Error("No se pudo establecer conexión con el servidor SMTP");
        }

        // Enviar email de prueba
        const resultado = await emailService.enviarEmail({
          to: req.body.to || "test@example.com",
          subject: "Prueba de conexión - Cedex",
          html: `
            <h2>Prueba de conexión exitosa</h2>
            <p>Este email confirma que el servicio de email está funcionando correctamente.</p>
            <p><strong>Timestamp:</strong> ${new Date().toLocaleString("es-ES")}</p>
            <p><strong>Proveedor:</strong> ${estado.proveedor}</p>
          `
        });

        if (!resultado.success) {
          throw new Error(`Error en prueba de envío: ${resultado.error}`);
        }

        return {
          conexion: estado.conectado,
          proveedor: estado.proveedor,
          pruebaEnvio: resultado.success,
          mensaje: "Prueba de conexión exitosa"
        };
      },
      "Prueba de conexión exitosa"
    );
  }

  /**
   * Obtener configuración del servicio
   */
  async obtenerConfiguracion(req: Request, res: Response): Promise<void> {
    await this.manejarOperacion(
      req,
      res,
      async () => {
        const estado = await emailService.verificarEstado();

        return {
          configuracion: {
            conectado: estado.conectado,
            proveedor: estado.proveedor,
            plantillasCargadas: estado.plantillasCargadas,
            plantillasDisponibles: emailService.getPlantillasDisponibles(),
            plantillasPredefinidas: plantillasEmail,
            prioridades: prioridadesEmail
          },
          mensaje: "Configuración obtenida"
        };
      },
      "Configuración obtenida"
    );
  }
}
