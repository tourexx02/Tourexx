import React, { useState, useEffect } from 'react';
import { Users, Clock, Calendar, Mail, Phone, MapPin, Trash2, Eye, X } from 'lucide-react';
import { bookingAPI } from '../services/api';

const CustomerQuery = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookingToDelete, setBookingToDelete] = useState(null);

  // Fetch bookings on component mount
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingAPI.getAll();
      if (response.success !== false) {
        setBookings(Array.isArray(response) ? response : response.data || []);
      } else {
        setError('Failed to fetch bookings');
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBooking = async (id) => {
    try {
      const response = await bookingAPI.delete(id);
      if (response.success !== false) {
        setBookings(bookings.filter(booking => booking._id !== id));
        setBookingToDelete(null);
        setSelectedBooking(null);
      } else {
        setError('Failed to delete booking');
      }
    } catch (err) {
      console.error('Error deleting booking:', err);
      setError('Failed to delete booking');
    }
  };

  const confirmDelete = (booking) => {
    setBookingToDelete(booking);
  };

  const filteredBookings = selectedType === 'All' 
    ? bookings 
    : bookings.filter(booking => booking.type === selectedType);

  const bookingTypeStats = {
    'Hotel': bookings.filter(b => b.type === 'Hotel').length,
    'Restaurant': bookings.filter(b => b.type === 'Restaurant').length,
    'Transport': bookings.filter(b => b.type === 'Transport').length,
    'Trip Organizer': bookings.filter(b => b.type === 'Trip Organizer').length,
  };

  return (
    <div className='p-10 min-h-screen'>
      <div className='max-w-full mx-auto'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-[#2F4157] mb-2'>
            Customer Bookings
          </h1>
          <p className='text-gray-600'>
            Manage customer bookings and reservations
          </p>
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
          <div className='bg-white rounded-xl shadow-lg p-6 border border-gray-200'>
            <div className='w-12 h-12 bg-[#2F4157] rounded-lg flex items-center justify-center mb-4'>
              <Calendar size={24} className='text-white' />
            </div>
            <h3 className='font-semibold text-[#2F4157] mb-2'>
              Total Bookings
            </h3>
            <p className='text-2xl font-bold text-[#4F7F96]'>
              {bookings.length}
            </p>
          </div>
          <div className='bg-white rounded-xl shadow-lg p-6 border border-gray-200'>
            <div className='w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4'>
              <Users size={24} className='text-white' />
            </div>
            <h3 className='font-semibold text-[#2F4157] mb-2'>Unique Customers</h3>
            <p className='text-2xl font-bold text-[#4F7F96]'>
              {new Set(bookings.map(b => b.email)).size}
            </p>
          </div>
          <div className='bg-white rounded-xl shadow-lg p-6 border border-gray-200'>
            <div className='w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4'>
              <Clock size={24} className='text-white' />
            </div>
            <h3 className='font-semibold text-[#2F4157] mb-2'>
              Recent Bookings
            </h3>
            <p className='text-2xl font-bold text-[#4F7F96]'>
              {bookings.filter(b => {
                const bookingDate = new Date(b.createdAt);
                const today = new Date();
                const diffTime = Math.abs(today - bookingDate);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                return diffDays <= 7;
              }).length}
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className='mb-6'>
          <div className='flex flex-wrap gap-2'>
            {["All", "Hotel", "Restaurant", "Transport", "Trip Organizer"].map(
              (type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedType === type
                      ? "bg-[#2F4157] text-white"
                      : "bg-white text-[#2F4157] border border-[#2F4157] hover:bg-[#2F4157] hover:text-white"
                  }`}>
                  {type} {type !== "All" && `(${bookingTypeStats[type] || 0})`}
                </button>
              )
            )}
          </div>
        </div>

        {/* Bookings Table */}
        <div className='bg-white rounded-xl shadow-lg border border-gray-200'>
          <div className='p-6 border-b border-gray-200'>
            <h3 className='text-xl font-semibold text-[#2F4157]'>
              Customer Bookings{" "}
              {selectedType !== "All" && `- ${selectedType}`}
            </h3>
            <p className='text-gray-600 mt-1'>
              {loading
                ? "Loading..."
                : `${filteredBookings.length} bookings found`}
            </p>
          </div>

          {error && (
            <div className='p-4 bg-red-100 border-b border-red-200 text-red-700'>
              {error}
            </div>
          )}

          {loading ? (
            <div className='p-8 text-center'>
              <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-[#2F4157] mx-auto'></div>
              <p className='mt-4 text-gray-600'>
                Loading bookings...
              </p>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className='p-8 text-center'>
              <Calendar size={48} className='text-gray-400 mx-auto mb-4' />
              <p className='text-gray-600'>No bookings found</p>
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Customer Details
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Contact Info
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Booking Details
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Dates & Price
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {filteredBookings.map((booking) => (
                    <tr key={booking._id} className='hover:bg-gray-50'>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div>
                          <div className='text-sm font-medium text-gray-900'>
                            {booking.firstName} {booking.lastName}
                          </div>
                          <div className='text-sm text-gray-500 flex items-center mt-1'>
                            <MapPin size={14} className='mr-1' />
                            {booking.facility}
                          </div>
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='text-sm text-gray-900'>
                          <div className='flex items-center mb-1'>
                            <Mail size={14} className='mr-2 text-gray-400' />
                            {booking.email}
                          </div>
                          <div className='flex items-center'>
                            <Phone size={14} className='mr-2 text-gray-400' />
                            {booking.phone}
                          </div>
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          booking.type === 'Hotel' ? "bg-blue-100 text-blue-800"
                          : booking.type === 'Restaurant' ? "bg-green-100 text-green-800"
                          : booking.type === 'Transport' ? "bg-purple-100 text-purple-800"
                          : "bg-orange-100 text-orange-800"
                        }`}>
                          {booking.type}
                        </span>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                        <div className='text-sm text-gray-900'>
                          <div className='font-medium'>PKR {booking.price?.toLocaleString()}</div>
                          <div className='text-xs text-gray-500'>
                            {new Date(booking.from).toLocaleDateString()} - {new Date(booking.to).toLocaleDateString()}
                          </div>
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                        <div className='flex space-x-2'>
                          <button
                            onClick={() => setSelectedBooking(booking)}
                            className='text-[#2F4157] hover:text-[#1e2d3d] p-1 rounded'
                            title='View Details'>
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => confirmDelete(booking)}
                            className='text-red-600 hover:text-red-900 p-1 rounded'
                            title='Delete Booking'>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Booking Details Modal */}
        {selectedBooking && (
          <div className='fixed inset-0 backdrop-blur-xs flex items-center justify-center z-50'>
            <div className='bg-white rounded-xl shadow-xl border border-gray-300 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto'>
              <div className='p-6 border-b border-gray-200 flex justify-between items-center'>
                <h3 className='text-xl font-semibold text-[#2F4157]'>
                  Booking Details
                </h3>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className='p-1 hover:bg-gray-100 rounded-full transition-colors'
                  title='Close'>
                  <X size={20} className='text-gray-500' />
                </button>
              </div>
              <div className='p-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      First Name
                    </label>
                    <p className='text-sm text-gray-900 bg-gray-50 p-2 rounded'>
                      {selectedBooking.firstName}
                    </p>
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Last Name
                    </label>
                    <p className='text-sm text-gray-900 bg-gray-50 p-2 rounded'>
                      {selectedBooking.lastName}
                    </p>
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Email
                    </label>
                    <p className='text-sm text-gray-900 bg-gray-50 p-2 rounded'>
                      {selectedBooking.email}
                    </p>
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Phone Number
                    </label>
                    <p className='text-sm text-gray-900 bg-gray-50 p-2 rounded'>
                      {selectedBooking.phone}
                    </p>
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      From Date
                    </label>
                    <p className='text-sm text-gray-900 bg-gray-50 p-2 rounded'>
                      {new Date(selectedBooking.from).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      To Date
                    </label>
                    <p className='text-sm text-gray-900 bg-gray-50 p-2 rounded'>
                      {new Date(selectedBooking.to).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Service Type
                    </label>
                    <p className='text-sm text-gray-900 bg-gray-50 p-2 rounded'>
                      {selectedBooking.type}
                    </p>
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Price
                    </label>
                    <p className='text-sm text-gray-900 bg-gray-50 p-2 rounded'>
                      PKR {selectedBooking.price?.toLocaleString()}
                    </p>
                  </div>
                  <div className='md:col-span-2'>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Facility/Service
                    </label>
                    <p className='text-sm text-gray-900 bg-gray-50 p-2 rounded'>
                      {selectedBooking.facility}
                    </p>
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Booking Date
                    </label>
                    <p className='text-sm text-gray-900 bg-gray-50 p-2 rounded'>
                      {new Date(selectedBooking.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
              <div className='p-6 border-t border-gray-200 flex justify-end'>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className='px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors'>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {bookingToDelete && (
          <div className='fixed inset-0 backdrop-blur-xs flex items-center justify-center z-50'>
            <div className='bg-white rounded-xl shadow-xl border border-gray-300 max-w-md w-full mx-4'>
              <div className='p-6 border-b border-gray-200'>
                <h3 className='text-xl font-semibold text-red-600'>
                  Confirm Delete
                </h3>
              </div>
              <div className='p-6'>
                <p className='text-gray-700 mb-4'>
                  Are you sure you want to delete the booking for{' '}
                  <span className='font-semibold'>{bookingToDelete.firstName} {bookingToDelete.lastName}</span>?
                </p>
                <p className='text-sm text-gray-500 mb-6'>
                  This action cannot be undone. All booking data will be permanently removed.
                </p>
                <div className='bg-gray-50 p-3 rounded-lg mb-4'>
                  <div className='text-sm'>
                    <div className='font-medium text-gray-900'>{bookingToDelete.firstName} {bookingToDelete.lastName}</div>
                    <div className='text-gray-600'>{bookingToDelete.type}</div>
                    <div className='text-gray-600'>{bookingToDelete.facility}</div>
                    <div className='text-gray-600'>PKR {bookingToDelete.price?.toLocaleString()}</div>
                  </div>
                </div>
              </div>
              <div className='p-6 border-t border-gray-200 flex justify-end space-x-3'>
                <button
                  onClick={() => setBookingToDelete(null)}
                  className='px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors'>
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteBooking(bookingToDelete._id)}
                  className='px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors'>
                  Delete Booking
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerQuery;
