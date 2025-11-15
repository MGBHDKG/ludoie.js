import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

import { randomBytes, randomInt } from "crypto";

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

function launchDice(){
    return randomInt(1,7);
}

let rooms = new Map();
let map = new Map();
let base = new Map();
let playersTurnIndex = new Map();

function nextTurn(code){
    let players = rooms.get(code);
    let index = playersTurnIndex.get(code);

    players[index].isPlaying = false;
    players[index].hasRolledThisTurn = false;

    let nextPlayer = (index + 1) % players.length;
    players[nextPlayer].isPlaying = true;
    players[nextPlayer].hasRolledThisTurn = false;

    rooms.set(code, players);
    playersTurnIndex.set(code, nextPlayer);
}

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
                isPlaying: false, 
                index: i,
                hasRolledThisTurn: false,
            }
        }
        players[0].isPlaying = true;
        players[0].hasRolledThisTurn = false;

        rooms.set(code, players);
        playersTurnIndex.set(code, 0);
        map.set(code, {
            map: [
                0,
                -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
                1,
                -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
                2,
                -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
                3,
                -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
            ],

            startIndex : {
                0: 0,
                1: 12,
                2: 24,
                3: 36
            },

            homeEntryIndex : {
                0: 47,
                1: 11,
                2: 23,
                3: 35
            },

            home : {
                0: [-1,-1,-1,-1],
                1: [-1,-1,-1,-1],
                2: [-1,-1,-1,-1],
                3: [-1,-1,-1,-1],
            }
        });

        base.set(code, [
            ['A','B','C','D'],
            ['E','F','G','H'],
            ['I','J','K','L'],
            ['M','N','O','P']
        ]);

        io.to(code).emit("allStartGame", players);
    })

    socket.on("launchDice", (username, code) => { 
        let players = rooms.get(code);

        for(const player of players){
            if(player.isPlaying && player.username === username && !player.hasRolledThisTurn){
                player.hasRolledThisTurn = true;
                let dice = launchDice();
                //FAIRE GESTION DE L'ANIMATION DE DE
                nextTurn(code);
                players = rooms.get(code);
                io.to(code).emit("diceLaunched", username, dice, players);
                break;
            }
            else{
                //TENTATIVE DE TRICHE
            }
        }
    })
})

httpServer.listen(PORT, () => {
    console.log(`🚀 Le serveur est lancé sur le port ${PORT}`)
})