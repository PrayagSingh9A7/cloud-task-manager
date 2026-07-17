import React from 'react';
import { Input } from '../ui/Input';
import { Search, SlidersHorizontal } from 'lucide-react';

export const CalendarFilters = React.memo(({ filters, onFilterChange }) => {
  return (
    <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-soft-sm flex flex-col md:flex-row gap-3 items-center">
      <div className="relative w-full md:flex-1">
        <Search className="absolute left-3 top-3.5 text-slate-400" size={16} />
        <Input 
          className="pl-9 w-full py-2 bg-slate-50 dark:bg-slate-950" 
          placeholder="Filter schedule by keyword..." 
          value={filters.search}
          onChange={(e) => onFilterChange('search', e.target.value)}
        />
      </div>
      <div className="flex w-full md:w-auto items-center gap-2">
        <SlidersHorizontal size={14} className="text-slate-400 ml-1 hidden md:block" />
        <select 
          value={filters.priority}
          onChange={(e) => onFilterChange('priority', e.target.value)}
          className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs px-3 py-2 text-text-primary-light dark:text-white focus:ring-2 focus:ring-indigo-500/20"
        >
          <option value="">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <select 
          value={filters.status}
          onChange={(e) => onFilterChange('status', e.target.value)}
          className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs px-3 py-2 text-text-primary-light dark:text-white focus:ring-2 focus:ring-indigo-500/20"
        >
          <option value="">All Statuses</option>
          <option value="todo">Todo</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="archived">Archived</option>
        </select>
        <Input 
          className="py-1.5 px-2 bg-slate-50 dark:bg-slate-950 text-xs max-w-[130px]" 
          placeholder="Category..."
          value={filters.category}
          onChange={(e) => onFilterChange('category', e.target.value)}
        />
      </div>
    </div>
  );
});

CalendarFilters.displayName = 'CalendarFilters';