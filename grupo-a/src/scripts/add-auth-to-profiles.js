// src/scripts/add-auth-to-profiles.js
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

// Hash simplificado para contraseñas
function hashPassword(password) {
  const salt = 'secure_salt_for_development_only';
  return crypto
    .createHash('sha256')
    .update(password + salt)
    .digest('hex');
}

// Genera un username a partir del nombre
function generateUsername(name) {
  return name
    .toLowerCase()
    .replace(/\s+/g, '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

// Función principal
async function addAuthToProfiles() {
  const basePath = path.join(process.cwd(), 'src/data/profiles');
  console.log(`Buscando perfiles en: ${basePath}`);
  
  try {
    // Leer el directorio de perfiles
    const files = await fs.readdir(basePath);
    const jsonFiles = files.filter(file => file.endsWith('.json'));
    
    console.log(`Encontrados ${jsonFiles.length} archivos JSON`);
    let updatedCount = 0;
    
    // Procesar cada archivo
    for (const file of jsonFiles) {
      const filePath = path.join(basePath, file);
      console.log(`Procesando: ${file}`);
      
      // Leer el contenido del archivo
      const content = await fs.readFile(filePath, 'utf-8');
      const profile = JSON.parse(content);
      
      // Verificar si ya tiene autenticación
      if (profile.auth && profile.auth.username && profile.auth.passwordHash) {
        console.log(`- Perfil ${file} ya tiene autenticación, saltando...`);
        continue;
      }
      
      // Generar username y password hash
      const username = generateUsername(profile.basics.name);
      const passwordHash = hashPassword('password123');
      
      // Añadir campo auth
      profile.auth = {
        username,
        passwordHash,
        lastLogin: new Date().toISOString()
      };
      
      // Guardar perfil actualizado
      await fs.writeFile(filePath, JSON.stringify(profile, null, 2), 'utf-8');
      updatedCount++;
      console.log(`✅ Perfil ${file} actualizado con éxito`);
    }
    
    console.log(`\nProceso completado. ${updatedCount} perfiles actualizados.`);
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Ejecutar la función principal
addAuthToProfiles()
  .then(() => console.log('Script finalizado con éxito'))
  .catch(error => console.error('Error en script:', error));