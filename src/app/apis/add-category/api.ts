import api from "@/app/lib/axios"; 


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

export const updateCategory = async (data: { id: number; category_name: string }) => {
  const url = `/category/update/${data.id}`; // Adjust this based on your backend
  try {
    console.log("Updating category with ID:", data.id, "and name:", data.category_name); // Debug
    const response = await api.patch(url, { category_name: data.category_name });
    return response.data;
  } catch (error: any) {
    console.error("Error updating category:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to update category.");
  }
};
