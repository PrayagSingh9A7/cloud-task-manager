import React from 'react';
import { Card } from './ui/Card';
import { Clock, Copy, Trash2, Check } from 'lucide-react';
import { motion } from 'framer-motion';

export const TaskCard = ({ task, onStatusChange, onDelete, onDuplicate }) => {
  const priorityStyles = {
    low: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-500/20',
    medium: 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200/50 dark:border-amber-500/20',
    high: 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200/50 dark:border-red-500/20'
  };

  const isOverdue = task.status !== 'completed' && new Date(task.dueDate) < new Date();

  return (
    <motion.div layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <Card className="hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-soft-md group">
        <div className="flex justify-between items-start gap-3">
          <div className="space-y-1.5 flex-1">
            <span className={`text-[11px] px-2 py-0.5 font-medium border rounded-full capitalize ${priorityStyles[task.priority]}`}>
              {task.priority} Priority
            </span>
            <h4 className={`font-semibold text-sm tracking-tight ${task.status === 'completed' ? 'line-through text-slate-400 dark:text-slate-500' : 'text-text-primary-light dark:text-text-primary-dark'}`}>
              {task.title}
            </h4>
            <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark line-clamp-2 leading-relaxed">
              {task.description || "No description provided."}
            </p>
          </div>
          
          <button 
            onClick={() => onStatusChange(task._id, task.status === 'completed' ? 'todo' : 'completed')}
            className={`p-1 rounded-md border flex items-center justify-center transition-all shrink-0 ${
              task.status === 'completed' 
                ? 'bg-indigo-600 border-indigo-600 text-white dark:bg-indigo-500 dark:border-indigo-500' 
                : 'border-slate-200 dark:border-slate-700 text-transparent hover:border-slate-300 dark:hover:border-slate-600'
            }`}
            aria-label="Toggle completed status"
          >
            <Check size={14} strokeWidth={3} className={task.status === 'completed' ? 'opacity-100' : 'hover:text-slate-300'} />
          </button>
        </div>

        <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
          <div className="flex items-center gap-3 text-text-secondary-light dark:text-text-secondary-dark">
            <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded font-medium text-[11px]">
              {task.category}
            </span>
            <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-600 dark:text-red-400 font-medium' : ''}`}>
              <Clock size={12} />
              <span>{new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
              {isOverdue && <span className="text-[10px] uppercase font-bold tracking-wider ml-0.5">(Overdue)</span>}
            </div>
          </div>
          
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
            <button 
              onClick={() => onDuplicate(task._id)} 
              className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800"
              title="Duplicate Task"
            >
              <Copy size={14} />
            </button>
            <button 
              onClick={() => onDelete(task._id)} 
              className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800"
              title="Delete Task"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};