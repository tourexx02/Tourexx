const Restaurant = require("../models/restrauntModel");

// Get all restaurants
const parseStringArray = (value) => {
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

const getRestaurants = async (req, res) => {
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
		
		const restaurants = await Restaurant.find(query).populate('vendorId', 'businessName businessType');
		res.json(restaurants);
	} catch (error) {
		res
			.status(500)
			.json({ message: "Error fetching restaurants", error: error.message });
	}
};

// Get restaurant by ID
const getRestaurantById = async (req, res) => {
	try {
		const restaurant = await Restaurant.findById(req.params.id);
		if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });
		res.json(restaurant);
	} catch (error) {
		res
			.status(500)
			.json({ message: "Error fetching restaurant", error: error.message });
	}
};

// Create a new restaurant
const createRestaurant = async (req, res) => {
	try {
		const { name, email, phone, address, googleMapsLocation, city, description, budget, diningType, vendorId } = req.body;
	const amenities = parseStringArray(req.body.amenities);
	const diningTypeArray = parseStringArray(diningType);
		
		// Handle multiple image uploads
		const images = req.files ? req.files.map(file => file.filename) : [];
		
		const newRestaurant = new Restaurant({
			name,
			email,
			phone,
			address,
			googleMapsLocation: googleMapsLocation || "",
			city,
			description,
			budget, 
			diningType: diningTypeArray,
			amenities, 
			images,
			vendorId: vendorId || null,
			approved: false // New restaurants require admin approval
		});
		
		await newRestaurant.save();
		res
			.status(201)
			.json({ message: "Restaurant created successfully and pending approval", restaurant: newRestaurant });
	} catch (error) {
		// Handle duplicate key errors (phone, email, name)
		if (error.code === 11000) {
			const field = Object.keys(error.keyPattern || {})[0];
			return res.status(400).json({ 
				message: `A restaurant with this ${field} already exists. Please use a different ${field}.`,
				error: error.message 
			});
		}
		res
			.status(500)
			.json({ message: "Error creating restaurant", error: error.message });
	}
};

// Update restaurant
const updateRestaurant = async (req, res) => {
	try {
		const { name, email, phone, address, googleMapsLocation, city, description, budget, diningType } = req.body;
	const amenities = parseStringArray(req.body.amenities);
	const diningTypeArray = parseStringArray(diningType);
		
		// Prepare update data
	const updateData = { name, email, phone, address, googleMapsLocation, city, description, budget, diningType: diningTypeArray, amenities };
		
		// Handle multiple image uploads if new images are provided
		if (req.files && req.files.length > 0) {
			const newImages = req.files.map(file => file.filename);
			// Replace all images with new ones
			updateData.images = newImages;
		}
		
		const updatedRestaurant = await Restaurant.findByIdAndUpdate(
			req.params.id,
			updateData,
			{ new: true }
		);
		
		if (!updatedRestaurant)
			return res.status(404).json({ message: "Restaurant not found" });
		res.json({ message: "Restaurant updated successfully", restaurant: updatedRestaurant });
	} catch (error) {
		res
			.status(500)
			.json({ message: "Error updating restaurant", error: error.message });
	}
};

// Delete restaurant
const deleteRestaurant = async (req, res) => {
	try {
		const deletedRestaurant = await Restaurant.findByIdAndDelete(req.params.id);
		if (!deletedRestaurant)
			return res.status(404).json({ message: "Restaurant not found" });
		res.json({ message: "Restaurant deleted successfully" });
	} catch (error) {
		res
			.status(500)
			.json({ message: "Error deleting restaurant", error: error.message });
	}
};

// Approve restaurant
const approveRestaurant = async (req, res) => {
	try {
		const restaurant = await Restaurant.findByIdAndUpdate(
			req.params.id,
			{ approved: true },
			{ new: true }
		);
		if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });
		res.json({ message: "Restaurant approved successfully", restaurant });
	} catch (error) {
		res
			.status(500)
			.json({ message: "Error approving restaurant", error: error.message });
	}
};

// Reject restaurant
const rejectRestaurant = async (req, res) => {
	try {
		const restaurant = await Restaurant.findByIdAndUpdate(
			req.params.id,
			{ approved: false },
			{ new: true }
		);
		if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });
		res.json({ message: "Restaurant rejected successfully", restaurant });
	} catch (error) {
		res
			.status(500)
			.json({ message: "Error rejecting restaurant", error: error.message });
	}
};

module.exports = {
	getRestaurants,
	getRestaurantById,
	createRestaurant,
	updateRestaurant,
	deleteRestaurant,
	approveRestaurant,
	rejectRestaurant,
};