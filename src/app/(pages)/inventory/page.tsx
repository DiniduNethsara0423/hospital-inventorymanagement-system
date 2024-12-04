'use client'
import React, { useState } from "react";
import Link from "next/link";


interface InventoryItem {
  name: string;
  itemCode: string;
  type: string;
  description: string;
  rate: number;
}

const page: React.FC = () => {
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);

  // Sample inventory data
  const inventoryData: InventoryItem[] = Array(500)
    .fill(null)
    .map((_, index) => ({
      name: "surgical gowns",
      itemCode: `S00${index + 1}`,
      type: "Surgical Goods",
      description: "High quality products.......",
      rate: 2000000,
    }));

  const totalPages = Math.ceil(inventoryData.length / itemsPerPage);

  // Paginated items
  const paginatedItems = inventoryData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1); // Reset to the first page
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    
    <div className="p-4 w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-2xl font-bold">Inventory All Items</div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
          + New
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="table-auto w-full border-collapse border border-gray-200">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="border border-gray-200 px-4 py-2">Name</th>
              <th className="border border-gray-200 px-4 py-2">Item Code</th>
              <th className="border border-gray-200 px-4 py-2">Type</th>
              <th className="border border-gray-200 px-4 py-2">Description</th>
              <th className="border border-gray-200 px-4 py-2">Rate (LKR)</th>
            </tr>
          </thead>
          <tbody>
            {paginatedItems.map((item, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="border border-gray-200 px-4 py-2">{item.name}</td>
                <td className="border border-gray-200 px-4 py-2">
                  {item.itemCode}
                </td>
                <td className="border border-gray-200 px-4 py-2">{item.type}</td>
                <td className="border border-gray-200 px-4 py-2">
                  {item.description}
                </td>
                <td className="border border-gray-200 px-4 py-2">{item.rate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        {/* Pagination Controls */}
        <div className="flex items-center">
          <button
            className={`px-3 py-1 rounded-md ${
              currentPage === 1 ? "bg-gray-200 cursor-not-allowed" : "bg-blue-500 text-white"
            }`}
            onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            &lt;
          </button>
          {[...Array(totalPages)].slice(0, 5).map((_, index) => (
            <button
              key={index}
              className={`px-3 py-1 mx-1 rounded-md ${
                currentPage === index + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}
          <button
            className={`px-3 py-1 rounded-md ${
              currentPage === totalPages ? "bg-gray-200 cursor-not-allowed" : "bg-blue-500 text-white"
            }`}
            onClick={() =>
              currentPage < totalPages && handlePageChange(currentPage + 1)
            }
            disabled={currentPage === totalPages}
          >
            &gt;
          </button>
        </div>

        {/* Items per page */}
        <div className="flex items-center">
          <label className="mr-2">Items Per Page:</label>
          <select
            value={itemsPerPage}
            onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
            className="border border-gray-300 rounded-md px-2 py-1"
          >
            {[10, 25, 50, 100].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  

  );
};

export default page;
