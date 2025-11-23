import { getBoard, getBase, setBase, setBoard } from "./state.js";

export function getMovablePawns(player, dice, code){
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

    console.log(pawnsNotInBase);

    for(const pawn of pawnsNotInBase){
        let oldPlaceOnBoard = board.map.indexOf(pawn);
        if(oldPlaceOnBoard == -1) continue;

        let newPlaceOnBoard = (oldPlaceOnBoard + dice) % board.map.length;

        const target = board.map[newPlaceOnBoard];
        if (pawnsNotInBase.includes(target)) continue;

        //IL MANQUE DES CONDITIONS

        movablePawns.push(pawn);
    }

    console.log(movablePawns)

    return movablePawns
}

export function backToBase(code, pawnToEject) {
    let board = getBoard(code);
    let bases = getBase(code);
    const pawnPosition = board.pawns.findIndex(pawns => pawns.includes(pawnToEject));
    const base = bases[pawnPosition];

    console.log(board, bases, pawnPosition, base);

    base.push(pawnToEject);

    setBase(code, bases);
}