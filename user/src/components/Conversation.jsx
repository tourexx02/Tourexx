import React, { useState, useRef, useEffect } from "react";
import {
  MapPin,
  Plus,
  Mic,
  Send,
  Share2,
  User,
  Building2,
  UtensilsCrossed,
  Waves,
  Navigation,
  Cloud,
  Sun,
  CloudRain,
} from "lucide-react";
import { chatAPI } from "../services/api";
import ShareChatModal from "./ShareChatModal";
import { formatChatMessagesForShare } from "../utils/formatChatForShare";

export default function TravelApp() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [showChatView, setShowChatView] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const messagesEndRef = useRef(null);

  const shareableMessages = messages.filter(
    (msg) => msg.sender === "user" || msg.sender === "ai"
  );
  const shareText = formatChatMessagesForShare(messages);

  const handleShareChat = () => {
    if (shareableMessages.length === 0) return;
    setShowShareModal(true);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Geocoding function to get coordinates from location name
  const geocodeLocation = async (locationName) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          locationName
        )}&limit=1`,
        {
          headers: {
            "User-Agent": "TourexApp/1.0",
          },
        }
      );
      const data = await response.json();
      if (data && data.length > 0) {
        return {
          name: data[0].display_name.split(",")[0],
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
          fullName: data[0].display_name,
        };
      }
      return null;
    } catch (error) {
      console.error("Geocoding error:", error);
      return null;
    }
  };

  // Extract location from user input
  const extractLocation = (text) => {
    // Common patterns for location queries
    const patterns = [
      /(?:visit|go to|travel to|trip to|tour of|explore|plan.*trip.*to)\s+([A-Z][a-zA-Z\s]+?)(?:\s|$|,|\.|in Pakistan)/i,
      /(?:about|tell me about)\s+([A-Z][a-zA-Z\s]+?)(?:\s|$|,|\.|in Pakistan)/i,
      /^([A-Z][a-zA-Z\s]+?)(?:\s+travel|\s+tourism|\s+tour|\s+trip)?$/i,
      /in\s+([A-Z][a-zA-Z\s]+?),?\s+Pakistan/i,
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        const location = match[1].trim();
        // Filter out common non-location words
        const stopWords = ['what', 'how', 'when', 'where', 'can', 'should', 'would', 'could', 'the', 'best', 'good', 'nice', 'beautiful'];
        if (!stopWords.includes(location.toLowerCase()) && location.length > 2) {
          return location;
        }
      }
    }
    
    // If no pattern matches, check if it's a simple location name (capitalized word(s))
    const words = text.trim().split(/\s+/);
    if (words.length <= 3 && /^[A-Z]/.test(text)) {
      return text.trim();
    }
    
    return null;
  };

  const handleSendMessage = async () => {
    if (inputValue.trim() === "") return;

    const userInput = inputValue.trim();
    
    // Display only what user typed (original prompt)
    const userMessage = {
      id: Date.now(),
      text: userInput, // User sees only what they typed
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setInputValue("");
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true); // Start loading

    // Extract location from user input
    const extractedLocation = extractLocation(userInput);
    console.log("Extracted location:", extractedLocation);
    
    // Try to geocode the extracted location or the full input
    const locationToGeocode = extractedLocation || userInput;
    const locationData = await geocodeLocation(locationToGeocode);
    if (locationData) {
      setCurrentLocation(locationData);
      setShowChatView(true);
    } else {
      setShowChatView(true);
    }

    // Send message to GPT with enhanced prompt
    try {
      // Enhance the prompt with location context if available
      let enhancedPrompt = userInput;
      if (extractedLocation && locationData) {
        enhancedPrompt = `${userInput}\n\n[Context: User is asking about ${locationData.fullName || extractedLocation}. Please provide a detailed itinerary and travel guide.]`;
      }
      
      const response = await chatAPI.sendMessage(enhancedPrompt);
      
      // Display AI response
      const aiMessage = {
        id: Date.now() + 1,
        text: response.message || response.reply || "I'm here to help you plan your travel!",
        sender: "ai",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error getting AI response:", error);
      // Show error message
      const errorMessage = {
        id: Date.now() + 1,
        text: "Sorry, I couldn't process your request. Please try again.",
        sender: "system",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleButtonClick = (e) => {
    e.preventDefault();
    handleSendMessage();
  };

  // Format AI messages to support markdown-like formatting
  const formatMessage = (text) => {
    if (!text) return text;
    
    const lines = text.split('\n');
    const formatted = [];
    let inList = false;
    
    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      
      // Skip empty lines but add spacing
      if (trimmedLine === '') {
        formatted.push(<div key={`space-${index}`} className="h-2"></div>);
        inList = false;
        return;
      }
      
      let element;
      
      // H4 Headings (#### text) - Remove all # symbols
      if (trimmedLine.startsWith('#### ')) {
        const headingText = trimmedLine.replace(/^####\s+/, '');
        element = (
          <h4 key={index} className="text-base font-bold text-gray-900 mt-3 mb-2">
            {headingText}
          </h4>
        );
        inList = false;
      }
      // H3 Headings (### text) - Remove all # symbols
      else if (trimmedLine.startsWith('### ')) {
        const headingText = trimmedLine.replace(/^###\s+/, '');
        element = (
          <h3 key={index} className="text-lg font-bold text-gray-900 mt-4 mb-2">
            {headingText}
          </h3>
        );
        inList = false;
      }
      // H2 Headings (## text) - Remove all # symbols
      else if (trimmedLine.startsWith('## ')) {
        const headingText = trimmedLine.replace(/^##\s+/, '');
        element = (
          <h2 key={index} className="text-xl font-bold text-gray-900 mt-4 mb-2">
            {headingText}
          </h2>
        );
        inList = false;
      }
      // H1 Headings (# text) - Remove all # symbols
      else if (trimmedLine.startsWith('# ') && !trimmedLine.startsWith('## ')) {
        const headingText = trimmedLine.replace(/^#\s+/, '');
        element = (
          <h1 key={index} className="text-2xl font-bold text-gray-900 mt-4 mb-3">
            {headingText}
          </h1>
        );
        inList = false;
      }
      // Bold text headings ending with :
      else if (trimmedLine.endsWith(':') && trimmedLine.length < 60 && !trimmedLine.startsWith('-')) {
        element = (
          <div key={index} className="font-semibold text-gray-900 mt-3 mb-1">
            {trimmedLine}
          </div>
        );
        inList = false;
      }
      // Bullet points (- or • or *)
      else if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('• ') || trimmedLine.startsWith('* ')) {
        let content = trimmedLine.replace(/^[-•*]\s+/, '');
        // Process bold text (**text**)
        content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        element = (
          <div key={index} className="flex items-start mb-1 ml-2">
            <span className="text-blue-600 mr-2 mt-1">•</span>
            <span dangerouslySetInnerHTML={{ __html: content }} />
          </div>
        );
        inList = true;
      }
      // Numbered lists (1. 2. 3.)
      else if (/^\d+\.\s/.test(trimmedLine)) {
        let content = trimmedLine;
        // Process bold text
        content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        element = (
          <div key={index} className="mb-1 ml-2" dangerouslySetInnerHTML={{ __html: content }} />
        );
        inList = true;
      }
      // Regular text
      else {
        let content = trimmedLine;
        // Process bold text
        content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        element = (
          <div 
            key={index} 
            className={inList ? "ml-6 mb-1" : "mb-1"} 
            dangerouslySetInnerHTML={{ __html: content }} 
          />
        );
      }
      
      formatted.push(element);
    });
    
    return <div className="space-y-0.5">{formatted}</div>;
  };

  // const MapView = ({ location }) => (
  //   <div className="w-full h-full bg-gradient-to-br from-green-100 to-blue-100 rounded-lg relative overflow-hidden">
  //     <div className="absolute top-4 right-4 bg-slate-700 text-white rounded-md px-3 py-1 text-sm z-10">
  //       {location.name}
  //     </div>

  //     {/* Mock map content */}
  //     <div className="w-full h-full flex items-center justify-center">
  //       <div className="text-center">
  //         <div className="mb-6">
  //           <div className="w-32 h-32 bg-green-200 rounded-full mx-auto mb-4 flex items-center justify-center">
  //             <MapPin className="w-16 h-16 text-green-600" />
  //           </div>
  //           <h3 className="text-2xl font-bold text-gray-800 mb-2">
  //             {location.name}
  //           </h3>
  //           <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
  //             <span className="flex items-center">
  //               <Clock className="w-4 h-4 mr-1" /> Open 24/7
  //             </span>
  //           </div>
  //         </div>

  //         {/* Mock location pins */}
  //         <div className="absolute inset-0">
  //           {location.places?.map((place, index) => (
  //             <div
  //               key={index}
  //               className="absolute transform -translate-x-1/2 -translate-y-1/2"
  //               style={{
  //                 left: `${20 + index * 15}%`,
  //                 top: `${30 + index * 10}%`,
  //               }}
  //             >
  //               <div className="bg-white rounded-full p-2 shadow-lg border-2 border-blue-500">
  //                 <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
  //               </div>
  //               <div className="bg-white rounded px-2 py-1 text-xs mt-1 shadow-md whitespace-nowrap">
  //                 {place.name}
  //               </div>
  //             </div>
  //           ))}
  //         </div>

  //         {/* Map controls */}
  //         <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
  //           <button className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50">
  //             <Plus className="w-5 h-5" />
  //           </button>
  //           <button className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50">
  //             <Navigation className="w-5 h-5" />
  //           </button>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );

  const MapView = ({ location }) => {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markerRef = useRef(null);

    useEffect(() => {
      if (!location || !location.lat || !location.lng) return;

      // Initialize map
      if (!mapInstanceRef.current && mapRef.current && window.L) {
        mapInstanceRef.current = window.L.map(mapRef.current).setView(
          [location.lat, location.lng],
          13
        );

        // Add OpenStreetMap tiles
        window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(mapInstanceRef.current);

        // Add marker
        markerRef.current = window.L.marker([location.lat, location.lng])
          .addTo(mapInstanceRef.current)
          .bindPopup(location.name || location.fullName);
      } else if (mapInstanceRef.current && window.L) {
        // Update map center and marker position
        mapInstanceRef.current.setView([location.lat, location.lng], 13);
        if (markerRef.current) {
          markerRef.current.setLatLng([location.lat, location.lng]);
          markerRef.current.setPopupContent(location.name || location.fullName);
        } else {
          markerRef.current = window.L.marker([location.lat, location.lng])
            .addTo(mapInstanceRef.current)
            .bindPopup(location.name || location.fullName);
        }
      }

      // Cleanup function
      return () => {
        if (markerRef.current) {
          markerRef.current.remove();
          markerRef.current = null;
        }
      };
    }, [location]);

    // Cleanup map on unmount
    useEffect(() => {
      return () => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }
      };
    }, []);

    if (!location || !location.lat || !location.lng) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="text-gray-500">Loading map...</div>
        </div>
      );
    }

    return (
      <div className="w-full h-full rounded-lg relative overflow-hidden bg-gray-100">
        {/* Location name overlay */}
        <div className="absolute top-4 right-4 bg-slate-700 text-white rounded-md px-3 py-1 text-sm z-[1000]">
          {location.name || location.fullName}
        </div>
        {/* Leaflet map container */}
        <div ref={mapRef} className="w-full h-full" style={{ zIndex: 1 }} />
      </div>
    );
  };

  // Fetch weather data from API using Open-Meteo (free, no API key needed)
  const getWeatherData = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&temperature_unit=celsius&wind_speed_unit=kmh`
      );
      const data = await response.json();
      if (data && data.current) {
        const weatherCode = data.current.weather_code;
        let condition = "Clear";
        let icon = "sun";

        // Map weather codes to conditions (simplified)
        if (weatherCode >= 1 && weatherCode <= 3) {
          condition = "Partly Cloudy";
          icon = "cloud";
        } else if (weatherCode >= 45 && weatherCode <= 48) {
          condition = "Foggy";
          icon = "cloud";
        } else if (weatherCode >= 51 && weatherCode <= 67) {
          condition = "Rainy";
          icon = "rain";
        } else if (weatherCode >= 71 && weatherCode <= 77) {
          condition = "Snowy";
          icon = "cloud";
        } else if (weatherCode >= 80 && weatherCode <= 82) {
          condition = "Rain Showers";
          icon = "rain";
        } else if (weatherCode >= 85 && weatherCode <= 86) {
          condition = "Snow Showers";
          icon = "cloud";
        } else if (weatherCode >= 95 && weatherCode <= 99) {
          condition = "Thunderstorm";
          icon = "rain";
        }

        return {
          temperature: `${Math.round(data.current.temperature_2m)}°C`,
          condition: condition,
          humidity: `${data.current.relative_humidity_2m}%`,
          windSpeed: `${Math.round(data.current.wind_speed_10m)} km/h`,
          icon: icon,
        };
      }
      return null;
    } catch (error) {
      console.error("Weather API error:", error);
      return null;
    }
  };

  const WeatherView = ({ location }) => {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
      const fetchWeather = async () => {
        if (!location || !location.lat || !location.lng) {
          setLoading(false);
          setError(true);
          return;
        }
        setLoading(true);
        setError(false);
        const data = await getWeatherData(location.lat, location.lng);
        if (data) {
          setWeather({ ...data, location: location.name || location.fullName });
          setError(false);
        } else {
          setError(true);
        }
        setLoading(false);
      };
      if (location) {
        fetchWeather();
      }
    }, [location]);

    if (loading) {
      return (
        <div className="p-6 flex items-center justify-center h-full">
          <div className="text-gray-500">Loading weather...</div>
        </div>
      );
    }

    if (error || !weather) {
      return (
        <div className="p-6 bg-white border-t border-gray-200">
          <div className="text-center text-gray-500">
            <p>Unable to load weather data</p>
          </div>
        </div>
      );
    }

    const getWeatherIcon = () => {
      if (weather.icon === "sun") return <Sun className="w-8 h-8 text-yellow-500" />;
      if (weather.icon === "cloud") return <Cloud className="w-8 h-8 text-gray-500" />;
      if (weather.icon === "rain") return <CloudRain className="w-8 h-8 text-blue-500" />;
      return <Cloud className="w-8 h-8 text-gray-500" />;
    };

    return (
      <div className="p-6 bg-white border-t border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Weather</h3>
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">{weather.location}</span>
          </div>
        </div>
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex-shrink-0">{getWeatherIcon()}</div>
          <div>
            <div className="text-3xl font-bold text-gray-900">{weather.temperature}</div>
            <div className="text-sm text-gray-600">{weather.condition}</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
          <div>
            <div className="text-xs text-gray-500 mb-1">Humidity</div>
            <div className="text-sm font-medium text-gray-900">{weather.humidity}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">Wind Speed</div>
            <div className="text-sm font-medium text-gray-900">{weather.windSpeed}</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Left Sidebar - Keep original styling */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* New Chat Button */}
        <div className="px-4 pt-4 mb-4">
          <button
            onClick={() => {
              setShowChatView(false);
              setMessages([]);
              setCurrentLocation(null);
              setInputValue("");
            }}
            className="w-full bg-gray-800 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-700 transition-colors cursor-pointer"
          >
            New Chat
          </button>
        </div>

        {/* Bottom Profile Section */}
        <div className="mt-auto p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
              <User size={16} className="text-white" />
            </div>
            <div>
              <div className="font-medium text-gray-900">Traveler</div>
              <div className="text-xs text-gray-500">
                Germany • Culture • Help
              </div>
              <div className="text-xs text-gray-500">Music • Busines</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex">
        {!showChatView ? (
          <>
            {/* Original Center Content - Keep all original styling */}
            <div className="flex-1 flex flex-col items-center justify-center p-8">
              <div className="max-w-2xl w-full">
                {/* Header */}
                <div className="text-center mb-12">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    Today's journey
                  </h1>
                  <p className="text-gray-600">
                    Pick a destination, and we'll plan the rest, not sure where
                    to go? We've got ideas.
                  </p>
                </div>

                {/* Category Cards */}
                <div className="grid grid-cols-2 gap-4 mb-12">
                  <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-gray-300 cursor-pointer">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <MapPin size={16} className="text-orange-600" />
                    </div>
                    <span className="font-medium text-gray-900">Traveling</span>
                    <Plus size={16} className="text-gray-400 ml-auto" />
                  </div>

                  <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-gray-300 cursor-pointer">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Building2 size={16} className="text-blue-600" />
                    </div>
                    <span className="font-medium text-gray-900">Hotel</span>
                    <Plus size={16} className="text-gray-400 ml-auto" />
                  </div>

                  <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-gray-300 cursor-pointer">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <UtensilsCrossed size={16} className="text-red-600" />
                    </div>
                    <span className="font-medium text-gray-900">
                      Street Food
                    </span>
                    <Plus size={16} className="text-gray-400 ml-auto" />
                  </div>

                  <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-gray-300 cursor-pointer">
                    <div className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center">
                      <Waves size={16} className="text-cyan-600" />
                    </div>
                    <span className="font-medium text-gray-900">Beach</span>
                    <Plus size={16} className="text-gray-400 ml-auto" />
                  </div>
                </div>

                {/* Suggested Question */}
                <div className="flex justify-center mb-8">
                  <button className="bg-gray-800 text-white px-6 py-2 rounded-full hover:bg-gray-700 transition-colors">
                    WHat can I ask Tourex?
                  </button>
                </div>

                {/* Input Area - Enhanced with chat functionality */}
                <div className="relative">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <input
                      type="text"
                      placeholder="Ask Anything..."
                      value={inputValue}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                      className="w-full outline-none text-gray-900 placeholder-gray-500"
                    />
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                      <div className="text-xs text-gray-400">
                        Free with signup • 20 messages per day
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 hover:bg-gray-50 rounded-lg">
                          <Mic size={16} className="text-gray-400" />
                        </button>
                        <button
                          onClick={handleButtonClick}
                          className="p-2 hover:bg-gray-50 rounded-lg"
                        >
                          <Send size={16} className="text-gray-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Original Right Sidebar - Keep all original styling */}
            {messages.some((message) => message.sender === "ai") && (
              <div className="w-80 bg-white border-l border-gray-200 p-6">
              {/* For You Section */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">For You in ⊙</h3>
                  <button className="text-sm text-gray-600 hover:text-gray-800">
                    Explore
                  </button>
                </div>
                <div className="space-y-3">
                  <div className="relative h-24 rounded-lg overflow-hidden bg-gray-200">
                    <div className="absolute bottom-2 left-2">
                      <div className="text-white text-sm font-medium">
                        Rainier Dawn Park
                      </div>
                      <div className="text-white text-xs opacity-80">
                        44 min
                      </div>
                    </div>
                  </div>
                  <div className="relative h-24 rounded-lg overflow-hidden bg-gray-300">
                    <div className="absolute bottom-2 left-2">
                      <div className="text-white text-sm font-medium">
                        Rhond Point
                      </div>
                      <div className="text-white text-xs opacity-80">
                        44 min
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Plan Your Trip Section */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">
                    Plan Your Trip
                  </h3>
                  <button className="text-sm text-gray-600 hover:text-gray-800">
                    See All
                  </button>
                </div>
                <div className="space-y-3">
                  <div className="relative h-32 rounded-lg overflow-hidden bg-gray-200">
                    <div className="absolute bottom-2 left-2">
                      <div className="text-white text-sm font-medium">
                        Take our Tarot quiz
                      </div>
                    </div>
                  </div>
                  <div className="relative h-32 rounded-lg overflow-hidden bg-gray-300">
                    <div className="absolute bottom-2 left-2">
                      <div className="text-white text-sm font-medium">
                        Create $70
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              </div>
            )}
          </>
        ) : (
          // Chat View - Matching Figma Design Exactly
          <>
            {/* Chat Panel - Left Side */}
            <div className="flex-1 flex flex-col bg-gray-50">
              {/* Chat Header with Share */}
              <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-white">
                <h2 className="text-sm font-medium text-gray-700">
                  {currentLocation?.name
                    ? `Trip to ${currentLocation.name}`
                    : "Travel conversation"}
                </h2>
                <button
                  onClick={handleShareChat}
                  disabled={shareableMessages.length === 0}
                  className="p-2 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                  title="Share chat messages"
                  aria-label="Share chat messages"
                >
                  <Share2 size={18} />
                </button>
              </div>

              {/* Chat Messages Area */}
              <div className="flex-1 p-6 overflow-y-auto">
                {/* Messages Container */}
                <div className="max-w-3xl mx-auto space-y-6">
                  {messages.map((message) => (
                    <div key={message.id}>
                      {message.sender === "user" && (
                        <div className="flex justify-end mb-4">
                          <div className="bg-black text-white rounded-2xl px-4 py-3 max-w-md">
                            <div className="text-sm">{message.text}</div>
                          </div>
                        </div>
                      )}

                      {message.sender === "ai" && message.text && (
                        <div className="flex justify-start mb-4">
                          <div className="bg-white text-gray-900 rounded-2xl px-5 py-4 max-w-2xl border border-gray-200 shadow-sm">
                            <div className="text-sm formatted-message">
                              {formatMessage(message.text)}
                            </div>
                          </div>
                        </div>
                      )}

                      {message.sender === "system" && (
                        <div className="flex justify-center mb-4">
                          <div className="bg-red-50 text-red-700 rounded-2xl px-4 py-3 max-w-md border border-red-200">
                            <div className="text-sm text-center">{message.text}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {/* Loading indicator */}
                  {isLoading && (
                    <div className="flex justify-start mb-4">
                      <div className="bg-white text-gray-900 rounded-2xl px-5 py-4 border border-gray-200 shadow-sm">
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                          </div>
                          <span className="text-sm text-gray-500">Generating itinerary...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Chat Input - Bottom */}
              <div className="border-t border-gray-200 bg-white p-6">
                <div className="max-w-3xl mx-auto">
                  <div className="relative">
                    <div className="border border-gray-200 rounded-lg p-4 bg-white">
                      <input
                        type="text"
                        placeholder="Ask Anything..."
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        className="w-full outline-none text-gray-900 placeholder-gray-500"
                      />
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                        <div className="text-xs text-gray-400">
                          Free with signup • 20 messages per day
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="p-2 hover:bg-gray-50 rounded-lg">
                            <Mic size={16} className="text-gray-400" />
                          </button>
                          <button
                            onClick={handleButtonClick}
                            className="p-2 hover:bg-gray-50 rounded-lg"
                          >
                            <Send size={16} className="text-gray-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel - Map and Weather */}
            {currentLocation && (
              <div className="w-96 bg-white border-l border-gray-200 flex flex-col h-full">
                {/* Top Section - Map */}
                <div className="flex-1 overflow-hidden" style={{ minHeight: "400px" }}>
                  <MapView location={currentLocation} />
                </div>
                {/* Bottom Section - Weather */}
                <div className="flex-shrink-0">
                  <WeatherView location={currentLocation} />
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <ShareChatModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        shareText={shareText}
      />
    </div>
  );
}
