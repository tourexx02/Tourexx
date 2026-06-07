const Hotel = require("../models/hotelModel");

// Get all hotels
const getHotels = async (req, res) => {
	try {
		const { approved, vendorId } = req.query;
		const query = {};
		
		// Filter by approval status if provided
		if (approved !== undefined) {
			query.approved = approved === 'true';
		}
		
		// Filter by vendorId if provided
		if (vendorId) {
			query.vendorId = vendorId;
		}
		
		const hotels = await Hotel.find(query).populate('vendorId', 'businessName businessType');
		res.json(hotels);
	} catch (error) {
		res
			.status(500)
			.json({ message: "Error fetching hotels", error: error.message });
	}
};

// Get hotel by ID
const getHotelById = async (req, res) => {
	try {
		const hotel = await Hotel.findById(req.params.id);
		if (!hotel) return res.status(404).json({ message: "Hotel not found" });
		res.json(hotel);
	} catch (error) {
		res
			.status(500)
			.json({ message: "Error fetching hotel", error: error.message });
	}
};

// Create a new hotel
const parseAmenities = (value) => {
	if (!value) return [];

	if (Array.isArray(value)) {
		return value;
	}

	if (typeof value === "string") {
		try {
			const parsed = JSON.parse(value);
			if (Array.isArray(parsed)) {
				return parsed;
			}
		} catch (error) {
			return value
				.split(",")
				.map((item) => item.trim())
				.filter(Boolean);
		}

		return value
			.split(",")
			.map((item) => item.trim())
			.filter(Boolean);
	}

	return [];
};

const createHotel = async (req, res) => {
	try {
		const { name, email, phone, address, googleMapsLocation, city, description, payment, vendorId } = req.body;
		const amenities = parseAmenities(req.body.amenities);
		
		// Parse roomPricing from JSON string
		let roomPricing;
		try {
			roomPricing = typeof req.body.roomPricing === 'string' 
				? JSON.parse(req.body.roomPricing) 
				: req.body.roomPricing;
		} catch (error) {
			return res.status(400).json({ message: "Invalid room pricing format" });
		}
		
		// Handle multiple image uploads
		const images = req.files ? req.files.map(file => file.filename) : [];
		
		// Ensure at least one room type has a price > 0
		const hasValidRoomType = roomPricing && Object.values(roomPricing).some(price => price > 0);
		if (!hasValidRoomType) {
			return res.status(400).json({ message: "At least one room type must have a price greater than 0" });
		}
		
		const newHotel = new Hotel({ 
			name, 
			email, 
			phone, 
			address,
			googleMapsLocation: googleMapsLocation || "",
			city, 
			description,
			roomPricing, 
			payment, 
			amenities,
			images,
			vendorId: vendorId || null,
			approved: false // New hotels require admin approval
		});
		
		await newHotel.save();
		res
			.status(201)
			.json({ message: "Hotel created successfully and pending approval", hotel: newHotel });
	} catch (error) {
		// Handle duplicate key errors (phone, email, name)
		if (error.code === 11000) {
			const field = Object.keys(error.keyPattern || {})[0];
			return res.status(400).json({ 
				message: `A hotel with this ${field} already exists. Please use a different ${field}.`,
				error: error.message 
			});
		}
		res
			.status(500)
			.json({ message: "Error creating hotel", error: error.message });
	}
};

// Update hotel
const updateHotel = async (req, res) => {
	try {
		const { name, email, phone, address, googleMapsLocation, city, description, payment } = req.body;
		const amenities = parseAmenities(req.body.amenities);
		
		// Parse roomPricing from JSON string
		let roomPricing;
		try {
			roomPricing = typeof req.body.roomPricing === 'string' 
				? JSON.parse(req.body.roomPricing) 
				: req.body.roomPricing;
		} catch (error) {
			return res.status(400).json({ message: "Invalid room pricing format" });
		}
		
		// Ensure at least one room type has a price > 0
		const hasValidRoomType = roomPricing && Object.values(roomPricing).some(price => price > 0);
		if (!hasValidRoomType) {
			return res.status(400).json({ message: "At least one room type must have a price greater than 0" });
		}
		
		// Prepare update data
		const updateData = { name, email, phone, address, googleMapsLocation, city, description, roomPricing, payment, amenities };
		
		// Handle multiple image uploads if new images are provided
		if (req.files && req.files.length > 0) {
			const newImages = req.files.map(file => file.filename);
			// You can choose to replace all images or append to existing ones
			// For now, we'll replace all images with new ones
			updateData.images = newImages;
		}
		
		const updatedHotel = await Hotel.findByIdAndUpdate(
			req.params.id,
			updateData,
			{ new: true }
		);
		
		if (!updatedHotel)
			return res.status(404).json({ message: "Hotel not found" });
		res.json({ message: "Hotel updated successfully", hotel: updatedHotel });
	} catch (error) {
		res
			.status(500)
			.json({ message: "Error updating hotel", error: error.message });
	}
};

// Delete hotel
const deleteHotel = async (req, res) => {
	try {
		const deletedHotel = await Hotel.findByIdAndDelete(req.params.id);
		if (!deletedHotel)
			return res.status(404).json({ message: "Hotel not found" });
		res.json({ message: "Hotel deleted successfully" });
	} catch (error) {
		res
			.status(500)
			.json({ message: "Error deleting hotel", error: error.message });
	}
};

// Approve hotel
const approveHotel = async (req, res) => {
	try {
		const hotel = await Hotel.findByIdAndUpdate(
			req.params.id,
			{ approved: true },
			{ new: true }
		);
		if (!hotel) return res.status(404).json({ message: "Hotel not found" });
		res.json({ message: "Hotel approved successfully", hotel });
	} catch (error) {
		res
			.status(500)
			.json({ message: "Error approving hotel", error: error.message });
	}
};

// Reject hotel
const rejectHotel = async (req, res) => {
	try {
		const hotel = await Hotel.findByIdAndUpdate(
			req.params.id,
			{ approved: false },
			{ new: true }
		);
		if (!hotel) return res.status(404).json({ message: "Hotel not found" });
		res.json({ message: "Hotel rejected successfully", hotel });
	} catch (error) {
		res
			.status(500)
			.json({ message: "Error rejecting hotel", error: error.message });
	}
};

module.exports = {
	getHotels,
	getHotelById,
	createHotel,
	updateHotel,
	deleteHotel,
	approveHotel,
	rejectHotel,
};