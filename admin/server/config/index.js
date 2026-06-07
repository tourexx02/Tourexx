require("dotenv").config();

module.exports = {
	PORT: process.env.PORT || 5000,
	MONGO_DB_URI: process.env.MONGO_DB_URI,
	CLIENT_BASE_URL: process.env.CLIENT_BASE_URL,
	ADMIN_BASE_URL: process.env.ADMIN_BASE_URL,
	VENDOR_BASE_URL: process.env.VENDOR_BASE_URL,
	localUser: process.env.LOCAL_USER,
	EMAIL_HOST: process.env.EMAIL_HOST,
	EMAIL_PORT: process.env.EMAIL_PORT,
	EMAIL_USER: process.env.EMAIL_USER,
	EMAIL_PASS: process.env.EMAIL_PASS,
	EMAIL_FROM: process.env.EMAIL_FROM,
	SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
	OPENAI_API_KEY: process.env.OPENAI_API_KEY,
};
