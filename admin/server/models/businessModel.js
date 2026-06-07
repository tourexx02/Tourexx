const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const businessSchema = new mongoose.Schema(
	{
		businessName: { type: String, required: true, unique: true },
		email: { type: String, required: true, unique: true },
		phoneNumber: { type: String, required: true },
		address: { type: String, required: true },
		businessType: { 
			type: String, 
			required: true,
			enum: ["Hotel", "Restaurant", "Transport", "Trip Organizer"]
		},
		password: { type: String, required: true },
	},
	{ timestamps: true }
);

// Hash password before saving
businessSchema.pre("save", async function (next) {
	if (!this.isModified("password")) {
		return next();
	}
	
	try {
		const salt = await bcrypt.genSalt(10);
		this.password = await bcrypt.hash(this.password, salt);
		next();
	} catch (error) {
		next(error);
	}
});

// Method to compare password for login
businessSchema.methods.comparePassword = async function (candidatePassword) {
	return await bcrypt.compare(candidatePassword, this.password);
};

const Business = mongoose.model("Business", businessSchema);
module.exports = Business;
