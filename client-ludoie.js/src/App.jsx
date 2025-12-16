import { useState, useEffect } from "react";

import Game from "./components/scenes/game/Game";
import Home from "./components/scenes/home/Home";
import Lobby from "./components/scenes/lobby/Lobby";
import JoinGame from "./components/scenes/joinGame/JoinGame";
import EndGame from "./components/scenes/endGame/EndGame";

import { mockRankingAndStatistics, mockPlayers } from "./components/componentsForTests/constantsForTests";

import { io } from "socket.io-client";

const socket = import.meta.env.VITE_PROD === "true" ? io("https://api.wfun.games") : io("http://localhost:4000");

export default function App() {
  const [screen, setScreen] = useState("endGame");
  const [username, setUsername] = useState("");
  const [roomNumber, setRoomNumber] = useState(0);
  const [players, setPlayers] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [rankingAndStatistics, setRankingAndStatistics] = useState([]);

  const displayError = (message) =>{
    setErrorMessage(message);

    setTimeout(() => {
      setErrorMessage("");
    }, 3000)
  }

  const joinGame = () => {
    if(username != "") socket.emit("joinRoom", username, roomNumber);
    else displayError("Nom d'utilisateur vide");
  }

  const createGame = () => {
    if(username != "") socket.emit("createRoom", username);
    else displayError("Nom d'utilisateur vide");
  }

  const launchGame = () => {
    socket.emit("startGame");
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
    <div id="rotate-warning">
      <img src="rotation-mobile.png" alt="rotate-phone-icon" />
      <p>Veuillez tourner votre téléphone en mode portrait pour utiliser ce site.</p>
    </div>
    <div id="app-container">
      {
        screen === "home" && (
          <Home setScreen={setScreen} setUsername={setUsername} createGame={createGame} username={username} errorMessage={errorMessage} displayError={displayError} />
        )
      }
      {
        screen === "game" && (
          <Game roomNumber={roomNumber} players={players} socket={socket} username={username} setPlayers={setPlayers} setScreen={setScreen} setRankingAndStatistics={setRankingAndStatistics} />
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
      {
        screen === "endGame" && (
          <EndGame rankingAndStatistics={mockRankingAndStatistics} />
        )
      }
      </div>
    </>
  )
}