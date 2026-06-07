export const parseGoogleMapsLocation = (input) => {
  if (!input || !input.trim()) return null;

  const trimmed = input.trim();

  const coordMatch = trimmed.match(/^(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)$/);
  if (coordMatch) {
    const lat = parseFloat(coordMatch[1]);
    const lng = parseFloat(coordMatch[2]);
    return {
      lat,
      lng,
      googleMapsUrl: `https://www.google.com/maps?q=${lat},${lng}`,
    };
  }

  const atMatch = trimmed.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (atMatch) {
    const lat = parseFloat(atMatch[1]);
    const lng = parseFloat(atMatch[2]);
    return {
      lat,
      lng,
      googleMapsUrl: trimmed.startsWith("http")
        ? trimmed.split("?")[0].includes("google")
          ? trimmed
          : `https://www.google.com/maps?q=${lat},${lng}`
        : `https://www.google.com/maps?q=${lat},${lng}`,
    };
  }

  const qMatch = trimmed.match(/[?&](?:q|query)=(-?\d+\.?\d*)[,+%20](-?\d+\.?\d*)/);
  if (qMatch) {
    const lat = parseFloat(qMatch[1]);
    const lng = parseFloat(qMatch[2]);
    return {
      lat,
      lng,
      googleMapsUrl: trimmed.startsWith("http")
        ? trimmed
        : `https://www.google.com/maps?q=${lat},${lng}`,
    };
  }

  if (trimmed.startsWith("http")) {
    return {
      lat: null,
      lng: null,
      googleMapsUrl: trimmed,
    };
  }

  return {
    lat: null,
    lng: null,
    googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(trimmed)}`,
  };
};
