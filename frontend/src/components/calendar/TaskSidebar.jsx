import React from 'react';
import { Card } from '../ui/Card';
import { Clock, CheckCircle2, Circle } from 'lucide-react';

export const TaskSidebar = React.memo(({ events, onSelectEvent }) => {
  const upcomingTasks = React.useMemo(() => {
    const now = new Date();
    return events
      .filter(evt => new Date(evt.start) >= now && evt.resource?.status !== 'completed')
      .sort((a, b) => new Date(a.start) - new Date(b.start))
      .slice(0, 5);
  }, [events]);

  const priorityColors = {
    high: 'border-red-500 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400',
    medium: 'border-amber-500 bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400',
    low: 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400'
  };

  return (
    <div className="space-y-4 w-full lg:w-64 shrink-0">
      <Card className="p-4 bg-slate-50/50 dark:bg-slate-900/30">
        <h3 className="text-xs font-bold tracking-wider text-text-secondary-light dark:text-text-secondary-dark uppercase mb-3 flex items-center gap-1.5">
          <Clock size={12} /> Upcoming Agenda
        </h3>
        <div className="space-y-2.5">
          {upcomingTasks.map(task => (
            <div 
              key={task.id} 
              onClick={() => onSelectEvent(task)}
              className={`p-3 rounded-lg border-l-4 border shadow-soft-sm cursor-pointer hover:scale-[1.01] transition-all bg-white dark:bg-slate-900 ${priorityColors[task.resource?.priority || 'medium']}`}
            >
              <h4 className="text-xs font-bold truncate text-slate-800 dark:text-slate-100">{task.title}</h4>
              <div className="flex justify-between items-center text-[10px] mt-1.5 text-text-secondary-light dark:text-text-secondary-dark">
                <span className="capitalize">{task.resource?.category}</span>
                <span>{task.start.toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
              </div>
            </div>
          ))}
          {upcomingTasks.length === 0 && (
            <p className="text-xs text-center text-slate-400 dark:text-slate-500 py-6 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg">No pending agenda items.</p>
          )}
        </div>
      </Card>
    </div>
  );
});

TaskSidebar.displayName = 'TaskSidebar';