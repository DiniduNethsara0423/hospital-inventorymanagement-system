"use client";

import { useRouter } from "next/navigation";

const DepartmentDetailPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Department Details</h1>
      <p className="text-lg">You are viewing department with ID: {params.id}</p>
      <button
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md"
        onClick={() => router.back()}
      >
        Go Back
      </button>
    </div>
  );
};

export default DepartmentDetailPage;
