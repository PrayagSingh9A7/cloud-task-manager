import React from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Plus, RefreshCw } from 'lucide-react';

export const QuickActions = ({ onOpenModal, onRefresh }) => {
  return (
    <Card>
      <h3 className="font-semibold text-sm text-text-primary-light dark:text-white mb-3">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-2">
        <Button onClick={onOpenModal} variant="primary" size="sm" className="w-full py-2.5">
          <Plus size={16} />
          <span>New Task</span>
        </Button>
        <Button onClick={onRefresh} variant="secondary" size="sm" className="w-full py-2.5">
          <RefreshCw size={14} />
          <span>Sync View</span>
        </Button>
      </div>
    </Card>
  );
};