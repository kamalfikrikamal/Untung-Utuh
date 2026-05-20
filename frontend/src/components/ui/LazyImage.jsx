import { useRef, useState, useEffect } from 'react';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

/**
 * Inserts Cloudinary URL transformations for network-aware quality.
 * Works by replacing/inserting between /upload/ and the rest of the path.
 */
function optimizeCloudinaryUrl(url, { isSlowConnection, isMediumConnection }) {
  if (!url?.includes('res.cloudinary.com')) return url;
  const quality = isSlowConnection ? 'q_30,w_400' : isMediumConnection ? 'q_60,w_800' : 'q_auto:good';
  const transform = `f_auto,${quality}`;
  // Insert after /upload/, replacing any existing eager transformation block
  const [base, rest] = url.split('/upload/');
  if (!rest) return url;
  // If rest starts with a named transformation (letters/numbers/underscore + /)
  // keep it; otherwise strip the first segment if it looks like a transformation
  const cleaned = rest.replace(/^(?:[a-z][a-z0-9_,:.]+\/)+(?=v?\d+\/)/, '');
  return `${base}/upload/${transform}/${cleaned}`;
}

/**
 * Image that loads only when it enters the viewport (Intersection Observer).
 * Shows an animated skeleton placeholder until the image is loaded.
 * Automatically reduces Cloudinary image quality on slow connections.
 */
export default function LazyImage({ src, alt, className = '', imgClassName = '' }) {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible]   = useState(false);
  const [isLoaded,  setIsLoaded]    = useState(false);
  const [hasError,  setHasError]    = useState(false);

  const { isSlowConnection, isMediumConnection } = useNetworkStatus();

  // Larger rootMargin on fast connections = pre-load before entering viewport
  const rootMargin = isSlowConnection ? '0px' : '300px';

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.01, rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  const optimizedSrc = src
    ? optimizeCloudinaryUrl(src, { isSlowConnection, isMediumConnection })
    : src;

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      {/* Skeleton shown until image is loaded */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-slate-700 animate-pulse" aria-hidden="true" />
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-700 text-slate-500 text-3xl">
          📷
        </div>
      )}

      {/* Actual image — only rendered when in viewport */}
      {isVisible && src && !hasError && (
        <img
          src={optimizedSrc}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${imgClassName}`}
          decoding="async"
        />
      )}
    </div>
  );
}
