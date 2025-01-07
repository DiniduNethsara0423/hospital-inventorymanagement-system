import React from "react";
import { FaTrash } from "react-icons/fa";

interface QuotationListProps {
  quotations: Quotation[];
  searchQuery: string;
  setSelectedQuotation: React.Dispatch<React.SetStateAction<Quotation | null>>;
}

export const QuotationList: React.FC<QuotationListProps> = ({
  quotations,
  searchQuery,
  setSelectedQuotation,
}) => {
  const filteredQuotations = quotations.filter((q) =>
    q.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="col-span-2 bg-white p-6 rounded-lg border">
      <h2 className="text-xl font-bold text-blue-900 mb-4">Quotations</h2>
      {filteredQuotations.length === 0 ? (
        <p className="text-gray-500 text-center">No quotations found.</p>
      ) : (
        filteredQuotations.map((quotation) => (
          <div
            key={quotation.id}
            className="flex items-center justify-between bg-blue-50 p-4 rounded-lg shadow-sm hover:shadow-md transition"
            onClick={() => setSelectedQuotation(quotation)}
          >
            <div>
              <h3 className="font-bold text-lg text-blue-800">{quotation.name}</h3>
              <p className="text-gray-600">Price: ${quotation.fullPrice.toFixed(2)}</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => {}}
                className={`px-4 py-2 rounded-md font-bold text-sm transition ${quotation.approved ? "bg-gray-400" : "bg-green-500"}`}
              >
                {quotation.approved ? "Unapprove" : "Approve"}
              </button>
              <button
                onClick={() => {}}
                className="px-4 py-2 rounded-md font-bold text-sm bg-red-500 text-white"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
