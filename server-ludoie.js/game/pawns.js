import { getBoard, getBase, setBase } from "./state.js";

export function getMovablePawns(player, dice, code){
    let board = getBoard(code);
    let bases = getBase(code);
    let movablePawns = [];
    const boardLength =  board.map.length;

    const startIndex = board.startIndex[player.index];
    const startCase = board.map[startIndex];

    // ✅ vrais pions du joueur
    const pawnsOfThePlayer = board.pawns[player.index];

    // ✅ autoriser la sortie si vide OU pion adverse (donc pas un des tiens)
    const isStartCaseFree = (
        startCase === -1 ||
        !pawnsOfThePlayer.includes(startCase)
    );

    if(dice === 5 && isStartCaseFree){
        for(const pawn of bases[player.index]){
            if(pawn != -1) movablePawns.push(pawn);
        }
    }

    let pawnsNotInBase = [...board.pawns[player.index]];
    const base = bases[player.index];
    for(const pawn of base){
        if(pawn != -1) pawnsNotInBase = pawnsNotInBase.filter(p => p != pawn);
    }


    for(const pawn of pawnsNotInBase){
        let oldPlaceOnBoard = board.map.indexOf(pawn);
        if(oldPlaceOnBoard === -1) continue;//Peut etre dans la fin

        let newPlaceOnBoard = (oldPlaceOnBoard + dice) % boardLength;

        const target = board.map[newPlaceOnBoard];
        if (pawnsNotInBase.includes(target)) continue;

        const exit = board.endIndex[player.index];
        const distanceToExit = exit - oldPlaceOnBoard;

        if (distanceToExit >= 0 && distanceToExit <= dice) continue;

        //IL MANQUE DES CONDITIONS

        movablePawns.push(pawn);
    }

    return movablePawns
}
        //BUG QD PION ESSAYE DE SORTIR ET QUE QLQN AUTRE SUR LA SORTIE

export function backToBase(code, pawnToEject) {
    let board = getBoard(code);
    let bases = getBase(code);
    const pawnPosition = board.pawns.findIndex(pawns => pawns.includes(pawnToEject));
    const base = bases[pawnPosition];

    base.push(pawnToEject);

    setBase(code, bases);
}