const API_BASE_URL = import.meta.env.VITE_SERVER_BASE_URL;
const apiRequest = async (endpoint, options = {}) => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      // Try to parse error response
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { message: `HTTP error! status: ${response.status}` };
      }
      
      // Create error with response data
      const error = new Error(errorData.message || `HTTP error! status: ${response.status}`);
      error.response = { data: errorData, status: response.status };
      throw error;
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

export const hotelAPI = {
  getAll: async () => {
    try {
      const response = await apiRequest('/hotels');
      return response;
    } catch (error) {
      console.error('Error fetching hotels:', error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await apiRequest(`/hotels/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching hotel:', error);
      throw error;
    }
  },
};

export const restaurantAPI = {
  getAll: async () => {
    try {
      const response = await apiRequest('/restaurants');
      return response;
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await apiRequest(`/restaurants/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching restaurant:', error);
      throw error;
    }
  },
};

export const transportAPI = {
  getAll: async () => {
    try {
      const response = await apiRequest('/transports');
      return response;
    } catch (error) {
      console.error('Error fetching transports:', error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await apiRequest(`/transports/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching transport:', error);
      throw error;
    }
  },
};

export const tripOrganizerAPI = {
  getAll: async () => {
    try {
      const response = await apiRequest('/trip-organizers');
      return response;
    } catch (error) {
      console.error('Error fetching trip organizers:', error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await apiRequest(`/trip-organizers/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching trip organizer:', error);
      throw error;
    }
  },
};

export const businessAPI = {
  create: async (businessData) => {
    try {
      const response = await apiRequest('/businesses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(businessData),
      });
      return response;
    } catch (error) {
      console.error('Error creating business registration:', error);
      throw error;
    }
  },

  getAll: async () => {
    try {
      const response = await apiRequest('/businesses');
      return response;
    } catch (error) {
      console.error('Error fetching businesses:', error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await apiRequest(`/businesses/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching business:', error);
      throw error;
    }
  },

  getByType: async (type) => {
    try {
      const response = await apiRequest(`/businesses/type/${type}`);
      return response;
    } catch (error) {
      console.error('Error fetching businesses by type:', error);
      throw error;
    }
  },
};

export const bookingAPI = {
  create: async (bookingData) => {
    try {
      const response = await apiRequest('/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });
      return response;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  },

  getAll: async () => {
    try {
      const response = await apiRequest('/bookings');
      return response;
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await apiRequest(`/bookings/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching booking:', error);
      throw error;
    }
  },

  getHotelBookedDates: async (hotelName) => {
    try {
      const response = await apiRequest(`/bookings/hotel/${encodeURIComponent(hotelName)}/booked-dates`);
      return response;
    } catch (error) {
      console.error('Error fetching hotel booked dates:', error);
      throw error;
    }
  },

  getRestaurantTimeSlots: async (restaurantName, date) => {
    try {
      const response = await apiRequest(`/bookings/restaurant/${encodeURIComponent(restaurantName)}/time-slots?date=${date}`);
      return response;
    } catch (error) {
      console.error('Error fetching restaurant time slots:', error);
      throw error;
    }
  },
};

export const chatAPI = {
  sendMessage: async (message) => {
    try {
      const response = await apiRequest('/chat/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });
      return response;
    } catch (error) {
      console.error('Error sending chat message:', error);
      throw error;
    }
  },
};

export const serviceAPI = {
  hotels: hotelAPI,
  restaurants: restaurantAPI,
  transports: transportAPI,
  tripOrganizers: tripOrganizerAPI,
  businesses: businessAPI,
  bookings: bookingAPI,
  chat: chatAPI,
};
export const transformServiceData = (backendData, serviceType) => {
  if (!backendData || !Array.isArray(backendData)) {
    return [];
  }

  return backendData.map(item => {
    const transformed = {
      id: item._id || item.id,
      name: item.name,
      email: item.email,
      phone: item.phone,
      address: item.address,
      description: item.description || generateDescription(item, serviceType),
      image: getServiceImage(item, serviceType),
      images: item.images || [],
      type: serviceType,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      amenities: Array.isArray(item.amenities)
        ? item.amenities
        : (typeof item.amenities === 'string' && item.amenities.length > 0
          ? [item.amenities]
          : []),
    };
    switch (serviceType) {
      case 'hotel':
        // Handle both new roomPricing structure and old budget/roomType for backward compatibility
        let basePrice = 0;
        let roomTypes = [];
        
        if (item.roomPricing) {
          // New structure - multiple room types with pricing
          Object.entries(item.roomPricing).forEach(([roomType, price]) => {
            if (price > 0) {
              // Format room type names properly
              let displayName = roomType.charAt(0).toUpperCase() + roomType.slice(1);
              if (roomType === 'family') displayName = 'Family Room';
              
              roomTypes.push({
                type: displayName,
                price: `PKR ${price}`,
                selected: basePrice === 0 // First available room type is selected
              });
              if (basePrice === 0) basePrice = price; // Set base price to first available room
            }
          });
        } else if (item.budget && item.roomType) {
          // Old structure - single room type
          basePrice = item.budget;
          roomTypes.push({
            type: item.roomType,
            price: `PKR ${item.budget}`,
            selected: true
          });
        }
        
        // Fallback if no room types found
        if (roomTypes.length === 0) {
          basePrice = item.budget || 5000;
          roomTypes.push({
            type: "Standard Room",
            price: `PKR ${basePrice}`,
            selected: true
          });
        }

        return {
          ...transformed,
          city: item.city,
          budget: basePrice,
          roomType: roomTypes[0].type, // For backward compatibility
          roomTypes: roomTypes,
          payment: item.payment,
          location: `${item.address}, ${item.city}`,
          priceDisplay: `PKR ${basePrice} per night`,
        };

      case 'restaurant': {
        const diningTypes = Array.isArray(item.diningType)
          ? item.diningType
          : Array.isArray(item.diningTypes)
          ? item.diningTypes
          : item.diningType
          ? [item.diningType]
          : [];

        return {
          ...transformed,
          city: item.city,
          budget: item.budget,
          diningType: diningTypes.join(', '),
          diningTypes,
          location: `${item.address}, ${item.city}`,
          priceDisplay: `PKR ${item.budget}`,
        };
      }

      case 'transport': {
        const vehicleOptionsSource = Array.isArray(item.vehicleOptions) && item.vehicleOptions.length
          ? item.vehicleOptions
          : Array.isArray(item.vehicleTypes) && item.vehicleTypes.length
          ? item.vehicleTypes.map((name) => ({ name, price: item.budget || 0 }))
          : item.vehicleType
          ? [{ name: item.vehicleType, price: item.budget || 0 }]
          : [];

        const vehicleOptions = vehicleOptionsSource.map((option) => {
          const name = option.name || option.type || option.vehicle || option;
          const rawPrice = option.price ?? option.priceValue ?? item.budget ?? 0;
          const parsedPrice = Number(rawPrice);
          const priceValue = Number.isFinite(parsedPrice) ? parsedPrice : 0;

          return {
            name,
            priceValue,
            price: `PKR ${priceValue.toLocaleString()}`,
          };
        });

        const vehicleTypes = vehicleOptions.map((option) => option.name);

        return {
          ...transformed,
          location: item.location,
          vehicleOptions,
          vehicleTypes,
          vehicleType: vehicleTypes[0] || '',
          capacity: item.capacity,
          rentalDuration: item.rentalDuration,
          driver: item.driver,
          fullLocation: `${item.address}, ${item.location}`,
          driverDisplay: item.driver ? 'With Driver' : 'Self Drive',
          priceDisplay: vehicleOptions[0] ? vehicleOptions[0].price : `PKR ${(item.budget || 0).toLocaleString()}`,
        };
      }

      case 'trip-organizer': {
        const tourOptionsSource =
          Array.isArray(item.tourOptions) && item.tourOptions.length
            ? item.tourOptions
            : Array.isArray(item.tourTypes) && item.tourTypes.length
            ? item.tourTypes.map((name) => ({ name, price: item.priceRange || 0 }))
            : item.tourType
            ? [{ name: item.tourType, price: item.priceRange || 0 }]
            : [];

        const tourOptions = tourOptionsSource.map((option, index) => {
          const name = option.name || option.type || option.option || option;
          const rawPrice = option.price ?? option.priceValue ?? item.priceRange ?? 0;
          const parsedPrice = Number(rawPrice);
          const priceValue = Number.isFinite(parsedPrice) ? parsedPrice : 0;

          return {
            name,
            type: name,
            price: `PKR ${priceValue.toLocaleString()}`,
            priceValue,
            selected: index === 0,
          };
        });

        const tourTypes = tourOptions.map((option) => option.type);
        const fallbackPriceRange = Number(item.priceRange);
        const primaryPriceValue = tourOptions[0]?.priceValue ?? (Number.isFinite(fallbackPriceRange) ? fallbackPriceRange : 0);
        const numericPriceRange = Number(item.priceRange);

        return {
          ...transformed,
          priceRange: Number.isFinite(numericPriceRange) ? numericPriceRange : primaryPriceValue,
          availability: item.availability,
          gender: item.gender,
          tourType: tourOptions.length ? tourOptions[0].type : item.tourType,
          tourTypes,
          tourOptions,
          priceDisplay: `PKR ${primaryPriceValue.toLocaleString()} per person`,
        };
      }

      default:
        return transformed;
    }
  });
};

const generateDescription = (item, serviceType) => {
  if (item.description) return item.description;
  
  const name = item.name || 'This service';
  
  switch (serviceType) {
    case 'hotel':
      return `${name} offers comfortable accommodation in ${item.city || 'a prime location'} with ${item.roomType || 'quality'} rooms. Perfect for travelers seeking ${item.payment || 'convenient'} payment options and excellent hospitality.`;
    
    case 'restaurant':
      return `${name} offers memorable dining experiences in ${item.city || 'a convenient area'} with a ${item.diningType || 'welcoming'} atmosphere. It's perfect for food lovers seeking authentic flavors.`;
    
    case 'transport':
      return `${name} provides reliable ${item.vehicleType || 'vehicle'} transportation services with ${item.capacity || 'comfortable'} seating capacity. ${item.driver ? 'Professional driver included' : 'Self-drive option available'} for ${item.rentalDuration || 'flexible'} rental periods.`;
    
    case 'trip-organizer':
      return `${name} specializes in ${item.tourType || 'customized'} tours with expertise in creating memorable travel experiences. Available for ${item.gender || 'all'} groups with ${item.availability || 'flexible'} scheduling options.`;
    
    default:
      return 'Quality service provider offering excellent customer experience.';
  }
};

const getServiceImage = (item, serviceType) => {
  if (item.images && Array.isArray(item.images) && item.images.length > 0) {
    const serverBaseURL = 'http://localhost:8080';
    const imageName = item.images[0];
    
    let imageUrl;
    if (imageName && imageName.startsWith('http')) {
      imageUrl = imageName;
    } else if (imageName) {
      const cleanImageName = imageName.replace(/^\//, '');
      imageUrl = `${serverBaseURL}/uploads/${cleanImageName}`;
    } else {
      return getDefaultImage(serviceType);
    }
    
    return imageUrl;
  } else {
    return getDefaultImage(serviceType);
  }
};

const getDefaultImage = (serviceType) => {
  const defaultImages = {
    hotel: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=300&fit=crop',
    restaurant: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
    transport: 'https://images.unsplash.com/photo-1549924231-f129b911e442?w=400&h=300&fit=crop',
    'trip-organizer': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
  };
  
  return defaultImages[serviceType] || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop';
};

export default serviceAPI;
