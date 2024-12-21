import api from "@/app/lib/axios"; // Import the centralized Axios instance
export const postSupplier = async (data: {
    vendor_id: string;
    vendorName: string;
    email?: string;
    shopName: string;
    shopAddress?: string;
    telephoneNumber?: string;
  }) => {
    const url = process.env.NEXT_PUBLIC_ADD_SUPPLIER || "http://localhost:3100/vendors";
    try {
      const response = await api.post(url, data);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.message || "Failed to add supplier.");
      } else {
        throw new Error("An unexpected error occurred.");
      }
    }
  };
  