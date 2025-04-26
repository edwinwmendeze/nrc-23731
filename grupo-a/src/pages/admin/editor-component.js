// src/pages/admin/editor-component.js
import { renderToString } from 'react-dom/server';
import ProfileEditor from '../../components/admin/ProfileEditor.astro';
import { AuthService } from '../../lib/services/AuthService';

/**
 * Endpoint para renderizar el componente editor con los datos del perfil
 */
export async function post({ request }) {
  try {
    // Verificar autenticación
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'No autorizado'
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
    
    // Verificar token
    const authService = new AuthService();
    const tokenVerification = await authService.verifyToken(token);
    
    if (!tokenVerification.valid) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Token inválido'
        }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
    
    // Obtener datos del perfil del body
    const body = await request.json();
    const { profile } = body;
    
    // Verificar que el perfil pertenece al usuario
    if (profile.id !== tokenVerification.profileId) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'No puedes editar un perfil que no te pertenece'
        }),
        {
          status: 403,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
    
    // Renderizar el componente con los datos del perfil
    // Nota: En un entorno real, usaríamos Astro.renderComponent(), pero
    // para simplificar, vamos a devolver los datos del perfil y que el cliente
    // use el componente que ya tiene cargado
    
    return new Response(
      JSON.stringify({
        success: true,
        profile
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error al renderizar componente editor:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Error en el servidor: ' + error.message
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
