// src/types/project.ts

/**
 * Interfaz para proyectos
 */
export interface Project {
  name: string;
  description: string;
  highlights: string[];
  url: string;
  featured: boolean;
  technologies: string[];
  image?: string;
  startDate?: string;
  endDate?: string;
}

/**
 * Interfaz para proyecto con información de autor
 */
export interface ProjectWithAuthor extends Project {
  author: string;
}

/**
 * Estado de un proyecto
 */
export type ProjectStatus = 'completed' | 'in-progress' | 'planning';

/**
 * Categorías de proyectos
 */
export type ProjectCategory = 'web' | 'mobile' | 'design' | 'backend' | 'frontend' | 'fullstack' | 'other';