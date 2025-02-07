'use client';

import React, { useState, useRef } from 'react';
import { initiateRegistration, verifyOtp, completeRegistration } from '@/app/apis/auth/api';

const RegistrationSteps: React.FC = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [roleId, setRoleId] = useState(1);
    const [otp, setOtp] = useState(Array(6).fill(''));
    const [message, setMessage] = useState('');
    const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

    const handleInitiateRegistration = async () => {
        try {
            const response = await initiateRegistration(email, password, username, roleId);
            if (response.success) {
                setMessage('OTP sent to your email');
                setStep(2);
            }
        } catch (error) {
            setMessage('Error initiating registration');
        }
    };
    

    const handleVerifyOtp = async () => {
        try {
            const otpCode = otp.join('');
            const response = await verifyOtp(email, otpCode);
            if (response.success) {
                setMessage('OTP verified');
                setStep(3);
            }
        } catch {
            setMessage('Error verifying OTP');
        }
    };

    const handleCompleteRegistration = async () => {
        try {
            const response = await completeRegistration(email);
            if (response.success) {
                setMessage('Registration complete');
            }
        } catch {
            setMessage('Error completing registration');
        }
    };

    // const handleOtpChange = (value: string, index: number) => {
    //     const newOtp = [...otp];
    //     newOtp[index] = value;
    //     setOtp(newOtp);

    //     if (value && index < otpRefs.current.length - 1) {
    //         otpRefs.current[index + 1]?.focus();
    //     }
    // };

    const handleOtpChange = (value: string, index: number) => {
        const newOtp = [...otp];
        newOtp[index] = value;
        
        if (value && index < otpRefs.current.length - 1) {
            otpRefs.current[index + 1]?.focus();
        } else if (!value && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    
        setOtp(newOtp);
    };
    

    const renderMessage = () => {
        if (!message) return null;
        const isSuccess = message.toLowerCase().includes('success') || message.toLowerCase().includes('complete');
        return (
            <p className={`mb-4 text-center ${isSuccess ? 'text-green-500' : 'text-red-500'} font-semibold`}>
                {message}
            </p>
        );
    };

    return (
        <div className="p-6 max-w-md mx-auto bg-white shadow-md rounded-md">
            <h1 className="text-2xl font-bold mb-6 text-center">Registration</h1>
            {renderMessage()}

            {step === 1 && (
                <div>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full mb-4 border rounded p-3"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full mb-4 border rounded p-3"
                    />
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="block w-full mb-4 border rounded p-3"
                    />
                    <div className="mb-4">
                        <p className="font-medium mb-2">Select Role:</p>
                        <div className="flex gap-4">
                            {[
                                { id: 1, label: 'Super Admin' },
                                { id: 2, label: 'Admin' },
                                { id: 3, label: 'User' },
                            ].map((role) => (
                                <label key={role.id} className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="role"
                                        value={role.id}
                                        checked={roleId === role.id}
                                        onChange={() => setRoleId(role.id)}
                                    />
                                    {role.label}
                                </label>
                            ))}
                        </div>
                    </div>
                    <button
                        onClick={handleInitiateRegistration}
                        className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700"
                    >
                        Send OTP
                    </button>
                </div>
            )}

            {step === 2 && (
                <div>
                    <p className="mb-4 text-gray-600">Enter the 6-digit OTP sent to your email:</p>
                    <div className="flex gap-2 justify-center mb-6">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                type="text"
                                maxLength={1}
                                value={digit}
                                ref={(el:any) => (otpRefs.current[index] = el)}
                                onChange={(e) => handleOtpChange(e.target.value, index)}
                                className="w-12 h-12 border rounded text-center text-lg"
                            />
                        ))}
                    </div>
                    <button
                        onClick={handleVerifyOtp}
                        className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700"
                    >
                        Verify OTP
                    </button>
                </div>
            )}

            {step === 3 && (
                <div>
                    <button
                        onClick={handleCompleteRegistration}
                        className="bg-green-600 text-white px-4 py-2 rounded w-full hover:bg-green-700"
                    >
                        Complete Registration
                    </button>
                </div>
            )}
        </div>
    );
};

export default RegistrationSteps;
