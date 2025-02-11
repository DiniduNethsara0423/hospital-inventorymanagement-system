import React, { useState } from "react";
import { addPurchaseRequest } from "@/app/apis/purchase/api"; // Adjust the path based on your project structure

interface Quotation {
  id: number;
  description: string;
  fullPrice: number;
  approved: boolean;
}

interface QuotationFormProps {
  setQuotations: React.Dispatch<React.SetStateAction<Quotation[]>>;
} 

export const QuotationForm: React.FC<QuotationFormProps> = ({ setQuotations }) => {
  const [newDescription, setNewDescription] = useState("");
  const [newFullPrice, setNewFullPrice] = useState<number | "">("");
  const [isLoading, setIsLoading] = useState(false);

  // Add states for modals
const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

// Update handleAddQuotation method
const handleAddQuotation = async () => {
  if (newDescription.trim() === "" || newFullPrice === "") {
    setIsErrorModalOpen(true); // Trigger error modal for validation
    return;
  }

  const purchaseRequestPayload = {
    purchase_request_id: String(Date.now()),
    description: newDescription,
    total_value: Number(newFullPrice),
    pdf_path: "example-string",
  };

  try {
    setIsLoading(true);
    const response = await addPurchaseRequest(purchaseRequestPayload);

    const newQuotation: Quotation = {
      id: Date.now(),
      description: newDescription,
      fullPrice: Number(newFullPrice),
      approved: false,
    };

    setQuotations((prev) => [...prev, newQuotation]);
    setIsSuccessModalOpen(true); // Trigger success modal
    setNewDescription("");
    setNewFullPrice("");
  } catch (error: any) {
    console.error("Failed to add quotation:", error.message);
    setIsErrorModalOpen(true); // Trigger error modal
  } finally {
    setIsLoading(false);
  }
};


  return (
    <div className="bg-white p-6 rounded-lg border">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Add Purchase Requests</h2>
      <textarea
        placeholder="Detailed Description"
        value={newDescription}
        onChange={(e) => setNewDescription(e.target.value)}
        className="border rounded-lg p-3 w-full h-32 mb-4"
        disabled={isLoading}
      ></textarea>
      <input
        type="number"
        placeholder="Full Price"
        value={newFullPrice}
        onChange={(e) => setNewFullPrice(e.target.valueAsNumber || "")}
        className="border rounded-lg p-3 w-full mb-4"
        disabled={isLoading}
      />
      <button
        onClick={handleAddQuotation}
        className={`w-full bg-gray-700 text-white py-3 rounded-lg font-bold hover:bg-gray-800 ${
          isLoading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={isLoading}
      >
        {isLoading ? "Adding..." : "Add Purchase Request"}
      </button>

      {/* Success Modal */}
{isSuccessModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
    <div className="bg-white p-8 rounded-lg shadow-lg transition-transform transform scale-100 animate-scaleIn">
      <h2 className="text-2xl font-bold text-green-600 mb-4">Success!</h2>
      <p className="text-gray-700">Quotation added successfully!</p>
      <button
        className="mt-6 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-bold shadow-md transition-colors duration-200"
        onClick={() => {
          setIsSuccessModalOpen(false);
          window.location.reload(); // Optional: reload the page
        }}
      >
        OK
      </button>
    </div>
  </div>
)}

{/* Error Modal */}
{isErrorModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
    <div className="bg-white p-8 rounded-lg shadow-lg transition-transform transform scale-100 animate-scaleIn">
      <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
      <p className="text-gray-700">Failed to add quotation. Please try again.</p>
      <button
        className="mt-6 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg font-bold shadow-md transition-colors duration-200"
        onClick={() => setIsErrorModalOpen(false)}
      >
        Close
      </button>
    </div>
  </div>
)}

    </div>
  );
};
