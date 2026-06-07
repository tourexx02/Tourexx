const nodemailer = require("nodemailer");
const {
	EMAIL_HOST,
	EMAIL_PORT,
	EMAIL_USER,
	EMAIL_PASS,
	EMAIL_FROM,
} = require("../config");

const createTransporter = () => {
	const port = parseInt(EMAIL_PORT, 10) || 587;

	return nodemailer.createTransport({
		host: EMAIL_HOST,
		port,
		secure: port === 465,
		auth: {
			user: EMAIL_USER,
			pass: EMAIL_PASS,
		},
		...(port === 587 && { requireTLS: true }),
	});
};

const emailService = async (to, subject, text, html) => {
	if (!EMAIL_USER || !EMAIL_PASS) {
		throw new Error(
			"Email credentials are not configured (EMAIL_USER / EMAIL_PASS)"
		);
	}

	if (!to) {
		throw new Error("Recipient email address is required");
	}

	const from = `Tourex <${EMAIL_FROM || EMAIL_USER}>`;
	const transporter = createTransporter();

	const info = await transporter.sendMail({
		from,
		to,
		subject,
		text,
		html,
	});

	console.log("Email sent successfully to:", to, "| messageId:", info.messageId);
	return { success: true, messageId: info.messageId };
};

module.exports = emailService;
