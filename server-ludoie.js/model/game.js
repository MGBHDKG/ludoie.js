import { BOARD_SIZE, INITIAL_PAWNS, START_INDEX, END_INDEX } from "../constant/gameParameters";
import { launchDice } from "../game/randomGeneration";

export class Game{
    #board = Array(BOARD_SIZE).fill(-1);
    #homes = [
        ['A','B','C','D'],
        ['E','F','G','H'],
        ['I','J','K','L'],
        ['M','N','O','P']
    ];
    #endCases = [
        [-1,-1,-1,-1],
        [-1,-1,-1,-1],
        [-1,-1,-1,-1],
        [-1,-1,-1,-1],
    ]
    #players;
    #turnIndex = 0;
    #dice;
    #numberOfTotalRound;
    #numberOfPlayers;

    constructor(players){
        this.#players = players;
    }

    #canLeaveBase(pawnsOfThePlayer, startCase){
        return startCase === -1 || !pawnsOfThePlayer.includes(startCase)
    }

    #pawnInEndCases(pawn){ return this.#board.indexOf(pawn) === -1 }

    #findPawnsNotInBase(playerNumber){
        let pawnsNotInBase = INITIAL_PAWNS[playerNumber];
        const home = this.#homes[playerNumber];
        for(const pawn of home){
            if(pawn != -1) pawnsNotInBase = pawnsNotInBase.filter(p => p != pawn);
        }
        return pawnsNotInBase;
    }

    launchDice(username, cheat){
        for(const player of this.#players){
            if(player.isPlaying() && player.username() === username && !player.hasRolledThisTurn()){
                player.markRolledThisTurn();
                let dice = cheat === null ? launchDice() : cheat;
                this.#dice = dice;
                return dice;
            }
        }
    }

    getMovablePawns(player, dice){
        let movablePawns = [];
        const playerNumber = player.getPlayerNumber();

        const startIndexOfThePlayer = START_INDEX[playerNumber];
        const startCase = this.#board[startIndexOfThePlayer];

        const pawnsOfThePlayer = INITIAL_PAWNS[playerNumber];

        if(dice === 5 && this.#canLeaveBase(pawnsOfThePlayer, startCase)){
            for(const pawn of this.#homes[playerNumber]){
                if(pawn != -1) movablePawns.push(pawn);
            }
        }

        const pawnsNotInBase = this.#findPawnsNotInBase(playerNumber);

        for(const pawn of pawnsNotInBase){
            if(this.#pawnInEndCases(pawn)){
                const endCase = this.#endCases[playerNumber];
                const indexOfThePlayerInEndCases = endCase.indexOf(pawn);
                const targetIndexInEndCases = indexOfThePlayerInEndCases + dice;

                if(targetIndexInEndCases < endCase.length && endCase[targetIndexInEndCases] === -1) movablePawns.push(pawn);
                continue;
            }

            const oldPlaceOnBoardIndex = this.#board.indexOf(pawn);

            const exit = END_INDEX[playerNumber];
            const distanceToExit = exit - oldPlaceOnBoardIndex;

            // Cas où on sort vers les cases finales
            if(distanceToExit >= 0 && dice > distanceToExit){
                const endCaseIndex = this.#endCases[playerNumber];
                const stepsToFirstEndCase = distanceToExit + 1;
                const indexInEndCases = dice - stepsToFirstEndCase;

                if(indexInEndCases < 0 || indexInEndCases >= endCaseIndex.length) continue;
                if(endCaseIndex[indexInEndCases] !== -1) continue;

                movablePawns.push(pawn);
                continue;
            }
            const newPlaceOnBoardIndex = (oldPlaceOnBoardIndex + dice) % BOARD_SIZE;
            const targetCase = this.#board[newPlaceOnBoardIndex];

            if(pawnsNotInBase.includes(targetCase)) continue;

            movablePawns.push(pawn);
        }

        return movablePawns;
    }

    backPawnToBase(pawnToEject){
        const pawnPosition = INITIAL_PAWNS.findIndex(pawns => pawns.includes(pawnToEject));
        const home = this.#homes[pawnPosition];
        home.push(pawnToEject);
    }
}