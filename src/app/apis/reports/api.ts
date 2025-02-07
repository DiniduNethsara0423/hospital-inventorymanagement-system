import api from "../api";

const API_BASE_URL = "http://localhost:3100";

// Function to fetch and download the report based on the date range
export const downloadReport = async (startDate: string, endDate: string) => {
  const apiurl:any = process.env.NEXT_PUBLIC_DOWNLOAD_REPORTS
  try {
    const response = await api.get(
      `${apiurl}`,
      {
        params: { startDate, endDate },
        responseType: "blob", // Ensures we handle file download
      }
    );

    // Create a link to download the file
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;

    // Extract filename from the response headers or fallback to a default name
    const contentDisposition = response.headers["content-disposition"];
    const filename = contentDisposition
      ? contentDisposition.split("filename=")[1]
      : "report.xlsx";

    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    throw new Error("Failed to download the report.");
  }
};

export const fetchInventoryData = async () => {
  const url:any = process.env.NEXT_PUBLIC_GET_REPORTS
  const response = await api.get(`${url}`);
  return response.data;
};