// For Transport Page
import React, { useState, useEffect } from "react";
import { BookingComponent } from "./Services";
import { serviceConfigs } from "./serviceData";
import { useNavigate } from "react-router-dom";
import { transportAPI, transformServiceData } from "../services/api";

export const TransportPage = () => {
  const navigate = useNavigate();
  const config = serviceConfigs.transport;
  const [transports, setTransports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch transports from API
  useEffect(() => {
    const fetchTransports = async () => {
      try {
        setLoading(true);
        const response = await transportAPI.getAll();
        const allTransports = response.data || response;
        // Filter to show only approved transports
        const approvedTransports = Array.isArray(allTransports) ? allTransports.filter(transport => transport.approved === true) : [];
        const transformedTransports = transformServiceData(approvedTransports, 'transport');
        setTransports(transformedTransports);
        setError(null);
      } catch (err) {
        console.error('Error fetching transports:', err);
        setError('Failed to load transport services. Please try again later.');
        // Fallback to mock data if API fails
        setTransports(config.data);
      } finally {
        setLoading(false);
      }
    };

    fetchTransports();
  }, [config.data]);

  const handleBooking = (transport) => {
    // Navigate to transport detail page with transport ID
    navigate(`/services/transport/${transport.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading transport services...</p>
        </div>
      </div>
    );
  }

  return (
    <BookingComponent
      title={config.title}
      subtitle={config.subtitle}
      breadcrumbs={config.breadcrumbs}
      items={transports}
      filters={config.filters}
      sortOptions={config.sortOptions}
      onItemBook={handleBooking}
      error={error}
    />
  );
};
