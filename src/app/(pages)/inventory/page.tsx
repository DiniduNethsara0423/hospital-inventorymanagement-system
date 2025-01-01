"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAllItems, getAllItemDetails, deleteItem } from "@/app/apis/inventory/api"; // Update the path as needed
import { Edit, Trash2 } from "lucide-react";

interface InventoryItem {
  item_barcode: string;
  item_name: string;
  avalible_qty: number | null;
  currently_using_qty: number | null;
  total_qty: number;
  category_name: number;
}

interface ItemDetails {
  id: number;
  barcode: string;
  name: string;
  price: string;
  invoice_id: string;
  qty: number;
  maintance_date: string | null;
}

const ItemsPage: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"items" | "itemDetails">("items");
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [itemDetails, setItemDetails] = useState<ItemDetails[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading(true);
      try {
        if (activeTab === "items") {
          const data = await getAllItems(currentPage, itemsPerPage);
          setItems(data.items || []);
          setTotalItems(parseInt(data.count[0]["COUNT(*)"], 10) || 0);
        } else {
          const data = await getAllItemDetails(currentPage, itemsPerPage);
          setItemDetails(data.results || []);
          setTotalItems(data.totalCount || 0);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchItems();
  }, [activeTab, currentPage, itemsPerPage]);
  
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const handleDelete = async (id: string | number) => {
    if (confirm("Are you sure you want to delete this item? It will delete permanently.")) {
      try {
        await deleteItem(id);
        if (activeTab === "items") {
          setItems((prevItems) => prevItems.filter((item) => item.item_barcode !== id));
        } else {
          setItemDetails((prevDetails) => prevDetails.filter((detail) => detail.id !== id));
        }
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

      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab("items")}
          className={`px-6 py-2 rounded-lg font-medium ${activeTab === "items" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
            }`}
        >
          Items
        </button>
        <button
          onClick={() => setActiveTab("itemDetails")}
          className={`px-6 py-2 rounded-lg font-medium ${activeTab === "itemDetails" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
            }`}
        >
          Item Details
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
                {activeTab === "items" ? (
                  <>
                    <th className="px-4 py-3 text-gray-800">Barcode</th>
                    <th className="px-4 py-3 text-gray-800">Name</th>
                    <th className="px-4 py-3 text-gray-800">Category</th>
                    <th className="px-4 py-3 text-gray-800">Available Qty</th>
                    <th className="px-4 py-3 text-gray-800">Currently Using Qty</th>
                    <th className="px-4 py-3 text-gray-800">Total Qty</th>
                  </>
                ) : (
                  <>
                    <th className="px-4 py-3 text-gray-800">ID</th>
                    <th className="px-4 py-3 text-gray-800">Barcode</th>
                    <th className="px-4 py-3 text-gray-800">Name</th>
                    <th className="px-4 py-3 text-gray-800">Price</th>
                    <th className="px-4 py-3 text-gray-800">Invoice ID</th>
                    <th className="px-4 py-3 text-gray-800">Qty</th>
                    <th className="px-4 py-3 text-gray-800">Maintenance Date</th>
                  </>
                )}
                <th className="px-4 py-3 text-gray-800 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(activeTab === "items" ? items : itemDetails).map((item: any) => (
                <tr key={item.id || item.item_barcode} className="hover:bg-blue-50">
                  {activeTab === "items" ? (
                    <>
                      <td className="border px-4 py-3 text-gray-700">{item.item_barcode}</td>
                      <td className="border px-4 py-3 text-gray-700">{item.item_name}</td>
                      <td className="border px-4 py-3 text-gray-700">{item.category_name}</td>
                      <td className="border px-4 py-3 text-gray-700">{item.available_qty}</td>
                      <td className="border px-4 py-3 text-gray-700">{item.currently_using_qty ?? "N/A"}</td>
                      <td className="border px-4 py-3 text-gray-700">{item.total_qty}</td>
                    </>
                  ) : (
                    <>
                      <td className="border px-4 py-3 text-gray-700">{item.id}</td>
                      <td className="border px-4 py-3 text-gray-700">{item.barcode}</td>
                      <td className="border px-4 py-3 text-gray-700">{item.name}</td>
                      <td className="border px-4 py-3 text-gray-700">{item.price}</td>
                      <td className="border px-4 py-3 text-gray-700">{item.invoice_id}</td>
                      <td className="border px-4 py-3 text-gray-700">{item.qty}</td>
                      <td className="border px-4 py-3 text-gray-700">{item.maintance_date ?? "N/A"}</td>
                    </>
                  )}
                  <td className="border px-4 py-3 text-center">
                    <button
                      className="text-blue-600 mr-4 hover:text-blue-800"
                      onClick={() => router.push(`/edit-${activeTab}/${item.id || item.item_barcode}`)}
                    >
                      <Edit size={20} />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleDelete(item.id || item.item_barcode)}
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex justify-between items-center mt-4">
        <button
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
          className={`px-4 py-2 rounded-lg font-medium ${currentPage === 1 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-blue-500 text-white"
            }`}
        >
          Previous
        </button>
        <span className="text-gray-800 font-medium">
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
          className={`px-4 py-2 rounded-lg font-medium ${currentPage === totalPages ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-blue-500 text-white"
            }`}
        >
          Next
        </button>
      </div>

    </div>
  );
};

export default ItemsPage;
