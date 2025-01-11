import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { getPurchaseRequest } from "@/app/apis/purchase/api"; // Adjust path

interface Quotation {
  id: string;
  name: string;
  description: string;
  fullPrice: number;
  approved: boolean;
}

interface QuotationListProps {
  searchQuery: string;
  setSelectedQuotation: React.Dispatch<React.SetStateAction<Quotation | null>>;
}
 
export const QuotationList: React.FC<QuotationListProps> = ({
  searchQuery,
  setSelectedQuotation,
}) => {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const ITEMS_PER_PAGE = 5;

  const fetchQuotations = async (page: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getPurchaseRequest(page, ITEMS_PER_PAGE);
      const transformedData = data.map((item: any) => ({
        id: item.purchase_request_id,
        name: item.description,
        description: item.description,
        fullPrice: parseFloat(item.total_value),
        approved: false, // Default value for `approved`
      }));
      setQuotations(transformedData);
    } catch (err) {
      console.error("Failed to fetch quotations:", err);
      setError("Failed to load quotations. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotations(currentPage);
  }, [currentPage]);

  const filteredQuotations = quotations.filter((q) =>
    q.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="col-span-2 bg-white p-6 rounded-lg border">
      <h2 className="text-xl font-bold text-blue-900 mb-4">Quotations</h2>
      {error && <p className="text-red-500">{error}</p>}
      {isLoading ? (
        <p className="text-gray-500 text-center">Loading...</p>
      ) : filteredQuotations.length === 0 ? (
        <p className="text-gray-500 text-center">No quotations found.</p>
      ) : (
        filteredQuotations.map((quotation) => (
          <div
            key={quotation.id}
            className="flex items-center justify-between bg-blue-50 p-4 rounded-lg shadow-sm hover:shadow-md transition my-3"
            onClick={() => setSelectedQuotation(quotation)}
          >
            <div>
              <h3 className="font-bold text-lg text-blue-800">{quotation.name}</h3>
              <p className="text-gray-600">Price: ${quotation.fullPrice.toFixed(2)}</p>
            </div>
            <div className="flex items-center space-x-3">
              {/* <button
                onClick={() => {}}
                className={`px-4 py-2 rounded-md font-bold text-sm transition ${
                  quotation.approved ? "bg-gray-400" : "bg-green-500"
                }`}
              >
                {quotation.approved ? "Unapprove" : "Approve"}
              </button> */}
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
      {/* Pagination */}
      <div className="flex justify-center mt-4 space-x-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <button
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
        >
          Next
        </button>
      </div>
    </div>
  );
};
