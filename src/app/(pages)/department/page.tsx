"use client"

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DepartmentCard from "@/app/components/departmentCard";
import { postDepartment, getDepartments, updateDepartment, deleteDepartment } from "@/app/apis/department/api";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";

interface Department {
  id: number;
  name: string;
}

function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalItems, setTotalItems] = useState(0);

  const router = useRouter();

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const response = await getDepartments(currentPage, pageSize);
      if (response) {
        setDepartments(response.data || []); // Assuming API returns data array
        setTotalItems(response.total || 0); // Assuming API returns totalCount
      } else {
        console.error("Invalid API response:", response);
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  useEffect(() => {
    fetchDepartments();
  }, [currentPage, pageSize]);

  const totalPages = Math.ceil(totalItems / pageSize);

  const handleAddOrUpdateDepartment = async (name: string) => {
    setLoading(true);
    try {
      if (editingDepartment?.id) {
        // Edit existing department
        await updateDepartment({ id: editingDepartment.id, name });
      } else {
        // Add new department
        await postDepartment({ name });
      }
      setOpenPopup(false);
      setEditingDepartment(null); // Reset editing state after saving
      fetchDepartments(); // Refresh the list
    } catch (error) {
      console.error("Failed to save department:", error);
      alert("Error saving department. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  const handleDeleteDepartment = async (id: number) => {
    if (confirm("Are you sure you want to delete this department?")) {
      setLoading(true);
      try {
        await deleteDepartment(id);
        fetchDepartments(); // Refresh the list after deletion
      } catch (error) {
        console.error("Failed to delete department:", error);
        alert("Error deleting department. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to the first page
  };

  return (
    <div className="w-full h-screen mt-12 px-3">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Departments</h1>
        <button
      className="bg-gray-700 flex items-center text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
      onClick={() => {
        setEditingDepartment(null);
        setOpenPopup(true);
      }}
    >
      <Plus className="mr-2" />
      Add New
    </button>
      </div>

      {/* Page Size Selector */}
      <div className="flex justify-end items-center mb-6 space-x-4">
    <label className="font-medium text-gray-700">Page Size:</label>
    <select
      className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:ring focus:ring-blue-300 focus:outline-none"
      value={pageSize}
      onChange={(e) => handlePageSizeChange(Number(e.target.value))}
    >
      <option value={5}>5</option>
      <option value={10}>10</option>
      <option value={15}>15</option>
    </select>
  </div>

      {/* Department Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
      {departments?.map((department) => (
          <DepartmentCard
            key={department.id}
            department={department}
            onEdit={() => {
              setEditingDepartment(department);
              setOpenPopup(true);
            }}
            onDelete={() => handleDeleteDepartment(department.id)}
            onClick={() => router.push(`/department/${department.id}`)} // Navigate to department page
          />
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center mt-8 space-x-6">
    <button
      className={`flex items-center px-4 py-2 rounded-lg font-medium ${
        currentPage === 1
          ? "bg-gray-300 text-gray-600 cursor-not-allowed"
          : "bg-gray-800 text-white hover:bg-gray-900"
      }`}
      onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
      disabled={currentPage === 1}
    >
      <ChevronLeft className="w-5 h-5" />
    </button>
    <div className="text-gray-700 font-medium">
      Page {currentPage} of {totalPages}
    </div>
    <button
      className={`flex items-center px-4 py-2 rounded-lg font-medium ${
        currentPage === totalPages
          ? "bg-gray-300 text-gray-600 cursor-not-allowed"
          : "bg-gray-800 text-white hover:bg-gray-900"
      }`}
      onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
      disabled={currentPage === totalPages}
    >
      <ChevronRight className="w-5 h-5" />
    </button>
  </div>


      {/* Popup for Adding/Editing Departments */}
      {openPopup && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">
              {editingDepartment ? "Edit Department" : "Add Department"}
            </h2>
            <input
              type="text"
              placeholder="Department Name"
              value={editingDepartment?.name || ""}
              className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4"
              onChange={(e) => {
                const updatedName = e.target.value;
                if (editingDepartment) {
                  setEditingDepartment({ ...editingDepartment, name: updatedName });
                } else {
                  setEditingDepartment({ id: 0, name: updatedName }); // Temporary state for new department
                }
              }}
            />
            <div className="flex justify-end space-x-4">
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded-md"
                onClick={() => {
                  setOpenPopup(false);
                  setEditingDepartment(null); // Reset state on cancel
                }}
              >
                Cancel
              </button>
              <button
                className="bg-gray-800 text-white px-4 py-2 rounded-md"
                onClick={() => {
                  const departmentName = editingDepartment?.name || "";
                  if (!departmentName.trim()) {
                    alert("Department name is required.");
                    return;
                  }
                  handleAddOrUpdateDepartment(departmentName);
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default DepartmentsPage;
