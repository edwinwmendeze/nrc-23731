// src/types/error.ts

/**
 * Tipos de errores posibles en la aplicaciu00f3n
 */
export type ErrorType = 
  | 'validation'  // Errores de validaciu00f3n de datos
  | 'auth'        // Errores de autenticaciu00f3n o autorizaciu00f3n
  | 'api'         // Errores relacionados con API o servicios externos
  | 'not_found'   // Recursos no encontrados
  | 'server'      // Errores de servidor
  | 'network'     // Errores de red
  | 'unknown';    // Errores desconocidos o no categorizados

/**
 * Estructura estandarizada para respuestas de error
 */
export interface ErrorResponse {
  /** Mensaje descriptivo del error */
  message: string;
  /** Tipo de error */
  type: ErrorType;
  /** Cu00f3digo u00fanico del error */
  code: string;
  /** Informaciu00f3n adicional opcional */
  details?: Record<string, unknown>;
}

/**
 * Resultado de una operaciu00f3n que puede fallar
 */
export type Result<T> = 
  | { success: true; data: T; error: null }
  | { success: false; data: null; error: ErrorResponse };

/**
 * Estado genérico para componentes con carga de datos
 */
export interface AsyncState<T> {
  /** Datos cargados */
  data: T | null;
  /** Estado de carga */
  loading: boolean;
  /** Error, si existe */
  error: ErrorResponse | null;
}
