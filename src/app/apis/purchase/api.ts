import axios from "axios";

// Set up the base URL from the environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Create an Axios instance with default configurations
const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add Purchase Request
export const addPurchaseRequest = async (data: {
  purchase_request_id: number;
  description: string;
  total_value: number;
  pdf_path: string;
}) => {
  try {
    const response = await API.post(
      process.env.NEXT_PUBLIC_ADD_PURCHASE_REQUEST!,
      data
    );
    console.log("addPurchaseRequest Response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "Error in addPurchaseRequest:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to add PurchaseRequest."
    );
  }
};

// Get Purchase Requests
export const getPurchaseRequest = async (page = 1, limit = 10) => {
  const url = `${process.env.NEXT_PUBLIC_GET_ALL_PURCHASE_REQUEST}?page=${page}&limit=${limit}`;
  try {
    const response = await API.get(url);
    console.log(response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error in getPurchaseRequest:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || "Failed to fetch PurchaseRequest."
    );
  }
};



export const getVendors = async (page: number, pageSize: number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/vendors`, {
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
