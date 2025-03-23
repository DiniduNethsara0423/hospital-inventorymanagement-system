// ItemDetails.tsx
"use client";
import React, { useEffect, useState } from "react";
import { getAllItemDetails, deleteItemDetail, updateItemDetail } from "@/app/apis/inventory/api";
import { Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import Notificationpop from "./Notificationpop";

interface ItemDetails {
  id: number;
  barcode: string;
  name: string;
  price: number;
  invoice_id: string;
  qty: number;
  maintance_date: string | null;
}

interface ItemDetailsProps {
  currentPage: number;
  itemsPerPage: number;
  onTotalItemsChange: (total: number) => void;
}`

`

const ItemDetails: React.FC<ItemDetailsProps> = ({ currentPage, itemsPerPage, onTotalItemsChange }) => {
  const [itemDetails, setItemDetails]: any = useState<ItemDetails[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingItem, setEditingItem]: any = useState<ItemDetails | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [totalItems, setTotalItems] = useState(0); // For total items count
  const [current, setCurrent] = useState(currentPage); // Current page state
  const [pageSize, setPageSize] = useState(itemsPerPage); // Page size state
  const [maintanceType, setMaintanceType] = useState("exact"); // Default: Exact date
  const [maintanceDate, setMaintanceDate] = useState(""); // Stores final date

  const [notification, setNotification] = useState<string | null>(null);
  const [notificationType, setNotificationType] = useState<"success" | "warning" | null>(null);


  useEffect(() => {
    const fetchItemDetails = async () => {
      setIsLoading(true);
      try {
        const data = await getAllItemDetails(current, pageSize);
        setItemDetails(data.results || []);
        onTotalItemsChange(data.totalCount || 0);
      } catch (error) {
        console.error("Failed to fetch item details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItemDetails();
  }, [current, pageSize]);

  const totalPages = Math.ceil(totalItems / pageSize);

  const handlePageChange = (page: number) => {
    setCurrent(page);
  };

  const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(parseInt(event.target.value, 10));
    setCurrent(1); // Reset to the first page
  };


  const handleDelete = async (id: number, qty: number) => {
    const removingQty = parseInt(prompt("Enter quantity to remove:") || "0", 10);
    if (!removingQty || removingQty <= 0 || removingQty > qty) {
      alert("Invalid quantity entered.");
      return;
    }

    try {
      await deleteItemDetail(id, removingQty);
      setItemDetails((prev: any) => prev.map((item: any) => (item.id === id ? { ...item, qty: item.qty - removingQty } : item)));
    } catch (error) {
      console.error("Failed to delete item detail:", error);
    }
  };

  const handleEdit = (item: ItemDetails) => {
    setEditingItem({ ...item });
    setIsModalOpen(true);
  };
  const formatDate = (date: string | null) => {
    return date ? format(new Date(date), "PPpp") : "N/A"; // Example: "Jan 4, 2025, 2:34 PM"
  };

  const handleUpdate = async () => {
    if (!editingItem) return;
  
    const { price, removed_qty = 0 } = editingItem;
  
    if (removed_qty <= 0 || removed_qty > editingItem.qty) {
      setNotification("Invalid removed quantity entered.");
      setNotificationType("warning");
      return;
    }
  
    const updatedQty = editingItem.qty - removed_qty;
  
    // Ensure maintance_date is in correct Date format
    let formattedDate = null;
    if (maintanceDate) {
      formattedDate = new Date(maintanceDate); // Convert to Date instance
    }
  
    const updatedData = {
      ...editingItem,
      price: parseFloat(price),
      removed_qty,
      qty: updatedQty,
      maintance_date: formattedDate, // Send as Date object
    };
  
    // Remove unwanted fields
    const { created_at, updated_at, ...dataToSend } = updatedData;
  
    try {
      const response = await updateItemDetail(editingItem.id, dataToSend);
  
      if (response.msg && response.msg.startsWith("Low Stock Alert")) {
        setNotification(response.msg);
        setNotificationType("warning");
      } else {
        setNotification("Item updated successfully!");
        setNotificationType("success");
      }
  
      setItemDetails((prev: any) =>
        prev.map((item: any) => (item.id === editingItem.id ? { ...item, ...dataToSend } : item))
      );
      setEditingItem(null);
      setIsModalOpen(false);
  
      // Clear the notification after 5 seconds
      setTimeout(() => {
        setNotification(null);
        setNotificationType(null);
      }, 5000);
    } catch (error) {
      setNotification("Failed to update item detail.");
      setNotificationType("warning");
    }
  };
  
  




  return (
    <div>



      <div className="flex justify-between items-center mb-4">

        {notification && notificationType && (
          <Notificationpop message={notification} type={notificationType} />
        )}

        <div>
          <label htmlFor="pageSize" className="mr-2 text-gray-700">
            Items per page:
          </label>
          <select
            id="pageSize"
            className="border px-3 py-2 rounded"
            value={pageSize}
            onChange={handlePageSizeChange}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
        <p className="text-gray-700">Total Items: {totalItems}</p>
      </div>

      {isLoading ? (
        <p className="text-center text-gray-700 font-medium">Loading item details...</p>
      ) : (
        <div>
          {/* Table for large screens */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="table-auto w-full border-collapse">
              <thead className="bg-blue-200 text-left">
                <tr>
                  <th className="px-4 py-3 text-gray-800">ID</th>
                  <th className="px-4 py-3 text-gray-800">Barcode</th>
                  <th className="px-4 py-3 text-gray-800">Price</th>
                  <th className="px-4 py-3 text-gray-800">Invoice ID</th>
                  <th className="px-4 py-3 text-gray-800">Qty</th>
                  <th className="px-4 py-3 text-gray-800">Maintenance Date</th>
                  <th className="px-4 py-3 text-gray-800">Removed Qty</th>
                  <th className="px-4 py-3 text-gray-800">Removed Purpose</th>
                  <th className="px-4 py-3 text-gray-800 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {itemDetails.map((detail: any) => (
                  <tr key={detail.id} className="hover:bg-blue-50">
                    <td className="border px-4 py-3 text-gray-700">{detail.id}</td>
                    <td className="border px-4 py-3 text-gray-700">{detail.barcode}</td>
                    <td className="border px-4 py-3 text-gray-700">{detail.price}</td>
                    <td className="border px-4 py-3 text-gray-700">{detail.invoice_id}</td>
                    <td className="border px-4 py-3 text-gray-700">{detail.qty}</td>
                    <td className="border px-4 py-3 text-gray-700">{formatDate(detail.maintance_date) ?? "N/A"}</td>
                    <td className="border px-4 py-3 text-gray-700">{detail.removed_qty}</td>
                    <td className="border px-4 py-3 text-gray-700">{detail.removed_purpose ?? "N/A"}</td>
                    <td className="border px-4 py-3 text-center">
                      <button
                        className="text-red-600 hover:text-red-800 mr-2"
                        onClick={() => handleDelete(detail.id, detail.qty)}
                      >
                        <Trash2 size={20} />
                      </button>
                      <button
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => handleEdit(detail)}
                      >
                        <Edit size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Card layout for small screens */}
          <div className="lg:hidden space-y-4">
            {itemDetails.map((detail: any) => (
              <div
                key={detail.id}
                className="bg-white shadow-md rounded-lg p-4 border border-gray-300"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">Barcode: {detail.barcode}</h3>
                  <div className="flex space-x-2">
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => handleEdit(detail)}
                    >
                      <Edit size={20} />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleDelete(detail.id, detail.qty)}
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">ID: {detail.id}</p>
                <p className="text-gray-600 text-sm">Price: {detail.price}</p>
                <p className="text-gray-600 text-sm">Invoice ID: {detail.invoice_id}</p>
                <p className="text-gray-600 text-sm">Qty: {detail.qty}</p>
                <p className="text-gray-600 text-sm">Maintenance Date: {formatDate(detail.maintance_date) ?? "N/A"}</p>
                <p className="text-gray-600 text-sm">Removed Qty: {detail.removed_qty}</p>
                <p className="text-gray-600 text-sm">Removed Purpose: {detail.removed_purpose ?? "N/A"}</p>
              </div>
            ))}
          </div>
        </div>
      )}


      {isModalOpen && editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-md flex justify-center items-center z-50 max-sm:px-4">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Edit Item</h2>

            <div className="grid gap-6">
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-1">Price</label>
                <input
                  type="number"
                  step="0.01"
                  value={editingItem.price}
                  onChange={(e) =>
                    setEditingItem((prev: any) =>
                      prev ? { ...prev, price: parseFloat(e.target.value) || 0 } : null
                    )
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-lg"
                />
              </div>

              {/* Show date picker only when selecting exact or relative date */}
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-1">
                  Select Maintaince Date
                </label>
                <input
                  type="date"
                  value={maintanceDate}
                  onChange={(e) => setMaintanceDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-lg"
                />
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-700 mb-1">Removed Quantity</label>
                <input
                  type="number"
                  value={editingItem.removed_qty || ""}
                  onChange={(e) => {
                    const removedQty = parseInt(e.target.value, 10) || 0;
                    setEditingItem((prev: any) =>
                      prev
                        ? {
                          ...prev,
                          removed_qty: removedQty,
                        }
                        : null
                    );
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-lg"
                />
              </div>
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-1">Removed Purpose</label>
                <input
                  type="text"
                  value={editingItem.removed_purpose || ""}
                  onChange={(e) =>
                    setEditingItem((prev: any) => prev && { ...prev, removed_purpose: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-lg"
                />
              </div>
              <div>
                <p className="text-lg font-medium text-gray-700">
                  Updated Quantity: {editingItem.qty - (editingItem.removed_qty || 0)}
                </p>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg mr-2"
              >
                Save
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mt-4">
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          onClick={() => handlePageChange(current - 1)}
          disabled={current === 1}
        >
          Previous
        </button>
        <div className="flex space-x-2">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              className={`px-4 py-2 rounded ${current === index + 1 ? "bg-blue-600 text-white" : "bg-gray-200"}`}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          onClick={() => handlePageChange(current + 1)}
          disabled={current === totalPages}
        >
          Next
        </button>
      </div>

    </div>
  );
};

export default ItemDetails;
