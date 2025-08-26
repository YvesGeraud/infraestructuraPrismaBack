#!/usr/bin/env node

/**
 * Script de prueba para el sistema de diagnóstico
 * Úsalo para depurar problemas del sistema
 */

import {
  realizarDiagnosticoSistema,
  obtenerInfoUsuarioSistema,
  mostrarDiagnosticoCompleto,
} from "../src/utils/diagnosticoSistema";

console.log("🔧 ===== SCRIPT DE DIAGNÓSTICO CEDEX =====\n");

// Información básica del usuario
console.log("1️⃣ Información del usuario del sistema:");
const infoUsuario = obtenerInfoUsuarioSistema();
console.log(JSON.stringify(infoUsuario, null, 2));

// Diagnóstico completo visual
console.log("\n2️⃣ Diagnóstico completo:");
const diagnostico = mostrarDiagnosticoCompleto();

// Análisis de problemas
console.log("3️⃣ Análisis de problemas:");
const problemas = [];

if (diagnostico.usuario.uid === 0) {
  problemas.push("⚠️  CRÍTICO: Ejecutándose como root");
}

if (!diagnostico.permisos.directorioUploads) {
  problemas.push("❌ No se puede escribir en uploads");
}

if (!diagnostico.permisos.puedeEscribirLogs) {
  problemas.push("❌ No se puede escribir logs");
}

if (diagnostico.proceso.memoriaUsada > 512) {
  problemas.push(
    `⚠️  Alto uso de memoria: ${diagnostico.proceso.memoriaUsada} MB`
  );
}

if (problemas.length === 0) {
  console.log("✅ No se encontraron problemas críticos");
} else {
  console.log("Problemas encontrados:");
  problemas.forEach((problema) => console.log(`   ${problema}`));
}

// Comandos útiles para debugging
console.log("\n4️⃣ Comandos útiles para debugging:");

if (process.platform !== "win32") {
  console.log("   # Ver usuario actual:");
  console.log("   id");
  console.log("   whoami");

  console.log("\n   # Ver permisos de directorios:");
  console.log("   ls -la uploads/");
  console.log("   ls -la logs/");

  if (diagnostico.usuario.uid === 0) {
    console.log("\n   # Crear usuario específico para la app:");
    console.log("   sudo useradd -r -s /bin/false cedex-app");
    console.log("   sudo chown -R cedex-app:cedex-app .");
  }
} else {
  console.log("   # Sistema Windows - usar:");
  console.log("   whoami");
  console.log("   dir uploads");
  console.log("   icacls uploads");
}

console.log("\n=====================================");
