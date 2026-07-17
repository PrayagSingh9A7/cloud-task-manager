import React from 'react';

export const Select = React.forwardRef(({ options = [], className = '', ...props }, ref) => {
  return (
    <select
      ref={ref}
      className={`px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${className}`}
      {...props}
    >
      {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
    </select>
  );
});
Select.displayName = 'Select';