// src/types/index.ts

// Re-exportar todas las interfaces desde un punto central
export * from './profile';

// Exportaciones de tipo para componentes específicos
export interface ComponentProps {
  class?: string;
  id?: string;
}

export interface SectionProps extends ComponentProps {
  title?: string;
  subtitle?: string;
}

// Tipos comunes
export type Theme = 'light' | 'dark' | 'system';
export type SocialIconKey = 'GitHub' | 'LinkedIn' | 'Twitter' | 'Default';