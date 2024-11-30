'use client'
import React from "react";
import Navbar from "@/app/components/navbar";
import Header from "@/app/components/header";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);
function page() {
    const purchasesData = {
        labels: ["Delivering", "Delivered", "Returns", "Overdue Shipping"],
        datasets: [
          {
            data: [80, 10, 7, 3],
            backgroundColor: ["#2DD4BF", "#34D399", "#FBBF24", "#EF4444"],
            hoverBackgroundColor: ["#2DD4BF", "#34D399", "#FBBF24", "#EF4444"],
          },
        ],
      };
    
      // Data for Inventory Chart
      const inventoryData = {
        labels: ["In Stock Items", "Out Of Stock Items", "Low Stock Items", "Dead Stock Items"],
        datasets: [
          {
            data: [80, 10, 7, 3],
            backgroundColor: ["#2DD4BF", "#34D399", "#FBBF24", "#EF4444"],
            hoverBackgroundColor: ["#2DD4BF", "#34D399", "#FBBF24", "#EF4444"],
          },
        ],
      };
  return (
    <div className="flex w-full h-screen">
      <div className="w-[20%]">
        <Navbar />
      </div>
      <div className="w-[80%]">
        <Header />
        {/* <div className="w-full h-screen  p-5">
          <div className="flex w-full">
            <div className="w-[80%] border border-red-800">
              <h1 className="text-xl font-bold text-blue-800">
                Inventory Management KPIs
              </h1>

              <div className="w-full p-2 mt-[3%] space-y-5">
                <div className="flex w-full space-x-16 ml-[6%] ">
                  <div className="w-[25%] border border-red-800 space-y-4 p-2 flex flex-col ">
                    <div className="ml-[20%] space-y-7 p-2">
                    <h2 className="font-bold text-sm ml-[2%]">Average Inventory</h2>
                    <div className="flex space-x-1 ml-[5%]  ">
                        <h1 className="text-blue-700">LKR</h1>
                        <h1 className="text-blue-700">25000</h1>
                    </div>
                    </div>
                  </div>
                  <div className="w-[25%] border border-red-800">
                    <h2>Inventory Turnover Ratio</h2>
                    <h1>LKR 250000</h1>
                  </div>
                  <div className="w-[25%] border border-red-800">
                    <h2>Returns</h2>
                    <h1>LKR 250000</h1>
                  </div>
                </div>
                <div className="flex w-full space-x-16 ml-[6%] ">
                  <div className="w-[25%] border border-red-800">
                    <h2>To Be Ship</h2>
                    <h1>LKR 250000</h1>
                  </div>
                  <div className="w-[25%] border border-red-800">
                    <h2>Perfect Order Ratio</h2>
                    <h1>LKR 250000</h1>
                  </div>
                  <div className="w-[25%] border border-red-800">
                    <h2>To Be Invoiced</h2>
                    <h1>LKR 250000</h1>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-[20%]">22</div>
          </div>
          <div>body</div>
        </div> */}

<div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-00">
          Inventory Management KPIs
        </h1>
        <span className="text-sm text-gray-700">
          Period: <span className="text-green-600 font-bold">This Week</span>
        </span>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white shadow-md p-4 rounded-md">
          <p className="text-gray-500">Average Inventory</p>
          <p className="text-xl font-bold text-gray-800">LKR 2500000</p>
        </div>
        <div className="bg-white shadow-md p-4 rounded-md">
          <p className="text-gray-500">Inventory Turnover Ratio</p>
          <p className="text-xl font-bold text-gray-800">2.1</p>
        </div>
        <div className="bg-white shadow-md p-4 rounded-md">
          <p className="text-gray-500">Returns</p>
          <p className="text-xl font-bold text-gray-800">LKR 50000</p>
        </div>
        <div className="bg-white shadow-md p-4 rounded-md">
          <p className="text-gray-500">Top Items</p>
          <ul className="mt-2 space-y-1">
            <li>1. Surgical Gowns</li>
            <li>2. Band-Aids</li>
            <li>3. Syringes</li>
          </ul>
        </div>
        <div className="bg-white shadow-md p-4 rounded-md">
          <p className="text-gray-500">To Be Shipped</p>
          <p className="text-xl font-bold text-gray-800">LKR 20000</p>
        </div>
        <div className="bg-white shadow-md p-4 rounded-md">
          <p className="text-gray-500">Perfect Order Rate</p>
          <p className="text-xl font-bold text-gray-800">88.8%</p>
        </div>
        <div className="bg-white shadow-md p-4 rounded-md">
          <p className="text-gray-500">To Be Invoiced</p>
          <p className="text-xl font-bold text-gray-800">LKR 100000</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="mt-10 grid grid-cols-2 gap-8">
        {/* Purchases Chart */}
        <div className="bg-white shadow-md p-6 rounded-md">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Purchases</h3>
          <Doughnut data={purchasesData} />
        </div>

        {/* Inventory Chart */}
        <div className="bg-white shadow-md p-6 rounded-md">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Inventory</h3>
          <Doughnut data={inventoryData} />
        </div>
      </div>
    </div>


      </div>
    </div>
  );
}

export default page;
