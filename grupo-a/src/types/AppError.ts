/**
 * Tipos de errores que puede manejar la aplicación
 */
export type ErrorType = 
  | 'validation'  // Error de validación de datos
  | 'network'     // Error de red o API
  | 'auth'        // Error de autenticación
  | 'not_found'   // Recurso no encontrado
  | 'general';    // Error general

/**
 * Estructura base para todos los errores de la aplicación
 */
export interface AppError {
  message: string;         // Mensaje legible para el usuario
  type: ErrorType;        // Tipo de error
  code?: string;          // Código opcional para identificar errores específicos
  details?: unknown;      // Detalles adicionales del error
  originalError?: Error;  // Error original (si existe)
}
