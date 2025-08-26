import { Request } from "express";
import { corsConfig } from "../config/env";

/**
 * Utilidades para manejo de CORS
 */
export class CorsUtils {
  /**
   * Verificar si un origen está permitido
   */
  static esOrigenPermitido(origen: string): boolean {
    return corsConfig.origins.includes(origen);
  }

  /**
   * Obtener el origen de una request
   */
  static obtenerOrigen(req: Request): string | undefined {
    return req.headers.origin || req.headers.referer;
  }

  /**
   * Verificar si una request viene de un origen permitido
   */
  static verificarOrigen(req: Request): boolean {
    const origen = this.obtenerOrigen(req);

    if (!origen) {
      // Permitir requests sin origen (ej: Postman, curl)
      return true;
    }

    return this.esOrigenPermitido(origen);
  }

  /**
   * Obtener información de CORS para debugging
   */
  static obtenerInfoCors(req: Request) {
    const origen = this.obtenerOrigen(req);
    const esPermitido = origen ? this.esOrigenPermitido(origen) : true;

    return {
      origen,
      esPermitido,
      origenesConfigurados: corsConfig.origins,
      headers: {
        authorization: req.headers.authorization ? "presente" : "ausente",
        contentType: req.headers["content-type"] || "no especificado",
        userAgent: req.headers["user-agent"] || "no especificado",
      },
    };
  }

  /**
   * Log de información CORS (para debugging)
   */
  static logInfoCors(req: Request): void {
    const info = this.obtenerInfoCors(req);

    console.log("🌐 CORS Info:", {
      method: req.method,
      path: req.path,
      ...info,
    });
  }
}
