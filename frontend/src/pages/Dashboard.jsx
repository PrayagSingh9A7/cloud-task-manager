import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { StatCard } from '../components/StatCard';
import { TaskCard } from '../components/TaskCard';
import { QuickActions } from '../components/QuickActions';
import { RecentActivity } from '../components/RecentActivity';
import { TaskModal } from '../components/TaskModal';
import { taskAPI, analyticsAPI } from '../services/api';
import { CheckCircle, FolderKanban, AlertCircle, BarChart } from 'lucide-react';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [metrics, setMetrics] = useState({ total: 0, completed: 0, todo: 0, overdue: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const taskRes = await taskAPI.getTasks({ search, status: statusFilter });
      setTasks(taskRes.data);
      const metricsRes = await analyticsAPI.getSummary();
      setMetrics(metricsRes.data);
    } catch (err) {
      console.error('Error fetching dashboard data.', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [search, statusFilter]);

  const handleCreateTask = async (data) => {
    await taskAPI.createTask(data);
    fetchDashboardData();
  };

  const handleStatusChange = async (id, status) => {
    await taskAPI.patchStatus(id, status);
    fetchDashboardData();
  };

  const handleDelete = async (id) => {
    await taskAPI.deleteTask(id);
    fetchDashboardData();
  };

  const handleDuplicate = async (id) => {
    await taskAPI.duplicateTask(id);
    fetchDashboardData();
  };

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary-light dark:text-white">Dashboard</h1>
          <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-0.5">
            Overview of your personal tasks and performance metrics
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Tasks" value={metrics.total} icon={BarChart} color="indigo" />
          <StatCard title="Pending Queue" value={metrics.todo + metrics.inProgress} icon={FolderKanban} color="yellow" />
          <StatCard title="Completed" value={metrics.completed} icon={CheckCircle} color="green" />
          <StatCard title="Overdue" value={metrics.overdue} icon={AlertCircle} color="red" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Main Workspace Array */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex gap-3 bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-soft-sm">
              <input
                type="text"
                placeholder="Search tasks..."
                className="bg-transparent text-sm w-full focus:outline-none px-2 text-text-primary-light dark:text-white"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs px-2.5 py-1 text-text-primary-light dark:text-white"
              >
                <option value="">All Statuses</option>
                <option value="todo">Todo</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map(n => (
                  <div key={n} className="h-32 bg-slate-200/60 dark:bg-slate-800/60 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tasks.map(task => (
                  <TaskCard 
                    key={task._id} 
                    task={task} 
                    onStatusChange={handleStatusChange} 
                    onDelete={handleDelete}
                    onDuplicate={handleDuplicate}
                  />
                ))}
              </div>
            )}

            {!loading && tasks.length === 0 && (
              <div className="text-center py-16 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900/40">
                <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm">No tasks found matching your filters.</p>
              </div>
            )}
          </div>

          {/* Action Panels */}
          <div className="space-y-6">
            <QuickActions onOpenModal={() => setIsModalOpen(true)} onRefresh={fetchDashboardData} />
            <RecentActivity tasks={tasks} />
          </div>
        </div>
      </div>

      <TaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleCreateTask} />
    </Layout>
  );
}