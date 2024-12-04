import { motion } from "framer-motion";
import { useState } from "react";

interface SaveSuccessPopupProps {
  message?: string; // Optional custom message
  onClose: () => void; // Callback to close the popup
}

const SaveSuccessPopup: React.FC<SaveSuccessPopupProps> = ({ message = "Saved Successfully!", onClose }) => {
  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose} // Close popup on background click
    >
      <motion.div
        className="bg-white rounded-lg shadow-lg px-6 py-4 text-center space-y-4 max-w-sm"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        onClick={(e) => e.stopPropagation()} // Prevent closing on popup click
      >
        <h2 className="text-xl font-semibold text-green-600">{message}</h2>
        <button
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          onClick={onClose}
        >
          Close
        </button>
      </motion.div>
    </motion.div>
  );
};

export default SaveSuccessPopup;
