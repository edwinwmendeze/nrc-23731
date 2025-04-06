// src/types/index.ts

// Re-exportar todos los tipos desde sus respectivos archivos
export * from './profile';
export * from './project';
export * from './error';

// Tipos compartidos entre componentes UI

/**
 * Tamaños estándar para componentes
 */
export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Variantes para componentes
 */
export type Variant = 'primary' | 'secondary' | 'accent' | 'ghost' | 'link' | 'outline';

/**
 * Estados para componentes interactivos
 */
export type InteractiveState = 'default' | 'hover' | 'active' | 'disabled';

/**
 * Posiciones para componentes
 */
export type Position = 'top' | 'right' | 'bottom' | 'left';

// Tipos comunes
export type Theme = 'light' | 'dark' | 'system';
export type SocialIconKey = 'GitHub' | 'LinkedIn' | 'Twitter' | 'Instagram' | 'Default';

// Tipos para UI components
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// Tipos para manejo de errores y estados
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';
export type ErrorType = 'api' | 'validation' | 'auth' | 'unknown';

// Interfaces para manejo de errores
export interface ErrorResponse {
  code: string;
  message: string;
  type: ErrorType;
  details?: Record<string, unknown>;
}

// Exportaciones de tipo para componentes específicos
export interface ComponentProps {
  class?: string;
  id?: string;
}

export interface SectionProps extends ComponentProps {
  title?: string;
  subtitle?: string;
}