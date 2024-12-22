"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateDepartment, deleteDepartment } from "@/app/apis/department/api";

const DepartmentDetailPage = ({ params }: { params: { id: string } }) => {
  const [name, setName] = useState("Sample Department"); // Set a default value for demonstration
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
    <div className="p-8 bg-gray-100 min-h-screen relative">
      {/* Top-right Buttons */}
      <div className="absolute top-4 right-4 flex space-x-2">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500"
          onClick={() => setIsEditing(true)}
        >
          Edit
        </button>
        <button
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-500"
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>

      {/* Middle Content */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-6">Department Details</h1>

        {/* Conditional rendering for editing */}
        {isEditing ? (
          <div className="flex flex-col items-center">
            <input
              type="text"
              className="w-full max-w-xs border border-gray-300 rounded-md px-4 py-2 mb-4"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter Department Name"
            />
            <div className="flex space-x-4">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-md"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-md"
                onClick={handleUpdate}
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-lg font-medium">Department ID: {params.id}</p>
            <p className="text-lg font-medium mt-2">Department Name: {name}</p>
          </div>
        )}

        {/* Add New Items Button */}
        <button
          className="mt-6 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-500"
          onClick={() => setIsPopupOpen(true)}
        >
          Add New Item
        </button>

        {/* Table */}
        <table className="table-auto w-full mt-8 border-collapse">
          <thead className="bg-[#c0e3fa] text-left">
            <tr>
              <th className=" px-4 py-2 rounded-tl-lg">Barcode</th>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Available Qty</th>
              <th className="border px-4 py-2">Total Qty</th>
              <th className="border px-4 py-2">Lower Quantity</th>
              <th className="border px-4 py-2">Category ID</th>
             

            </tr>
          </thead>
          <tbody>
            <tr className="hover:bg-blue-50">
              <td className="border px-4 py-2">123456</td>
              <td className="border px-4 py-2">Sample Item</td>
              <td className="border px-4 py-2">50</td>
              <td className="border px-4 py-2">100</td>
              <td className="border px-4 py-2">10</td>
              <td className="border px-4 py-2">1</td>
              

            </tr>
            <tr className="hover:bg-blue-50">
              <td className="border px-4 py-2">123456</td>
              <td className="border px-4 py-2">Sample Item</td>
              <td className="border px-4 py-2">50</td>
              <td className="border px-4 py-2">100</td>
              <td className="border px-4 py-2">10</td>
              <td className="border px-4 py-2">1</td>

            </tr>
            <tr className="hover:bg-blue-50">
              <td className="border px-4 py-2">123456</td>
              <td className="border px-4 py-2">Sample Item</td>
              <td className="border px-4 py-2">50</td>
              <td className="border px-4 py-2">100</td>
              <td className="border px-4 py-2">10</td>
              <td className="border px-4 py-2">1</td>

            </tr>
            <tr className="hover:bg-blue-50">
              <td className="border px-4 py-2">123456</td>
              <td className="border px-4 py-2">Sample Item</td>
              <td className="border px-4 py-2">50</td>
              <td className="border px-4 py-2">100</td>
              <td className="border px-4 py-2">10</td>
              <td className="border px-4 py-2">1</td>

            </tr>
            <tr className="hover:bg-blue-50">
              <td className="border px-4 py-2">123456</td>
              <td className="border px-4 py-2">Sample Item</td>
              <td className="border px-4 py-2">50</td>
              <td className="border px-4 py-2">100</td>
              <td className="border px-4 py-2">10</td>
              <td className="border px-4 py-2">1</td>

            </tr>
            <tr className="hover:bg-blue-50">
              <td className="border px-4 py-2">123456</td>
              <td className="border px-4 py-2">Sample Item</td>
              <td className="border px-4 py-2">50</td>
              <td className="border px-4 py-2">100</td>
              <td className="border px-4 py-2">10</td>
              <td className="border px-4 py-2">1</td>

            </tr>
            <tr className="hover:bg-blue-50">
              <td className="border px-4 py-2">123456</td>
              <td className="border px-4 py-2">Sample Item</td>
              <td className="border px-4 py-2">50</td>
              <td className="border px-4 py-2">100</td>
              <td className="border px-4 py-2">10</td>
              <td className="border px-4 py-2">1</td>

            </tr>
          </tbody>
        </table>
      </div>

      {/* Go Back Button */}
      <button
        className="absolute bottom-4 left-4 bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700"
        onClick={() => router.back()}
      >
        Go Back
      </button>

      {/* Popup */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Add New Item</h2>
            <input
              type="text"
              placeholder="Search for an item..."
              className="w-full border border-gray-300 rounded-md px-4 py-2 mb-4"
            />
            <div className="flex justify-end space-x-2">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-md"
                onClick={() => setIsPopupOpen(false)}
              >
                Cancel
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md">Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentDetailPage;
