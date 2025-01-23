"use client";

import React, { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import RegistrationSteps from "@/app/components/RegisterUserPopUp";
import { fetchAllUsers, assignPermission } from "@/app/apis/auth/api"; // Importing APIs

const UserManagement: React.FC = () => {
  const [users, setUsers]: any = useState([]);
  const [search, setSearch] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(true);

  // View toggle state
  const [activeTab, setActiveTab] = useState<"users" | "permissions">("users");

  // Permissions form states
  const [roleId, setRoleId] = useState<number | null>(null);
  const [permissionId, setPermissionId] = useState<number | null>(null);
  const [validUntil, setValidUntil] = useState<string | null>(null);

  const roles = [
    { id: 1, name: "Superadmin" },
    { id: 2, name: "Admin" },
    { id: 3, name: "User" },
  ];

  const permissions = [
    { id: 1, name: "Read" },
    { id: 2, name: "Create" },
    { id: 3, name: "Update" },
    { id: 4, name: "Delete" },
  ];

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

  const handleAssignPermission = async () => {
    try {
      const payload = {
        roleId,
        permissionId,
        validUntil: null, // Set to null for now
      };

      const response = await assignPermission(payload);

      if (response.status === 200 || response.status === 201) {
        alert("Permission assigned successfully!");
        // Clear form
        setRoleId(null);
        setPermissionId(null);
        setValidUntil(null);
      } else {
        alert("Failed to assign permission. Please try again.");
      }
    } catch (error) {
      console.error("Error assigning permission:", error);
      alert("Error assigning permission. Please try again.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-8 w-full min-h-screen">
      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        <button
          className={`px-6 py-3 rounded-lg ${activeTab === "users"
            ? "bg-gray-700 text-white"
            : "bg-gray-200 text-gray-700"
            }`}
          onClick={() => setActiveTab("users")}
        >
          Users
        </button>
        <button
          className={`px-6 py-3 rounded-lg ${activeTab === "permissions"
            ? "bg-gray-700 text-white"
            : "bg-gray-200 text-gray-700"
            }`}
          onClick={() => setActiveTab("permissions")}
        >
          Permissions
        </button>
      </div>

      {/* Content */}
      {activeTab === "users" && (
        <>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-bold text-gray-800">User Management</h1>
          </div>
          <div className="flex flex-wrap justify-between items-center mb-6">

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

          <div className="overflow-x-auto bg-white rounded-lg mb-8">
            {loading ? (
              <div className="text-center py-6 text-gray-700">
                Loading users...
              </div>
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
                        <td className="border px-4 py-3 text-gray-700">
                          {user.id}
                        </td>
                        <td className="border px-4 py-3 text-gray-700">
                          {user.username}
                        </td>
                        <td className="border px-4 py-3 text-gray-700">
                          {user.email}
                        </td>
                        <td className="border px-4 py-3 text-gray-700">
                          {user.role_id}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className="text-center py-6 text-gray-700"
                      >
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}

      {activeTab === "permissions" && (
        <>
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-bold text-gray-800">Permission Management</h1>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Assign Permissions
            </h2>

            <div className="flex flex-col md:flex-row md:space-x-6">
              <div className="mb-4 md:mb-0">
                <label className="block mb-2 font-semibold text-gray-600">
                  Role
                </label>
                <select
                  value={roleId ?? ""}
                  onChange={(e) => setRoleId(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                >
                  <option value="">Select Role</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4 md:mb-0">
                <label className="block mb-2 font-semibold text-gray-600">
                  Permission
                </label>
                <select
                  value={permissionId ?? ""}
                  onChange={(e) => setPermissionId(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                >
                  <option value="">Select Permission</option>
                  {permissions.map((perm) => (
                    <option key={perm.id} value={perm.id}>
                      {perm.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4 md:mb-0">
                <label className="block mb-2 font-semibold text-gray-600">
                  Valid Until
                </label>
                <input
                  type="datetime-local"
                  value={validUntil || ""}
                  onChange={(e) => setValidUntil(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                />
              </div>

              <div  className="mb-4 md:mb-0">

              </div>
            </div>

            <button
              onClick={handleAssignPermission}
              className="mt-4 flex items-center space-x-2 bg-gray-700 text-white px-6 py-3 rounded-full shadow-lg hover:bg-gray-800 transition"
                          >
              Assign Permission
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default UserManagement;
