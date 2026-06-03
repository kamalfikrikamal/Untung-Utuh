import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { cn } from '../../utils/cn';
import { ChevronDown } from 'lucide-react';

/**
 * LegalPageLayout — two-column layout for long-form legal/static pages.
 *
 * - LHS: sticky Table-of-Contents sidebar (becomes dropdown on mobile)
 * - RHS: long-form content area with prose styling
 *
 * Usage:
 *   <LegalPageLayout
 *     badge="Kebijakan Privasi"
 *     title="Kebijakan Privasi"
 *     lastUpdated="4 Juni 2026"
 *     sections={sections}
 *   >
 *     <h2 data-section-id="informasi-yang-dikumpulkan">1. Informasi yang Dikumpulkan</h2>
 *     ...
 *   </LegalPageLayout>
 */
export default function LegalPageLayout({
  title,
  subtitle,
  lastUpdated,
  sections = [],
  badge,
  children,
  className,
}) {
  const [activeId, setActiveId] = useState(sections[0]?.id || '');
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const headings = document.querySelectorAll('[data-section-id]');
    if (!headings.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.getAttribute('data-section-id') || '');
          }
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0 },
    );

    headings.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [sections]);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveId(id);
    }
    setMobileOpen(false);
  };

  return (
    <div className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* ── Page Header ──────────────────────────────────── */}
        <div className="mb-12">
          {badge && (
            <span className="text-xs font-bold uppercase tracking-[0.15em] text-primary-600 mb-3 block">
              {badge}
            </span>
          )}
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">{title}</h1>
          {subtitle && (
            <p className="mt-3 text-gray-500 text-lg leading-relaxed max-w-2xl">{subtitle}</p>
          )}
          {lastUpdated && (
            <p className="mt-4 text-sm text-gray-400">
              Terakhir diperbarui: <time dateTime={lastUpdated}>{lastUpdated}</time>
            </p>
          )}
        </div>

        {/* ── Two-Column Layout ────────────────────────────── */}
        <div className="flex flex-col lg:flex-row gap-12">
          {/* ═══ Sidebar / Table of Contents ═══ */}
          <aside className="lg:w-64 flex-shrink-0">
            {/* Desktop — sticky sidebar */}
            <nav className="hidden lg:block sticky top-28">
              <h2 className="text-xs font-bold uppercase tracking-[0.1em] text-gray-400 mb-4">
                Daftar Isi
              </h2>
              <ul className="space-y-1">
                {sections.map(({ id, title: sectionTitle }) => (
                  <li key={id}>
                    <button
                      type="button"
                      onClick={() => scrollToSection(id)}
                      className={cn(
                        'text-sm text-left w-full px-3 py-2 rounded-lg transition-colors',
                        activeId === id
                          ? 'bg-primary-50 text-primary-700 font-medium'
                          : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50',
                      )}
                    >
                      {sectionTitle}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Mobile — dropdown accordion */}
            <div className="lg:hidden relative">
              <button
                type="button"
                onClick={() => setMobileOpen((prev) => !prev)}
                className="flex items-center justify-between w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700"
              >
                <span>Daftar Isi</span>
                <ChevronDown
                  className={cn('h-4 w-4 transition-transform', mobileOpen && 'rotate-180')}
                />
              </button>
              {mobileOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-40 overflow-hidden">
                  {sections.map(({ id, title: sectionTitle }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => scrollToSection(id)}
                      className={cn(
                        'block w-full text-left px-4 py-3 text-sm transition-colors border-b border-gray-100 last:border-0',
                        activeId === id
                          ? 'bg-primary-50 text-primary-700 font-medium'
                          : 'text-gray-600 hover:bg-gray-50',
                      )}
                    >
                      {sectionTitle}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </aside>

          {/* ═══ Main Content ═══ */}
          <div className={cn('flex-1 min-w-0', className)}>
            <div className="max-w-3xl prose-content">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

LegalPageLayout.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  lastUpdated: PropTypes.string,
  sections: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    }),
  ),
  badge: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
};
