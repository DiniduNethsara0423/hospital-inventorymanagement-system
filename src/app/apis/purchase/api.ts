import axios from "axios";

// Set up the base URL from the environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Create an Axios instance with default configurations
const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add Purchase Request
export const addPurchaseRequest = async (data:any) => {
  try {
    const response = await API.post(
      process.env.NEXT_PUBLIC_ADD_PURCHASE_REQUEST!,
      data
    );
    console.log("addPurchaseRequest Response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "Error in addPurchaseRequest:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to add PurchaseRequest."
    );
  }
};

// Get Purchase Requests
export const getPurchaseRequest = async (page = 1, limit = 10) => {
  const url = `${process.env.NEXT_PUBLIC_GET_ALL_PURCHASE_REQUEST}?page=${page}&limit=${limit}`;
  try {
    const response = await API.get(url);
    console.log(response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error in getPurchaseRequest:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || "Failed to fetch PurchaseRequest."
    );
  }
};



export const fetchSuppliers = async (page: number, pageSize: number) => {
  try {
    const response = await axios.get(`http://localhost:3100/vendors`, {
      params: { page, pageSize },
    });

    if (response.status === 200) {
      return response.data;  // Ensure response returns { data, total }
    } else {
      throw new Error("Failed to fetch vendors");
    }
  } catch (error) {
    console.error("Error fetching vendors:", error);
    return { data: [], total: 0 };  // Return empty data on error
  }
};

export const addQuotation = async (data: any) => {
    try {
      const response = await axios.post("http://localhost:3100/quotation", data);
      return response.data;
    } catch (error) {
      console.error("Error adding quotation:", error);
      throw error;
    }
  };
  
  // Upload a PDF for a quotation
  export const uploadQuotationPDF = async (quotationId: string, pdfFile: File) => {
    const formData = new FormData();
    formData.append("file", pdfFile);
  
    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_ADD_PDF_TO_INVOICE}?fType=quotation&id=${quotationId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error uploading quotation PDF:", error);
      throw error;
    }
  };
  
  

  export const fetchQuotationPDFs = async (id:any) => {}


  export const fetchQuotationsByPurchaseRequestId = async (purchaseRequestId: string) => {
    try {
      const response = await axios.get(`http://localhost:3100/quotation/get-quotations-by-pr-id/${purchaseRequestId}`);
      return response.data; // Assuming the API returns the data in the response body
    } catch (error) {
      console.error("Error fetching quotations by purchase request ID:", error);
      throw error;
    }
  };

  export const addPurchase = async (purchaseData: {
    approverd_by: string;
    vendor_id: string;
    deliver_status: string;
    pdf_path: string;
    quotation_id: string;
  }) => {
    const response = await axios.post("http://localhost:3100/purchases", purchaseData);
    return response.data;
  };


  // Delete a purchase request
export const deletePurchaseRequest = async (requestId: string) => {
  const response = await axios.delete(`http://localhost:3100/purchase-orders/${requestId}`);
  return response.data; // Assuming API responds with some acknowledgment or updated data
};

export const updateQuotationStatus = async (quotationId: string, data: any) => {
  try {
    const response = await axios.patch(
      `http://localhost:3100/quotation/update/${quotationId}`,
      data
    );
    return response.data;
  } catch (error) {
    throw new Error(`Failed to update quotation status: ${error}`);
  }
};