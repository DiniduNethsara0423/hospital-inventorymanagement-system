'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DepartmentCard from '@/app/components/departmentCard';
import { getAllDepartments } from '@/app/apis/get-all-department/api'; // API to fetch departments
import { postDepartment } from '@/app/apis/add-department/api'; // API to add department

interface Department {
  id: number;
  name: string;
  head?: string;
}

function Page() {
  const router = useRouter();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State for pagination
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5); // Fixed page size

  useEffect(() => {
    fetchDepartments();
  }, [page]);

  // Function to fetch departments
  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const data = await getAllDepartments(page, pageSize);
      console.log("API Response:", data);
      
      if (Array.isArray(data)) {
        setDepartments(data);
      } else {
        console.error("API did not return an array:", data);
        setDepartments([]); // Default to empty array
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
      setDepartments([]);
    } finally {
      setLoading(false);
    }
  };
  
  
  // Function to handle adding a department
  const handleAddDepartment = async (data: { name: string }) => {
    setLoading(true);
    try {
      const newDepartment = await postDepartment(data);
      setDepartments((prev) => [...prev, newDepartment]);
      setOpenPopup(false);
    } catch (error) {
      console.error('Failed to add department:', error);
      alert('Error adding department. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen p-6">
      {/* Header and Add New Button */}
      <div className="flex justify-center w-full space-x-2 mb-6">
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

      {/* Department Cards */}
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : (
        <div className="flex flex-wrap gap-4">
  {Array.isArray(departments) && departments.length > 0 ? (
    departments.map((department) => (
      <DepartmentCard
        key={department.id}
        department={department}
        onClick={() => router.push(`/department-view?id=${department.id}`)}
      />
    ))
  ) : (
    <p>No departments available.</p>
  )}
</div>

      )}

      {/* Pagination Controls */}
      <div className="flex justify-center mt-6 space-x-4">
        <button
          className={`px-4 py-2 bg-blue-600 text-white rounded ${
            page === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
          }`}
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
        >
          Previous
        </button>
        <span className="self-center">Page {page}</span>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => setPage(page + 1)}
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
                const departmentName = formData.get('name') as string;
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
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={loading}
                >
                  {loading ? 'Adding...' : 'Add Department'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Page;
