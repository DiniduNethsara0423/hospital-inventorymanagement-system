"use client";

import React, { useEffect, useState } from "react";
import { PlusCircle, Edit, Trash2, Search, Plus } from "lucide-react";
import RegistrationSteps from "@/app/components/RegisterUserPopUp";
import { fetchAllUsers } from "@/app/apis/auth/api";

const UserManagement: React.FC = () => {
  const [users, setUsers]:any = useState([]);
  const [search, setSearch] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const filteredUsers = users.filter(
    (user: any) =>
      user.username.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddUser = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };
  
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await fetchAllUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error loading users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-8 w-full min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-gray-800">User Management</h1>
      </div>

      <div className="flex flex-wrap justify-between items-center mb-6">

        {/* Search Bar */}
        <div className="flex items-center w-full md:w-2/3 bg-white border border-gray-300 rounded-full shadow-sm px-4 py-2">
          <Search className="text-gray-500 w-5 h-5 mr-2" />
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search Users"
            className="w-full focus:outline-none"
          />
        </div>
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <button
            onClick={handleAddUser}
            className="flex items-center space-x-2 bg-gray-700 text-white px-6 py-3 rounded-full shadow-lg hover:bg-gray-800 transition"
          >
            <Plus className="w-5 h-5" />
            <span>Add Users</span>
          </button>
        </div>
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-md p-6 rounded-md shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={handleClosePopup}
            >
              ✖
            </button>
            <RegistrationSteps />
          </div>
        </div>
      )}



<div className="overflow-x-auto bg-white rounded-lg">
        {loading ? (
          <div className="text-center py-6 text-gray-700">Loading users...</div>
        ) : (
          <table className="table-auto w-full border-collapse">
            <thead className="bg-blue-200 text-left">
              <tr>
                <th className="px-4 py-3 text-gray-800">ID</th>
                <th className="px-4 py-3 text-gray-800">Username</th>
                <th className="px-4 py-3 text-gray-800">Email</th>
                <th className="px-4 py-3 text-gray-800">Role ID</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user: any) => (
                  <tr key={user.id} className="hover:bg-blue-50">
                    <td className="border px-4 py-3 text-gray-700">{user.id}</td>
                    <td className="border px-4 py-3 text-gray-700">{user.username}</td>
                    <td className="border px-4 py-3 text-gray-700">{user.email}</td>
                    <td className="border px-4 py-3 text-gray-700">{user.role_id}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-6 text-gray-700">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
      
    </div>
  );
};

export default UserManagement;



