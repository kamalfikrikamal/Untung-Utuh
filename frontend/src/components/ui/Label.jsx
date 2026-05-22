import React from 'react';
import PropTypes from 'prop-types';
import { cn } from '../../utils/cn';

const Label = React.forwardRef(({ className, children, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700",
      className
    )}
    {...props}
  >
    {children}
  </label>
));

Label.displayName = 'Label';
Label.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

export { Label };
