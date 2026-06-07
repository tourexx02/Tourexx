const mongoose = require("mongoose");

const restrauntSchema = new mongoose.Schema(
	{
		name: { type: String, required: true, unique: true },
		email: { type: String, required: true, unique: true },
		phone: { type: Number, required: true },
		address: { type: String, required: true },
		googleMapsLocation: { type: String, required: false },
		city: { type: String, required: true },
		description: { type: String, required: false },
		budget: { type: Number, required: true },
		diningType: [{ type: String, required: true }],
		amenities: [{ type: String, required: false }],
		images: [{ type: String, required: false }],
		approved: { type: Boolean, default: false },
		vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Business", required: false },
	},
	{ timestamps: true }
);

const Restraunt = mongoose.model("Restraunt", restrauntSchema);
module.exports = Restraunt;
