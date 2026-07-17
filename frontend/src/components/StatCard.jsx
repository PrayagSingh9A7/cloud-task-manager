import React from 'react';
import { Card } from './ui/Card';

export const StatCard = ({ title, value, icon: Icon, color = 'indigo' }) => {
  const colorMaps = {
    indigo: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10',
    green: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10',
    yellow: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10',
    red: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10'
  };

  return (
    <Card className="flex items-center justify-between shadow-soft-sm">
      <div className="space-y-1">
        <span className="text-xs font-semibold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider">
          {title}
        </span>
        <h3 className="text-2xl font-bold tracking-tight text-text-primary-light dark:text-white">
          {value}
        </h3>
      </div>
      <div className={`p-3 rounded-lg ${colorMaps[color]}`}>
        <Icon size={20} />
      </div>
    </Card>
  );
};