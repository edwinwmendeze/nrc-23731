// src/lib/orm/ProfileORM.ts
import { BaseORM } from './BaseORM';
import path from 'path';
import type { Profile } from '../../types';

export class ProfileORM extends BaseORM<Profile> {
  constructor(basePath: string = path.join(process.cwd(), 'src/data/profiles')) {
    super(basePath);
  }
  
  // Método para buscar perfiles por nombre
  async findByName(name: string): Promise<Profile[]> {
    const profiles = await this.findAll();
    return profiles.filter(profile => 
      profile.basics?.name === name
    );
  }
  
  // Validación específica para perfiles
  validateProfile(profile: Profile): string[] {
    const errors: string[] = [];
    
    // Validar ID
    if (!profile.id) {
      errors.push('El perfil debe tener un ID');
    }
    
    // Validar basics
    if (!profile.basics) {
      errors.push('El perfil debe tener información básica');
      return errors;
    }
    
    // Validar campos obligatorios
    if (!profile.basics.name) {
      errors.push('El nombre es obligatorio');
    }
    
    if (!profile.basics.label) {
      errors.push('El rol/etiqueta es obligatorio');
    }
    
    return errors;
  }
}
