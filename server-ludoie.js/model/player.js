export class Player {
    #username;
    #playerNumber;
    #isPlaying = false;
    #hasRolledThisTurn = false;
    #color;
    #statistics;

    constructor(username, playerNumber, stats, color){
        this.#username = username;
        this.#playerNumber = playerNumber;
        this.#statistics = stats;
        this.#color = color;
    }

    isPlaying(){ return this.#isPlaying; }
    hasRolledThisTurn(){ return this.#hasRolledThisTurn; }
    
    turnEnd(){ this.#isPlaying = false; }
    turnStart(){ this.#isPlaying = true;  }

    resetRollThisTurn() { this.#hasRolledThisTurn = false;}
    markRolledThisTurn(){ this.#hasRolledThisTurn = true; }

    username(){ return this.#username; }

    getPlayerNumber(){ return this.#playerNumber; }
    getPlayerStatistics() { return this.#statistics; }
    getColor() { return this.#color; }

    static checkUsername(username){
        if(typeof username !== "string") return {valid: false, error: "Le nom d'utilisateur doit être un string"};
        if(username.length > 15) return {valid: false, error: "Le nom d'utilisateur est trop long"};
        if(username === "") return {valid: false, error: "Le nom d'utilisateur doit être rempli"};
        return {valid: true};
    }

    convertPlayerToObj(){
        return {
            username: this.#username,
            isPlaying: this.#isPlaying, 
            index: this.#playerNumber,
            hasRolledThisTurn: this.#hasRolledThisTurn
        }
    }
}