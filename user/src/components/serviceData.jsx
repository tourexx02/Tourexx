// Hotels Data
export const hotelsData = [
  {
    id: 1,
    name: "The Grand Palm Hotel",
    rating: 4.7,
    reviews: 156,
    location: "Islamabad",
    city: "Islamabad",
    budget: 11500,
    roomType: "Suite",
    payment: "Credit Card",
    description:
      "A luxury escape in the heart of Islamabad, The Grand Palm offers elegantly furnished rooms, rooftop dining with panoramic views, and impeccable 5-star hospitality — ideal for both corporate and leisure travelers.",
    startingPrice: "PKR 11,500 per night",
    priceDisplay: "PKR 11500 per night",
    image:
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=300&fit=crop",
    type: "hotel",
    category: "luxury",
    amenities: ["WiFi", "Pool", "Spa", "Restaurant", "Gym"],
  },
  {
    id: 2,
    name: "Royal Orchid Inn",
    rating: 4.5,
    reviews: 89,
    location: "Karachi",
    city: "Karachi",
    budget: 8500,
    roomType: "Double",
    payment: "JazzCash",
    description:
      "Experience unparalleled comfort with breathtaking mountain vistas, world-class amenities, and warm hospitality. Royal Orchid Inn offers a perfect blend of luxury and tranquility for discerning travelers seeking an unforgettable stay.",
    startingPrice: "PKR 8,500 per night",
    priceDisplay: "PKR 8500 per night",
    image:
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop",
    type: "hotel",
    category: "mid-range",
    amenities: ["WiFi", "Restaurant", "Parking", "AC"],
  },
  {
    id: 3,
    name: "Serena Palace",
    rating: 4.7,
    reviews: 234,
    location: "Swat",
    city: "Swat",
    budget: 14000,
    roomType: "Family Room",
    payment: "Bank Transfer",
    description:
      "A refined hotel experience offering delightful interiors, international cuisine, and top-class wellness services. Serena Palace provides a sophisticated retreat in the heart of Swat with a business-friendly environment.",
    startingPrice: "PKR 14,000 per night",
    priceDisplay: "PKR 14000 per night",
    image:
      "https://images.unsplash.com/photo-1578774204375-8b5be9db21ca?w=400&h=300&fit=crop",
    type: "hotel",
    category: "luxury",
    amenities: ["WiFi", "Spa", "Restaurant", "Conference Room", "Garden"],
  },
  {
    id: 4,
    name: "Mountain Crest Lodge",
    rating: 4.2,
    reviews: 167,
    location: "Murree",
    city: "Murree",
    budget: 5200,
    roomType: "Single",
    payment: "EasyPaisa",
    description:
      "Nestled in Murree's pine-covered hills, this peaceful lodge offers comfortable accommodations and traditional views, and easy access to hiking trails — an ideal spot for couples, families, or nature lovers.",
    startingPrice: "PKR 5,200 per night",
    priceDisplay: "PKR 5200 per night",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop",
    type: "hotel",
    category: "budget",
    amenities: ["WiFi", "Restaurant", "Hiking", "Mountain View"],
  },
  {
    id: 5,
    name: "Pearl Continental",
    rating: 4.6,
    reviews: 298,
    location: "Lahore",
    city: "Lahore",
    budget: 12800,
    roomType: "Double",
    payment: "Credit Card",
    description:
      "Located in the heart of Lahore, Pearl Continental combines traditional Pakistani hospitality with modern luxury. Features world-class dining, spa services, and elegant rooms for the discerning traveler.",
    startingPrice: "PKR 12,800 per night",
    priceDisplay: "PKR 12800 per night",
    image:
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400&h=300&fit=crop",
    type: "hotel",
    category: "luxury",
    amenities: ["WiFi", "Pool", "Spa", "Restaurant", "Gym"],
  },
  {
    id: 6,
    name: "Avari Hotel",
    rating: 4.4,
    reviews: 189,
    location: "Karachi",
    city: "Karachi",
    budget: 9500,
    roomType: "Suite",
    payment: "JazzCash",
    description:
      "Experience luxury and comfort at Avari Hotel Karachi. Located in the business district, it offers modern amenities, fine dining, and exceptional service for both business and leisure travelers.",
    startingPrice: "PKR 9,500 per night",
    priceDisplay: "PKR 9500 per night",
    image:
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=300&fit=crop",
    type: "hotel",
    category: "luxury",
    amenities: ["WiFi", "Pool", "Spa", "Restaurant", "Gym"],
  },
  {
    id: 7,
    name: "Nishat Hotel",
    rating: 4.3,
    reviews: 145,
    location: "Lahore",
    city: "Lahore",
    budget: 7800,
    roomType: "Family Room",
    payment: "Bank Transfer",
    description:
      "Nishat Hotel offers comfortable accommodation in the heart of Lahore. With traditional hospitality and modern amenities, it's perfect for families and business travelers seeking quality service.",
    startingPrice: "PKR 7,800 per night",
    priceDisplay: "PKR 7800 per night",
    image:
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=300&fit=crop",
    type: "hotel",
    category: "mid-range",
    amenities: ["WiFi", "Restaurant", "Parking", "AC"],
  },
];

export const hotelsFilters = {
  city: ["Lahore", "Islamabad", "Karachi", "Murree"],
  budget: [
    { label: "PKR 5000 - 10000", value: "5000-10000" },
    { label: "PKR 10000 - 15000", value: "10000-15000" },
    { label: "PKR 15000+", value: "15000-plus" },
  ],
  roomType: ["Single", "Double", "Suite", "Family Room"],
  payment: ["Credit Card", "JazzCash", "EasyPaisa", "Bank Transfer"],
};

// Transport Services Data
export const transportData = [
  {
    id: 1,
    name: "Swift Ride Rentals",
    rating: 4.8,
    reviews: 342,
    location: "Trusted Nationwide Service",
    description:
      "Premium and self-sufficient automobiles perfect for daily commutes, weekend getaways, travel for both international and couples seeking comfort and control.",
    startingPrice: "PKR 3,500/day",
    image:
      "https://images.unsplash.com/photo-1549924231-f129b911e442?w=400&h=300&fit=crop",
    type: "transport",
    category: "car-rental",
    vehicleType: "sedan",
    features: ["GPS", "AC", "Fuel Efficient", "Insurance"],
  },
  {
    id: 2,
    name: "Luxury Wheels Pakistan",
    rating: 4.7,
    reviews: 198,
    location: "Karachi - Premium Services",
    description:
      "Experience the finest in luxury vehicles, ensuring a smooth, classy ride ideal for corporate tours, weddings, or stylish intercity trips.",
    startingPrice: "PKR 12,000/day",
    image:
      "https://images.unsplash.com/photo-1563720223185-11003d516935?w=400&h=300&fit=crop",
    type: "transport",
    category: "luxury-rental",
    vehicleType: "suv",
    features: ["Chauffeur", "Luxury Interior", "Premium Sound", "WiFi"],
  },
  {
    id: 3,
    name: "Carvan Shuttle Service",
    rating: 4.5,
    reviews: 276,
    location: "Islamabad - University & Secure",
    description:
      "Spacious and reliable vans for family vacations, tour groups, and airport transfers. Designed for comfort on longer journeys with ample luggage space.",
    startingPrice: "PKR 7,000/day",
    image:
      "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=300&fit=crop",
    type: "transport",
    category: "van-rental",
    vehicleType: "van",
    features: ["Large Capacity", "AC", "Luggage Space", "GPS"],
  },
  {
    id: 4,
    name: "Metro Cab Express",
    rating: 4.3,
    reviews: 456,
    location: "Multan - 24/7 City Coverage",
    description:
      "Reliable city taxi service with fast bookings, professional drivers, and secure booking. Perfect for daily rides, errands, or quick commutes.",
    startingPrice: "PKR 25/km (min fare PKR 300)",
    image:
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop",
    type: "transport",
    category: "taxi-service",
    vehicleType: "taxi",
    features: [
      "24/7 Service",
      "Quick Booking",
      "Safe Drivers",
      "City Coverage",
    ],
  },
];

export const transportFilters = {
  location: ["Islamabad", "Karachi", "Lahore", "Multan"],
  vehicleType: ["Sedan", "SUV", "Van", "Hatchback"],
  rentalType: ["Hourly", "Daily", "Weekly", "Monthly"],
  capacity: ["1-4 Persons", "5-8 Persons", "9-15 Persons", "15+ Persons"],
  company: ["Swift Ride", "Luxury Wheels", "Carvan Shuttle", "Metro Cab"],
  rentalLocation: ["Airport", "City Center", "Hotel", "Railway Station"],
  driver: ["Self Drive", "With Driver"],
};

// Trip Organizers Data
export const tripOrganizersData = [
  {
    id: 1,
    name: "Wanderlust Tours",
    rating: 4.7,
    reviews: 289,
    location: "Adventure & Cultural Tours",
    description:
      "Wanderlust Tours is a top-rated travel company known for its exotic group expeditions, corporate retreats, and family adventures across Pakistan. With years of experience creating thousands of North to the lush valleys of Swat, they have the expertise to ensure exceptional trips guided experiences.",
    startingPrice: "PKR 5,500 per night",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    type: "trip-organizer",
    category: "adventure-tours",
    specialties: [
      "Mountain Tours",
      "Cultural Tours",
      "Group Travel",
      "Corporate Retreats",
    ],
  },
  {
    id: 2,
    name: "Explore Pakistan Trips",
    rating: 4.6,
    reviews: 156,
    location: "Islamabad - Adventure Focused",
    description:
      "Tailored by thrill seekers, Explore Pakistan Trips takes you on one-of-a-kind breathtaking adventures—trekking hiking and cultural expeditions to some of Pakistan's most captivating natural wonders. Their experienced guides and personalized itineraries ensure every journey is memorable.",
    startingPrice: "PKR 10,000 per person",
    image:
      "https://images.unsplash.com/photo-1464822759844-d150ad6d1f5f?w=400&h=300&fit=crop",
    type: "trip-organizer",
    category: "adventure-tours",
    specialties: ["Trekking", "Hiking", "Cultural Tours", "Photography Tours"],
  },
  {
    id: 3,
    name: "Travel Mate Planners",
    rating: 4.5,
    reviews: 198,
    location: "Karachi - Family & Budget Travel",
    description:
      "Travel Mate Planners offers stress-free, family-friendly group tours at affordable prices. From hotel bookings to sightseeing and transportation, they handle every detail of your Pakistan adventure with care, making them perfect for large groups and family trips.",
    startingPrice: "PKR 6,000 per person",
    image:
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop",
    type: "trip-organizer",
    category: "family-tours",
    specialties: [
      "Family Tours",
      "Budget Travel",
      "Group Tours",
      "Hotel Booking",
    ],
  },
  {
    id: 4,
    name: "Skarinama Journeys",
    rating: 4.4,
    reviews: 134,
    location: "Multan - Cultural & Religious Tours",
    description:
      "Specializing in heritage and spiritual travel, Skarinama arranges meaningful pilgrimages, historical site visits, cultural immersion tours, and religious landmarks. Their curated tours combine comfort with cultural depth, ideal for those seeking meaningful travel experiences.",
    startingPrice: "PKR 7,200 per person",
    image:
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=300&fit=crop",
    type: "trip-organizer",
    category: "cultural-tours",
    specialties: [
      "Religious Tours",
      "Heritage Sites",
      "Cultural Immersion",
      "Pilgrimage",
    ],
  },
];

export const tripOrganizersFilters = {
  priceRange: [
    { label: "PKR 5,000 - 8,000", value: "5000-8000" },
    { label: "PKR 8,000 - 12,000", value: "8000-12000" },
    { label: "PKR 12,000+", value: "12000-plus" },
  ],
  availability: [
    "Available Today",
    "Summer Tours",
    "Winter Tours",
    "Year Round",
  ],
  gender: ["Male", "Female", "Mixed Groups"],
  tourType: ["Adventure", "Cultural", "Religious", "Family", "Photography"],
};

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

// Configuration objects for each service type
export const serviceConfigs = {
  hotels: {
    title: "Book Trusted Restaurants & Dining Experiences",
    subtitle:
      "Browse verified restaurants across Pakistan, from luxury dining to budget-friendly meals.",
    breadcrumbs: [{ label: "Home", href: "/" }, { label: "Best Restaurants" }],
    data: hotelsData,
    filters: hotelsFilters,
    sortOptions: [
      { value: "name-asc", label: "Name A-Z" },
      { value: "name-desc", label: "Name Z-A" },
      { value: "price-asc", label: "Price Low to High" },
      { value: "price-desc", label: "Price High to Low" },
      { value: "city-asc", label: "City A-Z" },
      { value: "newest", label: "Newest First" },
    ],
  },
  transport: {
    title: "Find Trusted Transport Services Across Pakistan",
    subtitle:
      "Compare, book, and ride with verified transporters for your next journey, from city travel to northern adventures.",
    breadcrumbs: [{ label: "Home", href: "/" }, { label: "Transport" }],
    data: transportData,
    filters: transportFilters,
    sortOptions: [
      { value: "name-asc", label: "Name A-Z" },
      { value: "name-desc", label: "Name Z-A" },
      { value: "price-asc", label: "Price Low to High" },
      { value: "price-desc", label: "Price High to Low" },
      { value: "city-asc", label: "City A-Z" },
      { value: "newest", label: "Newest First" },
    ],
  },
  tripOrganizers: {
    title: "Plan Your Journey with Trusted Experts",
    subtitle:
      "Browse experienced tour planners offering curated trips for northern areas, deserts, historical sites, and more.",
    breadcrumbs: [{ label: "Home", href: "/" }, { label: "Trip Organizers" }],
    data: tripOrganizersData,
    filters: tripOrganizersFilters,
    sortOptions: [
      { value: "name-asc", label: "Name A-Z" },
      { value: "name-desc", label: "Name Z-A" },
      { value: "price-asc", label: "Price Low to High" },
      { value: "price-desc", label: "Price High to Low" },
      { value: "city-asc", label: "City A-Z" },
      { value: "newest", label: "Newest First" },
    ],
  },
  resturants: {
    title: "Book Trusted Hotels & Comfortable Stays",
    subtitle:
      "Browse verified hotels across Pakistan, from luxury stays to budget-friendly rooms.",
    breadcrumbs: [{ label: "Home", href: "/" }, { label: "Best Hotels" }],
    data: mockRestaurants,
    filters: mockFilters,
    sortOptions: [
      { value: "name-asc", label: "Name A-Z" },
      { value: "name-desc", label: "Name Z-A" },
      { value: "price-asc", label: "Price Low to High" },
      { value: "price-desc", label: "Price High to Low" },
      { value: "city-asc", label: "City A-Z" },
      { value: "newest", label: "Newest First" },
    ],
  },
};

// Example usage in your components:
/*
// For Hotels Page
import { BookingComponent } from './BookingComponent';
import { serviceConfigs } from './serviceData';

const HotelsPage = () => {
  const config = serviceConfigs.hotels;
  
  const handleBooking = (hotel) => {
    // Navigate to hotel detail page
    navigate(`/hotels/${hotel.id}`);
  };

  return (
    <BookingComponent
      title={config.title}
      subtitle={config.subtitle}
      breadcrumbs={config.breadcrumbs}
      items={config.data}
      filters={config.filters}
      sortOptions={config.sortOptions}
      onItemBook={handleBooking}
      itemsPerPage={4}
    />
  );
};

// For Transport Page
const TransportPage = () => {
  const config = serviceConfigs.transport;
  
  const handleBooking = (transport) => {
    navigate(`/transport/${transport.id}`);
  };

  return (
    <BookingComponent
      title={config.title}
      subtitle={config.subtitle}
      breadcrumbs={config.breadcrumbs}
      items={config.data}
      filters={config.filters}
      sortOptions={config.sortOptions}
      onItemBook={handleBooking}
    />
  );
};

// For Trip Organizers Page
const TripOrganizersPage = () => {
  const config = serviceConfigs.tripOrganizers;
  
  const handleBooking = (organizer) => {
    navigate(`/trip-organizers/${organizer.id}`);
  };

  return (
    <BookingComponent
      title={config.title}
      subtitle={config.subtitle}
      breadcrumbs={config.breadcrumbs}
      items={config.data}
      filters={config.filters}
      sortOptions={config.sortOptions}
      onItemBook={handleBooking}
    />
  );
};
*/
