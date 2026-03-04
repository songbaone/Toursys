import createApi from "./api-services";

class LoginService {
  constructor() {
    this.api = createApi();
  }

  async login(email, password, role_id) {
    return await this.api.post("/api/users/login", {
      email,
      password,
      role_id,
    });
  }
}

export default new LoginService();
