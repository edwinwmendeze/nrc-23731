// src/utils/errorHandling.ts
import type { ErrorResponse, ErrorType } from '../types';

/**
 * Crear un objeto de error estandarizado
 */
export function createErrorResponse(message: string, type: ErrorType = 'unknown', code = 'ERROR', details?: Record<string, unknown>): ErrorResponse {
  return {
    message,
    type,
    code,
    details
  };
}

/**
 * Función para manejar errores de forma consistente
 */
export function handleError(error: unknown): ErrorResponse {
  // Si ya es un ErrorResponse, devolverlo
  if (
    error && 
    typeof error === 'object' && 
    'message' in error && 
    'type' in error && 
    'code' in error
  ) {
    return error as ErrorResponse;
  }

  // Errores de API (fetch)
  if (error instanceof Response) {
    return createErrorResponse(
      `Error de API: ${error.statusText || 'Error desconocido'}`,
      'api',
      `API_${error.status || 'ERROR'}`
    );
  }

  // Errores estándar de JavaScript
  if (error instanceof Error) {
    // Determinar el tipo de error
    let errorType: ErrorType = 'unknown';
    if (error.name === 'ValidationError') {
      errorType = 'validation';
    } else if (error.name === 'AuthError') {
      errorType = 'auth';
    }

    return createErrorResponse(
      error.message,
      errorType,
      error.name
    );
  }

  // Fallback para cualquier otro tipo de error
  return createErrorResponse(
    typeof error === 'string' ? error : 'Ha ocurrido un error inesperado',
    'unknown',
    'UNKNOWN_ERROR'
  );
}

/**
 * Comprobar si una operación asíncrona ha fallado
 */
export async function tryCatch<T>(
  promise: Promise<T>,
  errorMessage = 'La operación ha fallado'
): Promise<[T | null, ErrorResponse | null]> {
  try {
    const data = await promise;
    return [data, null];
  } catch (error) {
    const errorResponse = handleError(error);
    // Si el error ya tenía un mensaje, mantenerlo
    if (!errorResponse.message || errorResponse.message === 'Unknown error') {
      errorResponse.message = errorMessage;
    }
    return [null, errorResponse];
  }
}
