import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3100", // Default base URL
  timeout: 10000, // Request timeout (in ms)
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Add interceptors for requests and responses
api.interceptors.request.use(
  (config) => {
    // You can add custom logic here, like adding an Authorization token
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors globally
    if (error.response) {
      console.error("API Error:", error.response.data);
    } else {
      console.error("Network Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
