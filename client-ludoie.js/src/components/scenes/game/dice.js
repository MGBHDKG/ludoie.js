export function handleDiceWithKeyboard(players, socket, username){
    window.addEventListener("keydown", (event) => {
      if(event.key >= "1" && event.key <= "6"){
        for(const player of players){
          if(player.isPlaying && player.username === username){
            socket.emit("launchDice", Number(event.key));
          }
        }
      }
    })
}

export function handleDice(players, socket, username){
  for(const player of players){
    if(player.isPlaying && player.username === username){
      socket.emit("launchDice");
    }
  }
}