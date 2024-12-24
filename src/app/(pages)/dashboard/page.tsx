'use client';
import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Box, TrendingUp, DollarSign, Truck, CheckCircle, AlertTriangle } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend);

function InventoryPage() {
  const purchasesData = {
    labels: ['Delivering', 'Delivered', 'Returns', 'Overdue Shipping'],
    datasets: [
      {
        data: [80, 10, 7, 3],
        backgroundColor: ['#2DD4BF', '#34D399', '#FBBF24', '#EF4444'],
        hoverBackgroundColor: ['#2DD4BF', '#34D399', '#FBBF24', '#EF4444'],
      },
    ],
  };

  const inventoryData = {
    labels: ['In Stock Items', 'Out Of Stock Items', 'Low Stock Items', 'Dead Stock Items'],
    datasets: [
      {
        data: [80, 10, 7, 3],
        backgroundColor: ['#2DD4BF', '#34D399', '#FBBF24', '#EF4444'],
        hoverBackgroundColor: ['#2DD4BF', '#34D399', '#FBBF24', '#EF4444'],
      },
    ],
  };

  const kpiCards = [
    { label: 'Average Inventory', value: 'LKR 2,500,000', icon: <DollarSign className="text-green-500" /> },
    { label: 'Inventory Turnover Ratio', value: '2.1', icon: <TrendingUp className="text-blue-500" /> },
    { label: 'Returns', value: 'LKR 50,000', icon: <AlertTriangle className="text-yellow-500" /> },
    { label: 'To Be Shipped', value: 'LKR 20,000', icon: <Truck className="text-purple-500" /> },
    { label: 'Perfect Order Rate', value: '88.8%', icon: <CheckCircle className="text-teal-500" /> },
    { label: 'To Be Invoiced', value: 'LKR 100,000', icon: <Box className="text-gray-500" /> },
  ];

  return (
    <div className="p-8 bg-white  min-h-screen font-sans">
      {/* Header Section */}
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold text-[#002788]">Inventory Management KPIs</h1>
        <div className="text-gray-700">
          <span className="font-medium">Period:</span>{' '}
          <span className="text-green-600 font-bold cursor-pointer hover:underline">This Week</span>
        </div>
      </header>

      {/* KPI Cards Section */}
      <section className="grid grid-cols-3 gap-6 mb-10">
        {kpiCards.map((card, index) => (
          <div
            key={index}
            className="flex items-center bg-white shadow-lg border border-gray-200 rounded-lg p-6 hover:shadow-xl transition-shadow duration-200"
          >
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 mr-4">
              {card.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{card.label}</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">{card.value}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Charts and Top Items Section */}
      <div className="grid grid-cols-3 gap-8">
        {/* Charts */}
        <div className="col-span-2 grid grid-cols-2 gap-6">
          {[{ title: 'Purchases', data: purchasesData }, { title: 'Inventory', data: inventoryData }].map(
            (chart, index) => (
              <div key={index} className="bg-white shadow-lg rounded-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">{chart.title}</h3>
                <Doughnut data={chart.data} />
              </div>
            )
          )}
        </div>

        {/* Top Items */}
        <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Top Items</h3>
          <ul className="space-y-3">
            {['Surgical Gowns', 'Band-Aids', 'Syringes'].map((item, index) => (
              <li
                key={index}
                className="flex items-center gap-3 text-sm bg-gray-100 p-3 rounded-lg"
              >
                <div className="bg-yellow-400 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center">
                  {index + 1}
                </div>
                <span className="text-gray-800">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default InventoryPage;
