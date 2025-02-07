import api from "../api";

export const getVendors = async (page: number, pageSize: number) => {
  const url:any = process.env.NEXT_PUBLIC_GET_VENDOR
  const response = await api.get(`${url}`, {
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

  const url:any = process.env.NEXT_PUBLIC_ADD_VENDOR
  const response = await api.post(`${url}`, vendor);
  return response.data;
};


export const getVendorId = async () => {

  const url: any = process.env.NEXT_PUBLIC_GET_VENDOR_ID

  const response = await api.get(`${url}`);
  return response.data;
};

export const updateVendor = (vendorId: string, updatedData: any) => {
  const url: any = process.env.NEXT_PUBLIC_UPDATE_VENDOR

  return api.patch(`${url}${vendorId}`, updatedData);
};

export const deleteVendor = async (vendorId: string) => {
  const url: any = process.env.NEXT_PUBLIC_DELETE_VENDOR
  try {
    const response = await api.post(`${url}${vendorId}`);
    return response.data; // or any response that the API returns
  } catch (error) {
    throw new Error("Failed to delete vendor");
  }
};