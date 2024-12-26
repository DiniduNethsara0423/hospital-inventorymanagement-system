'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import hospital_img from '@/app/images/login.jpg';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

function SignupPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        password: '',
        department: ''
    });

    const [errors, setErrors] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        password: '',
        department: ''
    });

    const [backendError, setBackendError] = useState("");

    function handleChange(event: any) {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    }

    async function handleSubmit(event: any) {
        event.preventDefault();
        let hasError = false;

        const validationErrors = {
            firstName: '',
            lastName: '',
            phoneNumber: '',
            email: '',
            password: '',
            department: ''
        };

        if (!formData.firstName.trim()) {
            hasError = true;
            validationErrors.firstName = 'First name is required';
        }
        if (!formData.lastName.trim()) {
            hasError = true;
            validationErrors.lastName = 'Last name is required';
        }
        if (!formData.phoneNumber.trim()) {
            hasError = true;
            validationErrors.phoneNumber = 'Phone number is required';
        } else if (!/^0\d{9}$/.test(formData.phoneNumber)) {
            hasError = true;
            validationErrors.phoneNumber = 'Phone number is not valid';
        }
        if (!formData.email.trim()) {
            hasError = true;
            validationErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            hasError = true;
            validationErrors.email = 'Email is not valid';
        }
        if (!formData.password.trim()) {
            hasError = true;
            validationErrors.password = 'Password is required';
        } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/.test(formData.password)) {
            hasError = true;
            validationErrors.password = 'Password must have at least 8 characters, an uppercase letter, a lowercase letter, and a special character';
        }
        if (!formData.department.trim()) {
            hasError = true;
            validationErrors.department = 'Department is required';
        }

        setErrors(validationErrors);

        if (!hasError) {
            try {
                const response = await signUp({
                    userData: {
                        email: formData.email,
                        firstName: formData.firstName,
                        lastName: formData.lastName,
                        password: formData.password,
                        memberToken: ""
                    },
                    roleData: {
                        permission: "CRUD",
                        createdBy: 0
                    },
                    roleId: 2 // Assuming role ID for hospital staff is 2
                });

                if (response === true) {
                    router.push("/dashboard");
                } else {
                    setBackendError(response.message || 'An error occurred. Please try again.');
                }
            } catch (error: any) {
                setBackendError(error.message);
            } finally {
                dispatch(setLoading(false));
            }
        }
    }

    return (
        <div className="flex flex-col md:flex-row h-screen">

            <div
                className="hidden md:flex md:w-1/2 bg-blue-600 text-white flex-col justify-center items-center p-10"
                style={{
                    backgroundImage: `url(${hospital_img.src})`,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover'
                }}
            ></div>

            <div className="flex flex-col justify-center items-center bg-white p-10 md:w-1/2 w-full">
                <div className="w-full max-w-md">
                    <div className="text-center mb-6">
                        <h2 className="text-3xl font-bold">Hospital Management System</h2>
                        <p className="text-gray-600">Register to access your hospital dashboard:</p>
                    </div>
                    {backendError && <span className="text-red-500 px-5 rounded-lg py-4 text-md bg-red-100">{backendError}</span>}
                    <form>

                        <div className="mb-4 w-full flex gap-4 max-md:flex-col">
                            <div>
                                <input
                                    type="text"
                                    name="firstName"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500"
                                    placeholder="First Name"
                                    onChange={handleChange}
                                />
                                {errors.firstName && <span className="text-red-700 text-xs">{errors.firstName}</span>}
                            </div>
                            <div>
                                <input
                                    type="text"
                                    name="lastName"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500"
                                    placeholder="Last Name"
                                    onChange={handleChange}
                                />
                                {errors.lastName && <span className="text-red-700 text-xs">{errors.lastName}</span>}
                            </div>
                        </div>

                        <div className="mb-4">
                            <input
                                type="text"
                                name="phoneNumber"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500"
                                placeholder="Phone Number"
                                onChange={handleChange}
                            />
                            {errors.phoneNumber && <span className="text-red-700 text-xs">{errors.phoneNumber}</span>}
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
                            <input
                                type="text"
                                name="department"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500"
                                placeholder="Department"
                                onChange={handleChange}
                            />
                            {errors.department && <span className="text-red-700 text-xs">{errors.department}</span>}
                        </div>

                        <div className="flex items-center justify-between my-4">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="agree"
                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <label htmlFor="agree" className="ml-2 text-sm text-gray-700">
                                    I agree to the <b>Terms</b> and <b>Privacy Policies</b>
                                </label>
                            </div>
                        </div>

                        <button
                            type="submit"
                            onClick={handleSubmit}
                            className={`w-full py-2 px-4 text-white rounded-lg shadow-md  bg-blue-600 hover:bg-blue-700 focus:outline-none`}
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
            </div>

        </div>
    );
}

export default SignupPage;
