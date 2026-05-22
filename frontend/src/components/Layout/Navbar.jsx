import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200/50 bg-white/60 backdrop-blur-xl transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3 text-xl font-bold text-primary-600">
            <div className="h-8 w-8 rounded-lg bg-primary-600"></div>
            <span>Untung Utuh</span>
          </Link>
          <div className="hidden md:flex ml-8 gap-6">
            <a href="#features" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Fitur</a>
            <a href="#cara-kerja" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Cara Kerja</a>
            <a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Harga</a>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login">
            <Button variant="ghost">Masuk</Button>
          </Link>
          <Link to="/register">
            <Button>Daftar Gratis</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
