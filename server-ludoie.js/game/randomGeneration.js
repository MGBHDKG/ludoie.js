import { randomInt } from "crypto";

export function generateRoomNumber() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export function launchDice(){
    return randomInt(1,7);
}
