const fs = require('fs');
const path = require('path');

console.log('🧹 Limpiando tipos de eliminar...\n');

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

function limpiarTipos(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remover líneas de tipo eliminar
    const modified = content.replace(
      /export type Eliminar\w+Input = z\.infer<typeof eliminar\w+Schema>;\s*\n/g,
      '// Ya no se usa - DELETE no requiere body\n'
    );

    if (modified !== content) {
      fs.writeFileSync(filePath, modified, 'utf8');
      console.log(`✅ Limpiado: ${path.basename(filePath)}`);
      return true;
    } else {
      console.log(`ℹ️  Sin cambios: ${path.basename(filePath)}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error en ${path.basename(filePath)}:`, error.message);
    return false;
  }
}

findSchemas(schemasDir);

let cleanedCount = 0;
for (const filePath of allFiles) {
  if (limpiarTipos(filePath)) {
    cleanedCount++;
  }
}

console.log(`\n✅ Limpieza completada!`);
console.log(`📊 Schemas limpiados: ${cleanedCount}/${allFiles.length}`);
