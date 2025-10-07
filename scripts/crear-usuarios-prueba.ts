/**
 * @fileoverview Script para crear usuarios de prueba
 *
 * Este script crea usuarios de prueba para el sistema de autenticación:
 * - Hashea las contraseñas con bcrypt
 * - Genera UUIDs únicos para cada usuario
 * - Configura usuarios con diferentes roles/estados
 *
 * Uso: npm run ts-node scripts/crear-usuarios-prueba.ts
 */

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

// Configuración de usuarios de prueba
const usuariosPrueba = [
  {
    usuario: "admin",
    contrasena: "123456",
    email: "admin@uset.mx",
    estatus: true,
    descripcion: "Usuario administrador principal",
  },
  {
    usuario: "sistemas",
    contrasena: "123456",
    email: "sistemas@uset.mx",
    estatus: true,
    descripcion: "Usuario del departamento de sistemas",
  },
  {
    usuario: "infraestructura",
    contrasena: "123456",
    email: "infraestructura@uset.mx",
    estatus: true,
    descripcion: "Usuario para gestión de infraestructura",
  },
  {
    usuario: "inventario",
    contrasena: "123456",
    email: "inventario@uset.mx",
    estatus: true,
    descripcion: "Usuario para gestión de inventario",
  },
  {
    usuario: "test_inactivo",
    contrasena: "123456",
    email: "test@uset.mx",
    estatus: false,
    descripcion: "Usuario de prueba inactivo",
  },
];

async function crearUsuariosPrueba() {
  console.log("🔐 Iniciando creación de usuarios de prueba...");

  const BCRYPT_ROUNDS = 12;

  try {
    for (const userData of usuariosPrueba) {
      console.log(`\n👤 Procesando usuario: ${userData.usuario}`);

      // Verificar si el usuario ya existe
      const usuarioExistente = await prisma.ct_usuario.findFirst({
        where: { usuario: userData.usuario },
      });

      if (usuarioExistente) {
        console.log(
          `   ⚠️  Usuario '${userData.usuario}' ya existe, saltando...`
        );
        continue;
      }

      // Hashear contraseña
      console.log("   🔒 Hasheando contraseña...");
      const contrasenaHasheada = await bcrypt.hash(
        userData.contrasena,
        BCRYPT_ROUNDS
      );

      // Generar UUID único
      const uuidUsuario = uuidv4();
      console.log(`   🆔 UUID generado: ${uuidUsuario}`);

      // Crear usuario
      const nuevoUsuario = await prisma.ct_usuario.create({
        data: {
          usuario: userData.usuario,
          contrasena: contrasenaHasheada,
          uuid_usuario: uuidUsuario,
          email: userData.email,
          estado: userData.estatus,
          fecha_registro: new Date(),
          fecha_modificacion: new Date(),
          intentos_fallidos: 0,
          bloqueado_hasta: null,
          ultimo_login: null,
        },
      });

      console.log(
        `   ✅ Usuario creado exitosamente (ID: ${nuevoUsuario.id_ct_usuario})`
      );
      console.log(`   📧 Email: ${userData.email}`);
      console.log(
        `   📊 Estatus: ${userData.estatus === true ? "Activo" : "Inactivo"}`
      );
    }

    console.log(
      "\n🎉 ¡Todos los usuarios de prueba fueron creados exitosamente!"
    );

    // Mostrar resumen
    console.log("\n📋 RESUMEN DE USUARIOS CREADOS:");
    console.log(
      "┌─────────────────┬─────────────┬──────────────────────┬─────────┐"
    );
    console.log(
      "│ Usuario         │ Contraseña  │ Email                │ Estatus │"
    );
    console.log(
      "├─────────────────┼─────────────┼──────────────────────┼─────────┤"
    );

    for (const user of usuariosPrueba) {
      const status = user.estatus === true ? "Activo  " : "Inactivo";
      console.log(
        `│ ${user.usuario.padEnd(15)} │ ${user.contrasena.padEnd(
          11
        )} │ ${user.email.padEnd(20)} │ ${status} │`
      );
    }

    console.log(
      "└─────────────────┴─────────────┴──────────────────────┴─────────┘"
    );

    console.log("\n🔑 CREDENCIALES PARA PRUEBAS:");
    console.log("   Usuario: admin      | Contraseña: 123456");
    console.log("   Usuario: sistemas   | Contraseña: 123456");
    console.log("   Usuario: infraestructura | Contraseña: 123456");
    console.log("   Usuario: inventario | Contraseña: 123456");

    console.log("\n🧪 USUARIOS PARA TESTING:");
    console.log(
      "   Usuario: test_inactivo | Contraseña: 123456 (Estado: INACTIVO)"
    );
  } catch (error) {
    console.error("❌ Error creando usuarios de prueba:", error);

    if (error instanceof Error) {
      console.error("   Mensaje:", error.message);
      console.error("   Stack:", error.stack);
    }

    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Función para limpiar usuarios de prueba (útil para desarrollo)
async function limpiarUsuariosPrueba() {
  console.log("🧹 Limpiando usuarios de prueba...");

  try {
    const usuariosAEliminar = usuariosPrueba.map((u) => u.usuario);

    const resultado = await prisma.ct_usuario.deleteMany({
      where: {
        usuario: {
          in: usuariosAEliminar,
        },
      },
    });

    console.log(`✅ Eliminados ${resultado.count} usuarios de prueba`);
  } catch (error) {
    console.error("❌ Error limpiando usuarios:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar según el argumento pasado
async function main() {
  const comando = process.argv[2];

  switch (comando) {
    case "limpiar":
      await limpiarUsuariosPrueba();
      break;
    case "crear":
    default:
      await crearUsuariosPrueba();
      break;
  }
}

// Solo ejecutar si es llamado directamente
if (require.main === module) {
  main().catch((error) => {
    console.error("❌ Error fatal:", error);
    process.exit(1);
  });
}

export { crearUsuariosPrueba, limpiarUsuariosPrueba };
