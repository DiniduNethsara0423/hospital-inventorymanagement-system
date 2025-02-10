import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3100';

// Create an Axios instance
const api: AxiosInstance = axios.create({
  baseURL: BASE_URL, // Your API base URL
  timeout: 10000,  // Optional: Set a timeout for API requests
});

// Add a request interceptor to attach JWT token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('jwtToken'); 
    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response, // Pass through successful responses
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token is expired or invalid
      localStorage.removeItem('jwtToken'); // Remove expired token
      
      // Redirect user to login with an alert message
      window.location.href = '/login?message=Token expired. Please log in again.';
    }
    return Promise.reject(error);
  }
);

export default api;
