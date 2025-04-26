// src/pages/api/auth/verify.js
import { AuthService } from '../../../lib/services/AuthService';

/**
 * Endpoint para verificar token JWT
 */
export async function post({ request }) {
  try {
    // Obtener token del encabezado Authorization
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({
          valid: false,
          error: 'Token no proporcionado'
        }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
    
    const token = authHeader.substring(7); // Eliminar 'Bearer ' del inicio
    
    // Crear instancia del servicio de autenticación
    const authService = new AuthService();
    
    // Verificar token
    const result = await authService.verifyToken(token);
    
    // Devolver resultado
    return new Response(
      JSON.stringify(result),
      {
        status: result.valid ? 200 : 401,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error en endpoint verify:', error);
    
    return new Response(
      JSON.stringify({
        valid: false,
        error: 'Error en el servidor'
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}
