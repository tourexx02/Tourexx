const mongoose = require("mongoose");
const { MONGO_DB_URI } = require("../config");

const dbConnect = async () => {
	if (!MONGO_DB_URI) {
		throw new Error("MONGO_DB_URI environment variable is not defined");
	}
	try {
		await mongoose.connect(MONGO_DB_URI);
		console.log("✓ Database connected successfully");
	} catch (error) {
		console.error("✗ Database connection failed:", error.message);
		throw error;
	}
};

module.exports = dbConnect;
