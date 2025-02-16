'use client';

import { useState, useEffect } from 'react';
import {
  Building2,
  MapPin,
  Briefcase,
  ExternalLink,
  Calendar,
  Search,
  X,
  Clock,
} from 'lucide-react';
import { Dialog } from '@headlessui/react';

type JobApplication = {
  jobTitle: string;
  companyName: string;
  location: string;
  salary?: string;
  jobType: 'remote' | 'hybrid' | 'on-site';
  employmentType: 'full-time' | 'contract' | 'part-time';
  jobLink: string;
  status: 'draft' | 'completed';
  appliedAt: string;
};

const employmentTypeConfig = {
  'full-time': { label: 'Full-time', color: 'text-blue-600 bg-blue-50 border-blue-200' },
  contract: { label: 'Contract', color: 'text-purple-600 bg-purple-50 border-purple-200' },
  'part-time': { label: 'Part-time', color: 'text-green-600 bg-green-50 border-green-200' },
};

export default function Applications() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);

  useEffect(() => {
    checkApplicationStatus();
  }, []);

  const checkApplicationStatus = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/user/me');
      if (!response.ok) throw new Error('Failed to fetch user status');

      const userData = await response.json();
      console.log('User data:', userData); // Debug log

      const isComplete = userData.applicationsStatus === 'completed';
      console.log('Is complete:', isComplete); // Debug log
      setIsComplete(isComplete);

      if (isComplete) {
        const applicationsResponse = await fetch('/api/job-applications');
        if (!applicationsResponse.ok) throw new Error('Failed to fetch applications');
        const data = await applicationsResponse.json();
        console.log('Applications data:', data); // Debug log
        setApplications(data);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to load applications');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredApplications = applications.filter(
    (app) =>
      app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className='space-y-6'>
        <div className='animate-pulse'>
          {[...Array(3)].map((_, index) => (
            <div key={index} className='bg-white shadow rounded-xl p-6 mb-4 border border-gray-100'>
              <div className='h-4 bg-gray-200 rounded w-1/4 mb-4'></div>
              <div className='h-4 bg-gray-200 rounded w-1/2'></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!isComplete) {
    return (
      <div className='bg-white shadow rounded-xl p-8 text-center border border-gray-100'>
        <Clock className='mx-auto h-12 w-12 text-gray-400' />
        <h3 className='mt-2 text-lg font-medium text-gray-900'>Applications In Progress</h3>
        <p className='mt-2 text-sm text-gray-500 max-w-sm mx-auto'>
          Our team is currently working on your job applications. You'll be able to view all your
          applications here once they're completed.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className='bg-red-50 p-6 rounded-xl border border-red-100'>
        <p className='text-red-700'>{error}</p>
        <button
          onClick={checkApplicationStatus}
          className='mt-2 text-red-700 underline hover:no-underline'
        >
          Try again
        </button>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className='bg-white shadow rounded-xl p-8 text-center border border-gray-100'>
        <Briefcase className='mx-auto h-12 w-12 text-gray-400' />
        <h3 className='mt-2 text-sm font-medium text-gray-900'>No applications yet</h3>
        <p className='mt-1 text-sm text-gray-500'>
          Your job applications will appear here once they are submitted.
        </p>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Stats Cards */}
      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
        <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md'>
          <h3 className='text-lg font-medium text-gray-900'>Total Applications</h3>
          <p className='mt-2 text-3xl font-semibold text-primary-600'>{applications.length}</p>
        </div>
        <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md'>
          <h3 className='text-lg font-medium text-gray-900'>Latest Application</h3>
          <p className='mt-2 text-sm text-gray-500'>
            {new Date(applications[0].appliedAt).toLocaleDateString(undefined, {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className='relative'>
        <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5' />
        <input
          type='text'
          placeholder='Search applications...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
        />
      </div>

      {/* Applications List */}
      <div className='bg-white shadow-sm rounded-xl border border-gray-100'>
        <div className='px-6 py-4 border-b border-gray-100'>
          <h3 className='text-lg font-medium text-gray-900'>Your Applications</h3>
        </div>
        <ul className='divide-y divide-gray-100'>
          {filteredApplications.map((application, index) => (
            <li
              key={index}
              onClick={() => setSelectedApplication(application)}
              className='p-4 transition-colors hover:bg-gray-50 group cursor-pointer'
            >
              <div className='flex items-center justify-between'>
                <div className='flex-1 min-w-0'>
                  <h4 className='text-lg font-medium text-gray-900 group-hover:text-primary-600'>
                    {application.jobTitle}
                  </h4>
                  <div className='mt-1 flex items-center text-sm text-gray-500'>
                    <Building2 className='flex-shrink-0 mr-1.5 h-4 w-4' />
                    {application.companyName}
                  </div>
                  <div className='mt-1 flex items-center text-sm text-gray-500'>
                    <Calendar className='flex-shrink-0 mr-1.5 h-4 w-4' />
                    {new Date(application.appliedAt).toLocaleDateString()}
                  </div>
                </div>
                <div className='ml-4'>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      employmentTypeConfig[application.employmentType].color
                    }`}
                  >
                    {employmentTypeConfig[application.employmentType].label}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Application Details Modal */}
      <Dialog
        open={!!selectedApplication}
        onClose={() => setSelectedApplication(null)}
        className='relative z-50'
      >
        <div className='fixed inset-0 bg-black/30' aria-hidden='true' />
        <div className='fixed inset-0 flex items-center justify-center p-4'>
          <Dialog.Panel className='mx-auto max-w-2xl w-full bg-white rounded-xl shadow-lg'>
            {selectedApplication && (
              <>
                <div className='px-6 py-4 border-b border-gray-100 flex justify-between items-center'>
                  <Dialog.Title className='text-lg font-medium text-gray-900'>
                    Application Details
                  </Dialog.Title>
                  <button
                    onClick={() => setSelectedApplication(null)}
                    className='text-gray-400 hover:text-gray-500'
                  >
                    <X className='h-5 w-5' />
                  </button>
                </div>
                <div className='p-6 space-y-4'>
                  <div>
                    <h3 className='text-xl font-semibold text-gray-900'>
                      {selectedApplication.jobTitle}
                    </h3>
                    <div className='mt-2 flex items-center text-gray-500'>
                      <Building2 className='flex-shrink-0 mr-1.5 h-5 w-5' />
                      {selectedApplication.companyName}
                    </div>
                  </div>

                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-sm font-medium text-gray-500'>Location</label>
                      <div className='mt-1 flex items-center text-gray-900'>
                        <MapPin className='flex-shrink-0 mr-1.5 h-4 w-4' />
                        {selectedApplication.location}
                      </div>
                    </div>
                    {selectedApplication.salary && (
                      <div>
                        <label className='block text-sm font-medium text-gray-500'>Salary</label>
                        <div className='mt-1 text-gray-900'>{selectedApplication.salary}</div>
                      </div>
                    )}
                    <div>
                      <label className='block text-sm font-medium text-gray-500'>Job Type</label>
                      <div className='mt-1'>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                            employmentTypeConfig[selectedApplication.employmentType].color
                          }`}
                        >
                          {employmentTypeConfig[selectedApplication.employmentType].label}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-500'>
                        Employment Type
                      </label>
                      <div className='mt-1'>
                        <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200'>
                          {selectedApplication.employmentType}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-500'>Applied On</label>
                    <div className='mt-1 text-gray-900'>
                      {new Date(selectedApplication.appliedAt).toLocaleDateString(undefined, {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>
                  </div>

                  <div className='mt-6 flex justify-end'>
                    <a
                      href={selectedApplication.jobLink}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700'
                    >
                      View Job Posting
                      <ExternalLink className='ml-2 h-4 w-4' />
                    </a>
                  </div>
                </div>
              </>
            )}
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
