import api from "../api";
const API_BASE_URL = process.env.NEXT_PUBLIC_GET_ALL_INVOICES;

export const fetchInvoices = async (page: number, limit: number) => {
  try {
    const response = await api.get(`${API_BASE_URL}?page=${page}&limit=${limit}`);
    return response.data; 
  } catch (error) {
    console.error("Error fetching invoices:", error);
    throw error;
  }
};

export const createInvoice = async (invoiceData:any) => {
  const url:any = process.env.NEXT_PUBLIC_ADD_INVOICES
  try {
    const response = await api.post(`${url}`, invoiceData);
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
    const response = await api.patch(
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

export const fetchQuotations = async (page:any, pageSize:any) => {
  const url:any = process.env.NEXT_PUBLIC_GET_ALL_QUOtATIONS
    try {
    const response = await api.get(`${url}?page=${page}&pageSize=${pageSize}`);
    return response.data; 
  } catch (error: any) {
    console.error("Error fetching quotations:", error?.response || error);
    throw error; 
  }
};

export const fetchPurchases = async (page: number, pageSize: number) => {
  const url:any = process.env.NEXT_PUBLIC_GET_ALL_PURCHASES
  try {
    const response = await api.get(`${url}?page=${page}&pageSize=${pageSize}`);
    return response.data; // Ensure the response returns `{ rows, count }`
  } catch (error) {
    console.error("Failed to fetch purchases:", error);
    throw error;
  }
};

export const generateInvoiceId = async (): Promise<string> => {
  const url:any = process.env.NEXT_PUBLIC_GENERATE_INVOICE_ID
  try {
    const response = await api.get(`${url}`);
    return response.data; 
  } catch (error) {
    console.error("Failed to generate invoice ID:", error);
    throw error;
  }
};

export const deleteInvoice = async (invoiceId: string) => {
  const url:any = process.env.NEXT_PUBLIC_ADD_INVOICES
  try {
    const response = await api.post(`${url}${invoiceId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting invoice:", error);
    throw new Error("Failed to delete invoice");
  }
};