const WebSocket = require("ws");
const db = require("../database/db");

const clients = new Map();

function setupWebSocket(server) {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    console.log("New client connected");

    ws.on("message", (data) => {
      try {
        const msg = JSON.parse(data);

        if (msg.username) {
          clients.set(msg.username, ws);
          console.log(`${msg.username} connected`);
        }

        if (msg.to && msg.message) {
          handlePrivateMessage(msg);
        }

        if (msg.createGroup) {
          createGroup(msg.createGroup);
        }

        if (msg.joinGroup) {
          joinGroup(msg.username, msg.joinGroup);
        }

        if (msg.toGroup && msg.message) {
          sendMessageToGroup(msg.username, msg.toGroup, msg.message);
        }
      } catch (error) {
        console.error("Error processing message:", error);
      }
    });

    ws.on("close", () => {
      clients.forEach((value, key) => {
        if (value === ws) clients.delete(key);
      });
      console.log("Client disconnected");
    });
  });
}

function handlePrivateMessage(msg) {
  const { username, to, message } = msg;

  db.get(
    `SELECT u1.username AS sender, u2.username AS receiver 
     FROM users u1 JOIN users u2 
     ON u1.username = ? AND u2.username = ?`,
    [username, to],
    (err, row) => {
      if (err || !row) {
        console.log("Error fetching user data");
      }

      const receiverSocket = clients.get(to);
      if (receiverSocket) {
        receiverSocket.send(JSON.stringify({ from: username, message }));
      }

      db.run(
        "INSERT INTO messages (sender, receiver, message) VALUES (?, ?, ?)",
        [username, to, message]
      );
    }
  );
}

function createGroup(groupName) {
  db.get("SELECT group_name FROM groups WHERE group_name = ?", [groupName], (err, row) => {
    if (row) {
      console.log('Group already exists')
      return;
    }

    db.run("INSERT INTO groups (group_name) VALUES (?)", [groupName], (err) => {
      if (err) {
        console.error('Failed to create group:', err.message);
      } else {
        console.log(`group created : ${groupName}`);
      }
    });
  });
}

function joinGroup(username, groupName) {
  db.get(
    "SELECT * FROM groups WHERE group_name = ?",
    [groupName],
    (err, group) => {
      if (err || !group) {
        return console.log(`Group ${groupName} not found.`);
      }
      db.run(
        "INSERT INTO group_members (group_name, username) VALUES (?, ?)",
        [groupName, username],
        (err) => {
          if (err) {
            console.log(
              ` Failed to join ${username} to group ${groupName}:`,
              err
            );
          } else {
            console.log(`${username} joined group: ${groupName}`);
          }
        }
      );
    }
  );
}

function sendMessageToGroup(username, groupName, message) {
  db.get(
    "SELECT * FROM group_members WHERE group_name = ? AND username = ?",
    [groupName, username],
    (err, row) => {
      if (err || !row) {
        return console.log(
          ` User ${username} tried to send a message to a group they are not in!`
        );
      }
      db.all(
        "SELECT username FROM group_members WHERE group_name = ?",
        [groupName],
        (err, rows) => {
          if (err) return;
          rows.forEach((row) => {
            const memberSocket = clients.get(row.username);
            if (memberSocket) {
              memberSocket.send(
                JSON.stringify({ from: username, group: groupName, message })
              );
            }
          });
          db.run(
            "INSERT INTO messages (sender, group_name, message) VALUES (?, ?, ?)",
            [username, groupName, message]
          );
        }
      );
    }
  );
}

module.exports = { setupWebSocket };
