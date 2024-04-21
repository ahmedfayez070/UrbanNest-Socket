import { Server } from "socket.io";
import dotenv from "dotenv";

dotenv.config();

let onlineUsers = [];

const addUser = (userId, socketId) => {
  const user = onlineUsers.find((user) => user.userId === userId);
  if (!user) {
    onlineUsers.push({ userId, socketId });
  }
};

const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return onlineUsers.find((user) => user.userId === userId);
};

const io = new Server({
  cors: {
    origin: process.env.FRONTEND_ORIGIN,
  },
});

io.on("connection", (socket) => {
  socket.on("newUser", (userId) => {
    addUser(userId, socket.id);
  });

  socket.on("sendMessage", ({ receiverId, data }) => {
    const receiver = getUser(receiverId);
    io.to(receiver.socketId).emit("getMessage", data);
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
  });
});

io.listen("4000");
