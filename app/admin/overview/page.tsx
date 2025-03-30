'use client';

import { useState, useEffect } from 'react';
import { Users, DollarSign, TrendingUp, Clock } from 'lucide-react';

type Stats = {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  recentOrders: number;
};

export default function OverviewPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/stats');
      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError('Failed to load statistics');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className='max-w-7xl mx-auto p-6'>
        <h1 className='text-2xl font-bold mb-8'>Dashboard Overview</h1>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
          {[...Array(4)].map((_, index) => (
            <div key={index} className='bg-white rounded-lg shadow p-6'>
              <div className='flex items-center'>
                <div className='p-3 rounded-full bg-gray-200 animate-pulse h-12 w-12'></div>
                <div className='ml-4'>
                  <div className='h-4 bg-gray-200 rounded w-24 animate-pulse mb-2'></div>
                  <div className='h-8 bg-gray-200 rounded w-16 animate-pulse'></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='p-4 text-red-500 bg-red-50 rounded-lg'>
        {error}
        <button onClick={fetchStats} className='ml-2 text-red-700 underline hover:no-underline'>
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className='max-w-7xl mx-auto p-6'>
      <h1 className='text-2xl font-bold mb-8'>Dashboard Overview</h1>

      {/* Stats Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
        {/* Total Users */}
        <div className='bg-white rounded-lg shadow p-6'>
          <div className='flex items-center'>
            <div className='p-3 rounded-full bg-blue-100 text-blue-600'>
              <Users className='h-6 w-6' />
            </div>
            <div className='ml-4'>
              <p className='text-sm font-medium text-gray-600'>Total Users</p>
              <p className='text-2xl font-semibold text-gray-900'>{stats?.totalUsers || 0}</p>
            </div>
          </div>
        </div>

        {/* Total Orders */}
        <div className='bg-white rounded-lg shadow p-6'>
          <div className='flex items-center'>
            <div className='p-3 rounded-full bg-green-100 text-green-600'>
              <TrendingUp className='h-6 w-6' />
            </div>
            <div className='ml-4'>
              <p className='text-sm font-medium text-gray-600'>Total Orders</p>
              <p className='text-2xl font-semibold text-gray-900'>{stats?.totalOrders || 0}</p>
            </div>
          </div>
        </div>

        {/* Total Revenue */}
        <div className='bg-white rounded-lg shadow p-6'>
          <div className='flex items-center'>
            <div className='p-3 rounded-full bg-yellow-100 text-yellow-600'>
              <DollarSign className='h-6 w-6' />
            </div>
            <div className='ml-4'>
              <p className='text-sm font-medium text-gray-600'>Total Revenue</p>
              <p className='text-2xl font-semibold text-gray-900'>
                ${stats?.totalRevenue?.toLocaleString() || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className='bg-white rounded-lg shadow p-6'>
          <div className='flex items-center'>
            <div className='p-3 rounded-full bg-purple-100 text-purple-600'>
              <Clock className='h-6 w-6' />
            </div>
            <div className='ml-4'>
              <p className='text-sm font-medium text-gray-600'>Recent Orders (24h)</p>
              <p className='text-2xl font-semibold text-gray-900'>{stats?.recentOrders || 0}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
