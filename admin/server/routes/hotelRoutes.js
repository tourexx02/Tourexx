const express = require("express");
const upload = require("../config/multer");
const {
	getHotels,
	getHotelById,
	createHotel,
	updateHotel,
	deleteHotel,
	approveHotel,
	rejectHotel,
} = require("../controllers/hotelController");

const router = express.Router();

// Hotel routes
router.get("/", getHotels);
router.get("/:id", getHotelById);
router.post("/", upload.multiple, createHotel);
router.put("/:id", upload.multiple, updateHotel);
router.delete("/:id", deleteHotel);
router.patch("/:id/approve", approveHotel);
router.patch("/:id/reject", rejectHotel);

module.exports = router;
