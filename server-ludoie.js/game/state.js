let rooms = new Map();
let map = new Map();
let base = new Map();
let playersTurnIndex = new Map();

export function getRoom(code){ return rooms.get(code); }
export function setRoom(code, players) { rooms.set(code, players) }
export function roomExists(code) {return rooms.has(code); }

export function getBoard(code){ return map.get(code); }
export function setBoard(code, board) { map.set(code, board); }

export function getBase(code){ return base.get(code); }
export function setBase(code, newBase){ base.set(code, newBase); }

export function getTurnIndex(code){ return playersTurnIndex.get(code); }
export function setTurnIndex(code, index) { playersTurnIndex.set(code, index); }

export function setGame(code){
    let room = getRoom(code);
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

    setRoom(code, players);
    setTurnIndex(code, 0);
    setBoard(code, {
        map: [
            -1,
            -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
            -1,
            -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
            -1,
            -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
            -1,
            -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
        ],

        dice: 0,

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
        },
        pawns : [
            ['A','B','C','D'],
            ['E','F','G','H'],
            ['I','J','K','L'],
            ['M','N','O','P']
        ]
    });

    setBase(code, [
        ['A','B','C','D'],
        ['E','F','G','H'],
        ['I','J','K','L'],
        ['M','N','O','P']
    ]);

    return players;
}


export function nextTurn(code){
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