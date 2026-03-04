const { knex } = require("../../db.config");
require("dotenv").config();

const shipService = {
  // create ship
  async createShip(shipData) {
    try {
      const existingShip = await knex("SHIPS")
        .where({ ship_code: shipData.ship_code })
        .first();
      if (existingShip) {
        throw new Error("Ship code already exists");
      }
      const [newShip] = await knex("SHIPS").insert(shipData).returning("*");
      return {
        status: true,
        message: "Ship created successfully",
        ship: newShip,
      };
    } catch (error) {
      console.error("Error creating ship:", error);
      return {
        status: false,
        message: "Failed to create ship",
        error: error.message,
      };
    }
  },

  // get all ship + search
  async getAllShips(page, keyword = "") {
    try {
      console.log("PAGE RECEIVED:", page);
      console.log("KEYWORD:", keyword);
      const itemsPerPage = 10;
      const offset = (page - 1) * itemsPerPage;
      console.log("OFFSET:", offset);
      // Base query (search)
      const baseQuery = knex("SHIPS as s")
        .leftJoin("PORTS as p", "s.current_port_id", "p.port_id")
        .modify((queryBuilder) => {
          if (keyword && keyword.trim() !== "") {
            queryBuilder.where(function () {
              this.where("ship_name", "like", `%${keyword}%`)
                .orWhere("ship_code", "like", `%${keyword}%`)
                .orWhere("nationality", "like", `%${keyword}%`)
                .orWhere("p.port_name", "like", `%${keyword}%`)
                .orWhere("agency", "like", `%${keyword}%`);
            });
          }
        });
      // Count total (after search)
      const totalShips = await baseQuery
        .clone()
        .count("* as totalCount")
        .first();
      const totalItems = totalShips.totalCount;
      const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

      if (page > totalPages) {
        return {
          status: false,
          message: "Page number exceeds total pages",
          ships: [],
          totalItems,
          totalPages,
        };
      }

      // Fetch ships for the current page
      const ships = await baseQuery
        .clone()
        .select(
          "s.ship_id",
          "s.ship_code",
          "s.ship_name",
          "s.nationality",
          "s.length",
          "s.draft",
          "s.gross_tonnage",
          "s.agency",
          "s.status",
          "s.created_at",
          "p.port_name as current_port_name", // 👈 đổi tên field trả về
        )
        .orderBy("s.ship_code", "asc")
        .limit(itemsPerPage)
        .offset(offset);

      return {
        status: true,
        message: "Ships retrieved successfully",
        ships: ships,
        totalItems,
        totalPages,
      };
    } catch (error) {
      console.error("Error retrieving ships:", error);
      return {
        status: false,
        message: "Failed to retrieve ships",
        error: error.message,
      };
    }
  },

  // get ship by id
  async getShipById(shipId) {
    try {
      const ship = await knex("SHIPS as s")
        .leftJoin("PORTS as p", "s.current_port_id", "p.port_id")
        .select(
          "s.ship_id",
          "s.ship_code",
          "s.ship_name",
          "s.nationality",
          "s.length",
          "s.draft",
          "s.gross_tonnage",
          "s.agency",
          "s.status",
          "s.created_at",
          "p.port_name as current_port_name", // 👈 đổi tên field trả về
        )
        .where({ ship_id: shipId })
        .first();
      if (!ship) {
        return {
          status: false,
          message: "Ship not found",
        };
      }
      return {
        status: true,
        message: "Ship retrieved successfully",
        ship: ship,
      };
    } catch (error) {
      console.error("Error retrieving ship:", error);
      return {
        status: false,
        message: "Failed to retrieve ship",
        error: error.message,
      };
    }
  },

  // update ship
  async updateShip(shipId, shipData) {
    try {
      const existingShip = await knex("SHIPS")
        .where({ ship_id: shipId })
        .first();
      if (!existingShip) {
        return {
          status: false,
          message: "Ship not found",
        };
      }
      await knex("SHIPS").where({ ship_id: shipId }).update(shipData);
      const updatedShip = await knex("SHIPS")
        .where({ ship_id: shipId })
        .first();
      return {
        status: true,
        message: "Ship updated successfully",
        ship: updatedShip,
      };
    } catch (error) {
      console.error("Error updating ship:", error);
      return {
        status: false,
        message: "Failed to update ship",
        error: error.message,
      };
    }
  },

  // delete ship
  async deleteShip(shipId) {
    try {
      const existingShip = await knex("SHIPS")
        .where({ ship_id: shipId })
        .first();
      if (!existingShip) {
        return {
          status: false,
          message: "Ship not found",
        };
      }
      await knex("SHIPS").where({ ship_id: shipId }).del();
      return {
        status: true,
        message: "Ship deleted successfully",
      };
    } catch (error) {
      console.error("Error deleting ship:", error);
      return {
        status: false,
        message: "Failed to delete ship",
        error: error.message,
      };
    }
  },
};

module.exports = shipService;
