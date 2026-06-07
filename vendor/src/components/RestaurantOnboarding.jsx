import React, { useState, useEffect } from 'react';
import { UtensilsCrossed, Plus, Edit, Trash2, Search, Star, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { restaurantAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const diningTypeOptions = [
  'Family',
  'Casual',
  'Fine Dining',
  'Rooftop',
];

const RestaurantOnboarding = () => {
  const { vendor } = useAuth();
  const [restaurants, setRestaurants] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCity, setFilterCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    googleMapsLocation: '',
    city: '',
    budget: '',
    diningTypes: [],
    customDiningTypes: [],
    description: '',
    amenities: [],
    images: []
  });
  const [imagePreview, setImagePreview] = useState([]);

  // Fetch restaurants from API
  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      setError('');
      // Fetch restaurants filtered by vendorId
      const vendorId = vendor?._id || vendor?.id;
      const response = await restaurantAPI.getByVendorId(vendorId);
      const vendorRestaurants = response.restaurants || response || [];
      setRestaurants(vendorRestaurants);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      setError('Failed to fetch restaurants. Please try again.');
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleDiningTypeToggle = (value) => {
    setFormData((prev) => {
      const selected = new Set(prev.diningTypes || []);
      if (selected.has(value)) {
        selected.delete(value);
      } else {
        selected.add(value);
      }

      return {
        ...prev,
        diningTypes: Array.from(selected),
      };
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
      
      const amenities = (formData.amenities || [])
        .map(amenity => amenity?.trim())
        .filter(Boolean);

      const customDiningTypes = (formData.customDiningTypes || [])
        .map((type) => type?.trim())
        .filter(Boolean);

      const selectedDiningTypes = formData.diningTypes || [];
      const diningTypeSet = new Set([
        ...selectedDiningTypes,
        ...customDiningTypes,
      ]);
      const diningTypeArray = Array.from(diningTypeSet);

      if (diningTypeArray.length === 0) {
        toast.error('Please select at least one dining type');
        setLoading(false);
        return;
      }

      const submitData = {
        ...formData,
        phone: parseInt(formData.phone, 10),
        budget: parseInt(formData.budget, 10),
        diningType: diningTypeArray,
        amenities,
        vendorId: vendor?._id || vendor?.id, // Include vendor ID
      };

      delete submitData.diningTypes;
      delete submitData.customDiningTypes;
      
      if (editingRestaurant) {
        // Update existing restaurant
        await restaurantAPI.update(editingRestaurant._id || editingRestaurant.id, submitData);
        toast.success('Restaurant updated successfully!');
      } else {
        // Add new restaurant
        await restaurantAPI.create(submitData);
        toast.success('Restaurant added successfully! Pending admin approval.');
      }
      
      // Refresh the restaurants list
      await fetchRestaurants();
      resetForm();
      
    } catch (error) {
      console.error('Error saving restaurant:', error);
      setError('Failed to save restaurant. Please try again.');
      toast.error('Error saving restaurant. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (restaurant) => {
    setEditingRestaurant(restaurant);
    const existingDiningTypes = Array.isArray(restaurant.diningType)
      ? restaurant.diningType
      : restaurant.diningType
      ? [restaurant.diningType]
      : [];

    const predefinedSelections = existingDiningTypes.filter((type) =>
      diningTypeOptions.includes(type)
    );

    const customSelections = existingDiningTypes.filter(
      (type) => !diningTypeOptions.includes(type)
    );

    setFormData({
      ...restaurant,
      phone: restaurant.phone?.toString() || '',
      budget: restaurant.budget?.toString() || '',
      diningTypes: predefinedSelections,
      customDiningTypes: customSelections,
      amenities: Array.isArray(restaurant.amenities) ? restaurant.amenities : [],
    });
    
    // Set existing images for preview (if any)
    if (restaurant.images && restaurant.images.length > 0) {
      const existingImageUrls = restaurant.images.map(img => `${import.meta.env.VITE_SERVER_BASE_URL ? import.meta.env.VITE_SERVER_BASE_URL.replace('/api', '') : 'http://localhost:8080'}/uploads/${img}`);
      setImagePreview(existingImageUrls);
    } else {
      setImagePreview([]);
    }
    
    setShowModal(true);
  };

  const handleDelete = async (restaurant) => {
    if (window.confirm('Are you sure you want to delete this restaurant?')) {
      try {
        setLoading(true);
        setError('');
        
        await restaurantAPI.delete(restaurant._id || restaurant.id);
        
        // Refresh the restaurants list
        await fetchRestaurants();
        
        toast.success('Restaurant deleted successfully!');
      } catch (error) {
        console.error('Error deleting restaurant:', error);
        setError('Failed to delete restaurant. Please try again.');
        toast.error('Error deleting restaurant. Please try again.');
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
      googleMapsLocation: '',
      city: '',
      budget: '',
      diningTypes: [],
      customDiningTypes: [],
      description: '',
      amenities: [],
      images: null
    });
    setImagePreview([]);
    setEditingRestaurant(null);
    setShowModal(false);
    setError('');
  };

  const filteredRestaurants = restaurants.filter(restaurant => {
    const searchLower = searchTerm.toLowerCase();
    const diningTypeText = Array.isArray(restaurant.diningType)
      ? restaurant.diningType.join(' ').toLowerCase()
      : (restaurant.diningType || '').toLowerCase();

    const matchesSearch =
      restaurant.name.toLowerCase().includes(searchLower) ||
      restaurant.city.toLowerCase().includes(searchLower) ||
      diningTypeText.includes(searchLower);
    
    const matchesCity = filterCity === '' || restaurant.city === filterCity;
    
    return matchesSearch && matchesCity;
  });

  return (
    <div className="p-10 bg-gray-50 min-h-screen">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#2F4157] mb-2">Restaurant Onboarding</h1>
          
          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <p className="text-gray-600">Manage restaurant listings and registrations</p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6 border border-gray-200">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-1 gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search restaurants by name, city, or cuisine..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F4157] focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="relative">
                <select
                  value={filterCity}
                  onChange={(e) => setFilterCity(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F4157] focus:border-transparent bg-white min-w-[120px]"
                >
                  <option value="">All Cities</option>
                  <option value="Islamabad">Islamabad</option>
                  <option value="Lahore">Lahore</option>
                  <option value="Karachi">Karachi</option>
                  <option value="Multan">Multan</option>
                </select>
              </div>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="bg-[#2F4157] text-white px-6 py-2 rounded-lg hover:bg-[#1e2d3d] transition-colors flex items-center gap-2"
            >
              <Plus size={20} />
              Add New Restaurant
            </button>
          </div>
        </div>

        {/* Restaurants Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRestaurants.map((restaurant) => (
            <div key={restaurant.id} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="p-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#d8e5ee] rounded-lg flex items-center justify-center">
                      <UtensilsCrossed size={24} className="text-[#2F4157]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-[#2F4157] text-lg">{restaurant.name}</h3>
                        {restaurant.approved ? (
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                            Approved
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full font-medium">
                            Pending
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm">{restaurant.city || restaurant.location}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(restaurant)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(restaurant)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dining Type:</span>
                    <span className="font-medium text-sm text-right">
                      {Array.isArray(restaurant.diningType)
                        ? restaurant.diningType.join(', ')
                        : restaurant.diningType || '—'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Budget:</span>
                    <span className="font-medium text-[#2F4157]">PKR {restaurant.budget}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-medium text-sm">{restaurant.phone}</span>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-3">{restaurant.address}</p>
                <p className="text-xs text-gray-500">Email: {restaurant.email}</p>
              </div>
            </div>
          ))}
        </div>

        {filteredRestaurants.length === 0 && (
          <div className="text-center py-12">
            {loading ? (
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2F4157] mb-4"></div>
                <p className="text-gray-600">Loading restaurants...</p>
              </div>
            ) : (
              <div>
                <UtensilsCrossed size={48} className="text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No restaurants found matching your search.</p>
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
                {editingRestaurant ? 'Edit Restaurant' : 'Add New Restaurant'}
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Restaurant Name</label>
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
                    <option value="Islamabad">Islamabad</option>
                    <option value="Lahore">Lahore</option>
                    <option value="Karachi">Karachi</option>
                    <option value="Multan">Multan</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Budget (PKR)</label>
                  <select
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F4157] focus:border-transparent"
                    required
                  >
                    <option value="">Select Budget</option>
                    <option value="1000">1000</option>
                    <option value="2000">2000</option>
                    <option value="5000">5000</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Dining Type</label>
					<div className="grid grid-cols-1 gap-2">
						{diningTypeOptions.map((option) => (
							<label key={option} className="flex items-center space-x-2 text-sm text-gray-700">
								<input
									type="checkbox"
									className="h-4 w-4 text-[#2F4157]"
									checked={(formData.diningTypes || []).includes(option)}
									onChange={() => handleDiningTypeToggle(option)}
								/>
								<span>{option}</span>
							</label>
						))}
					</div>
					<p className="text-xs text-gray-500 mt-2">
						Select multiple dining experiences.
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Google Maps Location</label>
                <input
                  type="text"
                  name="googleMapsLocation"
                  value={formData.googleMapsLocation || ''}
                  onChange={handleInputChange}
                  placeholder="Paste Google Maps link or coordinates (e.g. 33.6844, 73.0479)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F4157] focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Open Google Maps, drop a pin on your venue, tap Share, and paste the link here.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Enter restaurant description, specialties, and ambiance..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F4157] focus:border-transparent"
                ></textarea>
                <p className="text-xs text-gray-500 mt-1">Optional: Describe the restaurant's cuisine, atmosphere, and special features</p>
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
                        placeholder="Enter amenity (e.g., Free WiFi, Parking, Outdoor Seating)"
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
                <p className="text-xs text-gray-500 mt-1">Add restaurant amenities like WiFi, Parking, Live Music, etc.</p>
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
                  {editingRestaurant ? 'Update Restaurant' : 'Add Restaurant'}
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

export default RestaurantOnboarding;
