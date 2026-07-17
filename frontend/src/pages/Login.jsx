import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export default function Login() {
  const { register, handleSubmit, setError, formState: { errors } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (data) => {
    try {
      await login(data.email, data.password);
      navigate('/');
    } catch (err) {
      setError('root', { message: err.response?.data?.message || 'Invalid email or password.' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-light dark:bg-bg-dark px-4 transition-colors">
      <div className="w-full max-w-md bg-card-light dark:bg-card-dark p-8 rounded-2xl shadow-soft-lg border border-slate-200/60 dark:border-slate-800/80">
        <div className="text-center mb-8">
          <div className="h-10 w-10 bg-indigo-600 dark:bg-indigo-500 rounded-xl mx-auto flex items-center justify-center text-white text-lg font-black shadow-soft-sm mb-3">
            T
          </div>
          <h2 className="text-xl font-bold tracking-tight text-text-primary-light dark:text-white">Welcome back</h2>
          <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-1.5">
            Sign in to manage your cloud tasks
          </p>
        </div>

        {errors.root && (
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-xs p-3 rounded-lg mb-4 text-center font-medium">
            {errors.root.message}
          </div>
        )}

        <form onSubmit={handleSubmit(handleLogin)} className="space-y-4.5">
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-text-secondary-light dark:text-text-secondary-dark">Email Address</label>
            <Input 
              type="email" 
              {...register('email', { required: true })} 
              placeholder="Enter your email address"
              autoComplete="username"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-text-secondary-light dark:text-text-secondary-dark">Password</label>
            <Input 
              type="password" 
              {...register('password', { required: true })} 
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </div>
          <Button type="submit" className="w-full py-2.5 mt-4">Sign In</Button>
        </form>

        <p className="text-xs text-center text-text-secondary-light dark:text-text-secondary-dark mt-6">
          Don't have an account? <Link to="/register" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}