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
      <div className="mt-10  grid grid-cols-2 gap-8">
        {/* Purchases Chart */}
        <div className="bg-white shadow-md p-6 rounded-md ">
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


    
  );
}

export default page;
