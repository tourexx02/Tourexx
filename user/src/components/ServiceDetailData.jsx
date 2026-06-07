// // Service Data Objects for Your Component

// // 1. The Monal Restaurant
// const monalRestaurantData = {
//   name: "The Monal Restaurant",
//   rating: 4.3,
//   reviews: "2450",
//   badges: ["Top Choice", "Scenic Views", "Fine Dining"],
//   images: {
//     main: "/api/placeholder/800/450",
//     secondary: ["/api/placeholder/400/200", "/api/placeholder/400/200"],
//     gallery: [
//       "/api/placeholder/800/450", // Main restaurant exterior with Monal signage
//       "/api/placeholder/400/300", // Food buffet spread
//       "/api/placeholder/400/300", // Interior dining area
//       "/api/placeholder/400/300", // Scenic mountain view
//       "/api/placeholder/600/400", // Traditional Pakistani dishes
//       "/api/placeholder/600/400", // Evening ambiance
//       "/api/placeholder/600/400", // Outdoor seating area
//       "/api/placeholder/600/400", // Kitchen/cooking area
//     ],
//   },
//   price: "PKR 3000",
//   description:
//     "Monal Restaurant is a famous dining destination set in the stunning Margalla Hills of Islamabad, offering authentic Pakistani, Indian and Continental cuisine. With its breathtaking panoramic views of the twin cities and exceptional food quality, Monal provides an unforgettable dining experience that combines traditional flavors with modern hospitality in a spectacular hillside setting.",
//   amenities: [
//     { icon: "Utensils", label: "Fine Dining" },
//     { icon: "Car", label: "Parking Available" },
//     { icon: "Wifi", label: "Free WiFi" },
//     { icon: "Wind", label: "Air Conditioning" },
//     { icon: "Phone", label: "Reservations" },
//     { icon: "MapPin", label: "Scenic Location" },
//   ],
//   roomTypes: [
//     // Menu categories
//     { type: "Traditional Pakistani", price: "PKR 2500", selected: true },
//     { type: "Continental Cuisine", price: "PKR 3000" },
//     { type: "BBQ & Grills", price: "PKR 3500" },
//   ],
//   rooms: [
//     // Dining areas
//     { name: "Indoor Dining Hall", image: "/api/placeholder/150/100" },
//     { name: "Outdoor Terrace", image: "/api/placeholder/150/100" },
//     { name: "Private Dining Room", image: "/api/placeholder/150/100" },
//   ],
//   testimonials: [
//     {
//       name: "Maria",
//       country: "Pakistan",
//       flag: "🇵🇰",
//       text: "Amazing food with incredible views! The traditional Pakistani dishes were authentic and delicious.",
//       image: "/api/placeholder/80/80",
//     },
//     {
//       name: "Ahmed",
//       country: "UAE",
//       flag: "🇦🇪",
//       text: "Best dining experience in Islamabad. The location and food quality exceeded our expectations.",
//       image: "/api/placeholder/80/80",
//     },
//     {
//       name: "Sarah",
//       country: "UK",
//       flag: "🇬🇧",
//       text: "Spectacular views and excellent service. A must-visit restaurant when in Islamabad.",
//       image: "/api/placeholder/80/80",
//     },
//     {
//       name: "Hassan",
//       country: "Canada",
//       flag: "🇨🇦",
//       text: "The ambiance is perfect for special occasions. Great food and stunning sunset views.",
//       image: "/api/placeholder/80/80",
//     },
//     {
//       name: "Lisa",
//       country: "Australia",
//       flag: "🇦🇺",
//       text: "Unforgettable dining experience with panoramic views of the twin cities.",
//       image: "/api/placeholder/80/80",
//     },
//   ],
//   faqData: [
//     {
//       question: "Do I need to make a reservation in advance?",
//       answer:
//         "Yes, we highly recommend making a reservation in advance, especially for weekends. You can reserve by calling us or booking online through our website.",
//     },
//     {
//       question: "What are the restaurant's operating hours?",
//       answer:
//         "We are open daily from 12:00 PM to 11:00 PM. Kitchen closes at 10:30 PM.",
//     },
//     {
//       question: "Is there parking available on site?",
//       answer:
//         "Yes, we provide complimentary parking for all our guests with ample parking space available.",
//     },
//     {
//       question: "Do you offer vegetarian or vegan options?",
//       answer:
//         "Absolutely! We have an extensive vegetarian menu and can accommodate vegan dietary requirements upon request.",
//     },
//   ],
//   ratings: [
//     { label: "Food Quality", score: 9.2 },
//     { label: "Service", score: 8.8 },
//     { label: "Ambiance", score: 9.5 },
//     { label: "Value for Money", score: 8.5 },
//     { label: "Location", score: 9.8 },
//   ],
// };

// // 2. The Grand Palm Hotel (Car Rental Service)
// const grandPalmCarRentalData = {
//   name: "The Grand Palm Hotel - Car Rental",
//   rating: 4.2,
//   reviews: "890",
//   badges: ["Verified Service", "Premium Vehicles"],
//   images: {
//     main: "/api/placeholder/800/450",
//     secondary: ["/api/placeholder/400/200", "/api/placeholder/400/200"],
//     gallery: [
//       "/api/placeholder/800/450", // Main car - black pickup truck
//       "/api/placeholder/400/300", // Hotel exterior with parking
//       "/api/placeholder/400/300", // Car interior
//       "/api/placeholder/400/300", // Additional vehicles
//       "/api/placeholder/600/400", // Service counter
//       "/api/placeholder/600/400", // GPS navigation system
//       "/api/placeholder/600/400", // Car keys and documentation
//       "/api/placeholder/600/400", // Professional driver
//     ],
//   },
//   price: "PKR 3500",
//   description:
//     "Experience premium car rental services at The Grand Palm Hotel with our fleet of well-maintained, modern vehicles. Whether you need transportation for business meetings, sightseeing, or airport transfers, our professional service ensures comfort, reliability and convenience. All vehicles come fully insured with 24/7 roadside assistance for your peace of mind.",
//   amenities: [
//     { icon: "Car", label: "Premium Vehicles" },
//     { icon: "Phone", label: "24/7 Support" },
//     { icon: "MapPin", label: "GPS Navigation" },
//     { icon: "Wind", label: "Air Conditioning" },
//     { icon: "Wifi", label: "Bluetooth Connectivity" },
//     { icon: "Bath", label: "Full Insurance Coverage" },
//   ],
//   roomTypes: [
//     // Vehicle types
//     { type: "Economy Car", price: "PKR 2500" },
//     { type: "SUV/Pickup", price: "PKR 3500", selected: true },
//     { type: "Luxury Vehicle", price: "PKR 5500" },
//   ],
//   rooms: [
//     // Vehicle options
//     { name: "Compact Economy", image: "/api/placeholder/150/100" },
//     { name: "SUV Premium", image: "/api/placeholder/150/100" },
//     { name: "Luxury Sedan", image: "/api/placeholder/150/100" },
//   ],
//   testimonials: [
//     {
//       name: "Sadia",
//       country: "Pakistan",
//       flag: "🇵🇰",
//       text: "Excellent service with clean, well-maintained vehicles. The staff was professional and helpful.",
//       image: "/api/placeholder/80/80",
//     },
//     {
//       name: "Imran",
//       country: "UAE",
//       flag: "🇦🇪",
//       text: "Great experience renting for our Islamabad trip. Reliable service and fair pricing.",
//       image: "/api/placeholder/80/80",
//     },
//     {
//       name: "Jennifer",
//       country: "USA",
//       flag: "🇺🇸",
//       text: "Professional service with excellent customer support. Highly recommend for tourists.",
//       image: "/api/placeholder/80/80",
//     },
//     {
//       name: "Omar",
//       country: "Saudi Arabia",
//       flag: "🇸🇦",
//       text: "Quality vehicles and prompt service. Made our business trip very convenient.",
//       image: "/api/placeholder/80/80",
//     },
//     {
//       name: "Lisa",
//       country: "Germany",
//       flag: "🇩🇪",
//       text: "Smooth rental process and reliable vehicles. Great for exploring the twin cities.",
//       image: "/api/placeholder/80/80",
//     },
//   ],
//   faqData: [
//     {
//       question: "Can I get the refund?",
//       answer:
//         "Yes, you can get a full refund if you cancel at least 24 hours before your rental period begins. Cancellations within 24 hours are subject to a 50% charge.",
//     },
//     {
//       question: "Can I change the rental date?",
//       answer:
//         "Yes, you can modify your rental dates subject to vehicle availability. Please contact us at least 12 hours before your scheduled pickup time.",
//     },
//     {
//       question: "What documents do I need?",
//       answer:
//         "You need a valid driving license, national ID or passport, and a credit card for security deposit.",
//     },
//     {
//       question: "Do you provide airport transfers?",
//       answer:
//         "Yes, we offer airport pickup and drop-off services. This can be arranged during the booking process for an additional fee.",
//     },
//   ],
//   ratings: [
//     { label: "Vehicle Condition", score: 9.2 },
//     { label: "Customer Service", score: 8.9 },
//     { label: "Pricing", score: 8.5 },
//     { label: "Reliability", score: 9.0 },
//     { label: "Overall Experience", score: 8.8 },
//   ],
// };

// // 3. Ali Azhar - Professional Tour Guide
// const tourGuideData = {
//   name: "Ali Azhar - Professional Tour Guide",
//   rating: 4.9,
//   reviews: "156",
//   badges: ["Top Rated", "Local Expert", "Multi-Language"],
//   images: {
//     main: "/api/placeholder/800/450",
//     secondary: ["/api/placeholder/400/200", "/api/placeholder/400/200"],
//     gallery: [
//       "/api/placeholder/800/450", // Scenic landscape tour location
//       "/api/placeholder/400/300", // Desert/mountain tour
//       "/api/placeholder/400/300", // Group tour photo
//       "/api/placeholder/400/300", // Historical site visit
//       "/api/placeholder/600/400", // Adventure activity
//       "/api/placeholder/600/400", // Cultural experience
//       "/api/placeholder/600/400", // Nature photography
//       "/api/placeholder/600/400", // Local market tour
//     ],
//   },
//   price: "PKR 2500",
//   description:
//     "Experience unforgettable adventures with our licensed professional tour guide Ali. With over 10 years of experience and 500+ satisfied travelers, Ali specializes in providing authentic local experiences that showcase the best destinations while ensuring your safety and enjoyment. From cultural heritage sites to natural wonders, every tour is personalized to create lasting memories.",
//   amenities: [
//     { icon: "Users", label: "Group & Private Tours" },
//     { icon: "Car", label: "Transportation Arranged" },
//     { icon: "Phone", label: "Photography Guidance" },
//     { icon: "MapPin", label: "Custom Itineraries" },
//     { icon: "Wifi", label: "Multi-language Support" },
//     { icon: "Clock", label: "Flexible Scheduling" },
//   ],
//   roomTypes: [
//     // Tour packages
//     { type: "Half Day Tour", price: "PKR 1500" },
//     { type: "Full Day Adventure", price: "PKR 2500", selected: true },
//     { type: "Multi-Day Package", price: "PKR 4500" },
//   ],
//   rooms: [
//     // Tour types
//     { name: "Cultural Heritage Tour", image: "/api/placeholder/150/100" },
//     { name: "Adventure & Nature", image: "/api/placeholder/150/100" },
//     { name: "Photography Expedition", image: "/api/placeholder/150/100" },
//   ],
//   testimonials: [
//     {
//       name: "Emma",
//       country: "Australia",
//       flag: "🇦🇺",
//       text: "Ali provided an amazing tour experience! His knowledge of local history and culture made the trip truly memorable.",
//       image: "/api/placeholder/80/80",
//     },
//     {
//       name: "Marco",
//       country: "Italy",
//       flag: "🇮🇹",
//       text: "Excellent guide with great photography skills. He showed us hidden gems that we would never have found alone.",
//       image: "/api/placeholder/80/80",
//     },
//     {
//       name: "Fatima",
//       country: "Morocco",
//       flag: "🇲🇦",
//       text: "Professional and friendly guide. The cultural tour was educational and fun for the whole family.",
//       image: "/api/placeholder/80/80",
//     },
//     {
//       name: "James",
//       country: "Canada",
//       flag: "🇨🇦",
//       text: "Ali's passion for his work really shows. Great communication and very knowledgeable about local attractions.",
//       image: "/api/placeholder/80/80",
//     },
//     {
//       name: "Yuki",
//       country: "Japan",
//       flag: "🇯🇵",
//       text: "Fantastic adventure tour with stunning photography opportunities. Highly recommend for nature lovers!",
//       image: "/api/placeholder/80/80",
//     },
//   ],
//   faqData: [
//     {
//       question: "Can I get my refund?",
//       answer:
//         "Full refund available if cancelled 48 hours before the tour. Cancellations within 24-48 hours receive 50% refund. No refund for same-day cancellations except for weather-related issues.",
//     },
//     {
//       question: "What's the tour schedule like?",
//       answer:
//         "Tours typically start at 9 AM and can be customized based on your preferences. We offer flexible timing to accommodate your schedule and interests.",
//     },
//     {
//       question: "Can I change my booking date?",
//       answer:
//         "Yes, you can reschedule your tour up to 24 hours before the scheduled date, subject to availability.",
//     },
//     {
//       question: "What should I bring for the tour?",
//       answer:
//         "Comfortable walking shoes, sun protection, camera, and water bottle. Specific requirements will be provided based on your chosen tour type.",
//     },
//   ],
//   ratings: [
//     { label: "Local Knowledge", score: 9.8 },
//     { label: "Communication", score: 9.6 },
//     { label: "Photography Skills", score: 9.4 },
//     { label: "Punctuality", score: 9.7 },
//     { label: "Overall Satisfaction", score: 9.6 },
//   ],
// };

// // Export all data objects
// export { monalRestaurantData, grandPalmCarRentalData, tourGuideData };

// Service Data Objects for Your Component

// 1. The Monal Restaurant
const monalRestaurantData = {
  name: "The Monal Restaurant",
  rating: 4.3,
  reviews: "2450",
  badges: ["Top Choice", "Scenic Views", "Fine Dining"],
  images: {
    main: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=450&fit=crop",
    secondary: [
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=200&fit=crop",
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=200&fit=crop",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=450&fit=crop", // Main restaurant exterior
      "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop", // Food buffet spread
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop", // Interior dining area
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop", // Scenic mountain view
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=400&fit=crop", // Traditional Pakistani dishes
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop", // Evening ambiance
      "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=600&h=400&fit=crop", // Outdoor seating area
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop", // Kitchen/cooking area
    ],
  },
  price: "PKR 3000",
  description:
    "Monal Restaurant is a famous dining destination set in the stunning Margalla Hills of Islamabad, offering authentic Pakistani, Indian and Continental cuisine. With its breathtaking panoramic views of the twin cities and exceptional food quality, Monal provides an unforgettable dining experience that combines traditional flavors with modern hospitality in a spectacular hillside setting.",
  amenities: [
    { icon: "Utensils", label: "Fine Dining" },
    { icon: "Car", label: "Parking Available" },
    { icon: "Wifi", label: "Free WiFi" },
    { icon: "Wind", label: "Air Conditioning" },
    { icon: "Phone", label: "Reservations" },
    { icon: "MapPin", label: "Scenic Location" },
  ],
  roomTypes: [
    // Menu categories
    { type: "Traditional Pakistani", price: "PKR 2500", selected: true },
    { type: "Continental Cuisine", price: "PKR 3000" },
    { type: "BBQ & Grills", price: "PKR 3500" },
  ],
  rooms: [
    // Dining areas
    {
      name: "Indoor Dining Hall",
      image:
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=150&h=100&fit=crop",
    },
    {
      name: "Outdoor Terrace",
      image:
        "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=150&h=100&fit=crop",
    },
    {
      name: "Private Dining Room",
      image:
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=150&h=100&fit=crop",
    },
  ],
  testimonials: [
    {
      name: "Maria",
      country: "Pakistan",
      flag: "🇵🇰",
      text: "Amazing food with incredible views! The traditional Pakistani dishes were authentic and delicious.",
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face",
    },
    {
      name: "Ahmed",
      country: "UAE",
      flag: "🇦🇪",
      text: "Best dining experience in Islamabad. The location and food quality exceeded our expectations.",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
    },
    {
      name: "Sarah",
      country: "UK",
      flag: "🇬🇧",
      text: "Spectacular views and excellent service. A must-visit restaurant when in Islamabad.",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
    },
    {
      name: "Hassan",
      country: "Canada",
      flag: "🇨🇦",
      text: "The ambiance is perfect for special occasions. Great food and stunning sunset views.",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
    },
    {
      name: "Lisa",
      country: "Australia",
      flag: "🇦🇺",
      text: "Unforgettable dining experience with panoramic views of the twin cities.",
      image:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&crop=face",
    },
  ],
  faqData: [
    {
      question: "Do I need to make a reservation in advance?",
      answer:
        "Yes, we highly recommend making a reservation in advance, especially for weekends. You can reserve by calling us or booking online through our website.",
    },
    {
      question: "What are the restaurant's operating hours?",
      answer:
        "We are open daily from 12:00 PM to 11:00 PM. Kitchen closes at 10:30 PM.",
    },
    {
      question: "Is there parking available on site?",
      answer:
        "Yes, we provide complimentary parking for all our guests with ample parking space available.",
    },
    {
      question: "Do you offer vegetarian or vegan options?",
      answer:
        "Absolutely! We have an extensive vegetarian menu and can accommodate vegan dietary requirements upon request.",
    },
  ],
  ratings: [
    { label: "Food Quality", score: 9.2 },
    { label: "Service", score: 8.8 },
    { label: "Ambiance", score: 9.5 },
    { label: "Value for Money", score: 8.5 },
    { label: "Location", score: 9.8 },
  ],
};

// 2. The Grand Palm Hotel (Car Rental Service)
const grandPalmCarRentalData = {
  name: "The Grand Palm Hotel - Car Rental",
  rating: 4.2,
  reviews: "890",
  badges: ["Verified Service", "Premium Vehicles"],
  images: {
    main: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=450&fit=crop",
    secondary: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=200&fit=crop",
      "https://images.unsplash.com/photo-1542362567-b07e54358753?w=400&h=200&fit=crop",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=450&fit=crop", // Main car - black pickup truck
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop", // Hotel exterior with parking
      "https://images.unsplash.com/photo-1542362567-b07e54358753?w=400&h=300&fit=crop", // Car interior
      "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=400&h=300&fit=crop", // Additional vehicles
      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop", // Service counter
      "https://images.unsplash.com/photo-1551731409-43eb3e517a1a?w=600&h=400&fit=crop", // GPS navigation system
      "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&h=400&fit=crop", // Car keys and documentation
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop", // Professional driver
    ],
  },
  price: "PKR 3500",
  description:
    "Experience premium car rental services at The Grand Palm Hotel with our fleet of well-maintained, modern vehicles. Whether you need transportation for business meetings, sightseeing, or airport transfers, our professional service ensures comfort, reliability and convenience. All vehicles come fully insured with 24/7 roadside assistance for your peace of mind.",
  amenities: [
    { icon: "Car", label: "Premium Vehicles" },
    { icon: "Phone", label: "24/7 Support" },
    { icon: "MapPin", label: "GPS Navigation" },
    { icon: "Wind", label: "Air Conditioning" },
    { icon: "Wifi", label: "Bluetooth Connectivity" },
    { icon: "Bath", label: "Full Insurance Coverage" },
  ],
  roomTypes: [
    // Vehicle types
    { type: "Economy Car", price: "PKR 2500" },
    { type: "SUV/Pickup", price: "PKR 3500", selected: true },
    { type: "Luxury Vehicle", price: "PKR 5500" },
  ],
  rooms: [
    // Vehicle options
    {
      name: "Compact Economy",
      image:
        "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=150&h=100&fit=crop",
    },
    {
      name: "SUV Premium",
      image:
        "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=150&h=100&fit=crop",
    },
    {
      name: "Luxury Sedan",
      image:
        "https://images.unsplash.com/photo-1563720223185-11003d516935?w=150&h=100&fit=crop",
    },
  ],
  testimonials: [
    {
      name: "Sadia",
      country: "Pakistan",
      flag: "🇵🇰",
      text: "Excellent service with clean, well-maintained vehicles. The staff was professional and helpful.",
      image:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face",
    },
    {
      name: "Imran",
      country: "UAE",
      flag: "🇦🇪",
      text: "Great experience renting for our Islamabad trip. Reliable service and fair pricing.",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
    },
    {
      name: "Jennifer",
      country: "USA",
      flag: "🇺🇸",
      text: "Professional service with excellent customer support. Highly recommend for tourists.",
      image:
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=80&h=80&fit=crop&crop=face",
    },
    {
      name: "Omar",
      country: "Saudi Arabia",
      flag: "🇸🇦",
      text: "Quality vehicles and prompt service. Made our business trip very convenient.",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face",
    },
    {
      name: "Lisa",
      country: "Germany",
      flag: "🇩🇪",
      text: "Smooth rental process and reliable vehicles. Great for exploring the twin cities.",
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face",
    },
  ],
  faqData: [
    {
      question: "Can I get the refund?",
      answer:
        "Yes, you can get a full refund if you cancel at least 24 hours before your rental period begins. Cancellations within 24 hours are subject to a 50% charge.",
    },
    {
      question: "Can I change the rental date?",
      answer:
        "Yes, you can modify your rental dates subject to vehicle availability. Please contact us at least 12 hours before your scheduled pickup time.",
    },
    {
      question: "What documents do I need?",
      answer:
        "You need a valid driving license, national ID or passport, and a credit card for security deposit.",
    },
    {
      question: "Do you provide airport transfers?",
      answer:
        "Yes, we offer airport pickup and drop-off services. This can be arranged during the booking process for an additional fee.",
    },
  ],
  ratings: [
    { label: "Vehicle Condition", score: 9.2 },
    { label: "Customer Service", score: 8.9 },
    { label: "Pricing", score: 8.5 },
    { label: "Reliability", score: 9.0 },
    { label: "Overall Experience", score: 8.8 },
  ],
};

// 3. Ali Azhar - Professional Tour Guide
const tourGuideData = {
  name: "Ali Azhar - Professional Tour Guide",
  rating: 4.9,
  reviews: "156",
  badges: ["Top Rated", "Local Expert", "Multi-Language"],
  images: {
    main: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=450&fit=crop",
    secondary: [
      "https://images.unsplash.com/photo-1454391304352-2bf4678b1a7a?w=400&h=200&fit=crop",
      "https://images.unsplash.com/photo-1539650116574-75c0c6d73438?w=400&h=200&fit=crop",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=450&fit=crop", // Scenic landscape tour location
      "https://images.unsplash.com/photo-1454391304352-2bf4678b1a7a?w=400&h=300&fit=crop", // Desert/mountain tour
      "https://images.unsplash.com/photo-1539650116574-75c0c6d73438?w=400&h=300&fit=crop", // Group tour photo
      "https://images.unsplash.com/photo-1580501170888-80668882ca0c?w=400&h=300&fit=crop", // Historical site visit
      "https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&h=400&fit=crop", // Adventure activity
      "https://images.unsplash.com/photo-1539650116574-75c0c6d73438?w=600&h=400&fit=crop", // Cultural experience
      "https://images.unsplash.com/photo-1502780402662-acc01917589e?w=600&h=400&fit=crop", // Nature photography
      "https://images.unsplash.com/photo-1555400113-9ac6f7014a38?w=600&h=400&fit=crop", // Local market tour
    ],
  },
  price: "PKR 2500",
  description:
    "Experience unforgettable adventures with our licensed professional tour guide Ali. With over 10 years of experience and 500+ satisfied travelers, Ali specializes in providing authentic local experiences that showcase the best destinations while ensuring your safety and enjoyment. From cultural heritage sites to natural wonders, every tour is personalized to create lasting memories.",
  amenities: [
    { icon: "Users", label: "Group & Private Tours" },
    { icon: "Car", label: "Transportation Arranged" },
    { icon: "Phone", label: "Photography Guidance" },
    { icon: "MapPin", label: "Custom Itineraries" },
    { icon: "Wifi", label: "Multi-language Support" },
    { icon: "Clock", label: "Flexible Scheduling" },
  ],
  roomTypes: [
    // Tour packages
    { type: "Half Day Tour", price: "PKR 1500" },
    { type: "Full Day Adventure", price: "PKR 2500", selected: true },
    { type: "Multi-Day Package", price: "PKR 4500" },
  ],
  rooms: [
    // Tour types
    {
      name: "Cultural Heritage Tour",
      image:
        "https://images.unsplash.com/photo-1580501170888-80668882ca0c?w=150&h=100&fit=crop",
    },
    {
      name: "Adventure & Nature",
      image:
        "https://images.unsplash.com/photo-1551632811-561732d1e306?w=150&h=100&fit=crop",
    },
    {
      name: "Photography Expedition",
      image:
        "https://images.unsplash.com/photo-1502780402662-acc01917589e?w=150&h=100&fit=crop",
    },
  ],
  testimonials: [
    {
      name: "Emma",
      country: "Australia",
      flag: "🇦🇺",
      text: "Ali provided an amazing tour experience! His knowledge of local history and culture made the trip truly memorable.",
      image:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&crop=face",
    },
    {
      name: "Marco",
      country: "Italy",
      flag: "🇮🇹",
      text: "Excellent guide with great photography skills. He showed us hidden gems that we would never have found alone.",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
    },
    {
      name: "Fatima",
      country: "Morocco",
      flag: "🇲🇦",
      text: "Professional and friendly guide. The cultural tour was educational and fun for the whole family.",
      image:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face",
    },
    {
      name: "James",
      country: "Canada",
      flag: "🇨🇦",
      text: "Ali's passion for his work really shows. Great communication and very knowledgeable about local attractions.",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
    },
    {
      name: "Yuki",
      country: "Japan",
      flag: "🇯🇵",
      text: "Fantastic adventure tour with stunning photography opportunities. Highly recommend for nature lovers!",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
    },
  ],
  faqData: [
    {
      question: "Can I get my refund?",
      answer:
        "Full refund available if cancelled 48 hours before the tour. Cancellations within 24-48 hours receive 50% refund. No refund for same-day cancellations except for weather-related issues.",
    },
    {
      question: "What's the tour schedule like?",
      answer:
        "Tours typically start at 9 AM and can be customized based on your preferences. We offer flexible timing to accommodate your schedule and interests.",
    },
    {
      question: "Can I change my booking date?",
      answer:
        "Yes, you can reschedule your tour up to 24 hours before the scheduled date, subject to availability.",
    },
    {
      question: "What should I bring for the tour?",
      answer:
        "Comfortable walking shoes, sun protection, camera, and water bottle. Specific requirements will be provided based on your chosen tour type.",
    },
  ],
  ratings: [
    { label: "Local Knowledge", score: 9.8 },
    { label: "Communication", score: 9.6 },
    { label: "Photography Skills", score: 9.4 },
    { label: "Punctuality", score: 9.7 },
    { label: "Overall Satisfaction", score: 9.6 },
  ],
};

// Export all data objects
export { monalRestaurantData, grandPalmCarRentalData, tourGuideData };
