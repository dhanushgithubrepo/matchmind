// Authentication utility functions for frontend

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  message?: string;
}

/**
 * Initiate Google OAuth flow
 */
export const loginWithGoogle = () => {
  window.location.href = `${BACKEND_URL}/api/auth/google`;
};

/**
 * Get auth token from localStorage
 */
export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
};

/**
 * Get user email from localStorage
 */
export const getUserEmail = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('userEmail');
  }
  return null;
};

/**
 * Get user name from localStorage
 */
export const getUserName = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('userName');
  }
  return null;
};

/**
 * Store auth data in localStorage
 */
export const storeAuthData = (token: string, email: string, name: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userName', name);
  }
};

/**
 * Clear auth data from localStorage
 */
export const clearAuthData = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
  }
};

/**
 * Verify if token is valid
 */
export const verifyToken = async (): Promise<AuthResponse> => {
  const token = getAuthToken();
  
  if (!token) {
    return { success: false, message: 'No token found' };
  }

  try {
    const response = await fetch(`${BACKEND_URL}/api/auth/verify`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Token verification error:', error);
    return { success: false, message: 'Verification failed' };
  }
};

/**
 * Logout user
 */
export const logout = async (): Promise<void> => {
  try {
    await fetch(`${BACKEND_URL}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    });
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    clearAuthData();
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

/**
 * Make authenticated API request
 */
export const authenticatedFetch = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = getAuthToken();
  
  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  return fetch(url, {
    ...options,
    headers
  });
};
