const ApiError = require("../api-error");
const userService = require("../Services/users.service");
const userController = {
  async register(req, res, next) {
    try {
      const accountData = req.body;
      const user = await userService.registerUser(accountData);
      res.status(201).json(user);
    } catch (error) {
      next(new ApiError(500, "Error registering user: " + error.message));
      console.error("Error registering user:", error);
    }
  },

  async login(req, res, next) {
    try {
      const { email, role_id, password } = req.body;
      const result = await userService.loginUser(email, password, role_id);
      console.log(result)
      res.json(result);
    } catch (error) {
      console.log(error)
      next(new ApiError(401, error.message));
    }
  },

  async getUserByEmail(req, res, next) {
    try {
      const userEmail = req.params.email;
      const user = await userService.getUserByEmail(userEmail);
      res.json(user);
    } catch (error) {
      next(new ApiError(404, "Error fetching user: " + error.message));
    }
  },

  async getListUsers(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const keyword = req.query.keyword || "";
      const result = await userService.getListUsers(page, keyword);
      res.json(result);
    } catch (error) {
      next(new ApiError(500, "Error retrieving users: " + error.message));
    }
  },

  async updateUser(req, res, next) {
    try {
      const userData = req.body;
      const email = req.params.email;
      const updatedUser = await userService.updateUser(userData, email);
      res.json({
        message: "User updated successfully",
        user: updatedUser.user.email,
      });
    } catch (error) {
      console.error("Error updating user:", error);
      next(new ApiError(500, "Error updating user: " + error.message));
    }
  },
};

module.exports = userController;
