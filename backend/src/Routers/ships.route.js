const express = require("express");
const shipController = require("../Controllers/ships.controller");
const router = express.Router();

// Create a new ship
router.post("/", shipController.createShip);

// Get list of ships with pagination and search
router.get("/", shipController.getListShips);

// Update a ship by ID
router.put("/:id", shipController.updateShip);

// Get a ship by ID
router.get("/:id", shipController.getShipById);

// Delete a ship by ID
router.delete("/:id", shipController.deleteShip);

module.exports = router;
