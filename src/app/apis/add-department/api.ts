import api from "../api";

interface DepartmentRequest {
  name: string;
}

export const postDepartment = async (data: DepartmentRequest) => {
  const url:any = process.env.NEXT_PUBLIC_ADD_DEPARTMENT;
  try {
    const response = await api.post(url, data);
    return response.data; // Return the created department
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to add department.");
    } else {
      throw new Error("An unexpected error occurred.");
    }
  }
};
