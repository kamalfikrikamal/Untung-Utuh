import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4">
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="text-lg font-bold text-white">
            {import.meta.env.VITE_APP_NAME || 'MERN App'}
          </span>
        </nav>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        <Outlet />
      </main>

      <footer className="bg-slate-900 border-t border-slate-800 px-6 py-4 text-center text-slate-500 text-sm">
        &copy; {new Date().getFullYear()} MERN App
      </footer>
    </div>
  );
}
