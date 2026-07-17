import React from 'react';

export const Input = React.forwardRef(({ className = '', ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={`input-premium text-slate-900 dark:text-white ${className}`}
      {...props}
    />
  );
});
Input.displayName = 'Input';