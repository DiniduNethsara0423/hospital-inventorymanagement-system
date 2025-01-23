import api from "../api";

export const getAllUsers = async () => {
  const url = process.env.NEXT_PUBLIC_GET_ALL_USERS || ''; 
  if (!url) {
    throw new Error("URL is not defined");
  }
  try {
    const response = await api.get(url);
    console.log(response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error in getAllUsers:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || "Failed to fetch users."
    );
  }
};
