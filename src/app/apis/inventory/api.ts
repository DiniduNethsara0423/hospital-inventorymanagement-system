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
      const response = await api.get(url, {
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
  const url:any = process.env.NEXT_PUBLIC_ADD_ITEMS
  try {
    const response = await api.post(url, data);
    return response.data;
  } catch (error) {
    console.error("Error creating new item:", error);
    throw error;
  }
};


export const deleteItem = async (id:any)=>{
const url:any = process.env.NEXT_PUBLIC_DELETE_ITEMS
  try {
    const response = await api.post(`${url}${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleteing item:", error);
    throw error;
  }
}

export const getAllItemDetails = async (page: number, pageSize: number) => {
  const url:any = process.env.NEXT_PUBLIC_GET_ALLITEM_DETAILS
  const response = await api.get(`${url}?page=${page}&pageSize=${pageSize}`);
  return response.data;
};

export const deleteItemDetail = async (id:any, removingQty:any) => {
  const url:any = process.env.NEXT_PUBLIC_DELETE_ITEM_DETAILS
  const response = await api.post(`${url}${id}`, {
    removing_qty: removingQty,
  });
  return response.data;
};

// Update item detail
export const updateItemDetail = async (id:any, updateData:any) => {
  const url:any = process.env.NEXT_PUBLIC_UPDATE_ITEM_DETAILS
  const response = await api.patch(`${url}${id}`, updateData);
  return response.data;
};

export const updateItem = async (barcode: string, updatedData: { name: string; lower_quantity: number; category_id: number }) => {
  const url:any = process.env.NEXT_PUBLIC_GET_ALL_ITEMS
  try {
    const response = await api.patch(`${url}/${barcode}`, updatedData);
    return response.data;
  } catch (error) {
    console.error("Error updating item:", error);
    throw error;
  }
};

export const getBarcode = async () => {
  const url:any = process.env.NEXT_PUBLIC_GENERATE_ITEM_DEPARTMENT_BARCODE
  const response = await api.get(url);
  return response;
};


export const getInvoiceSuggestions = async (query: string) => {
  const url:any = process.env.NEXT_PUBLIC_GET_INVOICE_SUGGESTIONS
  try {
    const response = await api.get(`${url}=${query}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching invoice suggestions:", error);
    return [];
  }
};

export const deleteUser = async (userId: number) => {
  const url:any = process.env.NEXT_PUBLIC_DELETE_USER
  try {
    const response = await api.post(`${url}${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};  