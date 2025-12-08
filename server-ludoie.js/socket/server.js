import {launchDice, generateSixDigitNumber} from "../game/randomGeneration.js";
import {getRoom, getBoard, getBase, roomExists, setBase, setBoard, setRoom, setGame, moveToTheNextRound, gameIsFinished, deleteRoom} from "../game/state.js"
import { getMovablePawns, backToBase } from "../game/pawns.js";

export function socketHandlers(io){
    io.on("connection", (socket) => {
        console.log("✅ Un client est connecté : " + socket.id);

        socket.on("createRoom", (username) => {
            if(username === ""){
                io.to(socket.id).emit("error", "Veuillez entrer un nom d'utilisateur");
                return;
            }

            if(username.length > 12){
                io.to(socket.id).emit("error", "Nom d'utilisateur trop long");
                return;
            }

            var room = undefined;

            while(room == undefined){
                room = generateSixDigitNumber();
                if(roomExists(room)) room = undefined
            }

            setRoom(room, [username]);
            socket.join(room);
            socket.data.username = username;
            socket.data.code = room;

            console.log(`Nouvelle room crée : ${room} par le joueur ${username} ayant pour id : ${socket.id}`);
            io.to(socket.id).emit("roomCreated", room, [username]);
        });

        socket.on("joinRoom", (username, code) => {
            if(username === ""){
                io.to(socket.id).emit("error", "Veuillez entrer un nom d'utilisateur");
                return;
            }

            if(username.length > 12){
                io.to(socket.id).emit("error", "Nom d'utilisateur trop long");
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
            if(typeof room[0] !== "string"){
                io.to(socket.id).emit("error", "Cette room est déjà en partie");
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
            if (!room) return;

            console.log(`${username} s'est déconnecté de la room ${room}`)

            if(typeof room[0] === "string"){
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
                io.to(code).emit("endGame", username);
                deleteRoom(code);
                console.log(`Game de la room ${code} finie car ${username} a quitté la room`)
            }
        })

        socket.on("startGame", (code) => {
            const room = getRoom(code);
            if(room.length != 4){
                io.to(code).emit("error", "Nombre de joueurs incorrect");
            }
            const players = setGame(code);
            io.to(code).emit("allStartGame", players);

            console.log(`Game de la room ${code} commencée`)
        })

        socket.on("launchDice", (username, code, cheat) => { 
            let players = getRoom(code);

            for(const player of players){
                if(player.isPlaying && player.username === username && !player.hasRolledThisTurn){
                    player.hasRolledThisTurn = true;

                    let dice = cheat === null ? launchDice() : cheat;
                    //let dice = launchDice();
                    console.log(`Room ${code} : ${username} a fait un ${dice}`);
                    io.to(code).emit("diceLaunched", dice);

                    let board = getBoard(code);
                    board.dice = dice;
                    setBoard(code, board);

                    let movablePawns = getMovablePawns(player, dice, code);

                    if(movablePawns.length > 0)
                    {
                        io.to(socket.id).emit("movablePawns", movablePawns);
                        console.log(`Pions bougeables pour ${username} : ${movablePawns}`);
                    }
                    else
                    {
                        if(dice != 6){
                            moveToTheNextRound(code);
                            const updatedPlayers = getRoom(code);
                            setTimeout(() => io.to(code).emit("turnChanged", updatedPlayers), 2000);
                            console.log(`${username} n'a aucun pion bougeable, tour du prochain joueur`)
                        }
                        else{
                            player.hasRolledThisTurn = false;
                            setTimeout(() => io.to(code).emit("resetDice"), 2000); 
                            console.log(`${username} a fait un 6, il rejoue donc`);
                        }
                    }

                    break;
                }
                else{
                    //TENTATIVE DE TRICHE
                }
            }
        })

        socket.on("pawnSelected", (pawnToMove, code, username) => {
            //VERIFIER SI C BIEN LE TOUR ET BIEN UN PION DEPLACABLE
            let board = getBoard(code);
            const dice = board.dice;
            const players = getRoom(code);
            const player = players.find(p => p.isPlaying && p.username === username);
            if(!player){
                console.log(`PawnSelected par ${username} qui ne joue pas`);
                return;
            }

            const playerIndex = player.index;
            const bases = getBase(code);
            const playerBase = bases[playerIndex];

            const pawnsOfThePlayer = board.pawns[playerIndex];
            const startIndex = board.startIndex[playerIndex];
            const startCase = board.map[startIndex];

            const isStartCaseFree = (
                startCase === -1 ||
                !pawnsOfThePlayer.includes(startCase)
            );

            const isPawnInBase = playerBase.includes(pawnToMove);

            const boardLength = board.map.length;
            const exit = board.endIndex[playerIndex];
            const endCase = board.endCases[playerIndex];

            let movedToEndCase = false;
            let endCaseIndex = -1;

            // Sortie de base sur un 5
            if(dice === 5 && isStartCaseFree && isPawnInBase){
                bases[playerIndex] = playerBase.filter(p => p !== pawnToMove);
                setBase(code, bases);

                const newPlaceOnBoard = startIndex;
                const pawnOnNewPlace = board.map[newPlaceOnBoard];

                if(pawnOnNewPlace != -1){
                    backToBase(code, pawnOnNewPlace);
                    io.to(code).emit("backToBase", pawnOnNewPlace);
                    console.log(`${pawnOnNewPlace} retourne à la base`);
                }

                board.map[newPlaceOnBoard] = pawnToMove;
                setBoard(code, board);

                io.to(code).emit("movePawn", pawnToMove, newPlaceOnBoard);
                console.log(`${username}: Pion ${pawnToMove} sort de la base, à la case ${newPlaceOnBoard}`);
            }
            else{
                let oldPlaceOnBoard = board.map.indexOf(pawnToMove);

                // Pion déjà dans les cases de fin
                if(oldPlaceOnBoard === -1){
                    const indexInEnd = endCase.indexOf(pawnToMove);
                    if(indexInEnd === -1) return;

                    const targetIndex = indexInEnd + dice;
                    if(targetIndex >= endCase.length) return;
                    if(endCase[targetIndex] != -1) return;

                    endCase[indexInEnd] = -1;
                    endCase[targetIndex] = pawnToMove;
                    board.endCases[playerIndex] = endCase;
                    setBoard(code, board);

                    movedToEndCase = true;
                    endCaseIndex = targetIndex;
                }
                else{
                    const distanceToExit = exit - oldPlaceOnBoard;

                    // Entrée dans les cases de fin
                    if(distanceToExit >= 0 && dice > distanceToExit){
                        const stepsToFirstEndCase = distanceToExit + 1;
                        const indexInEndCases = dice - stepsToFirstEndCase; // 0..endCase.length-1

                        if(indexInEndCases < 0 || indexInEndCases >= endCase.length) return;
                        if(endCase[indexInEndCases] != -1) return;

                        board.map[oldPlaceOnBoard] = -1;

                        endCase[indexInEndCases] = pawnToMove;
                        board.endCases[playerIndex] = endCase;
                        setBoard(code, board);

                        movedToEndCase = true;
                        endCaseIndex = indexInEndCases;
                    }
                    else{
                        // Déplacement normal sur le plateau
                        const newPlaceOnBoard = (oldPlaceOnBoard + dice) % boardLength;
                        const pawnOnNewPlace = board.map[newPlaceOnBoard];

                        if(pawnOnNewPlace != -1){
                            backToBase(code, pawnOnNewPlace);
                            io.to(code).emit("backToBase", pawnOnNewPlace);
                            console.log(`${pawnOnNewPlace} retourne à la base`);
                        }

                        board.map[oldPlaceOnBoard] = -1;
                        board.map[newPlaceOnBoard] = pawnToMove;
                        setBoard(code, board);

                        io.to(code).emit("movePawn", pawnToMove, newPlaceOnBoard);
                        console.log(`${username}: Pion ${pawnToMove} déplacé à la case ${newPlaceOnBoard}`);
                    }
                }
            }

            // Event spécial pour les cases de fin
            if(movedToEndCase){
                io.to(code).emit("movePawnToEndCase", pawnToMove, playerIndex, endCaseIndex);
                console.log(`${username} : le pion ${pawnToMove} est arrivé sur les escaliers`)
            }

            //DETECTER FIN DE JEU
            let gameState = gameIsFinished(code);
            if(gameState.finished){
                io.to(code).emit("gameIsFinished", players[gameState.winner].username);
                console.log(`Game finie, ${username} a gagné`)
                return;
            }

            if(dice != 6){    
                moveToTheNextRound(code);
                const updatedPlayers = getRoom(code);
                io.to(code).emit("turnChanged", updatedPlayers);
                console.log(`${username} a joué, tour du prochain joueur`)
            }
            else{
                player.hasRolledThisTurn = false;
                io.to(code).emit("resetDice");
                console.log(`${username} a fait un 6, il rejoue donc`);
            }
        });

    })
}