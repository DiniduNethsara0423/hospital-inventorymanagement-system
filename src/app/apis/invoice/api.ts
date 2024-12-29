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