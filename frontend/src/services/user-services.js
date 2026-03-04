import createApi from "./api-services";

class UsersService {
  constructor() {
    this.api = createApi();
  }

  async getUsers(params) {
    return this.api.get("/api/users", { params });
  }

  async createUser(userData) {
    return await this.api.post("/api/users/register", userData);
  }

  async getUserByEmail(email) {
    return await this.api.get(`/api/users/profile/${email}`);
  }

  async updateUser(email, data) {
    return await this.api.put(`/api/users/profile/${email}`, data);
  }
}

export default new UsersService();
