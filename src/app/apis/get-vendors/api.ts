import axios from "axios";

const BASE_URL = "http://localhost:3100";

export const getVendors = async (page: number, pageSize: number) => {
  try {
    const response = await axios.get(`${BASE_URL}/vendors`, {
      params: { page, pageSize },
    });

    if (response.status === 200) {
      return response.data;  // Ensure response returns { data, total }
    } else {
      throw new Error("Failed to fetch vendors");
    }
  } catch (error) {
    console.error("Error fetching vendors:", error);
    return { data: [], total: 0 };  // Return empty data on error
  }
};
