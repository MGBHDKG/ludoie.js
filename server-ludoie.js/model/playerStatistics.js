export class PlayerStatistics{
    //#maxNumberOfRoundWithoutPlaying = 0;
    #numberOfRoundWithoutPlaying = 0;
    #numberOfPawnEaten = 0;
    #numberOfTimeOfGettingEaten = 0;
    #numberOfSix = 0;
    #averageDice = 0;
    #averageMove = 0;
    #allDices = [];
    #allMoves = [];

    //incrementMaxNumberOfRoundWithoutPlaying(){ this.#maxNumberOfRoundWithoutPlaying++; }
    incrementNumberOfRoundWithoutPlaying(){ this.#numberOfRoundWithoutPlaying++; }
    incrementNumberOfPawnEaten(){ this.#numberOfPawnEaten++; }
    incrementNumberOfTimeOfGettingEaten(){ this.#numberOfTimeOfGettingEaten++ }
    incrementNumberOfSix(){ this.#numberOfSix++; }
    storeDice(dice){ this.#allDices.push(dice); }
    storeMove(move){ this.#allMoves.push(move); }

    returnAllStatistics(){
        const diceLength = this.#allDices.length;
        const moveLength = this.#allMoves.length;
        if(diceLength != 0)       this.#averageDice = this.#allDices.reduce((sum, b) => sum + b, 0) / diceLength;
        if(moveLength != 0) this.#averageMove = this.#allMoves.reduce((sum, b) => sum + b, 0) / moveLength;

        return {
            numberOfRoundWithoutPlaying: this.#numberOfRoundWithoutPlaying,
            numberOfPawnEaten: this.#numberOfPawnEaten,
            numberOfTimeOfGettingEaten: this.#numberOfTimeOfGettingEaten,
            numberOfSix: this.#numberOfSix,
            averageDice: this.#averageDice,
            averageMove: this.#averageMove
        }
    }
}