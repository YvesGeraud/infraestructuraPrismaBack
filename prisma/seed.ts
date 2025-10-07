/// <reference types="node" />
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed de la base de datos...");

  // ===== 1. CREAR USUARIOS PRIMERO =====
  console.log("👥 Creando usuarios...");
  
  const usuariosPrueba = [
    {
      usuario: "admin",
      contrasena: "123456",
      email: "admin@uset.mx",
      estado: true,
      descripcion: "Usuario administrador principal",
    },
    {
      usuario: "sistemas",
      contrasena: "123456",
      email: "sistemas@uset.mx",
      estado: true,
      descripcion: "Usuario del departamento de sistemas",
    },
    {
      usuario: "infraestructura",
      contrasena: "123456",
      email: "infraestructura@uset.mx",
      estado: true,
      descripcion: "Usuario para gestión de infraestructura",
    },
    {
      usuario: "inventario",
      contrasena: "123456",
      email: "inventario@uset.mx",
      estado: true,
      descripcion: "Usuario para gestión de inventario",
    },
    {
      usuario: "test_inactivo",
      contrasena: "123456",
      email: "test_inactivo@uset.mx",
      estado: false,
      descripcion: "Usuario de prueba inactivo",
    },
  ];

  const usuariosCreados = [];
  
  for (const userData of usuariosPrueba) {
    // Verificar si el usuario ya existe
    const usuarioExistente = await prisma.ct_usuario.findUnique({
      where: { usuario: userData.usuario },
    });

    if (usuarioExistente) {
      console.log(`   ⚠️  Usuario '${userData.usuario}' ya existe, saltando...`);
      usuariosCreados.push(usuarioExistente);
      continue;
    }

    // Hashear contraseña
    const contrasenaHasheada = await bcrypt.hash(userData.contrasena, 10);
    
    // Crear usuario
    const nuevoUsuario = await prisma.ct_usuario.create({
      data: {
        usuario: userData.usuario,
        contrasena: contrasenaHasheada,
        uuid_usuario: uuidv4(),
        email: userData.email,
        estado: userData.estado,
        fecha_registro: new Date(),
        intentos_fallidos: 0,
        bloqueado_hasta: null,
        ultimo_login: null,
      },
    });

    console.log(`   ✅ Usuario '${userData.usuario}' creado exitosamente (ID: ${nuevoUsuario.id_ct_usuario})`);
    usuariosCreados.push(nuevoUsuario);
  }

  // ===== 2. CREAR ENTIDADES =====
  console.log("🌎 Creando entidades...");

  const Entidades = await Promise.all([
    prisma.ct_entidad.upsert({
      where: { id_ct_entidad: 1 },
      update: {},
      create: {
        id_ct_entidad: 1,
        nombre: "Aguascalientes",
        abreviatura: "Ags.",
        estado: true,
        id_ct_usuario_in: usuariosCreados[0].id_ct_usuario, // admin
      },
    }),
    prisma.ct_entidad.upsert({
      where: { id_ct_entidad: 2 },
      update: {},
      create: {
        id_ct_entidad: 2,
        nombre: "Baja California",
        abreviatura: "BC",
        estado: true,
        id_ct_usuario_in: usuariosCreados[0].id_ct_usuario, // admin
      },
    }),
  ]);

  // ===== 3. CREAR MUNICIPIOS =====
  console.log("🏘️ Creando municipios...");

  const Municipios = await Promise.all([
    prisma.ct_municipio.upsert({
      where: { id_ct_municipio: 1 },
      update: {},
      create: {
        id_ct_municipio: 1,
        cve_mun: "1",
        nombre: "Aguascalientes",
        id_ct_entidad: 1,
        estado: true,
        id_ct_usuario_in: usuariosCreados[0].id_ct_usuario, // admin
      },
    }), 
    prisma.ct_municipio.upsert({
      where: { id_ct_municipio: 2 },
      update: {},
      create: {
        id_ct_municipio: 2,
        cve_mun: "2",
        nombre: "Asientos",
        id_ct_entidad: 1,
        estado: true,
        id_ct_usuario_in: usuariosCreados[0].id_ct_usuario, // admin
      },
    }), 
  ]);

  // ===== 4. CREAR LOCALIDADES =====
  console.log("🏠 Creando localidades...");

  const Localidades = await Promise.all([
    prisma.ct_localidad.upsert({
      where: { id_ct_localidad: 1 },
      update: {},
      create: {
        id_ct_localidad: 1,
        nombre: "Aguascalientes",
        ambito: "U",
        id_ct_municipio: 1,
        estado: true,
        id_ct_usuario_in: usuariosCreados[0].id_ct_usuario, // admin
      },
    }), 
    prisma.ct_localidad.upsert({
      where: { id_ct_localidad: 2 },
      update: {},
      create: {
        id_ct_localidad: 2,
        nombre: "Granja Adelita",
        ambito: "R",
        id_ct_municipio: 1,
        estado: true,
        id_ct_usuario_in: usuariosCreados[0].id_ct_usuario, // admin
      },
    }), 
  ]);

  console.log("\n📊 RESUMEN DEL SEED:");
  console.log("✅ Seed completado exitosamente!");
  console.log(`👥 Usuarios creados: ${usuariosCreados.length}`);
  console.log(`🌎 Entidades creadas: ${Entidades.length}`);
  console.log(`🏘️ Municipios creados: ${Municipios.length}`);
  console.log(`🏠 Localidades creadas: ${Localidades.length}`);
  
  console.log("\n🔑 CREDENCIALES DE PRUEBA:");
  console.log("Usuario: admin | Contraseña: 123456");
  console.log("Usuario: sistemas | Contraseña: 123456");
  console.log("Usuario: infraestructura | Contraseña: 123456");
  console.log("Usuario: inventario | Contraseña: 123456");

}

main()
  .catch((e) => {
    console.error("❌ Error durante el seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
