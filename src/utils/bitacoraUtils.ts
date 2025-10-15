/**
 * @fileoverview Utilidades para el Sistema de Bitácora
 * 
 * Funciones helper para facilitar el uso del sistema de bitácora
 * con JWT y sesiones autenticadas.
 */

import { Request } from "express";
import { RequestAutenticado } from "../middleware/authMiddleware";

/**
 * 🔐 Extraer ID de sesión desde el JWT del usuario autenticado (OBLIGATORIO)
 * 
 * Esta función obtiene el `id_ct_sesion` del usuario autenticado
 * para pasarlo al BaseService y registrar en bitácora.
 * 
 * ⚠️ IMPORTANTE: El id_ct_sesion es OBLIGATORIO para todas las operaciones.
 * Si no está presente, se lanza un error para prevenir operaciones sin auditoría.
 * 
 * @param req - Request de Express (DEBE estar autenticado)
 * @returns ID de sesión (number)
 * @throws Error si el usuario no está autenticado o no tiene sesión válida
 * 
 * @example
 * ```typescript
 * const idSesion = obtenerIdSesionDesdeJwt(req);
 * await municipioService.crear(datos, idSesion);
 * ```
 */
export function obtenerIdSesionDesdeJwt(req: Request): number {
  const reqAutenticado = req as RequestAutenticado;
  
  // 🚨 Verificar autenticación OBLIGATORIA
  if (!reqAutenticado.user) {
    throw new Error(
      "🚨 SEGURIDAD: Usuario no autenticado. " +
      "Todas las operaciones requieren autenticación JWT válida. " +
      "Asegúrate de que el middleware verificarAutenticacion esté activo."
    );
  }

  if (!reqAutenticado.user.id_sesion) {
    throw new Error(
      "🚨 SEGURIDAD: JWT no contiene id_sesion. " +
      "El token JWT debe incluir información de sesión válida. " +
      "Esto puede indicar un token malformado o sistema de auth desactualizado."
    );
  }

  // Convertir string a number (id_sesion viene como string del authMiddleware)
  const idSesion = parseInt(reqAutenticado.user.id_sesion, 10);
  
  if (isNaN(idSesion)) {
    throw new Error(
      `🚨 SEGURIDAD: id_sesion inválido en JWT: "${reqAutenticado.user.id_sesion}". ` +
      `Debe ser un número entero válido. ` +
      `Posible corrupción de token o manipulación.`
    );
  }

  // Validación adicional: id_sesion debe ser positivo
  if (idSesion <= 0) {
    throw new Error(
      `🚨 SEGURIDAD: id_sesion debe ser mayor a 0, recibido: ${idSesion}. ` +
      `Posible intento de falsificación.`
    );
  }

  console.log(`✅ ID de sesión validado y extraído desde JWT: ${idSesion}`);
  return idSesion;
}

/**
 * 🔒 Verificar que el usuario esté autenticado
 * 
 * Valida que el request tenga un usuario autenticado con sesión válida.
 * Útil para verificar antes de realizar operaciones sensibles.
 * 
 * @param req - Request de Express
 * @returns true si está autenticado y tiene sesión, false en caso contrario
 */
export function tieneUsuarioAutenticado(req: Request): boolean {
  const reqAutenticado = req as RequestAutenticado;
  return !!reqAutenticado.user && !!reqAutenticado.user.id_sesion;
}

/**
 * 📊 Obtener información completa del usuario autenticado
 * 
 * Retorna toda la información del usuario desde el JWT
 * 
 * @param req - Request de Express
 * @returns Objeto con información del usuario o null si no está autenticado
 */
export function obtenerUsuarioAutenticado(req: Request) {
  const reqAutenticado = req as RequestAutenticado;
  
  if (!reqAutenticado.user) {
    return null;
  }

  return {
    id_ct_usuario: reqAutenticado.user.id_ct_usuario,
    uuid_usuario: reqAutenticado.user.uuid_usuario,
    usuario: reqAutenticado.user.usuario,
    email: reqAutenticado.user.email,
    estado: reqAutenticado.user.estado,
    jti: reqAutenticado.user.jti,
    id_sesion: parseInt(reqAutenticado.user.id_sesion, 10),
    ip_origen: reqAutenticado.user.ip_origen,
    fecha_expiracion: reqAutenticado.user.fecha_expiracion,
  };
}

/**
 * 🎯 Extraer ID de usuario desde el JWT (OBLIGATORIO)
 * 
 * Obtiene el ID del usuario autenticado para usarlo en operaciones
 * 
 * @param req - Request de Express (DEBE estar autenticado)
 * @returns ID del usuario
 * @throws Error si el usuario no está autenticado
 */
export function obtenerIdUsuarioDesdeJwt(req: Request): number {
  const reqAutenticado = req as RequestAutenticado;
  
  if (!reqAutenticado.user) {
    throw new Error(
      "🚨 SEGURIDAD: Usuario no autenticado. " +
      "Se requiere JWT válido para obtener id_ct_usuario."
    );
  }

  if (!reqAutenticado.user.id_ct_usuario) {
    throw new Error(
      "🚨 SEGURIDAD: JWT no contiene id_ct_usuario. " +
      "Token malformado o corrupto."
    );
  }

  return reqAutenticado.user.id_ct_usuario;
}

/**
 * ✅ Validar y obtener datos para bitácora (OBLIGATORIO)
 * 
 * Función completa que valida autenticación y extrae todos
 * los datos necesarios para registrar en bitácora.
 * 
 * Esta función garantiza que SIEMPRE se tengan datos válidos
 * de usuario y sesión antes de realizar cualquier operación.
 * 
 * @param req - Request de Express (DEBE estar autenticado)
 * @returns Objeto con id_usuario e id_sesion validados
 * @throws Error si el usuario no está autenticado o faltan datos
 * 
 * @example
 * ```typescript
 * const datosBitacora = obtenerDatosParaBitacora(req);
 * await service.actualizar(id, datos, datosBitacora.id_sesion);
 * ```
 */
export function obtenerDatosParaBitacora(req: Request): {
  id_usuario: number;
  id_sesion: number;
} {
  const reqAutenticado = req as RequestAutenticado;
  
  if (!reqAutenticado.user) {
    throw new Error(
      "🚨 SEGURIDAD: Usuario no autenticado. " +
      "No se pueden obtener datos para bitácora sin autenticación válida."
    );
  }

  if (!reqAutenticado.user.id_sesion) {
    throw new Error(
      "🚨 SEGURIDAD: JWT no contiene id_sesion. " +
      "No se puede registrar en bitácora sin sesión válida."
    );
  }

  const idSesion = parseInt(reqAutenticado.user.id_sesion, 10);
  
  if (isNaN(idSesion) || idSesion <= 0) {
    throw new Error(
      `🚨 SEGURIDAD: id_sesion inválido: "${reqAutenticado.user.id_sesion}". ` +
      `Debe ser un número entero positivo.`
    );
  }

  return {
    id_usuario: reqAutenticado.user.id_ct_usuario,
    id_sesion: idSesion,
  };
}

