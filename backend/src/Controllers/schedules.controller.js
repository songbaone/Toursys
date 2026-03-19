const ApiError = require("../api-error");

const scheduleService = require("../Services/schedules.service");

const scheduleController = {
  async createSchedule(req, res, next) {
    try {
      const scheduleData = req.body;
      const result = await scheduleService.createSchedule(scheduleData);
      if (result.status) {
        res.status(201).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error("Error creating schedule:", error);
      next(new ApiError(500, "Error creating schedule: " + error.message));
    }
  },

  // Danh sách lịch trình + tìm kiếm
  async getSchedules(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const keyword = req.query.keyword || "";
      const result = await scheduleService.getListSchedules(page, keyword);
      res.json(result);
    } catch (error) {
      console.error("Error fetching schedules:", error);
      next(new ApiError(500, "Error fetching schedules: " + error.message));
    }
  },
  async getPilotMonthlyStats(req, res) {
    try {
      const { month, year } = req.query;

      const result = await scheduleService.getPilotMonthlyStats(
        parseInt(month),
        parseInt(year),
      );

      if (!result.status) {
        return res.status(400).json(result);
      }

      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Server error",
        error: error.message,
      });
    }
  },
};
module.exports = scheduleController;
