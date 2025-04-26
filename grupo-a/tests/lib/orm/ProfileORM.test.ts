// tests/lib/orm/ProfileORM.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import path from 'path';

// Mockear fs/promises ANTES de importarlo
vi.mock('fs/promises', () => ({
  access: vi.fn(),
  mkdir: vi.fn(),
  readdir: vi.fn(),
  readFile: vi.fn(),
  writeFile: vi.fn(),
  unlink: vi.fn()
}));

// Importar fs/promises DESPUÉS de mockearlo
import * as fs from 'fs/promises';
import type { Profile, Skill } from '../../../src/types';

// Mock para un perfil de prueba
const mockProfile: Profile = {
  id: 'testuser',
  basics: {
    name: 'Test',
    last_name: 'User',
    occupation: 'Desarrollador',
    image: {
      local: '/images/test.png',
      remote: 'https://example.com/test.png'
    },
    email: 'test@example.com',
    summary: 'Test user summary',
    location: {
      city: 'Test City',
      country: 'Test Country'
    },
    profiles: [
      {
        network: 'GitHub',
        username: 'testuser',
        url: 'https://github.com/testuser'
      }
    ]
  },
  skills: [
    {
      name: 'JavaScript',
      level: 4,
      type: 'hard',
      keywords: ['React', 'Node.js']
    },
    {
      name: 'Communication',
      level: 5,
      type: 'soft'
    }
  ],
  projects: [
    {
      name: 'Test Project',
      description: 'A test project',
      highlights: ['Feature 1', 'Feature 2'],
      url: 'https://example.com/project',
      featured: true,
      technologies: ['TypeScript', 'React']
    }
  ]
};

// Mock para un segundo perfil
const anotherProfile: Profile = {
  id: 'anothertest',
  basics: {
    name: 'Testing Again',
    last_name: 'User',
    occupation: 'Diseñador',
    image: {
      local: '/images/another.png',
      remote: 'https://example.com/another.png'
    },
    email: 'another@example.com',
    summary: 'Another test user',
    location: {
      city: 'Another City',
      country: 'Another Country'
    },
    profiles: []
  },
  skills: [
    {
      name: 'Design',
      level: 5,
      type: 'hard',
      keywords: ['Figma', 'UI/UX']
    }
  ],
  projects: [
    {
      name: 'Design Project',
      description: 'A design project',
      highlights: ['Design System'],
      url: 'https://example.com/design',
      featured: true,
      technologies: ['Figma', 'Adobe XD']
    }
  ]
};

describe('ProfileORM', () => {
  let profileORM;
  const testDir = path.join(process.cwd(), 'src/data/profiles');
  
  beforeEach(async () => {
    // Limpiar todos los mocks
    vi.clearAllMocks();
    
    // Importar ProfileORM dinámicamente para que use el mock
    const { ProfileORM } = await import('../../../src/lib/orm/ProfileORM');
    profileORM = new ProfileORM(testDir);
    
    // Configurar mocks para simular que el directorio existe
    vi.mocked(fs.access).mockResolvedValue(undefined);
    
    // Mockear readdir para simular archivos en el directorio
    vi.mocked(fs.readdir).mockResolvedValue(['testuser.json', 'anothertest.json']);
    
    // Mockear readFile para devolver perfiles mock
    vi.mocked(fs.readFile).mockImplementation((filePath) => {
      if (filePath.toString().includes('testuser.json')) {
        return Promise.resolve(JSON.stringify(mockProfile));
      } else if (filePath.toString().includes('anothertest.json')) {
        return Promise.resolve(JSON.stringify(anotherProfile));
      }
      return Promise.reject(new Error('File not found'));
    });
    
    // Mockear writeFile para que no haga nada
    vi.mocked(fs.writeFile).mockResolvedValue(undefined);
  });
  
  afterEach(() => {
    // Limpiar todos los mocks después de cada prueba
    vi.clearAllMocks();
  });
  
  describe('findByName()', () => {
    it('debe encontrar perfiles por nombre con coincidencia exacta', async () => {
      const result = await profileORM.findByName('Test', { exactMatch: true });
      
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('testuser');
      expect(result[0].basics.name).toBe('Test');
    });
    
    it('debe encontrar perfiles por nombre con coincidencia parcial', async () => {
      const result = await profileORM.findByName('Test', { exactMatch: false });
      
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('testuser');
      expect(result[1].id).toBe('anothertest');
    });
  });
  
  describe('findBySkill()', () => {
    it('debe encontrar perfiles por nombre de habilidad', async () => {
      const result = await profileORM.findBySkill('JavaScript');
      
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('testuser');
    });
    
    it('debe encontrar perfiles por palabra clave de habilidad', async () => {
      const result = await profileORM.findBySkill('React');
      
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('testuser');
    });
    
    it('debe devolver array vacío si no hay coincidencias', async () => {
      const result = await profileORM.findBySkill('Python');
      
      expect(result).toHaveLength(0);
    });
  });
  
  describe('findBySkillType()', () => {
    it('debe encontrar perfiles por tipo de habilidad hard', async () => {
      const result = await profileORM.findBySkillType('hard');
      
      expect(result).toHaveLength(2);
    });
    
    it('debe encontrar perfiles por tipo de habilidad soft', async () => {
      const result = await profileORM.findBySkillType('soft');
      
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('testuser');
    });
  });
  
  describe('addSkill()', () => {
    it('debe añadir una nueva habilidad a un perfil', async () => {
      const newSkill: Skill = {
        name: 'Python',
        level: 3,
        type: 'hard',
        keywords: ['Django', 'Flask']
      };
      
      await profileORM.addSkill('testuser', newSkill);
      
      // Verificar que se llamó a writeFile con el perfil actualizado
      expect(fs.writeFile).toHaveBeenCalled();
      const callArgs = vi.mocked(fs.writeFile).mock.calls[0];
      const writtenProfile = JSON.parse(callArgs[1] as string);
      
      expect(writtenProfile.skills).toHaveLength(3);
      expect(writtenProfile.skills[2].name).toBe('Python');
    });
    
    it('debe actualizar una habilidad existente', async () => {
      const updatedSkill: Skill = {
        name: 'JavaScript',
        level: 5,
        type: 'hard',
        keywords: ['React', 'Node.js', 'TypeScript']
      };
      
      await profileORM.addSkill('testuser', updatedSkill);
      
      // Verificar que se llamó a writeFile con el perfil actualizado
      expect(fs.writeFile).toHaveBeenCalled();
      const callArgs = vi.mocked(fs.writeFile).mock.calls[0];
      const writtenProfile = JSON.parse(callArgs[1] as string);
      
      expect(writtenProfile.skills).toHaveLength(2);
      expect(writtenProfile.skills[0].level).toBe(5);
      expect(writtenProfile.skills[0].keywords).toContain('TypeScript');
    });
  });
  
  describe('removeSkill()', () => {
    it('debe eliminar una habilidad de un perfil', async () => {
      await profileORM.removeSkill('testuser', 'JavaScript');
      
      // Verificar que se llamó a writeFile con el perfil actualizado
      expect(fs.writeFile).toHaveBeenCalled();
      const callArgs = vi.mocked(fs.writeFile).mock.calls[0];
      const writtenProfile = JSON.parse(callArgs[1] as string);
      
      expect(writtenProfile.skills).toHaveLength(1);
      expect(writtenProfile.skills[0].name).toBe('Communication');
    });
    
    it('no debe modificar el perfil si la habilidad no existe', async () => {
      await profileORM.removeSkill('testuser', 'Python');
      
      // Verificar que se llamó a writeFile con el perfil sin cambios
      expect(fs.writeFile).toHaveBeenCalled();
      const callArgs = vi.mocked(fs.writeFile).mock.calls[0];
      const writtenProfile = JSON.parse(callArgs[1] as string);
      
      expect(writtenProfile.skills).toHaveLength(2);
    });
  });
  
  describe('validateProfile()', () => {
    it('debe validar un perfil válido sin errores', () => {
      const errors = profileORM.validateProfile(mockProfile);
      expect(errors).toHaveLength(0);
    });
    
    it('debe detectar errores en perfiles inválidos', () => {
      const invalidProfile: Profile = {
        id: '',
        basics: {
          name: '',
          last_name: 'User',
          occupation: '',
          image: null as any,
          email: 'test@example.com'
        }
      };
      
      const errors = profileORM.validateProfile(invalidProfile);
      
      expect(errors.length).toBeGreaterThan(0);
      expect(errors).toContain('El nombre es obligatorio');
      expect(errors).toContain('La ocupación es obligatoria');
      expect(errors).toContain('La imagen es obligatoria');
    });
  });
  
  describe('findWithFeaturedProjects()', () => {
    it('debe encontrar perfiles con proyectos destacados', async () => {
      const result = await profileORM.findWithFeaturedProjects();
      
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('testuser');
      expect(result[1].id).toBe('anothertest');
      expect(result[0].projects).toBeDefined();
      expect(result[0].projects?.some(p => p.featured)).toBe(true);
    });
    
    it('debe devolver array vacío si no hay proyectos destacados', async () => {
      // Modificar el mock para no tener proyectos destacados
      vi.mocked(fs.readFile).mockImplementation(() => {
        const noFeaturedProfile = { ...mockProfile };
        noFeaturedProfile.projects = [{ ...noFeaturedProfile.projects![0], featured: false }];
        
        const otherNoFeaturedProfile = { ...anotherProfile };
        otherNoFeaturedProfile.projects = [{ ...otherNoFeaturedProfile.projects![0], featured: false }];
        
        return Promise.resolve(JSON.stringify(noFeaturedProfile));
      });
      
      const result = await profileORM.findWithFeaturedProjects();
      
      expect(result).toHaveLength(0);
    });
  });
  
  describe('getStats()', () => {
    it('debe calcular estadísticas correctamente', async () => {
      const stats = await profileORM.getStats();
      
      expect(stats.totalProfiles).toBe(2);
      expect(stats.totalSkills).toBe(3);
      expect(stats.totalProjects).toBe(2);
      expect(stats.featuredProjects).toBe(2);
      expect(stats.skillsByType.hard).toBe(2);
      expect(stats.skillsByType.soft).toBe(1);
    });
  });
});