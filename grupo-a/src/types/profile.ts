// src/types/profile.ts

/**
 * Interfaz para perfiles de redes sociales
 */
export interface SocialProfile {
    network: string;
    username: string;
    url: string;
  }
  
  /**
   * Interfaz para habilidades
   */
  export interface Skill {
    name: string;
    level: number;
    type: 'hard' | 'soft';
    keywords?: string[];
  }
  
  /**
   * Interfaz para la información básica de un perfil
   */
  export interface ProfileBasics {
    name: string;
    last_name: string;
    label: string;
    image: string | { 
      local?: string; 
      remote?: string;
    };
    url?: string;
    email?: string;
    phone?: string;
    summary?: string;
    location?: {
      address?: string;
      city?: string;
      region?: string;
      country?: string;
    };
    profiles?: SocialProfile[];
  }
  
  /**
   * Interfaz para experiencia laboral
   */
  export interface WorkExperience {
    company: string;
    position: string;
    website?: string;
    startDate: string;
    endDate?: string;
    current?: boolean;
    summary?: string;
    highlights?: string[];
  }
  
  /**
   * Interfaz para educación
   */
  export interface Education {
    institution: string;
    area: string;
    studyType: string;
    startDate: string;
    endDate?: string;
    current?: boolean;
    gpa?: string;
    courses?: string[];
  }
  
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
   * Interfaz para certificaciones
   */
  export interface Certificate {
    name: string;
    issuer: string;
    date: string;
    url?: string;
  }
  
  /**
   * Interfaz principal de perfil
   */
  export interface Profile {
    basics: ProfileBasics;
    work?: WorkExperience[];
    education?: Education[];
    skills?: Skill[];
    projects?: Project[];
    certificates?: Certificate[];
    languages?: {
      language: string;
      fluency: string;
    }[];
    interests?: {
      name: string;
      keywords?: string[];
    }[];
    volunteer?: {
      organization: string;
      position: string;
      website?: string;
      startDate: string;
      endDate?: string;
      summary?: string;
      highlights?: string[];
    }[];
  }
  
  /**
   * Interfaz para el módulo de perfil
   * (Usada para la importación con import.meta.glob)
   */
  export interface ProfileModule {
    default: Profile;
  }
  
  /**
   * Interfaz para proyecto con información de autor
   */
  export interface ProjectWithAuthor extends Project {
    author: string;
  }