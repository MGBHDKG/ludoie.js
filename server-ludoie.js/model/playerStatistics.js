export class playerStatistics{
    #maxNumberOfRoundWithoutPlaying;
    #numberOfRoundWithoutPlaying;
    #numberOfPawnEaten;
    #numberOfTimeOfGettingEaten;
    #numberOfSix
    #averageDice;
    #averageMove;
    #allDices
    #allMoves

    addDice(dice){ this.#allDices.push(dice); }
    addMove(move){ this.#allMoves.push(move); }

    incrementmaxNumberOfRoundWithoutPlaying(){ this.#maxNumberOfRoundWithoutPlaying++; }
    incrementNumberOfRoundWithoutPlaying(){ this.#numberOfRoundWithoutPlaying++; }
    incrementNumberOfPawnEaten(){ this.#numberOfPawnEaten++; }
    incrementNumberOfTimeOfGettingEaten(){ this.#numberOfTimeOfGettingEaten++ }
    incrementNumberOfSix(){ this.#numberOfSix++; }
}