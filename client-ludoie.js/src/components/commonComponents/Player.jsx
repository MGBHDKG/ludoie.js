import { PlayerStyle} from "../scenes/lobby/LobbyStyle"
import {TextLudoieStyle} from "../styles/CommonStyleComponents";

export default function Player({player, color, index}){
    return (
        <PlayerStyle style={{backgroundColor: color}}>
            <TextLudoieStyle>{player}</TextLudoieStyle>
            <TextLudoieStyle>{index}</TextLudoieStyle>
        </PlayerStyle>
    )
}