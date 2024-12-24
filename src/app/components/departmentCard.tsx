import React from "react";
import Image from "next/image";
import departmentImg from "@/app/images/department.jpg";

interface DepartmentCardProps {
  department: { id: number; name: string; imageUrl?: string };
  onClick?: () => void;
}

const DepartmentCard: React.FC<DepartmentCardProps> = ({ department, onClick }) => {
  return (
    <div
      className="bg-white border border-gray-200 rounded-lg shadow-lg max-w-md cursor-pointer overflow-hidden hover:shadow-xl transition"
      onClick={onClick}
    >
      {/* Image Section */}
      <div className="w-full h-64 overflow-hidden">
        <Image
          src={departmentImg}
          alt={department.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content Section */}
      <div className="p-6 text-center">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">{department.name}</h3>
      </div>
    </div>
  );
};

export default DepartmentCard;