import { useState, useEffect } from "react";

import Game from "./components/scenes/game/Game";
import Home from "./components/scenes/home/Home";
import Lobby from "./components/scenes/lobby/Lobby";
import JoinGame from "./components/scenes/joinGame/JoinGame";

import { io } from "socket.io-client";

const socket = io("http://localhost:4000");

export default function App() {
  const [screen, setScreen] = useState("home");
  const [username, setUsername] = useState("");
  const [roomNumber, setRoomNumber] = useState(0);
  const [players, setPlayers] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const displayError = (message) =>{
    setErrorMessage(message);

    setTimeout(() => {
      setErrorMessage("");
    }, 3000)
  }

  const joinGame = () => {
    if(username != "") socket.emit("joinRoom", username, roomNumber);
    else{

    }
  }

  const createGame = () => {
    if(username != "") socket.emit("createRoom", username);
  }

  const launchGame = () => {
    socket.emit("startGame", roomNumber);
  };

  useEffect(() => {
    socket.on("roomCreated", (roomNumberGenerated, playersInRoom) => {
      setRoomNumber(roomNumberGenerated);
      setScreen("lobby");
      setPlayers(playersInRoom);
    });

    socket.on("youCanJoinRoom", (code, playersInRoom) => {
      setRoomNumber(code);
      setScreen("lobby");
      setPlayers(playersInRoom);
    });

    socket.on("anUserHasJoinTheRoom", (playersInRoom) => {
      setPlayers(playersInRoom);
    });

    socket.on("allStartGame", (players) => {
      setPlayers(players);
      setScreen("game");
    });

    socket.on("userLeftRoom", (players, username) => {
      setErrorMessage(username + " a quitté la room");
      setPlayers(players);

      setTimeout(() => {
        setErrorMessage("");
      }, 3000)
    })

    socket.on("error", message => {
      displayError(message);
    })
  }, []);

  return (
    <>
      {
        screen === "home" && (
          <Home setScreen={setScreen} setUsername={setUsername} createGame={createGame} username={username} errorMessage={errorMessage}/>
        )
      }
      {
        screen === "game" && (
          <Game roomNumber={roomNumber} players={players} socket={socket} username={username} setPlayers={setPlayers}/>
        )
      }
      {
        screen === "lobby" && (
          <Lobby roomNumber={roomNumber} players={players} launchGame={launchGame} errorMessage={errorMessage}/>
        )
      }
      {
        screen === "joinGame" && (
          <JoinGame joinGame={joinGame} setRoomNumber={setRoomNumber} errorMessage={errorMessage}/>
        )
      }
    </>
  )
}