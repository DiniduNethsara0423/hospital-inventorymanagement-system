import api from "@/app/lib/axios"; 

export const getLogsByTableName = async (
  page: string = "1",
  limit: string = "5",
  table_name: string
) => {
  const url = `${process.env.NEXT_PUBLIC_GET_LOGS_BY_TABLE_NAME}?page=${page}&limit=${limit}&table_name=${encodeURIComponent(table_name)}`;
  try {
    const response = await api.get(url);
    return response.data; // Expected format: { data: Log[], total: number }
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch logs by table name"
    );
  }
};

export const getLogsByUserId = async (
    userId: string,
    page: string = "1",
    limit: string = "10"
  ) => {
    const url = `${process.env.NEXT_PUBLIC_GET_LOGS_BY_USER_ID}${userId}?page=${page}&limit=${limit}`;
    try {
      const response = await api.get(url);
      return response.data; // Expected format: { data: Log[], total: number }
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch logs by user ID"
      );
    }
  };


export const getLogsByTableNameAndUserId = async (
  page: string = "1",
  limit: string = "5",
  table_name: string,
  id: string,
  currentPage: any,
  pageSize: any
) => {
  const url = `${process.env.NEXT_PUBLIC_GET_LOGS_BY_TABLENAME_AND_USER_ID}${id}?page=${page}&limit=${limit}&table_name=${encodeURIComponent(table_name)}`;
  try {
    const response = await api.get(url);
    return response.data; // Expected format: { data: Log[], total: number }
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch logs by table name and user ID"
    );
  }
};


export const getLogsByAction = async (
  page: string = "1",
  limit: string = "5",
  action: string,
  
) => {
  const url = `${process.env.NEXT_PUBLIC_GET_LOGS_BY_ACTION}?page=${page}&limit=${limit}&action=${encodeURIComponent(action)})}`;
  try {
    const response = await api.get(url);
    return response.data; 
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch logs by table name and user ID"
    );
  }
};
export const getLogsByDate = async (
  page: string = "1",
  limit: string = "5",
  date: string
) => {
  if (!date) {
    throw new Error("The 'date' parameter is required.");
  }

  const baseUrl = process.env.NEXT_PUBLIC_GET_ALL_LOGS_BY_DATE;
  const url = `${baseUrl}${date}?page=${page}&limit=${limit}`;


  try {
    const response = await api.get(url);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch logs with the specified parameters."
    );
  }
};

export const getLogsByTableAndDate = async (
  page: string = "1",
  limit: string = "5",
  date: string,
  tableName: string
) => {
  if (!date) {
    throw new Error("The 'date' parameter is required.");
  }
  if (!tableName) {
    throw new Error("The 'tableName' parameter is required.");
  }

  const baseUrl = process.env.NEXT_PUBLIC_GET_LOGS_BY_TABLE_NAME_AND_DATE;
  const url = `${baseUrl}${date}?page=${page}&limit=${limit}&table_name=${encodeURIComponent(tableName)}`;


  try {
    const response = await api.get(url);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch logs with the specified parameters."
    );
  }
};


