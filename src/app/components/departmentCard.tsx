import React from "react";

interface DepartmentCardProps {
  department: { id: number; name: string };
  onEdit: () => void;
  onDelete: () => void;
  onClick?: () => void;
}

const DepartmentCard: React.FC<DepartmentCardProps> = ({ department, onEdit, onDelete, onClick }) => {
  return (
    <div className="border p-4 rounded-lg shadow-md m-2 w-1/4">
      <h3 className="text-lg font-bold mb-2">{department.name}</h3>
      <p className="text-sm text-gray-500 mb-4">ID: {department.id}</p>
      <div className="flex justify-between">
        <button
          className="bg-yellow-500 text-white px-3 py-1 rounded-md text-sm"
          onClick={onEdit}
        >
          Edit
        </button>
        <button
          className="bg-red-500 text-white px-3 py-1 rounded-md text-sm"
          onClick={onDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default DepartmentCard;
