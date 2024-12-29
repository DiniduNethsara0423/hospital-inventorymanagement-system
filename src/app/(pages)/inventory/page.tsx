"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAllItems, deleteItem } from "@/app/apis/inventory/api"; // Update the path as needed
import { Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react"; // Updated icons from Lucide React

interface InventoryItem {
  item_barcode: string;
  item_name: string;
  avalible_qty: number | null;
  currently_using_qty: number | null;
  total_qty: number;
  category_name: number;
}

const ItemsPage: React.FC = () => {
  const router = useRouter();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      console.log("Fetching inventory...");
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
    if (confirm("Are you sure you want to delete this item? It will delete Permenently")) {
      try {
        await deleteItem(barcode);
        setItems((prevItems) => prevItems.filter((item) => item.item_barcode !== barcode));
      } catch (error) {
        console.error("Failed to delete item:", error);
      }
    }
  };

  return (
    <div className="p-8 w-full min-h-screen bg-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-extrabold text-gray-800">Hospital Inventory</h1>
        <button
          className="bg-gray-700 hover:bg-gray-800 text-white px-8 py-3 rounded-lg text-base shadow-lg font-semibold"
          onClick={() => router.push("/add-Inventory")}
        >
          Add New Item
        </button>
      </div>

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
                <th className="px-4 py-3 rounded-tl-lg text-gray-800">Barcode</th>
                <th className="border px-4 py-3 text-gray-800">Name</th>
                <th className="border px-4 py-3 text-gray-800">Category</th>
                <th className="border px-4 py-3 text-gray-800">Available Qty</th>
                <th className="border px-4 py-3 text-gray-800">Currently Using Qty</th>
                <th className="border px-4 py-3 text-gray-800">Total Qty</th>
                <th className="px-4 py-3 rounded-tr-lg text-gray-800 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length > 0 ? (
                items.map((item) => (
                  <tr key={item.item_barcode} className="hover:bg-blue-50">
                    <td className="border px-4 py-3 text-gray-700">{item.item_barcode}</td>
                    <td className="border px-4 py-3 text-gray-700">{item.item_name}</td>
                    <td className="border px-4 py-3 text-gray-700">{item.category_name}</td>
                    <td className="border px-4 py-3 text-gray-700">{item.avalible_qty ?? "N/A"}</td>
                    <td className="border px-4 py-3 text-gray-700">{item.currently_using_qty ?? "N/A"}</td>
                    <td className="border px-4 py-3 text-gray-700">{item.total_qty}</td>
                    <td className="border px-4 py-3 text-center">
                      <button
                        className="text-blue-600 mr-4 hover:text-blue-800"
                        onClick={() => handleEdit(item.item_barcode)}
                      >
                        <Edit size={20} />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleDelete(item.item_barcode)}
                      >
                        <Trash2 size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-6 text-gray-700">
                    No items found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center items-center mt-6 space-x-4">
  <button
    onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
    className={`px-4 py-2 bg-gray-200 rounded-lg shadow ${
      currentPage === 1
        ? "opacity-50 cursor-not-allowed"
        : "hover:bg-gray-300"
    } transition`}
    disabled={currentPage === 1}
  >
    <ChevronLeft className="w-5 h-5" />
  </button>

  <span className="text-gray-700 font-medium">
    Page {currentPage} of {totalPages}
  </span>

  <button
    onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
    className={`px-4 py-2 bg-gray-200 rounded-lg shadow ${
      currentPage === totalPages
        ? "opacity-50 cursor-not-allowed"
        : "hover:bg-gray-300"
    } transition`}
    disabled={currentPage === totalPages}
  >
    <ChevronRight className="w-5 h-5" />
  </button>
</div>

    </div>
  );
};

export default ItemsPage;
