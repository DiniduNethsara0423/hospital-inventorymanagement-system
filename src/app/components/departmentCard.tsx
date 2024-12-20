import React from "react";
import Image from "next/image";
import departmentImg from '@/app/images/department.jpg'
interface DepartmentCardProps {
  department: { id: number; name: string; imageUrl?: string };
  onEdit: () => void;
  onDelete: () => void;
  onClick?: () => void;
}

const DepartmentCard: React.FC<DepartmentCardProps> = ({
  department,
  onEdit,
  onDelete,
  onClick,
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md max-w-sm">
      {/* Image Section */}
      <div className="w-full h-48 overflow-hidden rounded-t-lg">
        <Image
          src={departmentImg}
          alt={department.name}
          className="w-full h-full object-cover"
        />
      </div>
      {/* Content Section */}
      <div className="p-6 flex flex-col items-center text-center">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{department.name}</h3>
        <p className="text-sm text-gray-500">Department ID: {department.id}</p>
        <div className="mt-4 flex space-x-4">
          <button
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-500 transition"
            onClick={onEdit}
          >
            Edit
          </button>
          <button
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-500 transition"
            onClick={onDelete}
          >
            Delete
          </button>
        </div>
        <button
          className="mt-4 bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition"
          onClick={onClick}
        >
          Select
        </button>
      </div>
    </div>
  );
};

export default DepartmentCard;