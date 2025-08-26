/// <reference types="node" />
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed de la base de datos...");

  // Crear usuarios
  const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || "12");
  const hashedPassword = await bcrypt.hash("password123", saltRounds);

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@ecommerce.com" },
    update: {},
    create: {
      id: 1,
      email: "admin@ecommerce.com",
      password: hashedPassword,
      firstName: "Admin",
      lastName: "User",
      role: "ADMIN",
      isActive: true,
      emailVerified: true,
    },
  });

  const regularUser = await prisma.user.upsert({
    where: { email: "user@ecommerce.com" },
    update: {},
    create: {
      id: 2,
      email: "user@ecommerce.com",
      password: hashedPassword,
      firstName: "Regular",
      lastName: "User",
      role: "USER",
      isActive: true,
      emailVerified: true,
    },
  });

  const testUser = await prisma.user.upsert({
    where: { email: "test@ecommerce.com" },
    update: {},
    create: {
      id: 3,
      email: "test@ecommerce.com",
      password: hashedPassword,
      firstName: "Test",
      lastName: "User",
      role: "USER",
      isActive: true,
      emailVerified: false,
    },
  });

  // Crear productos
  const products = await Promise.all([
    prisma.product.upsert({
      where: { sku: "IPHONE-15-PRO-001" },
      update: {},
      create: {
        id: 1,
        name: "iPhone 15 Pro",
        description:
          "El último iPhone con características avanzadas de cámara y rendimiento excepcional.",
        price: 999.99,
        stock: 50,
        sku: "IPHONE-15-PRO-001",
        category: "Electrónicos",
        brand: "Apple",
        images: ["iphone15pro-1.jpg", "iphone15pro-2.jpg"],
        isActive: true,
        isFeatured: true,
        weight: 187.0,
        dimensions: { length: 159.9, width: 76.7, height: 8.25 },
        tags: ["smartphone", "apple", "5g", "camera"],
      },
    }),

    prisma.product.upsert({
      where: { sku: "MACBOOK-AIR-M2-001" },
      update: {},
      create: {
        id: 2,
        name: "MacBook Air M2",
        description:
          "Laptop ultraligera con chip M2 para máxima eficiencia y rendimiento.",
        price: 1199.99,
        stock: 30,
        sku: "MACBOOK-AIR-M2-001",
        category: "Computadoras",
        brand: "Apple",
        images: ["macbook-air-m2-1.jpg", "macbook-air-m2-2.jpg"],
        isActive: true,
        isFeatured: true,
        weight: 1250.0,
        dimensions: { length: 304.1, width: 215.0, height: 11.3 },
        tags: ["laptop", "apple", "m2", "ultralight"],
      },
    }),

    prisma.product.upsert({
      where: { sku: "SAMSUNG-S24-001" },
      update: {},
      create: {
        id: 3,
        name: "Samsung Galaxy S24",
        description: "Flagship Android con IA integrada y cámara profesional.",
        price: 899.99,
        stock: 40,
        sku: "SAMSUNG-S24-001",
        category: "Electrónicos",
        brand: "Samsung",
        images: ["samsung-s24-1.jpg", "samsung-s24-2.jpg"],
        isActive: true,
        isFeatured: false,
        weight: 167.0,
        dimensions: { length: 147.0, width: 70.6, height: 7.6 },
        tags: ["smartphone", "android", "samsung", "ai"],
      },
    }),

    prisma.product.upsert({
      where: { sku: "SONY-WH1000XM5-001" },
      update: {},
      create: {
        id: 4,
        name: "Sony WH-1000XM5",
        description:
          "Auriculares inalámbricos con cancelación de ruido líder en la industria.",
        price: 349.99,
        stock: 25,
        sku: "SONY-WH1000XM5-001",
        category: "Audio",
        brand: "Sony",
        images: ["sony-wh1000xm5-1.jpg", "sony-wh1000xm5-2.jpg"],
        isActive: true,
        isFeatured: false,
        weight: 250.0,
        dimensions: { length: 167.0, width: 185.0, height: 71.0 },
        tags: ["headphones", "wireless", "noise-cancelling", "sony"],
      },
    }),

    prisma.product.upsert({
      where: { sku: "NIKE-AIRMAX-270-001" },
      update: {},
      create: {
        id: 5,
        name: "Nike Air Max 270",
        description:
          "Zapatillas deportivas con tecnología Air Max para máxima comodidad.",
        price: 129.99,
        stock: 100,
        sku: "NIKE-AIRMAX-270-001",
        category: "Calzado",
        brand: "Nike",
        images: ["nike-airmax-270-1.jpg", "nike-airmax-270-2.jpg"],
        isActive: true,
        isFeatured: false,
        weight: 320.0,
        dimensions: { length: 28.0, width: 10.0, height: 12.0 },
        tags: ["shoes", "sports", "nike", "airmax"],
      },
    }),
  ]);

  // Crear órdenes de ejemplo
  const orders = await Promise.all([
    // Orden 1: Usuario regular - PENDING
    prisma.order.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
        userId: regularUser.id,
        status: "PENDIENTE",
        total: 1349.98, // iPhone 15 Pro + Sony Headphones
      },
    }),

    // Orden 2: Usuario regular - CONFIRMED
    prisma.order.upsert({
      where: { id: 2 },
      update: {},
      create: {
        id: 2,
        userId: regularUser.id,
        status: "CONFIRMADO",
        total: 129.99, // Nike Air Max 270
      },
    }),

    // Orden 3: Usuario test - SHIPPED
    prisma.order.upsert({
      where: { id: 3 },
      update: {},
      create: {
        id: 3,
        userId: testUser.id,
        status: "ENVIADO",
        total: 1199.99, // MacBook Air M2
      },
    }),

    // Orden 4: Usuario test - DELIVERED
    prisma.order.upsert({
      where: { id: 4 },
      update: {},
      create: {
        id: 4,
        userId: testUser.id,
        status: "ENTREGADO",
        total: 899.99, // Samsung Galaxy S24
      },
    }),

    // Orden 5: Usuario regular - CANCELLED
    prisma.order.upsert({
      where: { id: 5 },
      update: {},
      create: {
        id: 5,
        userId: regularUser.id,
        status: "CANCELADO",
        total: 259.98, // 2x Nike Air Max 270
      },
    }),
  ]);

  // Crear items de orden
  const orderItems = await Promise.all([
    // Orden 1: iPhone 15 Pro + Sony Headphones
    prisma.orderItem.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
        orderId: 1,
        productId: 1, // iPhone 15 Pro
        quantity: 1,
        price: 999.99,
      },
    }),
    prisma.orderItem.upsert({
      where: { id: 2 },
      update: {},
      create: {
        id: 2,
        orderId: 1,
        productId: 4, // Sony WH-1000XM5
        quantity: 1,
        price: 349.99,
      },
    }),

    // Orden 2: Nike Air Max 270
    prisma.orderItem.upsert({
      where: { id: 3 },
      update: {},
      create: {
        id: 3,
        orderId: 2,
        productId: 5, // Nike Air Max 270
        quantity: 1,
        price: 129.99,
      },
    }),

    // Orden 3: MacBook Air M2
    prisma.orderItem.upsert({
      where: { id: 4 },
      update: {},
      create: {
        id: 4,
        orderId: 3,
        productId: 2, // MacBook Air M2
        quantity: 1,
        price: 1199.99,
      },
    }),

    // Orden 4: Samsung Galaxy S24
    prisma.orderItem.upsert({
      where: { id: 5 },
      update: {},
      create: {
        id: 5,
        orderId: 4,
        productId: 3, // Samsung Galaxy S24
        quantity: 1,
        price: 899.99,
      },
    }),

    // Orden 5: 2x Nike Air Max 270 (cancelada)
    prisma.orderItem.upsert({
      where: { id: 6 },
      update: {},
      create: {
        id: 6,
        orderId: 5,
        productId: 5, // Nike Air Max 270
        quantity: 2,
        price: 129.99,
      },
    }),
  ]);

  // Crear dt_escuela_alumno
  const escuelaAlumno = await prisma.dt_escuela_alumno.upsert({
    where: { id_escuela_alumno: 1 },
    update: {},
    create: {
      id_escuela_alumno: 1,
      nombre: "EMILIANA",
      app: "CAMARILLO",
      apm: "HERNANDEZ",
      curp: "CAHE510808MTLMRM09", // CURP válido de 18 caracteres
      telefono: "5555555555",
      codigo_postal: 12345,
      fecha_nacimiento: new Date("1951-08-08"),
      id_localidad: 1,
      vigente: "S", // Valor del enum EstadoVigencia
      // fecha_in y fecha_at se generan automáticamente, no los incluyas manualmente
    },
  });

  // Crear rl_escuela_alumno_grado
  const rlEscuelaAlumnoGrado = await prisma.rl_escuela_alumno_grado.upsert({
    where: { id_escuela_alumno_grado: 1 },
    update: {},
    create: {
      id_escuela_alumno_grado: 1,
      id_escuela_alumno: 1,
      id_escuela_plantel: 1,
      id_escuela_ciclo_escolar: 1,
      nivel: 1,
      grado: 1,
      intento: 1,
      id_escuela_alumno_estatus: 1,
      id_escuela_alumno_estatus_grado: 1,
    },
  });

  console.log("✅ Seed completado exitosamente!");
  console.log(
    `👥 Usuarios creados: ${adminUser.email}, ${regularUser.email}, ${testUser.email}`
  );
  console.log(`📦 Productos creados: ${products.length}`);
  console.log(`🛒 Órdenes creadas: ${orders.length}`);
  console.log(`📋 Items de orden creados: ${orderItems.length}`);
}

main()
  .catch((e) => {
    console.error("❌ Error durante el seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
