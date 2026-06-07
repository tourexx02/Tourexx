import React, { useState, useEffect } from 'react';
import { Building, Plus, Edit, Trash2, Search, Filter, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { hotelAPI } from '../services/api';

const HotelOnboarding = () => {
  const [hotels, setHotels] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingHotel, setEditingHotel] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCity, setFilterCity] = useState('');
  const [filterApproval, setFilterApproval] = useState('all'); // 'all', 'pending', 'approved'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    roomPricing: {
      single: '',
      double: '',
      suite: '',
      family: ''
    },
    payment: '',
    description: '',
    amenities: [],
    images: []
  });
  const [imagePreview, setImagePreview] = useState([]);

  // Fetch hotels from API
  const fetchHotels = async () => {
    try {
      setLoading(true);
      setError('');
      // Fetch all hotels (both approved and pending)
      const response = await hotelAPI.getAll();
      setHotels(response.hotels || response || []);
    } catch (error) {
      console.error('Error fetching hotels:', error);
      setError('Failed to fetch hotels. Please try again.');
      setHotels([]);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchHotels();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Handle room pricing inputs
    if (name.startsWith('roomPricing.')) {
      const roomType = name.split('.')[1];
      setFormData({
        ...formData,
        roomPricing: {
          ...formData.roomPricing,
          [roomType]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({...formData, images: e.target.files});
    
    // Create preview URLs
    const previewUrls = files.map(file => URL.createObjectURL(file));
    setImagePreview(previewUrls);
  };

  const removeImage = (index) => {
    const newPreviews = imagePreview.filter((_, i) => i !== index);
    setImagePreview(newPreviews);
    
    // Update files
    const dt = new DataTransfer();
    Array.from(formData.images).forEach((file, i) => {
      if (i !== index) dt.items.add(file);
    });
    setFormData({...formData, images: dt.files});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');
      
      // Validate that at least one room type has a price
      const hasValidRoomType = Object.values(formData.roomPricing).some(price => price && parseInt(price) > 0);
      if (!hasValidRoomType) {
        toast.error('Please set a price for at least one room type');
        setLoading(false);
        return;
      }

      // Convert room pricing strings to numbers
      const roomPricing = {};
      Object.keys(formData.roomPricing).forEach(roomType => {
        roomPricing[roomType] = formData.roomPricing[roomType] ? parseInt(formData.roomPricing[roomType]) : 0;
      });

      const amenities = (formData.amenities || [])
        .map(amenity => amenity?.trim())
        .filter(Boolean);

      const submitData = {
        ...formData,
        phone: parseInt(formData.phone),
        roomPricing,
        amenities,
      };
      
      if (editingHotel) {
        // Update existing hotel
        await hotelAPI.update(editingHotel._id || editingHotel.id, submitData);
        toast.success('Hotel updated successfully!');
      } else {
        // Add new hotel
        await hotelAPI.create(submitData);
        toast.success('Hotel added successfully!');
      }
      
      // Refresh the hotels list
      await fetchHotels();
      resetForm();
      
    } catch (error) {
      console.error('Error saving hotel:', error);
      setError('Failed to save hotel. Please try again.');
      toast.error('Error saving hotel. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (hotel) => {
    setEditingHotel(hotel);
    
    // Handle room pricing conversion for editing
    const roomPricing = hotel.roomPricing || {
      single: hotel.budget || 0, // Backward compatibility
      double: 0,
      suite: 0,
      family: 0
    };
    
    // Convert numbers to strings for form inputs
    const roomPricingStrings = {};
    Object.keys(roomPricing).forEach(roomType => {
      roomPricingStrings[roomType] = roomPricing[roomType] ? roomPricing[roomType].toString() : '';
    });
    
    setFormData({
      ...hotel, 
      phone: hotel.phone.toString(),
      roomPricing: roomPricingStrings,
      amenities: Array.isArray(hotel.amenities) ? hotel.amenities : [],
    });
    
    // Set existing images for preview (if any)
    if (hotel.images && hotel.images.length > 0) {
      const existingImageUrls = hotel.images.map(img => `${import.meta.env.VITE_SERVER_BASE_URL ? import.meta.env.VITE_SERVER_BASE_URL.replace('/api', '') : 'http://localhost:8080'}/uploads/${img}`);
      setImagePreview(existingImageUrls);
    } else {
      setImagePreview([]);
    }
    
    setShowModal(true);
  };

  const handleDelete = async (hotel) => {
    if (window.confirm('Are you sure you want to delete this hotel?')) {
      try {
        setLoading(true);
        setError('');
        
        await hotelAPI.delete(hotel._id || hotel.id);
        
        // Refresh the hotels list
        await fetchHotels();
        
        toast.success('Hotel deleted successfully!');
      } catch (error) {
        console.error('Error deleting hotel:', error);
        setError('Failed to delete hotel. Please try again.');
        toast.error('Error deleting hotel. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      roomPricing: {
        single: '',
        double: '',
        suite: '',
        family: ''
      },
      payment: '',
      description: '',
      amenities: [],
      images: null
    });
    setImagePreview([]);
    setEditingHotel(null);
    setShowModal(false);
    setError('');
  };

  const filteredHotels = hotels.filter(hotel => {
    const matchesSearch = hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hotel.city.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCity = filterCity === '' || hotel.city === filterCity;
    
    const matchesApproval = filterApproval === 'all' || 
                           (filterApproval === 'pending' && !hotel.approved) ||
                           (filterApproval === 'approved' && hotel.approved);
    
    return matchesSearch && matchesCity && matchesApproval;
  });

  return (
    <div className="p-10 bg-gray-50 min-h-screen">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#2F4157] mb-2">Hotel Onboarding</h1>
          
          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <p className="text-gray-600">Manage hotel listings and registrations</p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6 border border-gray-200">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-1 gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search hotels by name, city, or room type..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F4157] focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <select
                  value={filterCity}
                  onChange={(e) => setFilterCity(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F4157] focus:border-transparent bg-white"
                >
                  <option value="">All Cities</option>
                  <option value="Lahore">Lahore</option>
                  <option value="Islamabad">Islamabad</option>
                  <option value="Karachi">Karachi</option>
                  <option value="Murree">Murree</option>
                </select>
              </div>
              <div className="relative">
                <select
                  value={filterApproval}
                  onChange={(e) => setFilterApproval(e.target.value)}
                  className="pl-4 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F4157] focus:border-transparent bg-white"
                >
                  <option value="all">All Hotels</option>
                  <option value="pending">Pending Approval</option>
                  <option value="approved">Approved</option>
                </select>
              </div>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="bg-[#2F4157] text-white px-6 py-2 rounded-lg hover:bg-[#1e2d3d] transition-colors flex items-center gap-2"
            >
              <Plus size={20} />
              Add New Hotel
            </button>
          </div>
        </div>

        {/* Hotels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHotels.map((hotel) => (
            <div key={hotel.id} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="p-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#d8e5ee] rounded-lg flex items-center justify-center">
                      <Building size={24} className="text-[#2F4157]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-[#2F4157] text-lg">{hotel.name}</h3>
                        {hotel.approved ? (
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                            Approved
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full font-medium">
                            Pending
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm">{hotel.city}</p>
                      {hotel.vendorId && typeof hotel.vendorId === 'object' && (
                        <p className="text-gray-500 text-xs">Vendor: {hotel.vendorId.businessName}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(hotel)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(hotel)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  {/* Room Types & Pricing Display */}
                  <div>
                    <span className="text-gray-600 text-sm font-medium">Available Rooms:</span>
                    <div className="mt-1 space-y-1">
                      {hotel.roomPricing ? (
                        Object.entries(hotel.roomPricing).map(([roomType, price]) => {
                          if (price > 0) {
                            return (
                              <div key={roomType} className="flex justify-between text-sm">
                                <span className="capitalize text-gray-700">{roomType}:</span>
                                <span className="font-medium text-[#2F4157]">PKR {price}</span>
                              </div>
                            );
                          }
                          return null;
                        })
                      ) : (
                        // Backward compatibility for old data
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-700">{hotel.roomType || 'Standard'}:</span>
                          <span className="font-medium text-[#2F4157]">PKR {hotel.budget}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-medium text-sm">{hotel.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium text-sm">{hotel.email}</span>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-3">{hotel.address}</p>
                <p className="text-xs text-gray-500">Payment: {hotel.payment}</p>
              </div>
            </div>
          ))}
        </div>

        {filteredHotels.length === 0 && (
          <div className="text-center py-12">
            {loading ? (
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2F4157] mb-4"></div>
                <p className="text-gray-600">Loading hotels...</p>
              </div>
            ) : (
              <div>
                <Building size={48} className="text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No hotels found matching your search.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 backdrop-blur-xs flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto relative border border-gray-300 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#2F4157]">
                {editingHotel ? 'Edit Hotel' : 'Add New Hotel'}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-500 hover:text-gray-700 p-2 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hotel Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F4157] focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F4157] focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F4157] focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F4157] focus:border-transparent"
                    required
                  >
                    <option value="">Select City</option>
                    <option value="Lahore">Lahore</option>
                    <option value="Islamabad">Islamabad</option>
                    <option value="Karachi">Karachi</option>
                    <option value="Murree">Murree</option>
                  </select>
                </div>
                
              </div>
              
              {/* Room Types & Pricing Section */}
              <div className="col-span-full">
                <label className="block text-sm font-medium text-gray-700 mb-4">Room Types & Pricing (PKR)</label>
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <p className="text-sm text-gray-600 mb-3">Set prices for available room types (leave empty for unavailable rooms):</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Single Room</label>
                      <input
                        type="number"
                        name="roomPricing.single"
                        value={formData.roomPricing.single}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F4157] focus:border-transparent"
                        placeholder="e.g., 5000"
                        min="0"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Double Room</label>
                      <input
                        type="number"
                        name="roomPricing.double"
                        value={formData.roomPricing.double}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F4157] focus:border-transparent"
                        placeholder="e.g., 8000"
                        min="0"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Suite</label>
                      <input
                        type="number"
                        name="roomPricing.suite"
                        value={formData.roomPricing.suite}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F4157] focus:border-transparent"
                        placeholder="e.g., 18000"
                        min="0"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Family Room</label>
                      <input
                        type="number"
                        name="roomPricing.family"
                        value={formData.roomPricing.family}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F4157] focus:border-transparent"
                        placeholder="e.g., 25000"
                        min="0"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment</label>
                  <select
                    name="payment"
                    value={formData.payment}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F4157] focus:border-transparent"
                    required
                  >
                    <option value="">Select Payment Method</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="JazzCash">JazzCash</option>
                    <option value="EasyPaisa">EasyPaisa</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                </div>
                
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F4157] focus:border-transparent"
                  required
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Enter hotel description and special features..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F4157] focus:border-transparent"
                ></textarea>
                <p className="text-xs text-gray-500 mt-1">Optional: Describe the hotel's features and what makes it special</p>
              </div>

              {/* Amenities Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
                <div className="space-y-2">
                  {formData.amenities.map((amenity, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={amenity}
                        onChange={(e) => {
                          const newAmenities = [...formData.amenities];
                          newAmenities[index] = e.target.value;
                          setFormData(prev => ({ ...prev, amenities: newAmenities }));
                        }}
                        placeholder="Enter amenity (e.g., Free WiFi, Swimming Pool, Gym)"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F4157] focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newAmenities = formData.amenities.filter((_, i) => i !== index);
                          setFormData(prev => ({ ...prev, amenities: newAmenities }));
                        }}
                        className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, amenities: [...prev.amenities, ''] }));
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Plus size={16} />
                    Add Amenity
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Add hotel amenities like WiFi, Pool, Gym, Parking, etc.</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Images</label>
                <input
                  type="file"
                  name="images"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F4157] focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Select multiple images (max 10)</p>
                
                {/* Image Preview */}
                {imagePreview.length > 0 && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image Preview
                    </label>
                    <div className="grid grid-cols-3 gap-4">
                      {imagePreview.map((url, index) => (
                        <div key={index} className="relative">
                          <img
                            src={url}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border border-gray-300"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-[#2F4157] text-white py-3 px-4 rounded-lg hover:bg-[#1e2d3d] transition-colors"
                >
                  {editingHotel ? 'Update Hotel' : 'Add Hotel'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelOnboarding;
