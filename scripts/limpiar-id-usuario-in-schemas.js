const fs = require('fs');
const path = require('path');

console.log('🧹 Limpiando id_ct_usuario_in de schemas de CREACIÓN...\n');

// Buscar todos los schemas
const schemasDir = path.join(__dirname, '../src/schemas');
const allFiles = [];

function findSchemas(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findSchemas(filePath);
    } else if (file.endsWith('.schema.ts')) {
      allFiles.push(filePath);
    }
  }
}

function limpiarSchema(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Patrón 1: Remover línea completa de id_ct_usuario_in en schemas de crear
    const patronLinea = /\s*id_ct_usuario_in:\s*esquemaUsuarioCreacion,?\s*\n/g;
    if (patronLinea.test(content)) {
      content = content.replace(patronLinea, '');
      modified = true;
    }

    // Patrón 2: Agregar comentario si no existe
    content = content.replace(
      /(export const crear\w+Schema = z\.object\(\{[^}]*)(estado: esquemaEstadoRequerido,?)\s*\n/g,
      (match, before, estado) => {
        if (!match.includes('id_ct_usuario_in se obtiene')) {
          modified = true;
          return `${before}${estado}\n  // id_ct_usuario_in se obtiene automáticamente del JWT\n`;
        }
        return match;
      }
    );

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Limpiado: ${filePath}`);
      return true;
    } else {
      console.log(`ℹ️  Sin cambios: ${filePath}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error en ${filePath}:`, error.message);
    return false;
  }
}

findSchemas(schemasDir);

console.log(`📁 Encontrados ${allFiles.length} schemas\n`);

let cleanedCount = 0;
for (const filePath of allFiles) {
  if (limpiarSchema(filePath)) {
    cleanedCount++;
  }
}

console.log(`\n✅ Limpieza completada!`);
console.log(`📊 Schemas limpiados: ${cleanedCount}/${allFiles.length}`);
console.log(`\n📝 Todos los schemas de creación ahora obtienen id_ct_usuario_in del JWT automáticamente.`);
