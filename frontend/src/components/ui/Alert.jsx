import React from 'react';
import PropTypes from 'prop-types';
import { cn } from '../../utils/cn';
import { AlertCircle, CheckCircle2, Info, XCircle } from 'lucide-react';

const Alert = React.forwardRef(({ className, variant = 'info', title, children, ...props }, ref) => {
  const variants = {
    info: 'bg-blue-50 text-blue-800 border-blue-200',
    success: 'bg-green-50 text-green-800 border-green-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    error: 'bg-red-50 text-red-800 border-red-200',
  };

  const icons = {
    info: <Info className="h-4 w-4" />,
    success: <CheckCircle2 className="h-4 w-4" />,
    warning: <AlertCircle className="h-4 w-4" />,
    error: <XCircle className="h-4 w-4" />,
  };

  return (
    <div
      ref={ref}
      role="alert"
      className={cn(
        "relative w-full rounded-lg border p-4 shadow-soft [&>svg]:absolute [&>svg]:text-foreground [&>svg]:left-4 [&>svg]:top-4 [&>svg+div]:translate-y-[-3px] [&>svg~*]:pl-10",
        variants[variant],
        className
      )}
      {...props}
    >
      {icons[variant]}
      {title && <h5 className="mb-1 font-medium leading-none tracking-tight">{title}</h5>}
      <div className="text-sm opacity-90">{children}</div>
    </div>
  );
});

Alert.displayName = 'Alert';
Alert.propTypes = {
  className: PropTypes.string,
  variant: PropTypes.oneOf(['info', 'success', 'warning', 'error']),
  title: PropTypes.string,
  children: PropTypes.node,
};

export { Alert };
