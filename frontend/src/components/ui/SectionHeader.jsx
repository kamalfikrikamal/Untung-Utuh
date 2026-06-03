import PropTypes from 'prop-types';

/**
 * Shared section header — used across Landing, Fitur, Pricing, TentangKami.
 * Renders: small uppercase badge → h2 title → optional subtitle.
 *
 * Defaults to centered; pass `className="text-left"` for left-aligned (as in Fitur).
 */
export default function SectionHeader({ badge, title, subtitle, badgeClassName, className }) {
  const isLeft = className?.includes('text-left');

  return (
    <div className={`mb-16 ${className || 'text-center'}`}>
      {badge && (
        <span
          className={`text-xs font-bold uppercase tracking-[0.15em] ${
            badgeClassName || 'text-primary-600'
          }`}
        >
          {badge}
        </span>
      )}
      <h2
        className={`mt-3 text-3xl sm:text-4xl font-bold text-gray-900 ${
          className?.includes('text-left') ? 'text-2xl sm:text-3xl' : ''
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-4 text-gray-500 text-lg leading-relaxed ${
            isLeft ? 'max-w-2xl' : 'max-w-xl mx-auto font-light'
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

SectionHeader.propTypes = {
  badge: PropTypes.string,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  badgeClassName: PropTypes.string,
  className: PropTypes.string,
};
