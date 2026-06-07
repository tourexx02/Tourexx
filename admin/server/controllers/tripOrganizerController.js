const TripOrganizer = require("../models/tripOrganizerModel");

// Get all trip organizers
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

const normalizeTourOption = (option) => {
	if (!option) return null;

	if (typeof option === "string") {
		const name = option.trim();
		if (!name) return null;
		return { name, price: 0 };
	}

	if (typeof option === "object") {
		const name = option.name || option.type || option.option;
		if (!name) return null;

		const rawPrice = option.price ?? option.priceValue ?? 0;
		const price = Number(rawPrice);

		return {
			name,
			price: Number.isFinite(price) ? price : 0,
		};
	}

	return null;
};

const parseTourOptions = (value) => {
	if (!value) return [];

	let raw = value;

	if (typeof value === "string") {
		try {
			const parsed = JSON.parse(value);
			raw = parsed;
		} catch (error) {
			return parseStringArray(value).map((name) => ({ name, price: 0 }));
		}
	}

	if (!Array.isArray(raw)) {
		return [];
	}

	return raw
		.map((option) => normalizeTourOption(option))
		.filter(Boolean);
};

const getTripOrganizers = async (req, res) => {
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
		
		const tripOrganizers = await TripOrganizer.find(query).populate('vendorId', 'businessName businessType');
		res.json(tripOrganizers);
	} catch (error) {
		res
			.status(500)
			.json({ message: "Error fetching trip organizers", error: error.message });
	}
};

// Get trip organizer by ID
const getTripOrganizerById = async (req, res) => {
	try {
		const tripOrganizer = await TripOrganizer.findById(req.params.id);
		if (!tripOrganizer) return res.status(404).json({ message: "Trip organizer not found" });
		res.json(tripOrganizer);
	} catch (error) {
		res
			.status(500)
			.json({ message: "Error fetching trip organizer", error: error.message });
	}
};

// Create a new trip organizer
const createTripOrganizer = async (req, res) => {
	try {
		const {
			name,
			email,
			phone,
			address,
			description,
			priceRange,
			availability,
			gender,
			tourType,
			tourTypes,
		} = req.body;

		const amenities = parseStringArray(req.body.amenities);
		const parsedTourOptions = parseTourOptions(req.body.tourOptions);

		let tourNames = parsedTourOptions.map((option) => option.name);

		if (!tourNames.length) {
			const parsedTourTypes = parseStringArray(tourTypes);
			if (parsedTourTypes.length) {
				tourNames = parsedTourTypes;
			} else if (tourType) {
				const fallback = parseStringArray(tourType);
				tourNames = fallback.length ? fallback : [tourType];
			}
		}

		if (!tourNames.length) {
			return res
				.status(400)
				.json({ message: "Please provide at least one tour type" });
		}

		const normalizedTourOptions = parsedTourOptions.length
			? parsedTourOptions.map((option) => ({
				name: option.name,
				price: Number.isFinite(Number(option.price)) ? Number(option.price) : 0,
			}))
			: tourNames.map((name) => ({ name, price: 0 }));

		const images = req.files ? req.files.map((file) => file.filename) : [];
		const numericPhone = Number(phone);
		const numericPriceRange = Number(priceRange);

		const newTripOrganizer = new TripOrganizer({
			name,
			email,
			phone: Number.isFinite(numericPhone) ? numericPhone : 0,
			address,
			description,
			priceRange: Number.isFinite(numericPriceRange) ? numericPriceRange : 0,
			availability,
			gender,
			tourOptions: normalizedTourOptions,
			tourTypes: tourNames,
			tourType: tourNames[0],
			amenities,
			images,
			vendorId: req.body.vendorId || null,
			approved: false // New trip organizers require admin approval
		});

		await newTripOrganizer.save();
		res
			.status(201)
			.json({ message: "Trip organizer created successfully and pending approval", tripOrganizer: newTripOrganizer });
	} catch (error) {
		// Handle duplicate key errors (phone, email, name)
		if (error.code === 11000) {
			const field = Object.keys(error.keyPattern || {})[0];
			return res.status(400).json({ 
				message: `A trip organizer with this ${field} already exists. Please use a different ${field}.`,
				error: error.message 
			});
		}
		res
			.status(500)
			.json({ message: "Error creating trip organizer", error: error.message });
	}
};

// Update trip organizer
const updateTripOrganizer = async (req, res) => {
	try {
		const {
			name,
			email,
			phone,
			address,
			description,
			priceRange,
			availability,
			gender,
			tourType,
			tourTypes,
		} = req.body;

		const amenities = parseStringArray(req.body.amenities);
		const parsedTourOptions = parseTourOptions(req.body.tourOptions);

		let tourNames = parsedTourOptions.map((option) => option.name);

		if (!tourNames.length) {
			const parsedTourTypes = parseStringArray(tourTypes);
			if (parsedTourTypes.length) {
				tourNames = parsedTourTypes;
			} else if (tourType) {
				const fallback = parseStringArray(tourType);
				tourNames = fallback.length ? fallback : [tourType];
			}
		}

		if (!tourNames.length) {
			return res
				.status(400)
				.json({ message: "Please provide at least one tour type" });
		}

		const normalizedTourOptions = parsedTourOptions.length
			? parsedTourOptions.map((option) => ({
				name: option.name,
				price: Number.isFinite(Number(option.price)) ? Number(option.price) : 0,
			}))
			: tourNames.map((name) => ({ name, price: 0 }));

		const numericPhone = Number(phone);
		const numericPriceRange = Number(priceRange);

		const updateData = {
			name,
			email,
			phone: Number.isFinite(numericPhone) ? numericPhone : undefined,
			address,
			description,
			priceRange: Number.isFinite(numericPriceRange) ? numericPriceRange : undefined,
			availability,
			gender,
			tourOptions: normalizedTourOptions,
			tourTypes: tourNames,
			tourType: tourNames[0],
			amenities,
		};

		// Handle multiple image uploads if new images are provided
		if (req.files && req.files.length > 0) {
			updateData.images = req.files.map((file) => file.filename);
		}

		Object.keys(updateData).forEach((key) => {
			if (updateData[key] === undefined) {
				delete updateData[key];
			}
		});

		const updatedTripOrganizer = await TripOrganizer.findByIdAndUpdate(
			req.params.id,
			updateData,
			{ new: true }
		);

		if (!updatedTripOrganizer)
			return res.status(404).json({ message: "Trip organizer not found" });
		res.json({ message: "Trip organizer updated successfully", tripOrganizer: updatedTripOrganizer });
	} catch (error) {
		res
			.status(500)
			.json({ message: "Error updating trip organizer", error: error.message });
	}
};

// Delete trip organizer
const deleteTripOrganizer = async (req, res) => {
	try {
		const deletedTripOrganizer = await TripOrganizer.findByIdAndDelete(req.params.id);
		if (!deletedTripOrganizer)
			return res.status(404).json({ message: "Trip organizer not found" });
		res.json({ message: "Trip organizer deleted successfully" });
	} catch (error) {
		res
			.status(500)
			.json({ message: "Error deleting trip organizer", error: error.message });
	}
};

// Approve trip organizer
const approveTripOrganizer = async (req, res) => {
	try {
		const tripOrganizer = await TripOrganizer.findByIdAndUpdate(
			req.params.id,
			{ approved: true },
			{ new: true }
		);
		if (!tripOrganizer) return res.status(404).json({ message: "Trip organizer not found" });
		res.json({ message: "Trip organizer approved successfully", tripOrganizer });
	} catch (error) {
		res
			.status(500)
			.json({ message: "Error approving trip organizer", error: error.message });
	}
};

// Reject trip organizer
const rejectTripOrganizer = async (req, res) => {
	try {
		const tripOrganizer = await TripOrganizer.findByIdAndUpdate(
			req.params.id,
			{ approved: false },
			{ new: true }
		);
		if (!tripOrganizer) return res.status(404).json({ message: "Trip organizer not found" });
		res.json({ message: "Trip organizer rejected successfully", tripOrganizer });
	} catch (error) {
		res
			.status(500)
			.json({ message: "Error rejecting trip organizer", error: error.message });
	}
};

module.exports = {
	getTripOrganizers,
	getTripOrganizerById,
	createTripOrganizer,
	updateTripOrganizer,
	deleteTripOrganizer,
	approveTripOrganizer,
	rejectTripOrganizer,
};