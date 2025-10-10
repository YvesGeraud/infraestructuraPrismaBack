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

  const usuariosCreados: any[] = [];
  
  for (const userData of usuariosPrueba) {
    // Verificar si el usuario ya existe
    const usuarioExistente = await prisma.ct_usuario.findUnique({
      where: { usuario: userData.usuario },
    });

    if (usuarioExistente) {
      console.log(`   ⚠️  Usuario '${userData.usuario}' ya existe, saltando...`);
      usuariosCreados.push(usuarioExistente as any);
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
        id_ct_usuario_in: 1, // admin
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
        id_ct_usuario_in: 1, // admin
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
        id_ct_usuario_in: 1, // admin
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
        id_ct_usuario_in: 1, // admin
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
        id_ct_usuario_in: 1, // admin
      },
    }), 
  ]);

  // ===== 4. CREAR SOSTENIMIENTOS =====
  console.log("🏠 Creando sostenimientos...");

  const Sostenimientos = await Promise.all([
    prisma.ct_infraestructura_sostenimiento.upsert({
      where: { id_ct_infraestructura_sostenimiento: 1 },
      update: {},
      create: {
        id_ct_infraestructura_sostenimiento: 1,
        sostenimiento: "ESTATAL",
        estado: true,
        id_ct_usuario_in: 1, // admin
      },
    }), 
    prisma.ct_infraestructura_sostenimiento.upsert({
      where: { id_ct_infraestructura_sostenimiento: 2 },
      update: {},
      create: {
        id_ct_infraestructura_sostenimiento: 2,
        sostenimiento: "FEDERAL",
        estado: true,
        id_ct_usuario_in: 1, // admin
      },
    }), 
    prisma.ct_infraestructura_sostenimiento.upsert({
      where: { id_ct_infraestructura_sostenimiento: 3 },
      update: {},
      create: {
        id_ct_infraestructura_sostenimiento: 3,
        sostenimiento: "PARTICULAR",
        estado: true,
        id_ct_usuario_in: 1, // admin
      },
    }), 
    prisma.ct_infraestructura_sostenimiento.upsert({
      where: { id_ct_infraestructura_sostenimiento: 4 },
      update: {},
      create: {
        id_ct_infraestructura_sostenimiento: 4,
        sostenimiento: "FEDERAL TRANSFERIDO",
        estado: true,
        id_ct_usuario_in: 1, // admin
      },
    }), 
    prisma.ct_infraestructura_sostenimiento.upsert({
      where: { id_ct_infraestructura_sostenimiento: 5 },
      update: {},
      create: {
        id_ct_infraestructura_sostenimiento: 5,
        sostenimiento: "AUTONOMO",
        estado: true,
        id_ct_usuario_in: 1, // admin
      },
    }), 
    prisma.ct_infraestructura_sostenimiento.upsert({
      where: { id_ct_infraestructura_sostenimiento: 6 },
      update: {},
      create: {
        id_ct_infraestructura_sostenimiento: 6,
        sostenimiento: "SUBSIDIO",
        estado: true,
        id_ct_usuario_in: 1, // admin
      },
    }), 
  ]);

  // ===== 5. CREAR TIPOS DE ESCUELAS =====
  console.log("🏠 Creando tipos de escuelas...");

  const TiposDeEscuelas = await Promise.all([
    prisma.ct_infraestructura_tipo_escuela.upsert({
      where: { id_ct_infraestructura_tipo_escuela: 1 },
      update: {},
      create: {
        id_ct_infraestructura_tipo_escuela: 1,
        tipo_escuela: "CURSOS COMUNITARIOS",
        clave: "KR",
        estado: true,
        id_ct_usuario_in: 1, // admin
      },
    }), 
    prisma.ct_infraestructura_tipo_escuela.upsert({
      where: { id_ct_infraestructura_tipo_escuela: 2 },
      update: {},
      create: {
        id_ct_infraestructura_tipo_escuela: 2,
        tipo_escuela: "PREESCOLAR INDIGENA",
        clave: "CC",
        estado: true,
        id_ct_usuario_in: 1, // admin
      },
    }), 
    prisma.ct_infraestructura_tipo_escuela.upsert({
      where: { id_ct_infraestructura_tipo_escuela: 3 },
      update: {},
      create: {
        id_ct_infraestructura_tipo_escuela: 3,
        tipo_escuela: "SECUNDARIA PARA TRABAJADORES",
        clave: "SN",
        estado: true,
        id_ct_usuario_in: 1, // admin
      },
    }), 
    prisma.ct_infraestructura_tipo_escuela.upsert({
      where: { id_ct_infraestructura_tipo_escuela: 4 },
      update: {},
      create: {
        id_ct_infraestructura_tipo_escuela: 4,
        tipo_escuela: "PREESCOLAR",
        clave: "JN",
        estado: true,
        id_ct_usuario_in: 1, // admin
      },
    }), 
    prisma.ct_infraestructura_tipo_escuela.upsert({
      where: { id_ct_infraestructura_tipo_escuela: 5 },
      update: {},
      create: {
        id_ct_infraestructura_tipo_escuela: 5,
        tipo_escuela: "CENTRO DE DESARROLLO INFANTIL (CENDI)",
        clave: "DI",
        estado: true,
        id_ct_usuario_in: 1, // admin
      },
    }), 
    prisma.ct_infraestructura_tipo_escuela.upsert({
      where: { id_ct_infraestructura_tipo_escuela: 6 },
      update: {},
      create: {
        id_ct_infraestructura_tipo_escuela: 6,
        tipo_escuela: "TELESECUNDARIA",
        clave: "TV",
        estado: true,
        id_ct_usuario_in: 1, // admin
      },
    }), 
    prisma.ct_infraestructura_tipo_escuela.upsert({
      where: { id_ct_infraestructura_tipo_escuela: 7 },
      update: {},
      create: {
        id_ct_infraestructura_tipo_escuela: 7,
        tipo_escuela: "PRIMARIA GENERAL",
        clave: "PR",
        estado: true,
        id_ct_usuario_in: 1, // admin
      },
    }), 
    prisma.ct_infraestructura_tipo_escuela.upsert({
      where: { id_ct_infraestructura_tipo_escuela: 8 },
      update: {},
      create: {
        id_ct_infraestructura_tipo_escuela: 8,
        tipo_escuela: "PRIMARIA INDIGENA",
        clave: "PB",
        estado: true,
        id_ct_usuario_in: 1, // admin
      },
    }), 
    prisma.ct_infraestructura_tipo_escuela.upsert({
      where: { id_ct_infraestructura_tipo_escuela: 9 },
      update: {},
      create: {
        id_ct_infraestructura_tipo_escuela: 9,
        tipo_escuela: "SECUNDARIA GENERAL",
        clave: "ES",
        estado: true,
        id_ct_usuario_in: 1, // admin
      },
    }), 
    prisma.ct_infraestructura_tipo_escuela.upsert({
      where: { id_ct_infraestructura_tipo_escuela: 10 },
      update: {},
      create: {
        id_ct_infraestructura_tipo_escuela: 10,
        tipo_escuela: "SECUNDARIA TECNICA",
        clave: "ST",
        estado: true,
        id_ct_usuario_in: 1, // admin
      },
    }), 
    prisma.ct_infraestructura_tipo_escuela.upsert({
      where: { id_ct_infraestructura_tipo_escuela: 11 },
      update: {},
      create: {
        id_ct_infraestructura_tipo_escuela: 11,
        tipo_escuela: "PRIMARIA GENERAL (INTERNADOS)",
        clave: "PR",
        estado: true,
        id_ct_usuario_in: 1, // admin
      },
    }), 
    prisma.ct_infraestructura_tipo_escuela.upsert({
      where: { id_ct_infraestructura_tipo_escuela: 12 },
      update: {},
      create: {
        id_ct_infraestructura_tipo_escuela: 12,
        tipo_escuela: "CAPEP CENTRO DE ATN PSICOP EDUC PREESC",
        clave: "LS",
        estado: true,
        id_ct_usuario_in: 1, // admin
      },
    }), 
    prisma.ct_infraestructura_tipo_escuela.upsert({
      where: { id_ct_infraestructura_tipo_escuela: 13 },
      update: {},
      create: {
        id_ct_infraestructura_tipo_escuela: 13,
        tipo_escuela: "CENTRO DE ATENCION MULTIPLE PRIMARIA",
        clave: "ML",
        estado: true,
        id_ct_usuario_in: 1, // admin
      },
    }), 
    prisma.ct_infraestructura_tipo_escuela.upsert({
      where: { id_ct_infraestructura_tipo_escuela: 14 },
      update: {},
      create: {
        id_ct_infraestructura_tipo_escuela: 14,
        tipo_escuela: "SECUNDARIA TECNICA AGROPECUARIA",
        clave: "ST",
        estado: true,
        id_ct_usuario_in: 1, // admin
      },
    }), 
    prisma.ct_infraestructura_tipo_escuela.upsert({
      where: { id_ct_infraestructura_tipo_escuela: 15 },
      update: {},
      create: {
        id_ct_infraestructura_tipo_escuela: 15,
        tipo_escuela: "CAICS",
        clave: "CA",
        estado: true,
        id_ct_usuario_in: 1, // admin
      },
    }), 
    prisma.ct_infraestructura_tipo_escuela.upsert({
      where: { id_ct_infraestructura_tipo_escuela: 16 },
      update: {},
      create: {
        id_ct_infraestructura_tipo_escuela: 16,
        tipo_escuela: "CENTRO DE ATENCION MULTIPLE PREESCOLAR",
        clave: "ML",
        estado: true,
        id_ct_usuario_in: 1, // admin
      },
    }), 
    prisma.ct_infraestructura_tipo_escuela.upsert({
      where: { id_ct_infraestructura_tipo_escuela: 18 /*Ya se que falta el 17 asi me lo dieron*/ },
      update: {},
      create: {
        id_ct_infraestructura_tipo_escuela: 18,
        tipo_escuela: "ALBERGUE ESCOLAR",
        clave: "TA",
        estado: true,
        id_ct_usuario_in: 1, // admin
      },
    }), 
    prisma.ct_infraestructura_tipo_escuela.upsert({
      where: { id_ct_infraestructura_tipo_escuela: 19 },
      update: {},
      create: {
        id_ct_infraestructura_tipo_escuela: 19,
        tipo_escuela: "CENTRO DE EDUCACIÓN EXTRAESCOLAR (CEDEX)",
        clave: "DE",
        estado: true,
        id_ct_usuario_in: 1, // admin
      },
    }), 
    prisma.ct_infraestructura_tipo_escuela.upsert({
      where: { id_ct_infraestructura_tipo_escuela: 20 },
      update: {},
      create: {
        id_ct_infraestructura_tipo_escuela: 20,
        tipo_escuela: "CENTRO DE RECURSOS E INFORMACIÓN PARA LA INTEGRACIÓN EDUCATIVA (CRIE)",
        clave: "FR",
        estado: true,
        id_ct_usuario_in: 1, // admin
      },
    }), 
    prisma.ct_infraestructura_tipo_escuela.upsert({
      where: { id_ct_infraestructura_tipo_escuela: 21 },
      update: {},
      create: {
        id_ct_infraestructura_tipo_escuela: 21,
        tipo_escuela: "CENTRO DE EDUCACIÓN INDIGENA INICIAL (CEII)",
        clave: "DI",
        estado: true,
        id_ct_usuario_in: 1, // admin
      },
    }), 
    prisma.ct_infraestructura_tipo_escuela.upsert({
      where: { id_ct_infraestructura_tipo_escuela: 22 },
      update: {},
      create: {
        id_ct_infraestructura_tipo_escuela: 22,
        tipo_escuela: "MISIÓN CULTURAL",
        clave: "HM",
        estado: true,
        id_ct_usuario_in: 1, // admin
      },
    }), 
    prisma.ct_infraestructura_tipo_escuela.upsert({
      where: { id_ct_infraestructura_tipo_escuela: 23 },
      update: {},
      create: {
        id_ct_infraestructura_tipo_escuela: 23,
        tipo_escuela: "UNIDAD DE SERVICIOS DE APOYO A LA EDUCACIÓN REGULAR (USAER)",
        clave: "FU",
        estado: true,
        id_ct_usuario_in: 1, // admin
      },
    }), 
    prisma.ct_infraestructura_tipo_escuela.upsert({
      where: { id_ct_infraestructura_tipo_escuela: 24 },
      update: {},
      create: {
        id_ct_infraestructura_tipo_escuela: 24,
        tipo_escuela: "CENTRO DE ATENCION MULTIPLE SECUNDARIA",
        clave: "ML",
        estado: true,
        id_ct_usuario_in: 1, // admin
      },
    }), 
    prisma.ct_infraestructura_tipo_escuela.upsert({
      where: { id_ct_infraestructura_tipo_escuela: 25 },
      update: {},
      create: {
        id_ct_infraestructura_tipo_escuela: 25,
        tipo_escuela: "MEDIA SUPERIOR",
        clave: "MS",
        estado: true,
        id_ct_usuario_in: 1, // admin
      },
    }), 
    prisma.ct_infraestructura_tipo_escuela.upsert({
      where: { id_ct_infraestructura_tipo_escuela: 26 },
      update: {},
      create: {
        id_ct_infraestructura_tipo_escuela: 26,
        tipo_escuela: "OTRO",
        clave: "OT",
        estado: true,
        id_ct_usuario_in: 1, // admin
      },
    }), 
    prisma.ct_infraestructura_tipo_escuela.upsert({
      where: { id_ct_infraestructura_tipo_escuela: 27 },
      update: {},
      create: {
        id_ct_infraestructura_tipo_escuela: 27,
        tipo_escuela: "SUPERIOR",
        clave: "S",
        estado: true,
        id_ct_usuario_in: 1, // admin
      },
    }), 
    prisma.ct_infraestructura_tipo_escuela.upsert({
      where: { id_ct_infraestructura_tipo_escuela: 28 },
      update: {},
      create: {
        id_ct_infraestructura_tipo_escuela: 28,
        tipo_escuela: "CAPACITACIÓN",
        clave: "FT",
        estado: true,
        id_ct_usuario_in: 1, // admin
      },
    }), 
  ]);

  // ===== 6. CREAR TIPOS DE INSTANCIAS =====
  console.log("🏠 Creando sostenimientos...");

  const TiposDeInstancias = await Promise.all([
    prisma.ct_infraestructura_tipo_instancia.upsert({
      where: { id_ct_infraestructura_tipo_instancia: 1 },
      update: {},
      create: {
        id_ct_infraestructura_tipo_instancia: 1,
        nombre: "DIRECCIÓN",
        estado: true,
        id_ct_usuario_in: 1, // admin
      },
    }), 
    prisma.ct_infraestructura_tipo_instancia.upsert({
      where: { id_ct_infraestructura_tipo_instancia: 2 },
      update: {},
      create: {
        id_ct_infraestructura_tipo_instancia: 2,
        nombre: "DEPARTAMENTO",
        estado: true,
        id_ct_usuario_in: 1, // admin
      },
    }), 
    prisma.ct_infraestructura_tipo_instancia.upsert({
      where: { id_ct_infraestructura_tipo_instancia: 3 },
      update: {},
      create: {
        id_ct_infraestructura_tipo_instancia: 3,
        nombre: "AREA",
        estado: true,
        id_ct_usuario_in: 1, // admin
      },
    }), 
    prisma.ct_infraestructura_tipo_instancia.upsert({
      where: { id_ct_infraestructura_tipo_instancia: 4 },
      update: {},
      create: {
        id_ct_infraestructura_tipo_instancia: 4,
        nombre: "JEFE DE SECTOR",
        estado: true,
        id_ct_usuario_in: 1, // admin
      },
    }), 
    prisma.ct_infraestructura_tipo_instancia.upsert({
      where: { id_ct_infraestructura_tipo_instancia: 5 },
      update: {},
      create: {
        id_ct_infraestructura_tipo_instancia: 5,
        nombre: "SUPERVISOR",
        estado: true,
        id_ct_usuario_in: 1, // admin
      },
    }), 
    prisma.ct_infraestructura_tipo_instancia.upsert({
      where: { id_ct_infraestructura_tipo_instancia: 6 },
      update: {},
      create: {
        id_ct_infraestructura_tipo_instancia: 6,
        nombre: "ESCUELA",
        estado: true,
        id_ct_usuario_in: 1, // admin
      },
    }), 
    prisma.ct_infraestructura_tipo_instancia.upsert({
      where: { id_ct_infraestructura_tipo_instancia: 7 },
      update: {},
      create: {
        id_ct_infraestructura_tipo_instancia: 7,
        nombre: "ANEXO",
        estado: true,
        id_ct_usuario_in: 1, // admin
      },
    }), 
  ]);

  // ===== 6. CREAR BAJAS =====
  console.log("🏠 Creando sostenimientos...");

  const Bajas = await Promise.all([
    prisma.ct_inventario_baja.upsert({
      where: { id_ct_inventario_baja: 1 },
      update: {},
      create: {
        id_ct_inventario_baja: 1,
        nombre: "ROBO",
        estado: true,
        id_ct_usuario_in: 1, // admin
      },
    }), 
    prisma.ct_inventario_baja.upsert({
      where: { id_ct_inventario_baja: 2 },
      update: {},
      create: {
        id_ct_inventario_baja: 2,
        nombre: "EXTRAVIO",
        estado: true,
        id_ct_usuario_in: 1, // admin
      },
    }), 
    prisma.ct_inventario_baja.upsert({
      where: { id_ct_inventario_baja: 3 },
      update: {},
      create: {
        id_ct_inventario_baja: 3,
        nombre: "SINIESTRO",
        estado: true,
        id_ct_usuario_in: 1, // admin
      },
    }), 
    prisma.ct_inventario_baja.upsert({
      where: { id_ct_inventario_baja: 4 },
      update: {},
      create: {
        id_ct_inventario_baja: 4,
        nombre: "ENEJA-DONACION",
        estado: true,
        id_ct_usuario_in: 1, // admin
      },
    }), 
    prisma.ct_inventario_baja.upsert({
      where: { id_ct_inventario_baja: 5 },
      update: {},
      create: {
        id_ct_inventario_baja: 5,
        nombre: "ENEJA-VENTA",
        estado: true,
        id_ct_usuario_in: 1, // admin
      },
    }), 
    prisma.ct_inventario_baja.upsert({
      where: { id_ct_inventario_baja: 6 },
      update: {},
      create: {
        id_ct_inventario_baja: 6,
        nombre: "DESTRUCCIÓN",
        estado: true,
        id_ct_usuario_in: 1, // admin
      },
    }), 
    prisma.ct_inventario_baja.upsert({
      where: { id_ct_inventario_baja: 7 },
      update: {},
      create: {
        id_ct_inventario_baja: 7,
        nombre: "OBSOLETO",
        estado: true,
        id_ct_usuario_in: 1, // admin
      },
    }), 
  ]);

  console.log("\n📊 RESUMEN DEL SEED:");
  console.log("✅ Seed completado exitosamente!");
  console.log(`👥 Usuarios creados: ${usuariosCreados.length}`);
  console.log(`🌎 Entidades creadas: ${Entidades.length}`);
  console.log(`🏘️ Municipios creados: ${Municipios.length}`);
  console.log(`🏠 Localidades creadas: ${Localidades.length}`);
  console.log(`🏠 Sostenimientos creados: ${Sostenimientos.length}`);
  console.log(`🏠 Tipos de escuelas creados: ${TiposDeEscuelas.length}`);
  console.log(`🏠 Tipos de instancias creadas: ${TiposDeInstancias.length}`);
  console.log(`🏠 Bajas creadas: ${Bajas.length}`);
  
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
