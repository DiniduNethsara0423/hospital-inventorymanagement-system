"use client"
import React, { useState } from 'react';
import Image from 'next/image';
import loginImg from '@/app/images/login.jpg';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { login } from '@/app/apis/auth/api';
import ResetPasswordModal from '@/app/components/ResetPasswordModal';

function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);
  
    try {
      const response:any = await login(formData);
  
      if (response.token && (response.status === 200 || response.status === 201)) {
  
        router.push('/dashboard');
      } else {
        setError('Unexpected response from the server. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid login credentials');
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Left Section */}
      <div
        className="hidden md:flex md:w-1/2 bg-blue-600 text-white flex-col justify-center items-center p-10"
        style={{
          backgroundImage: `url(${loginImg.src})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}
      ></div>

      {/* Right Section */}
      <div className="flex flex-col justify-center items-center bg-white p-10 md:w-1/2 w-full">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold">Hospital Management System</h2>
            <p className="text-gray-600">Welcome back! Please log in.</p>
          </div>

          {error && (
            <div className="text-red-500 px-4 py-2 rounded bg-red-100 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4 flex flex-col">
              <label htmlFor="username" className="mt-3 text-gray-700 font-medium">
                Username
              </label>
              <input
                type="text"
                name="username"
                className="w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500"
                placeholder="Enter your Username"
                onChange={handleChange}
              />
            </div>

            <div className="mb-4 flex flex-col">
              <label htmlFor="password" className="mt-3 text-gray-700 font-medium">
                Password
              </label>
              <input
                type="password"
                name="password"
                className="w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500"
                placeholder="Enter your Password"
                onChange={handleChange}
              />
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="remember" className="ml-2 text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <div>
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:underline"
                  onClick={() => setIsModalOpen(true)}
                >
                  Forgot Password?
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="bg-[#003BD1] text-white py-3 px-4 rounded-lg w-full shadow-md hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
            </div>
          </form>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Don’t have an account?{' '}
              <Link href="./signup" className="text-[#1837DB] hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>

      <ResetPasswordModal
        email={formData.username}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

export default LoginPage;
