import React from 'react'

function navbar() {
  return (
   <>
   
   <div className="h-screen w-[98%] bg-white shadow-md dark:bg-gray-800 p-6 flex flex-col ">
      {/* Header Section */}
      <div className='ml-[10%] mt-[2%]'>
        <h2 className="text-md font-bold text-gray-800 dark:text-white">
          Super Admin
        </h2>
        <h3 className="text-3xl ml-[20%] font-bold text-blue-600">Inventory</h3>
      </div>

      {/* Navigation Links */}
      <nav className="mt-[20%] ml-[25%] space-y-8">
        <a
          href="#"
          className="flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:text-blue-600"
        >
          <svg
            className="w-6 h-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 10h11M9 21V3m11 7h-7m0 0V5m0 3v6m0 0h7m0 0v8m-7-8h7"
            />
          </svg>
          <span>Dashboard</span>
        </a>
        <a
          href="#"
          className="flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:text-blue-600"
        >
          <svg
            className="w-6 h-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 10h11m4 1l2 2m-2-2l2-2m-2 2H9"
            />
          </svg>
          <span>Inventory</span>
        </a>
        <a
          href="#"
          className="flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:text-blue-600"
        >
          <svg
            className="w-6 h-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 16v1m0-4V7m2-4H7a2 2 0 00-2 2v14h10l6-6V7a2 2 0 00-2-2z"
            />
          </svg>
          <span>Reports</span>
        </a>
        <a
          href="#"
          className="flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:text-blue-600"
        >
          <svg
            className="w-6 h-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M16 20h-4m4-4H8m8-4H8m0 4a4 4 0 110-8h8a4 4 0 010 8"
            />
          </svg>
          <span>Suppliers</span>
        </a>
        <a
          href="#"
          className="flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:text-blue-600"
        >
          <svg
            className="w-6 h-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M16 7H8m8-4H8m8 8H8m0 4h8"
            />
          </svg>
          <span>Orders</span>
        </a>
        <a
          href="#"
          className="flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:text-blue-600"
        >
          <svg
            className="w-6 h-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 21l6-6m-6 6V3m0 0H8"
            />
          </svg>
          <span>Department</span>
        </a>
      </nav>

      {/* Footer Section */}
      <div className="mt-[70%] space-y-8 ml-[25%]">
        <a
          href="#"
          className="flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:text-blue-600"
        >
          <svg
            className="w-6 h-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 2C12 7V0"
            />
          </svg>
          <span>Settings</span>
        </a>
        <a
          href="#"
          className="flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:text-blue-600"
        >
          <svg
            className="w-6 h-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 4h16M4 12h16M4 20h16"
            />
          </svg>
          <span className="text-red-600">Log Out</span>
        </a>
      </div>
    </div>


   </>
  )
}

export default navbar