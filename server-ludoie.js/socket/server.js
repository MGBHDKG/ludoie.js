import {launchDice, generateSixDigitNumber} from "../game/randomGeneration.js";
import {getRoom, getBoard, getBase, getTurnIndex, roomExists, setBase, setBoard, setRoom, setGame, nextTurn} from "../game/state.js"
import { getMovablePawns, backToBase } from "../game/pawns.js";

export function socketHandlers(io){
    io.on("connection", (socket) => {
        console.log("✅ Un client est connecté : " + socket.id);

        socket.on("createRoom", (username) => {
            var room = undefined;

            while(room == undefined){
                room = generateSixDigitNumber();
                if(roomExists(room)) room = undefined
            }

            setRoom(room, [username]);
            socket.join(room);

            console.log(`Nouvelle room crée : ${room} par le joueur ${username} ayant pour id : ${socket.id}`);
            io.to(socket.id).emit("roomCreated", room, [username]);
        });

        socket.on("joinRoom", (username, code) => {
            let room = getRoom(code);
            if(!room) {
                //CODE ROOM PAS PRESENTE
                return;
            }

            room.push(username);
            setRoom(code, room);
            socket.join(code);

            io.to(code).emit("anUserHasJoinTheRoom", room);
            console.log(`${username} a rejoint la room ${code}`);
            io.to(socket.id).emit("youCanJoinRoom", code, room);
        })

        socket.on("startGame", (code) => {
            const players = setGame(code);
            io.to(code).emit("allStartGame", players);
        })

        socket.on("launchDice", (username, code) => { 
            let players = getRoom(code);

            for(const player of players){
                if(player.isPlaying && player.username === username && !player.hasRolledThisTurn){
                    player.hasRolledThisTurn = true;

                    let dice = launchDice();
                    console.log(`Room ${code} : ${username} a fait un ${dice}`);
                    io.to(code).emit("diceLaunched", dice);
                    let board = getBoard(code);
                    board.dice = dice;
                    setBoard(code, board);

                    let movablePawns = getMovablePawns(player, dice, code);

                    if(movablePawns.length > 0)
                    {
                        io.to(socket.id).emit("movablePawns", movablePawns);
                    }
                    else
                    {
                        nextTurn(code);
                        const updatedPlayers = getRoom(code);
                        io.to(code).emit("turnChanged", updatedPlayers);
                    }

                    break;
                }
                else{
                    //TENTATIVE DE TRICHE
                }
            }
        })

        socket.on("pawnSelected", (pawnToMove,code,username) => {
            //VERIFIER SI C BIEN LE TOUR ET BIEN UN PION DEPLACABLE
            let board = getBoard(code);
            const dice = board.dice;
            const players = getRoom(code);
            const player = players.find(p => p.isPlaying && p.username === username);
            if (!player) {
                console.log("Cheat / désync : pawnSelected par quelqu'un qui ne joue pas");
                return;
            }

            var newPlaceOnBoard = -1;
            const startIndex = board.startIndex[player.index];

            if(dice === 5 && board.map[startIndex] == -1){
                const playerIndex = player.index;   
                const bases = getBase(code);
                const playerBase = bases[playerIndex];
                bases[playerIndex] = playerBase.filter(p => p !== pawnToMove);
                setBase(code, bases);

                newPlaceOnBoard = board.startIndex[playerIndex];
            }
            else{
                let oldPlaceOnBoard = board.map.indexOf(pawnToMove);
                if(oldPlaceOnBoard == -1) return;

                newPlaceOnBoard = (oldPlaceOnBoard + dice) % board.map.length;

                board.map[oldPlaceOnBoard] = -1;
            }

            const pawnOnNewPlace = board.map[newPlaceOnBoard]
            if(pawnOnNewPlace != -1) {
                backToBase(code, pawnOnNewPlace);
                io.to(code).emit("backToBase", pawnOnNewPlace);
            }

            board.map[newPlaceOnBoard] = pawnToMove;
            setBoard(code, board);

            io.to(code).emit('movePawn', pawnToMove, newPlaceOnBoard);

            nextTurn(code);
            const updatedPlayers = getRoom(code);
            io.to(code).emit("turnChanged", updatedPlayers);
            //DETECTER FIN DE JEU
        })
    })
}