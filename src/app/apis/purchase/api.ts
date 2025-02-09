import api from "../api";


export const addPurchaseRequest = async (data:any) => {
  try {
    const response = await api.post(
      process.env.NEXT_PUBLIC_ADD_PURCHASE_REQUEST!,
      data
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to add PurchaseRequest."
    );
  }
};

// Get Purchase Requests
export const getPurchaseRequest = async (page = 1, limit = 10) => {
  const url = `${process.env.NEXT_PUBLIC_GET_ALL_PURCHASE_REQUEST}?page=${page}&limit=${limit}`;
  try {
    const response = await api.get(url);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch PurchaseRequest."
    );
  }
};



export const fetchSuppliers = async (page: number, pageSize: number) => {
  const url:any = process.env.NEXT_PUBLIC_GET_VENDOR
  try {
    const response = await api.get(url, {
      params: { page, pageSize },
    });

    if (response.status === 200) {
      return response.data;  // Ensure response returns { data, total }
    } else {
      throw new Error("Failed to fetch vendors");
    }
  } catch (error) {
    return { data: [], total: 0 };  // Return empty data on error
  }
};

export const addQuotation = async (data: any) => {
  const url:any = process.env.NEXT_PUBLIC_ADD_QUOTATION
    try {
      const response = await api.post(url, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  
  // Upload a PDF for a quotation
  export const uploadQuotationPDF = async (quotationId: string, pdfFile: File) => {
    const formData = new FormData();
    formData.append("file", pdfFile);
  
    try {
      const response = await api.patch(
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
      throw error;
    }
  };
  
  

  export const fetchQuotationPDFs = async (id:any) => {}


  export const fetchQuotationsByPurchaseRequestId = async (purchaseRequestId: string) => {
    const url:any = process.env.NEXT_PUBLIC_GET_QUOTATIONS_BY_PR_ID
    try {
      const response = await api.get(`${url}${purchaseRequestId}`);
      return response.data; // Assuming the API returns the data in the response body
    } catch (error) {
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
    const url:any = process.env.NEXT_PUBLIC_GET_ALL_PURCHASES
    const response = await api.post(url, purchaseData);
    return response.data;
  };


  // Delete a purchase request
export const deletePurchaseRequest = async (requestId: string) => {
  const url:any = process.env.NEXT_PUBLIC_DELETE_PURCHASE_REQUESTS
  const response = await api.delete(`${url}${requestId}`);
  return response.data; // Assuming API responds with some acknowledgment or updated data
};

export const updateQuotationStatus = async (quotationId: string, data: any) => {
  const url:any = process.env.NEXT_PUBLIC_UPDATE_QUOTATION_STATUS
  try {
    const response = await api.patch(
      `${url}${quotationId}`,
      data
    );
    return response.data;
  } catch (error) {
    throw new Error(`Failed to update quotation status: ${error}`);
  }
};

export const getQuotationId = async (): Promise<string> => {
  const url:any = process.env.NEXT_PUBLIC_GENERATE_QUOTATION_ID
  try {
    const response = await api.get(`${url}`);
    return response.data; // Adjust if the API response has a different structure
  } catch (error) {
    console.error("Error fetching quotation ID:", error);
    throw error;
  }
};