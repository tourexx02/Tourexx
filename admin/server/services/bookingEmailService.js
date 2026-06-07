const emailService = require("./emailService");

const formatBookingDate = (date) => {
	return new Date(date).toLocaleString("en-US", {
		dateStyle: "medium",
		timeStyle: "short",
	});
};

const buildBookingConfirmationContent = (booking) => {
	const { firstName, lastName, phone, from, to, type, price, facility } =
		booking;

	const fromFormatted = formatBookingDate(from);
	const toFormatted = formatBookingDate(to);
	const subject = "Booking Confirmation - Tourex";

	const text = `Dear ${firstName} ${lastName},

Your booking has been confirmed!

Booking Details:
Type: ${type}
Facility: ${facility}
From: ${fromFormatted}
To: ${toFormatted}
Price: $${price}
Contact Phone: ${phone}

Thank you for choosing Tourex!

Best regards,
Tourex Team`;

	const html = `
		<!DOCTYPE html>
		<html>
		<head>
			<style>
				body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
				.container { max-width: 600px; margin: 0 auto; padding: 20px; }
				.header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
				.content { background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
				.booking-details { background-color: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
				.detail-row { margin: 10px 0; }
				.label { font-weight: bold; color: #555; }
				.footer { text-align: center; margin-top: 20px; color: #777; font-size: 12px; }
			</style>
		</head>
		<body>
			<div class="container">
				<div class="header">
					<h1>Booking Confirmation</h1>
				</div>
				<div class="content">
					<p>Dear <strong>${firstName} ${lastName}</strong>,</p>
					<p>Your booking has been confirmed successfully!</p>
					<div class="booking-details">
						<h3>Booking Details:</h3>
						<div class="detail-row"><span class="label">Type:</span> ${type}</div>
						<div class="detail-row"><span class="label">Facility:</span> ${facility}</div>
						<div class="detail-row"><span class="label">From:</span> ${fromFormatted}</div>
						<div class="detail-row"><span class="label">To:</span> ${toFormatted}</div>
						<div class="detail-row"><span class="label">Price:</span> <strong>$${price}</strong></div>
						<div class="detail-row"><span class="label">Contact Phone:</span> ${phone}</div>
					</div>
					<p>Thank you for choosing Tourex! We look forward to serving you.</p>
					<p>If you have any questions, please don't hesitate to contact us.</p>
				</div>
				<div class="footer">
					<p>This is an automated email. Please do not reply.</p>
					<p>&copy; ${new Date().getFullYear()} Tourex. All rights reserved.</p>
				</div>
			</div>
		</body>
		</html>
	`;

	return { subject, text, html };
};

const sendBookingConfirmationEmail = async (booking) => {
	const { subject, text, html } = buildBookingConfirmationContent(booking);
	return emailService(booking.email, subject, text, html);
};

module.exports = { sendBookingConfirmationEmail };
