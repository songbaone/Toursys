const express = require("express");
const userControllers = require("../Controllers/users.controller");
const router = express.Router();

// =========REGISTER USER============
router.post("/register", userControllers.register);

//==========LOGIN USER============
router.post("/login", userControllers.login);

//==========GET USER PROFILE============
router.get("/profile/:email", userControllers.getUserByEmail);

//==========GET LIST USERS============
router.get("/", userControllers.getListUsers);

//==========UPDATE USER PROFILE============
router.put("/profile/:email", userControllers.updateUser);

module.exports = router;
