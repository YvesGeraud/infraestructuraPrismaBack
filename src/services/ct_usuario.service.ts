import {
  ct_usuarioCreationAttributes,
  initModels,
} from "../models/init-models";
import * as bcrypt from "bcrypt";
import config from "../config";
import { sequelize } from "../config/database";

//! Inicializar los modelos
const models = initModels(sequelize);

//! Desestructurar los modelos que necesitamos
const { ct_usuario: Usuario } = models;

class CtUsuarioService {
  //* Crear un nuevo usuario
  async crearUsuario(data: ct_usuarioCreationAttributes) {
    try {
      // Validaciones de la contraseña
      if (!data.contrasena) {
        throw new Error("La contraseña es requerida");
      }
      /*if (data.contrasena.length < 8) {
        throw new Error("La contraseña debe tener al menos 8 caracteres");
      }
      if (!/[A-Z]/.test(data.contrasena)) {
        throw new Error(
          "La contraseña debe contener al menos una letra mayúscula"
        );
      }
      if (!/[a-z]/.test(data.contrasena)) {
        throw new Error(
          "La contraseña debe contener al menos una letra minúscula"
        );
      }
      if (!/[0-9]/.test(data.contrasena)) {
        throw new Error("La contraseña debe contener al menos un número");
      }*/

      const hashedPassword = await bcrypt.hash(
        data.contrasena,
        config.bcryptSaltRounds
      );

      // Solo enviamos los campos requeridos
      const nuevoUsuario = await Usuario.create(
        {
          usuario: data.usuario,
          contrasena: hashedPassword,
          estatus: data.estatus || 1,
        },
        {
          fields: ["usuario", "contrasena", "estatus"], // Especificamos exactamente qué campos queremos insertar
        }
      );

      return nuevoUsuario;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error al crear usuario service: ${error.message}`);
      }
      throw new Error(`Error desconocido al crear usuario service: ${error}`);
    }
  }

  // Obtener un usuario por su ID
  async obtenerUsuarioPorId(id: number) {
    const usuarioEncontrado = await Usuario.findByPk(id);
    if (!usuarioEncontrado) {
      throw new Error("Usuario no encontrado");
    }
    return usuarioEncontrado;
  }

  // Actualizar un usuario existente
  async actualizarUsuario(
    id: number,
    data: Partial<ct_usuarioCreationAttributes>
  ) {
    const usuarioEncontrado = await Usuario.findByPk(id);
    if (!usuarioEncontrado) {
      throw new Error("Usuario no encontrado");
    }
    await usuarioEncontrado.update(data);
    return usuarioEncontrado;
  }

  // Eliminar un usuario
  async eliminarUsuario(id: number) {
    const usuarioEncontrado = await Usuario.findByPk(id);
    if (!usuarioEncontrado) {
      throw new Error("Usuario no encontrado");
    }
    await usuarioEncontrado.destroy();
    return true;
  }
}

export default new CtUsuarioService();
