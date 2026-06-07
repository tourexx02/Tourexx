import React from 'react';
import aboutImage from '../assets/aboutus.png';

const About = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Banner Section */}
      <div
        className="relative w-full h-[400px] bg-cover bg-center"
        style={{ backgroundImage: `url(${aboutImage})` }}
      >
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative flex items-center justify-center h-full text-white text-center">
          <h1 className="text-6xl md:text-6xl font-semibold tracking-wider">
            About Us
          </h1>
        </div>
      </div>

      {/* About Us Section */}
      <section className="px-6 py-12 md:px-20 md:py-24 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <p className="text-xl md:text-2xl font-light text-gray-800">
            Welcome to Tourex, your ultimate web platform for planning the perfect trip in just 3 minutes! 
          </p>

          <p className="text-lg md:text-xl font-medium text-gray-700">
            At Tourex, we provide all the tools you need to plan your dream trip effortlessly. From browsing and
            booking hotels, restaurants, transport options, to finding the best trip organizers. The best part? You can
            generate a personalized AI Itinerary right from our platform!
          </p>

          <p className="text-lg md:text-xl text-gray-700">
            Whether you’re planning a weekend getaway or a month-long vacation, we make travel planning easy, fast, and
            fun! Let us help you plan your next adventure in no time.
          </p>
        </div>
      </section>

      {/* Mission Statement Section */}
      <section className="bg-[#2F4157] py-12 my-4">
        <div className="max-w-4xl mx-auto text-center text-white space-y-4">
          <h2 className="text-3xl md:text-4xl font-semibold">
            Our Mission
          </h2>
          <p className="text-lg md:text-xl">
            Our mission is simple: To revolutionize the way you plan and experience travel. We leverage the power of
            AI and cutting-edge technology to make your trip planning process as simple and enjoyable as possible.
          </p>
        </div>
      </section>

      
    </div>
  );
};

export default About;
