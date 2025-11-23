import { getBoard, getBase } from "./state.js";

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