const express = require("express");
const path = require("path");
const cors = require("cors");
const { PORT, CLIENT_BASE_URL, ADMIN_BASE_URL, VENDOR_BASE_URL, localUser } = require("./config");
const dbConnect = require("./db");
const routes = require("./routes");

const app = express();

// CORS configuration
const corsOptions = {
	origin: [
		CLIENT_BASE_URL,
		ADMIN_BASE_URL,
		VENDOR_BASE_URL,
		localUser,
	],
	credentials: true,
	optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API routes
app.use("/api", routes);

// Connect to database and initialize admin
dbConnect();

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});