'use client';
import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

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

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      {/* Header Section */}
      <header className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-semibold text-[#002788]">Inventory Management KPIs</h1>
      <div className="text-gray-700">
          <span className="font-medium">Period:</span>{' '}
          <span className="text-green-600 font-bold cursor-pointer hover:underline">This Week</span>
        </div>
      </header>

      {/* KPI Cards and Top Items */}
      <div className="flex w-full gap-8">
        {/* KPI Cards */}
        <div className="w-[70%]">
          <section className="grid grid-cols-3 gap-6">
            {[
              { label: 'Average Inventory', value: 'LKR 2,500,000' },
              { label: 'Inventory Turnover Ratio', value: '2.1' },
              { label: 'Returns', value: 'LKR 50,000' },
              { label: 'To Be Shipped', value: 'LKR 20,000' },
              { label: 'Perfect Order Rate', value: '88.8%' },
              { label: 'To Be Invoiced', value: 'LKR 100,000' },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-gray-200 shadow-md border border-gray-300 rounded-lg p-8 flex flex-col justify-between"
              >
                <p className="text-sm font-medium text-gray-700">{item.label}</p>
                <p className="text-2xl font-bold text-blue-600 mt-2">{item.value}</p>
              </div>
            ))}
          </section>
        </div>

        {/* Top Items */}
        <div className="w-[25%]">
          <div className="bg-gray-200 shadow-md border border-gray-300 rounded-lg p-5">
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

      {/* Charts Section */}
      <section className="mt-10 grid grid-cols-2 gap-8">
        {[
          { title: 'Purchases', data: purchasesData },
          { title: 'Inventory', data: inventoryData },
        ].map((chart, index) => (
          <div key={index} className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">{chart.title}</h3>
            <Doughnut data={chart.data} />
          </div>
        ))}
      </section>
    </div>
  );
}

export default InventoryPage;
