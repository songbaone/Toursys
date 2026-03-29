const { knex } = require("../../db.config");
const ExcelJS = require("exceljs");

require("dotenv").config();
const validateSchedule = async (scheduleData, excludeId = null) => {
  const { ship_id, pilot_id, departure_time, arrival_time } = scheduleData;

  const timeOverlapQuery = (query) => {
    query
      .where("departure_time", "<", arrival_time)
      .where("arrival_time", ">", departure_time);

    // loại trừ chính nó khi update
    if (excludeId) {
      query.where("schedule_id", "!=", excludeId);
    }
  };

  // check ship
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

  // check pilot
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
          "p.user_id",
          "sc.departure_time",
          "sc.arrival_time",
          "sc.status",
          "sc.created_at",
          "sc.updated_at",
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

  // thống kê số lượt đi tàu theo tháng của mỗi hoa tiêu
  async getPilotMonthlyStats(month, year) {
    try {
      if (!month || !year) {
        return {
          status: false,
          message: "Month and year are required",
        };
      }

      const stats = await knex("SCHEDULES as sc")
        .leftJoin("users as u", "sc.pilot_id", "u.user_id")
        .whereRaw("MONTH(sc.departure_time) = ?", [month])
        .andWhereRaw("YEAR(sc.departure_time) = ?", [year])
        .groupBy("sc.pilot_id", "u.full_name")
        .select("sc.pilot_id", "u.full_name as pilot_name")
        .count("* as total_trips")
        .orderBy("total_trips", "desc");

      return {
        status: true,
        message: "Pilot monthly statistics retrieved successfully",
        data: stats,
      };
    } catch (error) {
      return {
        status: false,
        message: "Failed to retrieve statistics",
        error: error.message,
      };
    }
  },

  // update schedule

  async updateSchedule(data) {
    try {
      const { schedule_id } = data;

      if (!schedule_id) {
        return {
          status: false,
          message: "schedule_id is required",
        };
      }

      // 1. kiểm tra tồn tại
      const existingSchedule = await knex("SCHEDULES")
        .where("schedule_id", schedule_id)
        .first();

      if (!existingSchedule) {
        return {
          status: false,
          message: "Schedule not found",
        };
      }

      // 2. merge data (quan trọng để tránh thiếu field)
      const mergedData = {
        ...existingSchedule,
        ...data,
      };

      // 3. validate (loại trừ chính nó)
      const validation = await validateSchedule(mergedData, schedule_id);

      if (!validation.status) {
        return validation;
      }

      // 4. update
      await knex("SCHEDULES")
        .where("schedule_id", schedule_id)
        .update({
          ...data,
          updated_at: knex.fn.now(),
        });

      return {
        status: true,
        message: "Schedule updated successfully",
      };
    } catch (error) {
      return {
        status: false,
        message: "Failed to update schedule",
        error: error.message,
      };
    }
  },

  async exportSchedulesToExcel({ day, month, year }) {
    try {
      let query = knex("SCHEDULES as sc")
        .join("SHIPS as sh", "sc.ship_id", "sh.ship_id")
        .join("PORTS as dp", "sc.departure_port_id", "dp.port_id")
        .join("PORTS as ap", "sc.arrival_port_id", "ap.port_id")
        .leftJoin("users as p", "sc.pilot_id", "p.user_id");

      // 🔥 FILTER LINH HOẠT
      if (year) {
        query = query.whereRaw("YEAR(sc.departure_time) = ?", [year]);
      }

      if (month) {
        query = query.whereRaw("MONTH(sc.departure_time) = ?", [month]);
      }

      if (day) {
        query = query.whereRaw("DAY(sc.departure_time) = ?", [day]);
      }

      const schedules = await query
        .select(
          "sc.schedule_id",
          "sh.ship_name",
          "dp.port_name as departure_port",
          "ap.port_name as arrival_port",
          "p.full_name as pilot_name",
          "sc.departure_time",
          "sc.arrival_time",
          "sc.status",
          "sc.created_at",
        )
        .orderBy("sc.departure_time", "desc");

      // 🧾 Excel
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Schedules");

      worksheet.columns = [
        { header: "ID", key: "schedule_id", width: 10 },
        { header: "Ship", key: "ship_name", width: 20 },
        { header: "Departure Port", key: "departure_port", width: 25 },
        { header: "Arrival Port", key: "arrival_port", width: 25 },
        { header: "Pilot", key: "pilot_name", width: 25 },
        { header: "Departure Time", key: "departure_time", width: 25 },
        { header: "Arrival Time", key: "arrival_time", width: 25 },
        { header: "Status", key: "status", width: 15 },
        { header: "Created At", key: "created_at", width: 25 },
      ];

      schedules.forEach((item) => {
        worksheet.addRow({
          ...item,
          departure_time: new Date(item.departure_time).toLocaleString(),
          arrival_time: new Date(item.arrival_time).toLocaleString(),
        });
      });

      // style header
      worksheet.getRow(1).font = { bold: true };

      return {
        status: true,
        workbook,
      };
    } catch (error) {
      return {
        status: false,
        message: "Export failed",
        error: error.message,
      };
    }
  },
};

module.exports = scheduleService;
