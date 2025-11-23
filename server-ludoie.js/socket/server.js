import {launchDice, generateSixDigitNumber} from "../game/randomGeneration.js";
import {getRoom, getBoard, getBase, getTurnIndex, roomExists, setBase, setBoard, setRoom, setTurnIndex, setGame} from "../game/state.js"

function nextTurn(code){
    let players = getRoom(code);
    let index = getTurnIndex(code);

    players[index].isPlaying = false;
    players[index].hasRolledThisTurn = false;

    let nextPlayer = (index + 1) % players.length;
    players[nextPlayer].isPlaying = true;
    players[nextPlayer].hasRolledThisTurn = false;

    setRoom(code, players);
    setTurnIndex(code, nextPlayer);
}

function getMovablePawns(player, dice, code){
    let board = getBoard(code);
    let bases = getBase(code);
    let movablePawns = [];

    const entryIndex = board.homeEntryIndex[player.index];

    if(dice === 5 && board.map[entryIndex] == -1){
        for(const pawn of bases[player.index]){
            if(pawn != -1) movablePawns.push(pawn);
        }
    }

    let pawnsNotInBase = board.pawns[player.index];

    for(const pawn of bases[player.index]){
        if(pawn != -1) pawnsNotInBase = pawnsNotInBase.filter(p => p != pawn);
    }

    for(const pawn of pawnsNotInBase){
        let oldIndex = board.map.indexOf(pawn);
        if(oldIndex == -1) continue;

        let newIndex = (oldIndex + dice) % board.map.length;

        const target = board.map[newIndex];
        if (pawnsNotInBase.includes(target)) continue;

        //IL MANQUE DES CONDITIONS

        movablePawns.push(pawn);
    }

    return movablePawns
}

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
                    if(movablePawns.length > 0) io.to(socket.id).emit("movablePawns", movablePawns);
                    else {
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

        socket.on("pawnSelected", (pawn,code,username) => {
            //VERIFIER SI C BIEN LE TOUR ET BIEN UN PION DEPLACABLE
            let board = getBoard(code);
            const dice = board.dice;
            const players = getRoom(code);

            const player = players.find(p => p.isPlaying && p.username === username);

            if (!player) {
                console.log("Cheat / désync : pawnSelected par quelqu'un qui ne joue pas");
                return;
            }

            const playerIndex = player.index;

            if(dice === 5){
                const bases = getBase(code);
                const playerBase = bases[playerIndex];
                bases[playerIndex] = playerBase.map(p => (p === pawn ? -1 : p));
                setBase(code, bases);

                const entryIndex = board.homeEntryIndex[playerIndex]
                board.map[entryIndex] = pawn;
                setBoard(code, board);

                io.to(code).emit('movePawn', pawn, entryIndex);

                nextTurn(code);
                const updatedPlayers = getRoom(code);
                io.to(code).emit("turnChanged", updatedPlayers);
                return;
            }

            let oldIndex = board.map.indexOf(pawn);
            if(oldIndex == -1) return;

            let newIndex = (oldIndex + dice) % board.map.length;

            io.to(code).emit('movePawn', pawn, newIndex);
            //DETECTER FIN DE JEU
        })
    })
}