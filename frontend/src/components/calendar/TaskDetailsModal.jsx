import React from 'react';
import { X, Calendar, Tag, ShieldAlert, CheckSquare, Trash2, Copy, FileText, Check } from 'lucide-react';
import { Button } from '../ui/Button';

export const TaskDetailsModal = ({ isOpen, onClose, event, onStatusChange, onDelete, onDuplicate }) => {
  if (!isOpen || !event) return null;

  const { title, description, start, end, resource, id } = event;

  const priorityColors = {
    high: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/30',
    medium: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/30',
    low: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/30'
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-card-light dark:bg-card-dark border border-slate-200 dark:border-slate-800 w-full max-w-lg rounded-xl shadow-soft-lg overflow-hidden p-6 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header Drawer */}
        <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
          <div className="space-y-1">
            <h3 className="font-bold text-base text-text-primary-light dark:text-white tracking-tight">{title}</h3>
            <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-md font-medium">
              ID: {id?.slice(0,8) || 'Cloudant Node'}
            </span>
          </div>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Content Matrix Container */}
        <div className="space-y-4 text-sm text-text-primary-light dark:text-slate-200">
          <div className="flex items-start gap-2.5">
            <FileText size={16} className="text-slate-400 mt-0.5 shrink-0" />
            <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-slate-100 dark:border-slate-800/60 w-full">
              <p className="text-xs leading-relaxed text-text-secondary-light dark:text-text-secondary-dark font-normal">
                {resource?.description || description || "No deep description logs appended to this task node."}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-800/80 pt-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs">
                <ShieldAlert size={14} className="text-slate-400" />
                <span className="text-text-secondary-light dark:text-slate-400 font-medium">Priority Matrix:</span>
                <span className={`px-2 py-0.5 rounded border text-[10px] capitalize font-bold ${priorityColors[resource?.priority || 'medium']}`}>
                  {resource?.priority}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <CheckSquare size={14} className="text-slate-400" />
                <span className="text-text-secondary-light dark:text-slate-400 font-medium">Status Array:</span>
                <span className="capitalize font-semibold text-xs text-indigo-500">{resource?.status}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs">
                <Tag size={14} className="text-slate-400" />
                <span className="text-text-secondary-light dark:text-slate-400 font-medium">Category Domain:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-100">{resource?.category}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Calendar size={14} className="text-slate-400" />
                <span className="text-text-secondary-light dark:text-slate-400 font-medium">Due Horizon:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-100">{start.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls Matrix Footer */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-5 border-t border-slate-100 dark:border-slate-800 mt-6">
          <div className="flex gap-1.5">
            <Button 
              variant="secondary" 
              size="sm" 
              className="text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 border-slate-200 dark:border-slate-700" 
              onClick={() => { onDelete(id); onClose(); }}
            >
              <Trash2 size={14} />
              <span>Delete</span>
            </Button>
            <Button variant="secondary" size="sm" onClick={() => { onDuplicate(id); onClose(); }}>
              <Copy size={14} />
              <span>Duplicate</span>
            </Button>
          </div>
          
          <div className="flex gap-1.5">
            {resource?.status !== 'completed' && (
              <Button variant="primary" size="sm" className="bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500" onClick={() => { onStatusChange(id, 'completed'); onClose(); }}>
                <Check size={14} strokeWidth={3} />
                <span>Mark Complete</span>
              </Button>
            )}
            <Button variant="secondary" size="sm" onClick={onClose}>Dismiss</Button>
          </div>
        </div>

      </div>
    </div>
  );
};