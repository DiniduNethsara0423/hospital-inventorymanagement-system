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
  LucideBook,
  CirclePlus
  
} from 'lucide-react';
import Link from 'next/link';
import SearchBar from './SearchBar';
import { useRouter } from 'next/navigation';

const SidebarNavbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    
    router.push('/login');
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-screen pt-16 transition-transform bg-white border-r border-gray-200 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <div className="flex flex-col justify-between h-full px-3 pb-4 overflow-y-auto">
          {/* Top Section */}
          <ul className="space-y-2 font-medium mt-6">
            <SidebarItem href="/dashboard" Icon={LucideHome} label="Dashboard" />
            <SidebarItem href="/inventory" Icon={LucideBox} label="Inventory" />
            <SidebarItem href="/reports" Icon={LucideClipboardList} label="Reports" />
            <SidebarItem href="/purchase" Icon={LucideShoppingCart} label="Quatations" />
            <SidebarItem href="/suppliers" Icon={LucideTruck} label="Suppliers" />
            <SidebarItem href="/orders" Icon={LucideClipboardList} label="Invoice" />
            <SidebarItem href="/department" Icon={LucideBuilding} label="Department" />
            <SidebarItem href="/user-management" Icon={LucideUsers} label="User Management" />
            <SidebarItem href="/add-to-department" Icon={CirclePlus} label="Add Items to Department" />
          </ul>

          {/* Bottom Section */}
          <ul className="space-y-2 font-medium">
            <SidebarItem href="/settings" Icon={LucideSettings} label="Categories" />
            <SidebarItem href="/logs" Icon={LucideBook} label="Logs" />
          </ul>
        </div>
      </aside>

      {/* Navbar */}
      <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200">
        <div className="px-4 py-3 lg:px-5 flex justify-between items-center">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 md:hidden"
          >
            <span className="sr-only">Toggle Sidebar</span>
            <LucideBox className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900 ">Hospital Inventory</h1>

          {/* Search Bar */}
          <SearchBar/>

          {/* Profile Section */}
          <div className="">
       
          <button
              onClick={handleLogout}
              className="block px-4 py-2 text-gray-700 hover:text-gray-800 hover:bg-gray-200 rounded-lg font-semibold"
            >
              Log Out
            </button>
         
          </div>
        </div>
      </nav>
    </div>
  );
};

const SidebarItem = ({ href, Icon, label }:any) => (
  <li>
    <Link
      href={href}
      className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100"
    >
      <Icon className="w-5 h-5 text-gray-500" />
      <span className="ml-3">{label}</span>
    </Link>
  </li>
);

export default SidebarNavbar;
