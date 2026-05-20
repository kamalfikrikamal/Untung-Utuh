/** Generic animated skeleton block */
export function Skeleton({ className = '' }) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse bg-slate-700 rounded ${className}`}
    />
  );
}

/** Skeleton matching the Dashboard ProductCard */
export function ProductCardSkeleton() {
  return (
    <div
      aria-busy="true"
      className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 flex flex-col"
    >
      <Skeleton className="h-40 w-full rounded-none" />
      <div className="p-4 space-y-2.5">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-3 w-1/4 mt-1" />
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-8 flex-1" />
          <Skeleton className="h-8 flex-1" />
        </div>
      </div>
    </div>
  );
}

/** Skeleton matching the public StoreProductCard */
export function StoreProductCardSkeleton() {
  return (
    <div
      aria-busy="true"
      className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700"
    >
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-3 w-1/4" />
      </div>
    </div>
  );
}
