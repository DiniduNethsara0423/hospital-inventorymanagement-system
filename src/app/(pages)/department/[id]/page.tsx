"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { updateDepartment, deleteDepartment, getDepartmentById, removeItemFromDepartment,  } from "@/app/apis/department/api";
import { Trash2, Edit } from "lucide-react";
import React from "react";

const DepartmentDetailPage = ({ params }: { params: { id: any } }) => {
  const [name, setName] = useState("Sample Department");
  const [isEditing, setIsEditing] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const router = useRouter();


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [removingQty, setRemovingQty] = useState(1);
  const [reason, setReason] = useState("");

  const fetchDepartmentDetails = async () => {
    setLoading(true);
    try {
      const response = await getDepartmentById(params.id);
      if (response) {
        setName(response.name);
      } else {
        console.error("Invalid API response for department:", response);
      }
    } catch (error) {
      console.error("Error fetching department details:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchItemsByDepartment = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3100/items/items-department/get-details/${params.id}`);
      const data = await res.json();
      if (data) {
        setItems(Array.isArray(data) ? data : [data]);
      } else {
        console.error("Invalid API response for items:", data);
      }
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartmentDetails();
    fetchItemsByDepartment();
  }, []);

  const handleUpdate = async () => {
    if (!name.trim()) {
      alert("Department name is required.");
      return;
    }
    try {
      await updateDepartment({ id: parseInt(params.id), name });
      alert("Department updated successfully.");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating department:", error);
      alert("Failed to update department.");
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this department?")) {
      try {
        await deleteDepartment(parseInt(params.id));
        alert("Department deleted successfully.");
        router.back();
      } catch (error) {
        console.error("Error deleting department:", error);
        alert("Failed to delete department.");
      }
    }
  };

  const handleEditItem = (item: any) => {
    alert(`Editing item: ${item.ITEM_NAME}`);
    // Implement edit functionality here
  };


  const handleDeleteItem = async () => {
    if (!selectedItem) return;

    if (removingQty > selectedItem.QTY) {
      alert("Removing quantity cannot exceed available quantity.");
      return;
    }

    try {
      const payload = { qty: removingQty, reason };
      await removeItemFromDepartment(selectedItem.ITEM_BARCODE, payload);
      alert("Item removed successfully.");
      setIsModalOpen(false);
      fetchItemsByDepartment();
    } catch (error) {
      console.error("Error removing item:", error);
      alert("Failed to remove item.");
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen flex flex-col relative">
      {/* Top Buttons */}
      <div className="flex justify-end space-x-4 mb-8">
        <button
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-500"
          onClick={() => setIsEditing(true)}
        >
          Edit
        </button>
        <button
          className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-500"
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Department Details</h1>

        {isEditing ? (
          <div className="flex flex-col items-center">
            <input
              type="text"
              className="w-full max-w-md border border-gray-300 rounded-lg px-4 py-2 mb-4 shadow-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter Department Name"
            />
            <div className="flex space-x-4">
              <button
                className="bg-gray-500 text-white px-5 py-2 rounded-lg hover:bg-gray-400"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-500"
                onClick={handleUpdate}
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-lg font-medium text-gray-700">Department Name: {name}</p>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="mt-10 bg-white rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Items</h2>
        <table className="table-auto w-full text-left bg-white">
          <thead className="bg-blue-100 text-gray-800 text-sm font-medium">
            <tr>
              <th className="px-4 py-2 rounded-tl-lg">Barcode</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Quantity</th>
              <th className="px-4 py-2 rounded-tr-lg">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index} className="border-t hover:bg-gray-100">
                <td className="border px-4 py-2">{item.ITEM_BARCODE}</td>
                <td className="border px-4 py-2">{item.ITEM_NAME}</td>
                <td className="border px-4 py-2">{item.QTY}</td>
                <td className="border px-4 py-2 flex space-x-4">
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => {
                      setSelectedItem(item);
                      setIsModalOpen(true);
                    }}
                  >
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Remove Item</h2>
            <p className="mb-2">Item: {selectedItem.ITEM_NAME}</p>
            <p className="mb-4">Available Quantity: {selectedItem.QTY}</p>

            <label className="block mb-2">
              Quantity to Remove:
              <input
                type="number"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                value={removingQty}
                onChange={(e) => setRemovingQty(parseInt(e.target.value) || 1)}
                min={1}
              />
            </label>

            <label className="block mb-4">
              Reason:
              <textarea
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter reason for removal"
              />
            </label>

            <div className="flex justify-end space-x-4">
              <button
                className="bg-gray-500 text-white px-5 py-2 rounded-lg hover:bg-gray-400"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-500"
                onClick={handleDeleteItem}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentDetailPage;
