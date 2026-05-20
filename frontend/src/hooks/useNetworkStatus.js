import { useState, useEffect } from 'react';

function getConnection() {
  return navigator.connection || navigator.mozConnection || navigator.webkitConnection || null;
}

/**
 * Returns live network status and connection quality.
 *
 * effectiveType: 'slow-2g' | '2g' | '3g' | '4g'
 * isSlowConnection: true for slow-2g / 2g
 * saveData: true when the user has enabled data-saver mode
 */
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(() => navigator.onLine);
  const [effectiveType, setEffectiveType] = useState(
    () => getConnection()?.effectiveType ?? '4g'
  );
  const [saveData, setSaveData] = useState(() => getConnection()?.saveData ?? false);

  useEffect(() => {
    const onOnline  = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);
    const onChange  = () => {
      const conn = getConnection();
      if (!conn) return;
      setEffectiveType(conn.effectiveType ?? '4g');
      setSaveData(conn.saveData ?? false);
    };

    window.addEventListener('online',  onOnline);
    window.addEventListener('offline', onOffline);

    const conn = getConnection();
    conn?.addEventListener('change', onChange);

    return () => {
      window.removeEventListener('online',  onOnline);
      window.removeEventListener('offline', onOffline);
      conn?.removeEventListener('change', onChange);
    };
  }, []);

  return {
    isOnline,
    effectiveType,
    saveData,
    isSlowConnection: ['slow-2g', '2g'].includes(effectiveType) || saveData,
    isMediumConnection: effectiveType === '3g',
  };
}
