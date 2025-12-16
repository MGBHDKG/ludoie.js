import { PlayerStyle } from "../styles/CommonStyleComponents";
import {TextLudoieStyle} from "../styles/CommonStyleComponents";

export default function Player({player, color, index}){
    return (
        <PlayerStyle style={{backgroundColor: color}}>
            <TextLudoieStyle>{player}</TextLudoieStyle>
            <TextLudoieStyle>{index}</TextLudoieStyle>
        </PlayerStyle>
    )
}