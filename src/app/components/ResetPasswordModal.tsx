"use client";
import React, { useState } from "react";
import {
  requestPasswordReset,
  verifyOtp,
  updatePassword,
} from "@/app/apis/auth/api";

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState(""); // Allow user to input the email
  const [otp, setOtp] = useState("");
  const [passwordData, setPasswordData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRequestOtp = async () => {
    if (!email) {
      setError("Email is required.");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      await requestPasswordReset(email); // Send OTP to the provided email
      setStep(2); // Move to OTP verification step
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to request OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      setError("OTP is required.");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      await verifyOtp(email, otp); // Verify OTP with the provided email
      setStep(3); // Move to password update step
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (passwordData.password !== passwordData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(passwordData.password)) {
      setError(
        "Password must have at least 8 characters, an uppercase letter, and a symbol."
      );
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      await updatePassword(email, passwordData.password); // Update password with email
      onClose(); // Close modal after successful password update
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-96">
          <h2 className="text-xl font-bold text-center mb-4">Reset Password</h2>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          {step === 1 && (
            <>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Enter Your Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-gray-300 rounded w-full px-3 py-2 mb-4 focus:ring-blue-500 focus:border-blue-500"
                placeholder="youremail@example.com"
              />
              <button
                onClick={handleRequestOtp}
                disabled={isLoading}
                className="bg-blue-600 text-white py-2 px-4 rounded w-full hover:bg-blue-700"
              >
                {isLoading ? "Requesting OTP..." : "Send OTP"}
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Enter OTP
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="border border-gray-300 rounded w-full px-3 py-2 mb-4 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter the OTP"
              />
              <button
                onClick={handleVerifyOtp}
                disabled={isLoading}
                className="bg-blue-600 text-white py-2 px-4 rounded w-full hover:bg-blue-700"
              >
                {isLoading ? "Verifying OTP..." : "Verify OTP"}
              </button>
            </>
          )}

          {step === 3 && (
            <>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                New Password
              </label>
              <input
                type="password"
                value={passwordData.password}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    password: e.target.value,
                  })
                }
                className="border border-gray-300 rounded w-full px-3 py-2 mb-4 focus:ring-blue-500 focus:border-blue-500"
                placeholder="New Password"
              />

              <label className="block text-gray-700 text-sm font-medium mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    confirmPassword: e.target.value,
                  })
                }
                className="border border-gray-300 rounded w-full px-3 py-2 mb-4 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Confirm Password"
              />

              <button
                onClick={handleUpdatePassword}
                disabled={isLoading}
                className="bg-blue-600 text-white py-2 px-4 rounded w-full hover:bg-blue-700"
              >
                {isLoading ? "Updating Password..." : "Update Password"}
              </button>
            </>
          )}

          <button
            onClick={onClose}
            className="mt-4 text-gray-500 text-sm hover:underline"
          >
            Cancel
          </button>
        </div>
      </div>
    )
  );
};

export default ResetPasswordModal;
