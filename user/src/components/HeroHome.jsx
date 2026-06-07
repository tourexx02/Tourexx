import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import {
  Menu,
  X,
  ChevronDown,
  MapPin,
  Building,
  Car,
  UtensilsCrossed,
  Star,
} from "lucide-react";
import logo from "../assets/logo.png";
import profile from "../assets/profile.png";
import mountainBg from "../assets/hero.png";
import ai from "../assets/AI.svg";

const NavbarHeroSection = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const [dropdownTimeoutId, setDropdownTimeoutId] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Handle scroll to services when navigating from another page
  useEffect(() => {
    if (location.state?.scrollToServices) {
      setTimeout(() => {
        const servicesSection = document.getElementById('services-section');
        if (servicesSection) {
          servicesSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 100); // Small delay to ensure the page has loaded
      
      // Clear the state to prevent scrolling on subsequent renders
      navigate('/', { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleServicesMouseEnter = () => {
    // Clear any existing timeout
    if (dropdownTimeoutId) {
      clearTimeout(dropdownTimeoutId);
      setDropdownTimeoutId(null);
    }
    setIsServicesDropdownOpen(true);
  };

  const handleServicesMouseLeave = () => {
    // Add a delay before closing to allow users to move to dropdown
    const timeoutId = setTimeout(() => {
      setIsServicesDropdownOpen(false);
    }, 150); // 150ms delay
    setDropdownTimeoutId(timeoutId);
  };

  const handleDropdownMouseEnter = () => {
    // Clear timeout if user moves to dropdown
    if (dropdownTimeoutId) {
      clearTimeout(dropdownTimeoutId);
      setDropdownTimeoutId(null);
    }
  };

  const handleDropdownMouseLeave = () => {
    // Close dropdown when leaving dropdown area
    setIsServicesDropdownOpen(false);
  };

  const scrollToServices = () => {
    // If we're on the home page, scroll to services section
    if (location.pathname === '/') {
      const servicesSection = document.getElementById('services-section');
      if (servicesSection) {
        servicesSection.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    } else {
      // If we're on another page, navigate to home and then scroll
      navigate('/', { state: { scrollToServices: true } });
    }
  };

  // Services data with icons
  const servicesData = [
		{
			name: "Hotel Reservations",
			path: "/services/hotels",
			icon: Building,
			description: "Find perfect accommodations",
		},
		{
			name: "Restaurant Booking",
			path: "/services/restaurants",
			icon: UtensilsCrossed,
			description: "Reserve dining experiences",
		},
    {
      name: "Trip Organizer",
      path: "/services/trip-organizers",
      icon: Car,
      description: "Plan your complete journey",
    },
		{
			name: "Transport Booking",
			path: "/services/transport",
			icon: MapPin,
			description: "Book buses & more",
		},
	];

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background with mountain scenery */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${mountainBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      />

      {/* Navbar */}
      <nav className="relative z-50 flex justify-between items-center px-4 sm:px-8 lg:px-12 py-4 text-white">
        <div className="w-full flex justify-between items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center transition-transform duration-200 hover:scale-105">
            <a href="/" className="flex items-center">
              <div className="text-white font-bold text-xl sm:text-2xl flex items-center">
                <img src={logo} alt="Company Logo" width={150} height={80} />
              </div>
            </a>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="flex-grow flex justify-center hidden lg:flex">
            <ul className="flex list-none m-0 p-0 gap-10">
              <li>
                <a
                  href="/"
                  className="text-white no-underline font-medium text-lg transition-all duration-300 hover:text-gray-200 hover:-translate-y-0.5 inline-block"
                >
                  Home
                </a>
              </li>

              {/* Services Dropdown */}
              <li
                className="relative cursor-pointer"
                onMouseEnter={handleServicesMouseEnter}
                onMouseLeave={handleServicesMouseLeave}
              >
                <div className="flex items-center gap-1 text-white font-medium text-lg transition-all duration-300 hover:text-gray-200 hover:-translate-y-0.5">
                  <span>Services</span>
                  <div
                    className={`transition-transform duration-300 ${
                      isServicesDropdownOpen ? "rotate-180" : "rotate-0"
                    }`}
                  >
                    <ChevronDown size={16} />
                  </div>
                </div>

                {/* Enhanced Dropdown Menu */}
                <div
                  className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 min-w-[280px] z-[9999] overflow-hidden transition-all duration-300 ${
                    isServicesDropdownOpen
                      ? "opacity-100 visible translate-y-0 scale-100"
                      : "opacity-0 invisible -translate-y-2 scale-95"
                  }`}
                  onMouseEnter={handleDropdownMouseEnter}
                  onMouseLeave={handleDropdownMouseLeave}
                >
                  {/* Dropdown Header */}
                  <div className="px-4 py-3 bg-gradient-to-r from-slate-700 to-slate-600 text-white">
                    <h3 className="font-semibold text-sm">Our Services</h3>
                    <p className="text-xs opacity-90">Choose what you need</p>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    {servicesData.map((service, index) => (
                      <a
                        key={service.path}
                        href={service.path}
                        className="flex items-center gap-3 px-4 py-3 text-slate-700 no-underline transition-all duration-200 hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100 group hover:translate-x-1"
                        style={{
                          animationDelay: `${index * 100}ms`,
                        }}
                      >
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-200 group-hover:bg-slate-700 group-hover:text-white transition-all duration-200">
                          <service.icon size={16} />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">
                            {service.name}
                          </span>
                          <span className="text-xs text-gray-500 group-hover:text-gray-600">
                            {service.description}
                          </span>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </li>

              <li>
                <a
                  href="/About"
                  className="text-white no-underline font-medium text-lg transition-all duration-300 hover:text-gray-200 hover:-translate-y-0.5 inline-block"
                >
                  About Us
                </a>
              </li>
            </ul>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Desktop Button */}
            <div className="hidden lg:flex items-center">
              <a
                href="/BusinessRegistration"
                className="bg-slate-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg no-underline font-medium whitespace-nowrap inline-block transition-all duration-300 hover:bg-slate-800 hover:shadow-lg hover:scale-105 active:scale-95"
              >
                List Your Business
              </a>
            </div>

            {/* Profile Image */}
            <div className="hidden lg:block transition-transform duration-200 hover:scale-110">
              <img src={profile} alt="profile image" width={45} height={45} className="rounded-full" />
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden bg-none border-none text-2xl text-white cursor-pointer p-2 transition-transform duration-200 hover:scale-110 active:scale-90 z-50 relative"
              onClick={toggleMenu}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden absolute top-full left-0 w-full bg-black bg-opacity-90 backdrop-blur-sm z-40 shadow-lg transition-all duration-300 overflow-hidden  ${
            isMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex flex-col p-6 gap-4">
            <a
              href="/"
              className="text-white no-underline font-medium text-lg py-2 transition-all duration-300 hover:translate-x-2"
            >
              Home
            </a>

            {/* Mobile Services Menu */}
            <div className="py-2">
              <span className="text-white font-medium text-lg">Services</span>
              <div className="ml-4 mt-2 space-y-2">
                {servicesData.map((service, index) => (
                  <a
                    key={service.path}
                    href={service.path}
                    className="flex items-center gap-2 text-white text-opacity-80 no-underline py-1 text-base transition-all duration-300 hover:translate-x-2 hover:text-opacity-100"
                    style={{
                      animationDelay: `${index * 100}ms`,
                    }}
                  >
                    <service.icon size={16} />
                    {service.name}
                  </a>
                ))}
              </div>
            </div>

            <a
              href="/about"
              className="text-white no-underline font-medium text-lg py-2 transition-all duration-300 hover:translate-x-2"
            >
              About Us
            </a>

            {/* Mobile Button */}
            <div className="flex flex-col gap-3 mt-4">
              <a
                href="/list-your-business"
                className="bg-slate-700 text-white px-6 py-3 rounded-lg no-underline font-medium text-center transition-all duration-300 hover:bg-slate-800"
              >
                List Your Business
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col justify-center items-start px-4 sm:px-8 lg:px-12 py-20 sm:py-32 text-white min-h-[70vh]">
        <div className="max-w-4xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Your All-in-One <span className="text-[#2F4157]">Travel </span>
            <br />
            <span className="text-gray-200">Companion.</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-200 mb-8 max-w-2xl leading-relaxed">
            Effortlessly browse, book, and organize your entire travel
            experience in one place.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <a href="/chat">
              <button className="flex items-center gap-2 bg-[#7397AF] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-medium text-base sm:text-lg transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95">
                <img src={ai} alt="ai icon" size={20} />
                Create My Itinerary
              </button>
            </a>

            <button 
              onClick={scrollToServices}
              className="flex items-center gap-2 bg-[#2F4157] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-medium text-base sm:text-lg transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95 "
            >
              Explore all Features
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavbarHeroSection;
