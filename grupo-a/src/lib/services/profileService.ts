// src/services/profileService.ts
import type { Profile, ProfileModule, Project, ProjectWithAuthor, SocialIconKey } from '../../types';
import { ProfileORM } from '../orm/ProfileORM';
import path from 'path';

/**
 * Singleton para ProfileORM
 * Usamos una variable privada para mantener la instancia
 */
let _profileORM: ProfileORM | null = null;

/**
 * Obtiene la instancia de ProfileORM
 * @returns Instancia de ProfileORM
 */
function getProfileORM(): ProfileORM {
  if (!_profileORM) {
    _profileORM = new ProfileORM(path.join(process.cwd(), 'src/data/profiles'));
  }
  return _profileORM;
}

/**
 * Obtiene todos los perfiles disponibles
 * @param options Opciones para la consulta
 * @returns Lista de perfiles
 */
export async function getProfiles(options: {
  sort?: { field: string, order: 'asc' | 'desc' },
  limit?: number,
  offset?: number,
  useCache?: boolean
} = {}): Promise<Profile[]> {
  try {
    // Si estamos en un entorno de navegador donde fs no está disponible,
    // usamos el método original con import.meta.glob
    if (typeof window !== 'undefined') {
      const profilesFiles = import.meta.glob<ProfileModule>('../data/profiles/*.json', { eager: true });
      return Object.values(profilesFiles).map(profile => profile.default);
    }
    
    // En el servidor, usamos ProfileORM
    const profileORM = getProfileORM();
    return profileORM.findAll(options);
  } catch (error) {
    console.error('Error cargando perfiles:', error);
    return [];
  }
}

/**
 * Obtiene un perfil por su ID
 * @param id ID del perfil
 * @param useCache Si se debe usar la caché (por defecto: true)
 * @returns El perfil encontrado o null si no existe
 */
export async function getProfileById(id: string, useCache: boolean = true): Promise<Profile | null> {
  try {
    // Si estamos en un entorno de navegador
    if (typeof window !== 'undefined') {
      const profiles = await getProfiles();
      return profiles.find(profile => profile.id === id) || null;
    }
    
    // En el servidor, usamos ProfileORM
    const profileORM = getProfileORM();
    return profileORM.findById(id, { useCache });
  } catch (error) {
    console.error(`Error cargando perfil con ID ${id}:`, error);
    return null;
  }
}

/**
 * Obtiene perfiles por nombre
 * @param name Nombre a buscar
 * @param exactMatch Si la coincidencia debe ser exacta (por defecto: false)
 * @returns Lista de perfiles que coinciden con el nombre
 */
export async function getProfilesByName(name: string, exactMatch: boolean = false): Promise<Profile[]> {
  try {
    if (typeof window !== 'undefined') {
      const profiles = await getProfiles();
      
      if (exactMatch) {
        return profiles.filter(profile => profile.basics.name === name);
      }
      
      return profiles.filter(profile => 
        profile.basics.name.toLowerCase().includes(name.toLowerCase())
      );
    }
    
    // En el servidor, usamos ProfileORM
    const profileORM = getProfileORM();
    return profileORM.findByName(name, { exactMatch });
  } catch (error) {
    console.error(`Error buscando perfiles por nombre '${name}':`, error);
    return [];
  }
}

/**
 * Obtiene perfiles por habilidad
 * @param skillName Nombre de la habilidad a buscar
 * @returns Lista de perfiles que tienen la habilidad
 */
export async function getProfilesBySkill(skillName: string): Promise<Profile[]> {
  try {
    if (typeof window !== 'undefined') {
      const profiles = await getProfiles();
      
      return profiles.filter(profile => {
        if (!profile.skills || !Array.isArray(profile.skills)) {
          return false;
        }
        
        return profile.skills.some(skill => 
          skill.name.toLowerCase().includes(skillName.toLowerCase()) ||
          (skill.keywords && skill.keywords.some(keyword => 
            keyword.toLowerCase().includes(skillName.toLowerCase())
          ))
        );
      });
    }
    
    // En el servidor, usamos ProfileORM
    const profileORM = getProfileORM();
    return profileORM.findBySkill(skillName);
  } catch (error) {
    console.error(`Error buscando perfiles por habilidad '${skillName}':`, error);
    return [];
  }
}

/**
 * Obtiene los proyectos destacados de todos los perfiles
 * @returns Lista de proyectos destacados con información del autor
 */
export async function getFeaturedProjects(): Promise<ProjectWithAuthor[]> {
  try {
    if (typeof window !== 'undefined') {
      const profiles = await getProfiles();
      return profiles.flatMap(profile => 
        (profile.projects || [])
          .filter(project => project.featured)
          .map(project => ({
            ...project,
            author: profile.basics.name
          }))
      );
    }
    
    // En el servidor, usamos ProfileORM
    const profileORM = getProfileORM();
    return profileORM.getFeaturedProjects();
  } catch (error) {
    console.error('Error obteniendo proyectos destacados:', error);
    return [];
  }
}

/**
 * Guarda un perfil
 * @param profile Perfil a guardar
 * @returns El perfil guardado
 * @throws Error si ocurre un error durante el guardado
 */
export async function saveProfile(profile: Profile): Promise<Profile> {
  try {
    // No podemos guardar desde el navegador
    if (typeof window !== 'undefined') {
      throw new Error('No se puede guardar el perfil desde el navegador');
    }
    
    const profileORM = getProfileORM();
    return profileORM.save(profile);
  } catch (error) {
    console.error('Error guardando perfil:', error);
    throw error;
  }
}

/**
 * Elimina un perfil por su ID
 * @param id ID del perfil a eliminar
 * @returns true si se eliminó correctamente, false si no
 */
export async function deleteProfile(id: string): Promise<boolean> {
  try {
    // No podemos eliminar desde el navegador
    if (typeof window !== 'undefined') {
      throw new Error('No se puede eliminar el perfil desde el navegador');
    }
    
    const profileORM = getProfileORM();
    return profileORM.delete(id);
  } catch (error) {
    console.error(`Error eliminando perfil con ID ${id}:`, error);
    return false;
  }
}

/**
 * Obtiene estadísticas sobre los perfiles
 * @returns Estadísticas de perfiles
 */
export async function getProfileStats(): Promise<{
  totalProfiles: number;
  totalSkills: number;
  totalProjects: number;
  featuredProjects: number;
  skillsByType: Record<string, number>;
}> {
  try {
    if (typeof window !== 'undefined') {
      const profiles = await getProfiles();
      
      let totalSkills = 0;
      let totalProjects = 0;
      let featuredProjects = 0;
      const skillsByType: Record<string, number> = { hard: 0, soft: 0 };
      
      profiles.forEach(profile => {
        if (profile.skills) {
          totalSkills += profile.skills.length;
          
          profile.skills.forEach(skill => {
            skillsByType[skill.type] = (skillsByType[skill.type] || 0) + 1;
          });
        }
        
        if (profile.projects) {
          totalProjects += profile.projects.length;
          featuredProjects += profile.projects.filter(p => p.featured).length;
        }
      });
      
      return {
        totalProfiles: profiles.length,
        totalSkills,
        totalProjects,
        featuredProjects,
        skillsByType
      };
    }
    
    // En el servidor, usamos ProfileORM
    const profileORM = getProfileORM();
    return profileORM.getStats();
  } catch (error) {
    console.error('Error obteniendo estadísticas de perfiles:', error);
    return {
      totalProfiles: 0,
      totalSkills: 0,
      totalProjects: 0,
      featuredProjects: 0,
      skillsByType: {}
    };
  }
}

/**
 * Obtiene el mapeo de iconos sociales para los perfiles
 */
export function getSocialIcons(): Record<SocialIconKey, string> {
  return {
    GitHub: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path></svg>`,
    LinkedIn: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path></svg>`,
    Twitter: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path></svg>`,
    Instagram: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>`,
    Default: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6.066 9.645c.183 4.04-2.83 8.544-8.164 8.544-1.622 0-3.131-.476-4.402-1.291 1.524.18 3.045-.244 4.252-1.189-1.256-.023-2.317-.854-2.684-1.995.451.086.895.061 1.298-.049-1.381-.278-2.335-1.522-2.304-2.853.388.215.83.344 1.301.359-1.279-.855-1.641-2.544-.889-3.835 1.416 1.738 3.533 2.881 5.92 3.001-.419-1.796.944-3.527 2.799-3.527.825 0 1.572.349 2.096.907.654-.128 1.27-.368 1.824-.697-.215.671-.67 1.233-1.263 1.589.581-.07 1.135-.224 1.649-.453-.384.578-.87 1.084-1.433 1.489z"></path></svg>`
  };
}