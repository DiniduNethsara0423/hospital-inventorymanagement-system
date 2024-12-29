import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_GET_ALL_INVOICES;

export const fetchInvoices = async (page: number, limit: number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}?page=${page}&limit=${limit}`);
    return response.data; 
  } catch (error) {
    console.error("Error fetching invoices:", error);
    throw error;
  }
};
