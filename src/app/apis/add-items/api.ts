// api.ts
import axios from 'axios';

export const fetchItemByBarcode = async (barcode: string) => {
  const baseUrl:any = process.env.NEXT_PUBLIC_BASE_URL

  try {
    const response = await axios.get(
      `${baseUrl}/items/get/item/by/barcode/${barcode}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching item by barcode:', error);
    throw new Error('Failed to fetch item details. Please try again.');
  }
};
