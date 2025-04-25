// Script para generar el hash de contraseñas compatible con SimpleHash
import crypto from 'crypto';

function generateHash(password) {
  const salt = 'secure_salt_for_development_only';
  return crypto.createHash('sha256').update(password + salt).digest('hex');
}

const password = process.argv[2];
if (!password) {
  console.error('Uso: node generate-password-hash.js <contraseña>');
  process.exit(1);
}

console.log('Contraseña:', password);
console.log('Hash:', generateHash(password));