import React from 'react';
import { Card } from './ui/Card';
import { CheckCircle, PlusCircle } from 'lucide-react';

export const RecentActivity = ({ tasks = [] }) => {
  return (
    <Card>
      <h3 className="font-semibold text-sm text-text-primary-light dark:text-white mb-3">Recent Activity</h3>
      <div className="space-y-3.5">
        {tasks.slice(0, 4).map((task) => (
          <div key={task._id} className="flex gap-2.5 items-start text-xs leading-normal">
            <div className="mt-0.5 shrink-0 text-indigo-500 dark:text-indigo-400">
              {task.status === 'completed' ? <CheckCircle size={14} /> : <PlusCircle size={14} />}
            </div>
            <div className="flex-1">
              <p className="text-text-secondary-light dark:text-text-secondary-dark">
                Task <span className="font-medium text-text-primary-light dark:text-white">"{task.title}"</span> was {task.status === 'completed' ? 'marked completed' : 'created'}.
              </p>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-0.5">
                {new Date(task.updatedAt || task.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        {tasks.length === 0 && (
          <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-4">No recent activity found.</p>
        )}
      </div>
    </Card>
  );
};