import createApi from "./api-services";

class RoleService {
  constructor() {
    this.api = createApi();
  }

  async getRoles() {
    return await this.api.get("/api/roles");
  }

  async getRoleById(roleId) {
    return await this.api.get(`/api/roles/${roleId}`);
  }

  async createRole(roleData) {
    return await this.api.post("/api/roles", roleData);
  }

  async updateRole(roleId, roleData) {
    return await this.api.put(`/api/roles/${roleId}`, roleData);
  }

  async deleteRole(roleId) {
    return await this.api.delete(`/api/roles/${roleId}`);
  }
}

export default new RoleService();
