const express = require("express");
const {
	getBookings,
	getBookingById,
	createBooking,
	getHotelBookedDates,
	getRestaurantAvailableTimeSlots,
} = require("../controllers/bookingController");

const router = express.Router();

// Booking routes
router.get("/", getBookings);
router.get("/hotel/:hotelName/booked-dates", getHotelBookedDates);
router.get("/restaurant/:restaurantName/time-slots", getRestaurantAvailableTimeSlots);
router.get("/:id", getBookingById);
router.post("/", createBooking);

module.exports = router;
