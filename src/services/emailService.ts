import nodemailer, {
  Transporter,
  SendMailOptions,
  SentMessageInfo,
} from "nodemailer";
import handlebars from "handlebars";
import fs from "fs";
import path from "path";
import {
  emailSystemConfig,
  obtenerConfiguracionSMTP,
  validarConfiguracionEmail,
  obtenerInfoProveedor,
  plantillasEmail,
  prioridadesEmail,
  PrioridadEmail,
} from "../config/email";
import logger from "../config/logger";

export interface EmailData {
  to: string | string[];
  subject: string;
  template?: string;
  html?: string;
  text?: string;
  context?: Record<string, any>;
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
  priority?: PrioridadEmail;
  replyTo?: string;
  cc?: string | string[];
  bcc?: string | string[];
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
  timestamp: Date;
  destinatarios: string[];
  intentos: number;
}

export interface EmailStats {
  totalEnviados: number;
  totalFallidos: number;
  tasaExito: number;
  ultimoEnvio?: Date;
  proveedor: string;
}

export class EmailService {
  private transporter: Transporter | null = null;
  private plantillas: Map<string, handlebars.TemplateDelegate> = new Map();
  private estadisticas: EmailStats = {
    totalEnviados: 0,
    totalFallidos: 0,
    tasaExito: 0,
    proveedor: "No configurado",
  };

  constructor() {
    this.inicializarTransporter();
    this.cargarPlantillas();
  }

  /**
   * Inicializar el transporter de Nodemailer
   */
  private async inicializarTransporter(): Promise<void> {
    try {
      if (!validarConfiguracionEmail()) {
        logger.warn("Configuración de email no válida, usando modo desarrollo");
        const configDesarrollo = obtenerConfiguracionSMTP("desarrollo");
        this.transporter = nodemailer.createTransport(configDesarrollo);
      } else {
        const config = obtenerConfiguracionSMTP();
        this.transporter = nodemailer.createTransport(config);

        // Verificar conexión
        if (this.transporter) {
          await this.transporter.verify();
        }
        logger.info(
          `✅ Transporter de email inicializado: ${obtenerInfoProveedor()}`
        );

        this.estadisticas.proveedor = obtenerInfoProveedor();
      }
    } catch (error) {
      logger.error("Error al inicializar transporter de email:", error);
      this.transporter = null;
    }
  }

  /**
   * Cargar plantillas de email
   */
  private cargarPlantillas(): void {
    try {
      const directorioPlantillas = path.join(
        process.cwd(),
        emailSystemConfig.templates.directorio
      );

      if (!fs.existsSync(directorioPlantillas)) {
        logger.warn(
          `Directorio de plantillas no encontrado: ${directorioPlantillas}`
        );
        return;
      }

      const archivos = fs.readdirSync(directorioPlantillas);

      archivos.forEach((archivo) => {
        if (archivo.endsWith(emailSystemConfig.templates.extension)) {
          const nombrePlantilla = path.basename(
            archivo,
            emailSystemConfig.templates.extension
          );
          const rutaCompleta = path.join(directorioPlantillas, archivo);
          const contenido = fs.readFileSync(
            rutaCompleta,
            emailSystemConfig.templates.encoding as BufferEncoding
          );

          this.plantillas.set(nombrePlantilla, handlebars.compile(contenido));
          logger.debug(`Plantilla cargada: ${nombrePlantilla}`);
        }
      });

      logger.info(`✅ ${this.plantillas.size} plantillas de email cargadas`);
    } catch (error) {
      logger.error("Error al cargar plantillas de email:", error);
    }
  }

  /**
   * Enviar email
   */
  async enviarEmail(emailData: EmailData): Promise<EmailResult> {
    const resultado: EmailResult = {
      success: false,
      timestamp: new Date(),
      destinatarios: Array.isArray(emailData.to)
        ? emailData.to
        : [emailData.to],
      intentos: 0,
    };

    if (!this.transporter) {
      resultado.error = "Transporter de email no inicializado";
      this.estadisticas.totalFallidos++;
      this.actualizarEstadisticas();
      return resultado;
    }

    try {
      // Preparar contenido del email
      const contenido = await this.prepararContenido(emailData);

      // Configurar opciones de envío
      const opciones: SendMailOptions = {
        from: `"${emailSystemConfig.from.name}" <${emailSystemConfig.from.email}>`,
        to: emailData.to,
        subject: emailData.subject,
        html: contenido.html,
        text: contenido.text,
        priority: (emailData.priority || prioridadesEmail.normal) as
          | "high"
          | "normal"
          | "low",
        replyTo: emailData.replyTo,
        cc: emailData.cc,
        bcc: emailData.bcc,
        attachments: emailData.attachments,
      };

      // Enviar email con reintentos
      for (
        let intento = 1;
        intento <= emailSystemConfig.envio.maxIntentos;
        intento++
      ) {
        resultado.intentos = intento;

        try {
          const info: SentMessageInfo = await this.transporter.sendMail(
            opciones
          );

          resultado.success = true;
          resultado.messageId = info.messageId;

          logger.info(
            `✅ Email enviado exitosamente: ${
              emailData.subject
            } a ${resultado.destinatarios.join(", ")}`
          );
          this.estadisticas.totalEnviados++;
          break;
        } catch (error) {
          logger.warn(
            `Intento ${intento} fallido para email: ${emailData.subject}`,
            error
          );

          if (intento < emailSystemConfig.envio.maxIntentos) {
            await this.delay(emailSystemConfig.envio.delayEntreIntentos);
          } else {
            throw error;
          }
        }
      }
    } catch (error) {
      resultado.error =
        error instanceof Error ? error.message : "Error desconocido";
      this.estadisticas.totalFallidos++;
      logger.error(`❌ Error al enviar email: ${emailData.subject}`, error);
    }

    this.actualizarEstadisticas();
    return resultado;
  }

  /**
   * Enviar email usando plantilla
   */
  async enviarEmailConPlantilla(
    to: string | string[],
    subject: string,
    nombrePlantilla: string,
    context: Record<string, any> = {},
    opcionesAdicionales: Partial<EmailData> = {}
  ): Promise<EmailResult> {
    const emailData: EmailData = {
      to,
      subject,
      template: nombrePlantilla,
      context,
      ...opcionesAdicionales,
    };

    return this.enviarEmail(emailData);
  }

  /**
   * Enviar email de bienvenida
   */
  async enviarEmailBienvenida(
    to: string,
    nombreUsuario: string,
    opcionesAdicionales: Partial<EmailData> = {}
  ): Promise<EmailResult> {
    return this.enviarEmailConPlantilla(
      to,
      "¡Bienvenido a Cedex!",
      plantillasEmail.sistema.bienvenida,
      {
        nombreUsuario,
        fechaRegistro: new Date().toLocaleDateString("es-ES"),
        urlSitio: process.env.FRONTEND_URL || "http://localhost:4200",
      },
      opcionesAdicionales
    );
  }

  /**
   * Enviar email de confirmación
   */
  async enviarEmailConfirmacion(
    to: string,
    token: string,
    opcionesAdicionales: Partial<EmailData> = {}
  ): Promise<EmailResult> {
    return this.enviarEmailConPlantilla(
      to,
      "Confirma tu cuenta de Cedex",
      plantillasEmail.sistema.confirmacionEmail,
      {
        token,
        urlConfirmacion: `${
          process.env.FRONTEND_URL || "http://localhost:4200"
        }/confirmar-email?token=${token}`,
        expiracion: "24 horas",
      },
      opcionesAdicionales
    );
  }

  /**
   * Enviar email de reset de contraseña
   */
  async enviarEmailResetPassword(
    to: string,
    token: string,
    opcionesAdicionales: Partial<EmailData> = {}
  ): Promise<EmailResult> {
    return this.enviarEmailConPlantilla(
      to,
      "Restablece tu contraseña - Cedex",
      plantillasEmail.sistema.resetPassword,
      {
        token,
        urlReset: `${
          process.env.FRONTEND_URL || "http://localhost:4200"
        }/reset-password?token=${token}`,
        expiracion: "1 hora",
      },
      opcionesAdicionales
    );
  }

  /**
   * Enviar email de notificación
   */
  async enviarEmailNotificacion(
    to: string | string[],
    titulo: string,
    mensaje: string,
    tipo: "info" | "warning" | "error" | "success" = "info",
    opcionesAdicionales: Partial<EmailData> = {}
  ): Promise<EmailResult> {
    return this.enviarEmailConPlantilla(
      to,
      `Notificación: ${titulo}`,
      plantillasEmail.sistema.notificacion,
      {
        titulo,
        mensaje,
        tipo,
        fecha: new Date().toLocaleString("es-ES"),
      },
      opcionesAdicionales
    );
  }

  /**
   * Enviar email masivo
   */
  async enviarEmailMasivo(
    destinatarios: string[],
    emailData: Omit<EmailData, "to">,
    opciones: {
      maxPorLote?: number;
      delayEntreLotes?: number;
    } = {}
  ): Promise<EmailResult[]> {
    const maxPorLote =
      opciones.maxPorLote || emailSystemConfig.envio.maxEmailsPorLote;
    const delayEntreLotes =
      opciones.delayEntreLotes || emailSystemConfig.envio.delayEntreLotes;
    const resultados: EmailResult[] = [];

    // Dividir destinatarios en lotes
    const lotes = this.dividirEnLotes(destinatarios, maxPorLote);

    for (let i = 0; i < lotes.length; i++) {
      const lote = lotes[i];
      logger.info(
        `Enviando lote ${i + 1}/${lotes.length} con ${
          lote.length
        } destinatarios`
      );

      // Enviar emails del lote en paralelo
      const promesas = lote.map((destinatario) =>
        this.enviarEmail({
          ...emailData,
          to: destinatario,
        })
      );

      const resultadosLote = await Promise.all(promesas);
      resultados.push(...resultadosLote);

      // Delay entre lotes (excepto el último)
      if (i < lotes.length - 1) {
        await this.delay(delayEntreLotes);
      }
    }

    return resultados;
  }

  /**
   * Preparar contenido del email (HTML y texto)
   */
  private async prepararContenido(
    emailData: EmailData
  ): Promise<{ html: string; text: string }> {
    let html = emailData.html || "";
    let text = emailData.text || "";

    // Si se especifica una plantilla, usarla
    if (emailData.template) {
      const plantilla = this.plantillas.get(emailData.template);

      if (!plantilla) {
        throw new Error(`Plantilla no encontrada: ${emailData.template}`);
      }

      const contexto = emailData.context || {};
      html = plantilla(contexto);

      // Generar versión de texto plano
      text = this.convertirHtmlATexto(html);
    }

    // Si no hay contenido, usar plantilla por defecto
    if (!html && !text) {
      html = this.generarPlantillaPorDefecto(emailData);
      text = this.convertirHtmlATexto(html);
    }

    return { html, text };
  }

  /**
   * Generar plantilla por defecto
   */
  private generarPlantillaPorDefecto(emailData: EmailData): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${emailData.subject}</title>
        </head>
        <body>
          <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
            <h2>${emailData.subject}</h2>
            ${
              emailData.html ||
              "<p>Este es un email automático del sistema Cedex.</p>"
            }
            <hr>
            <p style="color: #666; font-size: 12px;">
              Este email fue enviado automáticamente por el sistema Cedex.<br>
              Si tienes alguna pregunta, contacta al administrador.
            </p>
          </div>
        </body>
      </html>
    `;
  }

  /**
   * Convertir HTML a texto plano
   */
  private convertirHtmlATexto(html: string): string {
    return html
      .replace(/<[^>]*>/g, "") // Remover tags HTML
      .replace(/&nbsp;/g, " ") // Reemplazar espacios no separables
      .replace(/&amp;/g, "&") // Reemplazar entidades HTML
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/\s+/g, " ") // Normalizar espacios
      .trim();
  }

  /**
   * Dividir array en lotes
   */
  private dividirEnLotes<T>(array: T[], tamanoLote: number): T[][] {
    const lotes: T[][] = [];
    for (let i = 0; i < array.length; i += tamanoLote) {
      lotes.push(array.slice(i, i + tamanoLote));
    }
    return lotes;
  }

  /**
   * Delay asíncrono
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Actualizar estadísticas
   */
  private actualizarEstadisticas(): void {
    const total =
      this.estadisticas.totalEnviados + this.estadisticas.totalFallidos;
    this.estadisticas.tasaExito =
      total > 0 ? (this.estadisticas.totalEnviados / total) * 100 : 0;
    this.estadisticas.ultimoEnvio = new Date();
  }

  /**
   * Obtener estadísticas
   */
  getEstadisticas(): EmailStats {
    return { ...this.estadisticas };
  }

  /**
   * Verificar estado del servicio
   */
  async verificarEstado(): Promise<{
    conectado: boolean;
    proveedor: string;
    plantillasCargadas: number;
    estadisticas: EmailStats;
  }> {
    const conectado = this.transporter !== null;

    if (conectado && this.transporter) {
      try {
        await this.transporter.verify();
      } catch (error) {
        logger.error("Error al verificar conexión SMTP:", error);
        return {
          conectado: false,
          proveedor: this.estadisticas.proveedor,
          plantillasCargadas: this.plantillas.size,
          estadisticas: this.estadisticas,
        };
      }
    }

    return {
      conectado,
      proveedor: this.estadisticas.proveedor,
      plantillasCargadas: this.plantillas.size,
      estadisticas: this.estadisticas,
    };
  }

  /**
   * Reinicializar el transporter
   */
  async reinicializar(): Promise<void> {
    this.transporter = null;
    await this.inicializarTransporter();
  }

  /**
   * Obtener lista de plantillas disponibles
   */
  getPlantillasDisponibles(): string[] {
    return Array.from(this.plantillas.keys());
  }
}
