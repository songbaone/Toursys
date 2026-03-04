import createApi from "./api-services";

class ShipsService {
  constructor() {
    this.api = createApi();
  }

  async getShips(params) {
    return this.api.get("/api/ships", { params });
  }

  async createShip(shipData) {
    return await this.api.post("/api/ships", shipData);
  }

  async getShipById(id) {
    return await this.api.get(`/api/ships/${id}`);
  }

  async updateShip(id, data) {
    return await this.api.put(`/api/ships/${id}`, data);
  }

  async deleteShip(id) {
    return await this.api.delete(`/api/ships/${id}`);
  }
}

export default new ShipsService();
