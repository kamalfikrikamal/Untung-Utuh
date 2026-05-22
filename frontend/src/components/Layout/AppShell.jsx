import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { Sidebar } from './Sidebar';

export function AppShell() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');

  return (
    <div className={isDashboard ? "min-h-screen flex flex-col bg-gray-50" : "flex flex-col bg-gray-50"}>
      <Navbar />
      
      {isDashboard ? (
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto flex flex-col">
            <div className="p-4 sm:p-6">
              <Outlet />
            </div>
          </main>
        </div>
      ) : (
        <main className="flex-1 flex flex-col w-full">
          <Outlet />
        </main>
      )}
      
      {!isDashboard && <Footer />}
    </div>
  );
}
