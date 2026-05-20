import api from '@/utils/api';

/**
 * Fire-and-forget — sends an analytics event to the backend.
 * Errors are silently swallowed; tracking must never break the UX.
 */
export async function trackEvent({ storeId, productId = null, eventType }) {
  try {
    await api.post('/analytics/track', { storeId, productId, eventType });
  } catch {
    // Intentionally silent — analytics failures must not surface to users
  }
}

/**
 * Fetch aggregated analytics summary for a store (owner only).
 * @param {string} storeId
 * @param {{ startDate?: string, endDate?: string, granularity?: 'daily'|'weekly' }} params
 */
export async function fetchSummary(storeId, params = {}) {
  const res = await api.get('/analytics/summary', { params: { storeId, ...params } });
  return res.data;
}
