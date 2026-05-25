import axios from 'axios';
import { storage } from '../utils/storage';
import { toast } from 'sonner';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // For httpOnly cookies
});

// Request interceptor to attach token if stored in sessionStorage
api.interceptors.request.use(
  (config) => {
    const token = storage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for centralized error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;
      
      if (status === 401 || status === 403) {
        storage.clearToken();
        toast.error('Session expired. Please log in again.');
        // If not already on login page, redirect
        if (globalThis.location.pathname !== '/login') {
          globalThis.location.href = '/login';
        }
      } else {
        toast.error(error.response.data?.message || 'An unexpected error occurred');
      }
    } else {
      toast.error('Network error. Please check your connection.');
    }
    
    return Promise.reject(error);
  }
);

export { api };
