import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Edit, Trash2, Search, Star, Users, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { tripOrganizerAPI } from '../services/api';

const tourTypeOptions = [
  'Adventure',
  'Cultural',
  'Religious',
  'Family',
  'Photography',
];

const TripOrganizerOnboarding = () => {
  const [organizers, setOrganizers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingOrganizer, setEditingOrganizer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTourType, setFilterTourType] = useState('');
  const [filterApproval, setFilterApproval] = useState('all'); // 'all', 'pending', 'approved'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    priceRange: '',
    availability: '',
    gender: '',
    tourOptions: [],
    description: '',
    amenities: [],
    images: []
  });
  const [imagePreview, setImagePreview] = useState([]);

  // Fetch trip organizers from API
  const fetchOrganizers = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await tripOrganizerAPI.getAll();
      setOrganizers(response.tripOrganizers || response || []);
    } catch (error) {
      console.error('Error fetching trip organizers:', error);
      setError('Failed to fetch trip organizers. Please try again.');
      setOrganizers([]);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchOrganizers();
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleTourOptionToggle = (name) => {
    setFormData((prev) => {
      const existing = (prev.tourOptions || []).find((option) => option.name === name);

      if (existing) {
        return {
          ...prev,
          tourOptions: prev.tourOptions.filter((option) => option.name !== name),
        };
      }

      return {
        ...prev,
        tourOptions: [
          ...(prev.tourOptions || []),
          { name, price: '' },
        ],
      };
    });
  };

  const handleTourOptionPriceChange = (name, value) => {
    setFormData((prev) => {
      const updated = (prev.tourOptions || []).map((option) =>
        option.name === name ? { ...option, price: value } : option
      );
      return { ...prev, tourOptions: updated };
    });
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
      
      const tourOptionsPayload = (formData.tourOptions || [])
        .map((option) => ({
          name: option.name?.trim(),
          price: option.price ? parseInt(option.price, 10) || 0 : 0,
        }))
        .filter((option) => option.name);

      const uniqueTourOptions = [];
      const seenTourNames = new Set();
      tourOptionsPayload.forEach((option) => {
        if (!seenTourNames.has(option.name)) {
          seenTourNames.add(option.name);
          uniqueTourOptions.push(option);
        }
      });

      if (!uniqueTourOptions.length) {
        toast.error('Please select at least one tour type');
        setLoading(false);
        return;
      }

      const amenities = (formData.amenities || [])
        .map(amenity => amenity?.trim())
        .filter(Boolean);

      const submitData = {
        ...formData,
        phone: parseInt(formData.phone, 10),
        priceRange: parseInt(formData.priceRange, 10),
        tourOptions: uniqueTourOptions,
        tourTypes: uniqueTourOptions.map((option) => option.name),
        tourType: uniqueTourOptions[0]?.name || '',
        amenities,
      };
      
      if (editingOrganizer) {
        // Update existing organizer
        await tripOrganizerAPI.update(editingOrganizer._id || editingOrganizer.id, submitData);
        toast.success('Trip Organizer updated successfully!');
      } else {
        // Add new organizer
        await tripOrganizerAPI.create(submitData);
        toast.success('Trip Organizer added successfully!');
      }
      
      // Refresh the organizers list
      await fetchOrganizers();
      resetForm();
      
    } catch (error) {
      console.error('Error saving trip organizer:', error);
      setError('Failed to save trip organizer. Please try again.');
      toast.error('Error saving trip organizer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (organizer) => {
    setEditingOrganizer(organizer);

    const existingTourOptions = Array.isArray(organizer.tourOptions) && organizer.tourOptions.length
      ? organizer.tourOptions
      : Array.isArray(organizer.tourTypes) && organizer.tourTypes.length
      ? organizer.tourTypes.map((name) => ({
          name,
          price: organizer.priceRange || 0,
        }))
      : organizer.tourType
      ? [{ name: organizer.tourType, price: organizer.priceRange || 0 }]
      : [];

    const normalizedTourOptions = existingTourOptions.map((option) => ({
      name: option.name || option.type || option,
      price:
        option.price !== undefined
          ? String(option.price)
          : option.priceValue !== undefined
          ? String(option.priceValue)
          : organizer.priceRange
          ? String(organizer.priceRange)
          : '',
    }));

    setFormData({
      ...organizer,
      phone: organizer.phone?.toString() || '',
      priceRange: organizer.priceRange?.toString() || '',
      tourOptions: normalizedTourOptions,
      amenities: Array.isArray(organizer.amenities) ? organizer.amenities : [],
    });
    
    // Set existing images for preview (if any)
    if (organizer.images && organizer.images.length > 0) {
      const existingImageUrls = organizer.images.map(img => `http://localhost:8080/uploads/${img}`);
      setImagePreview(existingImageUrls);
    } else {
      setImagePreview([]);
    }
    
    setShowModal(true);
  };

  const handleDelete = async (organizer) => {
    if (window.confirm('Are you sure you want to delete this trip organizer?')) {
      try {
        setLoading(true);
        setError('');
        
        await tripOrganizerAPI.delete(organizer._id || organizer.id);
        
        // Refresh the organizers list
        await fetchOrganizers();
        
        toast.success('Trip Organizer deleted successfully!');
      } catch (error) {
        console.error('Error deleting trip organizer:', error);
        setError('Failed to delete trip organizer. Please try again.');
        toast.error('Error deleting trip organizer. Please try again.');
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
      priceRange: '',
      availability: '',
      gender: '',
      tourOptions: [],
      description: '',
      amenities: [],
      images: null
    });
    setImagePreview([]);
    setEditingOrganizer(null);
    setShowModal(false);
    setError('');
  };

  const filteredOrganizers = organizers.filter(organizer => {
    const tourTypeText = Array.isArray(organizer.tourTypes)
      ? organizer.tourTypes.join(' ').toLowerCase()
      : (organizer.tourType || '').toLowerCase();

    const genderText = (organizer.gender || '').toLowerCase();
    const matchesSearch =
      organizer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tourTypeText.includes(searchTerm.toLowerCase()) ||
      genderText.includes(searchTerm.toLowerCase());
    
    const matchesApproval = filterApproval === 'all' || 
                           (filterApproval === 'pending' && !organizer.approved) ||
                           (filterApproval === 'approved' && organizer.approved);
    
    const matchesTourType =
      filterTourType === '' ||
      (Array.isArray(organizer.tourTypes)
        ? organizer.tourTypes.includes(filterTourType)
        : organizer.tourType === filterTourType);
    
    return matchesSearch && matchesTourType && matchesApproval;
  });

  return (
    <div className="p-10 bg-gray-50 min-h-screen">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#2F4157] mb-2">Trip Organizer Onboarding</h1>
          
          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <p className="text-gray-600">Manage trip organizer listings and registrations</p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6 border border-gray-200">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-1 gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search organizers by name, tour type, or gender..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F4157] focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="relative">
                <select
                  value={filterTourType}
                  onChange={(e) => setFilterTourType(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F4157] focus:border-transparent bg-white min-w-[140px]"
                >
                  <option value="">All Tour Types</option>
                  {tourTypeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="relative">
                <select
                  value={filterApproval}
                  onChange={(e) => setFilterApproval(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F4157] focus:border-transparent bg-white"
                >
                  <option value="all">All Organizers</option>
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
              Add New Organizer
            </button>
          </div>
        </div>

        {/* Organizers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrganizers.map((organizer) => (
            <div key={organizer.id} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="p-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#d8e5ee] rounded-lg flex items-center justify-center">
                      <MapPin size={24} className="text-[#2F4157]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-[#2F4157] text-lg">{organizer.name}</h3>
                        {organizer.approved ? (
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                            Approved
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full font-medium">
                            Pending
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm">{organizer.location || organizer.address}</p>
                      {organizer.vendorId && typeof organizer.vendorId === 'object' && (
                        <p className="text-gray-500 text-xs">Vendor: {organizer.vendorId.businessName}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(organizer)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(organizer)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div>
                    <span className="text-gray-600 text-sm font-medium block mb-1">Tour Packages:</span>
                    <div className="text-right text-sm text-gray-900 space-y-1">
                      {Array.isArray(organizer.tourOptions) && organizer.tourOptions.length ? (
                        organizer.tourOptions.map((option, idx) => {
                          const rawPrice = option.price ?? option.priceValue ?? 0;
                          const parsedPrice = Number(rawPrice);
                          const priceDisplay = Number.isFinite(parsedPrice)
                            ? `PKR ${parsedPrice.toLocaleString()}`
                            : 'PKR 0';

                          return (
                            <div key={idx}>
                              {option.name || option.type || '—'}
                              {' - '}
                              {priceDisplay}
                            </div>
                          );
                        })
                      ) : (
                        <span>{organizer.tourType || '—'}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Gender:</span>
                    <span className="font-medium text-sm">{organizer.gender}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price Range:</span>
                    <span className="font-medium text-[#2F4157]">PKR {organizer.priceRange}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Availability:</span>
                    <span className="font-medium text-sm">{organizer.availability}</span>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-3">{organizer.address}</p>
                <div className="space-y-1">
                  <p className="text-xs text-gray-500">Phone: {organizer.phone}</p>
                  <p className="text-xs text-gray-500">Email: {organizer.email}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredOrganizers.length === 0 && (
          <div className="text-center py-12">
            {loading ? (
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2F4157] mb-4"></div>
                <p className="text-gray-600">Loading trip organizers...</p>
              </div>
            ) : (
              <div>
                <MapPin size={48} className="text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No trip organizers found matching your search.</p>
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
                {editingOrganizer ? 'Edit Trip Organizer' : 'Add New Trip Organizer'}
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Organization Name</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price Range (PKR)</label>
                  <select
                    name="priceRange"
                    value={formData.priceRange}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F4157] focus:border-transparent"
                    required
                  >
                    <option value="">Select Price Range</option>
                    <option value="5000">5000</option>
                    <option value="8000">8000</option>
                    <option value="12000">12000</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
                  <select
                    name="availability"
                    value={formData.availability}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F4157] focus:border-transparent"
                    required
                  >
                    <option value="">Select Availability</option>
                    <option value="Available Today">Available Today</option>
                    <option value="Summer Tours">Summer Tours</option>
                    <option value="Winter Tours">Winter Tours</option>
                    <option value="Year Round">Year Round</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F4157] focus:border-transparent"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Mixed Groups">Mixed Groups</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tour Types & Pricing</label>
                  <div className="grid grid-cols-1 gap-2">
                    {tourTypeOptions.map((option) => (
                      <label key={option} className="flex items-center space-x-2 text-sm text-gray-700">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-[#2F4157]"
                          checked={(formData.tourOptions || []).some((item) => item.name === option)}
                          onChange={() => handleTourOptionToggle(option)}
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                  {formData.tourOptions && formData.tourOptions.length > 0 && (
                    <div className="mt-4 space-y-3">
                      {formData.tourOptions.map((option) => (
                        <div
                          key={option.name}
                          className="grid grid-cols-1 md:grid-cols-2 gap-3 border border-gray-200 rounded-lg p-3"
                        >
                          <span className="font-medium text-gray-700">{option.name}</span>
                          <input
                            type="number"
                            min="0"
                            value={option.price}
                            onChange={(e) => handleTourOptionPriceChange(option.name, e.target.value)}
                            placeholder="Price (PKR)"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F4157] focus:border-transparent"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    Select one or more tour types and set a price. Leave blank to keep the price at PKR 0.
                  </p>
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
                  placeholder="Enter trip organizer description, specialties, and tour experiences offered..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F4157] focus:border-transparent"
                ></textarea>
                <p className="text-xs text-gray-500 mt-1">Optional: Describe your tour specialties, experience, and what makes your tours unique</p>
              </div>

              {/* Amenities Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amenities & Services</label>
                <div className="space-y-2">
                  {(formData.amenities || []).map((amenity, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={amenity}
                        onChange={(e) => {
                          const updated = [...(formData.amenities || [])];
                          updated[index] = e.target.value;
                          setFormData((prev) => ({ ...prev, amenities: updated }));
                        }}
                        placeholder="Enter amenity (e.g., Guided Tours, Transportation, Meals)"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F4157] focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = (formData.amenities || []).filter((_, i) => i !== index);
                          setFormData((prev) => ({ ...prev, amenities: updated }));
                        }}
                        className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        amenities: [...(prev.amenities || []), ''],
                      }))
                    }
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Plus size={16} />
                    Add Amenity
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Add services included like Guided Tours, Transportation, Meals, Accommodation, etc.
                </p>
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
                  {editingOrganizer ? 'Update Organizer' : 'Add Organizer'}
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

export default TripOrganizerOnboarding;
