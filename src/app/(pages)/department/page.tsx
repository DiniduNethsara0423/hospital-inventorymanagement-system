import React from "react";
import Navbar from "@/app/components/navbar";
import Header from "@/app/components/header";
import DepartmentCard from "@/app/components/departmentCard";

function Page() {
  return (
    <div className="flex w-full h-screen bg-gray-100">
      {/* Sidebar Section */}
      <div className="w-[20%] bg-white shadow-md">
        <Navbar />
      </div>

      {/* Main Content Section */}
      <div className="w-[80%] p-6">
        <Header />
        <div className="w-full mt-6">
          {/* Header Section */}
          <div className="flex justify-center items-center space-x-4 mb-6">
            <h1 className="text-2xl font-bold text-blue-800 text-center w-[80%]">Departments</h1>
            <button className="bg-blue-700 text-white px-4 py-2 rounded-lg text-sm">
              Add New
            </button>
          </div>

          {/* Cards Section */}
          <div className="flex justify-between flex-wrap gap-4 p-4">
            <DepartmentCard />
            <DepartmentCard />
            <DepartmentCard />
            <DepartmentCard />
            <DepartmentCard />
            <DepartmentCard />

          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
