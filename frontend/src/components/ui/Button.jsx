import React from 'react';
import PropTypes from 'prop-types';
import { cn } from '../../utils/cn';

const Button = React.forwardRef(({ className, variant = 'default', size = 'default', isLoading, children, ...props }, ref) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-200 cursor-pointer hover:-translate-y-0.5 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:pointer-events-none disabled:opacity-50';
  
  const variants = {
    default: 'bg-primary-600 text-white hover:bg-primary-700 shadow-soft hover:shadow-lg',
    outline: 'border border-primary-600 text-primary-600 hover:bg-primary-50 hover:shadow-soft',
    ghost: 'hover:bg-primary-50 text-primary-600',
    danger: 'bg-red-600 text-white hover:bg-red-700 shadow-soft hover:shadow-lg',
  };

  const sizes = {
    default: 'h-10 px-4 py-2',
    sm: 'h-8 rounded-sm px-3 text-xs',
    lg: 'h-12 rounded-lg px-8 text-base',
    icon: 'h-10 w-10',
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      ref={ref}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : null}
      {children}
    </button>
  );
});

Button.displayName = 'Button';
Button.propTypes = {
  className: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'outline', 'ghost', 'danger']),
  size: PropTypes.oneOf(['default', 'sm', 'lg', 'icon']),
  isLoading: PropTypes.bool,
  disabled: PropTypes.bool,
  children: PropTypes.node,
};

export { Button };
