const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

// save users
let users = [];

// add user
const addUser = (userId, socketId) => {
  // check array, nếu có user đó --> true
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

// remove user
const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

// get user
const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  console.log("---> A user connected ...");

  // get userId && socketId from user
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);

    // (get users when online)
    io.emit("getUsers", users);
  });

  // send message
  socket.on("sendMessage", ({ senderID, receiverID, content }) => {
    const user = getUser(receiverID);

    io.to(user.socketId).emit("getMessage", {
      senderID,
      content,
    });
  });

  // When user disconnected
  socket.on("disconnect", () => {
    console.log("---> A user disconnected.");
    removeUser(socket.id);

    // (get users when online)
    io.emit("getUsers", users);
  });
});

server.listen(8900);
