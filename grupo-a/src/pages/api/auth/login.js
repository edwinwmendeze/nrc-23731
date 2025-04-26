// src/pages/api/auth/login.js
import { AuthService } from '../../../lib/services/AuthService';

/**
 * Endpoint para iniciar sesión
 */
export async function post({ request }) {
  try {
    // Parsear el cuerpo de la petición
    const body = await request.json();
    const { username, password } = body;
    
    // Validar campos requeridos
    if (!username || !password) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Usuario y contraseña son requeridos'
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
    
    // Crear instancia del servicio de autenticación
    const authService = new AuthService();
    
    // Intentar iniciar sesión
    const result = await authService.login(username, password);
    
    // Devolver resultado
    return new Response(
      JSON.stringify(result),
      {
        status: result.success ? 200 : 401,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error en endpoint login:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Error en el servidor'
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
