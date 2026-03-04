const { knex } = require("../../db.config");
require("dotenv").config();

const portService = {
  // create port
  async createPort(portData) {
    try {
      const existingPort = await knex("PORTS")
        .where({ port_code: portData.port_code })
        .first();
      if (existingPort) {
        throw new Error("Port code already exists");
      }
      const [newPort] = await knex("PORTS").insert(portData).returning("*");
      return {
        status: true,
        message: "Port created successfully",
        port: newPort,
      };
    } catch (error) {
      console.error("Error creating port:", error);
      return {
        status: false,
        message: "Failed to create port",
        error: error.message,
      };
    }
  },

  // get all user + search
  async getListPorts(page, keyword = "") {
    try {
      console.log("PAGE RECEIVED:", page);
      console.log("KEYWORD:", keyword);

      const itemsPerPage = 10;
      const offset = (page - 1) * itemsPerPage;
      console.log("OFFSET:", offset);

      // Base query (search)
      const baseQuery = knex("PORTS").modify((queryBuilder) => {
        if (keyword && keyword.trim() !== "") {
          queryBuilder.where(function () {
            this.where("port_name", "like", `%${keyword}%`)
              .orWhere("port_code", "like", `%${keyword}%`)
              .orWhere("address", "like", `%${keyword}%`)
              .orWhere("status", "like", `%${keyword}%`);
          });
        }
      });

      // Count total (after search)
      const totalPorts = await baseQuery
        .clone()
        .count("* as totalCount")
        .first();
      const totalItems = totalPorts.totalCount;

      const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

      if (page > totalPages) {
        return {
          status: false,
          message: `Page ${page} exceeds total number of pages (${totalPages}).`,
          totalPages,
          ports: [],
        };
      }

      // Get ports with pagination
      const ports = await baseQuery
        .clone()
        .select("*")
        .orderBy("port_id", "asc")
        .limit(itemsPerPage)
        .offset(offset);

      return {
        status: true,
        message: "Get list ports successfully",
        ports,
        totalPages,
        itemsPerPage,
      };
    } catch (error) {
      console.error("Error retrieving ports:", error);
      throw error;
    }
  },

  //   Cập nhật thông tin port
  async updatePort(portId, portData) {
    try {
      const existingPort = await knex("PORTS")
        .where({ port_id: portId })
        .first();
      if (!existingPort) {
        throw new Error("Port not found");
      }
      const updatedPort = await knex("PORTS")
        .where({ port_id: portId })
        .update(portData);
      const port = await knex("PORTS").where({ port_id: portId }).first();
      return {
        status: true,
        message: "Port updated successfully",
        port: port,
      };
    } catch (error) {
      console.error("Error updating port:", error);
      return {
        status: false,
        message: "Failed to update port",
        error: error.message,
      };
    }
  },

  //   Xóa port
  async deletePort(portId) {
    try {
      const existingPort = await knex("PORTS")
        .where({ port_id: portId })
        .first();
      if (!existingPort) {
        throw new Error("Port not found");
      }
      await knex("PORTS").where({ port_id: portId }).del();
      return {
        status: true,
        message: "Port deleted successfully",
      };
    } catch (error) {
      console.error("Error deleting port:", error);
      return {
        status: false,
        message: "Failed to delete port",
        error: error.message,
      };
    }
  },

  //   Lấy thông tin port theo ID
  async getPortById(portId) {
    try {
      const port = await knex("PORTS").where({ port_id: portId }).first();
      if (!port) {
        throw new Error("Port not found");
      }
      return {
        status: true,
        message: "Get port by ID successfully",
        port,
      };
    } catch (error) {
      console.error("Error retrieving port by ID:", error);
      return {
        status: false,
        message: "Failed to get port by ID",
        error: error.message,
      };
    }
  },
};

module.exports = portService;
