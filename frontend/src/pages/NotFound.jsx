import { Link } from 'react-router-dom';
import SEO from '@/components/SEO/SEO';

export default function NotFound() {
  return (
    <>
      <SEO title="404 – Page Not Found" noindex />
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
        <h1 className="text-6xl font-bold text-slate-600">404</h1>
        <p className="text-slate-400 text-lg">Page not found</p>
        <Link to="/" className="mt-2 text-blue-400 hover:underline">
          Back to Home
        </Link>
      </div>
    </>
  );
}
