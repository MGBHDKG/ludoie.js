import { BOARD_SIZE, INITIAL_PAWNS, START_INDEX, END_INDEX } from "../constant/gameParameters.js";
import { launchDice } from "../game/randomGeneration.js";

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
    #movablePawns;
    #playerWhoIsPlayingIndex = 0;
    #dice;
    #numberOfTotalRound = 0;
    #numberOfPlayers;

    constructor(players){
        this.#players = players;
        this.#numberOfPlayers = players.length;
    }

    #canPawnLeaveBase(pawnsOfThePlayer, startCase){
        return startCase === -1 || !pawnsOfThePlayer.includes(startCase)
    }

    #isPawnInStairs(pawn, playerNumber){ return this.#stairs[playerNumber].includes(pawn) }

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
            if(dice === 5 && this.#canPawnLeaveBase(pawnsOfThePlayer, startCase)){
                return {
                    from: "base",
                    to: "board",
                    newPlaceOnBoardIndex: startCaseIndex,
                    capturedPawn: startCase !== -1 ? startCase : null
                }
            }
            return null;
        }

        if(this.#isPawnInStairs(pawn, playerNumber)){
            const indexOfPawn = this.#stairs[playerNumber].indexOf(pawn);
            const stairsOfThePlayer = this.#stairs[playerNumber]
            const targetCaseIndex = indexOfPawn + dice;
            if(targetCaseIndex < 4 && stairsOfThePlayer[targetCaseIndex] === -1){
                return {
                    from : "end",
                    to : "end",
                    oldPlaceOnBoardIndex: indexOfPawn,
                    newPlaceOnBoardIndex : indexOfPawn + dice,
                    capturedPawn: null
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
                to : "end",
                oldPlaceOnBoardIndex : oldPlaceOnBoardIndex,
                newPlaceOnBoardIndex: 0,
                capturedPawn : null
            }
        }

        const pawnsNotInBase = this.#findPawnsNotInBase(playerNumber);
        const newPlaceOnBoardIndex = (oldPlaceOnBoardIndex + dice) % BOARD_SIZE;
        const targetCase = this.#board[newPlaceOnBoardIndex];

        if(pawnsNotInBase.includes(targetCase)) return null;

        return {
            from : "board",
            to : "board",
            oldPlaceOnBoardIndex : oldPlaceOnBoardIndex,
            newPlaceOnBoardIndex : newPlaceOnBoardIndex,
            capturedPawn : targetCase !== -1 ? targetCase : null
        }
    }

    #backPawnToBase(pawnToEject){
        const pawnPosition = INITIAL_PAWNS.findIndex(pawns => pawns.includes(pawnToEject));
        if(pawnPosition === -1) return;

        const home = this.#homes[pawnPosition];
        home.push(pawnToEject);

        this.#board = this.#board.map(p => p === pawnToEject ? -1 : p)
    }

    startGame(){
        this.#players[0].turnStart();
    }

    getDice(){ return this.#dice; }

    setMovablePawns(movablePawns){ this.#movablePawns = movablePawns; }

    getMovablePawns(){ return this.#movablePawns; }

    getPlayerWhoIsPlaying(){
        const playerWhoIsPlaying = this.#players.find(p => p.isPlaying()) ?? null;
        return playerWhoIsPlaying;
    }

    getPlayers(){ return this.#players; }

    moveToTheNextTurn(){
        const playerWhoIsPlayingIndex = this.#playerWhoIsPlayingIndex;

        this.#players[playerWhoIsPlayingIndex].turnEnd();
        this.#players[playerWhoIsPlayingIndex].resetRollThisTurn();

        let nextPlayerIndex = (playerWhoIsPlayingIndex + 1) % this.#numberOfPlayers;
        this.#players[nextPlayerIndex].turnStart();
        this.#players[nextPlayerIndex].resetRollThisTurn();

        this.#playerWhoIsPlayingIndex = nextPlayerIndex;

        if(nextPlayerIndex === 0) this.#numberOfTotalRound++;
    }

    computeRanking(){
        let playersRanking = [];

        for(let i = 0; i<this.#numberOfPlayers; i++){
            const score = this.#stairs[i].reduce((sum, v) => sum + (v !== -1 ? 1 : 0), 0);
            playersRanking.push({
                username: this.#players[i].username(),
                score: score,
                color: this.#players[i].getColor()
            })
        }
        playersRanking.sort((a,b) => a.score - b.score);
        return playersRanking;
    }

    isGameFinished(){
        for(let i=0; i<this.#numberOfPlayers; i++){
            const isEndCaseFull = !this.#stairs[i].includes(-1);
            if(isEndCaseFull){
                const playersRanking = this.computeRanking();
                return {finished: true, playersRanking: playersRanking,};
            }
        }

        return {finished: false}
    }

    launchDice(username, cheat){
        for(const player of this.#players){
            if(player.isPlaying() && player.username() === username && !player.hasRolledThisTurn()){
                player.markRolledThisTurn();
                let dice = cheat ?? launchDice();
                this.#dice = dice;
                return dice;
            }
        }
    }

    computeMovablePawns(player){
        let movablePawns = [];
        const playerNumber = player.getPlayerNumber();
        const dice = this.#dice;
        const pawnsOfThePlayer = INITIAL_PAWNS[playerNumber];
        for(const pawn of pawnsOfThePlayer){
            if(this.#getPawnMove(pawn, dice, playerNumber)) movablePawns.push(pawn);
        }

        return movablePawns;
    }

    movePawn(pawnToMove, playerNumber){
        const dice = this.#dice;
        const moveOfThePawn = this.#getPawnMove(pawnToMove, dice, playerNumber);
        if(!moveOfThePawn) return null;

        switch (moveOfThePawn.from)
        {
            case "end": {
                const stairsOfThePlayer = this.#stairs[playerNumber];
                stairsOfThePlayer[moveOfThePawn.newPlaceOnBoardIndex] = pawnToMove;
                stairsOfThePlayer[moveOfThePawn.oldPlaceOnBoardIndex] = -1;
                break;
            }
            case "base":{
                this.#homes[playerNumber] = this.#homes[playerNumber].filter(p => p !== pawnToMove);
                this.#board[moveOfThePawn.newPlaceOnBoardIndex] = pawnToMove;
                break;
            }
            case "board": {
                this.#board[moveOfThePawn.oldPlaceOnBoardIndex] = -1;
                if(moveOfThePawn.to === "board"){
                    this.#board[moveOfThePawn.newPlaceOnBoardIndex] = pawnToMove;
                }

                if(moveOfThePawn.to === "end"){
                    const stairsOfThePlayer = this.#stairs[playerNumber];
                    stairsOfThePlayer[0] = pawnToMove;
                }
                break;
            }
        }

        if(moveOfThePawn.capturedPawn !== null) this.#backPawnToBase(moveOfThePawn.capturedPawn);
        return moveOfThePawn;
    }
}