import React from 'react';

export const EventCard = ({ event }) => {
  const { title, resource } = event;

  const priorityBadges = {
    high: 'bg-red-500/20 text-red-700 dark:text-red-300 border-red-400/30',
    medium: 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-400/30',
    low: 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-400/30'
  };

  const statusBadges = {
    todo: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    'in-progress': 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    completed: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 line-through',
    archived: 'bg-slate-500/10 text-slate-600 dark:text-slate-400'
  };

  const timeString = event.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="flex flex-col h-full justify-between p-1 overflow-hidden space-y-1">
      <div className="flex items-start justify-between gap-1">
        <span className={`font-semibold tracking-tight block text-[11px] leading-tight truncate ${resource?.status === 'completed' ? 'line-through opacity-60' : ''}`}>
          {title}
        </span>
        <span className="text-[9px] font-medium shrink-0 opacity-75">{timeString}</span>
      </div>

      <div className="flex flex-wrap gap-1 items-center mt-auto">
        <span className={`text-[9px] px-1 rounded-sm border capitalize font-medium ${priorityBadges[resource?.priority || 'medium']}`}>
          {resource?.priority}
        </span>
        <span className={`text-[9px] px-1 rounded-sm capitalize font-medium ${statusBadges[resource?.status || 'todo']}`}>
          {resource?.status}
        </span>
        <span className="text-[9px] text-text-secondary-light dark:text-slate-400 max-w-[50px] truncate bg-black/5 dark:bg-white/5 px-1 rounded-sm">
          {resource?.category}
        </span>
      </div>
    </div>
  );
};