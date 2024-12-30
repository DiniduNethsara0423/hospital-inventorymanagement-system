"use client";

import React, { useState,useEffect  } from "react";
import { FaSearch, FaCheck, FaTimes, FaTrash, FaPlus } from "react-icons/fa";
import { X, CheckCircle, FileText } from "lucide-react";
import { addPurchaseRequest, getPurchaseRequest } from "@/app/apis/purchase-request/api";

// Define the types for better type-checking
interface PurchaseRequest {
  id: number;
  name: string;
  description: string;
  fullPrice: number;
  approved: boolean;
}

interface UploadedPDF {
  file: File;
  approved: boolean;
}

const ITEMS_PER_PAGE = 10;

const PurchaseRequests: React.FC = () => {
  const [newDescription, setNewDescription] = useState("");
  const [newTotalValue, setNewTotalValue] = useState<number | "">("");
  const [isLoading, setIsLoading] = useState(false);
  const [requests, setRequests] = useState<Request[]>([]);
  const [uploadedPDFs, setUploadedPDFs] = useState<Record<number, UploadedPDF[]>>({});
  const [selectedRequest, setSelectedRequest] = useState<PurchaseRequest | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPDFs, setSelectedPDFs] = useState<Record<number, string[]>>({});
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination logic
  const totalPages = Math.ceil((requests?.length || 0) / ITEMS_PER_PAGE);
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

   // Fetch purchase requests
   const fetchRequests = async (page: number) => {
    setIsLoading(true);
    try {
      const data = await getPurchaseRequest(page, ITEMS_PER_PAGE);
      setRequests(data?.requests || []);
    } catch (error) {
      console.error("Failed to fetch requests:", error);
      setRequests([]);
    } finally {
      setIsLoading(false);
    }
  };
  

  useEffect(() => {
    console.log("Fetching requests for page:", currentPage);
    fetchRequests(currentPage);
  }, [currentPage]);
  

  // Add a new purchase request
  const handleAddRequest = async () => {
    if (newDescription.trim() === "" || newTotalValue === "") {
      alert("Please fill out all fields.");
      return;
    }

    const purchaseRequestPayload = {
      purchase_request_id: String(Date.now()),
      description: newDescription,
      total_value: Number(newTotalValue),
      pdf_path: "example-string", // Adjust as per backend expectations
    };

    try {
      setIsLoading(true);
      const response = await addPurchaseRequest(purchaseRequestPayload);
      console.log("Purchase request added successfully:", response);

      const newRequest: PurchaseRequest = {
        id: Date.now(),
        name: "New Request",
        description: newDescription,
        fullPrice: Number(newTotalValue),
        approved: false,
      };

      setRequests([...requests, newRequest]);
      alert("Purchase request added successfully!");
      setNewDescription("");
      setNewTotalValue("");
    } catch (error: any) {
      console.error("Failed to add purchase request:", error.message);
      alert("Failed to add purchase request. Please check the console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a purchase request
  const handleDeleteRequest = (id: number) => {
    setRequests(requests.filter((r) => r.id !== id));
    setUploadedPDFs((prev) => {
      const updatedPDFs = { ...prev };
      delete updatedPDFs[id];
      return updatedPDFs;
    });
  };

  // Approve or unapprove a purchase request
  const handleApproveRequest = (id: number) => {
    setRequests(
      requests.map((r) => (r.id === id ? { ...r, approved: !r.approved } : r))
    );
  };

  // Modal handlers
  const handleOpenModal = (request: PurchaseRequest) => setSelectedRequest(request);
  const handleCloseModal = () => setSelectedRequest(null);

  // Handle PDF uploads
  const handleUploadPDFs = (files: FileList | null, requestId: number) => {
    if (!files) return;
    const newFiles = Array.from(files).map((file) => ({
      file,
      approved: false,
    }));
    setUploadedPDFs((prev) => ({
      ...prev,
      [requestId]: [...(prev[requestId] || []), ...newFiles],
    }));
  };

  // Approve selected PDFs
  const handleApproveSelectedPDFs = (requestId: number) => {
    setUploadedPDFs((prev) => ({
      ...prev,
      [requestId]: prev[requestId].map((pdf) =>
        selectedPDFs[requestId]?.includes(pdf.file.name)
          ? { ...pdf, approved: true }
          : pdf
      ),
    }));
    setSelectedPDFs((prev) => ({ ...prev, [requestId]: [] }));
  };

  // Toggle PDF selection
  const togglePDFSelection = (requestId: number, fileName: string) => {
    setSelectedPDFs((prev) => ({
      ...prev,
      [requestId]: prev[requestId]?.includes(fileName)
        ? prev[requestId].filter((name) => name !== fileName)
        : [...(prev[requestId] || []), fileName],
    }));
  };

  // Filter requests based on the search query
  const filteredRequests = requests.filter((r) =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 min-h-screen">
      <h1 className="text-4xl font-extrabold text-center text-blue-900 mb-6 mt-4">
        Purchase Requests
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border">
          <h2 className="text-xl font-bold text-blue-900 mb-4 flex items-center">
            <FaPlus className="mr-2" /> Add Request
          </h2>
          <textarea
            placeholder="Detailed Description"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            className="border rounded-lg p-3 w-full h-32 focus:ring-2 focus:ring-blue-400 focus:outline-none resize-none mb-4"
          ></textarea>
          <input
            type="number"
            placeholder="Total Value"
            value={newTotalValue}
            onChange={(e) => setNewTotalValue(e.target.valueAsNumber || "")}
            className="border rounded-lg p-3 w-full mb-4 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          <button
            onClick={handleAddRequest}
            disabled={isLoading}
            className={`w-full bg-blue-500 text-white py-3 rounded-lg font-bold hover:bg-blue-600 transition ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Adding..." : "Add Request"}
          </button>
        </div>

        <div className="col-span-2 bg-white p-6 rounded-lg border">
          <h2 className="text-xl font-bold text-blue-900 mb-4">Requests</h2>
          {filteredRequests.length === 0 ? (
            <p className="text-gray-500 text-center">No requests found.</p>
          ) : (
            <>
              {filteredRequests.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between bg-blue-50 p-4 rounded-lg shadow-sm hover:shadow-md transition"
                  onClick={() => handleOpenModal(request)}
                >
                  <div>
                    <h3 className="font-bold text-lg text-blue-800">
                      {request.name}
                    </h3>
                    <p className="text-gray-600">
                      Price: ${request.fullPrice.toFixed(2)}
                    </p>
                    <p
                      className={`text-sm mt-1 ${
                        request.approved ? "text-green-600 font-semibold" : ""
                      }`}
                    >
                      {request.description}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApproveRequest(request.id);
                      }}
                      className={`px-4 py-2 rounded-md font-bold text-sm transition ${
                        request.approved
                          ? "bg-gray-400 text-white hover:bg-gray-500"
                          : "bg-green-500 text-white hover:bg-green-600"
                      }`}
                    >
                      {request.approved ? "Unapprove" : "Approve"}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteRequest(request.id);
                      }}
                      className="px-4 py-2 rounded-md font-bold text-sm bg-red-500 text-white hover:bg-red-600 transition"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}

              <div className="flex justify-center items-center mt-8 space-x-6">
                <button
                  className={`flex items-center px-4 py-2 rounded-lg font-medium ${
                    currentPage === 1
                      ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <div className="text-gray-700 font-medium">
                  Page {currentPage} of {totalPages}
                </div>
                <button
                  className={`flex items-center px-4 py-2 rounded-lg font-medium ${
                    currentPage === totalPages
                      ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md flex items-center justify-center z-50">
          <div
            className="bg-white rounded-lg shadow-2xl w-full max-w-3xl p-8 relative"
            style={{
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <div className="flex justify-between items-center border-b pb-4 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <FileText className="mr-2 text-blue-600" /> Request Details
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                <X />
              </button>
            </div>

            <div className="space-y-4 mb-8">
              <p className="text-lg text-gray-700">
                <strong className="font-medium text-gray-800">Name:</strong>{" "}
                {selectedRequest.name}
              </p>
              <p className="text-lg text-gray-700">
                <strong className="font-medium text-gray-800">Price:</strong> ${" "}
                {selectedRequest.fullPrice.toFixed(2)}
              </p>
              <p className="text-lg text-gray-700">
                <strong className="font-medium text-gray-800">
                  Description:
                </strong>{" "}
                {selectedRequest.description}
              </p>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Upload Supplier PDFs
              </h3>
              <input
                type="file"
                accept="application/pdf"
                multiple
                onChange={(e) =>
                  handleUploadPDFs(e.target.files, selectedRequest.id)
                }
                className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              />
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Uploaded PDFs
              </h3>
              <ul className="space-y-3">
                {(uploadedPDFs[selectedRequest?.id] || []).map((pdf, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between bg-gray-100 p-4 rounded-lg shadow-sm"
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="mr-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        checked={
                          selectedPDFs[selectedRequest.id]?.includes(
                            pdf.file.name
                          ) || false
                        }
                        onChange={() =>
                          togglePDFSelection(selectedRequest.id, pdf.file.name)
                        }
                      />
                      <a
                        href={URL.createObjectURL(pdf.file)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-blue-600 underline ${
                          pdf.approved ? "font-semibold text-green-600" : ""
                        }`}
                      >
                        {pdf.file.name}
                      </a>
                    </div>
                    <span
                      className={`text-sm ${
                        pdf.approved
                          ? "text-green-500 font-bold"
                          : "text-gray-500"
                      }`}
                    >
                      {pdf.approved ? "Approved" : ""}
                    </span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleApproveSelectedPDFs(selectedRequest.id)}
                className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md shadow hover:bg-blue-700 transition-all"
              >
                Approve Selected PDFs
              </button>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Approved PDFs
              </h3>
              <ul className="space-y-3">
                {(uploadedPDFs[selectedRequest?.id] || [])
                  .filter((pdf) => pdf.approved)
                  .map((pdf, index) => (
                    <li
                      key={index}
                      className="flex items-center bg-green-50 p-4 rounded-lg shadow-sm"
                    >
                      <CheckCircle className="text-green-500 w-5 h-5 mr-3" />
                      <a
                        href={URL.createObjectURL(pdf.file)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        {pdf.file.name}
                      </a>
                    </li>
                  ))}
              </ul>
            </div>

            <div className="text-right">
              <button
                onClick={handleCloseModal}
                className="bg-gray-500 text-white px-6 py-2 rounded-md shadow hover:bg-gray-600 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function Page() {
  return <PurchaseRequests />;
}
