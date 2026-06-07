const nodemailer = require("nodemailer");
const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS } = require("../config");

const emailService = async (from, email, subject, text, html) => {
	try {
		if (!EMAIL_USER || !EMAIL_PASS) {
			console.error("CRITICAL ERROR: EMAIL_USER or EMAIL_PASS environment variables are missing! Email cannot be sent.");
			return { success: false, error: "Missing email credentials" };
		}
		
		const transporter = nodemailer.createTransport({
			host: EMAIL_HOST,
			port: parseInt(EMAIL_PORT, 10),
			secure: parseInt(EMAIL_PORT, 10) === 465,
			auth: {
				user: EMAIL_USER,
				pass: EMAIL_PASS,
			},
		});

		await transporter.sendMail({
			from: from,
			to: email,
			subject: subject,
			text: text,
			html: html,
		});
		console.log("Email sent successfully to:", email);
		return { success: true };
	} catch (error) {
		console.log("Email not sent!");
		console.log(error);
		return { success: false, error };
	}
};

module.exports = emailService;
