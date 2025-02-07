import api from "../api"; // Assuming you have a configured Axios instance

export const getDepartments = async (page = 1, pageSize = 5) => {
  const url = `${process.env.NEXT_PUBLIC_GET_ALL_DEPARTMENT}?page=${page}&pageSize=${pageSize}`;
  try {
    const response = await api.get(url);
    return response.data; // Expected format: { data: Department[], total: number }
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch departments"
    );
  }
};
