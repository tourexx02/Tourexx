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
		"http://localhost:5174",
		"http://localhost:5175",
		"http://localhost:5173",
		"https://tourexx.up.railway.app",
		"https://admin-tourexx.up.railway.app",
		"https://vendor-tourexx.up.railway.app"

	],
	methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
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

// Connect to database and start server
const startServer = async () => {
	try {
		await dbConnect();
		app.listen(PORT, () => {
			console.log(`Server is running on http://localhost:${PORT}`);
		});
	} catch (error) {
		console.error("Failed to connect to database:", error);
		process.exit(1);
	}
};

startServer();