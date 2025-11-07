import { emailConfig } from "./env";

/**
 * Configuración del sistema de emails
 */
export const emailSystemConfig = {
  // Configuración SMTP
  smtp: {
    host: emailConfig.host,
    port: emailConfig.port || 587,
    secure: emailConfig.port === 465, // true para 465, false para otros puertos
    auth: {
      user: emailConfig.user,
      pass: emailConfig.pass,
    },
    // Configuración adicional para mejor compatibilidad
    tls: {
      rejectUnauthorized: false, // Para desarrollo
    },
    // Timeout de conexión
    connectionTimeout: 60000, // 60 segundos
    greetingTimeout: 30000, // 30 segundos
    socketTimeout: 60000, // 60 segundos
  },

  // Configuración del remitente
  from: {
    name: emailConfig.fromName || "Cedex System",
    email: emailConfig.fromEmail || "noreply@cedex.com",
  },

  // Configuración de plantillas
  templates: {
    directorio: "src/templates/emails",
    extension: ".hbs",
    encoding: "utf-8",
  },

  // Configuración de envío
  envio: {
    maxIntentos: 3,
    delayEntreIntentos: 5000, // 5 segundos
    timeoutEnvio: 30000, // 30 segundos
    maxEmailsPorLote: 50,
    delayEntreLotes: 1000, // 1 segundo
  },

  // Configuración de cola
  cola: {
    habilitada: true,
    maxTrabajos: 10,
    maxTrabajosConcurrentes: 5,
    retrasoEntreTrabajos: 1000, // 1 segundo
  },

  // Configuración de logging
  logging: {
    habilitado: true,
    nivel: "info", // debug, info, warn, error
    guardarEnArchivo: true,
    archivo: "logs/emails.log",
  },

  // Configuración de seguridad
  seguridad: {
    maxDestinatariosPorEmail: 10,
    maxEmailsPorHora: 100,
    maxEmailsPorDia: 1000,
    blacklistDominios: [],
    whitelistDominios: [],
  },

  // Configuración de tracking
  tracking: {
    habilitado: true,
    guardarEnBaseDatos: true,
    retenerLogs: 30, // días
  },
};

/**
 * Configuraciones predefinidas para proveedores populares
 */
export const proveedoresEmail = {
  gmail: {
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD, // Contraseña de aplicación
    },
  },

  outlook: {
    host: "smtp-mail.outlook.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.OUTLOOK_USER,
      pass: process.env.OUTLOOK_PASSWORD,
    },
  },

  yahoo: {
    host: "smtp.mail.yahoo.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.YAHOO_USER,
      pass: process.env.YAHOO_APP_PASSWORD,
    },
  },

  sendgrid: {
    host: "smtp.sendgrid.net",
    port: 587,
    secure: false,
    auth: {
      user: "apikey",
      pass: process.env.SENDGRID_API_KEY,
    },
  },

  mailgun: {
    host: process.env.MAILGUN_HOST,
    port: 587,
    secure: false,
    auth: {
      user: process.env.MAILGUN_USER,
      pass: process.env.MAILGUN_PASSWORD,
    },
  },

  // Para desarrollo local
  desarrollo: {
    host: "localhost",
    port: 1025,
    secure: false,
    auth: {
      user: "",
      pass: "",
    },
    // Ignorar certificados SSL en desarrollo
    tls: {
      rejectUnauthorized: false,
    },
  },
};

/**
 * Obtener configuración SMTP según el proveedor
 */
export const obtenerConfiguracionSMTP = (proveedor: string = "default") => {
  if (proveedor === "default") {
    return emailSystemConfig.smtp;
  }

  const configuracion =
    proveedoresEmail[proveedor as keyof typeof proveedoresEmail];
  if (!configuracion) {
    throw new Error(`Proveedor de email no soportado: ${proveedor}`);
  }

  return {
    ...configuracion,
    tls: {
      rejectUnauthorized: false,
    },
    connectionTimeout: emailSystemConfig.smtp.connectionTimeout,
    greetingTimeout: emailSystemConfig.smtp.greetingTimeout,
    socketTimeout: emailSystemConfig.smtp.socketTimeout,
  };
};

/**
 * Validar configuración de email
 */
export const validarConfiguracionEmail = (): boolean => {
  const config = emailSystemConfig.smtp;

  if (!config.host || !config.auth.user || !config.auth.pass) {
    return false;
  }

  if (config.port < 1 || config.port > 65535) {
    return false;
  }

  return true;
};

/**
 * Obtener información del proveedor actual
 */
export const obtenerInfoProveedor = () => {
  const config = emailSystemConfig.smtp;

  // Detectar proveedor basado en el host
  const host = config.host?.toLowerCase() || "";

  if (host.includes("gmail")) return "Gmail";
  if (host.includes("outlook") || host.includes("hotmail")) return "Outlook";
  if (host.includes("yahoo")) return "Yahoo";
  if (host.includes("sendgrid")) return "SendGrid";
  if (host.includes("mailgun")) return "Mailgun";
  if (host.includes("localhost")) return "Desarrollo Local";

  return "Personalizado";
};

/**
 * Configuración de plantillas de email
 */
export const plantillasEmail = {
  // Plantillas del sistema
  sistema: {
    bienvenida: "bienvenida",
    confirmacionEmail: "confirmacion-email",
    resetPassword: "reset-password",
    notificacion: "notificacion",
    reporte: "reporte",
  },

  // Plantillas de negocio
  negocio: {
    ordenConfirmada: "orden-confirmada",
    ordenEnviada: "orden-enviada",
    factura: "factura",
    newsletter: "newsletter",
    promocion: "promocion",
  },

  // Plantillas administrativas
  admin: {
    reporteDiario: "reporte-diario",
    alertaSistema: "alerta-sistema",
    backupCompletado: "backup-completado",
    errorSistema: "error-sistema",
  },
};

/**
 * Configuración de prioridades de email
 */
export const prioridadesEmail = {
  baja: "low",
  normal: "normal",
  alta: "high",
} as const;

export type PrioridadEmail =
  (typeof prioridadesEmail)[keyof typeof prioridadesEmail];
