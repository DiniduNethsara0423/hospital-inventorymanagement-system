"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Edit, Trash2, Eye, PlusCircle } from "lucide-react";

const UserManagement: React.FC = () => {
  const router = useRouter();
  const [users, setUsers] = useState([
    { id: 1, name: "John Doe", email: "john@example.com", role: "Admin", status: "Active" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User", status: "Inactive" },
    // Example data; replace with API data
  ]);
  const [search, setSearch] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddUser = () => {
    router.push("/create-user"); // Navigate to add user page
  };

  const handleEdit = (id: number) => {
    router.push(`/edit-user/${id}`); // Navigate to edit user page
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this user?")) {
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
    }
  };

  return (
    <div className="p-8 w-full min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-gray-800">User Management</h1>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-base shadow-lg font-semibold flex items-center"
          onClick={handleAddUser}
        >
          <PlusCircle size={20} className="mr-2" /> Add New User
        </button>
      </div>

      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={handleSearchChange}
          className="border border-gray-300 rounded-md px-4 py-2 w-1/2 text-gray-800 shadow-sm focus:outline-none focus:ring focus:ring-blue-300 hover:shadow-lg"
        />
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="table-auto w-full border-collapse">
          <thead className="bg-blue-200 text-left">
            <tr>
              <th className="px-4 py-3 text-gray-800">Name</th>
              <th className="px-4 py-3 text-gray-800">Email</th>
              <th className="px-4 py-3 text-gray-800">Role</th>
              <th className="px-4 py-3 text-gray-800">Status</th>
              <th className="px-4 py-3 text-gray-800 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-blue-50">
                  <td className="border px-4 py-3 text-gray-700">{user.name}</td>
                  <td className="border px-4 py-3 text-gray-700">{user.email}</td>
                  <td className="border px-4 py-3 text-gray-700">{user.role}</td>
                  <td className="border px-4 py-3 text-gray-700">{user.status}</td>
                  <td className="border px-4 py-3 text-center flex justify-center space-x-4">
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => handleEdit(user.id)}
                    >
                      <Edit size={20} />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleDelete(user.id)}
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-700">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Placeholder */}
      <div className="flex justify-between items-center mt-8">
        <button
          className="px-6 py-2 bg-gray-300 rounded-md shadow-md text-gray-600 font-medium cursor-not-allowed"
          disabled
        >
          Previous
        </button>
        <div className="text-gray-800 font-medium">Page 1 of 1</div>
        <button
          className="px-6 py-2 bg-gray-300 rounded-md shadow-md text-gray-600 font-medium cursor-not-allowed"
          disabled
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UserManagement;
