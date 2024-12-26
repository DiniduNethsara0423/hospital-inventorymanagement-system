'use client';

import React from 'react';
import Image from 'next/image';
import loginImg from '@/app/images/login.jpg';
import Link from 'next/link';

function LoginPage() {
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
            <h2 className="text-3xl font-bold">
              Hospital Management System
            </h2>
            <p className="text-gray-600">Welcome back! Please log in.</p>
          </div>

          <div>
            <div className="mb-4 flex flex-col">
              <label htmlFor="email" className="mt-3 text-gray-700 font-medium">
                Email
              </label>
              <input
                type="email"
                className="w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500"
                name="email"
                placeholder="Enter your Email"
              />
            </div>

            <div className="mb-4 flex flex-col">
              <label htmlFor="password" className="mt-3 text-gray-700 font-medium">
                Password
              </label>
              <input
                type="password"
                className="w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500"
                name="password"
                placeholder="Enter your Password"
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
                <a href="#" className="text-sm text-blue-600 hover:underline">
                  Forgot Password?
                </a>
              </div>
            </div>

            <div>
              <button
                className="bg-[#003BD1] text-white py-3 px-4 rounded-lg w-full shadow-md hover:bg-blue-700"
              >
                Login
              </button>
            </div>
          </div>

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
    </div>
  );
}

export default LoginPage;
