import React, { useState } from "react";
import {
  Menu,
  X,
  ChevronDown,
  MapPin,
  Building,
  Car,
  UtensilsCrossed,
} from "lucide-react";
import logo from "../assets/logoBlack.png";
import profile from "../assets/profile.png";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleServicesMouseEnter = () => {
    setIsServicesDropdownOpen(true);
  };

  const handleServicesMouseLeave = () => {
    setIsServicesDropdownOpen(false);
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
    <nav className="flex justify-between items-center px-12 py-6 bg-[#d8e5ee] text-[#2F4157] font-['Open_Sans',sans-serif]">
      <div className="w-full flex justify-between items-center">
        {/* Logo */}
        <div className="flex-shrink-0 flex items-center transition-transform duration-200 hover:scale-105">
          <a href="/">
            {/* Logo placeholder with black color - replace with your actual logo */}
            <div className="h-[50px] w-[120px] rounded-md flex items-center justify-center mr-2">
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
                className="text-[#2F4157] no-underline font-semibold text-lg transition-all duration-300 hover:text-[#4F7F96] hover:-translate-y-0.5 inline-block"
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
              <div className="flex items-center gap-1 text-[#2F4157] font-semibold text-lg transition-all duration-300 hover:text-[#4F7F96] hover:-translate-y-0.5">
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
                className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 min-w-[280px] z-[1000] overflow-hidden transition-all duration-300 ${
                  isServicesDropdownOpen
                    ? "opacity-100 visible translate-y-0 scale-100"
                    : "opacity-0 invisible -translate-y-2 scale-95"
                }`}
              >
                {/* Dropdown Header */}
                <div className="px-4 py-3 bg-gradient-to-r from-[#2F4157] to-[#4F7F96] text-white">
                  <h3 className="font-semibold text-sm">Our Services</h3>
                  <p className="text-xs opacity-90">Choose what you need</p>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  {servicesData.map((service, index) => (
                    <a
                      key={service.path}
                      href={service.path}
                      className="flex items-center gap-3 px-4 py-3 text-[#2F4157] no-underline transition-all duration-200 hover:bg-gradient-to-r hover:from-[#f8fafc] hover:to-[#f1f5f9] group hover:translate-x-1"
                      style={{
                        animationDelay: `${index * 100}ms`,
                      }}
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#d8e5ee] group-hover:bg-[#2F4157] group-hover:text-white transition-all duration-200">
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
                href="/about"
                className="text-[#2F4157] no-underline font-semibold text-lg transition-all duration-300 hover:text-[#4F7F96] hover:-translate-y-0.5 inline-block"
              >
                About Us
              </a>
            </li>
          </ul>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-6">
          {/* Desktop Buttons */}
          <div className="hidden lg:flex items-center gap-6">
            <a
              href="/chat"
              className="bg-[#2F4157] text-white px-6 py-3 rounded-lg no-underline font-semibold whitespace-nowrap inline-block transition-all duration-300 hover:bg-[#1e2d3d] hover:shadow-lg hover:scale-105 active:scale-95"
            >
              Plan Your Trip
            </a>
            <a
              href="/BusinessRegistration"
              className="bg-white text-[#2F4157] px-6 py-3 rounded-lg no-underline font-semibold border border-[#2F4157] whitespace-nowrap inline-block transition-all duration-300 hover:bg-[#2F4157] hover:text-white hover:shadow-lg hover:scale-105 active:scale-95"
            >
              List Your Business
            </a>
          </div>

          {/* Profile Image */}
          <div className="hidden lg:block transition-transform duration-200 hover:scale-110add">
            <img src={profile} alt="profile image" width={45} height={45} className="rounded-full" />
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden bg-none border-none text-2xl text-[#2F4157] cursor-pointer p-2 transition-transform duration-200 hover:scale-110 active:scale-90"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden absolute top-full left-0 w-full bg-[#d8e5ee] z-[999] shadow-lg transition-all duration-300 overflow-hidden ${
          isMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col p-6 gap-4">
          <a
            href="/"
            className="text-[#2F4157] no-underline font-semibold text-lg py-2 transition-all duration-300 hover:translate-x-2"
          >
            Home
          </a>

          {/* Mobile Services Menu */}
          <div className="py-2">
            <span className="text-[#2F4157] font-semibold text-lg">
              Services
            </span>
            <div className="ml-4 mt-2 space-y-2">
              {servicesData.map((service, index) => (
                <a
                  key={service.path}
                  href={service.path}
                  className="flex items-center gap-2 text-[#2F4157] no-underline py-1 text-base transition-all duration-300 hover:translate-x-2"
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
            className="text-[#2F4157] no-underline font-semibold text-lg py-2 transition-all duration-300 hover:translate-x-2"
          >
            About Us
          </a>

          {/* Mobile Buttons */}
          <div className="flex flex-col gap-3 mt-4">
            <a
              href="/plan-your-trip"
              className="bg-[#2F4157] text-white px-6 py-3 rounded-lg no-underline font-semibold text-center transition-all duration-300 hover:bg-[#1e2d3d]"
            >
              Plan Your Trip
            </a>
            <a
              href="/list-your-business"
              className="bg-white text-[#2F4157] px-6 py-3 rounded-lg no-underline font-semibold border border-[#2F4157] text-center transition-all duration-300 hover:bg-[#2F4157] hover:text-white"
            >
              List Your Business
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
