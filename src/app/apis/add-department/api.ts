import api from "@/app/lib/axios";

interface DepartmentRequest {
  name: string;
}

export const postDepartment = async (data: DepartmentRequest) => {
  const url = process.env.NEXT_PUBLIC_ADD_DEPARTMENT || "http://localhost:3100/departments/add-department";

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
