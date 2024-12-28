import axios from "axios";

export const signUp = async (data: { username: string; email: string; password: string; role_id: number }) => {
    const url:any = process.env.NEXT_PUBLIC_REGISTER_USER
    try {
        const response = await axios.post(url, data);
        console.log(response.data)
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Something went wrong');
    }
};

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
  