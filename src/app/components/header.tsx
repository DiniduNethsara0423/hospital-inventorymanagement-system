'use client';
import React from 'react';

function Header() {
  return (
    <div className=" top-0  right-0 z-50 bg-white dark:bg-gray-800 shadow-md">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Search Bar */}
        <div className="flex items-center w-full max-w-lg bg-gray-100 dark:bg-gray-700 rounded-lg p-2 space-x-2">
          <svg
            className="w-5 h-5 text-blue-500 dark:text-blue-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M11 17a6 6 0 100-12 6 6 0 000 12zm4.293-2.293l5 5"
            />
          </svg>
          <input
            type="text"placeholder="Quick Search"
       className="w-full bg-transparent border-none outline-none px-2 py-1 text-gray-600 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500"
     />
   </div>

   {/* Separator (Responsive hidden on smaller screens) */}
   <div className="hidden lg:block mx-4 h-6 w-px bg-gray-300 dark:bg-gray-700"></div>

   {/* Notification Icon and Profile */}
   <div className="flex items-center space-x-4">
     {/* Notification Icon */}
     <button className="relative group">
       <svg
         className="w-6 h-6 text-blue-500 dark:text-blue-400"
         xmlns="http://www.w3.org/2000/svg"
         fill="none"
         viewBox="0 0 24 24"
         stroke="currentColor"
       >
         <path
           strokeLinecap="round"
           strokeLinejoin="round"
           strokeWidth="2"
           d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .417-.162.817-.447 1.108L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
         />
       </svg><span className="absolute top-0 right-0 flex items-center justify-center w-4 h-4 text-xs text-white bg-red-500 rounded-full dark:bg-red-400 group-hover:bg-red-600">
              3
            </span>
          </button>

          {/* Profile */}
          <div className="flex items-center space-x-2">
            <img
              className="w-8 h-8 rounded-full ring-2 ring-blue-500 dark:ring-blue-400"
              src="https://via.placeholder.com/150"
              alt="User profile"
            />
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Admin</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">admin@gmail.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
