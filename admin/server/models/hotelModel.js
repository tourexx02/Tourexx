const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema(
	{
		name: { type: String, required: true, unique: true },
		email: { type: String, required: true, unique: true },
		phone: { type: Number, required: true },
		address: { type: String, required: true },
		city: { type: String, required: true },
		description: { type: String, required: false },
		roomPricing: {
			single: { type: Number, default: 0 },
			double: { type: Number, default: 0 },
			suite: { type: Number, default: 0 },
			family: { type: Number, default: 0 }
		},
		payment: { type: String, required: true },
		amenities: [{ type: String, required: false }],
		images: [{ type: String, required: false }],
		approved: { type: Boolean, default: false },
		vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Business", required: false },
		// Keep old fields for backward compatibility during migration
		budget: { type: Number, required: false },
		roomType: { type: String, required: false },
	},
	{ timestamps: true }
);

const Hotel = mongoose.model("Hotel", hotelSchema);
module.exports = Hotel;
