import SEO from '@/components/SEO/SEO';

export default function Home() {
  return (
    <>
      <SEO
        title="Home"
        description="Welcome to the MERN Stack application — built with React 19, Node.js, Express, and MongoDB."
        url="/"
      />
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
        <h1 className="text-4xl font-bold text-white">
          MERN Stack Starter
        </h1>
        <p className="text-slate-400 text-lg max-w-xl">
          React 19 · Node.js · Express · MongoDB · Docker · Tailwind CSS v4
        </p>
        <div className="flex gap-3 mt-4">
          <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm font-medium border border-green-500/30">
            Dev
          </span>
          <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-sm font-medium border border-yellow-500/30">
            Staging
          </span>
          <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-sm font-medium border border-blue-500/30">
            Production
          </span>
        </div>
      </div>
    </>
  );
}
