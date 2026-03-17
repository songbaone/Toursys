const { knex } = require("../../db.config");
require("dotenv").config();

const validateSchedule = async (scheduleData) => {
  const {
    ship_id,
    pilot_id,

    departure_time,
    arrival_time,
  } = scheduleData;

  // base query kiểm tra trùng thời gian
  const timeOverlapQuery = (query) => {
    query
      .where("departure_time", "<", arrival_time)
      .where("arrival_time", ">", departure_time);
  };

  // 1. kiểm tra tàu
  const shipConflict = await knex("SCHEDULES")
    .modify(timeOverlapQuery)
    .where("ship_id", ship_id)
    .first();

  if (shipConflict) {
    return {
      status: false,
      message: "Ship already has another schedule during this time",
    };
  }

  // 2. kiểm tra hoa tiêu
  const pilotConflict = await knex("SCHEDULES")
    .modify(timeOverlapQuery)
    .where("pilot_id", pilot_id)
    .first();

  if (pilotConflict) {
    return {
      status: false,
      message: "Pilot already has another schedule during this time",
    };
  }

  return {
    status: true,
    message: "Schedule is valid",
  };
};

const scheduleService = {
  // tạo lịch trình mới
  async createSchedule(scheduleData) {
    try {
      const validation = await validateSchedule(scheduleData);

      if (!validation.status) {
        return validation;
      }

      const [schedule_id] = await knex("SCHEDULES")
        .insert(scheduleData)
        .returning("schedule_id");

      return {
        status: true,
        message: "Schedule created successfully",
        schedule_id,
      };
    } catch (error) {
      return {
        status: false,
        message: "Failed to create schedule",
        error: error.message,
      };
    }
  },

  // Lấy danh sách lịch trình với thông tin chi tiết với phân trang + tìm kiếm
  async getListSchedules(page, keyword = "") {
    try {
      console.log("PAGE RECEIVED:", page);
      console.log("KEYWORD:", keyword);

      const itemsPerPage = 10;
      const offset = (page - 1) * itemsPerPage;
      console.log("OFFSET:", offset);

      // Base query (search)
      const baseQuery = knex("SCHEDULES as sc")
        .join("SHIPS as sh", "sc.ship_id", "sh.ship_id")
        .join("PORTS as dp", "sc.departure_port_id", "dp.port_id")
        .join("PORTS as ap", "sc.arrival_port_id", "ap.port_id")
        .leftJoin("users as p", "sc.pilot_id", "p.user_id");

      if (keyword) {
        baseQuery.where((builder) =>
          builder
            .where("sh.ship_name", "like", `%${keyword}%`)
            .orWhere("dp.port_name", "like", `%${keyword}%`)
            .orWhere("ap.port_name", "like", `%${keyword}%`)
            .orWhere("p.full_name", "like", `%${keyword}%`),
        );
      }

      const totalSchedules = await baseQuery
        .clone()
        .count("* as total")
        .first();
      const totalItems = totalSchedules.total;
      const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
      if (page > totalPages) {
        return {
          status: false,
          message: `Page ${page} exceeds total number of pages (${totalPages}).`,
          totalPages,
          scheduleData: [],
        };
      }

      // Get schedules with pagination
      const schedules = await baseQuery
        .clone()
        .select(
          "sc.schedule_id",
          "sh.ship_name",
          "dp.port_name as departure_port",
          "ap.port_name as arrival_port",
          "p.full_name as pilot_name",
          "sc.departure_time",
          "sc.arrival_time",
          "sc.status",
        )
        .orderBy("sc.schedule_id", "asc")
        .limit(itemsPerPage)
        .offset(offset);

      return {
        status: true,
        message: "Schedules retrieved successfully",
        schedules,
        totalPages,
        itemsPerPage,
      };
    } catch (error) {
      return {
        status: false,
        message: "Failed to retrieve schedules",
        error: error.message,
      };
    }
  },
};

// SELECT
//     sc.schedule_id,
//     sh.ship_name,
//     dp.port_name AS departure_port,
//     ap.port_name AS arrival_port,
//     p.full_name,
//     sc.departure_time,
//     sc.arrival_time,
//     sc.status
// FROM SCHEDULES sc
// JOIN SHIPS sh ON sc.ship_id = sh.ship_id
// JOIN PORTS dp ON sc.departure_port_id = dp.port_id
// JOIN PORTS ap ON sc.arrival_port_id = ap.port_id
// LEFT JOIN users p ON sc.pilot_id = p.user_id;

module.exports = scheduleService;
