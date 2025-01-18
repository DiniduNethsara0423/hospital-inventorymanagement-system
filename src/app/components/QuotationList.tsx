import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { deletePurchaseRequest, getPurchaseRequest } from "@/app/apis/purchase/api"; // Adjust path

interface Quotation {
  id: string;
  name: string;
  description: string;
  fullPrice: number;
}

interface QuotationListProps {
  searchQuery: string;
  setSelectedQuotation: React.Dispatch<React.SetStateAction<Quotation | null>>;
  quotations: any
}

export const QuotationList: React.FC<QuotationListProps> = ({
  searchQuery,
  setSelectedQuotation,
}) => {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [quotationToDelete, setQuotationToDelete] = useState<string | null>(
    null
  );

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
      }));
      setQuotations(transformedData);
    } catch (err) {
      console.error("Failed to fetch quotations:", err);
      setError("Failed to load quotations. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (quotationId: string) => {
    setQuotationToDelete(quotationId);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (!quotationToDelete) return;

    try {
      setIsLoading(true);
      await deletePurchaseRequest(quotationToDelete);
      setQuotations((prevQuotations) =>
        prevQuotations.filter((quotation) => quotation.id !== quotationToDelete)
      );
      setShowModal(false);
      setQuotationToDelete(null);
    } catch (err) {
      console.error("Failed to delete quotation:", err);
      setError("Failed to delete quotation. Please try again.");
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
            className="flex items-center justify-between p-4 rounded-lg shadow-sm hover:shadow-md transition my-3 bg-blue-50"
            onClick={() => setSelectedQuotation(quotation)}
          >
            <div>
              <h3 className="font-bold text-lg text-blue-800">
                {quotation.name}
              </h3>
              <p className="text-gray-600">
                Price: ${quotation.fullPrice.toFixed(2)}
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteClick(quotation.id);
              }}
              className="px-4 py-2 rounded-md font-bold text-sm bg-red-500 text-white hover:bg-red-600"
            >
              <FaTrash />
            </button>
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

      {/* Delete Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-md p-6 rounded-md shadow-lg relative">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Confirm Deletion
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this quotation?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
