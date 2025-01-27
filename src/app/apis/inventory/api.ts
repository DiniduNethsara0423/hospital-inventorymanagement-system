import axios from "axios";
import api from "../api";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_GET_ALL_ITEMS, // Ensure this is defined in `.env.development`
});

export const getAllItems = async (page: number, pageSize: number) => {
  const url:any = process.env.NEXT_PUBLIC_GET_ALL_ITEMS
  try {
    const response = await api.get(url, {
      params: { page, pageSize },
    });
    return response.data;
  } catch (error:any) {
    console.error("Error fetching items:", error);
    throw error;
  }
};

// Fetch all categories
export const getAllCategories = async () => {
  const url:any = process.env.NEXT_PUBLIC_GET_ALL_CATEGORIES
    try {
      const response = await api.get(url);
      return response.data;
    } catch (error:any) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  };
  
  // Fetch suggestions based on name and category ID
  export const getSuggestions = async (name: string, categoryId: number) => {
    const url:any = process.env.NEXT_PUBLIC_GET_ITEM_SUGGESIONS
    try {
      const response = await apiClient.get(url, {
        params: { name, categoryId },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      throw error;
    }
  };
  
  // Add a new item
  export const addNewItem = async (itemData: any) => {
    const url:any = process.env.NEXT_PUBLIC_ADD_ITEMS
    try {
      const response = await api.post(url, itemData);
      return response.data;
    } catch (error) {
      console.error("Error adding item:", error);
      throw error;
    }
  };



export const createNewItem = async (data: Record<string, any>) => {
  try {
    const response = await apiClient.post("/items/add-items", data);
    return response.data;
  } catch (error) {
    console.error("Error creating new item:", error);
    throw error;
  }
};


export const deleteItem = async (id:any)=>{

  try {
    const response = await apiClient.post(`/items/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleteing item:", error);
    throw error;
  }
}

export const getAllItemDetails = async (page: number, pageSize: number) => {
  const response = await apiClient.get(`/item-details/get-all-item-details?page=${page}&pageSize=${pageSize}`);
  return response.data;
};

export const deleteItemDetail = async (id:any, removingQty:any) => {
  const response = await axios.post(`http://localhost:3100/items/remove-item-detail/${id}`, {
    removing_qty: removingQty,
  });
  return response.data;
};

// Update item detail
export const updateItemDetail = async (id:any, updateData:any) => {
  const response = await axios.patch(`http://localhost:3100/items/item-details/${id}`, updateData);
  return response.data;
};

export const updateItem = async (barcode: string, updatedData: { name: string; lower_quantity: number; category_id: number }) => {
  try {
    const response = await axios.patch(`http://localhost:3100/items/${barcode}`, updatedData);
    return response.data;
  } catch (error) {
    console.error("Error updating item:", error);
    throw error;
  }
};

export const getBarcode = async () => {
  const response = await axios.get("http://localhost:3100/items/get-item-department-barcode/barcode");
  return response;
};

