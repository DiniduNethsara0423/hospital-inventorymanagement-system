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

  const router = useRouter(); // Router for navigation

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const response = await getDepartments(currentPage, pageSize);
      if (response) {
        setDepartments(response); // Assuming API returns data for the current page
        setTotalItems(response.totalCount || 0); // Assuming API returns totalCount
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

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to the first page
  };

  return (
    <div className="w-full h-screen p-6">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-800">Departments</h1>
        <button
          className="bg-blue-700 text-white px-4 py-2 rounded-lg"
          onClick={() => {
            setEditingDepartment(null);
            setOpenPopup(true);
          }}
        >
          Add New
        </button>
      </div>

      {/* Page Size Selector */}
      <div className="flex justify-end items-center mb-4 space-x-4">
        <label className="font-medium">Page Size:</label>
        <select
          className="border border-gray-300 rounded-md px-3 py-2"
          value={pageSize}
          onChange={(e) => handlePageSizeChange(Number(e.target.value))}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
        </select>
      </div>

      {/* Department Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {departments.map((department) => (
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
      <div className="flex justify-center items-center space-x-4 mt-6">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          className={`px-3 py-2 bg-gray-300 rounded-lg ${
            currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="font-medium">Page {currentPage}</span>
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
    </div>
  );
}

export default DepartmentsPage;
