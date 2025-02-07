import api from "@/app/apis/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("jwtToken");
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
};

export const getCategory = async (page = 1, pageSize = 5) => {
  const url = `${process.env.NEXT_PUBLIC_GET_ALL_CATEGORY}?page=${page}&pageSize=${pageSize}`;
  try {
    const response = await api.get(url, getAuthHeaders());
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch categories.");
  }
};

export const postCategory = async (data: { category_name: string }) => {
  const url:any = process.env.NEXT_PUBLIC_ADD_CATEGORY;
  try {
    const response = await api.post(url, data, getAuthHeaders());
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to add category.");
  }
};

export const updateCategory = async (data: { id: number; category_name: string }) => {
  const url = `${process.env.NEXT_PUBLIC_UPDATE_CATEGORY}${data.id}`;
  try {
    const response = await api.patch(url, { category_name: data.category_name }, getAuthHeaders());
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to update category.");
  }
};

export const deleteCategory = async (id: number) => {
  try {
    const response = await api.delete(`${process.env.NEXT_PUBLIC_DELETE_CATEGORY}${id}`, getAuthHeaders());
    return response.data;
  } catch (error: any) {
    throw new Error("Failed to delete category.");
  }
};
