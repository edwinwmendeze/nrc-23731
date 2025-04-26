/**
 * Utilidades para manejo de autenticación en el cliente
 */

/**
 * Guarda el token JWT en localStorage
 * @param {string} token - Token JWT
 */
export function saveToken(token) {
  localStorage.setItem('auth_token', token);
}

/**
 * Obtiene el token JWT de localStorage
 * @returns {string|null} Token JWT o null si no existe
 */
export function getToken() {
  return localStorage.getItem('auth_token');
}

/**
 * Elimina el token JWT de localStorage
 */
export function removeToken() {
  localStorage.removeItem('auth_token');
}

/**
 * Guarda el perfil de usuario en localStorage
 * @param {Object} profile - Perfil del usuario
 */
export function saveProfile(profile) {
  localStorage.setItem('user_profile', JSON.stringify(profile));
}

/**
 * Obtiene el perfil de usuario de localStorage
 * @returns {Object|null} Perfil del usuario o null si no existe
 */
export function getProfile() {
  const profileJson = localStorage.getItem('user_profile');
  if (!profileJson) return null;
  try {
    return JSON.parse(profileJson);
  } catch (e) {
    console.error('Error parsing profile:', e);
    return null;
  }
}

/**
 * Elimina el perfil de usuario de localStorage
 */
export function removeProfile() {
  localStorage.removeItem('user_profile');
}

/**
 * Verifica si el usuario está autenticado
 * @returns {boolean} true si el usuario está autenticado, false en caso contrario
 */
export function isAuthenticated() {
  return !!getToken();
}

/**
 * Realiza logout eliminando token y perfil
 */
export function logout() {
  removeToken();
  removeProfile();
  // Usar la ruta base configurada en Astro
  const baseUrl = window.location.pathname.includes('/nrc-23731') ? '/nrc-23731' : '';
  window.location.href = `${baseUrl}/auth/login`;
}

/**
 * Realiza una llamada a la API con el token de autenticación
 * @param {string} url - URL del endpoint
 * @param {Object} options - Opciones para fetch
 * @returns {Promise<Object>} Respuesta de la API
 */
export async function fetchWithAuth(url, options = {}) {
  const token = getToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  const response = await fetch(url, {
    ...options,
    headers,
  });
  
  // Si el token es inválido, hacer logout
  if (response.status === 401) {
    logout();
    return null;
  }
  
  return response;
}

/**
 * Envía credenciales para iniciar sesión
 * @param {string} username - Nombre de usuario
 * @param {string} password - Contraseña
 * @returns {Promise<{success: boolean, message?: string, profile?: Object, token?: string}>}
 */
export async function login(username, password) {
  try {
    // Usar la ruta base para los endpoints
  const baseUrl = window.location.pathname.includes('/nrc-23731') ? '/nrc-23731' : '';
  const response = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    
    const data = await response.json();
    
    if (data.success) {
      saveToken(data.token);
      saveProfile(data.profile);
    }
    
    return data;
  } catch (error) {
    console.error('Error en login:', error);
    return { 
      success: false, 
      message: 'Error al conectar con el servidor' 
    };
  }
}

/**
 * Envía datos para registrar un nuevo usuario
 * @param {Object} userData - Datos del usuario para registro
 * @returns {Promise<{success: boolean, message?: string, profile?: Object, token?: string}>}
 */
export async function register(userData) {
  try {
    const baseUrl = window.location.pathname.includes('/nrc-23731') ? '/nrc-23731' : '';
  const response = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    const data = await response.json();
    
    if (data.success) {
      saveToken(data.token);
      saveProfile(data.profile);
    }
    
    return data;
  } catch (error) {
    console.error('Error en registro:', error);
    return { 
      success: false, 
      message: 'Error al conectar con el servidor' 
    };
  }
}

/**
 * Actualiza el perfil del usuario
 * @param {Object} profileData - Datos actualizados del perfil
 * @returns {Promise<{success: boolean, message?: string, profile?: Object}>}
 */
export async function updateProfile(profileData) {
  try {
    const baseUrl = window.location.pathname.includes('/nrc-23731') ? '/nrc-23731' : '';
  const response = await fetchWithAuth(`${baseUrl}/api/profile/update`, {
      method: 'POST',
      body: JSON.stringify(profileData),
    });
    
    if (!response) {
      return { success: false, message: 'No autorizado' };
    }
    
    const data = await response.json();
    
    if (data.success && data.profile) {
      saveProfile(data.profile);
    }
    
    return data;
  } catch (error) {
    console.error('Error actualizando perfil:', error);
    return { 
      success: false, 
      message: 'Error al conectar con el servidor' 
    };
  }
}
