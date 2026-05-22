import React from 'react';
import { Outlet } from 'react-router-dom';

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-6">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome to your secure area.</p>
      </div>
      
      {/* Ready for nested routing */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm min-h-[400px]">
        <Outlet />
      </div>
    </div>
  );
}
