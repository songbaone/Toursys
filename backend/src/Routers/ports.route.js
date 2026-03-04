const express = require("express");
const portController = require("../Controllers/port.controller");
const router = express.Router();

//==========CREATE PORT============
router.post("/", portController.createPort);

//==========GET LIST PORTS============
router.get("/", portController.getListPorts);

//==========UPDATE PORT============
router.put("/:id", portController.updatePort);

//==========DELETE PORT============
router.delete("/:id", portController.deletePort);

//==========GET PORT BY ID============
router.get("/:id", portController.getPortById);

module.exports = router;
