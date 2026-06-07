const mongoose = require("mongoose");

const tripOrganizerSchema = new mongoose.Schema(
	{
		name: { type: String, required: true, unique: true },
		email: { type: String, required: true, unique: true },
		phone: { type: Number, required: true },
		address: { type: String, required: true },
		description: { type: String, required: false },
		priceRange: { type: Number, required: true },
		availability: { type: String, required: true },
		gender: { type: String, required: true },
		tourOptions: [
			{
				name: { type: String, required: true },
				price: { type: Number, default: 0 },
			},
		],
		tourTypes: [{ type: String, required: false }],
		tourType: { type: String, required: true },
		amenities: [{ type: String, required: false }],
		images: [{ type: String, required: false }],
		approved: { type: Boolean, default: false },
		vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Business", required: false },
	},
	{ timestamps: true }
);

const TripOrganizer = mongoose.model("TripOrganizer", tripOrganizerSchema);
module.exports = TripOrganizer;
