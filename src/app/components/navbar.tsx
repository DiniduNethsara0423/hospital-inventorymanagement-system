'use client'
import React, { useEffect, useState } from 'react';
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
  CirclePlus,
  UserRound,
  Layers2,
  Album,
  StretchVertical
  
} from 'lucide-react';
import Link from 'next/link';
import SearchBar from './SearchBar';
import { useRouter } from 'next/navigation';

const SidebarNavbar = () => {
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [roleId, setRoleId] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      const decoded = parseJwt(token);
      if (decoded && decoded.roleId) {
        setRoleId(decoded.roleId); // Set role ID from decoded token
      } else {
        console.error('Failed to extract roleId from token');
      }
    }
  }, []);

  // Define which items to show based on roleId
  const navItems = [
    { href: '/dashboard', Icon: LucideHome, label: 'Dashboard' },
    { href: '/inventory', Icon: LucideBox, label: 'Inventory' },
    ...(roleId !== 3 ? [{ href: '/reports', Icon: LucideClipboardList, label: 'Reports' }] : []),
    { href: '/purchase', Icon: LucideShoppingCart, label: 'Quotations' },
    { href: '/purchase-orders', Icon: StretchVertical, label: 'Orders' },
    { href: '/suppliers', Icon: LucideTruck, label: 'Suppliers' },
    { href: '/orders', Icon: Album, label: 'Invoice' },
    { href: '/department', Icon: LucideBuilding, label: 'Department' },
    ...(roleId === 1 ? [{ href: '/user-management', Icon: LucideUsers, label: 'User Management' }] : []),
    { href: '/add-to-department', Icon: CirclePlus, label: 'Add Items to Department' },
    { href: '/settings', Icon: Layers2, label: 'Categories' },
  ];

  const bottomNavItems = [
    // { href: '/settings', Icon: LucideSettings, label: 'Categories' },
    ...(roleId !== 3 ? [{ href: '/logs', Icon: LucideBook, label: 'Logs' }] : []),
  ];

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
            {navItems.map(({ href, Icon, label }) => (
              <SidebarItem key={href} href={href} Icon={Icon} label={label} />
            ))}
          </ul>

          {/* Bottom Section */}
          <ul className="space-y-2 font-medium">
            {bottomNavItems.map(({ href, Icon, label }) => (
              <SidebarItem key={href} href={href} Icon={Icon} label={label} />
            ))}
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
          <h1 className="text-xl font-semibold text-gray-900 ">Inventory System</h1>

          {/* Search Bar */}
          <SearchBar />

          {/* Profile Section */}
          <button
            onClick={() => {
              localStorage.removeItem('jwtToken');
              router.push('/login');
            }}
            className="block px-4 py-2 text-gray-700 hover:text-gray-800 hover:bg-gray-200 rounded-lg font-semibold"
          >
            Log Out
          </button>
        </div>
      </nav>
    </div>
  );
};

const SidebarItem = ({ href, Icon, label }: any) => (
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

function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1]; // Get the payload part
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Decode Base64
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((char) => '%' + ('00' + char.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Invalid token:', error);
    return null;
  }
}