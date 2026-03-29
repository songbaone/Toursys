const express = require("express");
const router = express.Router();

const scheduleController = require("../Controllers/schedules.controller");

router.post("/", scheduleController.createSchedule);
router.get("/", scheduleController.getSchedules);
router.get("/stats/pilot-monthly", scheduleController.getPilotMonthlyStats);
router.get("/export-excel", scheduleController.exportSchedules);
module.exports = router;
