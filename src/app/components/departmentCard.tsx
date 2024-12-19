import React from "react";
import { FaEdit } from "react-icons/fa";

// Props Interface
interface DepartmentCardProps {
  department: {
    id: number;
    name: string;
    head: string;
  };
  onClick: () => void; // Function for handling card click
  onEdit: () => void; // Function for handling edit button click
}

// Functional Component
const DepartmentCard: React.FC<DepartmentCardProps> = ({
  department,
  onClick,
  onEdit,
}) => {
  return (
    <div
      className="w-[30%] h-96 bg-fuchsia-100 rounded-lg shadow-md flex flex-col items-center justify-center p-4 cursor-pointer hover:shadow-lg transition-shadow duration-300"
      onClick={onClick} // Navigate to department details
    >
      {/* Department Name */}
      <h1 className="p-2 text-center font-bold text-lg text-gray-800">
        {department.name}
      </h1>

      {/* Placeholder for Image */}
      <div className="mt-4 w-3/4 h-2/3 bg-gray-200 rounded-md flex items-center justify-center">
        <span className="text-gray-500">Image Placeholder</span>
      </div>

      {/* Department Info */}
      <p className="mt-2 text-sm text-gray-600">Department ID: {department.id}</p>
      <p className="mt-1 text-sm text-gray-600">Head: {department.head}</p>

      {/* Edit Button */}
      <button
        className="mt-4 flex items-center text-blue-500 hover:text-blue-700 transition-colors duration-300"
        onClick={(e) => {
          e.stopPropagation(); // Prevents card click event propagation
          onEdit();
        }}
      >
        <FaEdit className="mr-2" />
        Edit
      </button>
    </div>
  );
};

export default DepartmentCard;
