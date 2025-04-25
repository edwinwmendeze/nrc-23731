// src/lib/orm/BaseORM.ts (refactorizado)
import * as fs from 'fs/promises';
import path from 'path';

export class BaseORM<T extends { id: string }> {
  private basePath: string;
  private initialized: boolean = false;
  private cache: Map<string, T> = new Map();
  
  constructor(basePath: string) {
    this.basePath = basePath;
  }
  
  // Refactorizado para comprobar si ya está inicializado
  async initialize(): Promise<void> {
    if (this.initialized) return;
    
    try {
      await fs.access(this.basePath);
    } catch (error) {
      // Directorio no existe, lo creamos
      await fs.mkdir(this.basePath, { recursive: true });
    }
    
    this.initialized = true;
  }
  
  // Implementación de findAll con caché
  async findAll(options: { useCache?: boolean } = {}): Promise<T[]> {
    const { useCache = true } = options;
    
    try {
      await this.initialize();
      
      const files = await fs.readdir(this.basePath);
      const jsonFiles = files.filter(file => file.endsWith('.json'));
      
      const entities: T[] = [];
      for (const file of jsonFiles) {
        const id = path.basename(file, '.json');
        
        if (useCache && this.cache.has(id)) {
          entities.push(this.cache.get(id)!);
          continue;
        }
        
        const filePath = path.join(this.basePath, file);
        const content = await fs.readFile(filePath, 'utf-8');
        const entity = JSON.parse(content) as T;
        
        if (useCache) {
          this.cache.set(id, entity);
        }
        
        entities.push(entity);
      }
      
      return entities;
    } catch (error) {
      console.error('Error en findAll:', error);
      return [];
    }
  }
  
  // Método para buscar una entidad por ID
  async findById(id: string, options: { useCache?: boolean } = {}): Promise<T | null> {
    const { useCache = true } = options;
    
    try {
      await this.initialize();
      
      if (useCache && this.cache.has(id)) {
        return this.cache.get(id) || null;
      }
      
      const filePath = path.join(this.basePath, `${id}.json`);
      const content = await fs.readFile(filePath, 'utf-8');
      const entity = JSON.parse(content) as T;
      
      if (useCache) {
        this.cache.set(id, entity);
      }
      
      return entity;
    } catch (error) {
      return null;
    }
  }
  
  // Método para guardar una entidad
  async save(entity: T): Promise<T> {
    await this.initialize();
    
    const filePath = path.join(this.basePath, `${entity.id}.json`);
    await fs.writeFile(filePath, JSON.stringify(entity, null, 2), 'utf-8');
    
    // Actualizar caché
    this.cache.set(entity.id, entity);
    
    return entity;
  }
  
  // Método para eliminar una entidad
  async delete(id: string): Promise<boolean> {
    try {
      await this.initialize();
      
      const filePath = path.join(this.basePath, `${id}.json`);
      await fs.unlink(filePath);
      
      // Eliminar de la caché
      this.cache.delete(id);
      
      return true;
    } catch (error) {
      return false;
    }
  }
  
  // Método para limpiar la caché
  clearCache(): void {
    this.cache.clear();
  }
}
