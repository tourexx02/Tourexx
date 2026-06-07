const mongoose = require("mongoose");

const transportSchema = new mongoose.Schema(
	{
		name: { type: String, required: true, unique: true },
		email: { type: String, required: true, unique: true },
		phone: { type: Number, required: true },
		address: { type: String, required: true },
		location: { type: String, required: true },
		description: { type: String, required: false },
		budget: { type: Number, required: false },
		vehicleOptions: [
			{
				name: { type: String, required: true },
				price: { type: Number, default: 0 },
				isCustom: { type: Boolean, default: false },
			},
		],
		vehicleTypes: [{ type: String, required: false }],
		vehicleType: { type: String, required: false },
		capacity: { type: String, required: true },
		rentalDuration: { type: String, required: true },
		driver: { type: Boolean, required: true },
		amenities: [{ type: String, required: false }],
		images: [{ type: String, required: false }],
		approved: { type: Boolean, default: false },
		vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Business", required: false },
	},
	{ timestamps: true }
);

const Transport = mongoose.model("Transport", transportSchema);
module.exports = Transport;
