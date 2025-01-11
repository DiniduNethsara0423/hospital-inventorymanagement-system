import React, { useEffect, useState, useCallback, useRef } from "react";
import { X, FileText, CheckCircle, Upload } from "lucide-react";
import { addQuotation, uploadQuotationPDF, fetchSuppliers, fetchQuotationPDFs } from "@/app/apis/purchase/api"; // Adjust the path as necessary

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
      const data = await fetchQuotationPDFs(selectedQuotation.id);
      setUploadedPDFs(data || []);
    } catch (error) {
      console.error("Error fetching quotation PDFs:", error);
    }
  }, [selectedQuotation.id]);

  // Approve a selected PDF
  const handleApprovePDF = async () => {
    if (!selectedPDF) return;
    try {
      await approvePDF(selectedPDF);
      setUploadedPDFs((prev) =>
        prev.map((pdf) =>
          pdf.id === selectedPDF ? { ...pdf, approved: true } : pdf
        )
      );
      setSelectedPDF(null); // Deselect after approval
    } catch (error) {
      console.error("Error approving PDF:", error);
    }
  };

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
      approve_status: "pending",
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


  // Trigger supplier and PDF fetch on mount
  useEffect(() => {
    generatePurchaseRequestId();
    loadSuppliers();
    loadQuotationPDFs();
  }, [loadSuppliers, loadQuotationPDFs]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-3xl p-8 relative">
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
              Quotation  ID
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
          className={`bg-blue-600 text-white px-4 py-2 rounded ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Submit Quotation
        </button>

        {/* Uploaded PDFs
        <div className="space-y-4 mb-8">
          <h3 className="text-lg font-semibold">Uploaded PDFs</h3>
          <ul className="space-y-2">
            {uploadedPDFs.map((pdf) => (
              <li
                key={pdf.id}
                className={`flex items-center justify-between p-2 border ${
                  selectedPDF === pdf.id ? "bg-blue-50" : ""
                }`}
              >
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="selected-pdf"
                    checked={selectedPDF === pdf.id}
                    onChange={() => setSelectedPDF(pdf.id)}
                  />
                  <span>{pdf.name}</span>
                </label>
                {pdf.approved && <CheckCircle className="text-green-500" />}
              </li>
            ))}
          </ul>
          <button
            onClick={handleApprovePDF}
            disabled={!selectedPDF}
            className={`bg-blue-600 text-white px-4 py-2 rounded ${
              !selectedPDF ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Approve Selected PDF
          </button>
        </div> */}

        {/* <button
          onClick={() => setSelectedQuotation(null)}
          className="bg-gray-600 text-white px-6 py-2 rounded"
        >
          Close
        </button> */}
      </div>
    </div>
  );
};
