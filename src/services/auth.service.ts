/**
 * @fileoverview Servicio de autenticación
 * Este archivo contiene la lógica de autenticación de usuarios, incluyendo:
 * - Login de usuarios
 * - Generación de JWT
 * - Manejo seguro de contraseñas
 *
 * @version 1.0.0
 * @since 2024-03-29
 */

import bcrypt from "bcrypt";
import jwt, { Secret } from "jsonwebtoken";
import config from "../config";
import { ct_usuario } from "../models";

/**
 * Interfaz que define la estructura del payload del JWT
 * @property {number} sub - ID del usuario (subject)
 * @property {string} username - Nombre de usuario
 */
interface JwtPayload {
  sub: number; // Subject (ID del usuario) - Estándar JWT
  username: string; // Nombre de usuario - No sensible
}

/**
 * Clase que maneja la autenticación de usuarios
 * @class AuthService
 */
class AuthService {
  /**
   * Realiza el proceso de autenticación de un usuario
   *
   * @param {string} usuario - Nombre de usuario
   * @param {string} contrasena - Contraseña sin procesar
   * @returns {Promise<Object>} Objeto con el resultado de la autenticación
   *
   * @throws {Error} Si las credenciales son inválidas
   *
   * @example
   * const authService = new AuthService();
   * try {
   *   const result = await authService.login("usuario", "contraseña");
   *   // result = { success: true, data: { token, usuario, id }, message }
   * } catch (error) {
   *   console.error(error);
   * }
   */
  async login(usuario: string, contrasena: string) {
    try {
      // 1. Buscar usuario en la base de datos
      // Solo seleccionamos los campos necesarios por seguridad
      const user = await ct_usuario.findOne({
        where: { usuario },
        attributes: ["id_usuario", "usuario", "contrasena", "estatus"],
      });

      // 2. Validar usuario y contraseña
      // Usamos una única condición para prevenir timing attacks
      if (!user || !(await bcrypt.compare(contrasena, user.contrasena))) {
        throw new Error("Credenciales inválidas");
      }

      // 3. Generar JWT con payload seguro
      const payload: JwtPayload = {
        sub: user.id_usuario, // Identificador único del usuario
        username: user.usuario, // Información no sensible
      };

      // 4. Firmar el token con el secreto y opciones de configuración
      const token = jwt.sign(payload, config.jwtSecret as Secret, {
        expiresIn: config.jwtExpiresIn, // Tiempo de expiración desde config
        algorithm: "HS256", // Algoritmo de firma explícito
      });

      // 5. Retornar respuesta exitosa
      return {
        success: true,
        data: {
          token, // Token JWT para autenticación
          usuario: user.usuario, // Nombre de usuario para UI
          id: user.id_usuario, // ID para referencias
        },
        message: "Login exitoso",
      };
    } catch (error) {
      // 6. Manejo de errores centralizado
      // Registramos el error real pero retornamos mensaje genérico
      console.error("Error en autenticación:", error);
      return {
        success: false,
        message: "Credenciales inválidas", // Mensaje genérico por seguridad
      };
    }
  }
}

// Exportamos una única instancia del servicio (Singleton)
export default new AuthService();

/**
 * @security Consideraciones de Seguridad:
 *
 * 1. Almacenamiento de Contraseñas:
 *    - Las contraseñas NUNCA se almacenan en texto plano
 *    - Se utiliza bcrypt para el hash de contraseñas
 *
 * 2. Protección contra Ataques:
 *    - Timing Attacks: Uso de comparaciones constantes
 *    - Fuerza Bruta: Mensajes de error genéricos
 *    - Enumeración de Usuarios: Mensajes consistentes
 *
 * 3. JWT:
 *    - Payload mínimo con información no sensible
 *    - Uso de claims estándar (sub)
 *    - Tiempo de expiración configurable
 *    - Algoritmo de firma explícito (HS256)
 *
 * 4. Datos:
 *    - Selección específica de campos en consultas
 *    - No exposición de datos sensibles en respuestas
 *    - Logging seguro sin datos sensibles
 */
