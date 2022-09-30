const dotenv = require("dotenv");

const io = require("socket.io")(8900, {
  cors: {
    origin: process.env.REACT_APP_BASE_URL,
  },
});

// config file .env
dotenv.config();

// Save user connect or Remove user disconnect.
let users = [];

const addUser = (userId, socketId) => {
  // some: check array, nếu có user đó --> true
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  // when user connect
  console.log("---> A user connected...");

  // get userId and socketId from user
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);

    io.emit("getUsers", users);
  });

  // when user disconnect
  socket.on("disconnect", () => {
    console.log("---> A user disconnected.");
    removeUser(socket.id);

    io.emit("getUsers", users);
  });

  // send and get message
  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    const user = getUser(receiverId);

    io.to(user.socketId).emit("getMessage", {
      senderId,
      text,
    });
  });
});
