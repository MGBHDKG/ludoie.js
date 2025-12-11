import { PlayerStyle , TextLobbyStyle} from "../scenes/lobby/LobbyStyle"

export default function Player({player, color, index}){
    return (
        <PlayerStyle style={{backgroundColor: color}}>
            <TextLobbyStyle>{player}</TextLobbyStyle>
            <TextLobbyStyle>{index}</TextLobbyStyle>
        </PlayerStyle>
    )
}