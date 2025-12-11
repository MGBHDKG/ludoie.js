import {generateRoomNumber} from "../game/randomGeneration.js";
import {getRoom, roomExists, setRoom,  deleteRoom, getGame, setGame, deleteGame} from "../game/roomAndGameStructures.js";
import { Player } from "../model/player.js";
import { Game } from "../model/game.js";
import { playerStatistics } from "../model/playerStatistics.js" 
import { COLORS } from "../constant/gameParameters.js";

export function socketHandlers(io){
    io.on("connection", (socket) => {
        console.log("✅ Un client est connecté : " + socket.id);

        socket.on("createRoom", (username) => {
            let checkUsername = Player.checkUsername(username);

            if(checkUsername.valid === false){
                io.to(socket.id).emit("error", checkUsername.error);
                console.log(`Erreur : ${username} : ${checkUsername.error}`);
                return;
            }

            var room = undefined;

            while(room == undefined){
                room = generateRoomNumber();
                if(roomExists(room)) room = undefined;
            }

            setRoom(room, [username]);
            socket.join(room);
            socket.data.username = username;
            socket.data.code = room;

            console.log(`Nouvelle room crée : ${room} par le joueur ${username} ayant pour id : ${socket.id}`);
            io.to(socket.id).emit("roomCreated", room, [username]);
        });

        socket.on("joinRoom", (username, code) => {
            let checkUsername = Player.checkUsername(username);

            if(checkUsername.valid === false){
                io.to(socket.id).emit("error", checkUsername.error);
                console.log(`Erreur : ${username} : ${checkUsername.error}`);
                return;
            }

            let room = getRoom(code);
            if(!room) {
                io.to(socket.id).emit("error", "Room " + code + " n'existe pas");
                return;
            }
            if(room.includes(username)){
                io.to(socket.id).emit("error", "Ce nom d'utilisateur est déjà pris !");
                return;
            }
            if(room.length >= 4){
                io.to(socket.id).emit("error", "La room est déjà remplie !");
                return;
            }

            room.push(username);
            setRoom(code, room);
            socket.join(code);
            socket.data.username = username;
            socket.data.code = code;

            io.to(code).emit("anUserHasJoinTheRoom", room);
            console.log(`${username} a rejoint la room ${code}`);
            io.to(socket.id).emit("youCanJoinRoom", code, room);
        })

        socket.on("disconnect", () => {
            const username = socket.data.username;
            const code = socket.data.code;

            if(!username || !code) return;

            let room = getRoom(code);

            console.log(`${username} s'est déconnecté de la room ${code}`)

            if(room){
                const players = room.filter(p => username != p);
                if(players.length === 0){
                    deleteRoom(code);
                    console.log(`Room ${code} supprimée car vide`)
                }
                else{
                    io.to(code).emit("userLeftRoom", players, username);
                    setRoom(code, players);
                }
            }
            else {
                io.to(code).emit("endGameAFK", username);
                deleteGame(code);
                console.log(`Game de la room ${code} finie car ${username} a quitté la room`);
            }
        })

        socket.on("startGame", (code) => {
            const room = getRoom(code);
            if(room.length < 2 || room.length > 4){
                io.to(code).emit("error", "Nombre de joueurs incorrect");
                return;
            }

            let players = [];
            for(let i=0; i<room.length; i++){
                const stats =  new playerStatistics();
                players[i] = new Player(room[i], i, stats, COLORS[i]);
            }

            deleteRoom(code);

            let game = new Game(players);
            game.startGame();

            setGame(code, game);

            const playersObj = players.map(p => p.convertPlayerToObj());
            io.to(code).emit("allStartGame", playersObj);

            console.log(`Game de la room ${code} commencée`)
        })

        socket.on("launchDice", (username, code, cheat) => { 
            let game = getGame(code);
            const dice = game.launchDice(username, cheat);
            if(!dice)return;

            console.log(`Room ${code} : ${username} a fait un ${dice}`);
            io.to(code).emit("diceLaunched", dice);
            let players = game.getPlayers();
            const player = players.find(p => p.username() === username);
            if (!player) return;

            let movablePawns = game.computeMovablePawns(player);

            if(movablePawns.length > 0)
            {
                io.to(socket.id).emit("movablePawns", movablePawns);
                game.setMovablePawns(movablePawns);
                console.log(`Pions bougeables pour ${username} : ${movablePawns}`);
            }
            else
            {
                if(dice != 6){
                    game.moveToTheNextTurn();
                    const updatedPlayers = game.getPlayers();
                    const updatedPlayersObj = updatedPlayers.map(p => p.convertPlayerToObj());
                    setTimeout(() => io.to(code).emit("turnChanged", updatedPlayersObj), 2000);
                    console.log(`${username} n'a aucun pion bougeable, tour du prochain joueur`)
                }
                else{
                    player.resetRollThisTurn();
                    setTimeout(() => io.to(code).emit("resetDice"), 2000); 
                    console.log(`${username} a fait un 6, il rejoue donc`);
                }
            }
        })

        socket.on("pawnSelected", (pawnToMove, code, username) => {
            let game = getGame(code);
            if (!game) return;

            const dice = game.getDice();
            const movablePawns = game.getMovablePawns();
            if(!movablePawns) return;

            if(!movablePawns.includes(pawnToMove)){
                return;
            }

            let players = game.getPlayers();
            const player = players.find(p => p.username() === username);
            const playerNumber = player.getPlayerNumber();
            const moveDoneByThePawn = game.movePawn(pawnToMove, playerNumber);
            if(!moveDoneByThePawn) return;

            if(moveDoneByThePawn.from != "end" && moveDoneByThePawn.to != "end"){
                io.to(code).emit("movePawn", pawnToMove, moveDoneByThePawn.newPlaceOnBoardIndex);
                console.log(`${username}: Pion ${pawnToMove} déplacé à la case ${moveDoneByThePawn.newPlaceOnBoardIndex}`);
            }
            else{
                io.to(code).emit("movePawnToEndCase", pawnToMove, playerNumber, moveDoneByThePawn.newPlaceOnBoardIndex);
                console.log(`${username} : le pion ${pawnToMove} est sur les escaliers à l'indice ${moveDoneByThePawn.newPlaceOnBoardIndex}`);
            }
            if(moveDoneByThePawn.capturedPawn !== null){
                io.to(code).emit("backToBase", moveDoneByThePawn.capturedPawn);
                console.log(`${moveDoneByThePawn.capturedPawn} retourne à la base`);
            }

            let gameState = game.isGameFinished();
            if(gameState.finished){
                setTimeout(() => {
                    io.to(code).emit("gameIsFinished", gameState.playersRanking);
                }, 2000);
                console.log(`Game finie de la room ${code}`);
                return;
            }

            if(dice != 6){    
                game.moveToTheNextTurn();
                const updatedPlayers = game.getPlayers();
                const updatedPlayersObj = updatedPlayers.map(p => p.convertPlayerToObj());
                
                io.to(code).emit("turnChanged", updatedPlayersObj);
                console.log(`${username} a joué, tour du prochain joueur`)
            }
            else{
                player.resetRollThisTurn();
                io.to(code).emit("resetDice");
                console.log(`${username} a fait un 6, il rejoue donc`);
            }
        });
    })
}