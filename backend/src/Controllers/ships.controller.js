const ApiError = require("../api-error");
const shipService = require("../Services/ships.service");

const shipController = {
  async createShip(req, res, next) {
    try {
      const shipData = req.body;
      const result = await shipService.createShip(shipData);
      if (result.status) {
        res.status(201).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error("Error creating ship:", error);
      next(new ApiError(500, "Error creating ship: " + error.message));
    }
  },

  async getListShips(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const keyword = req.query.keyword || "";
      const result = await shipService.getAllShips(page, keyword);
      res.json(result);
    } catch (error) {
      console.error("Error fetching ships:", error);
      next(new ApiError(500, "Error fetching ships: " + error.message));
    }
  },

  async updateShip(req, res, next) {
    try {
      const shipId = req.params.id;
      const shipData = req.body;
      const result = await shipService.updateShip(shipId, shipData);
      if (result.status) {
        res.json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error("Error updating ship:", error);
      next(new ApiError(500, "Error updating ship: " + error.message));
    }
  },
  async getShipById(req, res, next) {
    try {
      const shipId = req.params.id;
      const result = await shipService.getShipById(shipId);
      if (result.status) {
        res.json(result);
      } else {
        res.status(404).json(result);
      }
    } catch (error) {
      console.error("Error fetching ship:", error);
      next(new ApiError(500, "Error fetching ship: " + error.message));
    }
  },

  async deleteShip(req, res, next) {
    try {
      const shipId = req.params.id;
      const result = await shipService.deleteShip(shipId);
      if (result.status) {
        res.json(result);
      } else {
        res.status(404).json(result);
      }
    } catch (error) {
      console.error("Error deleting ship:", error);
      next(new ApiError(500, "Error deleting ship: " + error.message));
    }
  },
};

module.exports = shipController;
