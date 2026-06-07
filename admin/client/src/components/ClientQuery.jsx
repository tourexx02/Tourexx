import React, { useState, useEffect } from 'react';
import { MessageSquare, Users, Clock, Building, Mail, Phone, MapPin, Trash2, Eye, X, CheckCircle, UtensilsCrossed, Car, MapPin as MapPinIcon } from 'lucide-react';
import { hotelAPI, restaurantAPI, transportAPI, tripOrganizerAPI } from '../services/api';
import toast from 'react-hot-toast';

const ClientQuery = () => {
  const [pendingItems, setPendingItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Fetch pending items on component mount
  useEffect(() => {
    fetchPendingItems();
  }, []);

  const fetchPendingItems = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch all items from all services (API returns arrays directly)
      const [hotelsRes, restaurantsRes, transportsRes, tripOrganizersRes] = await Promise.all([
        hotelAPI.getAll().catch(() => []),
        restaurantAPI.getAll().catch(() => []),
        transportAPI.getAll().catch(() => []),
        tripOrganizerAPI.getAll().catch(() => [])
      ]);

      // Handle different response formats
      const allHotels = Array.isArray(hotelsRes) ? hotelsRes : hotelsRes.hotels || [];
      const allRestaurants = Array.isArray(restaurantsRes) ? restaurantsRes : restaurantsRes.restaurants || [];
      const allTransports = Array.isArray(transportsRes) ? transportsRes : transportsRes.transports || [];
      const allTripOrganizers = Array.isArray(tripOrganizersRes) ? tripOrganizersRes : tripOrganizersRes.tripOrganizers || [];

      // Filter to get only pending (not approved) items
      const pendingHotels = allHotels.filter(item => !item.approved).map(item => ({ ...item, itemType: 'Hotel' }));
      const pendingRestaurants = allRestaurants.filter(item => !item.approved).map(item => ({ ...item, itemType: 'Restaurant' }));
      const pendingTransports = allTransports.filter(item => !item.approved).map(item => ({ ...item, itemType: 'Transport' }));
      const pendingTripOrganizers = allTripOrganizers.filter(item => !item.approved).map(item => ({ ...item, itemType: 'Trip Organizer' }));

      const allPending = [
        ...pendingHotels,
        ...pendingRestaurants,
        ...pendingTransports,
        ...pendingTripOrganizers
      ];

      setPendingItems(allPending);
    } catch (err) {
      console.error('Error fetching pending items:', err);
      setError('Failed to load pending items');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (item) => {
    try {
      setLoading(true);
      let response;
      
      switch (item.itemType) {
        case 'Hotel':
          response = await hotelAPI.approve(item._id || item.id);
          break;
        case 'Restaurant':
          response = await restaurantAPI.approve(item._id || item.id);
          break;
        case 'Transport':
          response = await transportAPI.approve(item._id || item.id);
          break;
        case 'Trip Organizer':
          response = await tripOrganizerAPI.approve(item._id || item.id);
          break;
        default:
          throw new Error('Unknown item type');
      }
      
      toast.success(`${item.itemType} approved successfully!`);
      await fetchPendingItems();
      setSelectedItem(null);
    } catch (error) {
      console.error('Error approving item:', error);
      toast.error(`Failed to approve ${item.itemType}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (item) => {
    try {
      setLoading(true);
      let response;
      
      switch (item.itemType) {
        case 'Hotel':
          response = await hotelAPI.delete(item._id || item.id);
          break;
        case 'Restaurant':
          response = await restaurantAPI.delete(item._id || item.id);
          break;
        case 'Transport':
          response = await transportAPI.delete(item._id || item.id);
          break;
        case 'Trip Organizer':
          response = await tripOrganizerAPI.delete(item._id || item.id);
          break;
        default:
          throw new Error('Unknown item type');
      }
      
      toast.success(`${item.itemType} deleted successfully!`);
      await fetchPendingItems();
      setItemToDelete(null);
      setSelectedItem(null);
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error(`Failed to delete ${item.itemType}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (item) => {
    setItemToDelete(item);
  };

  const filteredItems = selectedType === 'All' 
    ? pendingItems 
    : pendingItems.filter(item => item.itemType === selectedType);

  const itemTypeStats = {
    Hotel: pendingItems.filter(i => i.itemType === 'Hotel').length,
    Restaurant: pendingItems.filter(i => i.itemType === 'Restaurant').length,
    Transport: pendingItems.filter(i => i.itemType === 'Transport').length,
    'Trip Organizer': pendingItems.filter(i => i.itemType === 'Trip Organizer').length,
  };

  return (
		<div className='p-10 min-h-screen'>
			<div className='max-w-full mx-auto'>
        {/* Header */}
				<div className='mb-8'>
					<h1 className='text-3xl font-bold text-[#2F4157] mb-2'>
						Client Query
					</h1>
					<p className='text-gray-600'>
						Review and approve vendor onboarding requests
					</p>
        </div>

				{/* Stats Cards */}
				<div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
					<div className='bg-white rounded-xl shadow-lg p-6 border border-gray-200'>
						<div className='w-12 h-12 bg-[#2F4157] rounded-lg flex items-center justify-center mb-4'>
							<Building
								size={24}
								className='text-white'
							/>
            </div>
						<h3 className='font-semibold text-[#2F4157] mb-2'>
							Pending Items
						</h3>
						<p className='text-2xl font-bold text-[#4F7F96]'>
							{pendingItems.length}
						</p>
					</div>
					<div className='bg-white rounded-xl shadow-lg p-6 border border-gray-200'>
						<div className='w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4'>
							<Building
								size={24}
								className='text-white'
							/>
                </div>
						<h3 className='font-semibold text-[#2F4157] mb-2'>Hotels</h3>
						<p className='text-2xl font-bold text-[#4F7F96]'>
							{itemTypeStats.Hotel}
						</p>
              </div>
					<div className='bg-white rounded-xl shadow-lg p-6 border border-gray-200'>
						<div className='w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4'>
							<UtensilsCrossed
								size={24}
								className='text-white'
							/>
                </div>
						<h3 className='font-semibold text-[#2F4157] mb-2'>Restaurants</h3>
						<p className='text-2xl font-bold text-[#4F7F96]'>
							{itemTypeStats.Restaurant}
						</p>
              </div>
					<div className='bg-white rounded-xl shadow-lg p-6 border border-gray-200'>
						<div className='w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4'>
							<Car
								size={24}
								className='text-white'
							/>
                </div>
						<h3 className='font-semibold text-[#2F4157] mb-2'>
							Transport & Tours
						</h3>
						<p className='text-2xl font-bold text-[#4F7F96]'>
							{itemTypeStats.Transport +
								itemTypeStats["Trip Organizer"]}
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
									{type} {type !== "All" && `(${itemTypeStats[type] || 0})`}
								</button>
							)
						)}
          </div>
        </div>

				{/* Business Registrations Table */}
				<div className='bg-white rounded-xl shadow-lg border border-gray-200'>
					<div className='p-6 border-b border-gray-200'>
						<h3 className='text-xl font-semibold text-[#2F4157]'>
							Pending Vendor Onboardings{" "}
							{selectedType !== "All" && `- ${selectedType}`}
						</h3>
						<p className='text-gray-600 mt-1'>
							{loading
								? "Loading..."
								: `${filteredItems.length} pending items found`}
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
								Loading business registrations...
							</p>
						</div>
					) : filteredItems.length === 0 ? (
						<div className='p-8 text-center'>
							<MessageSquare
								size={48}
								className='text-gray-400 mx-auto mb-4'
							/>
							<p className='text-gray-600'>No pending items found</p>
						</div>
					) : (
						<div className='overflow-x-auto'>
							<table className='w-full'>
								<thead className='bg-gray-50'>
									<tr>
										<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
											Item Details
										</th>
										<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
											Contact Info
										</th>
										<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
											Type & Vendor
										</th>
										<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
											Submitted
										</th>
										<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
											Actions
										</th>
									</tr>
								</thead>
								<tbody className='bg-white divide-y divide-gray-200'>
									{filteredItems.map((item) => (
										<tr
											key={item._id || item.id}
											className='hover:bg-gray-50'>
											<td className='px-6 py-4 whitespace-nowrap'>
												<div>
													<div className='text-sm font-medium text-gray-900'>
														{item.name}
													</div>
													<div className='text-sm text-gray-500 flex items-center mt-1'>
														<MapPin
															size={14}
															className='mr-1'
														/>
														{item.address || item.location || item.city || 'N/A'}
													</div>
												</div>
											</td>
											<td className='px-6 py-4 whitespace-nowrap'>
												<div className='text-sm text-gray-900'>
													<div className='flex items-center mb-1'>
														<Mail
															size={14}
															className='mr-2 text-gray-400'
														/>
														{item.email}
													</div>
													<div className='flex items-center'>
														<Phone
															size={14}
															className='mr-2 text-gray-400'
														/>
														{item.phone}
													</div>
												</div>
											</td>
											<td className='px-6 py-4 whitespace-nowrap'>
												<div>
													<span
														className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mb-1 ${
															item.itemType === "Hotel"
																? "bg-blue-100 text-blue-800"
																: item.itemType === "Restaurant"
																? "bg-green-100 text-green-800"
																: item.itemType === "Transport"
																? "bg-purple-100 text-purple-800"
																: "bg-orange-100 text-orange-800"
														}`}>
														{item.itemType}
													</span>
													{item.vendorId && typeof item.vendorId === 'object' && (
														<div className='text-xs text-gray-500 mt-1'>
															Vendor: {item.vendorId.businessName}
														</div>
													)}
												</div>
											</td>
											<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
												{new Date(item.createdAt).toLocaleDateString()}
											</td>
											<td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
												<div className='flex space-x-2'>
													<button
														onClick={() => setSelectedItem(item)}
														className='text-[#2F4157] hover:text-[#1e2d3d] p-1 rounded'
														title='View Details'>
														<Eye size={16} />
													</button>
													<button
														onClick={() => handleApprove(item)}
														className='text-green-600 hover:text-green-900 p-1 rounded'
														title='Approve'>
														<CheckCircle size={16} />
													</button>
													<button
														onClick={() => confirmDelete(item)}
														className='text-red-600 hover:text-red-900 p-1 rounded'
														title='Delete'>
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

				{/* Item Details Modal */}
				{selectedItem && (
					<div className='fixed inset-0 backdrop-blur-xs flex items-center justify-center z-50'>
						<div className='bg-white rounded-xl shadow-xl border border-gray-300 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto'>
							<div className='p-6 border-b border-gray-200 flex justify-between items-center'>
								<h3 className='text-xl font-semibold text-[#2F4157]'>
									{selectedItem.itemType} Details
								</h3>
								<button
									onClick={() => setSelectedItem(null)}
									className='p-1 hover:bg-gray-100 rounded-full transition-colors'
									title='Close'>
									<X size={20} className='text-gray-500' />
								</button>
							</div>
							<div className='p-6'>
								<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
									<div>
										<label className='block text-sm font-medium text-gray-700 mb-1'>
											Name
										</label>
										<p className='text-sm text-gray-900 bg-gray-50 p-2 rounded'>
											{selectedItem.name}
										</p>
									</div>
									<div>
										<label className='block text-sm font-medium text-gray-700 mb-1'>
											Type
										</label>
										<p className='text-sm text-gray-900 bg-gray-50 p-2 rounded'>
											{selectedItem.itemType}
										</p>
									</div>
									<div>
										<label className='block text-sm font-medium text-gray-700 mb-1'>
											Email
										</label>
										<p className='text-sm text-gray-900 bg-gray-50 p-2 rounded'>
											{selectedItem.email}
										</p>
									</div>
									<div>
										<label className='block text-sm font-medium text-gray-700 mb-1'>
											Phone Number
										</label>
										<p className='text-sm text-gray-900 bg-gray-50 p-2 rounded'>
											{selectedItem.phone}
										</p>
									</div>
									<div className='md:col-span-2'>
										<label className='block text-sm font-medium text-gray-700 mb-1'>
											Address
										</label>
										<p className='text-sm text-gray-900 bg-gray-50 p-2 rounded'>
											{selectedItem.address || selectedItem.location || selectedItem.city || 'N/A'}
										</p>
									</div>
									{selectedItem.vendorId && typeof selectedItem.vendorId === 'object' && (
										<div>
											<label className='block text-sm font-medium text-gray-700 mb-1'>
												Vendor
											</label>
											<p className='text-sm text-gray-900 bg-gray-50 p-2 rounded'>
												{selectedItem.vendorId.businessName}
											</p>
										</div>
									)}
									{selectedItem.description && (
										<div className='md:col-span-2'>
											<label className='block text-sm font-medium text-gray-700 mb-1'>
												Description
											</label>
											<p className='text-sm text-gray-900 bg-gray-50 p-2 rounded'>
												{selectedItem.description}
											</p>
										</div>
									)}
									<div>
										<label className='block text-sm font-medium text-gray-700 mb-1'>
											Submitted Date
										</label>
										<p className='text-sm text-gray-900 bg-gray-50 p-2 rounded'>
											{new Date(selectedItem.createdAt).toLocaleString()}
										</p>
									</div>
              </div>
              </div>
							<div className='p-6 border-t border-gray-200 flex justify-end space-x-3'>
								<button
									onClick={() => setSelectedItem(null)}
									className='px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors'>
									Close
								</button>
								<button
									onClick={() => {
										handleApprove(selectedItem);
									}}
									className='px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors'>
									Approve
								</button>
              </div>
            </div>
          </div>
				)}

				{/* Delete Confirmation Modal */}
				{itemToDelete && (
					<div className='fixed inset-0 backdrop-blur-xs flex items-center justify-center z-50'>
						<div className='bg-white rounded-xl shadow-xl border border-gray-300 max-w-md w-full mx-4'>
							<div className='p-6 border-b border-gray-200'>
								<h3 className='text-xl font-semibold text-red-600'>
									Confirm Delete
								</h3>
							</div>
							<div className='p-6'>
								<p className='text-gray-700 mb-4'>
									Are you sure you want to delete this {itemToDelete.itemType?.toLowerCase()} {' '}
									<span className='font-semibold'>{itemToDelete.name}</span>?
								</p>
								<p className='text-sm text-gray-500 mb-6'>
									This action cannot be undone. All data will be permanently removed.
								</p>
								<div className='bg-gray-50 p-3 rounded-lg mb-4'>
									<div className='text-sm'>
										<div className='font-medium text-gray-900'>{itemToDelete.name}</div>
										<div className='text-gray-600'>{itemToDelete.itemType}</div>
										<div className='text-gray-600'>{itemToDelete.email}</div>
									</div>
								</div>
							</div>
							<div className='p-6 border-t border-gray-200 flex justify-end space-x-3'>
								<button
									onClick={() => setItemToDelete(null)}
									className='px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors'>
									Cancel
              </button>
								<button
									onClick={() => handleDelete(itemToDelete)}
									className='px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors'>
									Delete
              </button>
            </div>
          </div>
        </div>
				)}
      </div>
    </div>
  );
};

export default ClientQuery;
