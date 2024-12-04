'use client'
import React, { useState } from "react";
import Navbar from "@/app/components/navbar";
import Header from "@/app/components/header";
import DepartmentCard from "@/app/components/departmentCard";
// import AddDepartmentPopup from "@/app/components/addDepartmentPopup";

function Page() {
  const [openPopup, setOpenPopup] = useState(false);

  const handleSave = (data: { departmentName: string; headOfDepartment: string }) => {
    console.log("Saved Data:", data);
    // Add logic to save data to an API or update state
  };

  return (
  
        <div className="w-full h-screen">
          <div className="flex justify-center w-full space-x-2 mt-[3%]">
            <div className="text-2xl w-[80%] text-center font-bold text-blue-800">
              Department
            </div>
            <button
              className="bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
              onClick={() => setOpenPopup(true)} // Open the popup
            >
              Add New
            </button>
          </div>
          <div className="flex w-full justify-between p-4 rounded-xl">
            <DepartmentCard />
            <DepartmentCard />
            <DepartmentCard />
          </div>
        </div>
       
      
  );
}

export default Page;
