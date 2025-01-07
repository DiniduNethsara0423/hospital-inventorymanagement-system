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

  const handleAddQuotation = async () => {
    if (newDescription.trim() === "" || newFullPrice === "") {
      alert("Please fill out all fields.");
      return;
    }

    const purchaseRequestPayload = {
      purchase_request_id: String(Date.now()), // Assuming backend expects a unique ID
      description: newDescription,
      total_value: Number(newFullPrice),
      pdf_path: "example-string", // Adjust as per backend expectations
    };

    try {
      setIsLoading(true);

      // Make the API call
      const response = await addPurchaseRequest(purchaseRequestPayload);
      console.log("Quotation added successfully:", response);

      // Update state
      const newQuotation: Quotation = {
        id: Date.now(),
        description: newDescription,
        fullPrice: Number(newFullPrice),
        approved: false,
      };

      setQuotations((prev) => [...prev, newQuotation]);
      alert("Quotation added successfully!");

      // Clear form inputs
      setNewDescription("");
      setNewFullPrice("");
    } catch (error: any) {
      console.error("Failed to add quotation:", error.message);
      alert("Failed to add quotation. Please check the console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg border">
      <h2 className="text-xl font-bold text-blue-900 mb-4">Add Quotation</h2>
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
        className={`w-full bg-blue-500 text-white py-3 rounded-lg font-bold hover:bg-blue-600 ${
          isLoading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={isLoading}
      >
        {isLoading ? "Adding..." : "Add Quotation"}
      </button>
    </div>
  );
};
