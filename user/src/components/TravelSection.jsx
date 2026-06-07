import React from "react";
import travelMainImage from "../assets/Travel.png";

const TravelSection = () => {
  return (
    <section className="py-5 px-5 bg-[#F4EFEB]">
      <div className="max-w-6xl mx-auto flex gap-12 items-center lg:flex-row flex-col lg:gap-12 md:gap-8 gap-8">
        {/* Left Section - Single Image */}
        <div className="flex-1 flex justify-center items-center">
          <img
            src={travelMainImage}
            alt="Trip Planning"
            className="max-w-full h-auto"
          />
        </div>
        {/* rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] block */}

        {/* Right Section - Text and Button */}
        <div className="flex-1 lg:pl-8 pl-0">
          <h2 className="font-sans text-6xl font-bold text-[#4F7F96] mb-5 leading-tight lg:text-6xl md:text-4xl sm:text-3xl text-3xl">
            Trip Planning at
            <br />
            Your Fingertips.
          </h2>
          <p className="font-serif text-xl leading-relaxed text-[#383737] mb-8 lg:text-xl md:text-lg text-base">
            With Tourex, you can connect with expert trip organizers to curate
            your ideal itinerary. Whether it's a relaxing vacation or an
            action-packed journey, we've got the perfect plan just for you.
          </p>
          <a href="/services/trip-organizers">
            <button className="font-sans text-base font-semibold bg-[#2F4157] text-white border-none rounded-md py-3.5 px-7 cursor-pointer transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(0,0,0,0.2)] md:w-auto w-full justify-center">
              Plan Your Trip
            </button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default TravelSection;
