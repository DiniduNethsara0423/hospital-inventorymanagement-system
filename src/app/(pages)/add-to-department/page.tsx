"use client";
import React, { useEffect, useState } from "react";
import { getAllItems } from "@/app/apis/inventory/api"; // Update the path as needed

interface InventoryItem {
  barcode: string;
  name: string;
  available_qty: number | null;
  total_qty: number;
  lower_quantity: number;
  category_id: number;
  department_id: number | null;
}

const AddItemsToDepartmentPage: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [quantities, setQuantities] = useState<{ [barcode: string]: number }>({});

  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading(true);
      try {
        const data = await getAllItems(currentPage, itemsPerPage);
        setItems(data.items || []);
        const count = data.count && data.count[0] && data.count[0]["COUNT(*)"];
        setTotalItems(parseInt(count, 10) || 0);
      } catch (error) {
        console.error("Failed to fetch items:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, [currentPage, itemsPerPage]);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1); // Reset to the first page
  };

  const handleCheckboxChange = (barcode: string, isChecked: boolean) => {
    setSelectedItems((prevSelected) => {
      const updatedSet = new Set(prevSelected);
      isChecked ? updatedSet.add(barcode) : updatedSet.delete(barcode);
      return updatedSet;
    });
  };

  const handleQuantityChange = (barcode: string, quantity: number) => {
    setQuantities((prev) => ({
      ...prev,
      [barcode]: quantity,
    }));
  };

  const handleAddToDepartment = () => {
    const selectedData = Array.from(selectedItems).map((barcode) => ({
      barcode,
      quantity: quantities[barcode] || 0,
    }));
    console.log("Selected items to add to department:", selectedData);
    // Handle backend logic for adding items to department
  };

  return (
    <div className="p-8 w-full min-h-screen bg-white">
      <h1 className="text-4xl font-extrabold text-blue-700 mb-6">Add Items to Department</h1>

      <div className="flex justify-end items-center mb-4">
        <label className="mr-3 text-gray-800 font-medium">Items Per Page:</label>
        <select
          value={itemsPerPage}
          onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
          className="border border-gray-300 rounded-md px-4 py-2 text-gray-800 shadow-sm focus:outline-none focus:ring focus:ring-blue-300 hover:shadow-lg"
        >
          {[10, 25, 50].map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <p className="text-center text-gray-700 font-medium">Loading items...</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg">
          <table className="table-auto w-full border-collapse">
            <thead className="bg-blue-200 text-left">
              <tr>
                <th className="px-4 py-3 rounded-tl-lg text-gray-800">Select</th>
                <th className="border px-4 py-3 text-gray-800">Barcode</th>
                <th className="border px-4 py-3 text-gray-800">Name</th>
                <th className="border px-4 py-3 text-gray-800">Available Qty</th>
                <th className="border px-4 py-3 text-gray-800">Total Qty</th>
                <th className="border px-4 py-3 text-gray-800">Lower Quantity</th>
                <th className="rounded-tr-lg px-4 py-3 text-gray-800">Add Qty</th>
              </tr>
            </thead>
            <tbody>
              {items.length > 0 ? (
                items.map((item) => (
                  <tr key={item.barcode} className="hover:bg-blue-50">
                    <td className="border px-4 py-3 text-center">
                      <input
                        type="checkbox"
                        onChange={(e) =>
                          handleCheckboxChange(item.barcode, e.target.checked)
                        }
                      />
                    </td>
                    <td className="border px-4 py-3 text-gray-700">{item.barcode}</td>
                    <td className="border px-4 py-3 text-gray-700">{item.name}</td>
                    <td className="border px-4 py-3 text-gray-700">{item.available_qty ?? "N/A"}</td>
                    <td className="border px-4 py-3 text-gray-700">{item.total_qty}</td>
                    <td className="border px-4 py-3 text-gray-700">{item.lower_quantity}</td>
                    <td className="border px-4 py-3">
                      <input
                        type="number"
                        min="0"
                        value={quantities[item.barcode] || ""}
                        onChange={(e) =>
                          handleQuantityChange(item.barcode, Number(e.target.value))
                        }
                        className="border rounded-md px-2 py-1 w-full"
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-gray-700">
                    No items found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex justify-between items-center mt-8">
        <button
          className={`px-6 py-2 rounded-md shadow-md text-white font-medium transition-colors ${
            currentPage === 1
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
          onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        <button
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg text-base shadow-lg font-semibold"
          onClick={handleAddToDepartment}
        >
          Add to Department
        </button>

        <button
          className={`px-6 py-2 rounded-md shadow-md text-white font-medium transition-colors ${
            currentPage === totalPages
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
          onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AddItemsToDepartmentPage;
