import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { cn } from '../../utils/cn';

/**
 * FadeInSection — wraps children with a fade-in + slide-up animation
 * triggered when the element scrolls into view.
 *
 * Usage:
 *   <FadeInSection delay={200}>
 *     <YourContent />
 *   </FadeInSection>
 */
export default function FadeInSection({ children, className, delay = 0, threshold = 0.1 }) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div
      ref={ref}
      className={cn(
        'transition-all duration-700',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
        className,
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

FadeInSection.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  delay: PropTypes.number,
  threshold: PropTypes.number,
};
