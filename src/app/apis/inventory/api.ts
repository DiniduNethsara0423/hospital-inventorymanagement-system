import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_GET_ALL_ITEMS, // Ensure this is defined in `.env.development`
});

export const getAllItems = async (page: number, pageSize: number) => {
  try {
    const response = await apiClient.get(`/items`, {
      params: { page, pageSize },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching items:", error);
    throw error;
  }
};

// Fetch all categories
export const getAllCategories = async () => {
    try {
      const response = await apiClient.get("/category/all");
      return response.data;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  };
  
  // Fetch suggestions based on name and category ID
  export const getSuggestions = async (name: string, categoryId: number) => {
    try {
      const response = await apiClient.get("/items/filter-existing", {
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
    try {
      const response = await apiClient.post("/items/add-items", itemData);
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


export const deleteItem = async ()=>{}