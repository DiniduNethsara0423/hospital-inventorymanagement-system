// api.ts
import axios from 'axios';

export const fetchItemByBarcode = async (barcode: string) => {
  try {
    const response = await axios.get(
      `http://localhost:3100/items/get/item/by/barcode/${barcode}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching item by barcode:', error);
    throw new Error('Failed to fetch item details. Please try again.');
  }
};
