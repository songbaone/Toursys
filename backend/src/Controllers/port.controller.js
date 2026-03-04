const ApiError = require("../api-error");
const portService = require("../Services/ports.service");
const portController = {
  async createPort(req, res, next) {
    try {
      const portData = req.body;
      const result = await portService.createPort(portData);
      if (result.status) {
        res.status(201).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error("Error creating port:", error);
      next(new ApiError(500, "Error creating port: " + error.message));
    }
  },

  async getListPorts(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const keyword = req.query.keyword || "";
      const result = await portService.getListPorts(page, keyword);
      res.json(result);
    } catch (error) {
      console.error("Error fetching ports:", error);
      next(new ApiError(500, "Error fetching ports: " + error.message));
    }
  },

  async updatePort(req, res, next) {
    try {
      const portId = req.params.id;
      const portData = req.body;
      const result = await portService.updatePort(portId, portData);
      if (result.status) {
        res.json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error("Error updating port:", error);
      next(new ApiError(500, "Error updating port: " + error.message));
    }
  },

  async deletePort(req, res, next) {
    try {
      const portId = req.params.id;
      const result = await portService.deletePort(portId);
      if (result.status) {
        res.json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error("Error deleting port:", error);
      next(new ApiError(500, "Error deleting port: " + error.message));
    }
  },

  // get port by ID
  async getPortById(req, res, next) {
    try {
      const portId = req.params.id;
      const result = await portService.getPortById(portId);
      if (result.status) {
        res.json(result);
      } else {
        res.status(404).json(result);
      }
    } catch (error) {
      console.error("Error fetching port by ID:", error);
      next(new ApiError(500, "Error fetching port by ID: " + error.message));
    }
  },
};

module.exports = portController;
