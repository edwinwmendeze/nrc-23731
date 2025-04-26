// src/pages/api/auth/register.js
import { AuthService } from '../../../lib/services/AuthService';

/**
 * Endpoint para registro de usuarios
 */
export async function post({ request }) {
  try {
    // Parsear el cuerpo de la petición
    const body = await request.json();
    const { username, password, email, name, lastName } = body;
    
    // Validar campos requeridos
    if (!username || !password || !email || !name || !lastName) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Todos los campos son requeridos'
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
    
    // Intentar registrar al usuario
    const result = await authService.register({
      username,
      password,
      email,
      name,
      lastName
    });
    
    // Devolver resultado
    return new Response(
      JSON.stringify(result),
      {
        status: result.success ? 201 : 400,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error en endpoint register:', error);
    
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
