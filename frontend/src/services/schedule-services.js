import createApi from "./api-services";

class ScheduleService {
  constructor() {
    this.api = createApi();
  }
  async getSchedules(params) {
    return await this.api.get("/api/schedules", { params });
  }

  async createSchedule(scheduleData) {
    return await this.api.post("/api/schedules", scheduleData);
  }

  async getPilotMonthlyStats(params) {
    return await this.api.get("/api/schedules/stats/pilot-monthly", { params });
  }
}

export default new ScheduleService();
