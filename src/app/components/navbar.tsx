import React from 'react';
import { FaHome, FaBoxOpen, FaClipboard, FaCartPlus, FaTruck, FaBuilding, FaCog, FaSignOutAlt } from 'react-icons/fa';
import Link from 'next/link';
function Navbar() {
  return (
    <div className="fixed top-0 left-0 h-screen w-[20%] bg-blue-50 shadow-lg p-4 flex flex-col justify-between">
      {/* Header Section */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-blue-700">Super Admin</h2>
        <h3 className="text-2xl font-bold text-gray-800">Hospital Inventory</h3>
      </div>

      {/* Navigation Links */}
      <nav className="space-y-6">
        <Link href="/dashboard" className="flex items-center space-x-4 text-gray-700 hover:text-blue-600">
          <FaHome size={20} />
          <span className="text-lg font-medium">Dashboard</span>
        </Link>
        <Link href="/inventory" className="flex items-center space-x-4 text-gray-700 hover:text-blue-600">
          <FaBoxOpen size={20} />
          <span className="text-lg font-medium">Inventory</span>
        </Link>
        <Link href="/reports" className="flex items-center space-x-4 text-gray-700 hover:text-blue-600">
          <FaClipboard size={20} />
          <span className="text-lg font-medium">Reports</span>
        </Link>
        <Link href="/purchase" className="flex items-center space-x-4 text-gray-700 hover:text-blue-600">
          <FaCartPlus size={20} />
          <span className="text-lg font-medium">Purchase Requests</span>
        </Link>
        <Link href="/suppliers" className="flex items-center space-x-4 text-gray-700 hover:text-blue-600">
          <FaTruck size={20} />
          <span className="text-lg font-medium">Suppliers</span>
        </Link>
        <Link href="/orders" className="flex items-center space-x-4 text-gray-700 hover:text-blue-600">
          <FaClipboard size={20} />
          <span className="text-lg font-medium">Orders</span>
        </Link>
        <Link href="/department" className="flex items-center space-x-4 text-gray-700 hover:text-blue-600">
          <FaBuilding size={20} />
          <span className="text-lg font-medium">Department</span>
        </Link>
      </nav>

      {/* Footer Section */}
      <div className="space-y-6">
        <Link href="/settings" className="flex items-center space-x-4 text-gray-700 hover:text-blue-600">
          <FaCog size={20} />
          <span className="text-lg font-medium">Settings</span>
        </Link>
        <Link href="/login" className="flex items-center space-x-4 text-gray-700 hover:text-red-600">
          <FaSignOutAlt size={20} />
          <span className="text-lg font-medium text-red-600">Log Out</span>
        </Link>
      </div>
    </div>
  );
}

export default Navbar;
