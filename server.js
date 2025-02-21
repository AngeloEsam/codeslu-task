const express = require("express");
const http = require("http");
require("dotenv").config();
const { setupWebSocket } = require("./ws/websocket");
const messagesRoutes = require("./routes/messages");
const usersRoutes = require("./routes/users");
const groupsRoutes = require("./routes/groups");

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 5001;

setupWebSocket(server);

app.use("/messages", messagesRoutes);
app.use("/users", usersRoutes);
app.use("/groups", groupsRoutes);

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
