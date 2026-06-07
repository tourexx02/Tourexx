const nodemailer = require("nodemailer");
const sgMail = require("@sendgrid/mail");
const {
	EMAIL_HOST,
	EMAIL_PORT,
	EMAIL_USER,
	EMAIL_PASS,
	EMAIL_FROM,
	SENDGRID_API_KEY,
} = require("../config");

const SMTP_TIMEOUT_MS = 10000;

const getFromAddress = () => {
	if (EMAIL_FROM) {
		return EMAIL_FROM.includes("<")
			? EMAIL_FROM
			: `Tourex <${EMAIL_FROM}>`;
	}
	if (EMAIL_USER) return `Tourex <${EMAIL_USER}>`;
	throw new Error("EMAIL_FROM is not configured");
};

const sendViaSendGrid = async (to, subject, text, html) => {
	sgMail.setApiKey(SENDGRID_API_KEY);

	const [response] = await sgMail.send({
		to,
		from: getFromAddress(),
		subject,
		text,
		html,
	});

	return {
		success: true,
		messageId: response?.headers?.["x-message-id"],
	};
};

const sendViaSmtp = async (to, subject, text, html) => {
	const port = parseInt(EMAIL_PORT, 10) || 587;

	const transporter = nodemailer.createTransport({
		host: EMAIL_HOST || "smtp.gmail.com",
		port,
		secure: port === 465,
		auth: {
			user: EMAIL_USER,
			pass: EMAIL_PASS,
		},
		connectionTimeout: SMTP_TIMEOUT_MS,
		greetingTimeout: SMTP_TIMEOUT_MS,
		socketTimeout: SMTP_TIMEOUT_MS,
		...(port === 587 && { requireTLS: true }),
	});

	const info = await transporter.sendMail({
		from: getFromAddress(),
		to,
		subject,
		text,
		html,
	});

	return { success: true, messageId: info.messageId };
};

const emailService = async (to, subject, text, html) => {
	if (!to) {
		throw new Error("Recipient email address is required");
	}

	if (SENDGRID_API_KEY) {
		return sendViaSendGrid(to, subject, text, html);
	}

	if (!EMAIL_USER || !EMAIL_PASS) {
		throw new Error(
			"Email not configured. Set SENDGRID_API_KEY (production) or EMAIL_USER/EMAIL_PASS (local SMTP)."
		);
	}

	return sendViaSmtp(to, subject, text, html);
};

// Never blocks the HTTP response — booking must succeed even if email fails.
const sendEmailInBackground = (to, subject, text, html) => {
	emailService(to, subject, text, html)
		.then((result) => {
			console.log(
				"Email sent to:",
				to,
				result.messageId ? `| id: ${result.messageId}` : ""
			);
		})
		.catch((err) => {
			console.error("Failed to send email to", to + ":", err.message);
		});
};

module.exports = { emailService, sendEmailInBackground };
