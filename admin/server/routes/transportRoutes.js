const express = require("express");
const upload = require("../config/multer");
const {
	getTransports,
	getTransportById,
	createTransport,
	updateTransport,
	deleteTransport,
	approveTransport,
	rejectTransport,
} = require("../controllers/transportController");

const router = express.Router();

// Transport routes
router.get("/", getTransports);
router.get("/:id", getTransportById);
router.post("/", upload.multiple, createTransport);
router.put("/:id", upload.multiple, updateTransport);
router.delete("/:id", deleteTransport);
router.patch("/:id/approve", approveTransport);
router.patch("/:id/reject", rejectTransport);

module.exports = router;
