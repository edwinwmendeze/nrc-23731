import type { AppError, ErrorType } from '../types/AppError';

/**
 * Crea un objeto de error estandarizado para la aplicaciu00f3n
 */
export function createAppError({
  message,
  type = 'general',
  code,
  details,
  originalError
}: {
  message: string;
  type?: ErrorType;
  code?: string;
  details?: unknown;
  originalError?: Error;
}): AppError {
  return {
    message,
    type,
    code,
    details,
    originalError
  };
}

/**
 * Maneja errores de red con fallbacks adecuados
 */
export async function fetchWithErrorHandling<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw createAppError({
        message: `Error al obtener datos: ${response.statusText}`,
        type: 'network',
        code: `HTTP_${response.status}`,
        details: { status: response.status }
      });
    }
    
    return await response.json() as T;
  } catch (error) {
    if (error instanceof Error) {
      throw createAppError({
        message: 'Error al conectar con el servidor',
        type: 'network',
        originalError: error
      });
    }
    
    throw createAppError({
      message: 'Error desconocido al obtener datos',
      type: 'general'
    });
  }
}

/**
 * Formatea errores para mostrarlos al usuario
 */
export function formatErrorMessage(error: unknown): string {
  if (typeof error === 'string') return error;
  
  if (error && typeof error === 'object') {
    if ('message' in error && typeof error.message === 'string') {
      return error.message;
    }
  }
  
  return 'Ha ocurrido un error inesperado';
}

/**
 * Sistema de fallback para cargar datos
 * Intenta cargar datos desde la fuente principal, si falla usa el fallback
 */
export async function loadWithFallback<T>(
  primaryLoader: () => Promise<T>,
  fallbackLoader: () => Promise<T>,
  maxRetries = 3
): Promise<T> {
  let retries = 0;
  let lastError: unknown;
  
  while (retries < maxRetries) {
    try {
      return await primaryLoader();
    } catch (error) {
      lastError = error;
      retries++;
      // Esperar un poco mu00e1s entre cada reintento
      await new Promise(resolve => setTimeout(resolve, 1000 * retries));
    }
  }
  
  try {
    // Si agotamos los reintentos, usamos el fallback
    return await fallbackLoader();
  } catch (fallbackError) {
    // Si incluso el fallback falla, lanzamos el error original
    throw lastError;
  }
}
