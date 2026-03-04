import createApi from "./api-services";

class PortsService {
  constructor() {
    this.api = createApi();
  }

  async getPorts(params) {
    return await this.api.get("/api/ports", { params });
  }

  async createPort(data) {
    return await this.api.post("/api/ports", data);
  }
}

export default new PortsService();
