import React, { useState, useEffect } from "react";
import { BookingComponent } from "./Services";
import { serviceConfigs } from "./serviceData";
import { useNavigate } from "react-router-dom";
import { restaurantAPI, transformServiceData } from "../services/api";

export const ResturantsPage = () => {
  const navigate = useNavigate();
  const config = serviceConfigs.resturants;
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch restaurants from API
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const response = await restaurantAPI.getAll();
        const allRestaurants = response.data || response;
        // Filter to show only approved restaurants
        const approvedRestaurants = Array.isArray(allRestaurants) ? allRestaurants.filter(restaurant => restaurant.approved === true) : [];
        const transformedRestaurants = transformServiceData(approvedRestaurants, 'restaurant');
        setRestaurants(transformedRestaurants);
        setError(null);
      } catch (err) {
        console.error('Error fetching restaurants:', err);
        setError('Failed to load restaurants. Please try again later.');
        // Fallback to mock data if API fails
        setRestaurants(config.data);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [config.data]);

  const handleBooking = (restaurant) => {
    // Navigate to restaurant detail page with restaurant ID
    navigate(`/services/restaurants/${restaurant.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading restaurants...</p>
        </div>
      </div>
    );
  }

  return (
    <BookingComponent
      title={config.title}
      subtitle={config.subtitle}
      breadcrumbs={config.breadcrumbs}
      items={restaurants}
      filters={config.filters}
      sortOptions={config.sortOptions}
      onItemBook={handleBooking}
      itemsPerPage={4}
      error={error}
    />
  );
};
