const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
	{
		firstName: { type: String, required: true },
		lastName: { type: String, required: true },
		email: { type: String, required: true },
		phone: { type: Number, required: true },
		from: { type: Date, required: true },
		to: { type: Date, required: true },
		type: { type: String, required: true },
		price: { type: Number, required: true },
		facility: { type: String, required: true },
		vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Business", required: false },
		serviceId: { type: mongoose.Schema.Types.ObjectId, required: false },
	},
	{ timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;
