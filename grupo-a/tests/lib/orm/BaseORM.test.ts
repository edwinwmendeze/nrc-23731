// tests/lib/orm/BaseORM.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import path from 'path';

// Mockear fs/promises ANTES de importarlo
vi.mock('fs/promises', () => ({
  access: vi.fn(),
  mkdir: vi.fn(),
  readdir: vi.fn(),
  readFile: vi.fn(),
  writeFile: vi.fn()
}));

// Importar fs/promises DESPUÉS de mockearlo
import * as fs from 'fs/promises';

// Interfaz de prueba
interface TestEntity {
  id: string;
  name: string;
}

describe('BaseORM', () => {
  let orm;
  const testDir = path.join(process.cwd(), 'data/test');
  
  beforeEach(async () => {
    // Limpiar todos los mocks
    vi.clearAllMocks();
    
    // Importar BaseORM dinámicamente para que use el mock
    const { BaseORM } = await import('../../../src/lib/orm/BaseORM');
    orm = new BaseORM<TestEntity>(testDir);
  });

  describe('initialize()', () => {
    it('debe crear el directorio si no existe', async () => {
      // Simular que el directorio no existe
      vi.mocked(fs.access).mockRejectedValueOnce(new Error('ENOENT'));
      
      await orm.initialize();
      
      // Verificar que se intentó crear el directorio
      expect(fs.mkdir).toHaveBeenCalledWith(testDir, { recursive: true });
    });
    
    it('no debe crear el directorio si ya existe', async () => {
      // Simular que el directorio existe
      vi.mocked(fs.access).mockResolvedValueOnce(undefined);
      
      await orm.initialize();
      
      // Verificar que no se intentó crear el directorio
      expect(fs.mkdir).not.toHaveBeenCalled();
    });
  });

  describe('findAll()', () => {
    it('debe devolver un array vacío si no hay archivos', async () => {
      vi.mocked(fs.readdir).mockResolvedValueOnce([]);
      
      const result = await orm.findAll();
      
      expect(result).toEqual([]);
    });
    
    it('debe cargar y parsear archivos JSON correctamente', async () => {
      // Simular archivos en el directorio
      vi.mocked(fs.readdir).mockResolvedValueOnce(['1.json', '2.json']);
      
      // Simular contenido de archivos
      vi.mocked(fs.readFile).mockImplementation((filePath) => {
        if (filePath.toString().includes('1.json')) {
          return Promise.resolve(JSON.stringify({ id: '1', name: 'Test 1' }));
        } else {
          return Promise.resolve(JSON.stringify({ id: '2', name: 'Test 2' }));
        }
      });
      
      const results = await orm.findAll();
      
      expect(results).toHaveLength(2);
      expect(results[0]).toEqual({ id: '1', name: 'Test 1' });
      expect(results[1]).toEqual({ id: '2', name: 'Test 2' });
    });
  });
});
