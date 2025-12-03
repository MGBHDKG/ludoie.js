export function handleDiceWithKeyboard(players, socket, username, roomNumber){
    window.addEventListener("keydown", (event) => {
      if(event.key >= "1" && event.key <= "6"){
        var isYourTurnToPlay = false;
        for(const player of players){
          if(player.isPlaying && player.username === username){
            isYourTurnToPlay = true;
            socket.emit("launchDice", username, roomNumber, Number(event.key));
          }
        }
        if(!isYourTurnToPlay){
          console.log("PAS TON TOUR BATARD !")
        }
      }
    })
}

export function handleDice(players, socket, username, roomNumber){
  var isYourTurnToPlay = false;
  for(const player of players){
    if(player.isPlaying && player.username === username){
      isYourTurnToPlay = true;
      socket.emit("launchDice", username, roomNumber, undefined);
    }
  }
  if(!isYourTurnToPlay){
    console.log("PAS TON TOUR BATARD !")
  }
}