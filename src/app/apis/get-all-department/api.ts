import api from "@/app/lib/axios"; // Assuming you have a configured Axios instance

export const getDepartments = async (page = 1, pageSize = 5) => {
  const url = `${process.env.NEXT_PUBLIC_GET_ALL_DEPARTMENT}?page=${page}&pageSize=${pageSize}`;
  console.log(url);
  try {
    const response = await api.get(url);
    return response.data; // Expected format: { data: Department[], total: number }
  } catch (error: any) {
    console.error("Error fetching departments:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch departments"
    );
  }
};
