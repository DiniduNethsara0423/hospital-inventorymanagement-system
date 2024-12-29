import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_GET_ALL_INVOICES;

export const fetchInvoices = async (page: number, limit: number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}?page=${page}&limit=${limit}`);
    return response.data; 
  } catch (error) {
    console.error("Error fetching invoices:", error);
    throw error;
  }
};

export const createInvoice = async (invoiceData:any) => {
  const url:any = process.env.NEXT_PUBLIC_ADD_INVOICES
  try {
    const response = await axios.post(`${url}`, invoiceData);
    return response.data;
  } catch (error) {
    console.error("Error creating invoice:", error);
    throw error;
  }
};

export const uploadInvoicePDF = async (invoiceId:any, pdfFile:any) => {
  const url:any = process.env.NEXT_PUBLIC_ADD_PDF_TO_INVOICE
  const formData = new FormData();
  formData.append("file", pdfFile);

  try {
    const response = await axios.patch(
      `${url}?fType=invoice&id=${invoiceId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error uploading invoice PDF:", error);
    throw error;
  }
};

// export const fetchQuotations = async (page = 1, pageSize = 10) => {
//   const url:any = process.env.NEXT_PUBLIC_GET_ALL_QUOtATIONS;
//   try {
//     const response = await axios.get(`${url}`, {
//       params: { page, pageSize },
//     });
//     console.log(response.data)
//     return response.data;
//   } catch (error) {
//     console.error("Failed to fetch quotations:", error);
//     throw error;
//   }
// };

export const fetchQuotations = async (page, pageSize) => {
  const url:any = process.env.NEXT_PUBLIC_GET_ALL_QUOtATIONS
  try {
    const response = await fetch(`${url}?page=${page}&pageSize=${pageSize}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json(); // Parse JSON response
    return data; // Ensure you return the parsed data
  } catch (error) {
    console.error("Error fetching quotations:", error);
    throw error; // Rethrow the error so it can be caught in the component
  }
};

export const fetchPurchases = async (page: number, pageSize: number) => {
  const url:any = process.env.NEXT_PUBLIC_GET_ALL_PURCHASES
  try {
    const response = await axios.get(`${url}?page=${page}&pageSize=${pageSize}`);
    return response.data; // Ensure the response returns `{ rows, count }`
  } catch (error) {
    console.error("Failed to fetch purchases:", error);
    throw error;
  }
};