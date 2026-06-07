import React, { useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

// Mock data - this would typically come from props or API
const mockRestaurants = [
  {
    id: 1,
    name: "Monal Restaurant",
    rating: 4.5,
    reviews: 127,
    location: "Islamabad Hills National Park, Islamabad",
    description:
      "Perched in the Margalla Hills, Monal Restaurant offers stunning views, exquisite menu of Pakistan's viral and continental dishes, and a vibrant ambiance perfect for family dinners, celebrations, and romantic evenings.",
    startingPrice: "PKR 2500",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop",
    type: "restaurant",
  },
  {
    id: 2,
    name: "Golden Chick Restaurant",
    rating: 4.1,
    reviews: 246,
    location: "6 block Commercial Area, DHA Phase 5 Lahore",
    description:
      "Golden Chick is cuisine serves crispy fried chicken, sandwiches, and has food favourites as a taste, casual setting. It's famed for its affordability, quick service, and family-friendly atmosphere with flavors.",
    startingPrice: "PKR 1500",
    image:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop",
    type: "restaurant",
  },
  {
    id: 3,
    name: "Kunthar View Restaurant",
    rating: 4.1,
    reviews: 445,
    location: "Hunza Valley Skardu Swann Street",
    description:
      "Kunthar View Restaurant offers breathtaking river views, delicious Pakistani and continental cuisine in a scenic setting, catering to tourists in Skardu. It's popular for its fresh trout, diverse milestones, and family-friendly dining experiences by the valley.",
    startingPrice: "PKR 1800",
    image:
      "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=300&fit=crop",
    type: "restaurant",
  },
  {
    id: 4,
    name: "Haveli Restaurant",
    rating: 4.7,
    reviews: 305,
    location: "Shalimar Town Black N. Grand Food, Lahore",
    description:
      "Haveli Restaurant, known for its authentic Punjabi cuisine, combines Mughal-era charm, rooftop dining, and stunning Pakistan's heritage views, a perfect place for enjoying rich flavors of traditional Pakistani dishes in an elegant setting.",
    startingPrice: "PKR 2000",
    image:
      "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=400&h=300&fit=crop",
    type: "restaurant",
  },
];

const mockFilters = {
  city: ["Islamabad", "Lahore", "Karachi", "Multan"],
  budget: [
    { label: "PKR 1000 - 2000", value: "1000-2000" },
    { label: "PKR 2000 - 5000", value: "2000-5000" },
    { label: "PKR 5000+", value: "5000-plus" },
  ],
  diningType: ["Family", "Casual", "Fine Dining", "Rooftop"],
};

// Reusable Filter Component
const FilterSection = ({
  title,
  options,
  selectedValue,
  onChange,
  filterKey,
  type = "radio",
}) => {
  return (
    <div className="mb-6">
      <h3 className="font-semibold text-gray-800 mb-3 text-sm">{title}</h3>
      <div className="space-y-2">
        {options.map((option, index) => {
          const value = typeof option === "object" ? option.value : option;
          const label = typeof option === "object" ? option.label : option;

          return (
            <label
              key={index}
              className="flex items-center text-sm text-gray-600 cursor-pointer"
            >
              <input
                type={type}
                name={filterKey}
                value={value}
                checked={selectedValue === value}
                onChange={(e) => onChange(filterKey, e.target.value)}
                className="mr-2 accent-blue-900"
              />
              <span>{label}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
};

// Reusable Card Component - Shows only schema fields
const BookingCard = ({ item, onBookNow }) => {
  // Render service-specific details based on schema fields
  const renderServiceDetails = () => {
    switch (item.type) {
      case 'hotel':
        return (
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span className="text-gray-600">City:</span>
              <span className="font-medium text-gray-900">{item.city}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Room Type:</span>
              <span className="font-medium text-gray-900">{item.roomType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Payment:</span>
              <span className="font-medium text-gray-900">{item.payment}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Phone:</span>
              <span className="font-medium text-gray-900">{item.phone}</span>
            </div>
            {item.amenities && item.amenities.length > 0 && (
              <div className="mt-3">
                <span className="text-gray-600 text-sm font-medium">Amenities:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {item.amenities.map((amenity, index) => (
                    <span
                      key={index}
                      className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'restaurant':
        return (
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span className="text-gray-600">City:</span>
              <span className="font-medium text-gray-900">{item.city}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Dining Type:</span>
              <span className="font-medium text-gray-900">{item.diningType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Phone:</span>
              <span className="font-medium text-gray-900">{item.phone}</span>
            </div>
            {item.amenities && item.amenities.length > 0 && (
              <div className="mt-3">
                <span className="text-gray-600 text-sm font-medium">Amenities:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {item.amenities.map((amenity, index) => (
                    <span
                      key={index}
                      className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'transport':
        return (
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Capacity:</span>
              <span className="font-medium text-gray-900">{item.capacity}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Duration:</span>
              <span className="font-medium text-gray-900">{item.rentalDuration}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Driver:</span>
              <span className="font-medium text-gray-900">{item.driverDisplay}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Phone:</span>
              <span className="font-medium text-gray-900">{item.phone}</span>
            </div>
            {item.amenities && item.amenities.length > 0 && (
              <div className="mt-3">
                <span className="text-gray-600 text-sm font-medium">Amenities:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {item.amenities.map((amenity, index) => (
                    <span
                      key={index}
                      className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'trip-organizer':
        return (
          <div className="space-y-2 mb-4">
            <div>
              <span className="text-gray-600 block">Tour Packages:</span>
              <div className="mt-1 space-y-1">
                {Array.isArray(item.tourOptions) && item.tourOptions.length ? (
                  item.tourOptions.map((option, index) => (
                    <div key={index} className="flex justify-between text-sm text-gray-900">
                      <span>{option.type || option.name}</span>
                      <span>{option.price || `PKR ${Number(option.priceValue ?? 0).toLocaleString()}`}</span>
                    </div>
                  ))
                ) : (
                  <span className="font-medium text-gray-900">{item.tourType || '—'}</span>
                )}
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Gender:</span>
              <span className="font-medium text-gray-900">{item.gender}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Availability:</span>
              <span className="font-medium text-gray-900">{item.availability}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Phone:</span>
              <span className="font-medium text-gray-900">{item.phone}</span>
            </div>
            {item.amenities && item.amenities.length > 0 && (
              <div className="mt-3">
                <span className="text-gray-600 text-sm font-medium">Services Included:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {item.amenities.map((amenity, index) => (
                    <span
                      key={index}
                      className="inline-block bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  // Get price display based on service type
  const getPriceDisplay = () => {
    return item.priceDisplay || `PKR ${item.budget || item.priceRange || 'N/A'}`;
  };

  // Get location display based on service type
  const getLocationDisplay = () => {
    return item.location || item.fullLocation || `${item.address}`;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
      <div className="flex">
        {/* Image Section */}
        <div className="w-80 h-58 flex-shrink-0 p-4">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover rounded-xl"
            onError={(e) => {
              const defaultImages = {
                hotel: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=300&fit=crop',
                restaurant: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
                transport: 'https://images.unsplash.com/photo-1549924231-f129b911e442?w=400&h=300&fit=crop',
                'trip-organizer': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
              };
              e.target.src = defaultImages[item.type] || defaultImages.hotel;
            }}
          />
        </div>

        {/* Content Section */}
        <div className="flex-1 p-6">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-xl font-semibold text-gray-900">{item.name}</h3>
          </div>

          {/* Location */}
          <p className="text-sm text-gray-600 mb-3">{getLocationDisplay()}</p>

          {/* Service-specific details */}
          {renderServiceDetails()}

          {/* Description */}
          {item.description && (
            <p className="text-sm text-gray-700 mb-4 leading-relaxed">
              {item.description}
            </p>
          )}

          {/* Price and Book Button */}
          <div className="flex justify-between items-center">
            <div>
              <span className="text-xs text-gray-500">Price: </span>
              <span className="font-bold text-gray-900">
                {getPriceDisplay()}
              </span>
            </div>
            <button
              onClick={() => onBookNow(item)}
              className="bg-slate-700 hover:bg-slate-800 text-white px-6 py-2 rounded-full text-sm font-medium transition-colors duration-200"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, 5);
      } else if (currentPage >= totalPages - 2) {
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pages.push(i);
        }
      }
    }

    return pages;
  };

  return (
    <div className="flex justify-center items-center mt-8 space-x-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-10 h-10 rounded-full bg-white border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 flex items-center justify-center"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {getPageNumbers().map((pageNum) => (
        <button
          key={pageNum}
          onClick={() => onPageChange(pageNum)}
          className={`w-10 h-10 rounded-full text-sm font-medium transition-colors flex items-center justify-center ${
            currentPage === pageNum
              ? "bg-slate-700 text-white"
              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
        >
          {pageNum}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-10 h-10 rounded-full bg-white border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 flex items-center justify-center"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

// Main Reusable Booking Component
export const BookingComponent = ({
  title = "Book Top Restaurants & Taste the Finest Flavors",
  subtitle = "Browse top restaurants across Pakistan, from fine dining experiences to casual spots everyone loves to visit.",
  breadcrumbs = [{ label: "Home", href: "/" }, { label: "Best Restaurants" }],
  items = mockRestaurants,
  filters = mockFilters,
  itemsPerPage = 4,
  onItemBook = (item) => console.log("Book item:", item),
  sortOptions = [
    { value: "name-asc", label: "Name A-Z" },
    { value: "name-desc", label: "Name Z-A" },
    { value: "rating-desc", label: "Rating High to Low" },
    { value: "price-asc", label: "Price Low to High" },
  ],
  error = null,
}) => {
  const [selectedFilters, setSelectedFilters] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name-asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredItems, setFilteredItems] = useState(items);

  // Filter and sort logic
  useEffect(() => {
    let filtered = [...items];

    // Apply filters
    Object.entries(selectedFilters).forEach(([filterKey, filterValue]) => {
      if (filterValue) {
        filtered = filtered.filter((item) => {
          switch (filterKey) {
            case "city":
              return item.city?.toLowerCase() === filterValue.toLowerCase() ||
                     item.location?.toLowerCase().includes(filterValue.toLowerCase());
            
            case "budget": {
              const [min, max] = filterValue.split('-').map(v => 
                v === 'plus' ? Infinity : parseInt(v)
              );
              const itemBudget = item.budget || item.priceRange || 0;
              return itemBudget >= min && (max === Infinity || itemBudget <= max);
            }
            
            case "roomType":
              return item.roomType?.toLowerCase() === filterValue.toLowerCase();
            
            case "payment":
              return item.payment?.toLowerCase() === filterValue.toLowerCase();
            
            case "diningType":
              return item.diningType?.toLowerCase() === filterValue.toLowerCase();
            
            case "location":
              return item.location?.toLowerCase() === filterValue.toLowerCase() ||
                     item.fullLocation?.toLowerCase().includes(filterValue.toLowerCase());
            
            case "vehicleType":
              return item.vehicleType?.toLowerCase() === filterValue.toLowerCase();
            
            case "rentalType":
              return item.rentalDuration?.toLowerCase() === filterValue.toLowerCase();
            
            case "capacity":
              return item.capacity?.includes(filterValue) || 
                     filterValue.includes(item.capacity);
            
            case "company":
              return item.name?.toLowerCase().includes(filterValue.toLowerCase());
            
            case "rentalLocation":
              return item.location?.toLowerCase().includes(filterValue.toLowerCase());
            
            case "driver": {
              const hasDriver = item.driver === true || item.driverDisplay === "With Driver";
              return (filterValue === "With Driver" && hasDriver) ||
                     (filterValue === "Self Drive" && !hasDriver);
            }
            
            case "priceRange": {
              const [priceMin, priceMax] = filterValue.split('-').map(v => 
                v === 'plus' ? Infinity : parseInt(v)
              );
              const orgPrice = item.priceRange || 0;
              return orgPrice >= priceMin && (priceMax === Infinity || orgPrice <= priceMax);
            }
            
            case "availability":
              return item.availability?.toLowerCase() === filterValue.toLowerCase();
            
            case "gender":
              return item.gender?.toLowerCase() === filterValue.toLowerCase();
            
            case "tourType":
              return item.tourType?.toLowerCase() === filterValue.toLowerCase();
            
            default:
              return true;
          }
        });
      }
    });

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "price-asc": {
          const priceA = a.budget || a.priceRange || 0;
          const priceB = b.budget || b.priceRange || 0;
          return priceA - priceB;
        }
        case "price-desc": {
          const priceDescA = a.budget || a.priceRange || 0;
          const priceDescB = b.budget || b.priceRange || 0;
          return priceDescB - priceDescA;
        }
        case "city-asc":
          return (a.city || '').localeCompare(b.city || '');
        case "newest":
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        case "oldest":
          return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
        default:
          return 0;
      }
    });

    setFilteredItems(filtered);
    setCurrentPage(1);
  }, [selectedFilters, searchTerm, sortBy, items]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleFilterChange = (filterType, value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const handleClearAllFilters = () => {
    setSelectedFilters({});
  };

  return (
    <div className="min-h-screen bg-orange-50">
      <div className="container mx-auto px-10 py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={index}>
              {index > 0 && <span>{">"}</span>}
              {crumb.href ? (
                <a href={crumb.href} className="hover:text-gray-800">
                  {crumb.label}
                </a>
              ) : (
                <span className="text-gray-800 font-medium">{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{title}</h1>
          <p className="text-gray-600 max-w-2xl">{subtitle}</p>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-gray-800 text-lg">
                  FILTER
                </h2>
                <button
                  onClick={handleClearAllFilters}
                  className="text-sm text-red-600 hover:text-red-800 font-medium transition-colors duration-200 hover:underline"
                >
                  Clear All
                </button>
              </div>

              {Object.entries(filters).map(
                ([filterKey, filterOptions], index) => (
                  <div key={filterKey}>
                    <FilterSection
                      title={
                        filterKey.charAt(0).toUpperCase() +
                        filterKey.slice(1).replace(/([A-Z])/g, " $1")
                      }
                      options={filterOptions}
                      selectedValue={selectedFilters[filterKey]}
                      onChange={handleFilterChange}
                      filterKey={filterKey}
                    />
                    {index < Object.entries(filters).length - 1 && (
                      <div className="border-b border-gray-300 mb-4"></div>
                    )}
                  </div>
                )
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search and Sort Controls */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search Here..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="ml-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border bg-white border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Items Grid */}
            <div className="space-y-6">
              {paginatedItems.length > 0 ? (
                paginatedItems.map((item) => (
                  <BookingCard
                    key={item.id}
                    item={item}
                    onBookNow={onItemBook}
                  />
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">
                    No items match your criteria. Please adjust your filters.
                  </p>
                </div>
              )}
            </div>

            {/* Circular Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default BookingComponent;
// Example usage with custom props
// export default function App() {
//   const handleBooking = (item) => {
//     // Navigate to detail page - you would implement your routing logic here
//     alert(
//       `Booking ${item.name}. In a real app, this would navigate to a detail page.`
//     );
//     // Example: navigate(`/restaurant/${item.id}`) or router.push(`/restaurant/${item.id}`)
//   };

//   return <BookingComponent onItemBook={handleBooking} />;
// }
