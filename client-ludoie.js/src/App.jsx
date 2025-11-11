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

  const joinGame = () => {
    socket.emit("joinRoom", username, roomNumber);
  }

  const createGame = () => {
    socket.emit("createRoom", username);
  }

  const launchGame = () => {
    socket.emit("startGame", roomNumber);
  }

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

    socket.on("allStartGame", (room) => {
      console.log(room);
      setScreen("game");
    });
  }, []);

  return (
    <>
      {
        screen === "home" && (
          <Home setScreen={setScreen} setUsername={setUsername} createGame={createGame} />
        )
      }
      {
        screen === "game" && (
          <Game roomNumber={roomNumber} players={players} />
        )
      }
      {
        screen === "lobby" && (
          <Lobby roomNumber={roomNumber} players={players} launchGame={launchGame}/>
        )
      }
      {
        screen === "joinGame" && (
          <JoinGame joinGame={joinGame} setRoomNumber={setRoomNumber}/>
        )
      }
    </>
  )
}