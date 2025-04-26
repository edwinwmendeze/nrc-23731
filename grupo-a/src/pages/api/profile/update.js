// src/pages/api/profile/update.js
import { AuthService } from '../../../lib/services/AuthService';
import { saveProfile } from '../../../lib/services/profileService';

/**
 * Endpoint para actualizar perfil de usuario
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
    
    // Obtener ID del perfil del token verificado
    const profileId = tokenVerification.profileId;
    
    // Parsear datos del perfil del cuerpo
    const profileData = await request.json();
    
    // Asegurarse de que el ID del perfil coincida con el token
    if (profileData.id && profileData.id !== profileId) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'No puedes modificar un perfil que no te pertenece'
        }),
        {
          status: 403,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
    
    // Asegurarse de que el perfil tenga el ID correcto
    profileData.id = profileId;
    
    // Guardar el perfil actualizado
    const updatedProfile = await saveProfile(profileData);
    
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Perfil actualizado correctamente',
        profile: updatedProfile
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error en endpoint update profile:', error);
    
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
