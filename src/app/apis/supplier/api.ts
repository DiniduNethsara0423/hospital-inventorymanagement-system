import axios from "axios";

const BASE_URL = "http://localhost:3100";

export const getVendors = async (page: number, pageSize: number) => {
  const response = await axios.get(`${BASE_URL}/vendors`, {
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
  const response = await axios.post(`${BASE_URL}/vendors`, vendor);
  return response.data;
};


export const getVendorId = async () => {
  const response = await axios.get(`${BASE_URL}/vendors/vendorId/get`);
  return response.data; // Assuming the response contains { vendorId: "generated_id" }
};