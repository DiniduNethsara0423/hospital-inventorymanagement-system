import React from "react";

function DepartmentCard() {
  return (
    <div className="w-[30%] h-96 bg-fuchsia-100 rounded-lg shadow-md flex flex-col items-center justify-center p-4">
      <h1 className="p-2 text-center font-bold text-lg text-gray-800">Eye Department</h1>
      <div className="mt-4 w-3/4 h-2/3 bg-gray-200 rounded-md flex items-center justify-center">
        <span className="text-gray-500">Image Placeholder</span>
      </div>
    </div>
  );
}

export default DepartmentCard;
