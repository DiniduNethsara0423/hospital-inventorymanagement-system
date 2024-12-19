"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DepartmentCard from "@/app/components/departmentCard";
import { postDepartment, getDepartments, updateDepartment, deleteDepartment } from "@/app/apis/department/api";

interface Department {
  id: number;
  name: string;
  head?: string; // Optional field for department head
}

function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [openPopup, setOpenPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalItems, setTotalItems] = useState(0);

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const response = await getDepartments(currentPage, pageSize);
      if (response) {
        console.log(response);
        setDepartments(response); // Assuming the API returns `data` for the current page
        setTotalItems(response); // Assuming the API returns `totalCount` for all items
      } else {
        console.error("Invalid API response:", response);
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle Page Change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  

  useEffect(() => {
    fetchDepartments();
  }, [currentPage, pageSize]);

  const totalPages = Math.ceil(totalItems / pageSize);

  const handleAddOrUpdateDepartment = async (data: { id?: number; name: string }) => {
    setLoading(true);
    try {
      if (data.id) {
        await updateDepartment(data); // Update if ID exists
      } else {
        await postDepartment(data); // Add new department
      }
      setOpenPopup(false);
      setEditingDepartment(null);
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
  

  // const handlePageChange = (page: number) => {
  //   if (page >= 1 && page <= totalPages) setCurrentPage(page);
  // };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to the first page
  };

  return (
    <div className="w-full h-screen">
      {/* Page Header */}
      <div className="flex justify-center w-full space-x-2 mt-[3%]">
        <div className="text-2xl w-[80%] text-center font-bold text-blue-800">Departments</div>
        <button
          className="bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
          onClick={() => {
            setEditingDepartment(null);
            setOpenPopup(true);
          }}
        >
          Add New
        </button>
      </div>

      {/* Page Size Selector */}
      <div className="flex justify-end p-4 space-x-2">
        <label className="font-medium">Page Size:</label>
        <select
          className="border border-gray-300 rounded-md px-2 py-1"
          value={pageSize}
          onChange={(e) => handlePageSizeChange(Number(e.target.value))}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
        </select>
      </div>

      {/* Department Cards */}
      <div className="flex flex-wrap ">
        {departments?.map((department) => (
          <DepartmentCard
            key={department.id}
            department={department}
            onEdit={() => {
              setEditingDepartment(department);
              setOpenPopup(true);
            }}
            onDelete={() => handleDeleteDepartment(department.id)} // Pass the delete handler
            onClick={() => setSelectedDepartment(department)}
          />
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center space-x-4 mt-4">
  <button
    onClick={() => handlePageChange(currentPage - 1)}
    className={`px-3 py-2 bg-gray-300 rounded-lg ${
      currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
    }`}
    disabled={currentPage === 1}
  >
    Previous
  </button>
  <span className="font-medium">
    Page {currentPage}
  </span>
  <button
    onClick={() => handlePageChange(currentPage + 1)}
    className={`px-3 py-2 bg-gray-300 rounded-lg ${
      departments.length < pageSize ? "opacity-50 cursor-not-allowed" : ""
    }`}
    disabled={departments.length < pageSize}
  >
    Next
  </button>
</div>


      {/* Department Details Section */}
      {selectedDepartment && (
        <div className="mt-8 p-6 bg-gray-100 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Department Details</h2>
          <p><strong>ID:</strong> {selectedDepartment.id}</p>
          <p><strong>Name:</strong> {selectedDepartment.name}</p>
          <p><strong>Head:</strong> {selectedDepartment.head || "N/A"}</p>
        </div>
      )}

      {/* Add/Edit Department Popup */}
      {openPopup && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-1/3">
            <h2 className="text-lg font-bold mb-4">
              {editingDepartment ? "Edit Department" : "Add Department"}
            </h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                const departmentName = formData.get("name") as string;
                await handleAddOrUpdateDepartment(
                  editingDepartment
                    ? { id: editingDepartment.id, name: departmentName }
                    : { name: departmentName }
                );
              }}
            >
              <div className="mb-4">
                <label className="block font-medium mb-2">Department Name</label>
                <input
                  name="name"
                  className="border border-gray-300 rounded-md w-full px-3 py-2"
                  defaultValue={editingDepartment?.name || ""}
                  required
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg"
                  onClick={() => setOpenPopup(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`bg-blue-600 text-white px-4 py-2 rounded-lg ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default DepartmentsPage;
