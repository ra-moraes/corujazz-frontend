import axios from 'axios';

const STORAGE_KEY = '@corujazz:auth'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    const { token } = JSON.parse(stored);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

/**
 * Response interceptor → trata 401
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Unauthorized — redirecting to login');

      localStorage.removeItem(STORAGE_KEY);
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }

      return Promise.reject(error);
    }

    const message =
      error.response?.data?.message ||
      error.message ||
      'Erro inesperado';

    window.dispatchEvent(
      new CustomEvent('api-error', {
        detail: {
          status,
          message,
        },
      }),
    );

    return Promise.reject(error);
  },
);

export default api;
