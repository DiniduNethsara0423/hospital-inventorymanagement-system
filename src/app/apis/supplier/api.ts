const BASE_URL = process.env.NEXT_PUBLIC_UPDATE_SUPPLIERS || "http://localhost:3100/vendors";

import axios from "axios";
export const getSuppliers = async (page = 1, pageSize = 5) => {
  const baseUrl = process.env.NEXT_PUBLIC_GET_ALL_SUPPLIERS || "http://localhost:3100/vendors";
  const url = `${baseUrl}?page=${page}&pageSize=${pageSize}`;
  console.log(url);
  try {
    const response = await axios.get(url);
    console.log(response.data);

    return response.data;
  } catch (error: any) {
    console.error("Error fetching suppliers:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch suppliers.");
  }
};



export const postSupplier = async (data: any) => {
  try {
    const response = await axios.post(BASE_URL, data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to add supplier.");
  }
};

export const updateSupplier = async (id: string, data: any) => {
  try {
    const response = await axios.put(`${BASE_URL}/${id}`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to update supplier.");
  }
};

export const deleteSupplier = async (id: string) => {
  try {
    const response = await axios.delete(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to delete supplier.");
  }
};
