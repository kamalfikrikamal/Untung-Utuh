import React from 'react';
import PropTypes from 'prop-types';
import { cn } from '../../utils/cn';

function Skeleton({ className, ...props }) {
  return (
    <div
      aria-hidden="true"
      className={cn("animate-pulse rounded-md bg-gray-200", className)}
      {...props}
    />
  );
}

Skeleton.propTypes = {
  className: PropTypes.string,
};

function ProductCardSkeleton() {
  return (
    <div aria-busy="true" className="flex flex-col gap-2">
      <Skeleton className="h-40 w-full rounded-xl" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  );
}

function StoreProductCardSkeleton() {
  return (
    <div aria-busy="true" className="flex flex-col gap-2">
      <Skeleton className="h-48 w-full rounded-xl" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  );
}

export { Skeleton, ProductCardSkeleton, StoreProductCardSkeleton };
