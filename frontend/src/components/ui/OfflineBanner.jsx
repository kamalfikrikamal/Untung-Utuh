import { useNetworkStatus } from '@/hooks/useNetworkStatus';

/**
 * Sticky banner shown at the top of the page when the device is offline.
 */
export default function OfflineBanner() {
  const { isOnline } = useNetworkStatus();
  if (isOnline) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="fixed top-0 inset-x-0 z-50 flex items-center justify-center gap-2 bg-red-600 text-white text-sm font-medium py-2 px-4 shadow-lg"
    >
      <span aria-hidden="true">📡</span>
      <span>Anda sedang offline — beberapa fitur mungkin tidak tersedia</span>
    </div>
  );
}
