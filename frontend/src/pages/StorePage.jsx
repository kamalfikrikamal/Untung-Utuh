import { useState, useMemo, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useStoreBySlug } from '@/hooks/useStore';
import { useInfiniteProducts } from '@/hooks/useProducts';
import { useDebounce } from '@/hooks/useDebounce';
import { useTrackEvent } from '@/hooks/useAnalytics';
import StoreHeader from '@/components/store/StoreHeader';
import StoreProductCard from '@/components/store/StoreProductCard';
import ProductDetailModal from '@/components/store/ProductDetailModal';
import { StoreProductCardSkeleton } from '@/components/ui/Skeleton';

const CATEGORIES = [
  'electronics',
  'fashion',
  'food',
  'health',
  'home',
  'sports',
  'toys',
  'other',
];

const SKELETON_ITEMS = Array.from({ length: 8 }, (_, i) => `skeleton-${i + 1}`);
const NEXT_SKELETON_ITEMS = Array.from({ length: 4 }, (_, i) => `next-skeleton-${i + 1}`);

export default function StorePage() {
  const { slug } = useParams();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const debouncedSearch = useDebounce(search, 350);
  const sentinelRef = useRef(null);

  const {
    data: storeData,
    isLoading: storeLoading,
    isError: storeError,
  } = useStoreBySlug(slug);
  const store = storeData?.store ?? null;

  // Track store page view once the store is resolved
  useTrackEvent({ storeId: store?._id ?? null, eventType: 'view' });

  const queryParams = useMemo(() => {
    if (!store) return null;
    return {
      store: store._id,
      isActive: 'true',
      ...(debouncedSearch && { search: debouncedSearch }),
      ...(category && { category }),
    };
  }, [store, debouncedSearch, category]);

  const {
    data,
    isLoading: productsLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteProducts(queryParams);

  const products = data?.pages.flatMap((p) => p.data.products) ?? [];

  // Infinite scroll — watch sentinel element at the bottom of the list
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: '200px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (storeLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-slate-400">
        Loading store…
      </div>
    );
  }

  if (storeError || !store) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3 text-slate-400">
        <span className="text-4xl">🔍</span>
        <p>Store not found.</p>
      </div>
    );
  }

  let productGrid;
  if (productsLoading) {
    productGrid = (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {SKELETON_ITEMS.map((id) => (
          <StoreProductCardSkeleton key={id} />
        ))}
      </div>
    );
  } else if (products.length === 0) {
    productGrid = (
      <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-500">
        <span className="text-4xl">🔍</span>
        <p>No products found.</p>
      </div>
    );
  } else {
    productGrid = (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((p) => (
            <StoreProductCard
              key={p._id}
              product={p}
              onClick={() => setSelectedProduct(p)}
            />
          ))}

          {/* Skeleton cards appended while loading the next page */}
          {isFetchingNextPage &&
            NEXT_SKELETON_ITEMS.map((id) => (
              <StoreProductCardSkeleton key={id} />
            ))}
        </div>

        {/* Invisible sentinel — triggers next page fetch when visible */}
        <div ref={sentinelRef} aria-hidden="true" className="h-1" />

        {!hasNextPage && products.length > 0 && (
          <p className="text-center text-slate-600 text-sm pb-4">
            Semua produk sudah ditampilkan
          </p>
        )}
      </>
    );
  }

  return (
    <div className="space-y-8">
      <StoreHeader store={store} />

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products…"
          className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Product grid */}
      {productGrid}

      {/* Product detail modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        whatsapp={store.whatsapp}
        storeId={store._id}
      />
    </div>
  );
}

