import api from "@/app/lib/axios";

export const getDepartments = async (page = 1, pageSize = 5) => {
  const url = `${process.env.NEXT_PUBLIC_GET_ALL_DEPARTMENT}?page=${page}&pageSize=${pageSize}`;
  try {
    const response = await api.get(url);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching departments:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch departments.");
  } 
};

export const getDepartmentById = async (id: number) => {
  const url = `${process.env.NEXT_PUBLIC_GET_DEPARTMENT_BY_ID}/${id}`;
  try {
    const response = await api.get(url);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching department by ID:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch department by ID.");
  }
};

export const postDepartment = async (data:any) => {
    const url = process.env.NEXT_PUBLIC_ADD_DEPARTMENT || "http://localhost:3100/departments/add-department";
    console.log(url);
    try {
      const response = await api.post(url, data);
      console.log("Department added:", response.data);
      return response.data; // Return the created department
    } catch (error: any) {
      if (error.response) {
        console.error("API Error:", error.response.data);
        throw new Error(error.response.data.message || "Failed to add department.");
      } else {
        console.error("Unexpected Error:", error.message);
        throw new Error("An unexpected error occurred.");
      }
    }
  };

export const updateDepartment = async (data: { id: number; name: string }) => {
  const url = `${process.env.NEXT_PUBLIC_UPDATE_DEPARTMENT}/${data.id}`;
  try {
    const response = await api.patch(url, { name: data.name });
    return response.data;
  } catch (error: any) {
    console.error("Error updating department:", error);
    throw new Error(error.response?.data?.message || "Failed to update department.");
  }
};

export const deleteDepartment = async (id: number) => {
  const url = `${process.env.NEXT_PUBLIC_DELETE_DEPARTMENT}/${id}`;
  try {
    const response = await api.delete(url);
    return response.data;
  } catch (error: any) {
    console.error("Error deleting department:", error);
    throw new Error(error.response?.data?.message || "Failed to delete department.");
  }
};
