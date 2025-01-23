import api from "../api";
const BASE_URL = "http://localhost:3100";

export const getVendors = async (page: number, pageSize: number) => {
  const response = await api.get(`${BASE_URL}/vendors`, {
    params: { page, pageSize },
  });
  return response.data;
};

export const postVendor = async (vendor: {
  vendor_id: string;
  vendor_name: string;
  shop_name: string;
  shop_address?: string;
  telephone_number?: string;
  email?: string;
}) => {
  const response = await api.post(`${BASE_URL}/vendors`, vendor);
  return response.data;
};


export const getVendorId = async () => {
  const response = await api.get(`${BASE_URL}/vendors/vendorId/get`);
  return response.data; // Assuming the response contains { vendorId: "generated_id" }
};

export const updateVendor = (vendorId: string, updatedData: any) => {
  return api.patch(`${BASE_URL}/vendors/${vendorId}`, updatedData);
};

export const deleteVendor = async (vendorId: string) => {
  try {
    const response = await api.post(`${BASE_URL}/vendors/${vendorId}`);
    return response.data; // or any response that the API returns
  } catch (error) {
    console.error("Error deleting vendor:", error);
    throw new Error("Failed to delete vendor");
  }
};