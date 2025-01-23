import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

// Create an Axios instance
const api: AxiosInstance = axios.create({
  baseURL: '/api', // Your API base URL
  timeout: 10000,  // Optional: Set a timeout for API requests
});

// Add a request interceptor to attach JWT token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('jwtToken'); // Or get the token from cookies
    if (token) {
      // Use `set` to update headers
      config.headers.set('Authorization', `Bearer ${token}`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
    