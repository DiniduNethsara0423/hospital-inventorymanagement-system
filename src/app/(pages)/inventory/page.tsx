"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAllItems, deleteItem } from "@/app/apis/inventory/api"; // Update the path as needed
import { FaEdit, FaTrash } from "react-icons/fa"; // Icons for edit and delete

interface InventoryItem {
  barcode: string;
  name: string;
  available_qty: number | null;
  total_qty: number;
  lower_quantity: number;
  category_id: number;
  department_id: number | null;
}

const ItemsPage: React.FC = () => {
  const router = useRouter();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading(true);
      try {
        const data = await getAllItems(currentPage, itemsPerPage);
        setItems(data.items || []); // Ensure your API response has an `items` key
        const count = data.count && data.count[0] && data.count[0]["COUNT(*)"];
        setTotalItems(parseInt(count, 10) || 0); // Parse the total count
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

  const handleEdit = (barcode: string) => {
    router.push(`/edit-inventory/${barcode}`); // Navigate to edit page with barcode as parameter
  };

  const handleDelete = async (barcode: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      try {
        await deleteItem(barcode); 
        setItems((prevItems) => prevItems.filter((item) => item.barcode !== barcode));
      } catch (error) {
        console.error("Failed to delete item:", error);
      }
    }
  };

  return (
    <div className=" w-full  min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-blue-700">Hospital Inventory</h1>
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg text-sm shadow-md"
          onClick={() => router.push("/add-Inventory")}
        >
          Add New Item
        </button>
      </div>

      <div className="flex justify-end items-center mb-4">
        <label className="mr-2 text-gray-700 font-medium">Items Per Page:</label>
        <select
          value={itemsPerPage}
          onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
          className="border border-gray-300 rounded-md px-3 py-1 text-gray-700 shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
        >
          {[5, 10, 25, 50].map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <p className="text-center text-gray-700 font-medium">Loading items...</p>
      ) : (
        <div className="overflow-x-auto bg-white">
          <table className="table-auto w-full ">
            <thead className="bg-[#c0e3fa] text-left">
              <tr>
                <th className=" px-4 py-2 rounded-tl-lg">Barcode</th>
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Available Qty</th>
                <th className="border px-4 py-2">Total Qty</th>
                <th className="border px-4 py-2">Lower Quantity</th>
                <th className="border px-4 py-2">Category ID</th>
                <th className="border px-4 py-2">Department ID</th>
                <th className=" px-4 py-2 rounded-tr-lg">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length > 0 ? (
                items.map((item) => (
                  <tr key={item.barcode} className="hover:bg-blue-50">
                    <td className="border  px-4 py-2">{item.barcode}</td>
                    <td className="border  px-4 py-2">{item.name}</td>
                    <td className="border  px-4 py-2">{item.available_qty ?? "N/A"}</td>
                    <td className="border  px-4 py-2">{item.total_qty}</td>
                    <td className="border  px-4 py-2">{item.lower_quantity}</td>
                    <td className="border  px-4 py-2">{item.category_id}</td>
                    <td className="border  px-4 py-2">{item.department_id ?? "N/A"}</td>
                    <td className="border  px-4 py-2 text-center">
                      <button
                        className="text-blue-600 mr-3 hover:text-blue-800"
                        onClick={() => handleEdit(item.barcode)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleDelete(item.barcode)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-4 text-gray-700">
                    No items found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <button
          className={`px-4 py-2 rounded-md shadow-md text-white font-medium ${
            currentPage === 1
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
          onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        <div className="text-gray-700 font-medium">
          Page {currentPage} of {totalPages}
        </div>

        <button
          className={`px-4 py-2 rounded-md shadow-md text-white font-medium ${
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

export default ItemsPage;