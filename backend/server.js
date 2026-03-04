const app = require("./src/app");
const { checkconnection } = require("./db.config");
const http = require("http");

const PORT = process.env.PORT || 3000;

// Test database connection
checkconnection().then((connected) => {
  if (connected) {
    const server = http.createServer(app);

    server.listen(PORT, "0.0.0.0", () => {
      console.log(
        `Server is running on all network interfaces at port ${PORT}.`,
      );
    });
  } else {
    console.error("Connection to database failed");
  }
});
