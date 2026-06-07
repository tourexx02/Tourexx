import { useEffect, useRef } from "react";
import { MapPin, ExternalLink } from "lucide-react";
import { parseGoogleMapsLocation } from "../utils/googleMapsLocation";

export default function VenueMapPreview({
  googleMapsLocation,
  venueName,
  address,
  city,
}) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  const locationData = parseGoogleMapsLocation(googleMapsLocation);
  const displayName = venueName || city || "Venue location";

  useEffect(() => {
    if (!locationData?.lat || !locationData?.lng) return;

    const { lat, lng } = locationData;

    if (!mapInstanceRef.current && mapRef.current && window.L) {
      mapInstanceRef.current = window.L.map(mapRef.current, {
        zoomControl: false,
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        touchZoom: false,
      }).setView([lat, lng], 15);

      window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(mapInstanceRef.current);

      markerRef.current = window.L.marker([lat, lng])
        .addTo(mapInstanceRef.current)
        .bindPopup(displayName);
    } else if (mapInstanceRef.current && window.L) {
      mapInstanceRef.current.setView([lat, lng], 15);
      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
        markerRef.current.setPopupContent(displayName);
      } else {
        markerRef.current = window.L.marker([lat, lng])
          .addTo(mapInstanceRef.current)
          .bindPopup(displayName);
      }
    }

    return () => {
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
    };
  }, [locationData?.lat, locationData?.lng, displayName]);

  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const handleOpenGoogleMaps = () => {
    if (locationData?.googleMapsUrl) {
      window.open(locationData.googleMapsUrl, "_blank", "noopener,noreferrer");
    }
  };

  if (!googleMapsLocation?.trim()) {
    return (
      <div className="w-full h-48 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200">
        <div className="text-center px-4">
          <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Location not available</p>
          {(address || city) && (
            <p className="text-xs text-gray-400 mt-1">
              {[address, city].filter(Boolean).join(", ")}
            </p>
          )}
        </div>
      </div>
    );
  }

  const hasCoordinates = locationData?.lat && locationData?.lng;

  return (
    <button
      type="button"
      onClick={handleOpenGoogleMaps}
      className="w-full rounded-lg overflow-hidden bg-gray-100 relative group cursor-pointer border border-gray-200 hover:border-[#2F4157] transition-colors text-left"
      title="Open in Google Maps"
    >
      {hasCoordinates ? (
        <div ref={mapRef} className="w-full h-48" />
      ) : (
        <div className="w-full h-48 flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
          <MapPin className="w-12 h-12 text-red-500" />
        </div>
      )}

      <div className="absolute top-2 right-2 bg-white bg-opacity-95 rounded-md px-2 py-1 text-xs font-medium text-gray-700 flex items-center gap-1 shadow-sm">
        <MapPin size={12} className="text-red-500" />
        {displayName}
      </div>

      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
        <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-full px-3 py-1.5 text-xs font-medium text-gray-800 shadow-md flex items-center gap-1.5">
          <ExternalLink size={14} />
          Open in Google Maps
        </span>
      </div>
    </button>
  );
}
