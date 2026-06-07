const Booking = require("../models/bookingModel");
const Hotel = require("../models/hotelModel");
const Restaurant = require("../models/restrauntModel");
const Transport = require("../models/transportModel");
const TripOrganizer = require("../models/tripOrganizerModel");
const emailService = require("../services/emailService");

// Get all bookings
const getBookings = async (req, res) => {
	try {
		const { vendorId } = req.query;
		const query = {};
		
		// Filter by vendorId if provided
		if (vendorId) {
			query.vendorId = vendorId;
		}
		
		const bookings = await Booking.find(query).populate('vendorId', 'businessName businessType');
		res.json(bookings);
	} catch (error) {
		res
			.status(500)
			.json({ message: "Error fetching bookings", error: error.message });
	}
};

// Get booking by ID
const getBookingById = async (req, res) => {
	try {
		const booking = await Booking.findById(req.params.id);
		if (!booking) return res.status(404).json({ message: "Booking not found" });
		res.json(booking);
	} catch (error) {
		res
			.status(500)
			.json({ message: "Error fetching booking", error: error.message });
	}
};

// Create a new booking
const createBooking = async (req, res) => {
	try {
		const { firstName, lastName, email, phone, from, to, type, price, facility } = req.body;
		
		console.log('Creating booking:', { facility, type, from, to });
		
		// Validate availability before creating booking
		if (type === "hotel" || type === "Hotel") {
			// Check if hotel is already booked for this date range
			const fromDate = new Date(from);
			const toDate = new Date(to);
			fromDate.setHours(0, 0, 0, 0);
			toDate.setHours(23, 59, 59, 999);
			
			const existingBookings = await Booking.find({
				facility: facility,
				type: { $in: ["hotel", "Hotel"] },
				$or: [
					// New booking starts during existing booking
					{ from: { $lte: fromDate }, to: { $gte: fromDate } },
					// New booking ends during existing booking
					{ from: { $lte: toDate }, to: { $gte: toDate } },
					// New booking completely contains existing booking
					{ from: { $gte: fromDate }, to: { $lte: toDate } },
					// Existing booking completely contains new booking
					{ from: { $lte: fromDate }, to: { $gte: toDate } }
				]
			});
			
			console.log('Found existing hotel bookings:', existingBookings.length);
			
			if (existingBookings.length > 0) {
				return res.status(400).json({ 
					message: "Hotel is not available for the selected dates. Please choose different dates.",
					conflict: true
				});
			}
		} else if (type === "restaurant" || type === "Restaurant") {
			// Check if restaurant time slot is already booked
			const fromDate = new Date(from);
			
			// Find bookings on the same day and time (within the same hour)
			const startOfHour = new Date(fromDate);
			startOfHour.setMinutes(0, 0, 0);
			const endOfHour = new Date(fromDate);
			endOfHour.setMinutes(59, 59, 999);
			
			const existingBookings = await Booking.find({
				facility: facility,
				type: { $in: ["restaurant", "Restaurant"] },
				from: {
					$gte: startOfHour,
					$lte: endOfHour
				}
			});
			
			console.log('Found existing restaurant bookings:', existingBookings.length);
			
			if (existingBookings.length > 0) {
				return res.status(400).json({ 
					message: "This time slot is not available. Please choose a different time.",
					conflict: true
				});
			}
		}
		
		// Look up the service to get vendorId
		let vendorId = null;
		let serviceId = null;
		
		try {
			const normalizedType = type.toLowerCase();
			if (normalizedType === "hotel") {
				const hotel = await Hotel.findOne({ name: facility });
				if (hotel) {
					vendorId = hotel.vendorId;
					serviceId = hotel._id;
				}
			} else if (normalizedType === "restaurant") {
				const restaurant = await Restaurant.findOne({ name: facility });
				if (restaurant) {
					vendorId = restaurant.vendorId;
					serviceId = restaurant._id;
				}
			} else if (normalizedType === "transport") {
				const transport = await Transport.findOne({ name: facility });
				if (transport) {
					vendorId = transport.vendorId;
					serviceId = transport._id;
				}
			} else if (normalizedType === "trip organizer" || normalizedType === "triporganizer") {
				const tripOrganizer = await TripOrganizer.findOne({ name: facility });
				if (tripOrganizer) {
					vendorId = tripOrganizer.vendorId;
					serviceId = tripOrganizer._id;
				}
			}
		} catch (error) {
			console.error('Error looking up service for booking:', error);
			// Continue without vendorId if lookup fails
		}
		
		const newBooking = new Booking({ 
			firstName, 
			lastName, 
			email, 
			phone, 
			from, 
			to, 
			type, 
			price, 
			facility,
			vendorId: vendorId || null,
			serviceId: serviceId || null
		});
		
		await newBooking.save();
		
		// Send booking confirmation email
		const fromDate = new Date(from).toLocaleDateString();
		const toDate = new Date(to).toLocaleDateString();
		
		const emailSubject = "Booking Confirmation - Tourex";
		const emailText = `Dear ${firstName} ${lastName},\n\nYour booking has been confirmed!\n\nBooking Details:\nType: ${type}\nFacility: ${facility}\nFrom: ${fromDate}\nTo: ${toDate}\nPrice: $${price}\n\nThank you for choosing Tourex!\n\nBest regards,\nTourex Team`;
		
		const emailHtml = `
			<!DOCTYPE html>
			<html>
			<head>
				<style>
					body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
					.container { max-width: 600px; margin: 0 auto; padding: 20px; }
					.header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
					.content { background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
					.booking-details { background-color: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
					.detail-row { margin: 10px 0; }
					.label { font-weight: bold; color: #555; }
					.footer { text-align: center; margin-top: 20px; color: #777; font-size: 12px; }
				</style>
			</head>
			<body>
				<div class="container">
					<div class="header">
						<h1>Booking Confirmation</h1>
					</div>
					<div class="content">
						<p>Dear <strong>${firstName} ${lastName}</strong>,</p>
						<p>Your booking has been confirmed successfully!</p>
						
						<div class="booking-details">
							<h3>Booking Details:</h3>
							<div class="detail-row">
								<span class="label">Type:</span> ${type}
							</div>
							<div class="detail-row">
								<span class="label">Facility:</span> ${facility}
							</div>
							<div class="detail-row">
								<span class="label">From:</span> ${fromDate}
							</div>
							<div class="detail-row">
								<span class="label">To:</span> ${toDate}
							</div>
							<div class="detail-row">
								<span class="label">Price:</span> <strong>$${price}</strong>
							</div>
							<div class="detail-row">
								<span class="label">Contact Phone:</span> ${phone}
							</div>
						</div>
						
						<p>Thank you for choosing Tourex! We look forward to serving you.</p>
						<p>If you have any questions, please don't hesitate to contact us.</p>
					</div>
					<div class="footer">
						<p>This is an automated email. Please do not reply.</p>
						<p>&copy; 2025 Tourex. All rights reserved.</p>
					</div>
				</div>
			</body>
			</html>
		`;
		
		// Send email asynchronously (don't wait for it)
		emailService("Tourex <noreply@tourex.com>", email, emailSubject, emailText, emailHtml)
			.then(() => console.log("Booking confirmation email sent"))
			.catch((err) => console.error("Failed to send booking email:", err));
		
		res
			.status(201)
			.json({ message: "Booking created successfully", booking: newBooking });
	} catch (error) {
		res
			.status(500)
			.json({ message: "Error creating booking", error: error.message });
	}
};

// Get booked dates for a specific hotel
const getHotelBookedDates = async (req, res) => {
	try {
		const { hotelName } = req.params;
		
		// Find all hotel bookings for this facility
		const bookings = await Booking.find({
			facility: hotelName,
			type: "hotel"
		});
		
		// Return date ranges
		const bookedDates = bookings.map(booking => ({
			from: booking.from,
			to: booking.to
		}));
		
		res.json(bookedDates);
	} catch (error) {
		res
			.status(500)
			.json({ message: "Error fetching booked dates", error: error.message });
	}
};

// Get available time slots for a specific restaurant on a specific date
const getRestaurantAvailableTimeSlots = async (req, res) => {
	try {
		const { restaurantName } = req.params;
		const { date } = req.query; // Format: YYYY-MM-DD
		
		if (!date) {
			return res.status(400).json({ message: "Date parameter is required" });
		}
		
		// Parse the date
		const requestedDate = new Date(date);
		const startOfDay = new Date(requestedDate.setHours(0, 0, 0, 0));
		const endOfDay = new Date(requestedDate.setHours(23, 59, 59, 999));
		
		// Find all restaurant bookings for this facility on this date
		const bookings = await Booking.find({
			facility: restaurantName,
			type: "restaurant",
			from: {
				$gte: startOfDay,
				$lte: endOfDay
			}
		});
		
		// Define available time slots (11:00 AM to 10:00 PM, every hour)
		const timeSlots = [];
		for (let hour = 11; hour <= 22; hour++) {
			const time24 = `${hour.toString().padStart(2, '0')}:00`;
			const hourNum = hour > 12 ? hour - 12 : hour;
			const period = hour >= 12 ? 'PM' : 'AM';
			const time12 = `${hourNum}:00 ${period}`;
			
			timeSlots.push({
				time24,
				time12,
				available: true
			});
		}
		
		// Mark booked time slots as unavailable
		bookings.forEach(booking => {
			const bookedTime = new Date(booking.from);
			const bookedHour = bookedTime.getHours();
			const bookedMinute = bookedTime.getMinutes();
			const bookedTimeStr = `${bookedHour.toString().padStart(2, '0')}:${bookedMinute.toString().padStart(2, '0')}`;
			
			// Find and mark the slot as unavailable
			const slot = timeSlots.find(s => s.time24 === bookedTimeStr);
			if (slot) {
				slot.available = false;
			}
		});
		
		res.json(timeSlots);
	} catch (error) {
		res
			.status(500)
			.json({ message: "Error fetching time slots", error: error.message });
	}
};

module.exports = {
	getBookings,
	getBookingById,
	createBooking,
	getHotelBookedDates,
	getRestaurantAvailableTimeSlots,
};
