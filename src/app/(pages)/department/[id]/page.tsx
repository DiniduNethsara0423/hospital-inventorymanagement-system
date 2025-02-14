"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { updateDepartment, deleteDepartment, getDepartmentById, removeItemFromDepartment, } from "@/app/apis/department/api";
import { Trash2, Edit } from "lucide-react";
import React from "react";

const DepartmentDetailPage = () => {

  const params = useParams(); // Properly unwrap params
  const departmentId = Number(params?.id); // Ensure it's a number

  const [name, setName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [removingQty, setRemovingQty] = useState(0);
  const [reason, setReason] = useState("");
  const [modalMessage, setModalMessage] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  // Redirect to login if token is missing
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  const fetchDepartmentDetails = async () => {
    if (!departmentId) return; // Ensure departmentId exists
    setLoading(true);
    try {
      const response = await getDepartmentById(departmentId);
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
    if (!departmentId) return; // Ensure departmentId exists
    setLoading(true);
    const baseUrl: any = process.env.NEXT_PUBLIC_BASE_URL
    try {
      const res = await fetch(`${baseUrl}/items/items-department/get-details/${departmentId}`);
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

  // Fetch data when departmentId is available
  useEffect(() => {
    if (departmentId) {
      fetchDepartmentDetails();
      fetchItemsByDepartment();
    }
  }, [departmentId]);

  const handleUpdate = async () => {
    if (!name.trim()) {
      setModalMessage("Department name is required.");
      setShowModal(true);
      return;
    }
    try {
      await updateDepartment({ id: departmentId, name });
      setModalMessage("Department updated successfully.");
      setShowModal(true);
      setIsEditing(false);
    } catch (error) {
      setModalMessage("Failed to update department.");
      setShowModal(true);
    }
  };


  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this department?")) {
      try {
        await deleteDepartment(departmentId);
        setModalMessage("Department deleted successfully.");
        setShowModal(true);
        setTimeout(() => {
          router.back();
        }, 2000); // Delay for better UX before navigating back
      } catch (error) {
        setModalMessage("Failed to delete department.");
        setShowModal(true);
      }
    }
  };


  const handleDeleteItem = async () => {
    if (!selectedItem) return;
    if (removingQty > selectedItem.QTY) {
      alert("Removing quantity cannot exceed available quantity.");
      return;
    }
    try {
      const payload = { qty: removingQty, reason };
      await removeItemFromDepartment(selectedItem.ITEM_DEPARTMENT_BARCODE, payload);
      alert("Item removed successfully.");
      setIsModalOpen(false);
      fetchItemsByDepartment();
    } catch (error) {
      alert("Failed to remove item.");
    }
  };


  return (
    <div className="p-8 bg-gray-50 flex flex-col ">
      {/* Top Buttons */}
      <div className="flex justify-end space-x-4 mb-8">
        <button
          className="text-blue-600 hover:text-blue-500"
          onClick={() => setIsEditing(true)}
        >
          <Edit size={24} />
        </button>
        <button
          className="text-red-500 hover:text-red-600"
          onClick={handleDelete}
        >
          <Trash2 size={24} />
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

  {/* Show Table for md, lg, and xl screens */}
  <div className="hidden md:block">
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
        {items.length === 0 ? (
          <tr>
            <td colSpan={4} className="text-center py-4 text-gray-500 italic">
              No data to show
            </td>
          </tr>
        ) : (
          items.map((item, index) => (
            <tr key={index} className="border-t hover:bg-gray-100">
              <td className="border px-4 py-2">{item.ITEM_DEPARTMENT_BARCODE}</td>
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
          ))
        )}
      </tbody>
    </table>
  </div>

  {/* Show Cards for sm and below */}
  <div className="md:hidden flex flex-col gap-4">
    {items.length === 0 ? (
      <p className="text-center py-4 text-gray-500 italic">No data to show</p>
    ) : (
      items.map((item, index) => (
        <div key={index} className="border rounded-lg p-4 shadow-sm bg-gray-50">
          <div className="flex justify-between">
            <span className="text-gray-600 font-medium">Barcode:</span>
            <span className="font-semibold">{item.ITEM_DEPARTMENT_BARCODE}</span>
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-gray-600 font-medium">Name:</span>
            <span className="font-semibold">{item.ITEM_NAME}</span>
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-gray-600 font-medium">Quantity:</span>
            <span className="font-semibold">{item.QTY}</span>
          </div>
          <div className="flex justify-end mt-3">
            <button
              className="text-red-500 hover:text-red-700"
              onClick={() => {
                setSelectedItem(item);
                setIsModalOpen(true);
              }}
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>
      ))
    )}
  </div>
</div>


      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 max-sm:px-3">
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
                onChange={(e) => setRemovingQty(parseInt(e.target.value))}
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

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md shadow-lg text-center">
            <p className="mb-4 text-gray-700">{modalMessage}</p>
            <button onClick={() => setShowModal(false)} className="hover:bg-gray-200 text-gray-800 px-4 py-2 rounded">
              OK
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default DepartmentDetailPage;
