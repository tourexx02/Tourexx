// For Trip Organizers Page
import React, { useState, useEffect } from "react";
import { BookingComponent } from "./Services";
import { serviceConfigs } from "./serviceData";
import { useNavigate } from "react-router-dom";
import { tripOrganizerAPI, transformServiceData } from "../services/api";

export const TripOrganizersPage = () => {
  const navigate = useNavigate();
  const config = serviceConfigs.tripOrganizers;
  const [tripOrganizers, setTripOrganizers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch trip organizers from API
  useEffect(() => {
    const fetchTripOrganizers = async () => {
      try {
        setLoading(true);
        const response = await tripOrganizerAPI.getAll();
        const allTripOrganizers = response.data || response;
        // Filter to show only approved trip organizers
        const approvedTripOrganizers = Array.isArray(allTripOrganizers) ? allTripOrganizers.filter(organizer => organizer.approved === true) : [];
        const transformedTripOrganizers = transformServiceData(approvedTripOrganizers, 'trip-organizer');
        setTripOrganizers(transformedTripOrganizers);
        setError(null);
      } catch (err) {
        console.error('Error fetching trip organizers:', err);
        setError('Failed to load trip organizers. Please try again later.');
        // Fallback to mock data if API fails
        setTripOrganizers(config.data);
      } finally {
        setLoading(false);
      }
    };

    fetchTripOrganizers();
  }, [config.data]);

  const handleBooking = (organizer) => {
    // Navigate to trip organizer detail page with organizer ID
    navigate(`/services/trip-organizers/${organizer.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading trip organizers...</p>
        </div>
      </div>
    );
  }

  return (
    <BookingComponent
      title={config.title}
      subtitle={config.subtitle}
      breadcrumbs={config.breadcrumbs}
      items={tripOrganizers}
      filters={config.filters}
      sortOptions={config.sortOptions}
      onItemBook={handleBooking}
      error={error}
    />
  );
};
