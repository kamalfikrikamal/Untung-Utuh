import React from 'react';
import PropTypes from 'prop-types';
import { cn } from '../../utils/cn';

function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-gray-200", className)}
      {...props}
    />
  );
}

Skeleton.propTypes = {
  className: PropTypes.string,
};

export { Skeleton };
