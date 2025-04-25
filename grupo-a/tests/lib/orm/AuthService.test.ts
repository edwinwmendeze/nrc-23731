// tests/lib/services/AuthService.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import path from 'path';

// Mock fs/promises
vi.mock('fs/promises', () => ({
  access: vi.fn(),
  mkdir: vi.fn(),
  readdir: vi.fn(),
  readFile: vi.fn(),
  writeFile: vi.fn()
}));

// Importar fs/promises después de mockearlo
import * as fs from 'fs/promises';
import { ProfileORM } from '../../../src/lib/orm/ProfileORM';

describe('AuthService', () => {
  let authService;
  
  beforeEach(async () => {
    // Limpiar mocks
    vi.clearAllMocks();
    
    // Importar el servicio dinámicamente
    const { AuthService } = await import('../../../src/lib/services/AuthService.ts');
    authService = new AuthService();
    
    // Mock de perfil con credenciales
    vi.mocked(fs.readFile).mockImplementation((filePath) => {
      if (filePath.toString().includes('EdwinMendez.json')) {
        const profile = {
          id: 'EdwinMendez',
          basics: {
            name: 'Edwin Wilson',
            last_name: 'Méndez Echevarría',
            email: '45088035@continental.edu.pe'
          },
          auth: {
            username: 'edwin',
            passwordHash: '$2a$10$XnB7bBB6NrZIHiZR6Jtb8u2FpGrfQvGfFUh4LpGZ/MQLZEfmB.EAa' // "password123"
          }
        };
        return Promise.resolve(JSON.stringify(profile));
      }
      return Promise.reject(new Error('File not found'));
    });
  });

  describe('login()', () => {
    it('debe autenticar un usuario con credenciales correctas', async () => {
      const result = await authService.login('edwin', 'password123');
      
      expect(result.success).toBe(true);
      expect(result.profile.id).toBe('EdwinMendez');
      expect(result.token).toBeDefined();
    });
    
    it('debe rechazar credenciales incorrectas', async () => {
      const result = await authService.login('edwin', 'wrongpassword');
      
      expect(result.success).toBe(false);
      expect(result.message).toBe('Credenciales inválidas');
      expect(result.token).toBeUndefined();
    });
    
    it('debe rechazar usuarios inexistentes', async () => {
      const result = await authService.login('nonexistent', 'password123');
      
      expect(result.success).toBe(false);
      expect(result.message).toBe('Usuario no encontrado');
      expect(result.token).toBeUndefined();
    });
  });

  describe('register()', () => {
    it('debe registrar un nuevo usuario', async () => {
      // Configurar mock para ProfileORM
      vi.mock('../../../src/lib/orm/ProfileORM', () => ({
        ProfileORM: {
          getInstance: vi.fn().mockReturnValue({
            findByEmail: vi.fn().mockResolvedValue(null),
            findAll: vi.fn().mockResolvedValue([]),
            save: vi.fn().mockImplementation(profile => Promise.resolve(profile))
          })
        }
      }));
      
      const result = await authService.register({
        username: 'newuser',
        password: 'securepass',
        email: 'new@example.com',
        name: 'New',
        lastName: 'User'
      });
      
      expect(result.success).toBe(true);
      expect(result.profile).toBeDefined();
      expect(result.profile.auth.username).toBe('newuser');
      expect(result.profile.auth.passwordHash).toBeDefined();
      expect(result.profile.auth.passwordHash).not.toBe('securepass'); // Contraseña hasheada
    });
    
    it('debe rechazar registro con username existente', async () => {
      // Configurar mock para ProfileORM
      vi.mock('../../../src/lib/orm/ProfileORM', () => ({
        ProfileORM: {
          getInstance: vi.fn().mockReturnValue({
            findByField: vi.fn().mockResolvedValue([{ id: 'existingUser' }]),
            findAll: vi.fn().mockResolvedValue([])
          })
        }
      }));
      
      const result = await authService.register({
        username: 'edwin', // Username existente
        password: 'securepass',
        email: 'new@example.com',
        name: 'New',
        lastName: 'User'
      });
      
      expect(result.success).toBe(false);
      expect(result.message).toBe('El nombre de usuario ya está en uso');
    });
  });

  describe('verifyToken()', () => {
    it('debe verificar un token válido', async () => {
      // Primero obtener un token
      const loginResult = await authService.login('edwin', 'password123');
      
      // Verificar el token
      const verifyResult = await authService.verifyToken(loginResult.token);
      
      expect(verifyResult.valid).toBe(true);
      expect(verifyResult.profileId).toBe('EdwinMendez');
    });
    
    it('debe rechazar un token inválido', async () => {
      const verifyResult = await authService.verifyToken('invalid.token.here');
      
      expect(verifyResult.valid).toBe(false);
    });
  });
});