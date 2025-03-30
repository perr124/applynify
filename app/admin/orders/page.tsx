'use client';

import { useState, useEffect } from 'react';
import { Search, Loader2, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';

type Order = {
  id: string;
  amount: number;
  status: string;
  created: string;
  customer: {
    id: string;
    email: string;
    name: string;
  };
  paymentMethod: string;
  currency: string;
  description: string;
};

type SortField = 'date' | 'amount' | 'status';
type SortDirection = 'asc' | 'desc';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [previousCursors, setPreviousCursors] = useState<string[]>([]);
  const ordersPerPage = 10;

  useEffect(() => {
    fetchOrders();
  }, [currentPage]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const startingAfter = currentPage > 1 ? previousCursors[currentPage - 2] : undefined;
      const response = await fetch(
        `/api/admin/orders?limit=${ordersPerPage}${
          startingAfter ? `&starting_after=${startingAfter}` : ''
        }${searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ''}`
      );
      if (!response.ok) throw new Error('Failed to fetch orders');
      const data = await response.json();
      setOrders(data.orders);
      setHasMore(data.pagination.hasMore);
      setNextCursor(data.pagination.nextCursor);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page when searching
    setPreviousCursors([]); // Clear previous cursors
    fetchOrders();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleNextPage = () => {
    if (nextCursor) {
      setPreviousCursors((prev) => [...prev, nextCursor]);
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setPreviousCursors((prev) => prev.slice(0, -1));
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filteredOrders = orders.sort((a, b) => {
    if (sortField === 'date') {
      const dateA = new Date(a.created).getTime();
      const dateB = new Date(b.created).getTime();
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    } else if (sortField === 'amount') {
      return sortDirection === 'asc' ? a.amount - b.amount : b.amount - a.amount;
    } else if (sortField === 'status') {
      return sortDirection === 'asc'
        ? a.status.localeCompare(b.status)
        : b.status.localeCompare(a.status);
    }
    return 0;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // Calculate the estimated total pages
  const estimatedTotalPages = null;

  return (
    <div className='max-w-7xl mx-auto p-6'>
      <div className='mb-8'>
        <h1 className='text-2xl font-bold mb-4'>Orders</h1>

        {/* Search Section */}
        <div className='bg-white p-6 rounded-lg shadow mb-6'>
          <div className='flex items-center gap-4 mb-4'>
            <div className='flex-1'>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
                <input
                  type='text'
                  placeholder='Search orders by customer email, name, or order ID...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className='w-full pl-10 pr-4 py-2 border rounded-lg'
                />
              </div>
            </div>
            <button
              onClick={handleSearch}
              className='px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
            >
              Search
            </button>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className='animate-pulse'>
              {[...Array(5)].map((_, index) => (
                <div key={index} className='flex items-center space-x-4 py-3'>
                  <div className='h-4 bg-gray-200 rounded w-1/6'></div>
                  <div className='h-4 bg-gray-200 rounded w-1/4'></div>
                  <div className='h-4 bg-gray-200 rounded w-1/4'></div>
                  <div className='h-4 bg-gray-200 rounded w-1/6'></div>
                  <div className='h-4 bg-gray-200 rounded w-1/6'></div>
                  <div className='h-4 bg-gray-200 rounded w-1/6'></div>
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className='text-red-500 p-4 text-center bg-red-50 rounded-lg'>
              {error}
              <button
                onClick={fetchOrders}
                className='ml-2 text-red-700 underline hover:no-underline'
              >
                Try again
              </button>
            </div>
          )}

          {/* Orders Table */}
          {!isLoading && !error && (
            <>
              <div className='overflow-x-auto'>
                <table className='min-w-full divide-y divide-gray-200'>
                  <thead className='bg-gray-50'>
                    <tr>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Order ID
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Customer
                      </th>
                      <th
                        className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100'
                        onClick={() => handleSort('date')}
                      >
                        <div className='flex items-center gap-1'>
                          Date Ordered
                          <ArrowUpDown className='h-4 w-4' />
                          {sortField === 'date' && (
                            <span className='text-xs'>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </div>
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Amount
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Status
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Payment Method
                      </th>
                    </tr>
                  </thead>
                  <tbody className='bg-white divide-y divide-gray-200'>
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={6} className='px-6 py-4 text-center text-gray-500'>
                          No orders found
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((order) => (
                        <tr key={order.id}>
                          <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                            {order.id}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap'>
                            <div className='text-sm text-gray-900'>{order.customer.name}</div>
                            <div className='text-sm text-gray-500'>{order.customer.email}</div>
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                            {formatDate(order.created)}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                            {new Intl.NumberFormat('en-US', {
                              style: 'currency',
                              currency: order.currency,
                            }).format(order.amount)}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap'>
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                order.status === 'succeeded'
                                  ? 'bg-green-100 text-green-800'
                                  : order.status === 'processing'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                            {order.paymentMethod || 'N/A'}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                  <tfoot className='bg-gray-50'>
                    <tr>
                      <td colSpan={6} className='px-6 py-3 text-sm text-gray-500'>
                        <div className='flex justify-end items-center'>
                          <div>
                            <span className='font-medium'>Page {currentPage}</span>
                            {estimatedTotalPages && (
                              <>
                                {' '}
                                of <span className='font-medium'>{estimatedTotalPages}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Pagination */}
              <div className='flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6'>
                <div className='flex justify-between flex-1 sm:hidden'>
                  <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className='relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50'
                  >
                    Previous
                  </button>
                  <button
                    onClick={handleNextPage}
                    disabled={!hasMore}
                    className='ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50'
                  >
                    Next
                  </button>
                </div>
                <div className='hidden sm:flex sm:flex-1 sm:items-center sm:justify-between'>
                  <div>
                    <p className='text-sm text-gray-700'>
                      Page <span className='font-medium'>{currentPage}</span>
                      {estimatedTotalPages && (
                        <>
                          {' '}
                          of <span className='font-medium'>{estimatedTotalPages}</span>
                        </>
                      )}
                    </p>
                  </div>
                  <div>
                    <nav
                      className='relative z-0 inline-flex rounded-md shadow-sm -space-x-px'
                      aria-label='Pagination'
                    >
                      <button
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                        className='relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50'
                      >
                        <span className='sr-only'>Previous</span>
                        <ChevronLeft className='h-5 w-5' />
                      </button>
                      <button
                        onClick={handleNextPage}
                        disabled={!hasMore}
                        className='relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50'
                      >
                        <span className='sr-only'>Next</span>
                        <ChevronRight className='h-5 w-5' />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
