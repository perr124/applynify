'use client';

import { useState, useEffect } from 'react';
import { Mail, Clock, CheckCircle, XCircle, Calendar } from 'lucide-react';

type ApplicationEmail = {
  id: string;
  subject: string;
  company: string;
  role: string;
  date: string;
  status: 'applied' | 'rejected' | 'interview' | 'offer';
  lastUpdate: string;
};

const statusConfig = {
  applied: {
    label: 'Applied',
    icon: Clock,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
  },
  rejected: {
    label: 'Rejected',
    icon: XCircle,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
  },
  interview: {
    label: 'Interview',
    icon: Calendar,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  offer: {
    label: 'Offer',
    icon: CheckCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
};

export default function Applications() {
  const [applications, setApplications] = useState<ApplicationEmail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'applied' | 'rejected' | 'interview' | 'offer'>(
    'all'
  );

  useEffect(() => {
    // Fetch applications from email API
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/applications');
      const data = await response.json();
      setApplications(data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredApplications = applications.filter(
    (app) => filter === 'all' || app.status === filter
  );

  return (
    <div className='space-y-6'>
      {/* Stats Overview */}
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-4'>
        {Object.entries(statusConfig).map(([status, config]) => {
          const count = applications.filter((app) => app.status === status).length;
          const StatusIcon = config.icon;

          return (
            <div
              key={status}
              className={`p-4 rounded-lg ${config.bgColor} cursor-pointer transition-colors`}
              onClick={() => setFilter(status as any)}
            >
              <div className='flex items-center'>
                <StatusIcon className={`h-5 w-5 ${config.color}`} />
                <span className='ml-2 text-sm font-medium text-gray-900'>{config.label}</span>
              </div>
              <div className='mt-2 text-2xl font-semibold text-gray-900'>{count}</div>
            </div>
          );
        })}
      </div>

      {/* Applications List */}
      <div className='bg-white shadow rounded-lg'>
        <div className='px-4 py-5 border-b border-gray-200 sm:px-6'>
          <div className='flex items-center justify-between'>
            <h3 className='text-lg font-medium leading-6 text-gray-900'>Applications</h3>
            <div className='flex space-x-2'>
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 rounded-md text-sm ${
                  filter === 'all'
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                All
              </button>
              {Object.entries(statusConfig).map(([status, config]) => (
                <button
                  key={status}
                  onClick={() => setFilter(status as any)}
                  className={`px-3 py-1 rounded-md text-sm ${
                    filter === status
                      ? `${config.bgColor} ${config.color}`
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {config.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <ul className='divide-y divide-gray-200'>
          {filteredApplications.map((application) => {
            const status = statusConfig[application.status];
            const StatusIcon = status.icon;

            return (
              <li key={application.id} className='px-4 py-4 sm:px-6 hover:bg-gray-50'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center'>
                    <Mail className='h-5 w-5 text-gray-400' />
                    <div className='ml-3'>
                      <div className='flex items-center'>
                        <span className='font-medium text-gray-900'>{application.company}</span>
                        <span className='ml-2 text-gray-500'>•</span>
                        <span className='ml-2 text-gray-500'>{application.role}</span>
                      </div>
                      <div className='mt-1 text-sm text-gray-500'>{application.subject}</div>
                    </div>
                  </div>
                  <div className='flex items-center'>
                    <div className={`px-2 py-1 rounded-full ${status.bgColor}`}>
                      <div className='flex items-center'>
                        <StatusIcon className={`h-4 w-4 ${status.color}`} />
                        <span className={`ml-1 text-sm ${status.color}`}>{status.label}</span>
                      </div>
                    </div>
                    <span className='ml-4 text-sm text-gray-500'>{application.lastUpdate}</span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
