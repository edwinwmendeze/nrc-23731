// src/lib/orm/BaseORM.ts
import * as fs from 'fs/promises';
import path from 'path';
import { AppError } from '../../types/AppError';

/**
 * BaseORM - Clase base para la implementación del ORM
 * Proporciona funcionalidades CRUD básicas para entidades JSON
 */
export class BaseORM<T extends Record<string, any>> {
  private basePath: string;
  private initialized: boolean = false;
  private cache: Map<string, T> = new Map();
  protected indexesBuilt: boolean = false;
  private indexes: Map<string, Map<string, Set<string>>> = new Map();
  
  /**
   * Constructor para BaseORM
   * @param basePath Ruta base donde se almacenarán los archivos JSON
   * @param idField Nombre del campo que se usará como identificador (por defecto 'id')
   */
  constructor(basePath: string, private idField: string = 'id') {
    this.basePath = basePath;
  }
  
  /**
   * Inicializa el ORM, verificando y creando el directorio base si es necesario
   * @returns Promesa que se resuelve cuando la inicialización está completa
   */
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
  
  /**
   * Construye índices para búsquedas optimizadas
   * @param fields Array de campos para indexar
   */
  protected async buildIndexes(fields: string[]): Promise<void> {
    if (this.indexesBuilt) return;
    
    const entities = await this.findAll({ useCache: false });
    
    // Inicializar índices
    fields.forEach(field => {
      this.indexes.set(field, new Map());
    });
    
    // Construir índices
    for (const entity of entities) {
      const entityId = this.getEntityId(entity);
      if (!entityId) continue;
      
      for (const field of fields) {
        const value = this.getNestedProperty(entity, field);
        if (value === undefined) continue;
        
        const fieldIndex = this.indexes.get(field)!;
        const stringValue = String(value);
        
        if (!fieldIndex.has(stringValue)) {
          fieldIndex.set(stringValue, new Set());
        }
        
        fieldIndex.get(stringValue)!.add(entityId);
      }
    }
    
    this.indexesBuilt = true;
  }
  
  /**
   * Obtiene una propiedad anidada de un objeto
   * @param obj Objeto del cual obtener la propiedad
   * @param path Ruta de la propiedad (puede ser anidada, ej: "user.profile.name")
   * @returns El valor de la propiedad o undefined si no existe
   */
  private getNestedProperty(obj: any, path: string): any {
    const parts = path.split('.');
    let current = obj;
    
    for (const part of parts) {
      if (current === null || current === undefined) {
        return undefined;
      }
      current = current[part];
    }
    
    return current;
  }
  
  /**
   * Obtiene el ID de una entidad. Si no tiene ID en el campo especificado,
   * utiliza el nombre del archivo (sin extensión) como ID.
   * @param entity Entidad de la que obtener el ID
   * @param filename Nombre del archivo opcional (si ya se conoce)
   * @returns El ID de la entidad o null si no se puede determinar
   */
  private getEntityId(entity: T, filename?: string): string | null {
    // Si la entidad tiene un ID en el campo especificado, usarlo
    const id = entity[this.idField];
    if (id) {
      return String(id);
    }
    
    // Si se proporcionó un nombre de archivo, extraer el ID del nombre
    if (filename) {
      return path.basename(filename, '.json');
    }
    
    // Si la entidad tiene un campo 'basics.name', usar ese para generar un ID
    if (entity.basics && entity.basics.name) {
      return entity.basics.name
        .toLowerCase()
        .replace(/\s+/g, '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
    }
    
    return null;
  }
  
  /**
   * Encuentra todas las entidades
   * @param options Opciones para la búsqueda
   * @returns Lista de entidades
   */
  async findAll(options: { 
    useCache?: boolean,
    sort?: { field: string, order: 'asc' | 'desc' },
    filter?: (entity: T) => boolean,
    limit?: number,
    offset?: number
  } = {}): Promise<T[]> {
    const { 
      useCache = true,
      sort,
      filter,
      limit,
      offset = 0
    } = options;
    
    try {
      await this.initialize();
      
      // Si cache está habilitado y ya tenemos entidades cacheadas
      if (useCache && this.cache.size > 0) {
        let entities = Array.from(this.cache.values());
        
        if (filter) {
          entities = entities.filter(filter);
        }
        
        if (sort) {
          entities.sort((a, b) => {
            const aValue = this.getNestedProperty(a, sort.field);
            const bValue = this.getNestedProperty(b, sort.field);
            
            if (aValue === bValue) return 0;
            const comparison = aValue < bValue ? -1 : 1;
            return sort.order === 'asc' ? comparison : -comparison;
          });
        }
        
        if (limit !== undefined) {
          entities = entities.slice(offset, offset + limit);
        } else if (offset > 0) {
          entities = entities.slice(offset);
        }
        
        return entities;
      }
      
      const files = await fs.readdir(this.basePath);
      const jsonFiles = files.filter(file => file.endsWith('.json'));
      
      const entities: T[] = [];
      for (const file of jsonFiles) {
        const entity = await this.loadEntityFromFile(file);
        if (entity) {
          // Extraer ID del nombre del archivo si no existe en la entidad
          const id = this.getEntityId(entity, file);
          if (id) {
            // Asignar el ID a la entidad si no lo tiene
            if (!entity[this.idField]) {
              entity[this.idField] = id;
            }
            
            if (useCache) {
              this.cache.set(id, entity);
            }
            entities.push(entity);
          }
        }
      }
      
      let result = entities;
      
      if (filter) {
        result = result.filter(filter);
      }
      
      if (sort) {
        result.sort((a, b) => {
          const aValue = this.getNestedProperty(a, sort.field);
          const bValue = this.getNestedProperty(b, sort.field);
          
          if (aValue === bValue) return 0;
          const comparison = aValue < bValue ? -1 : 1;
          return sort.order === 'asc' ? comparison : -comparison;
        });
      }
      
      if (limit !== undefined) {
        result = result.slice(offset, offset + limit);
      } else if (offset > 0) {
        result = result.slice(offset);
      }
      
      return result;
    } catch (error) {
      console.error('Error en findAll:', error);
      return [];
    }
  }
  
  /**
   * Carga una entidad desde un archivo
   * @param filename Nombre del archivo a cargar
   * @returns La entidad cargada o null si hubo un error
   */
  private async loadEntityFromFile(filename: string): Promise<T | null> {
    try {
      const filePath = path.join(this.basePath, filename);
      const content = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      console.error(`Error loading file ${filename}:`, error);
      return null;
    }
  }
  
  /**
   * Encuentra una entidad por su ID
   * @param id ID de la entidad a buscar
   * @param options Opciones para la búsqueda
   * @returns La entidad encontrada o null si no existe
   */
  async findById(id: string, options: { useCache?: boolean } = {}): Promise<T | null> {
    const { useCache = true } = options;
    
    try {
      await this.initialize();
      
      if (useCache && this.cache.has(id)) {
        return this.cache.get(id) || null;
      }
      
      const filePath = path.join(this.basePath, `${id}.json`);
      
      try {
        const content = await fs.readFile(filePath, 'utf-8');
        const entity = JSON.parse(content) as T;
        
        // Asignar el ID a la entidad si no lo tiene
        if (!entity[this.idField]) {
          entity[this.idField] = id;
        }
        
        if (useCache) {
          this.cache.set(id, entity);
        }
        
        return entity;
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
          return null; // El archivo no existe
        }
        throw error; // Otro tipo de error
      }
    } catch (error) {
      console.error(`Error en findById(${id}):`, error);
      return null;
    }
  }
  
  /**
   * Encuentra entidades por un campo específico
   * @param field Campo por el que buscar
   * @param value Valor a buscar
   * @param options Opciones para la búsqueda
   * @returns Lista de entidades que coinciden con la búsqueda
   */
  async findByField(field: string, value: any, options: {
    useIndex?: boolean,
    useCache?: boolean,
    exactMatch?: boolean
  } = {}): Promise<T[]> {
    const { useIndex = true, useCache = true, exactMatch = true } = options;
    
    await this.initialize();
    
    // Usar índice si está disponible y se permite
    if (useIndex && this.indexesBuilt && this.indexes.has(field)) {
      const fieldIndex = this.indexes.get(field)!;
      const stringValue = String(value);
      
      if (fieldIndex.has(stringValue)) {
        const entityIds = fieldIndex.get(stringValue)!;
        const entities: T[] = [];
        
        for (const id of entityIds) {
          const entity = await this.findById(id, { useCache });
          if (entity) {
            entities.push(entity);
          }
        }
        
        return entities;
      }
      
      return [];
    }
    
    // Búsqueda completa si no hay índice o no se permite usarlo
    const entities = await this.findAll({ useCache });
    
    return entities.filter(entity => {
      const entityValue = this.getNestedProperty(entity, field);
      
      if (entityValue === undefined) {
        return false;
      }
      
      if (exactMatch) {
        return entityValue === value;
      } else {
        // Para búsquedas parciales en strings
        const entityStr = String(entityValue).toLowerCase();
        const searchStr = String(value).toLowerCase();
        return entityStr.includes(searchStr);
      }
    });
  }
  
  /**
   * Guarda una entidad
   * @param entity Entidad a guardar
   * @returns La entidad guardada
   * @throws Error si la entidad no tiene ID
   */
  async save(entity: T): Promise<T> {
    // Obtener o generar ID
    let id = this.getEntityId(entity);
    
    if (!id) {
      throw new AppError(
        'VALIDATION_ERROR',
        `No se puede determinar el ID para la entidad. Asegúrate de que tenga un ${this.idField} válido o un campo basics.name.`,
        { entity }
      );
    }
    
    // Asignar el ID a la entidad si no lo tiene
    if (!entity[this.idField]) {
      entity[this.idField] = id;
    }
    
    await this.initialize();
    
    try {
      const filePath = path.join(this.basePath, `${id}.json`);
      await fs.writeFile(filePath, JSON.stringify(entity, null, 2), 'utf-8');
      
      // Actualizar caché
      this.cache.set(id, { ...entity });
      
      // Marcar índices como no construidos para reconstruirlos en la próxima consulta
      this.indexesBuilt = false;
      
      return entity;
    } catch (error) {
      throw new AppError(
        'IO_ERROR',
        `Error al guardar la entidad con ID=${id}`,
        { entity, cause: error }
      );
    }
  }
  
  /**
   * Elimina una entidad por su ID
   * @param id ID de la entidad a eliminar
   * @returns true si se eliminó correctamente, false si no
   */
  async delete(id: string): Promise<boolean> {
    try {
      await this.initialize();
      
      const filePath = path.join(this.basePath, `${id}.json`);
      
      try {
        await fs.access(filePath);
      } catch (error) {
        return false; // El archivo no existe
      }
      
      await fs.unlink(filePath);
      
      // Actualizar caché
      this.cache.delete(id);
      
      // Marcar índices como no construidos
      this.indexesBuilt = false;
      
      return true;
    } catch (error) {
      console.error(`Error al eliminar entidad con id=${id}:`, error);
      return false;
    }
  }
  
  /**
   * Actualiza una entidad existente
   * @param id ID de la entidad a actualizar
   * @param updates Actualizaciones a aplicar
   * @returns La entidad actualizada o null si no existe
   */
  async update(id: string, updates: Partial<T>): Promise<T | null> {
    try {
      const entity = await this.findById(id);
      
      if (!entity) {
        return null;
      }
      
      // Aplicar actualizaciones
      const updatedEntity = { ...entity, ...updates };
      
      // Guardar entidad actualizada
      await this.save(updatedEntity);
      
      return updatedEntity;
    } catch (error) {
      console.error(`Error al actualizar entidad con id=${id}:`, error);
      return null;
    }
  }
  
  /**
   * Cuenta el número total de entidades
   * @param filter Filtro opcional
   * @returns Número de entidades
   */
  async count(filter?: (entity: T) => boolean): Promise<number> {
    const entities = await this.findAll();
    
    if (filter) {
      return entities.filter(filter).length;
    }
    
    return entities.length;
  }
  
  /**
   * Ejecuta una transacción
   * @param operations Función que realiza operaciones dentro de la transacción
   * @returns Resultado de la transacción
   */
  async transaction<R>(operations: (orm: this) => Promise<R>): Promise<R> {
    // Guardar estado actual
    const originalCache = new Map(this.cache);
    const originalIndexesBuilt = this.indexesBuilt;
    
    try {
      // Ejecutar operaciones
      const result = await operations(this);
      
      return result;
    } catch (error) {
      // Restaurar estado en caso de error
      this.cache = originalCache;
      this.indexesBuilt = originalIndexesBuilt;
      
      throw error;
    }
  }
  
  /**
   * Limpia la caché del ORM
   */
  clearCache(): void {
    this.cache.clear();
    this.indexesBuilt = false;
  }
}