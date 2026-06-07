const express = require("express");
const upload = require("../config/multer");
const {
	getTripOrganizers,
	getTripOrganizerById,
	createTripOrganizer,
	updateTripOrganizer,
	deleteTripOrganizer,
	approveTripOrganizer,
	rejectTripOrganizer,
} = require("../controllers/tripOrganizerController");

const router = express.Router();

// Trip Organizer routes
router.get("/", getTripOrganizers);
router.get("/:id", getTripOrganizerById);
router.post("/", upload.multiple, createTripOrganizer);
router.put("/:id", upload.multiple, updateTripOrganizer);
router.delete("/:id", deleteTripOrganizer);
router.patch("/:id/approve", approveTripOrganizer);
router.patch("/:id/reject", rejectTripOrganizer);

module.exports = router;
