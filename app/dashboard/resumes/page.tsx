'use client';

import { useState, useEffect } from 'react';
import React from 'react';
import { Upload, FileText, AlertCircle, Loader2, CheckCircle } from 'lucide-react';

type Resume = {
  id: string;
  filename: string;
  url: string;
  uploadedAt: string;
  status: 'active' | 'archived';
};

export default function ResumeBank() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const response = await fetch('/api/resumes');
      if (!response.ok) throw new Error('Failed to fetch resumes');
      const data = await response.json();
      setResumes(data);
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to load resumes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload-resume', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to upload resume');

      const data = await response.json();

      // Add new resume to the list
      setResumes((prev) => [
        {
          id: Date.now().toString(),
          filename: file.name,
          url: data.url,
          uploadedAt: new Date().toISOString(),
          status: 'active',
        },
        ...prev,
      ]);

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to upload resume');
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className='p-8'>
        <div className='animate-pulse space-y-6'>
          <div className='h-4 bg-gray-200 rounded w-1/4'></div>
          <div className='space-y-4'>
            {[1, 2].map((i) => (
              <div key={i} className='h-24 bg-gray-200 rounded'></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>Resume Bank</h1>
          <p className='mt-1 text-sm text-gray-500'>
            Upload and manage your resumes for different job applications
          </p>
        </div>
      </div>

      {showSuccess && (
        <div className='rounded-lg bg-green-50 p-4'>
          <div className='flex'>
            <CheckCircle className='h-5 w-5 text-green-400 mr-2' />
            <div className='text-sm text-green-700'>Resume uploaded successfully</div>
          </div>
        </div>
      )}

      {error && (
        <div className='rounded-lg bg-red-50 p-4'>
          <div className='flex'>
            <AlertCircle className='h-5 w-5 text-red-400 mr-2' />
            <div className='text-sm text-red-700'>{error}</div>
          </div>
        </div>
      )}

      {/* Upload Section */}
      <div className='bg-white shadow rounded-lg p-6'>
        <div className='flex items-center mb-6'>
          <div className='flex-shrink-0'>
            <div className='h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center'>
              <Upload className='h-5 w-5 text-purple-600' />
            </div>
          </div>
          <div className='ml-4'>
            <h2 className='text-lg font-semibold text-gray-900'>Upload New Resume</h2>
            <p className='text-sm text-gray-500'>Add a new version of your resume</p>
          </div>
        </div>

        <div className='flex items-center justify-center w-full'>
          <label className='flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-150'>
            <div className='flex flex-col items-center justify-center pt-5 pb-6'>
              {isUploading ? (
                <>
                  <Loader2 className='w-12 h-12 mb-4 text-gray-400 animate-spin' />
                  <p className='text-sm text-gray-500'>Uploading...</p>
                </>
              ) : (
                <>
                  <Upload className='w-12 h-12 mb-4 text-gray-400' />
                  <p className='mb-2 text-sm text-gray-500'>
                    <span className='font-semibold'>Click to upload</span> or drag and drop
                  </p>
                  <p className='text-xs text-gray-500'>PDF (max. 5MB)</p>
                </>
              )}
            </div>
            <input
              type='file'
              className='hidden'
              accept='.pdf'
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </label>
        </div>
      </div>

      {/* Resumes List */}
      <div className='bg-white shadow rounded-lg divide-y divide-gray-200'>
        <div className='px-6 py-4'>
          <h3 className='text-lg font-medium text-gray-900'>Your Resumes</h3>
        </div>
        <div className='divide-y divide-gray-200'>
          {resumes.map((resume) => (
            <div key={resume.id} className='px-6 py-4 flex items-center justify-between'>
              <div className='flex items-center'>
                <FileText className='h-8 w-8 text-gray-400' />
                <div className='ml-4'>
                  <h4 className='text-sm font-medium text-gray-900'>{resume.filename}</h4>
                  <p className='text-sm text-gray-500'>
                    Uploaded on {new Date(resume.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className='flex items-center space-x-4'>
                <a
                  href={resume.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-sm text-indigo-600 hover:text-indigo-500'
                >
                  View
                </a>
              </div>
            </div>
          ))}
          {resumes.length === 0 && (
            <div className='px-6 py-4 text-sm text-gray-500 text-center'>
              No resumes uploaded yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
