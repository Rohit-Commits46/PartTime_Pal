const { Server } = require("socket.io");
const http = require("http");
const express = require("express");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"],
    },
});

const userSocketMap = {};

function getRecieverSocketId(userId) {
    return userSocketMap[userId];
}

io.on("connection", (socket) => {

    const userId = socket.handshake.query.userId;
    if (userId) userSocketMap[userId] = socket.id;
    console.log("User connected:", socket.id,userId);

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);

        if (userId) {
            delete userSocketMap[userId];
            io.emit("getOnlineUsers", Object.keys(userSocketMap));
        }
    });
});

// ✅ Export using CommonJS
module.exports = { io, app, server, getRecieverSocketId };
