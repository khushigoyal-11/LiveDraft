import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { Server } from "socket.io";
import ACTIONS from "./Actions.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

// DEBUG: Log the Mongo URI
console.log("▶️ MONGO_URI:", process.env.MONGO_URI);

// Health check endpoint
app.get("/ping", (_req, res) => {
  return res.json({ ok: true, timestamp: new Date().toISOString() });
});

// CORS and JSON parsing
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://livedraft-1.onrender.com"
    ],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Define Mongoose Schema and Model
const CodeSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true },
  code: { type: String, default: "" },
});
const Code = mongoose.model("Code", CodeSchema);

// Endpoint to fetch code by roomId
app.get("/download/:roomId", async (req, res) => {
  const { roomId } = req.params;
  console.log("🔍 Download route hit for roomId:", roomId);
  try {
    const roomData = await Code.findOne({ roomId });
    if (roomData) {
      res.setHeader("Content-Disposition", "attachment; filename=text.txt");
      res.setHeader("Content-Type", "text/plain");
      return res.send(roomData.code);
    } else {
      console.warn("⚠️ Room not found in database:", roomId);
      return res.status(404).send("Room not found");
    }
  } catch (err) {
    console.error("🚨 Error fetching code from MongoDB for roomId", roomId, ":", err);
    return res.status(500).send("Internal Server Error");
  }
});

// Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "https://livedraft-1.onrender.com"
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const userSocketMap = {};
const getAllConnectedClients = (roomId) =>
  Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId) => ({
    socketId,
    username: userSocketMap[socketId],
  }));

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on(ACTIONS.JOIN, async ({ roomId, username }) => {
    userSocketMap[socket.id] = username;
    socket.join(roomId);

    try {
      let room = await Code.findOne({ roomId });
      if (!room) {
        room = await Code.create({ roomId, code: "" });
      }
      const code = room.code || "";
      socket.emit(ACTIONS.CODE_CHANGE, { code });

      const clients = getAllConnectedClients(roomId);
      clients.forEach(({ socketId }) => {
        io.to(socketId).emit(ACTIONS.JOINED, {
          clients,
          username,
          socketId: socket.id,
        });
      });
    } catch (err) {
      console.error("Error retrieving room data from MongoDB:", err);
    }
  });

  socket.on(ACTIONS.CODE_CHANGE, async ({ roomId, code }) => {
    socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
    try {
      await Code.findOneAndUpdate({ roomId }, { code }, { upsert: true, new: true });
    } catch (err) {
      console.error("Error saving code to MongoDB:", err);
    }
  });

  socket.on("disconnecting", () => {
    const rooms = [...socket.rooms];
    rooms.forEach((roomId) => {
      socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        username: userSocketMap[socket.id],
      });
    });
    delete userSocketMap[socket.id];
    socket.leave();
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
