import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  type?: "success" | "error";
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, message, type = "success" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center animate-fadeIn">
        <p className={`text-lg font-medium ${type === "error" ? "text-red-600" : "text-green-600"}`}>
          {message}
        </p>
        <button
          onClick={onClose}
          className={`mt-4 px-4 py-2 rounded-md transition ${
            type === "error" ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
          } text-white`}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
