export class Player {
    #username;
    #id;
    #isPlaying = false;
    #hasRolledThisTurn = false;

    constructor(username, id){
        this.#username = username;
        this.#id = id;
    }

    isPlaying(){ return this.#isPlaying; }
    hasRolledThisTurn(){ return this.#hasRolledThisTurn; }
    
    turnEnd(){ this.#isPlaying = false; }
    turnStart(){ this.#isPlaying = true;  }

    resetRollThisTurn() { this.#hasRolledThisTurn = false;}
    markRolledThisTurn(){ this.#hasRolledThisTurn = true; }

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
            index: this.#id,
            hasRolledThisTurn: this.#hasRolledThisTurn
        }
    }
}