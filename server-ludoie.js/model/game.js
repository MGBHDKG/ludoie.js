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
    #stairs = [
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

    #getPawnMove(pawn, dice, playerNumber){
        const home = this.#homes[playerNumber];
        const startCaseIndex = START_INDEX[playerNumber];
        const startCase = this.#board[startCaseIndex];
        const pawnsOfThePlayer = INITIAL_PAWNS[playerNumber];

        if(home.includes(pawn)){
            if(dice === 5 && this.#canLeaveBase(pawnsOfThePlayer, startCase)){
                return {
                    from: "base",
                    to: "board",
                    index: startCaseIndex,
                    capturedPawn: startCase !== -1 ? startCase : null
                }
            }
            return null;
        }

        if(this.#pawnInEndCases(pawn)){
            const indexOfPawn = this.#stairs[playerNumber].indexOf(pawn);
            const stairsOfThePlayer = this.#stairs[playerNumber]
            const targetCaseIndex = indexOfPawn + dice;
            if(targetCaseIndex < 4 && stairsOfThePlayer[targetCaseIndex] === -1){
                return {
                    from : "end",
                    to : "end",
                    index : indexOfPawn + dice
                }
            }
            return null;
        }

        const oldPlaceOnBoardIndex = this.#board.indexOf(pawn);
        const exit = END_INDEX[playerNumber];
        const distanceToExit = exit - oldPlaceOnBoardIndex;

        if(distanceToExit >= 0 && dice > distanceToExit){
            const stepsToFirstEndCase = distanceToExit + 1;
            if(dice != stepsToFirstEndCase) return null;

            const stairsOfThePlayer = this.#stairs[playerNumber];
            if(stairsOfThePlayer[0] !== -1) return null;
            
            return {
                from : "board",
                to : "end"
            }
        }

        const pawnsNotInBase = this.#findPawnsNotInBase(playerNumber);
        const newPlaceOnBoardIndex = (oldPlaceOnBoardIndex + dice) % BOARD_SIZE;
        const targetCase = this.#board[newPlaceOnBoardIndex];

        if(pawnsNotInBase.includes(targetCase)) return null;

        return {
            from : "board",
            to : "board",
            index : newPlaceOnBoardIndex,
            capturedPawn : targetCase === -1 ? targetCase : null
        }
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

    getMovablePawns(player){
        let movablePawns = [];
        const playerNumber = player.getPlayerNumber();
        const dice = this.#dice;
        const pawnsOfThePlayer = INITIAL_PAWNS[playerNumber];
        for(const pawn of pawnsOfThePlayer){
            if(this.#getPawnMove(pawn, dice, playerNumber)) movablePawns.push(pawn);
        }

        return movablePawns;
    }

    movePawn(pawnToMove){
        
    }

    backPawnToBase(pawnToEject){
        const pawnPosition = INITIAL_PAWNS.findIndex(pawns => pawns.includes(pawnToEject));
        const home = this.#homes[pawnPosition];
        home.push(pawnToEject);
    }
}