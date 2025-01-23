

import axios from 'axios';
import api from '../api';

export const login = async (credentials: { username: string; password: string }) => {
    const url: any = process.env.NEXT_PUBLIC_LOGIN_USER;
  
    try {
      const response = await api.post(`${url}`, credentials);
      const token = response.data.access_token;
      console.log(response.data.access_token);
  
      localStorage.setItem('jwtToken', token);
  
      console.log('Login successful!');
      return { token, status: response.status }; // Return the token and status
    } catch (error: any) {
      console.error('Login failed:', error);
      throw new Error(error.response?.data?.message || 'Login failed'); // Throw a detailed error
    }
  };
  

const handleApiError = (error: any) => {
    if (axios.isAxiosError(error)) {
        if (error.response) {
            // Server responded with a status other than 2xx
            return {
                success: false,
                message: error.response.data?.message || 'An error occurred. Please try again.',
                status: error.response.status,
            };
        } else if (error.request) {
            // Request was made but no response received
            return {
                success: false,
                message: 'No response received from the server. Please check your network connection.',
                status: 0,
            };
        } else {
            // Other error
            return {
                success: false,
                message: error.message || 'An unknown error occurred.',
                status: 0,
            };
        }
    } else {
        return {
            success: false,
            message: 'An unexpected error occurred.',
            status: 0,
        };
    }
};

export const initiateRegistration = async (email: string, password: string, username: string, role_Id: number) => {
  const url:any = process.env.NEXT_PUBLIC_USER_INITIAL_REGISTRATION
    try {
        const response = await api.post(`${url}`, {
            email,
            password,
            username,
            role_Id,
        });
        return {
            success: true,
            data: response.data,
        };
    } catch (error) {
        return handleApiError(error);
    }
};

export const verifyOtp = async (email: string, otp: string) => {
  const url:any = process.env.NEXT_PUBLIC_OTP_VERIFY
    try {
        const response = await api.post(`${url}`, {
            email,
            otp,
        });
        return {
            success: true,
            data: response.data,
        };
    } catch (error) {
        return handleApiError(error);
    }
};

export const completeRegistration = async (email: string) => {
  const url:any = process.env.NEXT_PUBLIC_USER_REGISTRATION_COMPLETE
    try {
        const response = await api.post(`${url}`, {
            email,
        });
        return {
            success: true,
            data: response.data,
        };
    } catch (error) {
        return handleApiError(error);
    }
};





export const requestPasswordReset = async (email: string) => {
    const response = await api.post(`${process.env.NEXT_PUBLIC_REQUEST_UPDATE_PASSWORD}`, { email });
    return response.data;
  };
  
//   export const verifyOtp = async (email: string, otp: string) => {
//     const response = await axios.post(`http://localhost:3100/auth/verify-otp`, { email, otp });
//     return response.data;
//   };
  
  export const updatePassword = async (email: string, password: string) => {
    const response = await api.patch(`${process.env.NEXT_PUBLIC_UPDATE_PASSWORD}`, { email, password });
    return response.data;
  };


export const fetchAllUsers = async () => {
  try {
    const response = await api.get(`${process.env.NEXT_PUBLIC_GET_ALL_USERS}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};
