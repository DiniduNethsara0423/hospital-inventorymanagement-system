import React, { useState } from "react";
import { X, FileText, CheckCircle } from "lucide-react";

interface QuotationModalProps {
  selectedQuotation: Quotation;
  setSelectedQuotation: React.Dispatch<React.SetStateAction<Quotation | null>>;
}

export const QuotationModal: React.FC<QuotationModalProps> = ({
  selectedQuotation,
  setSelectedQuotation,
}) => {
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
        <div className="space-y-4 mb-8">
          <p><strong>Name:</strong> {selectedQuotation.name}</p>
          <p><strong>Price:</strong> ${selectedQuotation.fullPrice.toFixed(2)}</p>
          <p><strong>Description:</strong> {selectedQuotation.description}</p>
        </div>
      </div>
    </div>
  );
};
