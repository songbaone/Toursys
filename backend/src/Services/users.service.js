const bcrypt = require("bcryptjs");
const { knex } = require("../../db.config");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const userService = {
  async registerUser(accountData) {
    const { email, password } = accountData;
    try {
      const existingUser = await knex("users").where({ email }).first();
      if (existingUser) {
        throw new Error("Email already in use");
      }
      accountData.status = "active";
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      const passwordHash = await bcrypt.hash(password, salt);
      accountData.password = passwordHash;
      accountData.salt = salt;
      const [user] = await knex("users")
        .insert(accountData)
        .returning(["user_id", "full_name", "email"]);
      return {
        message: "User registered successfully",
        id: user.user_id,
        name: user.full_name,
        email: user.email,
      };
    } catch (error) {
      throw new Error("Error registering user: " + error.message);
    }
  },

  async loginUser(email, password, role_id) {
    try {
      const user = await knex("users").where({ email, role_id }).first();
      if (!user) {
        throw new Error("Invalid email or role");
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error("Invalid email or password");
      }

      return {
        message: "Login successful",
        user: {
          name: user.full_name,
          email: user.email,
          role_id: user.role_id,
        },
      };
    } catch (error) {
      throw new Error("Error logging in: " + error.message);
    }
  },

  async getUserByEmail(email) {
    try {
      const user = await knex("users").where({ email }).first();
      if (!user) {
        throw new Error("User not found");
      }
      return { user };
    } catch (error) {
      throw new Error("Error fetching user: " + error.message);
    }
  },

  // get all user + search
  async getListUsers(page, keyword = "") {
    try {
      console.log("PAGE RECEIVED:", page);
      console.log("KEYWORD:", keyword);

      const itemsPerPage = 10;
      const offset = (page - 1) * itemsPerPage;
      console.log("OFFSET:", offset);

      // Base query (search)
      const baseQuery = knex("USERS").modify((queryBuilder) => {
        if (keyword && keyword.trim() !== "") {
          queryBuilder.where(function () {
            this.where("full_name", "like", `%${keyword}%`)
              .orWhere("email", "like", `%${keyword}%`)
              .orWhere("phone", "like", `%${keyword}%`)
              .orWhere("address", "like", `%${keyword}%`)
              .orWhere("status", "like", `%${keyword}%`)
              .orWhere("role_id", "like", `%${keyword}%`);
          });
        }
      });

      // Count total (after search)
      const totalUsers = await baseQuery
        .clone()
        .count("* as totalCount")
        .first();
      const totalItems = totalUsers.totalCount;

      const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

      if (page > totalPages) {
        return {
          status: false,
          message: `Page ${page} exceeds total number of pages (${totalPages}).`,
          totalPages,
          users: [],
        };
      }

      // Get users with pagination
      const users = await baseQuery
        .clone()
        .select("*")
        .orderBy("user_id", "asc")
        .limit(itemsPerPage)
        .offset(offset);

      return {
        status: true,
        message: "Get list users successfully",
        users,
        totalPages,
        itemsPerPage,
      };
    } catch (error) {
      console.error("Error retrieving users:", error);
      throw error;
    }
  },

  async updateUser(userData, email) {
    try {
      const user_id = await knex("users")
        .select("user_id")
        .where({ email: email })
        .first();

      const res = await knex("users")
        .where({ user_id: user_id.user_id })
        .update(userData);
      if (!res) {
        throw new Error("User not found or update failed");
      }

      return await this.getUserByEmail(email);
    } catch (error) {
      throw new Error("Error updating user: " + error.message);
    }
  },
};
module.exports = userService;
