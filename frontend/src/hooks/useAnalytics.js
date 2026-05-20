import { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { trackEvent, fetchSummary } from '@/services/analyticsService';

/**
 * Fires a single analytics event once when the component mounts.
 * Duplicate calls within the same mount are prevented via a ref.
 *
 * @param {{ storeId: string|null, productId?: string|null, eventType: 'view'|'click'|'wa_order' }} params
 */
export function useTrackEvent({ storeId, productId = null, eventType }) {
  const firedRef = useRef(false);

  useEffect(() => {
    if (!storeId || firedRef.current) return;
    firedRef.current = true;
    trackEvent({ storeId, productId, eventType });
  }, [storeId, productId, eventType]);
}

/**
 * Fetches the analytics summary for a store.
 * Only runs when storeId is provided (owner dashboard context).
 */
export function useAnalyticsSummary(storeId, params = {}) {
  return useQuery({
    queryKey: ['analytics', 'summary', storeId, params],
    queryFn: () => fetchSummary(storeId, params),
    enabled: !!storeId,
    staleTime: 1000 * 60 * 5, // 5 minutes — summaries don't need to be live
    select: (data) => data.data,
  });
}
