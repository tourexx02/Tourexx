const Transport = require("../models/transportModel");

// Utility to parse comma separated or JSON arrays into string arrays
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

const normalizeVehicleOption = (option) => {
	if (!option) return null;

	if (typeof option === "string") {
		const name = option.trim();
		if (!name) return null;
		return { name, price: 0 };
	}

	if (typeof option === "object") {
		const name = option.name || option.type || option.vehicle || option.option;
		if (!name) return null;

		const parsedPrice = Number(
			option.price !== undefined
				? option.price
				: option.priceValue !== undefined
				? option.priceValue
				: 0
		);

		return {
			name,
			price: Number.isFinite(parsedPrice) ? parsedPrice : 0,
			isCustom: option.isCustom === true,
		};
	}

	return null;
};

const parseVehicleOptions = (value) => {
	if (!value) return [];

	let raw = value;

	if (typeof value === "string") {
		try {
			const parsed = JSON.parse(value);
			raw = parsed;
		} catch (error) {
			const names = parseStringArray(value);
			return names.map((name) => ({ name, price: 0 }));
		}
	}

	if (!Array.isArray(raw)) {
		return [];
	}

	return raw.map(normalizeVehicleOption).filter(Boolean);
};

const getTransports = async (req, res) => {
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
		
		const transports = await Transport.find(query).populate('vendorId', 'businessName businessType');
		res.json(transports);
	} catch (error) {
		res
			.status(500)
			.json({ message: "Error fetching transports", error: error.message });
	}
};

// Get transport by ID
const getTransportById = async (req, res) => {
	try {
		const transport = await Transport.findById(req.params.id);
		if (!transport) return res.status(404).json({ message: "Transport not found" });
		res.json(transport);
	} catch (error) {
		res
			.status(500)
			.json({ message: "Error fetching transport", error: error.message });
	}
};

// Create a new transport
const createTransport = async (req, res) => {
	try {
		const {
			name,
			email,
			phone,
			address,
			location,
			description,
			budget,
			vehicleType,
			vehicleTypes,
			vehicleOptions,
			capacity,
			rentalDuration,
			driver,
		} = req.body;

		const amenities = parseStringArray(req.body.amenities);
		const parsedVehicleOptions = parseVehicleOptions(vehicleOptions);
		let vehicleNames = parsedVehicleOptions.map((option) => option.name);

		if (!vehicleNames.length) {
			vehicleNames = parseStringArray(
				vehicleTypes !== undefined ? vehicleTypes : vehicleType
			);
		}

		if (!vehicleNames.length) {
			return res
				.status(400)
				.json({ message: "Please provide at least one vehicle option" });
		}

		const normalizedVehicleOptions = parsedVehicleOptions.length
			? parsedVehicleOptions
			: vehicleNames.map((name) => ({ name, price: 0 }));

		const images = req.files ? req.files.map((file) => file.filename) : [];

		const parsedBudget =
			budget !== undefined && budget !== null ? Number(budget) : undefined;
		const numericBudget = Number.isFinite(parsedBudget) ? parsedBudget : undefined;
		const driverValue = driver === "true" || driver === true;

		const newTransportData = {
			name,
			email,
			phone,
			address,
			location,
			description,
			vehicleOptions: normalizedVehicleOptions,
			vehicleTypes: vehicleNames,
			vehicleType: vehicleNames[0] || undefined,
			capacity,
			rentalDuration,
			driver: driverValue,
			amenities,
			images,
		};

		if (numericBudget !== undefined) {
			newTransportData.budget = numericBudget;
		}

		newTransportData.vendorId = req.body.vendorId || null;
		newTransportData.approved = false; // New transports require admin approval

		const newTransport = new Transport(newTransportData);

		await newTransport.save();
		res
			.status(201)
			.json({ message: "Transport created successfully and pending approval", transport: newTransport });
	} catch (error) {
		// Handle duplicate key errors (phone, email, name)
		if (error.code === 11000) {
			const field = Object.keys(error.keyPattern || {})[0];
			return res.status(400).json({ 
				message: `A transport with this ${field} already exists. Please use a different ${field}.`,
				error: error.message 
			});
		}
		res
			.status(500)
			.json({ message: "Error creating transport", error: error.message });
	}
};

// Update transport
const updateTransport = async (req, res) => {
	try {
		const {
			name,
			email,
			phone,
			address,
			location,
			description,
			budget,
			vehicleType,
			vehicleTypes,
			vehicleOptions,
			capacity,
			rentalDuration,
			driver,
		} = req.body;

		const amenities = parseStringArray(req.body.amenities);
		const parsedVehicleOptions = parseVehicleOptions(vehicleOptions);
		let vehicleNames = parsedVehicleOptions.map((option) => option.name);

		if (!vehicleNames.length) {
			vehicleNames = parseStringArray(
				vehicleTypes !== undefined ? vehicleTypes : vehicleType
			);
		}

		if (!vehicleNames.length) {
			return res
				.status(400)
				.json({ message: "Please provide at least one vehicle option" });
		}

		const normalizedVehicleOptions = parsedVehicleOptions.length
			? parsedVehicleOptions
			: vehicleNames.map((name) => ({ name, price: 0 }));

		const parsedBudget =
			budget !== undefined && budget !== null ? Number(budget) : undefined;
		const numericBudget = Number.isFinite(parsedBudget) ? parsedBudget : undefined;
		const driverValue = driver === "true" || driver === true;

		const updateData = {
			name,
			email,
			phone,
			address,
			location,
			description,
			vehicleOptions: normalizedVehicleOptions,
			vehicleTypes: vehicleNames,
			vehicleType: vehicleNames[0] || undefined,
			capacity,
			rentalDuration,
			amenities,
		};

		if (numericBudget !== undefined) {
			updateData.budget = numericBudget;
		}

		if (driver !== undefined) {
			updateData.driver = driverValue;
		}

		Object.keys(updateData).forEach((key) => {
			if (updateData[key] === undefined) {
				delete updateData[key];
			}
		});

		if (req.files && req.files.length > 0) {
			updateData.images = req.files.map((file) => file.filename);
		}

		const updatedTransport = await Transport.findByIdAndUpdate(
			req.params.id,
			updateData,
			{ new: true }
		);

		if (!updatedTransport)
			return res.status(404).json({ message: "Transport not found" });
		res.json({ message: "Transport updated successfully", transport: updatedTransport });
	} catch (error) {
		res
			.status(500)
			.json({ message: "Error updating transport", error: error.message });
	}
};

// Delete transport
const deleteTransport = async (req, res) => {
	try {
		const deletedTransport = await Transport.findByIdAndDelete(req.params.id);
		if (!deletedTransport)
			return res.status(404).json({ message: "Transport not found" });
		res.json({ message: "Transport deleted successfully" });
	} catch (error) {
		res
			.status(500)
			.json({ message: "Error deleting transport", error: error.message });
	}
};

// Approve transport
const approveTransport = async (req, res) => {
	try {
		const transport = await Transport.findByIdAndUpdate(
			req.params.id,
			{ approved: true },
			{ new: true }
		);
		if (!transport) return res.status(404).json({ message: "Transport not found" });
		res.json({ message: "Transport approved successfully", transport });
	} catch (error) {
		res
			.status(500)
			.json({ message: "Error approving transport", error: error.message });
	}
};

// Reject transport
const rejectTransport = async (req, res) => {
	try {
		const transport = await Transport.findByIdAndUpdate(
			req.params.id,
			{ approved: false },
			{ new: true }
		);
		if (!transport) return res.status(404).json({ message: "Transport not found" });
		res.json({ message: "Transport rejected successfully", transport });
	} catch (error) {
		res
			.status(500)
			.json({ message: "Error rejecting transport", error: error.message });
	}
};

module.exports = {
	getTransports,
	getTransportById,
	createTransport,
	updateTransport,
	deleteTransport,
	approveTransport,
	rejectTransport,
};