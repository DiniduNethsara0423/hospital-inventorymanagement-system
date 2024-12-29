'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signUp } from '@/app/apis/auth/api';
import OTPVerificationPopup from '@/app/components/OTPVerificationPopup';

function SignupPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role_id: 3, // Default role as User
    });

    const [errors, setErrors] = useState({
        username: '',
        email: '',
        password: '',
        role_id: '',
    });

    const [backendError, setBackendError] = useState('');
    const [otpPopupOpen, setOtpPopupOpen] = useState(false);
    const [emailToVerify, setEmailToVerify] = useState('');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        let hasError = false;
        const validationErrors = { username: '', email: '', password: '', role_id: '' };

        if (!formData.username.trim()) {
            hasError = true;
            validationErrors.username = 'Username is required';
        }

        if (!formData.email.trim()) {
            hasError = true;
            validationErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            hasError = true;
            validationErrors.email = 'Invalid email format';
        }

        if (!formData.password.trim()) {
            hasError = true;
            validationErrors.password = 'Password is required';
        } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(formData.password)) {
            hasError = true;
            validationErrors.password =
                'Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, and a number';
        }

        if (!formData.role_id) {
            hasError = true;
            validationErrors.role_id = 'Role selection is required';
        }

        setErrors(validationErrors);

        if (!hasError) {
            try {
                const response = await signUp(formData);

                if (response?.success) {
                    setEmailToVerify(formData.email);
                    setOtpPopupOpen(true);
                } else {
                    setBackendError(response?.message || 'Registration failed');
                }
            } catch (error: any) {
                setBackendError(error.message);
            }
        }
    };

    const handleVerifyOtp = async (otp: string) => {
        try {
            const response = await verifyOtp(emailToVerify, otp);
            if (response.success) {
                setOtpPopupOpen(false);
                router.push('/login');
            } else {
                throw new Error(response.message || 'Invalid OTP');
            }
        } catch (error: any) {
            throw new Error(error.message || 'Verification failed');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-gray-400 to-gray-500 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
                <div className="text-center mb-6">
                    <h2 className="text-3xl font-bold text-gray-800">Create an Account</h2>
                    <p className="text-gray-600">Join us to access exclusive features.</p>
                </div>
                {backendError && (
                    <div className="text-red-500 px-4 py-2 rounded bg-red-100 mb-4">{backendError}</div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <input
                            type="text"
                            name="username"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500"
                            placeholder="Username"
                            onChange={handleChange}
                        />
                        {errors.username && <span className="text-red-700 text-xs">{errors.username}</span>}
                    </div>

                    <div className="mb-4">
                        <input
                            type="email"
                            name="email"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500"
                            placeholder="Email"
                            onChange={handleChange}
                        />
                        {errors.email && <span className="text-red-700 text-xs">{errors.email}</span>}
                    </div>

                    <div className="mb-4">
                        <input
                            type="password"
                            name="password"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500"
                            placeholder="Password"
                            onChange={handleChange}
                        />
                        {errors.password && <span className="text-red-700 text-xs">{errors.password}</span>}
                    </div>

                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium text-gray-700">Select Role:</label>
                        <div className="flex gap-4">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="role_id"
                                    value="1"
                                    onChange={handleChange}
                                    className="mr-2"
                                />
                                Super Admin
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="role_id"
                                    value="2"
                                    onChange={handleChange}
                                    className="mr-2"
                                />
                                Admin
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="role_id"
                                    value="3"
                                    defaultChecked
                                    onChange={handleChange}
                                    className="mr-2"
                                />
                                User
                            </label>
                        </div>
                        {errors.role_id && <span className="text-red-700 text-xs">{errors.role_id}</span>}
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 px-4 text-white rounded-lg shadow-md bg-blue-600 hover:bg-blue-700 focus:outline-none"
                    >
                        Sign Up
                    </button>

                    <div className="text-center mt-4">
                        <p className="text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link href="/login" className="text-blue-600 hover:underline">
                                Login here
                            </Link>
                        </p>
                    </div>
                </form>
            </div>

            <OTPVerificationPopup
                isOpen={otpPopupOpen}
                onClose={() => setOtpPopupOpen(false)}
                onVerify={handleVerifyOtp}
            />
        </div>
    );
}

export default SignupPage;
