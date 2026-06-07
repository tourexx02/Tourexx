// import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

// Import your components
import Home from "./components/HomePage";
import TravelApp from "./components/Conversation";
import About from "./components/About";
import { BookingComponent } from "./components/Services";
import { TransportPage } from "./components/TransportService";
import { HotelsPage } from "./components/RestaurantService";
import { TripOrganizersPage } from "./components/TripService";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import BusinessRegistration from "./components/BusinessRegistration"; // Import the new component

import HotelBookingComponent from "./components/ServiceDetail";
import {
  grandPalmCarRentalData,
  monalRestaurantData,
  tourGuideData,
} from "./components/ServiceDetailData";
import { ResturantsPage } from "./components/HotelService";

// Layout component to handle conditional navbar rendering
const Layout = ({ children }) => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <>
      {/* Only show Navbar1 if NOT on home page */}
      {!isHomePage && <Navbar />}

      {/* Page content */}
      <main>{children}</main>

      {/* Footer on all pages */}
      <Footer />
    </>
  );
};

// Main App component
const App = () => {
  // State for booking data (you can move this to a context if needed)
  // const [bookingData, setBookingData] = useState({
  //   selectedDateRange: null,
  //   selectedRooms: [],
  //   roomPrices: {},
  //   total: 0,
  //   selectedTime: null,
  // });

  // const handleBookingData = (data) => {
  //   setBookingData(data);
  // };

  return (
    <Router>
      <Layout>
        <Routes>
          {/* Home Page - Has its own navbar, so Layout won't show Navbar1 */}
          <Route path="/" element={<Home />} />

          {/* Chat Page */}
          <Route path="/chat" element={<TravelApp />} />

          {/* Hotel Services */}
          <Route path="/services/hotels" element={<HotelsPage />} />
          <Route
            path="/services/hotels/:id"
            element={<HotelBookingComponent />}
          />
          <Route
            path="/services/hotels/monal"
            element={<HotelBookingComponent />}
          />

          {/* Transport Services */}
          <Route path="/services/transport" element={<TransportPage />} />
          <Route
            path="/services/transport/:id"
            element={<HotelBookingComponent />}
          />
          <Route
            path="/services/transport/Hilex"
            element={
              <HotelBookingComponent hotelData={grandPalmCarRentalData} />
            }
          />

          {/* Restaurant Services */}
          <Route path="/services/restaurants" element={<ResturantsPage />} />
          <Route
            path="/services/restaurants/:id"
            element={<HotelBookingComponent />}
          />
          <Route
            path="/services/resturants/monal"
            element={<HotelBookingComponent hotelData={monalRestaurantData} />}
          />

          {/* Trip Organizer Services */}
          <Route
            path="/services/trip-organizers"
            element={<TripOrganizersPage />}
          />
          <Route
            path="/services/trip-organizers/:id"
            element={<HotelBookingComponent />}
          />
          <Route
            path="/services/trip-organizers/ali"
            element={<HotelBookingComponent hotelData={tourGuideData} />}
          />
          <Route path="/BusinessRegistration" element={<BusinessRegistration />} />


          {/* Booking Confirmation - Shared for all services */}
          {/* <Route
            path="/booking-confirmation"
            element={
              <BookingConfirmation
                selectedDateRange={bookingData.selectedDateRange}
                selectedRooms={bookingData.selectedRooms}
                roomPrices={bookingData.roomPrices}
                total={bookingData.total}
                selectedTime={bookingData.selectedTime}
              />
            }
          /> */}

          {/* 404 Page - Optional */}
          <Route path="/about" element={<About />} />
          <Route
            path="*"
            element={
              <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                  <p className="text-gray-600 mb-4">Page not found</p>
                  <a
                    href="/"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Go Home
                  </a>
                </div>
              </div>
            }
          />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
