import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { Card } from '../components/ui/Card';
import { analyticsAPI } from '../services/api';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

export default function Analytics() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchAnalytics() {
      const res = await analyticsAPI.getSummary();
      setData(res.data);
    }
    fetchAnalytics();
  }, []);

  if (!data) {
    return (
      <Layout>
        <div className="text-text-secondary-light dark:text-text-secondary-dark text-sm animate-pulse">
          Loading analytics visualizations...
        </div>
      </Layout>
    );
  }

  const pieData = Object.keys(data.categoryDistribution).map(key => ({
    name: key,
    value: data.categoryDistribution[key]
  }));

  // Accessible UI Color Palettes
  const COLORS = ['#4F46E5', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary-light dark:text-white">Analytics</h1>
          <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-0.5">
            Visual metrics mapping task completion and distributions
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Area Chart */}
          <Card>
            <h3 className="font-semibold text-sm mb-4 text-text-primary-light dark:text-white">Weekly Productivity Trend</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.weeklyCompletionTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" opacity={0.3}/>
                  <XAxis dataKey="day" stroke="#94A3B8" fontSize={11}/>
                  <YAxis stroke="#94A3B8" fontSize={11}/>
                  <Tooltip />
                  <Area type="monotone" dataKey="completed" stroke="#4F46E5" fillOpacity={0.1} fill="#4F46E5" strokeWidth={2}/>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Bar Chart */}
          <Card>
            <h3 className="font-semibold text-sm mb-4 text-text-primary-light dark:text-white">Task Distribution by Priority</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { name: 'Low', count: data.priorityDistribution.low },
                  { name: 'Medium', count: data.priorityDistribution.medium },
                  { name: 'High', count: data.priorityDistribution.high }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} />
                  <YAxis stroke="#94A3B8" fontSize={11} />
                  <Tooltip />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    <Cell fill="#10B981" />
                    <Cell fill="#F59E0B" />
                    <Cell fill="#EF4444" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Pie Chart */}
          <Card className="lg:col-span-2">
            <h3 className="font-semibold text-sm mb-4 text-text-primary-light dark:text-white">Category Spectrum Breakdown</h3>
            <div className="h-64 flex flex-col md:flex-row items-center justify-around gap-6">
              {pieData.length > 0 ? (
                <>
                  <div className="w-full md:w-1/2 h-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={pieData} innerRadius={60} outerRadius={85} paddingAngle={4} dataKey="value">
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-xs w-full md:w-1/2">
                    {pieData.map((item, idx) => (
                      <div key={item.name} className="flex items-center gap-2">
                        <div className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                        <span className="text-text-secondary-light dark:text-text-secondary-dark font-medium">
                          {item.name}: <span className="text-text-primary-light dark:text-white font-bold">{item.value}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm">Not enough data to parse category charts.</p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
}