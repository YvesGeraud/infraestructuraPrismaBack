const fs = require('fs');
const path = require('path');

console.log('🧹 Removiendo uso de esquemaDeleteConUsuario...\n');

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

function removerUso(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remover esquemaEliminar completamente
    const modified = content.replace(
      /export const eliminar\w+Schema = esquemaDeleteConUsuario;\s*\n/g,
      '// Ya no se usa esquemaDeleteConUsuario - id_ct_usuario_up se obtiene del JWT\n'
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
  if (removerUso(filePath)) {
    cleanedCount++;
  }
}

console.log(`\n✅ Limpieza completada!`);
console.log(`📊 Schemas limpiados: ${cleanedCount}/${allFiles.length}`);
