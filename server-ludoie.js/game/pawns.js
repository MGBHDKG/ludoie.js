import { getBoard, getBase, setBase } from "./state.js";

export function getMovablePawns(player, dice, code){
    let board = getBoard(code);
    let bases = getBase(code);
    let movablePawns = [];
    const boardLength = board.map.length;

    const startIndex = board.startIndex[player.index];
    const startCase = board.map[startIndex];

    const pawnsOfThePlayer = board.pawns[player.index];

    const isStartCaseFree = (
        startCase === -1 ||
        !pawnsOfThePlayer.includes(startCase)
    );

    // Pions en base qui peuvent sortir sur un 5
    if(dice === 5 && isStartCaseFree){
        for(const pawn of bases[player.index]){
            if(pawn != -1) movablePawns.push(pawn);
        }
    }

    // Pions du joueur qui ne sont plus en base
    let pawnsNotInBase = [...board.pawns[player.index]];
    const base = bases[player.index];
    for(const pawn of base){
        if(pawn != -1) pawnsNotInBase = pawnsNotInBase.filter(p => p != pawn);
    }

    for(const pawn of pawnsNotInBase){
        let oldPlaceOnBoard = board.map.indexOf(pawn);

        // Déjà dans les cases finales
        if(oldPlaceOnBoard === -1){
            const endCase = board.endCases[player.index];
            const indexOfThePlayerInEndCases = endCase.indexOf(pawn);
            const targetIndexInEndCases = indexOfThePlayerInEndCases + dice;

            if(
                targetIndexInEndCases < endCase.length &&
                endCase[targetIndexInEndCases] === -1
            ){
                movablePawns.push(pawn);
            }
            continue;
        }

        // Encore sur le plateau
        const exit = board.endIndex[player.index];
        const distanceToExit = exit - oldPlaceOnBoard;

        // Cas où on sort vers les cases finales
        if(distanceToExit >= 0 && dice > distanceToExit){
            const endCase = board.endCases[player.index];
            const stepsToFirstEndCase = distanceToExit + 1;
            const indexInEndCases = dice - stepsToFirstEndCase; // 0..3

            if(indexInEndCases < 0 || indexInEndCases >= endCase.length) continue;
            if(endCase[indexInEndCases] !== -1) continue;

            movablePawns.push(pawn);
            continue;
        }

        // Cas où on reste sur le plateau
        let newPlaceOnBoard = (oldPlaceOnBoard + dice) % boardLength;
        const target = board.map[newPlaceOnBoard];

        // On ne peut pas tomber sur un de ses pions hors base
        if(pawnsNotInBase.includes(target)) continue;

        movablePawns.push(pawn);
    }

    return movablePawns;
}

export function backToBase(code, pawnToEject) {
    let board = getBoard(code);
    let bases = getBase(code);
    const pawnPosition = board.pawns.findIndex(pawns => pawns.includes(pawnToEject));
    const base = bases[pawnPosition];

    base.push(pawnToEject);

    setBase(code, bases);
}