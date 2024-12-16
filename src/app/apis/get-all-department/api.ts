import api from "@/app/lib/axios";
export const getAllDepartments = async (page: number, pageSize: number) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/departments?page=${page}&pageSize=${pageSize}`,
        { method: 'GET' }
      );
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
  
      const data = await response.json();
      return data; // Ensure backend returns an array of departments
    } catch (error) {
      console.error('Failed to fetch departments:', error);
      throw error;
    }
  };
  