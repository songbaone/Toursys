// src/routes/roles.routes.js
const express = require("express");
const handleRolesController = require("../Controllers/roles.controller");
const router = express.Router();

// Lấy danh sách tất cả các chức vụ
router.get("/", handleRolesController.getListRoles);

// Lấy thông tin chi tiết của một chức vụ theo role_id
router.get("/:role_id", handleRolesController.getRoleById);

// Tạo mới một chức vụ
router.post("/", handleRolesController.createRole);

// Cập nhật thông tin của một chức vụ theo role_id
router.put("/:role_id", handleRolesController.updateRoleById);

// Xóa một chức vụ theo role_id (kiểm tra liên kết với STAFF_ACCOUNTS trước khi xóa)
router.delete("/:role_id", handleRolesController.deleteRoleById);
module.exports = router;
