import Player from "./Player";

import { RedButton } from "../../styles/CommonStyleComponents";
import { LobbyStyleWrapper, LobbyStyle, LobbyPage, TextLobbyStyle } from "./LobbyStyle";

export default function Lobby({roomNumber, players, launchGame}){
    const color = ["#ffc607", "#57cbff", "#ff0100", "#29db00"];

    return (
        <LobbyPage>
            <LobbyStyleWrapper>
                <LobbyStyle>
                    <div>
                        <TextLobbyStyle>Room : <span id="code">{roomNumber}</span></TextLobbyStyle>
                        <TextLobbyStyle>En attente : {players.length}/4</TextLobbyStyle>
                    </div>
                    {players.map((player, index) => (
                        <Player key={index} player={player} color={color[index]} index={index+1}/>
                    ))}
                    <RedButton onClick={launchGame} id="launchGame" 
                        disabled={players.length !== 4}
                    >
                        LANCER LA GAME</RedButton>
                </LobbyStyle>
            </LobbyStyleWrapper>
        </LobbyPage>
    )
}