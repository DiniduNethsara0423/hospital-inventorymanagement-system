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
  StretchVertical,
  Menu,
  X
} from 'lucide-react';
import Link from 'next/link';
import SearchBar from './SearchBar';
import { useRouter } from 'next/navigation';

const SidebarNavbar = () => {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [roleId, setRoleId] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      const decoded = parseJwt(token);
      if (decoded && decoded.roleId) {
        setRoleId(decoded.roleId);
      } else {
        console.error('Failed to extract roleId from token');
      }
    }
  }, []);

  const navItems = [
    { href: '/dashboard', Icon: LucideHome, label: 'Dashboard' },
    { href: '/inventory', Icon: LucideBox, label: 'Inventory' },
    ...(roleId !== 3 ? [{ href: '/reports', Icon: LucideClipboardList, label: 'Reports' }] : []),
    { href: '/purchase', Icon: LucideShoppingCart, label: 'Quotations' },
    { href: '/purchase-orders', Icon: StretchVertical, label: 'Orders' },
    { href: '/suppliers', Icon: LucideTruck, label: 'Suppliers' },
    { href: '/orders', Icon: Album, label: 'Invoice' },
    { href: '/department', Icon: LucideBuilding, label: 'Department' },
    { href: '/add-to-department', Icon: CirclePlus, label: 'Add Items to Department' },
    { href: '/settings', Icon: Layers2, label: 'Categories' },
  ];

  const bottomNavItems = [
    ...(roleId !== 3 ? [{ href: '/logs', Icon: LucideBook, label: 'Logs' }] : []),
  ];

  const middleNavItems = [
    ...(roleId === 1 ? [{ href: '/user-management', Icon: LucideUsers, label: 'User Management' }] : []),
  ];

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-screen py-4 bg-gray-900 transition-transform  ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:static`}
      >
        <div className="flex justify-between items-center px-4">
          <h1 className="lg:text-xl max-sm:text-xl font-semibold text-nowrap text-white">Inventory System</h1>
          <button
            className="text-white md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-col justify-between h-full px-3 pb-4 overflow-y-auto">
          {/* Top Section */}
          <ul className="space-y-2 font-medium mt-6 text-gray-100">
            {navItems.map(({ href, Icon, label }) => (
              <SidebarItem key={href} href={href} Icon={Icon} label={label} />
            ))}
          </ul>

          {/* Middle Section */}
          {middleNavItems.length > 0 && (
            <div>
              <p className="text-sm text-gray-400 mt-4 px-2">ACCOUNT</p>
              <ul className="space-y-2 font-medium">
                {middleNavItems.map(({ href, Icon, label }) => (
                  <SidebarItem key={href} href={href} Icon={Icon} label={label} />
                ))}
              </ul>
            </div>
          )}

          {/* Bottom Section */}
          <ul className="space-y-2 font-medium">
            {bottomNavItems.map(({ href, Icon, label }) => (
              <SidebarItem key={href} href={href} Icon={Icon} label={label} />
            ))}
          </ul>
        </div>
      </aside>

      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white border-b border-gray-200">
        <div className="px-4 py-3 flex justify-between items-center">
          {/* Sidebar Toggle Button */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="md:hidden text-gray-500" 
          >
            <Menu size={24} />
          </button>

          {/* Search Bar */}
          <SearchBar />

          {/* Logout Button */}
          <button
            onClick={() => {
              localStorage.removeItem('jwtToken');
              router.push('/login');
            }}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-md text-sm md:text-base"
          >
            <LucideLogOut size={18} />
            <span className='max-lg:hidden'>Logout</span>
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
      className="flex items-center p-2 text-gray-50 rounded-lg hover:bg-gray-800 text-sm lg:text-base"
    >
      <Icon className="w-5 h-5  text-gray-50" />
      <span className="ml-3">{label}</span>
    </Link>
  </li>
);

export default SidebarNavbar;

function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
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
