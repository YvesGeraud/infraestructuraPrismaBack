/// <reference types="node" />
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed de la base de datos...");

  // Crear usuarios
  const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || "12");
  const hashedPassword = await bcrypt.hash("password123", saltRounds);

  console.log("✅ Seed completado exitosamente!");
  console
    .log
    //  `👥 Usuarios creados: ${adminUser.email}, ${regularUser.email}, ${testUser.email}`
    ();
  // console.log(`📦 Productos creados: ${products.length}`);
  // console.log(`🛒 Órdenes creadas: ${orders.length}`);
  // console.log(`📋 Items de orden creados: ${orderItems.length}`);
}

main()
  .catch((e) => {
    console.error("❌ Error durante el seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
