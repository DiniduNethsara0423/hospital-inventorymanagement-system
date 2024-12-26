"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateDepartment, deleteDepartment } from "@/app/apis/department/api";

const DepartmentDetailPage = ({ params }: { params: { id: string } }) => {
  const [name, setName] = useState("Sample Department");
  const [isEditing, setIsEditing] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const router = useRouter();

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
      <div className="bg-white shadow-md rounded-lg p-6">
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

        <button
          className="mt-8 bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-500"
          onClick={() => setIsPopupOpen(true)}
        >
          Add New Item
        </button>
      </div>

      {/* Table */}
      <div className="mt-10 bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Items</h2>
        <table className="table-auto w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 text-left text-gray-700">
              <th className="px-4 py-2 rounded-tl-lg">Barcode</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Available Qty</th>
              <th className="px-4 py-2">Total Qty</th>
              <th className="px-4 py-2">Lower Quantity</th>
              <th className="px-4 py-2 rounded-tr-lg">Category ID</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(7)].map((_, i) => (
              <tr key={i} className="hover:bg-gray-100">
                <td className="border px-4 py-2">123456</td>
                <td className="border px-4 py-2">Sample Item</td>
                <td className="border px-4 py-2">50</td>
                <td className="border px-4 py-2">100</td>
                <td className="border px-4 py-2">10</td>
                <td className="border px-4 py-2">1</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

     
      {/* Popup */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Add New Item</h2>
            <input
              type="text"
              placeholder="Search for an item..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4"
            />
            <div className="flex justify-end space-x-4">
              <button
                className="bg-gray-500 text-white px-5 py-2 rounded-lg hover:bg-gray-400"
                onClick={() => setIsPopupOpen(false)}
              >
                Cancel
              </button>
              <button className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-500">
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentDetailPage;
