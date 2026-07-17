import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/Button';

export const CalendarToolbar = (props) => {
  // Destructure direct built-in event delegates from react-big-calendar context
  const { onNavigate, onView, view, label } = props;

  const goToBack = () => { onNavigate('PREV'); };
  const goToNext = () => { onNavigate('NEXT'); };
  const goToCurrent = () => { onNavigate('TODAY'); };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800/80 mb-4">
      <div className="flex items-center gap-1.5">
        <Button variant="secondary" className="px-3 py-1.5 h-9 text-xs" onClick={goToCurrent}>
          Today
        </Button>
        <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden shadow-soft-sm">
          <button 
            onClick={goToBack} 
            className="p-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border-r border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
            type="button"
          >
            <ChevronLeft size={16} />
          </button>
          <button 
            onClick={goToNext} 
            className="p-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
            type="button"
          >
            <ChevronRight size={16} />
          </button>
        </div>
        <h2 className="text-sm font-bold text-text-primary-light dark:text-white ml-2 tracking-tight">
          {label}
        </h2>
      </div>

      <div className="bg-slate-100 dark:bg-slate-950 p-1 rounded-lg border border-slate-200 dark:border-slate-800 flex gap-0.5 shadow-inner">
        {['month', 'week', 'day', 'agenda'].map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => onView(v)}
            className={`px-3 py-1.5 rounded-md text-[11px] font-semibold capitalize transition-all ${
              view === v
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-white shadow-soft-sm border border-slate-200/40 dark:border-slate-700/30'
                : 'text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-white'
            }`}
          >
            {v}
          </button>
        ))}
      </div>
    </div>
  );
};