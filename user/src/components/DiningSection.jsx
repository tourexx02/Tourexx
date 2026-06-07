import React from "react";
import diningMainImage from "../assets/Food.png";

const DiningSection = () => {
  return (
    <section className="py-5 px-5 bg-[#F4EFEB]">
      <div className="max-w-6xl mx-auto flex gap-12 items-center lg:flex-row flex-col lg:gap-12 md:gap-8 gap-8">
        {/* Left Section - Text and Button */}
        <div className="flex-1 lg:pr-8 pr-0">
          <h2 className="font-sans text-6xl font-bold text-[#4F7F96] mb-5 leading-tight lg:text-6xl md:text-4xl sm:text-3xl text-3xl">
            Delicious Dining,
            <br />
            Delivered to You.
          </h2>
          <p className="font-serif text-xl leading-relaxed text-[#383737] mb-8 lg:text-xl md:text-lg text-base">
            From local favorites to fine dining, find a place that suits your
            taste. View menus, ratings, and reviews to make sure your dining
            experience is as enjoyable as the food itself.
          </p>
          <a href="/services/restaurants">
            <button className="font-sans text-base font-semibold bg-[#2F4157] text-white border-none rounded-md py-3.5 px-7 cursor-pointer transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl md:w-auto w-full justify-center">
              Find Your Meal
            </button>
          </a>
        </div>

        {/* Right Section - Single Image without a container */}
        <div className="flex-1 flex justify-center items-center">
          <img
            src={diningMainImage}
            alt="Delicious Dining"
            className="max-w-full h-auto rounded-xl block"
          />
        </div>
      </div>
    </section>
  );
};

export default DiningSection;
