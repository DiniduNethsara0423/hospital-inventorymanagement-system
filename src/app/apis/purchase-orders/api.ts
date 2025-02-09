import axios from "axios";

const API_URL:any = process.env.NEXT_PUBLIC_PURCHASE_ORDERS;

export const findAllPurchases = async (page: number, pageSize: number) => {
  try {
    const response = await axios.get(API_URL, {
      params: { page, pageSize },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching purchases:", error);
    throw error;
  }
};

export const updateDeliveryStatus = async (id: string, status: string) => {
  try {
    const response = await axios.patch(`${API_URL}${id}`, {
      deliver_status: status,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating delivery status:", error);
    throw error;
  }
};
