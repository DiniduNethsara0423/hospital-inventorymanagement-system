'use client';
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
        setItems(data.items); // Ensure your API response has an `items` key
        setTotalItems(data.Count || 0); // If API provides a total count
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
        await deleteItem(barcode); // Call the delete API
        setItems((prevItems) => prevItems.filter((item) => item.barcode !== barcode));
      } catch (error) {
        console.error("Failed to delete item:", error);
      }
    }
  };

  return (
    <div className="p-4 w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Inventory All Items</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
          onClick={() => router.push("/add-Inventory")}
        >
          + New
        </button>
      </div>

      {isLoading ? (
        <p>Loading items...</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-md">
          <table className="table-auto w-full border-collapse border border-gray-200">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="border border-gray-200 px-4 py-2">Barcode</th>
                <th className="border border-gray-200 px-4 py-2">Name</th>
                <th className="border border-gray-200 px-4 py-2">Available Qty</th>
                <th className="border border-gray-200 px-4 py-2">Total Qty</th>
                <th className="border border-gray-200 px-4 py-2">Lower Quantity</th>
                <th className="border border-gray-200 px-4 py-2">Category ID</th>
                <th className="border border-gray-200 px-4 py-2">Department ID</th>
                <th className="border border-gray-200 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length > 0 ? (
                items.map((item) => (
                  <tr key={item.barcode} className="hover:bg-gray-100">
                    <td className="border border-gray-200 px-4 py-2">{item.barcode}</td>
                    <td className="border border-gray-200 px-4 py-2">{item.name}</td>
                    <td className="border border-gray-200 px-4 py-2">{item.available_qty ?? "N/A"}</td>
                    <td className="border border-gray-200 px-4 py-2">{item.total_qty}</td>
                    <td className="border border-gray-200 px-4 py-2">{item.lower_quantity}</td>
                    <td className="border border-gray-200 px-4 py-2">{item.category_id}</td>
                    <td className="border border-gray-200 px-4 py-2">{item.department_id ?? "N/A"}</td>
                    <td className="border border-gray-200 px-4 py-2 text-center">
                      <button
                        className="text-blue-600 mr-2"
                        onClick={() => handleEdit(item.barcode)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="text-red-600"
                        onClick={() => handleDelete(item.barcode)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-4">
                    No items found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center">
          <button
            className={`px-3 py-1 rounded-md ${
              currentPage === 1 ? "bg-gray-200 cursor-not-allowed" : "bg-blue-500 text-white"
            }`}
            onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
          >
            &lt;
          </button>
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              className={`px-3 py-1 mx-1 rounded-md ${
                currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-gray-200"
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
            onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
          >
            &gt;
          </button>
        </div>

        <div className="flex items-center">
          <label className="mr-2">Items Per Page:</label>
          <select
            value={itemsPerPage}
            onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
            className="border border-gray-300 rounded-md px-2 py-1"
          >
            {[5, 10, 25, 50].map((option) => (
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

export default ItemsPage;
