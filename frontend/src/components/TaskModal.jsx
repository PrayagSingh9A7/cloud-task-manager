import React from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { Input } from './ui/Input';
import { Button } from './ui/Button';

export const TaskModal = ({ isOpen, onClose, onSubmit }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  if (!isOpen) return null;

  const handleFormSubmit = (data) => {
    onSubmit(data);
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm flex items-center justify-center定位 z-50 p-4">
      <div className="bg-card-light dark:bg-card-dark border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-xl shadow-soft-lg overflow-hidden p-6 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3.5 mb-4">
          <h3 className="font-bold text-base text-text-primary-light dark:text-white">Create New Task</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-text-secondary-light dark:text-text-secondary-dark mb-1">Title</label>
            <Input {...register('title', { required: true })} placeholder="e.g., Update system documentation" />
            {errors.title && <span className="text-xs text-red-500 mt-1 block">Title is required.</span>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-secondary-light dark:text-text-secondary-dark mb-1">Description</label>
            <textarea 
              {...register('description')}
              rows={3} 
              className="w-full px-3.5 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 dark:text-white placeholder-slate-400 text-sm"
              placeholder="Provide a brief summary of the task..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text-secondary-light dark:text-text-secondary-dark mb-1">Priority</label>
              <select {...register('priority')} className="w-full p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm text-slate-950 dark:text-white">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary-light dark:text-text-secondary-dark mb-1">Category</label>
              <Input {...register('category', { required: true })} placeholder="Engineering" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-secondary-light dark:text-text-secondary-dark mb-1">Due Date</label>
            <Input type="date" {...register('dueDate', { required: true })} />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800 mt-2">
            <Button type="button" variant="secondary" size="sm" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="primary" size="sm">Create Task</Button>
          </div>
        </form>
      </div>
    </div>
  );
};