const express = require("express");
const {
	createBusiness,
	getAllBusinesses,
	getBusinessById,
	getBusinessesByType,
	deleteBusiness,
	vendorLogin
} = require("../controllers/businessController");

const router = express.Router();

// Business registration routes
router.get("/", getAllBusinesses);
router.get("/type/:type", getBusinessesByType);
router.get("/:id", getBusinessById);
router.post("/", createBusiness);
router.delete("/:id", deleteBusiness);

// Vendor login route
router.post("/login", vendorLogin);

module.exports = router;
