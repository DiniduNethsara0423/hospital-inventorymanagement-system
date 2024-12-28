'use client';

import React, { useState } from 'react';

interface OTPVerificationPopupProps {
    isOpen: boolean;
    onClose: () => void;
    onVerify: (otp: string) => Promise<void>;
}

const OTPVerificationPopup: React.FC<OTPVerificationPopupProps> = ({ isOpen, onClose, onVerify }) => {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');

    const handleVerify = async () => {
        try {
            if (!otp.trim()) {
                setError('OTP is required');
                return;
            }
            await onVerify(otp);
        } catch (err: any) {
            setError(err.message || 'Invalid OTP');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h3 className="text-xl font-semibold mb-4">Verify Your Email</h3>
                <p className="text-gray-600 mb-4">Enter the OTP sent to your email.</p>
                {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
                <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 mb-4"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => {
                        setOtp(e.target.value);
                        setError('');
                    }}
                />
                <div className="flex justify-end">
                    <button
                        className="px-4 py-2 bg-gray-300 rounded-lg mr-2"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                        onClick={handleVerify}
                    >
                        Verify
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OTPVerificationPopup;
