"use client";
import React, { useEffect, useState } from "react";
import { getAllItems, deleteItem } from "@/app/apis/inventory/api";
import { Edit, Trash2 } from "lucide-react";

interface InventoryItem {
  item_barcode: string;
  item_name: string;
  avalible_qty: number | null;
  currently_using_qty: number | null;
  total_qty: number;
  category_name: number;
}

interface ItemsProps {
  currentPage: number;
  itemsPerPage: number;
  onTotalItemsChange: (total: number) => void;
}

const Items: React.FC<ItemsProps> = ({ currentPage, itemsPerPage, onTotalItemsChange }) => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading(true);
      try {
        const data = await getAllItems(currentPage, itemsPerPage);
        setItems(data.items || []);
        onTotalItemsChange(parseInt(data.count[0]["COUNT(*)"], 10) || 0);
      } catch (error) {
        console.error("Failed to fetch items:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, [currentPage, itemsPerPage, onTotalItemsChange]);

  const handleDelete = async (barcode: string) => {
    try {
      await deleteItem(barcode);
      setItems((prev) => prev.filter((item) => item.item_barcode !== barcode));
    } catch (error) {
      console.error("Failed to delete item:", error);
    }
  };

  return (
    <div>
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
              <th className="px-4 py-3 text-gray-800">Removed Qty</th>
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
                <td className="border px-4 py-3 text-gray-700">{item.removed_qty}</td>
                <td className="border px-4 py-3 text-gray-700">{item.lower_quantity}</td>
                <td className="border px-4 py-3 text-gray-700">{item.qty}</td>
                <td className="border px-4 py-3 text-center">
                  <button className="text-red-600 hover:text-red-800" onClick={() => handleDelete(item.item_barcode)}>
                    <Trash2 size={20} />
                  </button>
                  
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Items;
