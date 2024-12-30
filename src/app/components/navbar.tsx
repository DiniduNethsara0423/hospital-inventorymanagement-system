'use client'
import React, { useState } from 'react';
import {
  LucideHome,
  LucideBox,
  LucideClipboardList,
  LucideShoppingCart,
  LucideTruck,
  LucideBuilding,
  LucideSettings,
  LucideLogOut,
  LucideUsers,
  LucidePlus,
  LucideSearch,
} from 'lucide-react';
import Link from 'next/link';

const SidebarNavbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-screen pt-16 transition-transform bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <div className="flex flex-col justify-between h-full px-3 pb-4 overflow-y-auto">
          {/* Top Section */}
          <ul className="space-y-2 font-medium mt-6">
            <SidebarItem href="/dashboard" Icon={LucideHome} label="Dashboard" />
            <SidebarItem href="/inventory" Icon={LucideBox} label="Inventory" />
            <SidebarItem href="/reports" Icon={LucideClipboardList} label="Reports" />
            <SidebarItem href="/Purchase" Icon={LucideShoppingCart} label="Purchase Requests" />
            <SidebarItem href="/suppliers" Icon={LucideTruck} label="Suppliers" />
            <SidebarItem href="/orders" Icon={LucideClipboardList} label="Orders" />
            <SidebarItem href="/department" Icon={LucideBuilding} label="Department" />
            <SidebarItem href="/user-management" Icon={LucideUsers} label="User Management" />
            <SidebarItem href="/add-items" Icon={LucidePlus} label="Add Items to Department" />
          </ul>

          {/* Bottom Section */}
          <ul className="space-y-2 font-medium">
            <SidebarItem href="/settings" Icon={LucideSettings} label="Settings" />
            <SidebarItem href="/login" Icon={LucideLogOut} label="Log Out" />
          </ul>
        </div>
      </aside>

      {/* Navbar */}
      <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="px-4 py-3 lg:px-5 flex justify-between items-center">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 md:hidden"
          >
            <span className="sr-only">Toggle Sidebar</span>
            <LucideBox className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Hospital Inventory</h1>

          {/* Search Bar */}
          <div className="relative w-1/2 md:w-1/3">
            <input
              type="text"
              className="w-full px-4 py-2 text-gray-900 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
              placeholder="Search items..."
            />
            <LucideSearch className="absolute top-3 right-3 w-5 h-5 text-gray-500 dark:text-gray-400" />
          </div>

          {/* Profile Section */}
          <div className="relative">
            <img
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
              alt="User"
              className="w-8 h-8 rounded-full cursor-pointer"
            />
            {isProfileDropdownOpen && (
              <div className="absolute right-0 mt-2 bg-white rounded-md shadow-lg dark:bg-gray-700">
                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                  <li>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/login"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      Log Out
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

const SidebarItem = ({ href, Icon, label }) => (
  <li>
    <Link
      href={href}
      className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
    >
      <Icon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
      <span className="ml-3">{label}</span>
    </Link>
  </li>
);

export default SidebarNavbar;
