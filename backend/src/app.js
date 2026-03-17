const express = require("express");
const path = require("path");
const cors = require("cors");

//============== ROUTER FOR USERS===============
const routerUsers = require("./Routers/users.route");

//============== ROUTER FOR ROLES===============
const routerRoles = require("./Routers/roles.route");

//============== ROUTER FOR PORTS===============
const routerPorts = require("./Routers/ports.route");

//============== ROUTER FOR SHIPS===============
const routerShips = require("./Routers/ships.route");

// ============== ROUTER FOR SCHEDULES===============
const routerSchedules = require("./Routers/schedules.route");

const {
  resourceNotFound,
  methodNotAllowed,
  handleError,
} = require("./Controllers/errors.controller");
// create app use express
const app = express();

// app.use(
//   cors({
//     origin: ["http://localhost:8080", "http://10.1.44.233"],
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true, // Hỗ trợ cookie nếu cần
//   })
// );
app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Niên luận chuyên ngành B2014966",
  });
});

//--------------------API FOR ROLES---------------------
app.use("/api/roles", routerRoles);

//--------------------API FOR USERS---------------------
app.use("/api/users", routerUsers);

//--------------------API FOR PORTS---------------------
app.use("/api/ports", routerPorts);

//--------------------API FOR SHIPS---------------------
app.use("/api/ships", routerShips);

//--------------------API FOR SCHEDULES---------------------
app.use("/api/schedules", routerSchedules);

app.use(resourceNotFound);
app.use(methodNotAllowed);
app.use(handleError);

module.exports = app;
