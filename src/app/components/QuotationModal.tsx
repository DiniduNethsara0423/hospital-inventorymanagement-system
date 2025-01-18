import React, { useEffect, useState, useCallback, useRef } from "react";
import { X, FileText, CheckCircle, Upload } from "lucide-react";
import { addQuotation, uploadQuotationPDF, updateQuotationStatus, fetchSuppliers, fetchQuotationPDFs, fetchQuotationsByPurchaseRequestId, addPurchase } from "@/app/apis/purchase/api"; // Adjust the path as necessary

interface Quotation {
  id: string;
  name: string;
  fullPrice: number;
  description: string;
}

interface QuotationModalProps {
  selectedQuotation: Quotation;
  setSelectedQuotation: React.Dispatch<React.SetStateAction<Quotation | null>>;
}

export const QuotationModal: React.FC<QuotationModalProps> = ({
  selectedQuotation,
  setSelectedQuotation,
}) => {
  const [purchaseRequestId, setPurchaseRequestId] = useState("");
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [totalValue, setTotalValue] = useState("");
  const [uploadedPDFs, setUploadedPDFs] = useState<any[]>([]);
  const [selectedPDF, setSelectedPDF] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const fetchedSupplierIds = useRef(new Set<string>());
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [quotationList, setQuotationList] = useState<any[]>([]);
  const [isPurchaseCompleted, setIsPurchaseCompleted] = useState(false);


  // Generate Purchase Request ID
  const generatePurchaseRequestId = () => {
    const now = new Date();
    const id = now.toISOString().replace(/[-:T.]/g, "").slice(0, 14);
    setPurchaseRequestId(id);
  };

  // Fetch suppliers using the API service
  const loadSuppliers = useCallback(async () => {
    if (!hasMore || loading) return;
    setLoading(true);
    try {
      const data = await fetchSuppliers(page, 10);
      const newSuppliers = data.data.filter(
        (supplier: any) => !fetchedSupplierIds.current.has(supplier.vendor_id)
      );
      newSuppliers.forEach((supplier: any) =>
        fetchedSupplierIds.current.add(supplier.vendor_id)
      );
      setSuppliers((prev) => [...prev, ...newSuppliers]);
      setHasMore(newSuppliers.length > 0);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    } finally {
      setLoading(false);
    }
  }, [page, hasMore, loading]);

  // Fetch PDFs linked to the quotation
  const loadQuotationPDFs = useCallback(async () => {
    try {
      const data:any = await fetchQuotationPDFs(selectedQuotation.id);
      setUploadedPDFs(data || []);
    } catch (error) {
      console.error("Error fetching quotation PDFs:", error);
    }
  }, [selectedQuotation.id]);


  const [approveStatus, setApproveStatus] = useState("pending"); // State for approval status

  const handleSubmit = async () => {
    if (!selectedSupplier || !totalValue || !pdfFile) {
      alert("Please fill all required fields and upload a PDF.");
      return;
    }

    setLoading(true);
    const quotationId = new Date().toISOString().replace(/[-:T.]/g, "").slice(0, 14);

    // Prepare the quotation object
    const quotationData = {
      quotation_id: quotationId,
      vendor_id: selectedSupplier,
      total_value: parseFloat(totalValue),
      purchase_request_id: selectedQuotation.id,
      pdf_path: "fake-path.pdf", // Fake path
      approve_status: approveStatus, // Use selected approve status
      created_by: 1, // Hardcoded created_by
    };

    try {
      // Submit quotation
      await addQuotation(quotationData);

      // Upload the PDF
      await uploadQuotationPDF(quotationId, pdfFile);

      alert("Quotation and PDF uploaded successfully.");
      setSelectedQuotation(null);
    } catch (error) {
      console.error("Error submitting quotation or uploading PDF:", error);
      alert("Failed to submit the quotation. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  const loadQuotationsByPurchaseRequestId = useCallback(async () => {
    try {
      const data = await fetchQuotationsByPurchaseRequestId(selectedQuotation.id);
      setQuotationList(data || []);

      // Check if any quotation has `approve_status: "approved"`
      const approvedQuotation = data.find(
        (quotation: any) => quotation.approve_status === "approved"
      );

      if (approvedQuotation) {
        setIsPurchaseCompleted(true); // Mark purchase as completed
      } else {
        setIsPurchaseCompleted(false); // Allow purchase confirmation
      }
    } catch (error) {
      console.error("Error fetching quotations by purchase request ID:", error);
    }
  }, [selectedQuotation.id]);



  const handlePurchase = async () => {
    if (isPurchaseCompleted) {
      alert("Purchase has already been completed for this request.");
      return;
    }

    if (!selectedPDF) {
      alert("Please select a quotation before proceeding.");
      return;
    }

    const selectedQuotationData = quotationList.find(
      (quotation) => quotation.quotation_id === selectedPDF
    );

    if (!selectedQuotationData) {
      alert("Selected quotation data not found.");
      return;
    }

    const patchData = {
      quotation_id: selectedQuotationData.quotation_id,
      purchase_request_id: selectedQuotationData.purchase_request_id,
      vendor_id: selectedQuotationData.vendor_id,
      pdf_path: selectedQuotationData.pdf_path,
      total_value: Number(selectedQuotationData.total_value),
      approve_status: "approved", // Update status to approved
    };

    try {
      setLoading(true);

      // Update quotation status
      await updateQuotationStatus(selectedQuotationData.quotation_id, patchData);

      // Create purchase
      const purchaseData = {
        approverd_by: "Admin",
        vendor_id: selectedQuotationData.vendor_id,
        deliver_status: "Delivered",
        pdf_path: selectedQuotationData.pdf_path,
        quotation_id: selectedPDF,
      };

      await addPurchase(purchaseData);

      alert("Purchase created successfully.");
      setSelectedQuotation(null); // Close the modal
    } catch (error) {
      console.error("Error creating purchase or updating quotation:", error);
      alert("Failed to complete the purchase. Please try again.");
    } finally {
      setLoading(false);
    }
  };



  // Trigger supplier and PDF fetch on mount
  useEffect(() => {
    generatePurchaseRequestId();
    loadSuppliers();
    loadQuotationPDFs();
    loadQuotationsByPurchaseRequestId();
  }, [loadSuppliers, loadQuotationPDFs, loadQuotationsByPurchaseRequestId]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-3xl p-8 relative max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b pb-4 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <FileText className="mr-2 text-blue-600" /> Quotation Details
          </h2>
          <button
            onClick={() => setSelectedQuotation(null)}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            <X />
          </button>
        </div>

        {/* Quotation Details */}
        <div className="space-y-4 mb-8">
          <p>
            <strong>Price:</strong> ${selectedQuotation.fullPrice.toFixed(2)}
          </p>
          <p>
            <strong>Description:</strong> {selectedQuotation.description}
          </p>
        </div>

        {/* Additional Information */}
        <div className="space-y-4 mb-8">
          <h3 className="text-lg font-semibold">Add Additional Information</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Quotation ID
            </label>
            <input
              type="text"
              value={purchaseRequestId}
              readOnly
              className="block w-full border rounded-md px-4 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Supplier
            </label>
            <select
              value={selectedSupplier}
              onChange={(e) => setSelectedSupplier(e.target.value)}
              className="block w-full border rounded-md px-4 py-2"
            >
              <option value="">Select Supplier</option>
              {suppliers.map((supplier) => (
                <option key={supplier.vendor_id} value={supplier.vendor_id}>
                  {supplier.vendor_id}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Total Value
            </label>
            <input
              type="number"
              value={totalValue}
              onChange={(e) => setTotalValue(e.target.value)}
              className="block w-full border rounded-md px-4 py-2"
            />
          </div>
          {/* Approve Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Approval Status
            </label>
            <div className="flex items-center space-x-4 mt-2">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="approve_status"
                  value="pending"
                  checked={approveStatus === "pending"}
                  onChange={(e) => setApproveStatus(e.target.value)}
                />
                <span>Pending</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="approve_status"
                  value="approved"
                  checked={approveStatus === "approved"}
                  onChange={(e) => setApproveStatus(e.target.value)}
                />
                <span>Approved</span>
              </label>
            </div>
          </div>
        </div>


        {/* Upload PDFs */}
        <div>
          <label
            htmlFor="upload-pdf"
            className="block text-sm font-medium text-gray-700"
          >
            Upload PDF
          </label>
          <input
            id="upload-pdf"
            type="file"
            accept="application/pdf"
            onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
            className="block w-full border rounded-md px-4 py-2"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`bg-blue-600 text-white px-4 py-2 rounded ${loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
        >
          Submit Quotation
        </button>

        <div className="space-y-4 mt-8">
          <h3 className="text-lg font-semibold">Uploaded Quotations</h3>
          <ul className="space-y-2">
            {quotationList.map((quotation) => (
              <li
                key={quotation.quotation_id}
                className={`flex items-center justify-between p-2 border ${selectedPDF === quotation.quotation_id ? "bg-blue-50" : ""
                  }`}
              >
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="selected-pdf"
                    checked={selectedPDF === quotation.quotation_id}
                    onChange={() => setSelectedPDF(quotation.quotation_id)}
                  />
                  <span>{quotation.pdf_path}</span>
                </label>
                {quotation.approve_status === "approved" && (
                  <CheckCircle className="text-green-500" />
                )}
              </li>
            ))}
          </ul>

          <button
            onClick={handlePurchase}
            disabled={isPurchaseCompleted || !selectedPDF || loading}
            className={`bg-green-600 text-white px-4 py-2 rounded ${isPurchaseCompleted || !selectedPDF || loading
                ? "opacity-50 cursor-not-allowed"
                : ""
              }`}
          >
            Confirm Purchase
          </button>

          {isPurchaseCompleted && (
            <p className="text-red-500 mt-2">
              A purchase has already been confirmed for this request.
            </p>
          )}

        </div>
      </div>
    </div>
  );
};
