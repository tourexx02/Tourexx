import React, { useState, useRef, useEffect, useCallback } from "react";
import {
	Wifi,
	Car,
	Bath,
	Wind,
	Phone,
	Utensils,
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	X,
	Clock,
	Camera,
	Facebook,
	Twitter,
	Instagram,
	Youtube,
	CheckCircle2,
	Users,
	MapPin,
} from "lucide-react";
import { useParams, useLocation } from "react-router-dom";
import { hotelAPI, restaurantAPI, transportAPI, tripOrganizerAPI, bookingAPI } from "../services/api";
import VenueMapPreview from "./VenueMapPreview";
import logo from "../assets/logo.png";
import toast, { Toaster } from 'react-hot-toast';

const getIcon = (iconName) => {
	const iconMap = {
		Wifi,
		Car,
		Bath,
		Wind,
		Phone,
		Utensils,
		Users,
		MapPin,
		Clock,
	};

	const IconComponent = iconMap[iconName];
	return IconComponent || CheckCircle2; // fallback to Check icon if not found
};

const resolveAmenityIcon = (label = "") => {
	const normalized = label.toLowerCase();

	if (normalized.includes("wifi") || normalized.includes("internet")) return "Wifi";
	if (normalized.includes("parking") || normalized.includes("car")) return "Car";
	if (
		normalized.includes("pool") ||
		normalized.includes("spa") ||
		normalized.includes("bath")
	)
		return "Bath";
	if (
		normalized.includes("air") ||
		normalized.includes("conditioning") ||
		normalized.includes("fan") ||
		normalized.includes("breeze")
	)
		return "Wind";
	if (
		normalized.includes("phone") ||
		normalized.includes("support") ||
		normalized.includes("service") ||
		normalized.includes("contact")
	)
		return "Phone";
	if (
		normalized.includes("dining") ||
		normalized.includes("restaurant") ||
		normalized.includes("meal") ||
		normalized.includes("food")
	)
		return "Utensils";
	if (
		normalized.includes("guide") ||
		normalized.includes("group") ||
		normalized.includes("tour")
	)
		return "Users";
	if (normalized.includes("location") || normalized.includes("pickup") || normalized.includes("scenic"))
		return "MapPin";
	if (normalized.includes("24/7") || normalized.includes("hour") || normalized.includes("time"))
		return "Clock";

	return "Wifi";
};

const formatAmenitiesData = (amenities, fallback = []) => {
	if (Array.isArray(amenities) && amenities.length > 0) {
		return amenities
			.map((amenity) => {
				if (typeof amenity === "string") {
					const trimmed = amenity.trim();
					if (!trimmed) return null;
					return {
						icon: resolveAmenityIcon(trimmed),
						label: trimmed,
					};
				}

				if (amenity && typeof amenity === "object") {
					const label = amenity.label || "";
					const icon = amenity.icon || resolveAmenityIcon(label);
					if (!label) return null;
					return {
						icon,
						label,
					};
				}

				return null;
			})
			.filter(Boolean);
	}

	return Array.isArray(fallback) ? fallback : [];
};

// Move BookingModal outside to prevent recreation on each render
const BookingModal = ({
	setShowBookingModal,
	serviceLabels,
	selectedDates,
	bookingFormData,
	handleBookingFormChange,
	handleBookingSubmit,
	priceSummary,
	selectedOptionLabel,
}) => (
  <div className='fixed inset-0 backdrop-blur-xs flex items-center justify-center z-50'>
    <div className='bg-white border border-gray-300 rounded-lg overflow-hidden w-full max-w-4xl mx-4'>
      <div className='flex'>
        <div className='bg-slate-600 p-8 flex flex-col justify-center items-center text-white w-1/3'>
          <div className='mb-6'>
            <div className='flex items-center mb-4'>
              <img
                src={logo}
                alt='Company Logo'
                width={200}
                height={80}
              />
            </div>
          </div>
          <div className='flex space-x-4'>
            <div className='flex pl-8 items-start sm:items-center gap-4'>
              {[
                { icon: Facebook, href: "#" },
                { icon: Twitter, href: "#" },
                { icon: Instagram, href: "#" },
                { icon: Youtube, href: "#" },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className='text-white text-xl transition-all duration-300 hover:text-[#A0C3D2] hover:scale-110'>
                  <social.icon size={22} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className='flex-1 p-8'>
          <div className='flex justify-between items-start mb-6'>
            <div className='flex items-center'>
              <div className='w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3'>
                <div className='w-3 h-3 bg-blue-500 rounded-full'></div>
              </div>
              <h2 className='text-xl font-semibold'>Booking Confirmation</h2>
            </div>
            <button onClick={() => setShowBookingModal(false)}>
              <X className='w-5 h-5' />
            </button>
          </div>

          <div className='grid grid-cols-2 gap-8'>
            <div>
              <h3 className='font-semibold mb-4'>Your Booking Details</h3>
              <div className='space-y-3'>
                <div className='flex'>
                  <span className='text-gray-600 w-20'>
                    {serviceLabels.checkInLabel}
                  </span>
                  <span className='font-medium'>{selectedDates.checkIn}</span>
                </div>
                <div className='flex'>
                  <span className='text-gray-600 w-20'>
                    {serviceLabels.checkOutLabel}
                  </span>
                  <span className='font-medium'>
                    {selectedDates.checkOut}
                  </span>
                </div>
              </div>

              <h3 className='font-semibold mb-4 mt-6'>Your Price Summary</h3>
              <div className='space-y-2'>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Selected Option</span>
                  <span className='font-semibold'>
                    {selectedOptionLabel || "Not selected"}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Base Price</span>
                  <span className='font-semibold'>
                    {priceSummary?.baseDisplay || "PKR 0"}
                  </span>
                </div>
                {priceSummary?.showTax && (
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Tax</span>
                    <span className='text-gray-600'>
                      {priceSummary?.taxDisplay || "PKR 0"}
                    </span>
                  </div>
                )}
                <div className='border-t pt-2 flex justify-between'>
                  <span className='font-semibold'>
                    Total Amount For Payment
                  </span>
                  <span className='font-bold text-lg text-green-600'>
                    {priceSummary?.totalDisplay || "PKR 0"}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className='font-semibold mb-4'>Your Personal Details</h3>
              <div className='space-y-4'>
                <div className='grid grid-cols-2 gap-3'>
                  <div>
                    <label className='text-sm text-gray-600'>
                      First Name
                    </label>
                    <input
                      type='text'
                      placeholder='Rabia'
                      value={bookingFormData.firstName}
                      onChange={(e) =>
                        handleBookingFormChange("firstName", e.target.value)
                      }
                      className='w-full border border-gray-300 rounded px-3 py-2 mt-1'
                      required
                    />
                  </div>
                  <div>
                    <label className='text-sm text-gray-600'>Last Name</label>
                    <input
                      type='text'
                      placeholder='Mukhtar'
                      value={bookingFormData.lastName}
                      onChange={(e) =>
                        handleBookingFormChange("lastName", e.target.value)
                      }
                      className='w-full border border-gray-300 rounded px-3 py-2 mt-1'
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className='text-sm text-gray-600'>Email</label>
                  <input
                    type='email'
                    placeholder='abc@gmail.com'
                    value={bookingFormData.email}
                    onChange={(e) =>
                      handleBookingFormChange("email", e.target.value)
                    }
                    className='w-full border border-gray-300 rounded px-3 py-2 mt-1'
                    required
                  />
                </div>
                <div>
                  <label className='text-sm text-gray-600'>
                    Phone Number
                  </label>
                  <div className='flex mt-1'>
                    <select className='border border-gray-300 rounded-l px-3 py-2 bg-white'>
                      <option>+92</option>
                    </select>
                    <input
                      type='tel'
                      placeholder='3001234567'
                      value={bookingFormData.phone}
                      onChange={(e) =>
                        handleBookingFormChange("phone", e.target.value)
                      }
                      className='flex-1 border border-l-0 border-gray-300 rounded-r px-3 py-2'
                      required
                    />
                  </div>
                </div>
              </div>
              <button
                onClick={handleBookingSubmit}
                className='w-full bg-white text-[#2F4157] border border-[#2F4157] py-3 rounded mt-6 font-medium hover:bg-[#2F4157] hover:text-white'
                disabled={
                  !bookingFormData.firstName ||
                  !bookingFormData.lastName ||
                  !bookingFormData.email ||
                  !bookingFormData.phone
                }>
                Confirm & Forward
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const HotelBookingComponent = ({
	hotelId = null,
	hotelData = {
		name: "The Grand Palm Hotel",
		rating: 4.2,
		reviews: "1288",
		badges: ["Great Choice", "Best rated hotel"],
		images: {
			main: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=450&fit=crop",
			secondary: [
				"https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=200&fit=crop",
				"https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=200&fit=crop",
			],
			gallery: [
				"https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=450&fit=crop", // Main hotel exterior
				"https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=300&fit=crop", // Hotel lobby
				"https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop", // Hotel room
				"https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=300&fit=crop", // Hotel pool/amenities
				"https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop", // Hotel restaurant
				"https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&h=400&fit=crop", // Hotel spa/fitness
				"https://images.unsplash.com/photo-1586611292717-f828b167408c?w=600&h=400&fit=crop", // Hotel conference room
				"https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop", // Hotel suite
			],
		},
		price: "PKR 3500",
		description:
			"This Modern and luxurious frame tower is situated in Islamabad's most thriving local of D-6. 20 KM Away from The Marriott Islamabad. Metro is a Deluxe hotel perfectly designed and skillfully executed, offering the convenience of easy access with an array of accommodation for guests. This hotel provides Best views with 2 KM from Jinnah City Quetta.",
		amenities: [],
		roomTypes: [
			{ type: "Standard Room - Economy", price: "PKR 2500" },
			{ type: "Single Bed - Economy", price: "PKR 3000", selected: true },
			{ type: "Single Bed - Presidential", price: "PKR 5500" },
		],
		rooms: [
			{
				name: "Single Bed",
				image:
					"https://images.unsplash.com/photo-1586611292717-f828b167408c?w=150&h=100&fit=crop",
			},
			{
				name: "Double Bed",
				image:
					"https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=150&h=100&fit=crop",
			},
			{
				name: "Suite",
				image:
					"https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=150&h=100&fit=crop",
			},
			{
				name: "Family Room",
				image:
					"https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=150&h=100&fit=crop",
			},
		],
		testimonials: [
			{
				name: "Sofia",
				country: "Pakistan",
				flag: "🇵🇰",
				text: "You don't have to look far. The location is perfect and the staff are very friendly.",
				image:
					"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face",
			},
			{
				name: "Natassian",
				country: "Indonesia",
				flag: "🇮🇩",
				text: "The hotel is fantastic and in great condition. The room was fantastic.",
				image:
					"https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=80&h=80&fit=crop&crop=face",
			},
			{
				name: "Mavis",
				country: "Canada",
				flag: "🇨🇦",
				text: "The location was perfect and the room was comfortable and very clean.",
				image:
					"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face",
			},
			{
				name: "Lena",
				country: "Germany",
				flag: "🇩🇪",
				text: "The staff was very nice and helpful. The location was great and relaxing.",
				image:
					"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
			},
			{
				name: "Martin",
				country: "Australia",
				flag: "🇦🇺",
				text: "The hotel is in a great location with easy access to many attractions.",
				image:
					"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
			},
		],
		faqData: [
			{
				question: "Can I get the refund?",
				answer:
					"Phang Nga Bay Sea Cave Canoeing & James Bond Island w/ Buffet Lunch by Big Boat cancellation policy: For a full refund, cancel at least 24 hours in advance of the start date of the experience.",
			},
			{
				question: "Can I change the guest date?",
				answer:
					"Yes, you can change your travel date. Please contact our support team at least 48 hours before your scheduled departure.",
			},
			{
				question: "What and where save this best opt?",
				answer:
					"Our best options are saved in your account preferences and can be accessed anytime.",
			},
			{
				question: "Do you arrange airport transfers?",
				answer:
					"Yes, we offer airport transfers for your convenience. You can add this option during the booking process.",
			},
		],
		ratings: [
			{ label: "Staff Politeness", score: 9.6 },
			{ label: "WF Options", score: 9 },
			{ label: "Free WIFI Speed", score: 8.8 },
			{ label: "Cleanliness", score: 9 },
			{ label: "Access To City Centre", score: 9 },
		],
	},
}) => {
	const { id } = useParams();
	const location = useLocation();
	const [activeTab, setActiveTab] = useState("details");
	const [showCalendar, setShowCalendar] = useState(false);
	const [calendarMode, setCalendarMode] = useState("checkin"); // 'checkin' or 'checkout'
	const [showBookingModal, setShowBookingModal] = useState(false);
	const [showImageGallery, setShowImageGallery] = useState(false);
	const [showRoomModal, setShowRoomModal] = useState(false);
	const [selectedRoom, setSelectedRoom] = useState(null);
	// Get current date and next day for default values
	const getCurrentDate = () => new Date();
	const getTomorrowDate = () => {
		const tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);
		return tomorrow;
	};

	const formatDateString = (date) => {
		const monthNames = [
			"January",
			"February",
			"March",
			"April",
			"May",
			"June",
			"July",
			"August",
			"September",
			"October",
			"November",
			"December",
		];
		return `${date.getDate()} ${
			monthNames[date.getMonth()]
		} ${date.getFullYear()}`;
	};

	const [selectedDates, setSelectedDates] = useState({
		checkIn: formatDateString(getCurrentDate()),
		checkOut: formatDateString(getTomorrowDate()),
	});
	const [checkInDate, setCheckInDate] = useState(getCurrentDate());
	const [checkOutDate, setCheckOutDate] = useState(getTomorrowDate());
	// Get current time formatted
	const getCurrentTime = () => {
		const now = new Date();
		let hours = now.getHours();
		const minutes = now.getMinutes();
		const ampm = hours >= 12 ? "PM" : "AM";
		hours = hours % 12;
		hours = hours ? hours : 12; // the hour '0' should be '12'
		const minutesStr = minutes < 10 ? "0" + minutes : minutes;
		return `${hours}:${minutesStr} ${ampm}`;
	};

	const [selectedTime, setSelectedTime] = useState(getCurrentTime());
	const [showTimeMenu, setShowTimeMenu] = useState(false);
	const [currentMonth, setCurrentMonth] = useState(getCurrentDate()); // Current month
	const [selectedRooms, setSelectedRooms] = useState([
		hotelData.roomTypes?.find((room) => room.selected)?.type ||
			hotelData.roomTypes?.[0]?.type ||
			"Standard Room",
	]);
	const [openFAQ, setOpenFAQ] = useState(null);
	const [apiHotelData, setApiHotelData] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [bookingFormData, setBookingFormData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		phone: "",
	});
	const [bookedDates, setBookedDates] = useState([]); // For hotels - store booked date ranges
	const [availableTimeSlots, setAvailableTimeSlots] = useState([]); // For restaurants - store available time slots
	const [loadingTimeSlots, setLoadingTimeSlots] = useState(false);
	const wrapperRef = useRef(null);

	// Determine service type from URL
	const getServiceType = () => {
		const path = location.pathname;
		if (path.includes("/hotels/")) return "hotel";
		if (path.includes("/restaurants/")) return "restaurant";
		if (path.includes("/transport/")) return "transport";
		if (path.includes("/trip-organizers/")) return "trip-organizer";
		return "hotel"; // default
	};

	const serviceType = getServiceType();

	const parsePriceValue = (price) => {
		if (typeof price === "number") return Number.isNaN(price) ? 0 : price;
		if (!price) return 0;
		const numeric = parseInt(String(price).replace(/[^\d]/g, ""), 10);
		return Number.isNaN(numeric) ? 0 : numeric;
	};

	const formatPriceDisplay = (value) =>
		`PKR ${Number(value || 0).toLocaleString()}`;

	// Get appropriate API based on service type
	const getAPI = (type) => {
		switch (type) {
			case "hotel":
				return hotelAPI;
			case "restaurant":
				return restaurantAPI;
			case "transport":
				return transportAPI;
			case "trip-organizer":
				return tripOrganizerAPI;
			default:
				return hotelAPI;
		}
	};

	// Fetch service data from API if ID is provided
	useEffect(() => {
		const fetchServiceData = async () => {
			if (hotelId || id) {
				try {
					setLoading(true);
					const api = getAPI(serviceType);
					const response = await api.getById(hotelId || id);
					setApiHotelData(response);
					setError(null);
				} catch (err) {
					console.error(`Error fetching ${serviceType}:`, err);
					setError(`Failed to load ${serviceType} details`);
				} finally {
					setLoading(false);
				}
			}
		};

		fetchServiceData();
	}, [hotelId, id, serviceType]);

	// Fetch booked dates for hotels when service data is loaded
	useEffect(() => {
		const fetchBookedDates = async () => {
			if (serviceType === 'hotel' && apiHotelData?.name) {
				try {
					const dates = await bookingAPI.getHotelBookedDates(apiHotelData.name);
					setBookedDates(dates);
				} catch (err) {
					console.error('Error fetching booked dates:', err);
					// Don't show error to user, just log it
				}
			}
		};

		fetchBookedDates();
	}, [serviceType, apiHotelData]);

	// Fetch available time slots for restaurants when check-in date changes
	useEffect(() => {
		const fetchTimeSlots = async () => {
			if (serviceType === 'restaurant' && apiHotelData?.name && checkInDate) {
				try {
					setLoadingTimeSlots(true);
					// Format date as YYYY-MM-DD
					const dateStr = checkInDate.toISOString().split('T')[0];
					const slots = await bookingAPI.getRestaurantTimeSlots(apiHotelData.name, dateStr);
					setAvailableTimeSlots(slots);
				} catch (err) {
					console.error('Error fetching time slots:', err);
					setAvailableTimeSlots([]);
				} finally {
					setLoadingTimeSlots(false);
				}
			}
		};

		fetchTimeSlots();
	}, [serviceType, apiHotelData, checkInDate]);

	const times = [
		"09:00 AM",
		"10:00 AM",
		"11:00 AM",
		"12:00 PM",
		"01:00 PM",
		"02:00 PM",
		"03:00 PM",
		"04:00 PM",
		"05:00 PM",
		"06:00 PM",
		"07:00 PM",
		"08:00 PM",
	];

	useEffect(() => {
		function handleClickOutside(event) {
			if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
				setShowCalendar(false);
				setShowTimeMenu(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	// Disable body scroll when any modal is open
	useEffect(() => {
		const isAnyModalOpen =
			showCalendar || showBookingModal || showImageGallery || showRoomModal;

		if (isAnyModalOpen) {
			// Store original overflow style
			const originalStyle = window.getComputedStyle(document.body).overflow;
			// Disable scroll
			document.body.style.overflow = "hidden";

			// Cleanup function to restore scroll
			return () => {
				document.body.style.overflow = originalStyle;
			};
		}
	}, [showCalendar, showBookingModal, showImageGallery, showRoomModal]);

	const getDaysInMonth = (date) => {
		const year = date.getFullYear();
		const month = date.getMonth();
		const firstDay = new Date(year, month, 1);
		const lastDay = new Date(year, month + 1, 0);
		const daysInMonth = lastDay.getDate();
		const startDate = firstDay.getDay();
		const days = [];

		for (let i = 0; i < startDate; i++) {
			days.push(null);
		}
		for (let day = 1; day <= daysInMonth; day++) {
			days.push(day);
		}
		return days;
	};

	const monthNames = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];

	// Check if a date is booked for hotels
	const isDateBooked = (date) => {
		if (serviceType !== 'hotel' || !bookedDates.length) return false;
		
		const checkDate = new Date(date);
		checkDate.setHours(0, 0, 0, 0);
		
		return bookedDates.some(booking => {
			const fromDate = new Date(booking.from);
			const toDate = new Date(booking.to);
			fromDate.setHours(0, 0, 0, 0);
			toDate.setHours(0, 0, 0, 0);
			
			// Check if date falls within the booked range (inclusive)
			return checkDate >= fromDate && checkDate <= toDate;
		});
	};

	const handleDayClick = (day, monthDate) => {
		const clickedDate = new Date(
			monthDate.getFullYear(),
			monthDate.getMonth(),
			day
		);
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		// Don't allow past dates
		if (clickedDate < today) return;

		// Don't allow booked dates for hotels
		if (isDateBooked(clickedDate)) return;

		const formattedDate = `${day} ${
			monthNames[monthDate.getMonth()]
		} ${monthDate.getFullYear()}`;

		if (calendarMode === "checkin") {
			setCheckInDate(clickedDate);
			setSelectedDates((prev) => ({
				...prev,
				checkIn: formattedDate,
			}));

			// If checkout date is before the new checkin date, clear it
			if (checkOutDate && clickedDate >= checkOutDate) {
				setCheckOutDate(null);
				setSelectedDates((prev) => ({
					...prev,
					checkOut: "",
				}));
			}

			setShowCalendar(false);
		} else if (calendarMode === "checkout") {
			// Ensure checkout is after checkin
			if (checkInDate && clickedDate <= checkInDate) {
				return; // Don't allow checkout before checkin
			}

			setCheckOutDate(clickedDate);
			setSelectedDates((prev) => ({
				...prev,
				checkOut: formattedDate,
			}));

			setShowCalendar(false);
		}
	};

	const handleRoomChange = (roomType) => {
		setSelectedRooms([roomType]);
	};

	// Transform API data to component format based on service type
	const transformApiDataToHotelData = (apiData) => {
		if (!apiData) return hotelData;

		const baseData = {
			name: apiData.name || hotelData.name,
			rating: 4.2, // Default rating since API doesn't have this
			reviews: "1288", // Default reviews
			images: {
				main: apiData.images?.[0]
					? `${import.meta.env.VITE_SERVER_BASE_URL}/uploads/${apiData.images[0]}`
					: hotelData.images.main,
				secondary:
					apiData.images
						?.slice(1, 3)
						.map((img) => `${import.meta.env.VITE_SERVER_BASE_URL}/uploads/${img}`) ||
					hotelData.images.secondary,
				gallery:
					apiData.images?.map(
						(img) => `${import.meta.env.VITE_SERVER_BASE_URL ? import.meta.env.VITE_SERVER_BASE_URL.replace('/api', '') : 'http://localhost:8080'}/uploads/${img}`
					) || hotelData.images.gallery,
			},
			amenities: formatAmenitiesData(
				apiData.amenities,
				hotelData.amenities || []
			),
			rooms: hotelData.rooms, // Keep default rooms
			testimonials: hotelData.testimonials, // Keep default testimonials
			faqData: hotelData.faqData, // Keep default FAQ
			ratings: hotelData.ratings, // Keep default ratings
			vehicleTypes:
				Array.isArray(apiData.vehicleTypes)
					? apiData.vehicleTypes
					: apiData.vehicleType
					? [apiData.vehicleType]
					: [],
			vehicleType: Array.isArray(apiData.vehicleTypes)
				? apiData.vehicleTypes[0] || ""
				: apiData.vehicleType || "",
			price: hotelData.price,
			priceValue: parsePriceValue(hotelData.price),
			// Add API specific data
			city: apiData.city || apiData.location,
			address: apiData.address,
			googleMapsLocation: apiData.googleMapsLocation || "",
			email: apiData.email,
			phone: apiData.phone,
		};

		// Service-specific transformations
		switch (serviceType) {
			case "hotel": {
				// Handle both new roomPricing structure and old budget/roomType
				let hotelBasePrice = 0;
				let hotelRoomTypes = [];

				if (apiData.roomPricing) {
					// New structure - multiple room types with pricing
					Object.entries(apiData.roomPricing).forEach(([roomType, price]) => {
						if (price > 0) {
							let displayName =
								roomType.charAt(0).toUpperCase() + roomType.slice(1);
							if (roomType === "family") displayName = "Family Room";

							hotelRoomTypes.push({
								type: displayName,
								price: formatPriceDisplay(price),
								priceValue: price,
								selected: hotelBasePrice === 0, // First available room type is selected
							});
							if (hotelBasePrice === 0) hotelBasePrice = price;
						}
					});
				} else if (apiData.budget && apiData.roomType) {
					// Old structure - single room type
					hotelBasePrice = apiData.budget;
					hotelRoomTypes.push({
						type: apiData.roomType,
						price: formatPriceDisplay(apiData.budget),
						priceValue: apiData.budget,
						selected: true,
					});
				}

				// Fallback if no room types found
				if (hotelRoomTypes.length === 0) {
					hotelBasePrice = apiData.budget || 3500;
					hotelRoomTypes.push({
						type: "Standard Room",
						price: formatPriceDisplay(hotelBasePrice),
						priceValue: hotelBasePrice,
						selected: true,
					});
				}

				return {
					...baseData,
					badges: ["Great Choice", "Best rated hotel"],
					price: formatPriceDisplay(hotelBasePrice),
					priceValue: hotelBasePrice,
					description:
						apiData.description ||
						`${apiData.name} offers comfortable accommodation in ${apiData.city} with excellent hospitality and modern amenities.`,
					roomTypes: hotelRoomTypes,
					payment: apiData.payment,
				};
			}

			case "restaurant": {
				const rawDiningTypes = Array.isArray(apiData.diningType)
					? apiData.diningType
					: Array.isArray(apiData.diningTypes)
					? apiData.diningTypes
					: apiData.diningType
					? String(apiData.diningType)
							.split(",")
							.map((item) => item.trim())
							.filter(Boolean)
					: [];

				if (rawDiningTypes.length === 0) {
					rawDiningTypes.push("Standard Dining");
				}

				const diningOptions = rawDiningTypes.map((diningLabel, index) => ({
					type: diningLabel,
					name: diningLabel,
					diningType: diningLabel,
					price: formatPriceDisplay(0),
					priceValue: 0,
					selected: index === 0,
				}));

				return {
					...baseData,
					badges: ["Top Rated", "Best Restaurant"],
					price: formatPriceDisplay(0),
					priceValue: 0,
					description:
						apiData.description ||
						`${apiData.name} offers a memorable dining experience in ${
							apiData.city
						}, perfect for food lovers seeking authentic flavors.`,
					roomTypes: diningOptions,
					rooms: diningOptions,
					diningType: apiData.diningType,
				};
			}

			case "transport": {
				const fallbackVehicleNames =
					baseData.vehicleTypes && baseData.vehicleTypes.length
						? baseData.vehicleTypes
						: [];

				const rawVehicleOptions = Array.isArray(apiData.vehicleOptions) && apiData.vehicleOptions.length
					? apiData.vehicleOptions
					: fallbackVehicleNames.length
					? fallbackVehicleNames.map((name) => ({
							name,
							price: apiData.budget || 0,
					  }))
					: apiData.vehicleType
					? [{ name: apiData.vehicleType, price: apiData.budget || 0 }]
					: [];

				if (rawVehicleOptions.length === 0) {
					rawVehicleOptions.push({
						name: "Standard Vehicle",
						price: apiData.budget || 0,
					});
				}

				const vehicleOptions = rawVehicleOptions.map((option, index) => {
					const name = option.name || option.type || option.vehicle || `Vehicle Option ${index + 1}`;
					const parsedPrice = Number(
						option.price ?? option.priceValue ?? apiData.budget ?? 0
					);
					const priceValue = Number.isFinite(parsedPrice) ? parsedPrice : 0;

					return {
						name,
						type: name,
						price: formatPriceDisplay(priceValue),
						priceValue,
						selected: index === 0,
					};
				});

				const transportBasePrice = vehicleOptions[0]?.priceValue ?? apiData.budget ?? 0;

				return {
					...baseData,
					badges: ["Reliable Service", "Best Transport"],
					price: formatPriceDisplay(transportBasePrice),
					priceValue: transportBasePrice,
					description:
						apiData.description ||
						`${apiData.name} provides reliable ${
							apiData.vehicleType || vehicleOptions[0]?.type || "vehicle"
						} transportation services with ${
							apiData.capacity || "comfortable"
						} seating capacity.`,
					roomTypes: vehicleOptions,
					rooms: vehicleOptions,
					vehicleOptions,
					vehicleType: vehicleOptions[0]?.type || apiData.vehicleType,
					capacity: apiData.capacity,
					rentalDuration: apiData.rentalDuration,
					driver: apiData.driver,
				};
			}

			case "trip-organizer": {
				const fallbackTourNames =
					Array.isArray(apiData.tourTypes) && apiData.tourTypes.length
						? apiData.tourTypes
						: apiData.tourType
						? [apiData.tourType]
						: [];

				const rawTourOptions = Array.isArray(apiData.tourOptions) && apiData.tourOptions.length
					? apiData.tourOptions
					: fallbackTourNames.length
					? fallbackTourNames.map((name) => ({
							name,
							price: apiData.priceRange || 0,
					  }))
					: [
							{
								name: "Custom Tour",
								price: apiData.priceRange || 0,
							},
					  ];

				const tourOptions = rawTourOptions.map((option, index) => {
					const name = option.name || option.type || option.option || `Tour Option ${index + 1}`;
					const parsedPrice = Number(option.price ?? option.priceValue ?? apiData.priceRange ?? 0);
					const priceValue = Number.isFinite(parsedPrice) ? parsedPrice : 0;

					return {
						name,
						type: name,
						price: formatPriceDisplay(priceValue),
						priceValue,
						selected: index === 0,
					};
				});

				const tourBasePrice =
					tourOptions[0]?.priceValue ??
					(Number.isFinite(Number(apiData.priceRange)) ? Number(apiData.priceRange) : 0);

				return {
					...baseData,
					badges: ["Expert Guide", "Top Organizer"],
					price: formatPriceDisplay(tourBasePrice),
					priceValue: tourBasePrice,
					description:
						apiData.description ||
						`${apiData.name} specializes in ${
							tourOptions[0]?.type || "customized"
						} tours with expertise in creating memorable travel experiences.`,
					roomTypes: tourOptions,
					rooms: tourOptions,
					tourOptions,
					tourTypes: tourOptions.map((option) => option.type),
					tourType: tourOptions[0]?.type || apiData.tourType,
					gender: apiData.gender,
					availability: apiData.availability,
					priceRange: tourBasePrice,
				};
			}

			default:
				return { ...baseData, ...hotelData };
		}
	};

	// Handle booking form input changes - memoized to prevent re-creation
	const handleBookingFormChange = useCallback((field, value) => {
		setBookingFormData((prev) => ({
			...prev,
			[field]: value,
		}));
	}, []);

	// Basic validation functions
	const validateEmail = (email) => {
		return email.includes("@");
	};

	const validatePhone = (phone) => {
		return /^\d+$/.test(phone); // Only numeric characters
	};

	// Handle booking submission
	const handleBookingSubmit = async () => {
		try {
			// Basic validation before submission
			if (!validateEmail(bookingFormData.email)) {
				toast.error("Please enter a valid email address with @", {
					duration: 4000,
					position: "top-center",
				});
				return;
			}

			if (!validatePhone(bookingFormData.phone)) {
				toast.error("Phone number must contain only numeric characters", {
					duration: 4000,
					position: "top-center",
				});
				return;
			}

			// For restaurants, check if selected time slot is available
			if (serviceType === 'restaurant' && availableTimeSlots.length > 0) {
				const selectedSlot = availableTimeSlots.find(slot => slot.time12 === selectedTime);
				if (selectedSlot && !selectedSlot.available) {
					toast.error("Selected time slot is not available. Please choose another time.", {
						duration: 4000,
						position: "top-center",
					});
					return;
				}
			}

		// Get appropriate price field based on service type
		const getPrice = () => {
			return serviceType === "restaurant" ? 0 : totalPriceValue;
		};

		// For restaurants, create date with selected time
		const getFromDate = () => {
			if (serviceType === 'restaurant' && selectedTime) {
				// Parse the selected time (e.g., "12:00 PM")
				const timeParts = selectedTime.match(/(\d+):(\d+)\s*(AM|PM)/i);
				if (timeParts) {
					let hours = parseInt(timeParts[1]);
					const minutes = parseInt(timeParts[2]);
					const period = timeParts[3].toUpperCase();
					
					// Convert to 24-hour format
					if (period === 'PM' && hours !== 12) {
						hours += 12;
					} else if (period === 'AM' && hours === 12) {
						hours = 0;
					}
					
					const dateWithTime = new Date(checkInDate);
					dateWithTime.setHours(hours, minutes, 0, 0);
					return dateWithTime;
				}
			}
			return checkInDate;
		};

		const getToDate = () => {
			if (serviceType === 'restaurant') {
				// For restaurants, add 2 hours to the from time
				const fromDate = getFromDate();
				const toDate = new Date(fromDate);
				toDate.setHours(toDate.getHours() + 2);
				return toDate;
			}
			return checkOutDate;
		};

		const bookingData = {
			firstName: bookingFormData.firstName,
			lastName: bookingFormData.lastName,
			email: bookingFormData.email,
			phone: parseInt(bookingFormData.phone),
			from: getFromDate(),
			to: getToDate(),
			type: getMainServiceCategory(),
			price: getPrice(),
			facility: currentHotelData.name,
		};

		const response = await bookingAPI.create(bookingData);
		console.log("Booking created:", response);

		// Show success toast
		toast.success("Booking Created Successfully!", {
			duration: 4000,
			position: "top-center",
			style: {
				background: "#10B981",
				color: "#fff",
				fontWeight: "500",
			},
		});

		// Refresh availability data after successful booking
		if (serviceType === 'hotel' && apiHotelData?.name) {
			try {
				const dates = await bookingAPI.getHotelBookedDates(apiHotelData.name);
				setBookedDates(dates);
			} catch (err) {
				console.error('Error refreshing booked dates:', err);
			}
		} else if (serviceType === 'restaurant' && apiHotelData?.name && checkInDate) {
			try {
				const dateStr = checkInDate.toISOString().split('T')[0];
				const slots = await bookingAPI.getRestaurantTimeSlots(apiHotelData.name, dateStr);
				setAvailableTimeSlots(slots);
			} catch (err) {
				console.error('Error refreshing time slots:', err);
			}
		}

		// Reset form fields after successful submission
		setBookingFormData({
			firstName: "",
			lastName: "",
			email: "",
			phone: "",
		});

		setShowBookingModal(false);
	} catch (error) {
		console.error("Error creating booking:", error);

		// Check if it's a conflict error (dates/times already booked)
		const errorMessage = error.response?.data?.message || 
			error.message || 
			"Failed to create booking. Please try again.";

		// Show error toast
		toast.error(errorMessage, {
			duration: 5000,
			position: "top-center",
			style: {
				background: "#EF4444",
				color: "#fff",
				fontWeight: "500",
			},
		});
	}
	};

	// Get main service category for booking type
	const getMainServiceCategory = () => {
		switch (serviceType) {
			case "hotel":
				return "Hotel";
			case "restaurant":
				return "Restaurant";
			case "transport":
				return "Transport";
			case "trip-organizer":
				return "Trip Organizer";
			default:
				return "Hotel";
		}
	};

	// Use API data if available, otherwise use prop data
	const currentHotelData = apiHotelData
		? transformApiDataToHotelData(apiHotelData)
		: hotelData;

	const displayAmenities = formatAmenitiesData(
		currentHotelData?.amenities,
		[]
	);
	const hasAmenities = displayAmenities.length > 0;

	const roomTypeOptions = (currentHotelData.roomTypes || []).map((room) => ({
		...room,
		priceValue:
			room.priceValue !== undefined
				? room.priceValue
				: parsePriceValue(room.price),
	}));

	useEffect(() => {
		if (roomTypeOptions.length > 0) {
			const defaultSelection =
				roomTypeOptions.find((room) => room.selected)?.type ||
				roomTypeOptions[0].type;
			setSelectedRooms([defaultSelection]);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [serviceType, apiHotelData]);

	const selectedRoomData =
		roomTypeOptions.find((room) => selectedRooms.includes(room.type)) ||
		roomTypeOptions[0] ||
		null;

	const basePriceValue =
		serviceType === "restaurant"
			? 0
			: selectedRoomData?.priceValue ??
			  parsePriceValue(selectedRoomData?.price ?? currentHotelData.price) ??
			  parsePriceValue(currentHotelData.price);

	const taxValue = 0;
	const totalPriceValue = basePriceValue + taxValue;
	const basePriceDisplay = formatPriceDisplay(basePriceValue);
	const taxDisplay = formatPriceDisplay(taxValue);
	const totalPriceDisplay = formatPriceDisplay(totalPriceValue);

	const selectedOptionLabel =
		serviceType === "restaurant"
			? selectedRoomData?.type
				? `Dining Option: ${selectedRoomData.type}`
				: "Dining Option"
			: serviceType === "transport"
			? selectedRoomData?.type
				? `Vehicle: ${selectedRoomData.type}`
				: "Vehicle Option"
			: serviceType === "trip-organizer"
			? selectedRoomData?.type
				? `Tour: ${selectedRoomData.type}`
				: "Tour Package"
			: selectedRoomData?.type || "Selected Option";

	const priceSummary = {
		baseDisplay: basePriceDisplay,
		taxDisplay,
		totalDisplay: totalPriceDisplay,
		showTax: taxValue > 0,
	};

	// Get service-specific labels
	const getServiceLabels = () => {
		switch (serviceType) {
			case "hotel":
				return {
					checkInLabel: "Check-in",
					checkOutLabel: "Check-out",
					roomTypeLabel: "Room Type",
					starsLabel: "5 stars hotel",
				};
			case "restaurant":
				return {
					checkInLabel: "Date",
					checkOutLabel: "Time",
					roomTypeLabel: "Table Options",
					starsLabel: "Top rated restaurant",
				};
			case "transport":
				return {
					checkInLabel: "Pickup Date",
					checkOutLabel: "Return Date",
					roomTypeLabel: "Vehicle Options",
					starsLabel: "Reliable transport service",
				};
			case "trip-organizer":
				return {
					checkInLabel: "Start Date",
					checkOutLabel: "End Date",
					roomTypeLabel: "Tour Packages",
					starsLabel: "Expert tour organizer",
				};
			default:
				return {
					checkInLabel: "Check-in",
					checkOutLabel: "Check-out",
					roomTypeLabel: "Options",
					starsLabel: "5 stars service",
				};
		}
	};

	const serviceLabels = getServiceLabels();

	const CalendarPopup = () => (
		<div
			className='fixed inset-0 bg-gray-500 bg-opacity-30 flex items-center justify-center z-50'
			ref={wrapperRef}>
			<div className='bg-white rounded-lg p-6 w-full max-w-md mx-4'>
				<div className='flex justify-between items-center mb-4'>
					<div>
						<h3 className='text-lg font-semibold'>
							Select {calendarMode === "checkin" ? "Check-in" : "Check-out"}{" "}
							Date
						</h3>
						{calendarMode === "checkout" && checkInDate && (
							<p className='text-sm text-gray-600 mt-1'>
								Check-in: {selectedDates.checkIn}
							</p>
						)}
					</div>
					<button onClick={() => setShowCalendar(false)}>
						<X className='w-5 h-5' />
					</button>
				</div>

				<div className='flex justify-between items-center mb-4'>
					<button
						onClick={() =>
							setCurrentMonth(
								new Date(
									currentMonth.getFullYear(),
									currentMonth.getMonth() - 1
								)
							)
						}
						className='p-1 hover:bg-gray-100 rounded'>
						<ChevronLeft className='w-5 h-5' />
					</button>
					<div className='flex space-x-8'>
						<span className='font-semibold'>
							{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
						</span>
						<span className='font-semibold'>
							{monthNames[(currentMonth.getMonth() + 1) % 12]}{" "}
							{currentMonth.getMonth() === 11
								? currentMonth.getFullYear() + 1
								: currentMonth.getFullYear()}
						</span>
					</div>
					<button
						onClick={() =>
							setCurrentMonth(
								new Date(
									currentMonth.getFullYear(),
									currentMonth.getMonth() + 1
								)
							)
						}
						className='p-1 hover:bg-gray-100 rounded'>
						<ChevronRight className='w-5 h-5' />
					</button>
				</div>

				<div className='grid grid-cols-2 gap-8'>
					{[
						currentMonth,
						new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1),
					].map((month, index) => (
						<div
							key={index}
							className='text-center'>
							<div className='grid grid-cols-7 gap-1 mb-2'>
								{["S", "M", "T", "W", "T", "F", "S"].map((day) => (
									<div
										key={day}
										className='text-center text-sm font-medium text-gray-500 py-2'>
										{day}
									</div>
								))}
							</div>
							<div className='grid grid-cols-7 gap-1'>
								{getDaysInMonth(month).map((day, dayIndex) => {
									if (!day) {
										return (
											<div
												key={dayIndex}
												className='h-8 w-8'></div>
										);
									}
									const date = new Date(
										month.getFullYear(),
										month.getMonth(),
										day
									);
									const today = new Date();
									today.setHours(0, 0, 0, 0);
									const isPast = date < today;
									const isToday = date.toDateString() === today.toDateString();
									const isCheckIn =
										checkInDate?.toDateString() === date.toDateString();
									const isCheckOut =
										checkOutDate?.toDateString() === date.toDateString();
									const isInRange =
										checkInDate &&
										checkOutDate &&
										date > checkInDate &&
										date < checkOutDate;

									// For checkout mode, disable dates before or equal to checkin
									const isDisabledForCheckout =
										calendarMode === "checkout" &&
										checkInDate &&
										date <= checkInDate;
									
									// Check if date is booked (for hotels only)
									const isBooked = isDateBooked(date);
									
									const isDisabled = isPast || isDisabledForCheckout || isBooked;

									let className =
										"h-8 w-8 text-sm rounded flex items-center justify-center transition-colors";

									if (isBooked) {
										// Booked dates get a red/disabled appearance
										className += " bg-red-100 text-red-400 cursor-not-allowed line-through";
									} else if (isDisabled) {
										className += " opacity-50 cursor-not-allowed text-gray-400";
									} else if (isCheckIn) {
										className += " bg-blue-500 text-white font-medium";
									} else if (isCheckOut) {
										className += " bg-green-500 text-white font-medium";
									} else if (isInRange) {
										className += " bg-blue-100 text-blue-700";
									} else if (isToday) {
										className +=
											" text-blue-600 font-medium border border-blue-300";
									} else {
										className += " hover:bg-gray-100 text-gray-700";
									}
									return (
										<button
											key={dayIndex}
											className={className}
											disabled={isDisabled}
											onClick={() => handleDayClick(day, month)}>
											{day}
										</button>
									);
								})}
							</div>
						</div>
					))}
				</div>

				{/* Legend for hotels showing booked dates */}
				{serviceType === 'hotel' && bookedDates.length > 0 && (
					<div className='mt-4 pt-4 border-t'>
						<div className='text-xs text-gray-600 mb-2 font-medium'>Legend:</div>
						<div className='flex flex-wrap gap-3 text-xs'>
							<div className='flex items-center gap-2'>
								<div className='h-4 w-4 bg-red-100 rounded border border-red-200'></div>
								<span className='text-gray-600'>Booked</span>
							</div>
							<div className='flex items-center gap-2'>
								<div className='h-4 w-4 bg-blue-500 rounded'></div>
								<span className='text-gray-600'>Check-in</span>
							</div>
							<div className='flex items-center gap-2'>
								<div className='h-4 w-4 bg-green-500 rounded'></div>
								<span className='text-gray-600'>Check-out</span>
							</div>
						</div>
					</div>
				)}

				<div className='flex justify-end mt-4 space-x-2'>
					<button
						onClick={() => setShowCalendar(false)}
						className='px-4 py-2 text-gray-600 hover:bg-gray-100 rounded bg-white border border-gray-300'>
						Cancel
					</button>
					<button
						onClick={() => setShowCalendar(false)}
						className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'>
						Done
					</button>
				</div>
			</div>
		</div>
	);

	const ImageGalleryModal = () => (
		<div className='fixed inset-0 backdrop-blur-xs flex items-center justify-center z-50 p-4'>
			<div className='bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto border border-gray-300 shadow-xl'>
				<div className='flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10'>
					<div>
						<h3 className='text-xl font-semibold'>{currentHotelData.name}</h3>
						<p className='text-gray-600 text-sm mt-1'>
							{currentHotelData.images?.gallery?.length || 0} photos
						</p>
					</div>
					<button
						onClick={() => setShowImageGallery(false)}
						className='p-2 hover:bg-gray-100 rounded-full transition-colors'>
						<X className='w-6 h-6' />
					</button>
				</div>
				<div className='p-6'>
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
						{currentHotelData.images?.gallery?.map((image, index) => (
							<div
								key={index}
								className='relative group'>
								<img
									src={image}
									alt={`${currentHotelData.name} image ${index + 1}`}
									className='w-full h-64 object-cover rounded-lg cursor-pointer transition-transform group-hover:scale-105'
									onClick={() => {
										// Optional: Add lightbox functionality here
									}}
								/>
								<div className='absolute bottom-2 right-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs'>
									{index + 1} / {currentHotelData.images.gallery.length}
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);

	const RoomImagesModal = () => (
		<div className='fixed inset-0 backdrop-blur-xs flex items-center justify-center z-50'>
			<div className='bg-white border border-gray-300 rounded-lg w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto'>
				<div className='flex justify-between items-center p-6 border-b'>
					<h3 className='text-xl font-semibold'>
						{selectedRoom?.name} - Images
					</h3>
					<button onClick={() => setShowRoomModal(false)}>
						<X className='w-6 h-6' />
					</button>
				</div>
				<div className='p-6'>
					{/* Room details */}
					<div className='mt-6 p-4 bg-gray-50 rounded-lg'>
						<h4 className='font-semibold text-lg mb-2'>{selectedRoom?.name}</h4>
						<p className='text-gray-600'>
							Experience comfort and luxury in our well-appointed{" "}
							{selectedRoom?.name.toLowerCase()}. Each room features modern
							amenities and elegant furnishings to ensure a memorable stay.
						</p>
					</div>
				</div>
			</div>
		</div>
	);

	const calculateTotal = () => totalPriceDisplay;

	// Show loading state
	if (loading) {
		return (
			<div className='max-w-8xl px-10 py-6 bg-orange-50 min-h-screen flex items-center justify-center'>
				<div className='text-center'>
					<div className='animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900'></div>
					<p className='mt-4 text-gray-600'>Loading hotel details...</p>
				</div>
			</div>
		);
	}

	// Show error state
	if (error) {
		return (
			<div className='max-w-8xl px-10 py-6 bg-orange-50 min-h-screen flex items-center justify-center'>
				<div className='text-center'>
					<p className='text-red-600 text-lg'>{error}</p>
					<button
						onClick={() => window.location.reload()}
						className='mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'>
						Try Again
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className='max-w-8xl px-10 py-6 bg-orange-50 min-h-screen'>
			<Toaster />
			{/* Header */}
			<div className='mb-6 pt-4'>
				<div className='flex items-center text-sm text-gray-500 mb-2 space-x-2'>
					{currentHotelData.badges.map((badge, index) => (
						<React.Fragment key={index}>
							<span className='bg-[#C7D9E5] text-[#2F4157] px-3 py-1 rounded-full text-xs font-medium'>
								{badge}
							</span>
						</React.Fragment>
					))}
				</div>

				<h1 className='text-4xl font-bold mb-3 text-gray-800'>
					{currentHotelData.name}
				</h1>

				<div className='flex items-center space-x-6'>
					<span className='text-blue-600 font-medium'>
						{serviceLabels.starsLabel}
					</span>
				</div>
			</div>

			{/* Hero Image Section */}
			<div className='py-8'>
				<div className='grid grid-cols-4 grid-rows-2 gap-2 h-96 rounded-lg overflow-hidden'>
					{/* Large image on the left - spans 2 columns and 2 rows */}
					<div className='col-span-2 row-span-2 relative'>
						{currentHotelData.images?.gallery?.[0] && (
							<img
								src={currentHotelData.images.gallery[0]}
								alt={`${currentHotelData.name} main view`}
								className='w-full h-full object-cover rounded-l-lg'
							/>
						)}
					</div>

					{/* Right side - 4 smaller images in a 2x2 grid */}
					{currentHotelData.images?.gallery?.slice(1, 5).map((image, index) => (
						<div
							key={index}
							className={`col-span-1 row-span-1 relative ${
								index === 3 ? "group" : ""
							}`}>
							<img
								src={image}
								alt={`${currentHotelData.name} view ${index + 2}`}
								className={`w-full h-full object-cover ${
									index === 0
										? "rounded-tr-lg"
										: index === 1
										? ""
										: index === 2
										? ""
										: "rounded-br-lg"
								}`}
							/>

							{/* See all photos button overlay on the last image */}
							{index ===
								Math.min(3, currentHotelData.images?.gallery?.length - 2) &&
								currentHotelData.images?.gallery?.length > 1 && (
									<div className='absolute inset-0 bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-200'>
										<div className='absolute bottom-3 right-3'>
											<button
												onClick={() => setShowImageGallery(true)}
												className='bg-blue-900 bg-opacity-95 hover:bg-blue-800 text-white px-4 py-2 rounded-lg flex items-center space-x-2 shadow-lg transition-all duration-200 font-medium text-sm cursor-pointer'>
												<Camera className='w-4 h-4 text-white' />
												<span className='text-white'>See all photos</span>
											</button>
										</div>
									</div>
								)}
						</div>
					))}
				</div>
			</div>

			{/* Main layout */}
			<div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>
				{/* Left column - Images and content */}
				<div className='lg:col-span-3 space-y-8'>
					{/* Tabs */}
					<div className='flex border-b border-gray-200 space-x-2'>
						<button
							onClick={() => setActiveTab("details")}
							className={`px-8 py-4 font-semibold text-lg border-b-2 bg-white transition-colors ${
								activeTab === "details"
									? "border-[#2F4157] text-[#2F4157]"
									: "border-transparent text-gray-600 hover:text-gray-800"
							}`}>
							Service Details
						</button>
						<button
							onClick={() => setActiveTab("rooms")}
							className={`px-8 py-4 font-semibold text-lg border-b-2 bg-white transition-colors ${
								activeTab === "rooms"
									? "border-[#2F4157] text-[#2F4157]"
									: "border-transparent text-gray-600 hover:text-gray-800"
							}`}>
							Options & Pricing
						</button>
					</div>

					{/* Tab Content */}
					<div className='rounded-b-lg p-8'>
						{activeTab === "details" && (
							<>
								{/* Description */}
								<div className='mb-10'>
									<p className='text-gray-700 leading-relaxed text-lg'>
										{currentHotelData.description}
									</p>
								</div>

								{/* Amenities */}
								<div className='mb-10'>
									<h3 className='font-bold text-2xl mb-6 text-gray-800'>
										Amenities
									</h3>
									{hasAmenities ? (
										<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
											{displayAmenities.map((amenity, index) => (
												<div
													key={`${amenity.label}-${index}`}
													className='flex items-center space-x-4'>
													{React.createElement(getIcon(amenity.icon), {
														className: "w-6 h-6 text-gray-900",
													})}
													<span className='text-gray-700 text-lg'>
														{amenity.label}
													</span>
												</div>
											))}
										</div>
									) : (
										<p className='text-gray-600 text-base'>
											No amenities listed.
										</p>
									)}
								</div>
							</>
						)}

						{activeTab === "rooms" && (
							<div className='space-y-6'>
								{currentHotelData.rooms.map((room, index) => (
									<div
										key={index}
										className='flex items-center justify-between p-6 border rounded-lg hover:shadow-md transition-shadow'>
										<div className='flex items-center space-x-6'>
											<div>
												<h4 className='font-semibold text-lg text-gray-800'>
													{room.name}
												</h4>
											</div>
										</div>
										<button
											onClick={() => {
												setSelectedRoom(room);
												setShowRoomModal(true);
											}}
											className='bg-white px-4 py-2 rounded border border-gray-300 text-[#2F4157] font-medium flex items-center hover:bg-gray-50 transition-colors'>
											<ChevronRight className='w-5 h-5 mr-1' />
											View Details
										</button>
									</div>
								))}
							</div>
						)}
					</div>

					{/* Shared Content - FAQ */}
					<div className='rounded-lg p-8'>
						<h3 className='font-bold text-2xl mb-6 text-[#05073C]'>FAQ</h3>
						<div className='space-y-4'>
							{currentHotelData.faqData.map((faq, index) => (
								<div
									key={index}
									className='border border-gray-200 bg-white rounded-xl px-8 py-4'>
									<button
										className='flex justify-between items-center w-full text-left pb-2'
										onClick={() =>
											setOpenFAQ(openFAQ === index ? null : index)
										}>
										<span className='text-[#05073C] font-medium text-xl'>
											{faq.question}
										</span>
										<ChevronDown
											className={`w-5 h-5 text-gray-400 transition-transform ${
												openFAQ === index ? "rotate-180" : ""
											}`}
										/>
									</button>
									{openFAQ === index && (
										<p className='mt-4 text-[#05073C] leading-relaxed text-lg'>
											{faq.answer}
										</p>
									)}
								</div>
							))}
						</div>
					</div>
				</div>

				{/* Right column - Booking sidebar */}
				<div className='lg:col-span-1'>
					<div className='bg-white rounded-xl p-6 shadow-lg'>
						<div className='text-right mb-6'>
							<span className='text-sm text-gray-500'>Starting From:</span>
							<div className='text-3xl font-bold text-[#2F4157]'>
								{basePriceDisplay}
							</div>
						</div>

						{/* Date Selection */}
						<div className='space-y-4 mb-6'>
							<div className='grid grid-cols-2 gap-2'>
								<div
									className='border rounded-lg p-4 cursor-pointer hover:border-orange-300 transition-colors'
									onClick={() => {
										setCalendarMode("checkin");
										setShowCalendar(true);
									}}>
									<div className='text-xs text-gray-500 mb-1'>
										{serviceLabels.checkInLabel}
									</div>
									<div className='font-medium text-gray-800'>
										{selectedDates.checkIn || "Select date"}
									</div>
								</div>
								<div
									className='border rounded-lg p-4 cursor-pointer hover:border-orange-300 transition-colors'
									onClick={() => {
										setCalendarMode("checkout");
										setShowCalendar(true);
									}}>
									<div className='text-xs text-gray-500 mb-1'>
										{serviceLabels.checkOutLabel}
									</div>
									<div className='font-medium text-gray-800'>
										{selectedDates.checkOut || "Select date"}
									</div>
								</div>
							</div>

							{/* Time Selection */}
							<div className='relative border rounded-lg p-4 cursor-pointer hover:border-orange-300 transition-colors'>
								<div className='text-xs text-gray-500 mb-1'>Time</div>
								<div
									className='flex items-center'
									onClick={() => setShowTimeMenu(!showTimeMenu)}>
									<Clock className='w-4 h-4 text-gray-400 mr-2' />
									<span className='font-medium text-gray-800 mr-auto'>
										{selectedTime}
									</span>
									<ChevronDown className='w-4 h-4 text-gray-400' />
								</div>
								{showTimeMenu && (
									<div className='absolute top-full left-0 w-full bg-white border rounded shadow-lg z-10 mt-1 max-h-60 overflow-y-auto'>
										{loadingTimeSlots && serviceType === 'restaurant' ? (
											<div className='px-4 py-3 text-sm text-gray-500 text-center'>
												Loading available times...
											</div>
										) : serviceType === 'restaurant' && availableTimeSlots.length > 0 ? (
											availableTimeSlots.map((slot, i) => (
												<button
													key={i}
													onClick={() => {
														if (slot.available) {
															setSelectedTime(slot.time12);
															setShowTimeMenu(false);
														}
													}}
													disabled={!slot.available}
													className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between ${
														slot.available 
															? 'hover:bg-gray-100 cursor-pointer' 
															: 'bg-red-50 text-red-400 cursor-not-allowed opacity-60'
													}`}>
													<span>{slot.time12}</span>
													{!slot.available && (
														<span className='text-xs text-red-500'>Booked</span>
													)}
												</button>
											))
										) : (
											times.map((time, i) => (
												<button
													key={i}
													onClick={() => {
														setSelectedTime(time);
														setShowTimeMenu(false);
													}}
													className='w-full text-left px-4 py-2 hover:bg-gray-100 text-sm'>
													{time}
												</button>
											))
										)}
									</div>
								)}
							</div>
						</div>

						{/* Room Types */}
						<div className='mb-6'>
							<h4 className='font-semibold mb-4 text-gray-800'>
								{serviceLabels.roomTypeLabel}
							</h4>
							<div className='space-y-3'>
								{roomTypeOptions.map((room, index) => (
									<div
										key={index}
										className='flex items-center justify-between'>
										<label className='flex items-start cursor-pointer'>
											<input
												type='radio'
												name='roomType'
												className='mr-3 text-[#2F4157]'
												checked={selectedRooms.includes(room.type)}
												onChange={() => handleRoomChange(room.type)}
											/>
											<div>
												<span className='text-[#2F4157] font-medium'>
													{room.type}
												</span>
												{serviceType === "restaurant" &&
													room.diningType && (
														<div className='text-sm text-gray-500'>
															Dining Type: {room.diningType}
														</div>
													)}
											</div>
										</label>
										{serviceType !== "restaurant" && room.price && (
											<span className='font-semibold text-[#2F4157]'>
												{room.price}
											</span>
										)}
									</div>
								))}
							</div>
						</div>

						{/* Total and Book Button */}
						<div className='border-t pt-6'>
							<div className='flex justify-between items-center mb-6'>
								<span className='font-semibold text-lg text-[#2F4157]'>
									Total
								</span>
								<span className='text-2xl font-bold text-[#2F4157]'>
									{calculateTotal()}
								</span>
							</div>

							<button
								onClick={() => setShowBookingModal(true)}
								className='w-full bg-[#2F4157] text-white border border-[#2F4157] py-4 rounded-lg font-semibold text-lg hover:scale-102 transition-colors shadow-lg'>
								Book Now
							</button>
						</div>
					</div>
					<div className='rounded-lg py-4'>
						<VenueMapPreview
							googleMapsLocation={currentHotelData.googleMapsLocation}
							venueName={currentHotelData.name}
							address={currentHotelData.address}
							city={currentHotelData.city}
						/>
					</div>
				</div>

				<div className='lg:col-span-6 space-y-8'>
					{/* Shared Content - Guest Reviews */}
					<div className='rounded-lg p-8'>
						<h3 className='font-bold text-2xl mb-8 text-gray-800'>
							Guest Reviews
						</h3>
						<div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6 mb-8 mt-20'>
							{currentHotelData.testimonials.map((review, index) => (
								<div
									key={index}
									className='relative'>
									<div className='bg-white border rounded-lg p-6 pt-12 shadow-sm'>
										<div className='absolute -top-10 left-1/2 transform -translate-x-1/2'>
											<img
												src={review.image}
												alt={review.name}
												className='w-20 h-20 rounded-full border-4 border-white shadow-lg'
											/>
										</div>
										<div className='text-center mb-4'>
											<div className='flex items-center justify-center mb-1'>
												<span className='font-semibold text-gray-800 mr-2'>
													{review.name}
												</span>
												<span className='text-lg'>{review.flag}</span>
											</div>
											<span className='text-sm text-gray-500'>
												{review.country}
											</span>
										</div>
										<p className='text-sm text-gray-600 leading-relaxed'>
											{review.text}
										</p>
									</div>
								</div>
							))}
						</div>
					</div>

					{/* Shared Content - Ratings */}
					<div className='rounded-lg p-6 '>
						<div className='flex space-x-6 overflow-x-auto scrollbar-hide'>
							{currentHotelData.ratings.map((rating, index) => (
								<div
									key={index}
									className='flex-shrink-0 w-1/6 min-w-[140px]'>
									<div className='flex justify-between items-center mb-1'>
										<div className='text-sm font-medium text-gray-700'>
											{rating.label}
										</div>
										<div className='text-sm font-medium text-gray-600'>
											{rating.score}
										</div>
									</div>
									<div className='flex items-center h-1 bg-gray-200 rounded-full overflow-hidden'>
										<div
											className='h-full bg-[#07689F] rounded-full transition-all duration-300'
											style={{ width: `${(rating.score / 10) * 100}%` }}></div>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>

			{/* Modals */}
			{showCalendar && <CalendarPopup />}
			{showBookingModal && (
				<BookingModal
					setShowBookingModal={setShowBookingModal}
					serviceLabels={serviceLabels}
					selectedDates={selectedDates}
					bookingFormData={bookingFormData}
					handleBookingFormChange={handleBookingFormChange}
					handleBookingSubmit={handleBookingSubmit}
					priceSummary={priceSummary}
					selectedOptionLabel={selectedOptionLabel}
				/>
			)}
			{showImageGallery && <ImageGalleryModal />}
			{showRoomModal && <RoomImagesModal />}
		</div>
	);
};

export default HotelBookingComponent;
