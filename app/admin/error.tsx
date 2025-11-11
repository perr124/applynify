'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className='min-h-[50vh] flex items-center justify-center p-6'>
      <div className='max-w-md w-full rounded-2xl bg-white p-6 shadow'>
        <h2 className='text-lg font-semibold text-gray-900'>Something went wrong</h2>
        <p className='mt-2 text-sm text-gray-600'>
          An unexpected error occurred while loading the admin panel.
        </p>
        <div className='mt-4 flex gap-2'>
          <button
            onClick={() => reset()}
            className='rounded-md bg-black px-3 py-2 text-sm font-medium text-white'
          >
            Try again
          </button>
          <button
            onClick={() => (window.location.href = '/admin')}
            className='rounded-md border px-3 py-2 text-sm font-medium'
          >
            Reload
          </button>
        </div>
      </div>
    </div>
  );
}
