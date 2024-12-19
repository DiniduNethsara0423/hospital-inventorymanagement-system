import api from "@/app/lib/axios"; // Import the centralized Axios instance

// Interface for the request data
interface CategoryRequest {
  name: string;
  description?: string;
}

// POST: Add a new category
export const postCategory = async (data: CategoryRequest) => {
  const url =
    process.env.NEXT_PUBLIC_ADD_CATEGORY ||
    "http://localhost:3100/category/add";
    console.log(url);

  try {
    const response = await api.post(url, data);
    console.log("Category added successfully:", response.data);
    return response.data; // Return the created category data
  } catch (error: any) {
    if (error.response) {
      console.error("API Error:", error.response.data);
      throw new Error(error.response.data.message || "Failed to add category.");
    } else {
      console.error("Unexpected Error:", error.message);
      throw new Error("An unexpected error occurred while adding the category.");
    }
  }
};
