import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

import { socketHandlers } from "./socket/server.js";

const PORT = 4000;
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
})

socketHandlers(io);

httpServer.listen(PORT, () => {
    console.log(`🚀 Le serveur est lancé sur le port ${PORT}`)
})