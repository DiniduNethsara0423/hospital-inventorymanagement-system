"use client";
import React, { useEffect, useState } from "react";
import { getAllItems, deleteItem, updateItem, getAllCategories } from "@/app/apis/inventory/api";
import { Edit, Trash2 } from "lucide-react";

interface InventoryItem {
  item_barcode: string;
  item_name: string;
  available_qty: number | null;
  currently_using_qty: number | null;
  total_qty: number;
  category_name: string;
  lower_quantity: number | null;
}

interface Category {
  id: number;
  category_name: string;
}

interface ItemsProps {
  currentPage: number;
  itemsPerPage: number;
  onTotalItemsChange: (total: number) => void;
}

const Items: React.FC<ItemsProps> = ({ currentPage, itemsPerPage, onTotalItemsChange }) => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteItemBarcode, setDeleteItemBarcode] = useState<string | null>(null);
  const [editItem, setEditItem] = useState<Partial<InventoryItem> | null>(null);

  const [totalItems, setTotalItems] = useState(0); // For total items count
  const [current, setCurrent] = useState(currentPage); // Current page state
  const [pageSize, setPageSize] = useState(itemsPerPage); // Page size state

  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading(true);
      try {
        const data = await getAllItems(current, pageSize);
        setItems(data.items || []);
        const total = parseInt(data.count[0]["COUNT(*)"], 10) || 0;
        onTotalItemsChange(total);
        setTotalItems(total);
      } catch (error) {
        console.error("Failed to fetch items:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data || []);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchItems();
    fetchCategories();
  }, [current, pageSize, onTotalItemsChange]);

  const totalPages = Math.ceil(totalItems / pageSize);

  const handlePageChange = (page: number) => {
    setCurrent(page);
  };

  const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(parseInt(event.target.value, 10));
    setCurrent(1); 
  };

  const confirmDelete = (barcode: string) => {
    setDeleteItemBarcode(barcode);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteItemBarcode) return;

    try {
      await deleteItem(deleteItemBarcode);
      setItems((prev) => prev.filter((item) => item.item_barcode !== deleteItemBarcode));
      setIsDeleteModalOpen(false);
      setDeleteItemBarcode(null);
    } catch (error) {
      console.error("Failed to delete item:", error);
    }
  };

  const handleEditClick = (item: InventoryItem) => {
    setEditItem({
      item_barcode: item.item_barcode,
      item_name: item.item_name,
      lower_quantity: item.lower_quantity,
      category_name: item.category_name,
    });
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditItem(null);
  };

  const handleSave = async () => {
    if (!editItem || !editItem.item_barcode) return;

    try {
      const selectedCategory = categories.find((cat) => cat.category_name === editItem.category_name);
      if (!selectedCategory) {
        console.error("Invalid category selected");
        return;
      }

      await updateItem(editItem.item_barcode, {
        name: editItem.item_name,
        lower_quantity: editItem.lower_quantity,
        category_id: selectedCategory.id,
      });

      setItems((prev) =>
        prev.map((item) =>
          item.item_barcode === editItem.item_barcode
            ? {
                ...item,
                item_name: editItem.item_name!,
                lower_quantity: editItem.lower_quantity!,
                category_name: selectedCategory.category_name,
              }
            : item
        )
      );

      handleModalClose();
    } catch (error) {
      console.error("Failed to update item:", error);
    }
  };

  return (
    <div>

<div className="flex justify-between items-center mb-4">
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
        <p className="text-center text-gray-700 font-medium">Loading items...</p>
      ) : (
        <table className="table-auto w-full border-collapse">
          <thead className="bg-blue-200 text-left">
            <tr>
              <th className="px-4 py-3 text-gray-800">Barcode</th>
              <th className="px-4 py-3 text-gray-800">Name</th>
              <th className="px-4 py-3 text-gray-800">Category</th>
              <th className="px-4 py-3 text-gray-800">Available Qty</th>
              <th className="px-4 py-3 text-gray-800">Currently Using Qty</th>
              <th className="px-4 py-3 text-gray-800">Lower Qty</th>
              <th className="px-4 py-3 text-gray-800">Total Qty</th>
              <th className="px-4 py-3 text-gray-800 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.item_barcode} className="hover:bg-blue-50">
                <td className="border px-4 py-3 text-gray-700">{item.item_barcode}</td>
                <td className="border px-4 py-3 text-gray-700">{item.item_name}</td>
                <td className="border px-4 py-3 text-gray-700">{item.category_name}</td>
                <td className="border px-4 py-3 text-gray-700">{item.available_qty}</td>
                <td className="border px-4 py-3 text-gray-700">{item.currently_using_qty ?? "N/A"}</td>
                <td className="border px-4 py-3 text-gray-700">{item.lower_quantity}</td>
                <td className="border px-4 py-3 text-gray-700">{item.total_qty}</td>
                <td className="border px-4 py-3 text-center">
                  <button
                    className="text-blue-600 hover:text-blue-800 mr-2"
                    onClick={() => handleEditClick(item)}
                  >
                    <Edit size={20} />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800"
                    onClick={() => confirmDelete(item.item_barcode)}
                  >
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-1/3">
            <h3 className="text-xl font-semibold mb-4">Delete Item</h3>
            <p className="mb-6 text-gray-700">
              Are you sure you want to delete this item? This action is permanent and cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-1/3">
            <h3 className="text-xl font-semibold mb-4">Edit Item</h3>
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Name</label>
              <input
                type="text"
                className="w-full border px-3 py-2 rounded"
                value={editItem?.item_name || ""}
                onChange={(e) => setEditItem((prev) => ({ ...prev, item_name: e.target.value }))}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Lower Qty</label>
              <input
                type="number"
                className="w-full border px-3 py-2 rounded"
                value={editItem?.lower_quantity || ""}
                onChange={(e) =>
                  setEditItem((prev) => ({ ...prev, lower_quantity: parseInt(e.target.value, 10) }))
                }
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Category</label>
              <select
                className="w-full border px-3 py-2 rounded"
                value={editItem?.category_name || ""}
                onChange={(e) =>
                  setEditItem((prev) => ({ ...prev, category_name: e.target.value }))
                }
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.category_name}>
                    {category.category_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                onClick={handleModalClose}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={handleSave}
              >
                Save
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

export default Items;
