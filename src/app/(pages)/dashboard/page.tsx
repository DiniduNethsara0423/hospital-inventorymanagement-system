'use client';
import React, { useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Box, TrendingUp, DollarSign, Truck, CheckCircle, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const DoughnutChart = dynamic(() => import('react-chartjs-2').then((mod) => mod.Doughnut), { ssr: false });

ChartJS.register(ArcElement, Tooltip, Legend);

function InventoryPage() {

  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        router.push('/login');
      }
    }
  }, [router]);
  
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
    { label: 'Average Inventory', value: 'LKR 2,500,000', icon: <DollarSign size={20} className="text-green-500" /> },
    { label: 'Inventory Turnover Ratio', value: '2.1', icon: <TrendingUp size={20} className="text-blue-500" /> },
    { label: 'Returns', value: 'LKR 50,000', icon: <AlertTriangle size={20} className="text-yellow-500" /> },
    { label: 'To Be Shipped', value: 'LKR 20,000', icon: <Truck size={20} className="text-purple-500" /> },
    { label: 'Perfect Order Rate', value: '88.8%', icon: <CheckCircle size={20} className="text-teal-500" /> },
    { label: 'To Be Invoiced', value: 'LKR 100,000', icon: <Box size={20} className="text-gray-500" /> },
  ];


  

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-white min-h-screen">
      {/* Header Section */}
      <header className="flex flex-col lg:flex-row justify-between items-center mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 text-center md:text-left">
          Inventory Management KPIs
        </h1>
        <div className="text-gray-700 mt-2 md:mt-0 text-sm md:text-base">
          <span className="font-medium">Period:</span>{' '}
          <span className="text-green-600 font-bold cursor-pointer hover:underline">This Week</span>
        </div>
      </header>

      {/* KPI Cards Section */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {kpiCards.map((card, index) => (
          <div
            key={index}
            className="flex items-center bg-white shadow-md border border-gray-200 rounded-lg p-4 sm:p-6 hover:shadow-xl transition-shadow duration-200"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-gray-100 mr-3 sm:mr-4">
              {card.icon}
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-500">{card.label}</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-800 mt-1">{card.value}</p>
            </div>
          </div>
        ))}
      </section>

        <div className="grid lg:grid-cols-3 gap-8 w-full">

          <div className="col-span-2 grid gap-6 max-sm:grid-cols-1 grid-cols-2">
            {[{ title: 'Purchases', data: purchasesData }, { title: 'Inventory', data: inventoryData }].map(
              (chart, index) => (
                <div key={index} className="bg-white shadow-lg rounded-lg p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">{chart.title}</h3>
                  <Doughnut data={chart.data} />
                </div>
              )
            )}
          </div>

          <div className="bg-white shadow-lg rounded-lg p-6 max-lg:hidden">
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
        <div className="bg-white shadow-lg rounded-lg p-6 lg:hidden">
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
  );
}

export default InventoryPage;
