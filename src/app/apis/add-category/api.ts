import api from "@/app/lib/axios"; // Import the centralized Axios instance
export const postCategory = async (data: { category_name: string }) => {
  const url = process.env.NEXT_PUBLIC_ADD_CATEGORY || "http://localhost:3100/category/add";
  console.log(url);
  try {
    const response = await api.post(url, data);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to add category.");
    } else {
      throw new Error("An unexpected error occurred.");
    }
  }
};


export const getCategory = async (page = 1, pageSize = 5) => {
  const url = `${process.env.NEXT_PUBLIC_GET_ALL_CATEGORY}?page=${page}&pageSize=${pageSize}`;
  console.log(url);
  try {
    const response = await api.get(url);
    console.log(response.data)
    return response.data;
  } catch (error: any) {
    console.error("Error fetching categories:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch categories.");
  }
};
