const fs = require('fs');
const path = require('path');

console.log('🧹 Removiendo imports de eliminar...\n');

const srcDir = path.join(__dirname, '../src');
const allFiles = [];

function findFiles(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findFiles(filePath);
    } else if (file.endsWith('.controller.ts') || file.endsWith('.route.ts')) {
      allFiles.push(filePath);
    }
  }
}

function removerImports(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Remover EliminarInput del import
    const pattern1 = /^(\s*)Eliminar\w+Input,?\s*\n/gm;
    if (pattern1.test(content)) {
      content = content.replace(pattern1, '');
      modified = true;
    }

    // Remover eliminarSchema del import
    const pattern2 = /^(\s*)eliminar\w+Schema,?\s*\n/gm;
    if (pattern2.test(content)) {
      content = content.replace(pattern2, '');
      modified = true;
    }

    // Limpiar comas extras en imports
    content = content.replace(/,(\s*),/g, ',');
    content = content.replace(/\{\s*,/g, '{');
    content = content.replace(/,\s*\}/g, '}');

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Limpiado: ${path.relative(path.join(__dirname, '..'), filePath)}`);
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error(`❌ Error en ${path.basename(filePath)}:`, error.message);
    return false;
  }
}

findFiles(srcDir);

let cleanedCount = 0;
for (const filePath of allFiles) {
  if (removerImports(filePath)) {
    cleanedCount++;
  }
}

console.log(`\n✅ Limpieza completada!`);
console.log(`📊 Archivos limpiados: ${cleanedCount}/${allFiles.length}`);
