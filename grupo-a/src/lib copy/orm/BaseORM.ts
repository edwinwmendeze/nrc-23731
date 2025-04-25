// src/lib/orm/BaseORM.ts
import * as fs from 'fs/promises';
import path from 'path';

export class BaseORM<T extends { id: string }> {
  private basePath: string;
  
  constructor(basePath: string) {
    this.basePath = basePath;
  }
  
  async initialize(): Promise<void> {
    try {
      await fs.access(this.basePath);
    } catch (error) {
      // Directorio no existe, lo creamos
      await fs.mkdir(this.basePath, { recursive: true });
    }
  }
}