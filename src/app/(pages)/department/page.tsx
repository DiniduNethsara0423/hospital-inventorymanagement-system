"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DepartmentCard from "@/app/components/departmentCard";
import { postDepartment } from "@/app/apis/add-department/api";
import { getDepartments } from "@/app/apis/get-all-department/api";

// Define Department Interface
interface Department {
  id: number;
  name: string;
}

function DepartmentsPage() {
  const router = useRouter();

  const [departments, setDepartments] = useState<Department[]>([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalItems, setTotalItems] = useState(0);

  // Fetch Departments
  const fetchDepartments = async () => {
    try {
      const response = await getDepartments(currentPage, pageSize);
      if (response && response.data) {
        setDepartments(response.data); // Set departments data
        setTotalItems(response.total); // Set total items
      } else {
        console.error("Invalid API response:", response);
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, [currentPage, pageSize]);

  const totalPages = Math.ceil(totalItems / pageSize);

  // Add New Department
  const handleAddDepartment = async (data: { name: string }) => {
    setLoading(true);
    try {
      const newDepartment = await postDepartment(data);
      setDepartments((prev) => [...prev, newDepartment]);
      setOpenPopup(false);
      fetchDepartments(); // Refresh the list
    } catch (error) {
      console.error("Failed to add department:", error);
      alert("Error adding department. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to the first page
  };

  return (
    <div className="w-full h-screen">
      {/* Page Header */}
      <div className="flex justify-center w-full space-x-2 mt-[3%]">
        <div className="text-2xl w-[80%] text-center font-bold text-blue-800">
          Departments
        </div>
        <button
          className="bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
          onClick={() => setOpenPopup(true)}
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
      <div className="flex flex-wrap">
        {departments?.map((department) => (
          <DepartmentCard
            key={department.id}
            department={department}
            onClick={() => router.push(`/department-view?id=${department.id}`)}
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
        <span>
          Page {currentPage} of {totalPages || 1}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          className={`px-3 py-2 bg-gray-300 rounded-lg ${
            currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {/* Add Department Popup */}
      {openPopup && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-1/3">
            <h2 className="text-lg font-bold mb-4">Add Department</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                const departmentName = formData.get("name") as string;
                await handleAddDepartment({ name: departmentName });
              }}
            >
              <div className="mb-4">
                <label className="block font-medium mb-2">Department Name</label>
                <input
                  name="name"
                  className="border border-gray-300 rounded-md w-full px-3 py-2"
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
                  {loading ? "Adding..." : "Add Department"}
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
