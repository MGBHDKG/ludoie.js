import Player from "./Player";

import { RedButton } from "../../styles/CommonStyleComponents";
import { LobbyStyleWrapper, LobbyStyle, LobbyPage, TextLobbyStyle } from "./LobbyStyle";

export default function Lobby({roomNumber, players, launchGame, errorMessage}){
    const color = ["#ffc607", "#57cbff", "#ff0100", "#29db00"];

    return (
        <LobbyPage>
            {errorMessage ? 
                <div id="errorMessage">
                    <img src="marque.png"/>
                    <p>{errorMessage}</p>
                </div> 
            : null}
            <LobbyStyleWrapper>
                <LobbyStyle>
                    <div>
                        <TextLobbyStyle>Room : <span id="code">{roomNumber}</span></TextLobbyStyle>
                        <TextLobbyStyle>En attente : {players.length} joueur(s)</TextLobbyStyle>
                    </div>
                    {players.map((player, index) => (
                        <Player key={index} player={player} color={color[index]} index={index+1}/>
                    ))}
                    <RedButton onClick={launchGame} id="launchGame" 
                        disabled={players.length < 2}
                    >
                        LANCER LA GAME</RedButton>
                </LobbyStyle>
            </LobbyStyleWrapper>
        </LobbyPage>
    )
}