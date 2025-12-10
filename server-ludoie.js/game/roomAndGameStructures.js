let rooms = new Map();
let games = new Map();

export function getRoom(code){ return rooms.get(code); }
export function setRoom(code, players) { rooms.set(code, players) }
export function deleteRoom(code){ rooms.delete(code); }
export function roomExists(code) {return rooms.has(code); }

export function getGame(code){ return games.get(code); }
export function setGame(code, game){ return games.set(code, game); }
export function deleteGame(code) { games.delete(code); }