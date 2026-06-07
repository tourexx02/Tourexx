const express = require("express");
const upload = require("../config/multer");
const {
	getRestaurants,
	getRestaurantById,
	createRestaurant,
	updateRestaurant,
	deleteRestaurant,
	approveRestaurant,
	rejectRestaurant,
} = require("../controllers/restrauntController");

const router = express.Router();

// Restaurant routes
router.get("/", getRestaurants);
router.get("/:id", getRestaurantById);
router.post("/", upload.multiple, createRestaurant);
router.put("/:id", upload.multiple, updateRestaurant);
router.delete("/:id", deleteRestaurant);
router.patch("/:id/approve", approveRestaurant);
router.patch("/:id/reject", rejectRestaurant);

module.exports = router;
