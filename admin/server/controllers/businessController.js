const Business = require("../models/businessModel");
const jwt = require("jsonwebtoken");

// Create a new business registration
const createBusiness = async (req, res) => {
	try {
		const { businessName, email, phoneNumber, address, businessType, password } = req.body;

		// Validate required fields
		if (!businessName || !email || !phoneNumber || !address || !businessType || !password) {
			return res.status(400).json({
				success: false,
				message: "All fields are required"
			});
		}

		// Validate password length
		if (password.length < 6) {
			return res.status(400).json({
				success: false,
				message: "Password must be at least 6 characters long"
			});
		}

		// Validate business type
		const validBusinessTypes = ["Hotel", "Restaurant", "Transport", "Trip Organizer"];
		if (!validBusinessTypes.includes(businessType)) {
			return res.status(400).json({
				success: false,
				message: "Invalid business type. Must be one of: Hotel, Restaurant, Transport, Trip Organizer"
			});
		}

		// Check if email already exists
		const existingEmail = await Business.findOne({ email });
		if (existingEmail) {
			return res.status(400).json({
				success: false,
				message: "A business with this email already exists"
			});
		}

		// Check if business name already exists
		const existingBusinessName = await Business.findOne({ businessName });
		if (existingBusinessName) {
			return res.status(400).json({
				success: false,
				message: "A business with this name already exists. Please choose a different name."
			});
		}

		// Create new business
		const newBusiness = new Business({
			businessName,
			email,
			phoneNumber,
			address,
			businessType,
			password
		});

		const savedBusiness = await newBusiness.save();

		// Remove password from response
		const businessResponse = savedBusiness.toObject();
		delete businessResponse.password;

		res.status(201).json({
			success: true,
			message: "Business registration created successfully",
			data: businessResponse
		});

	} catch (error) {
		console.error("Error creating business:", error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message
		});
	}
};

// Get all business registrations
const getAllBusinesses = async (req, res) => {
	try {
		const businesses = await Business.find().sort({ createdAt: -1 });

		res.status(200).json({
			success: true,
			message: "Businesses retrieved successfully",
			data: businesses,
			count: businesses.length
		});

	} catch (error) {
		console.error("Error fetching businesses:", error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message
		});
	}
};

// Get business registration by ID
const getBusinessById = async (req, res) => {
	try {
		const { id } = req.params;

		const business = await Business.findById(id);

		if (!business) {
			return res.status(404).json({
				success: false,
				message: "Business not found"
			});
		}

		res.status(200).json({
			success: true,
			message: "Business retrieved successfully",
			data: business
		});

	} catch (error) {
		console.error("Error fetching business:", error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message
		});
	}
};

// Get businesses by type
const getBusinessesByType = async (req, res) => {
	try {
		const { type } = req.params;

		// Validate business type
		const validBusinessTypes = ["Hotel", "Restaurant", "Transport", "Trip Organizer"];
		if (!validBusinessTypes.includes(type)) {
			return res.status(400).json({
				success: false,
				message: "Invalid business type. Must be one of: Hotel, Restaurant, Transport, Trip Organizer"
			});
		}

		const businesses = await Business.find({ businessType: type }).sort({ createdAt: -1 });

		res.status(200).json({
			success: true,
			message: `${type} businesses retrieved successfully`,
			data: businesses,
			count: businesses.length
		});

	} catch (error) {
		console.error("Error fetching businesses by type:", error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message
		});
	}
};

// Delete business registration
const deleteBusiness = async (req, res) => {
	try {
		const { id } = req.params;

		// Check if business exists
		const business = await Business.findById(id);
		if (!business) {
			return res.status(404).json({
				success: false,
				message: "Business registration not found"
			});
		}

		// Delete the business
		await Business.findByIdAndDelete(id);

		res.status(200).json({
			success: true,
			message: "Business registration deleted successfully",
			data: { deletedId: id }
		});

	} catch (error) {
		console.error("Error deleting business:", error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message
		});
	}
};

// Vendor Login
const vendorLogin = async (req, res) => {
	try {
		const { email, password } = req.body;

		// Validate required fields
		if (!email || !password) {
			return res.status(400).json({
				success: false,
				message: "Email and password are required"
			});
		}

		// Find business by email
		const business = await Business.findOne({ email });
		if (!business) {
			return res.status(401).json({
				success: false,
				message: "Invalid email or password"
			});
		}

		// Check password
		const isPasswordValid = await business.comparePassword(password);
		if (!isPasswordValid) {
			return res.status(401).json({
				success: false,
				message: "Invalid email or password"
			});
		}

		// Generate JWT token
		const token = jwt.sign(
			{ 
				id: business._id, 
				email: business.email,
				businessName: business.businessName,
				businessType: business.businessType
			},
			process.env.JWT_SECRET || "your-secret-key",
			{ expiresIn: "7d" }
		);

		// Remove password from response
		const businessResponse = business.toObject();
		delete businessResponse.password;

		res.status(200).json({
			success: true,
			message: "Login successful",
			token,
			vendor: businessResponse
		});

	} catch (error) {
		console.error("Error during vendor login:", error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message
		});
	}
};

module.exports = {
	createBusiness,
	getAllBusinesses,
	getBusinessById,
	getBusinessesByType,
	deleteBusiness,
	vendorLogin
};
