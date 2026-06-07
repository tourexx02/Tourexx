const express = require("express");

// Import route modules
const hotelRoutes = require("./hotelRoutes");
const restaurantRoutes = require("./restaurantRoutes");
const transportRoutes = require("./transportRoutes");
const tripOrganizerRoutes = require("./tripOrganizerRoutes");
const businessRoutes = require("./businessRoutes");
const bookingRoutes = require("./bookingRoutes");
const adminRoutes = require("./adminRoutes");
const chatRoutes = require("./chatRoutes");

const router = express.Router();

// Use route modules
router.use("/hotels", hotelRoutes);
router.use("/restaurants", restaurantRoutes);
router.use("/transports", transportRoutes);
router.use("/trip-organizers", tripOrganizerRoutes);
router.use("/businesses", businessRoutes);
router.use("/bookings", bookingRoutes);
router.use("/admin", adminRoutes);
router.use("/chat", chatRoutes);

// Health check route
router.get("/health", (req, res) => {
	res.json({ 
		status: "OK", 
		message: "TourEx Admin API is running",
		timestamp: new Date().toISOString()
	});
});

// API documentation route
router.get("/", (req, res) => {
	res.json({
		message: "Welcome to TourEx Admin API",
		version: "1.0.0",
		endpoints: {
			hotels: "/api/hotels",
			restaurants: "/api/restaurants", 
			transports: "/api/transports",
			tripOrganizers: "/api/trip-organizers",
			businesses: "/api/businesses",
			bookings: "/api/bookings",
			admin: "/api/admin",
			chat: "/api/chat",
			health: "/api/health"
		},
		methods: ["GET", "POST", "PUT", "DELETE"],
		imageUpload: "Supported via multipart/form-data with 'image' field"
	});
});

module.exports = router;