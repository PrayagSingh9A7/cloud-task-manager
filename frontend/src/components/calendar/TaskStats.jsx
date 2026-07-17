import React from 'react';
import { Card } from '../ui/Card';
import { CheckCircle2, Calendar, Clock, AlertTriangle, Percent } from 'lucide-react';

export const TaskStats = React.memo(({ events }) => {
  const stats = React.useMemo(() => {
    const now = new Date();
    let todayCount = 0;
    let upcomingCount = 0;
    let completedCount = 0;
    let overdueCount = 0;

    events.forEach(evt => {
      const dueDate = new Date(evt.start);
      if (isNaN(dueDate.getTime())) return;

      const isToday = dueDate.toDateString() === now.toDateString();
      const isCompleted = evt.resource?.status === 'completed';
      const isOverdue = !isCompleted && dueDate < now && !isToday;

      if (isToday) todayCount++;
      if (dueDate > now && !isToday) upcomingCount++;
      if (isCompleted) completedCount++;
      if (isOverdue) overdueCount++;
    });

    const completionRate = events.length > 0 ? Math.round((completedCount / events.length) * 100) : 0;

    return { todayCount, upcomingCount, completedCount, overdueCount, completionRate };
  }, [events]);

  const cards = [
    { title: "Today's Focus", value: stats.todayCount, icon: Calendar, color: "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10" },
    { title: "Upcoming", value: stats.upcomingCount, icon: Clock, color: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10" },
    { title: "Completed", value: stats.completedCount, icon: CheckCircle2, color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10" },
    { title: "Overdue", value: stats.overdueCount, icon: AlertTriangle, color: "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10" },
    { title: "Completion Rate", value: `${stats.completionRate}%`, icon: Percent, color: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <Card key={idx} className="p-4 shadow-soft-sm hover:shadow-soft-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-text-secondary-light dark:text-text-secondary-dark tracking-wider uppercase block">{card.title}</span>
              <div className={`p-1.5 rounded-md ${card.color}`}>
                <Icon size={14} />
              </div>
            </div>
            <h3 className="text-xl font-bold tracking-tight text-text-primary-light dark:text-white mt-2">{card.value}</h3>
          </Card>
        );
      })}
    </div>
  );
});

TaskStats.displayName = 'TaskStats';