const express = require("express");
const router = express.Router();

const scheduleController = require("../Controllers/schedules.controller");

router.post("/", scheduleController.createSchedule);
router.get("/", scheduleController.getSchedules);
module.exports = router;
