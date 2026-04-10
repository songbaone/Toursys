require("dotenv").config();

const { DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_INSTANCE } =
  process.env;

const knex = require("knex")({
  client: "mssql",
  connection: {
    server: DB_HOST, // 🔥 bắt buộc phải là server
    user: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
    options: {
      instanceName: DB_INSTANCE, // 🔥 SQLEXPRESS
      encrypt: false,
      trustServerCertificate: true,
    },
  },
});

// check connect
async function checkconnection() {
  try {
    await knex.raw("SELECT 1");
    console.log(
      `Connection to database successfully! with database name: ${DB_NAME}`
    );
    return true;
  } catch (error) {
    console.error("Error while connectting database ", error);
    return false;
  }
}

module.exports = {
  knex,
  checkconnection,
};