import React, { useState, useEffect } from "react";
import { BookingComponent } from "./Services";
import { serviceConfigs } from "./serviceData";
import { useNavigate } from "react-router-dom";
import { hotelAPI, transformServiceData } from "../services/api";

export const HotelsPage = () => {
  const navigate = useNavigate();
  const config = serviceConfigs.hotels;
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch hotels from API
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);
        const response = await hotelAPI.getAll();
        const allHotels = response.data || response;
        // Filter to show only approved hotels
        const approvedHotels = Array.isArray(allHotels) ? allHotels.filter(hotel => hotel.approved === true) : [];
        const transformedHotels = transformServiceData(approvedHotels, 'hotel');
        setHotels(transformedHotels);
        setError(null);
      } catch (err) {
        console.error('Error fetching hotels:', err);
        setError('Failed to load hotels. Please try again later.');
        // Fallback to mock data if API fails
        setHotels(config.data);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [config.data]);

  const handleBooking = (hotel) => {
    // Navigate to hotel detail page with hotel ID
    navigate(`/services/hotels/${hotel.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading hotels...</p>
        </div>
      </div>
    );
  }

  return (
    <BookingComponent
      title={config.title}
      subtitle={config.subtitle}
      breadcrumbs={config.breadcrumbs}
      items={hotels}
      filters={config.filters}
      sortOptions={config.sortOptions}
      onItemBook={handleBooking}
      itemsPerPage={4}
      error={error}
    />
  );
};
