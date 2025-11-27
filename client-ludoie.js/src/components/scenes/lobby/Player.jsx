import { PlayerStyle , TextLobbyStyle} from "./LobbyStyle"

export default function Player({player, color, index}){
    return (
        <PlayerStyle style={{backgroundColor: color}}>
            <TextLobbyStyle>{player}</TextLobbyStyle>
            <TextLobbyStyle>{index}</TextLobbyStyle>
        </PlayerStyle>
    )
}