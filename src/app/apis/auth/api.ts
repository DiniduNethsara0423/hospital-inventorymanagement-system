// import axios from "axios";

// export const signUp = async (data: { username: string; email: string; password: string; role_id: number }) => {
//     const url:any = process.env.NEXT_PUBLIC_REGISTER_USER
//     try {
//         const response = await axios.post(url, data);
//         console.log(response.data)
//         return response.data;
//     } catch (error: any) {
//         throw new Error(error.response?.data?.message || 'Something went wrong');
//     }
// };

// export const login = async (credentials: { username: string; password: string }) => {
//     const url:any = process.env.NEXT_PUBLIC_LOGIN_USER;
//     try {
//       const response = await axios.post(`${url}`, credentials);
//       return response.data;
//     } catch (error: any) {
//       throw error.response?.data || { message: 'An error occurred' };
//     }
//   };

  export const login = async (credentials: { username: string; password: string }) => {
    const url:any = process.env.NEXT_PUBLIC_LOGIN_USER;

    const response = await axios.post(`${url}`, credentials);
    return { ...response.data, status: response.status }; // Include status in the returned object
  };
  


import axios from 'axios';

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
        const response = await axios.post(`${url}`, {
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
        const response = await axios.post(`${url}`, {
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
        const response = await axios.post(`${url}`, {
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
    const response = await axios.post(`http://localhost:3100/auth/update-password`, { email });
    return response.data;
  };
  
//   export const verifyOtp = async (email: string, otp: string) => {
//     const response = await axios.post(`http://localhost:3100/auth/verify-otp`, { email, otp });
//     return response.data;
//   };
  
  export const updatePassword = async (email: string, password: string) => {
    const response = await axios.patch(`http://localhost:3100/auth/complete-updating-password`, { email, password });
    return response.data;
  };


export const fetchAllUsers = async () => {
  try {
    const response = await axios.get(`http://localhost:3100/auth/get-all-users`);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};
