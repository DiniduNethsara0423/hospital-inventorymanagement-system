import React, { useState } from "react";

interface AddDepartmentPopupProps {
  btnStatus: (status: boolean) => void;
  onSave: (data: { departmentName: string; headOfDepartment: string }) => void;
}

const AddDepartmentPopup: React.FC<AddDepartmentPopupProps> = ({ btnStatus, onSave }) => {
  const [departmentName, setDepartmentName] = useState("");
  const [headOfDepartment, setHeadOfDepartment] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleCancel = () => {
    btnStatus(false);
  };

  const handleSave = async () => {
    if (!departmentName || !headOfDepartment) {
      alert("Please fill in all fields!");
      return;
    }
    setIsSaving(true);
    try {
      onSave({ departmentName, headOfDepartment });
      btnStatus(false);
    } catch (error) {
      console.error("Error saving department:", error);
      // Handle error (e.g., show error message)
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-full w-screen px-3">
      <div className="fixed inset-0 bg-[#FFFFFF] bg-opacity-50 backdrop-filter backdrop-blur-lg"></div>
      <div className="bg-white rounded-lg overflow-hidden shadow-xl max-w-2xl lg:w-4/5 md:w-3/4 sm:w-full z-50">
        <div className="m-5">
          <h3 className="text-3xl xl:text-2xl lg:text-xl md:text-lg sm:text-base text-center font-bold mt-7">
            Add New Department
          </h3>
          <div className="flex flex-col gap-4 mt-5">
            <div>
              <label className="block text-sm font-semibold mb-2">Department Name</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={departmentName}
                onChange={(e) => setDepartmentName(e.target.value)}
                placeholder="Enter department name"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Head of Department</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={headOfDepartment}
                onChange={(e) => setHeadOfDepartment(e.target.value)}
                placeholder="Enter head of department name"
              />
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="flex justify-center gap-4 mb-6">
            <button
              className={`${isSaving ? "opacity-50 cursor-not-allowed" : ""} bg-blue-600 text-white rounded-xl px-8 py-2 xl:px-6 lg:px-5 md:px-4 sm:px-3`}
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
            <button
              className="border border-gray-400 text-gray-700 rounded-xl px-8 py-2 xl:px-6 lg:px-5 md:px-4 sm:px-3"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddDepartmentPopup;
