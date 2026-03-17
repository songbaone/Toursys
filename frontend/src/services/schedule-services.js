import createApi from "./api-services";

class ScheduleService {
  constructor() {
    this.api = createApi();
  }
  async getSchedules() {
    return await this.api.get("/api/schedules");
  }

  async createSchedule(scheduleData) {
    return await this.api.post("/api/schedules", scheduleData);
  }
}

export default new ScheduleService();
