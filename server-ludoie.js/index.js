import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const PORT = 4000;
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
})

function generateSixDigitNumber() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

let rooms = new Map();
let map = new Map();
let base = new Map();
let playersTurnIndex = new Map();

io.on("connection", (socket) => {
    console.log("✅ Un client est connecté : " + socket.id);

    socket.on("createRoom", (username) => {
        var room = undefined;

        while(room == undefined){
            room = generateSixDigitNumber();
            if(rooms.has(room)) room = undefined
        }

        rooms.set(room, [username]);
        socket.join(room);

        console.log(`Nouvelle room crée : ${room} par le joueur ${username} ayant pour id : ${socket.id}`);

        io.to(socket.id).emit("roomCreated", room, [username]);
    });

    socket.on("joinRoom", (username, code) => {
        let room = rooms.get(code);
        if(!room) {
            //CODE ROOM PAS PRESENTE
            return;
        }

        room.push(username);
        rooms.set(code, room);
        socket.join(code);

        io.to(code).emit("anUserHasJoinTheRoom", room);
        console.log(`${username} a rejoint la room ${code}`);
        io.to(socket.id).emit("youCanJoinRoom", code, room);
    })

    socket.on("startGame", (code) => {
        let room = rooms.get(code);
        let players = [];

        for(let i=0; i<room.length; i++){
            players[i] = {
                username: room[i],
                isPlaying: false
            }
        }
        players[0].isPlaying = true;

        rooms.set(code, players);
        playersTurnIndex.set(code, 0);
        map.set(code, ["groscaca"]);
        base.set(code, ["énorme caca"]);

        io.to(code).emit("allStartGame", players);
    })
})

httpServer.listen(PORT, () => {
    console.log(`🚀 Le serveur est lancé sur le port ${PORT}`)
})