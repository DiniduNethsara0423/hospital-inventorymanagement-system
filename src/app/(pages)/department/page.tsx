'use client';
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import DepartmentCard from "@/app/components/departmentCard";

interface Department {
  id: number;
  name: string;
  head: string;
}

function Page() {
  const router = useRouter();
  const [departments, setDepartments] = useState<Department[]>([
    { id: 1, name: "HR", head: "John Doe" },
    { id: 2, name: "Finance", head: "Jane Smith" },
    { id: 3, name: "Engineering", head: "Alice Johnson" },
  ]);
  const [openPopup, setOpenPopup] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);

  const handleSave = (data: Department) => {
    if (editingDepartment) {
      // Update the existing department
      setDepartments((prevDepartments) =>
        prevDepartments.map((dept) =>
          dept.id === editingDepartment.id ? { ...dept, ...data } : dept
        )
      );
    } else {
      // Add a new department
      setDepartments((prev) => [...prev, { ...data, id: prev.length + 1 }]);
    }

    setOpenPopup(false);
    setEditingDepartment(null);
  };

  const handleDepartmentClick = (departmentId: number) => {
    router.push(`/department-view?id=${departmentId}`);
  };

  return (
    <div className="w-full h-screen">
      <div className="flex justify-center w-full space-x-2 mt-[3%]">
        <div className="text-2xl w-[80%] text-center font-bold text-blue-800">
          Department
        </div>
        <button
          className="bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
          onClick={() => {
            setEditingDepartment(null); // Clear editing state
            setOpenPopup(true); // Open the popup for adding
          }}
        >
          Add New
        </button>
      </div>

      <div className="flex w-full justify-between p-4 rounded-xl">
        {departments.map((department) => (
          <DepartmentCard
            key={department.id}
            department={department}
            onClick={() => handleDepartmentClick(department.id)} // Handle click to navigate
            onEdit={() => {
              setEditingDepartment(department); // Set the department for editing
              setOpenPopup(true); // Open the popup
            }}
          />
        ))}
      </div>

      {/* Popup for Add/Edit */}
      {openPopup && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-1/3">
            <h2 className="text-lg font-bold mb-4">
              {editingDepartment ? "Edit Department" : "Add Department"}
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                const updatedData: Department = {
                  id: editingDepartment ? editingDepartment.id : 0,
                  name: formData.get("name") as string,
                  head: formData.get("head") as string,
                };
                handleSave(updatedData);
              }}
            >
              <div className="mb-4">
                <label className="block font-medium mb-2">Department Name</label>
                <input
                  name="name"
                  defaultValue={editingDepartment?.name || ""}
                  className="border border-gray-300 rounded-md w-full px-3 py-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium mb-2">Head of Department</label>
                <input
                  name="head"
                  defaultValue={editingDepartment?.head || ""}
                  className="border border-gray-300 rounded-md w-full px-3 py-2"
                  required
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg"
                  onClick={() => {
                    setOpenPopup(false);
                    setEditingDepartment(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                  {editingDepartment ? "Save Changes" : "Add Department"}
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
