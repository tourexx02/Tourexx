import React from "react";
import hotelBookingImage from "../assets/Hotel.png";
const HotelBookingSection = () => {
  return (
    <section id="services-section" className="py-5 px-5" style={{ backgroundColor: "#F4EFEB" }}>
      <div className="max-w-6xl mx-auto flex flex-col-reverse lg:flex-row gap-12 lg:gap-12 items-center">
        {/* Left Section - Single Image */}

        {/* <div className="relative w-full max-w-2xl"> */}
        <div className="flex-1 flex justify-center items-center">
          <img
            src={hotelBookingImage}
            alt="Exclusive Hotel Booking"
            className="max-w-full h-auto rounded-xl block"
          />
        </div>
        {/* </div> */}

        {/* Right Section - Text and Button */}
        <div className="flex-1 lg:pl-8">
          <h2
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-5 leading-tight"
            style={{
              fontFamily: '"Open Sans", sans-serif',
              color: "#4F7F96",
            }}
          >
            Exclusive Hotel
            <br />
            Booking.
          </h2>
          <p
            className="text-lg lg:text-xl leading-relaxed mb-8 text-gray-700"
            style={{
              fontFamily: '"Playfair Display", serif',
              color: "#383737",
              lineHeight: "1.6",
            }}
          >
            Search and book your favorite hotels with ease. Browse stunning
            images, read authentic reviews, and compare options to make the most
            informed decision.
          </p>
          <a href="/services/hotels">
            <button
              className="font-semibold text-white border-none rounded-md px-7 py-3.5 cursor-pointer flex items-center gap-2.5 transition-all duration-300 ease-in-out hover:transform hover:-translate-y-1 hover:shadow-xl w-full sm:w-auto justify-center sm:justify-start"
              style={{
                fontFamily: '"Inter", sans-serif',
                backgroundColor: "#2F4157",
                boxShadow: "none",
              }}
              onMouseEnter={(e) => {
                e.target.style.boxShadow = "0 10px 20px rgba(0, 0, 0, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.target.style.boxShadow = "none";
              }}
            >
              Explore Hotels
            </button>
          </a>
        </div>
      </div>

      {/* Add Google Fonts */}
      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap");
      `}</style>
    </section>
  );
};

export default HotelBookingSection;
