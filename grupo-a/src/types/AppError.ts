// src/types/AppError.ts

/**
 * Tipos de errores de la aplicación
 */
export type ErrorCode = 
  | 'VALIDATION_ERROR'   // Error de validación de datos
  | 'NOT_FOUND'          // Recurso no encontrado
  | 'UNAUTHORIZED'       // No autorizado
  | 'FORBIDDEN'          // Prohibido
  | 'IO_ERROR'           // Error de entrada/salida
  | 'NETWORK_ERROR'      // Error de red
  | 'INTERNAL_ERROR'     // Error interno
  | 'UNKNOWN_ERROR';     // Error desconocido

/**
 * Clase de error personalizada para la aplicación
 * Extiende Error para proporcionar información adicional sobre errores
 */
export class AppError extends Error {
  /**
   * Código de error específico
   */
  code: ErrorCode;
  
  /**
   * Detalles adicionales sobre el error
   */
  details?: Record<string, any>;
  
  /**
   * Constructor de AppError
   * @param code Código de error
   * @param message Mensaje de error
   * @param details Detalles adicionales (opcional)
   */
  constructor(code: ErrorCode, message: string, details?: Record<string, any>) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.details = details;
    
    // Esto es necesario debido a cómo funciona la extensión de Error en TypeScript
    Object.setPrototypeOf(this, AppError.prototype);
  }
  
  /**
   * Convierte el error a un objeto JSON para APIs
   */
  toJSON(): Record<string, any> {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      details: this.details
    };
  }
  
  /**
   * Convierte el error a cadena de texto para logs
   */
  toString(): string {
    let result = `[${this.code}] ${this.message}`;
    
    if (this.details) {
      result += `\nDetails: ${JSON.stringify(this.details, null, 2)}`;
    }
    
    return result;
  }
}