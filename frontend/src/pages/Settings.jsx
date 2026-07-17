import React from 'react';
import { Layout } from '../components/Layout';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useForm } from 'react-hook-form';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Settings() {
  const { user, setUser } = useAuth();
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm({
    defaultValues: {
      name: user?.name,
    }
  });

  const handleUpdate = async (data) => {
    try {
      const res = await authAPI.updateProfile({
        name: data.name,
        currentPassword: data.currentPassword || undefined,
        newPassword: data.newPassword || undefined
      });
      setUser(res.data.user);
      alert('Profile configurations updated successfully.');
      reset({ currentPassword: '', newPassword: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update preferences.');
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary-light dark:text-white">Settings</h1>
          <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-0.5">
            Manage your user profile configuration preferences
          </p>
        </div>

        <Card>
          <h3 className="font-semibold text-sm text-text-primary-light dark:text-white mb-4">Profile Information</h3>
          <form onSubmit={handleSubmit(handleUpdate)} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-text-secondary-light dark:text-text-secondary-dark">Full Name</label>
              <Input type="text" {...register('name', { required: true })} />
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800/80 pt-5 mt-6">
              <h4 className="text-sm font-semibold text-text-primary-light dark:text-white mb-3">Security & Password</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-text-secondary-light dark:text-text-secondary-dark">Current Password</label>
                  <Input type="password" {...register('currentPassword')} placeholder="••••••••" />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-text-secondary-light dark:text-text-secondary-dark">New Password</label>
                  <Input type="password" {...register('newPassword')} placeholder="••••••••" />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <Button type="submit" size="sm" disabled={isSubmitting}>
                {isSubmitting ? 'Saving changes...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </Layout>
  );
}