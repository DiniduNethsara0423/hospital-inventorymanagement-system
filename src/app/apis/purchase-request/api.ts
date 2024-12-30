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
  console.log("getPurchaseRequest URL:", url);
  try {
    const response = await API.get(url);
    console.log(response);
    console.log("getPurchaseRequest Response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error in getPurchaseRequest:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || "Failed to fetch PurchaseRequest."
    );
  }
};
